interface Props {
  title: string;
  score: number;
  rating: string;
  icon: string;
  color: string;
}

export function ScoreCard({ title, score, rating, icon, color }: Props) {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case '优秀': return 'text-green-600 bg-green-50';
      case '良好': return 'text-blue-600 bg-blue-50';
      case '中等': return 'text-yellow-600 bg-yellow-50';
      case '较差': return 'text-orange-600 bg-orange-50';
      default: return 'text-red-600 bg-red-50';
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-blue-400 to-blue-600';
    if (score >= 40) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(rating)}`}>
          {rating}
        </span>
      </div>
      <div className="mb-3">
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{score}</p>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(score)} transition-all duration-1000`}
          style={{ width: `${score}%` }}
        >
          <div className="w-full h-full progress-shine rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
