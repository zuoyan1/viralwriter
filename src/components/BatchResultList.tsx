import { useState } from 'react';
import type { EvaluationResult, VideoCopyInput } from '../types';
import { ReportDashboard } from './ReportDashboard';

interface BatchResult {
  input: VideoCopyInput;
  result: EvaluationResult;
}

interface Props {
  results: BatchResult[];
  onSelectResult: (result: EvaluationResult) => void;
}

export function BatchResultList({ results, onSelectResult }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const avgScore = Math.round(
    results.reduce((sum, r) => sum + r.result.overallScore, 0) / results.length
  );

  const highScore = Math.max(...results.map(r => r.result.overallScore));
  const lowScore = Math.min(...results.map(r => r.result.overallScore));

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好';
    if (score >= 60) return '中等';
    if (score >= 40) return '较差';
    return '极差';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">批量评估结果</h2>
          <span className="px-3 py-1 bg-primary-100 text-primary-600 text-sm rounded-full">
            {results.length} 条文案
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary-600">{avgScore}</p>
            <p className="text-sm text-gray-500">平均分</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{highScore}</p>
            <p className="text-sm text-gray-500">最高分</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{lowScore}</p>
            <p className="text-sm text-gray-500">最低分</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">文案列表</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {results.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedIndex(index);
                  onSelectResult(item.result);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedIndex === index
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 line-clamp-2">
                      {item.input.content}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full shrink-0 ${getScoreColor(item.result.overallScore)}`}
                  >
                    {item.result.overallScore}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    第 {index + 1} 条
                  </span>
                  <span className="text-xs text-gray-500">
                    {getScoreLabel(item.result.overallScore)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <ReportDashboard result={results[selectedIndex].result} />
        </div>
      </div>
    </div>
  );
}
