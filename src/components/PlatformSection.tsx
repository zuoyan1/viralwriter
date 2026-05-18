import type { PlatformScore } from '../types';

interface Props {
  data: PlatformScore;
}

export function PlatformSection({ data }: Props) {
  const getPlatformColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-blue-400 to-blue-600';
    if (score >= 40) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">📱</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">平台适配</h3>
          <p className="text-sm text-gray-500">评估文案与目标平台的契合度</p>
        </div>
      </div>

      {data.platformFit.map((pf, index) => (
        <div key={index} className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-700">{pf.platform}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              pf.fitScore >= 80 ? 'bg-green-50 text-green-600' :
              pf.fitScore >= 60 ? 'bg-blue-50 text-blue-600' :
              pf.fitScore >= 40 ? 'bg-yellow-50 text-yellow-600' :
              'bg-red-50 text-red-600'
            }`}>
              {pf.fitScore}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className={`h-3 rounded-full bg-gradient-to-r ${getPlatformColor(pf.fitScore)} transition-all duration-500`}
              style={{ width: `${pf.fitScore}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">{pf.reason}</p>
        </div>
      ))}

      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <h4 className="font-medium text-indigo-800 mb-2">📊 平台特点</h4>
        <div className="grid grid-cols-2 gap-2 text-sm text-indigo-700">
          <div>🎵 抖音：短平快、节奏强</div>
          <div>📱 快手：接地气、真实感</div>
          <div>📺 B站：深度内容、弹幕互动</div>
          <div>📕 小红书：种草、分享式</div>
        </div>
      </div>
    </div>
  );
}
