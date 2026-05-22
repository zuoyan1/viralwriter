import { useState } from 'react';
import { Header } from './components/Header';
import { CopyInputForm } from './components/CopyInputForm';
import { ReportDashboard } from './components/ReportDashboard';
import { BatchResultList } from './components/BatchResultList';
import { HistoryPanel } from './components/HistoryPanel';
import { evaluateCopy, polishContent, advancedPolishContent, type PolishOptions, type PolishResult, type PolishConfig, type PolishVersion } from './api/evaluation';
import type { EvaluationResult, VideoCopyInput, HistoryItem } from './types';

interface BatchResult {
  input: VideoCopyInput;
  result: EvaluationResult;
}

function App() {
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishResult, setPolishResult] = useState<PolishResult | null>(null);

  const handleSubmit = async (data: VideoCopyInput) => {
    setIsLoading(true);
    setIsBatchMode(false);
    try {
      const evaluationResult = await evaluateCopy(data);
      setResult(evaluationResult);
      setBatchResults([]);
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        content: data.content,
        platform: data.platform,
        category: data.category,
        score: evaluationResult.overallScore,
        createdAt: new Date().toISOString(),
        result: evaluationResult,
      };
      setHistory(prev => [newHistoryItem, ...prev]);
    } catch (error) {
      console.error('Evaluation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchSubmit = async (items: VideoCopyInput[]) => {
    setIsLoading(true);
    setIsBatchMode(true);
    try {
      const results: BatchResult[] = [];
      for (const item of items) {
        const evaluationResult = await evaluateCopy(item);
        results.push({ input: item, result: evaluationResult });
      }
      setBatchResults(results);
      if (results.length > 0) {
        setResult(results[0].result);
      }
    } catch (error) {
      console.error('Batch evaluation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewEvaluation = () => {
    setResult(null);
    setBatchResults([]);
    setIsBatchMode(false);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setResult(item.result);
    setBatchResults([]);
    setIsBatchMode(false);
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleSelectResult = (selectedResult: EvaluationResult) => {
    setResult(selectedResult);
  };

  const handlePolish = async (content: string, options: PolishOptions) => {
    setIsPolishing(true);
    try {
      const result = await polishContent(content, options);
      setPolishResult(result);
    } catch (error) {
      console.error('Polish error:', error);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleAdvancedPolish = async (content: string, config: PolishConfig) => {
    setIsPolishing(true);
    try {
      const result = await advancedPolishContent(content, config);
      return result;
    } catch (error) {
      console.error('Advanced Polish error:', error);
      throw error;
    } finally {
      setIsPolishing(false);
    }
  };

  const handleApplyPolish = (polishedContent: string) => {
    setPolishResult(null);
    setResult(null);
    setBatchResults([]);
  };

  const handleClosePolish = () => {
    setPolishResult(null);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">开始评估</h2>
                <p className="text-sm text-gray-500">输入您的短视频文案，获取智能评估报告</p>
              </div>

              <CopyInputForm
                onSubmit={handleSubmit}
                onBatchSubmit={handleBatchSubmit}
                onPolish={handlePolish}
                onAdvancedPolish={handleAdvancedPolish}
                isLoading={isLoading}
                isPolishing={isPolishing}
                onApplyPolish={handleApplyPolish}
                onClosePolish={handleClosePolish}
                polishResult={polishResult}
              />

              {(result || batchResults.length > 0) && (
                <button
                  onClick={handleNewEvaluation}
                  className="w-full mt-4 py-3 border-2 border-primary-500 text-primary-600 font-medium rounded-xl hover:bg-primary-50 transition-all"
                >
                  + 新的评估
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {batchResults.length > 0 ? (
              <BatchResultList results={batchResults} onSelectResult={handleSelectResult} />
            ) : result ? (
              <ReportDashboard result={result} />
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📝</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">欢迎使用 ViralWriter</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  输入您的短视频文案，我们将为您提供全面的智能评估报告，包括互动潜力、情感共鸣、结构有效性、关键词优化和平台适配等维度的分析。
                </p>
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-primary-50 rounded-xl">
                    <span className="text-2xl">⚡</span>
                    <p className="text-sm text-gray-600 mt-2">互动分析</p>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-xl">
                    <span className="text-2xl">💝</span>
                    <p className="text-sm text-gray-600 mt-2">情感分析</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <span className="text-2xl">🏗️</span>
                    <p className="text-sm text-gray-600 mt-2">结构分析</p>
                  </div>
                  <div className="p-4 bg-cyan-50 rounded-xl">
                    <span className="text-2xl">📊</span>
                    <p className="text-sm text-gray-600 mt-2">行业对比</p>
                  </div>
                </div>
              </div>
            )}

            <HistoryPanel
              history={history}
              onSelect={handleSelectHistory}
              onDelete={handleDeleteHistory}
            />
          </div>
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="font-semibold text-gray-900">ViralWriter</span>
            </div>
            <p className="text-sm text-gray-500 mt-2 md:mt-0">
              短视频文案智能评估系统 · AI驱动 · 数据支撑
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;