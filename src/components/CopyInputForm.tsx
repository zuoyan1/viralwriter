import { useState } from 'react';
import { platforms, categories, targetAudiences, sampleCopy } from '../data/mockData';
import type { VideoCopyInput } from '../types';
import type { PolishConfig, PolishVersion } from '../api/evaluation';

interface Props {
  onSubmit: (data: VideoCopyInput) => void;
  onBatchSubmit: (items: VideoCopyInput[]) => void;
  onAdvancedPolish: (content: string, config: PolishConfig) => Promise<PolishVersion>;
  isLoading: boolean;
  isPolishing: boolean;
  onClosePolish: () => void;
  polishVersions: PolishVersion[];
  onRollbackVersion: (version: PolishVersion) => void;
}

const styleOptions = [
  { value: 'casual', label: '口语化', icon: '💬', desc: '通俗易懂，像和朋友聊天' },
  { value: 'funny', label: '搞笑娱乐', icon: '😂', desc: '加入网络热梗和夸张表达' },
  { value: 'professional', label: '专业严谨', icon: '📚', desc: '逻辑清晰，适合知识科普' },
  { value: 'emotional', label: '情感共鸣', icon: '❤️', desc: '引发观众情感共鸣' },
];

const intensityOptions = [
  { value: 'light', label: '轻度', color: 'bg-green-500', desc: '只修正语法错误' },
  { value: 'medium', label: '中度', color: 'bg-yellow-500', desc: '优化表达，增加互动' },
  { value: 'deep', label: '深度', color: 'bg-red-500', desc: '全面重构，优化结构' },
];

export function CopyInputForm({
  onSubmit,
  onBatchSubmit,
  onAdvancedPolish,
  isLoading,
  isPolishing,
  onClosePolish,
  polishVersions,
  onRollbackVersion,
}: Props) {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('douyin');
  const [category, setCategory] = useState('entertainment');
  const [targetAudience, setTargetAudience] = useState('all');
  const [mode, setMode] = useState<'single' | 'batch'>('single');

  const [polishIntensity, setPolishIntensity] = useState<'light' | 'medium' | 'deep'>('medium');
  const [polishStyle, setPolishStyle] = useState<'casual' | 'funny' | 'professional' | 'emotional'>('casual');
  const [preserveMeaning, setPreserveMeaning] = useState(true);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentPolish, setCurrentPolish] = useState<PolishVersion | null>(null);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);

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

  const handlePolish = async () => {
    if (!content.trim()) return;

    const config: PolishConfig = {
      style: polishStyle,
      platform,
      category,
      intensity: polishIntensity,
      preserveMeaning,
      customPrompt: customPrompt || undefined,
    };

    try {
      const result = await onAdvancedPolish(content, config);
      setCurrentPolish(result);
      setSelectedVersionIndex(0);
    } catch (error) {
      console.error('Polish failed:', error);
    }
  };

  const handleApplyPolish = () => {
    if (currentPolish) {
      setContent(currentPolish.content);
      setCurrentPolish(null);
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

  const getPlatformName = () => {
    const p = platforms.find(p => p.id === platform);
    return p ? p.name : '抖音';
  };

  const currentVersion = currentPolish || (polishVersions.length > 0 ? polishVersions[selectedVersionIndex] : null);

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
          disabled={isLoading || isPolishing}
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
            disabled={isLoading || isPolishing}
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
            disabled={isLoading || isPolishing}
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
            disabled={isLoading || isPolishing}
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
            disabled={isLoading || isPolishing}
          >
            {targetAudiences.map(a => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentPolish && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">润色结果</h4>
            <button
              onClick={() => setCurrentPolish(null)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              关闭
            </button>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-4">
            <p className="text-gray-800 whitespace-pre-wrap">{currentPolish.content}</p>
          </div>
          {currentPolish.changes.length > 0 && (
            <div className="mt-3">
              <h5 className="text-xs font-medium text-gray-600 mb-2">修改说明：</h5>
              <ul className="space-y-1">
                {currentPolish.changes.map((change, idx) => (
                  <li key={idx} className="text-xs text-gray-600 flex items-start">
                    <span className={`mr-2 ${
                      change.type === 'add' ? 'text-green-500' :
                      change.type === 'replace' ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {change.type === 'add' ? '➕' : change.type === 'replace' ? '✏️' : '➖'}
                    </span>
                    <span>{change.reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleApplyPolish}
              className="flex-1 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              应用此版本
            </button>
          </div>
        </div>
      )}

      {polishVersions.length > 0 && !currentPolish && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">历史版本</h4>
            <span className="text-xs text-gray-500">{polishVersions.length}/3</span>
          </div>
          <div className="flex gap-2 mb-3">
            {polishVersions.map((v, idx) => (
              <button
                key={v.id}
                onClick={() => setSelectedVersionIndex(idx)}
                className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                  selectedVersionIndex === idx
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                V{idx + 1}
              </button>
            ))}
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-4">
              {polishVersions[selectedVersionIndex]?.content}
            </p>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                setContent(polishVersions[selectedVersionIndex].content);
                setCurrentPolish(null);
              }}
              className="flex-1 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              应用此版本
            </button>
            <button
              onClick={() => onRollbackVersion(polishVersions[selectedVersionIndex])}
              className="px-4 py-2 bg-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              删除
            </button>
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-3"
        >
          <span>💡 专业级文案润色</span>
          <span className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {showAdvanced && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                润色风格
              </label>
              <div className="grid grid-cols-2 gap-2">
                {styleOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setPolishStyle(option.value as typeof polishStyle)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      polishStyle === option.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={isPolishing}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{option.icon}</span>
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                润色强度
              </label>
              <div className="flex items-center space-x-2">
                {intensityOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setPolishIntensity(option.value as typeof polishIntensity)}
                    className={`flex-1 py-3 px-2 rounded-lg border-2 transition-all flex flex-col items-center ${
                      polishIntensity === option.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={isPolishing}
                  >
                    <span className={`w-3 h-3 rounded-full ${option.color} mb-1`}></span>
                    <span className="text-sm font-medium text-gray-900">{option.label}</span>
                    <span className="text-xs text-gray-500">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">智能原意保留</p>
                <p className="text-xs text-gray-500">确保核心信息不丢失</p>
              </div>
              <button
                onClick={() => setPreserveMeaning(!preserveMeaning)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  preserveMeaning ? 'bg-primary-500' : 'bg-gray-300'
                }`}
                disabled={isPolishing}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  preserveMeaning ? 'left-7' : 'left-1'
                }`}></span>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                自定义润色要求
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="例如：增加更多感叹号，多用网络流行语..."
                className="w-full h-20 px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                disabled={isPolishing}
              />
            </div>

            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-blue-700">
                <strong>提示词预览：</strong>
                <br />
                平台：{getPlatformName()}，风格：{styleOptions.find(s => s.value === polishStyle)?.label}，
                强度：{intensityOptions.find(i => i.value === polishIntensity)?.label}
                {preserveMeaning ? '，严格保留原意' : '，可适当发挥'}
                {customPrompt && `，额外要求：${customPrompt}`}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={isLoading || !content.trim() || isPolishing}
          className="flex-1 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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

        {showAdvanced && (
          <button
            onClick={handlePolish}
            disabled={isLoading || !content.trim() || isPolishing}
            className="flex-1 py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-medium rounded-xl hover:from-accent-600 hover:to-accent-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isPolishing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                润色中...
              </span>
            ) : (
              '✨ 一键润色'
            )}
          </button>
        )}
      </div>
    </div>
  );
}