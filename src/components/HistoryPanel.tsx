import type { HistoryItem } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

export function HistoryPanel({ history, onSelect, onDelete }: HistoryPanelProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateContent = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">评估历史</h3>
        <span className="text-xs text-gray-500">已保存 {history.length} 条记录</span>
      </div>
      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>暂无评估历史记录</p>
          <p className="text-sm mt-2">完成评估后，记录将显示在这里</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-all cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium truncate">
                    {truncateContent(item.content)}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{item.platform}</span>
                    <span>·</span>
                    <span>{item.category}</span>
                    <span>·</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className={`text-lg font-bold ${getScoreColor(item.score)}`}>
                    {item.score}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="删除"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}