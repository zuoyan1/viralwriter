import { useState } from 'react';
import { platforms, categories, targetAudiences, sampleCopy } from '../data/mockData';
import type { VideoCopyInput } from '../types';
import type { PolishOptions, PolishResult, PolishConfig, PolishVersion } from '../api/evaluation';

interface Props {
  onSubmit: (data: VideoCopyInput) => void;
  onBatchSubmit: (items: VideoCopyInput[]) => void;
  onPolish: (content: string, options: PolishOptions) => Promise<PolishResult>;
  onAdvancedPolish: (content: string, config: PolishConfig) => Promise<PolishVersion>;
  isLoading: boolean;
  isPolishing: boolean;
  onApplyPolish: (polishedContent: string) => void;
  onClosePolish: () => void;
  polishResult: PolishResult | null;
}

export function CopyInputForm({ 
  onSubmit, 
  onBatchSubmit, 
  onPolish, 
  onAdvancedPolish,
  isLoading, 
  isPolishing,
  onApplyPolish,
  onClosePolish,
  polishResult 
}: Props) {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('douyin');
  const [category, setCategory] = useState('entertainment');
  const [targetAudience, setTargetAudience] = useState('all');
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  
  const [polishStyle, setPolishStyle] = useState<'casual' | 'funny' | 'professional' | 'emotional'>('casual');
  const [polishIntensity, setPolishIntensity] = useState<'light' | 'medium' | 'deep'>('medium');
  const [preserveMeaning, setPreserveMeaning] = useState(true);
  const [customPrompt, setCustomPrompt] = useState('');
  const [polishOptions, setPolishOptions] = useState({
    optimizeHook: true,
    optimizeEnding: true,
    addInteraction: true,
    replaceFormal: true,
  });
  const [showPolishOptions, setShowPolishOptions] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [polishVersions, setPolishVersions] = useState<PolishVersion[]>([]);
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

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowPolishOptions(!showPolishOptions)}
          className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
        >
          <span className="font-medium text-gray-700">✨ 润色选项</span>
          <span className={`transition-transform ${showPolishOptions ? 'rotate-180' : ''}`}>▼</span>
        </button>
        
        {showPolishOptions && (
          <div className="p-4 space-y-4 bg-white">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">润色风格</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'casual', label: '🗣️ 口语化', desc: '通俗易懂，有亲和力' },
                  { value: 'funny', label: '😂 搞笑娱乐', desc: '网络热梗，趣味性强' },
                  { value: 'professional', label: '📚 专业严谨', desc: '逻辑清晰，知识性强' },
                  { value: 'emotional', label: '💖 情感共鸣', desc: '情感表达，引发共鸣' },
                ].map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setPolishStyle(style.value as typeof polishStyle)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      polishStyle === style.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{style.label}</div>
                    <div className="text-xs text-gray-500">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">润色强度</label>
              <div className="flex items-center space-x-2">
                {[
                  { value: 'light', label: '轻度', color: 'bg-green-500', desc: '仅修正语法' },
                  { value: 'medium', label: '中度', color: 'bg-yellow-500', desc: '优化表达' },
                  { value: 'deep', label: '深度', color: 'bg-red-500', desc: '全面重构' },
                ].map((intensity) => (
                  <button
                    key={intensity.value}
                    onClick={() => setPolishIntensity(intensity.value as typeof polishIntensity)}
                    className={`flex-1 py-3 px-2 rounded-lg border-2 transition-all flex flex-col items-center ${
                      polishIntensity === intensity.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${intensity.color} mb-1`}></span>
                    <span className="text-sm font-medium text-gray-900">{intensity.label}</span>
                    <span className="text-xs text-gray-500">{intensity.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-700">智能原意保留</div>
                <div className="text-xs text-gray-500">确保核心信息不丢失</div>
              </div>
              <button
                onClick={() => setPreserveMeaning(!preserveMeaning)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  preserveMeaning ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    preserveMeaning ? 'translate-x-7' : 'translate-x-1'
                  }`}
                ></span>
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-sm"
              >
                <span className="font-medium text-gray-600">⚙️ 高级选项</span>
                <span className={`transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`}>▼</span>
              </button>
              
              {showAdvancedOptions && (
                <div className="p-3 space-y-3 bg-white">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">自定义提示词</label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="输入额外的润色要求..."
                      className="w-full h-20 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
                    />
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs font-medium text-blue-800 mb-1">生成的提示词预览</div>
                    <div className="text-xs text-blue-600 line-clamp-3">
                      你是专业短视频文案润色师，风格：{polishStyle === 'casual' ? '口语化' : polishStyle === 'funny' ? '搞笑娱乐' : polishStyle === 'professional' ? '专业严谨' : '情感共鸣'}，强度：{polishIntensity === 'light' ? '轻度' : polishIntensity === 'medium' ? '中度' : '深度'}，{preserveMeaning ? '严格保留原意' : '可适当发挥'}{customPrompt ? '，额外要求：' + customPrompt : ''}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'optimizeHook', label: '优化开头钩子' },
                { key: 'optimizeEnding', label: '优化结尾引导' },
                { key: 'addInteraction', label: '增加互动元素' },
                { key: 'replaceFormal', label: '替换书面语' },
              ].map((opt) => (
                <label
                  key={opt.key}
                  className="flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={polishOptions[opt.key as keyof typeof polishOptions]}
                    onChange={(e) =>
                      setPolishOptions((prev) => ({
                        ...prev,
                        [opt.key]: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={async () => {
            const config: PolishConfig = {
              style: polishStyle,
              platform,
              category,
              intensity: polishIntensity,
              preserveMeaning,
              customPrompt: customPrompt || undefined,
            };
            const version = await onAdvancedPolish(content, config);
            setPolishVersions(prev => {
              const newVersions = [version, ...prev];
              return newVersions.slice(0, 3);
            });
            setSelectedVersionIndex(0);
          }}
          disabled={!content.trim() || isLoading || isPolishing}
          className="flex-1 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-accent-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isPolishing ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>润色中...</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>一键润色</span>
            </>
          )}
        </button>

        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isLoading || isPolishing}
          className="flex-1 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-accent-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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

      {polishVersions.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span>✨</span>
              <span>润色结果对比</span>
            </h3>
            <button
              onClick={() => {
                setPolishVersions([]);
                onClosePolish();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
            >
              ✕
            </button>
          </div>
          
          {polishVersions.length > 1 && (
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="text-xs text-gray-500">历史版本:</span>
              {polishVersions.map((version, index) => (
                <button
                  key={version.id}
                  onClick={() => setSelectedVersionIndex(index)}
                  className={`px-3 py-1 text-xs rounded-full transition-all ${
                    selectedVersionIndex === index
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  V{polishVersions.length - index}
                </button>
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                原文案
              </div>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {content || '(空)'}
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-primary-300">
              <div className="text-sm font-medium text-green-600 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                润色后 (V{polishVersions.length - selectedVersionIndex})
              </div>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {polishVersions[selectedVersionIndex]?.content}
              </p>
            </div>
          </div>
          
          {polishVersions[selectedVersionIndex]?.changes.length > 0 && (
            <div className="mb-4 p-4 bg-white rounded-lg border border-gray-100">
              <div className="text-sm font-medium text-gray-700 mb-3">修改说明</div>
              <div className="space-y-2">
                {polishVersions[selectedVersionIndex].changes.map((change, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      change.type === 'add'
                        ? 'bg-green-50'
                        : change.type === 'replace'
                        ? 'bg-yellow-50'
                        : 'bg-red-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        change.type === 'add'
                          ? 'bg-green-200 text-green-700'
                          : change.type === 'replace'
                          ? 'bg-yellow-200 text-yellow-700'
                          : 'bg-red-200 text-red-700'
                      }`}>
                        {change.type === 'add' ? '添加' : change.type === 'replace' ? '替换' : '删除'}
                      </span>
                      <span className="text-xs text-gray-500">{change.reason}</span>
                    </div>
                    <div className="text-xs">
                      {change.original && (
                        <span className="text-gray-400 line-through">{change.original}</span>
                      )}
                      {change.original && change.new && <span className="mx-2 text-gray-300">→</span>}
                      {change.new && (
                        <span className="text-green-600 font-medium">{change.new}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={async () => {
                const config: PolishConfig = {
                  style: polishStyle,
                  platform,
                  category,
                  intensity: polishIntensity,
                  preserveMeaning,
                  customPrompt: customPrompt || undefined,
                };
                const version = await onAdvancedPolish(content, config);
                setPolishVersions(prev => {
                  const newVersions = [version, ...prev];
                  return newVersions.slice(0, 3);
                });
                setSelectedVersionIndex(0);
              }}
              className="flex-1 py-2 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all text-sm"
            >
              🔄 重新润色
            </button>
            <button
              onClick={() => {
                const currentVersion = polishVersions[selectedVersionIndex];
                if (currentVersion) {
                  setContent(currentVersion.content);
                  onApplyPolish(currentVersion.content);
                  setPolishVersions([]);
                }
              }}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all text-sm"
            >
              ✅ 应用润色
            </button>
            <button
              onClick={() => {
                const currentVersion = polishVersions[selectedVersionIndex];
                if (currentVersion) {
                  navigator.clipboard.writeText(currentVersion.content);
                  alert('已复制到剪贴板！');
                }
              }}
              className="flex-1 py-2 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all text-sm"
            >
              📋 复制结果
            </button>
          </div>
          
          {polishVersions.length > 1 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  const currentVersion = polishVersions[selectedVersionIndex];
                  if (currentVersion) {
                    setContent(currentVersion.content);
                    setPolishVersions([]);
                    onApplyPolish(currentVersion.content);
                  }
                }}
                className="w-full py-2 text-sm text-primary-600 hover:text-primary-700 hover:underline"
              >
                ↩️ 回滚到此版本
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
