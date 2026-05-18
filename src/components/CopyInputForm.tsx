import { useState } from 'react';
import { platforms, categories, targetAudiences, sampleCopy } from '../data/mockData';
import type { VideoCopyInput } from '../types';

interface Props {
  onSubmit: (data: VideoCopyInput) => void;
  isLoading: boolean;
}

export function CopyInputForm({ onSubmit, isLoading }: Props) {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('douyin');
  const [category, setCategory] = useState('entertainment');
  const [targetAudience, setTargetAudience] = useState('all');

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit({ content, platform, category, targetAudience });
  };

  const handleUseSample = () => {
    setContent(sampleCopy);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          文案内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="请输入您的短视频文案内容..."
          className="w-full h-48 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all"
          disabled={isLoading}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">{content.length} 字</span>
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
        disabled={!content.trim() || isLoading}
        className="w-full py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-accent-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>评估中...</span>
          </>
        ) : (
          <>
            <span>🧠</span>
            <span>智能评估</span>
          </>
        )}
      </button>
    </div>
  );
}
