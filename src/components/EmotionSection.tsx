import { MetricBar } from './MetricBar';
import type { EmotionScore } from '../types';

interface Props {
  data: EmotionScore;
}

export function EmotionSection({ data }: Props) {
  const emotionIcons: Record<string, string> = {
    joy: '😄',
    anger: '😠',
    sadness: '😢',
    fear: '😨',
    surprise: '😲',
    trust: '🤝'
  };

  const emotionNames: Record<string, string> = {
    joy: '喜悦',
    anger: '愤怒',
    sadness: '悲伤',
    fear: '恐惧',
    surprise: '惊讶',
    trust: '信任'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">💝</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">情感共鸣</h3>
          <p className="text-sm text-gray-500">分析文案传递的情感强度与类型</p>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="bg-pink-50 rounded-full px-6 py-3">
          <span className="text-2xl mr-2">{emotionIcons[data.dominantEmotion]}</span>
          <span className="text-lg font-semibold text-pink-700">
            {emotionNames[data.dominantEmotion]}为主导情感
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(data.emotionDistribution).map(([emotion, value]) => (
          <div key={emotion} className="text-center">
            <span className="text-2xl">{emotionIcons[emotion]}</span>
            <p className="text-xs text-gray-500 mt-1">{emotionNames[emotion]}</p>
            <MetricBar label="" value={value} />
          </div>
        ))}
      </div>
    </div>
  );
}
