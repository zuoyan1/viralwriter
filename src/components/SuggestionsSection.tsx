import type { ImprovementSuggestion } from '../types';

interface Props {
  suggestions: ImprovementSuggestion[];
}

export function SuggestionsSection({ suggestions }: Props) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-500' };
      case 'medium':
        return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', badge: 'bg-yellow-500' };
      default:
        return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-500' };
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高优先级';
      case 'medium': return '中优先级';
      default: return '低优先级';
    }
  };

  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">💡</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">改进建议</h3>
          <p className="text-sm text-gray-500">基于数据分析的针对性优化建议</p>
        </div>
      </div>

      <div className="space-y-4">
        {sortedSuggestions.map((suggestion, index) => {
          const colors = getPriorityColor(suggestion.priority);
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-medium text-gray-900">{suggestion.category}</span>
                <span className={`px-2 py-0.5 rounded text-xs text-white ${colors.badge}`}>
                  {getPriorityText(suggestion.priority)}
                </span>
              </div>
              <p className={`text-sm ${colors.text}`}>{suggestion.suggestion}</p>
              {suggestion.example && (
                <div className="mt-2 p-3 bg-white rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">示例：</p>
                  <p className="text-sm text-gray-700">{suggestion.example}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
