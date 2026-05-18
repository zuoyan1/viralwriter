import { MetricBar } from './MetricBar';
import type { EngagementScore } from '../types';

interface Props {
  data: EngagementScore;
}

export function EngagementSection({ data }: Props) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">⚡</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">互动潜力</h3>
          <p className="text-sm text-gray-500">评估文案吸引用户互动的能力</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <MetricBar label="钩子强度" value={data.metrics.hookStrength} />
        <MetricBar label="好奇心指数" value={data.metrics.curiosity} />
        <MetricBar label="紧迫感" value={data.metrics.urgency} />
        <MetricBar label="行动召唤" value={data.metrics.callToAction} />
      </div>

      <div className="mt-6 p-4 bg-orange-50 rounded-lg">
        <h4 className="font-medium text-orange-800 mb-2">💡 互动技巧</h4>
        <ul className="text-sm text-orange-700 space-y-1">
          {data.metrics.hookStrength < 50 && (
            <li>• 在开头使用「没想到」「揭秘」等词汇制造悬念</li>
          )}
          {data.metrics.callToAction < 50 && (
            <li>• 添加明确的CTA：「点击关注」「点赞收藏」</li>
          )}
          {data.metrics.urgency < 50 && (
            <li>• 使用「限时」「仅剩」等词汇营造紧迫感</li>
          )}
        </ul>
      </div>
    </div>
  );
}
