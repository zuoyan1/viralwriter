import { ScoreCard } from './ScoreCard';
import { OverallScore } from './OverallScore';
import { EngagementSection } from './EngagementSection';
import { EmotionSection } from './EmotionSection';
import { StructureSection } from './StructureSection';
import { KeywordSection } from './KeywordSection';
import { PlatformSection } from './PlatformSection';
import { SuggestionsSection } from './SuggestionsSection';
import { BenchmarkSection } from './BenchmarkSection';
import type { EvaluationResult } from '../types';

interface Props {
  result: EvaluationResult;
}

export function ReportDashboard({ result }: Props) {
  const getRating = (score: number): string => {
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好';
    if (score >= 60) return '中等';
    if (score >= 40) return '较差';
    return '极差';
  };

  return (
    <div className="space-y-6">
      <OverallScore score={result.overallScore} rating={getRating(result.overallScore)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <ScoreCard
          title="互动潜力"
          score={result.engagement.score}
          rating={result.engagement.rating}
          icon="⚡"
          color="bg-orange-100"
        />
        <ScoreCard
          title="情感共鸣"
          score={result.emotion.score}
          rating={result.emotion.rating}
          icon="💝"
          color="bg-pink-100"
        />
        <ScoreCard
          title="结构有效"
          score={result.structure.score}
          rating={result.structure.rating}
          icon="🏗️"
          color="bg-purple-100"
        />
        <ScoreCard
          title="关键词"
          score={result.keywords.score}
          rating={result.keywords.rating}
          icon="🔑"
          color="bg-cyan-100"
        />
        <ScoreCard
          title="平台适配"
          score={result.platform.score}
          rating={result.platform.rating}
          icon="📱"
          color="bg-indigo-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EngagementSection data={result.engagement} />
        <EmotionSection data={result.emotion} />
        <StructureSection data={result.structure} />
        <KeywordSection data={result.keywords} />
        <PlatformSection data={result.platform} />
        <SuggestionsSection suggestions={result.suggestions} />
      </div>

      <BenchmarkSection data={result.benchmarkComparison} />
    </div>
  );
}
