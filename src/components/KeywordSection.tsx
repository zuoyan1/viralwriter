import type { KeywordScore } from '../types';

interface Props {
  data: KeywordScore;
}

export function KeywordSection({ data }: Props) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">🔑</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">关键词优化</h3>
          <p className="text-sm text-gray-500">分析关键词使用情况与优化建议</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">关键词密度</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          data.density >= 3 ? 'bg-green-50 text-green-600' : 
          data.density >= 1 ? 'bg-yellow-50 text-yellow-600' : 
          'bg-red-50 text-red-600'
        }`}>
          {data.density}%
        </span>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">检测到的关键词</h4>
        <div className="flex flex-wrap gap-2">
          {data.keywords.length > 0 ? (
            data.keywords.map((kw, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-sm flex items-center space-x-1"
              >
                <span>{kw.word}</span>
                <span className="text-xs opacity-70">x{kw.count}</span>
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">未检测到相关关键词</span>
          )}
        </div>
      </div>

      {data.suggestions.length > 0 && (
        <div className="p-4 bg-cyan-50 rounded-lg">
          <h4 className="font-medium text-cyan-800 mb-2">💡 关键词建议</h4>
          <ul className="text-sm text-cyan-700 space-y-1">
            {data.suggestions.map((suggestion, index) => (
              <li key={index}>• {suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
