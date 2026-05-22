import { useState } from 'react';
import { platforms, categories, targetAudiences, sampleCopy } from '../data/mockData';
import type { VideoCopyInput } from '../types';

interface Props {
  onSubmit: (data: VideoCopyInput) => void;
  onBatchSubmit: (items: VideoCopyInput[]) => void;
  isLoading: boolean;
}

export function CopyInputForm({ 
  onSubmit, 
  onBatchSubmit, 
  isLoading
}: Props) {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('douyin');
  const [category, setCategory] = useState('entertainment');
  const [targetAudience, setTargetAudience] = useState('all');
  const [mode, setMode] = useState<'single' | 'batch'>('single');

  const handleSubmit = () => {
    if (!content.trim()) return;
    
    if (mode === 'batch') {
      const lines = content.split('\n').filter(line => line.trim());
      if (lines.length === 0) return;
      const items: VideoCopyInput[] = lines.map(line => ({
        content: line.trim(),
        platform,
        category,
        targetAudience
      }));
      onBatchSubmit(items);
    } else {
      onSubmit({ content, platform, category, targetAudience });
    }
  };

  const handleUseSample = () => {
    if (mode === 'batch') {
      setContent(`今天给大家分享一个超级实用的小技巧\n姐妹们挖到宝了，这个真的绝绝子\n没想到最后结局竟然是这样的\n家人们一定要试试这个方法`);
    } else {
      setContent(sampleCopy);
    }
  };

  const getLineCount = () => {
    return content.split('\n').filter(line => line.trim()).length;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">评估模式</span>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setMode('single')}
            className={`px-4 py-1.5 text-sm rounded-md transition-all ${
              mode === 'single'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            单条评估
          </button>
          <button
            onClick={() => setMode('batch')}
            className={`px-4 py-1.5 text-sm rounded-md transition-all ${
              mode === 'batch'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            批量评估
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          文案内容 <span className="text-red-500">*</span>
          {mode === 'batch' && (
            <span className="text-gray-400 font-normal ml-2">(每行一条文案)</span>
          )}
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={mode === 'batch' 
            ? '请每行输入一条文案...\n例如：\n今天给大家分享一个小技巧\n姐妹们挖到宝了\n没想到结局竟然是这样' 
            : '请输入您的短视频文案内容...'}
          className="w-full h-48 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all"
          disabled={isLoading}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">
            {mode === 'batch' 
              ? `${getLineCount()} 条文案` 
              : `${content.length} 字`}
          </span>
          <button
            type="button"
            onClick={handleUseSample}
            className="text-xs text-primary-600 hover:text-primary-700 hover:underline"
            disabled={isLoading}
          >
            使用示例文案
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            目标平台
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
            disabled={isLoading}
          >
            {platforms.map(p => (
              <option key={p.id} value={p.id}>
                {p.icon} {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            内容分类
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
            disabled={isLoading}
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            目标受众
          </label>
          <select
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
            disabled={isLoading}
          >
            {targetAudiences.map(a => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || !content.trim()}
        className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            智能评估中...
          </span>
        ) : (
          '开始评估'
        )}
      </button>
    </div>
  );
}
