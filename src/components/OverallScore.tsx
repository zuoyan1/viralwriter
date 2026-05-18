interface Props {
  score: number;
  rating: string;
}

export function OverallScore({ score, rating }: Props) {
  const getRatingInfo = (rating: string) => {
    switch (rating) {
      case '优秀':
        return {
          color: 'from-green-400 to-green-600',
          bgColor: 'bg-green-50',
          textColor: 'text-green-600',
          description: '文案质量优秀，具备成为爆款的潜力！'
        };
      case '良好':
        return {
          color: 'from-blue-400 to-blue-600',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-600',
          description: '文案质量良好，稍作优化即可提升效果。'
        };
      case '中等':
        return {
          color: 'from-yellow-400 to-yellow-600',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-600',
          description: '文案质量中等，建议参考优化建议进行改进。'
        };
      case '较差':
        return {
          color: 'from-orange-400 to-orange-600',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-600',
          description: '文案质量较差，需要大幅优化。'
        };
      default:
        return {
          color: 'from-red-400 to-red-600',
          bgColor: 'bg-red-50',
          textColor: 'text-red-600',
          description: '文案质量极差，建议重新撰写。'
        };
    }
  };

  const info = getRatingInfo(rating);

  return (
    <div className={`rounded-2xl p-6 ${info.bgColor} shadow-lg`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative">
          <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center`}>
            <div className="text-center">
              <span className="text-4xl font-bold text-white">{score}</span>
              <p className="text-sm text-white/80">综合评分</p>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center">
            <span className="text-2xl">🏆</span>
          </div>
        </div>
        <div className="text-center md:text-left">
          <div className={`inline-block px-4 py-2 rounded-full ${info.bgColor} ${info.textColor} font-semibold mb-3`}>
            {rating}
          </div>
          <p className="text-gray-700 text-lg">{info.description}</p>
        </div>
      </div>
    </div>
  );
}
