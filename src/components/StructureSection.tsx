import { MetricBar } from './MetricBar';
import type { StructureScore } from '../types';

interface Props {
  data: StructureScore;
}

export function StructureSection({ data }: Props) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">🏗️</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">结构有效性</h3>
          <p className="text-sm text-gray-500">评估文案的叙事结构与节奏</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <span className="text-3xl">🎬</span>
          <p className="text-sm text-gray-600 mt-2">开头</p>
          <p className="text-xl font-bold text-purple-600">{Math.round(data.metrics.opening)}%</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <span className="text-3xl">📝</span>
          <p className="text-sm text-gray-600 mt-2">正文</p>
          <p className="text-xl font-bold text-purple-600">{Math.round(data.metrics.body)}%</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <span className="text-3xl">🎯</span>
          <p className="text-sm text-gray-600 mt-2">结尾</p>
          <p className="text-xl font-bold text-purple-600">{Math.round(data.metrics.closing)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MetricBar label="节奏把控" value={data.metrics.pacing} />
        <MetricBar label="长度适配" value={data.metrics.length} />
      </div>
    </div>
  );
}
