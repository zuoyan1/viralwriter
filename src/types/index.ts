export interface EvaluationResult {
  overallScore: number;
  engagement: EngagementScore;
  emotion: EmotionScore;
  structure: StructureScore;
  keywords: KeywordScore;
  platform: PlatformScore;
  suggestions: ImprovementSuggestion[];
  benchmarkComparison: BenchmarkComparison;
}

export interface EngagementScore {
  score: number;
  rating: string;
  metrics: {
    hookStrength: number;
    curiosity: number;
    urgency: number;
    callToAction: number;
  };
}

export interface EmotionScore {
  score: number;
  rating: string;
  dominantEmotion: string;
  emotionDistribution: {
    joy: number;
    anger: number;
    sadness: number;
    fear: number;
    surprise: number;
    trust: number;
  };
}

export interface StructureScore {
  score: number;
  rating: string;
  metrics: {
    opening: number;
    body: number;
    closing: number;
    pacing: number;
    length: number;
  };
}

export interface KeywordScore {
  score: number;
  rating: string;
  keywords: KeywordItem[];
  density: number;
  suggestions: string[];
}

export interface KeywordItem {
  word: string;
  count: number;
  relevance: number;
  trendScore: number;
}

export interface PlatformScore {
  score: number;
  rating: string;
  platformFit: PlatformFit[];
}

export interface PlatformFit {
  platform: string;
  fitScore: number;
  reason: string;
}

export interface ImprovementSuggestion {
  category: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
  example?: string;
}

export interface BenchmarkComparison {
  industryAverage: number;
  topPerformers: number;
  yourScore: number;
  percentile: number;
  gapAnalysis: GapAnalysisItem[];
}

export interface GapAnalysisItem {
  metric: string;
  yourScore: number;
  benchmarkScore: number;
  gap: number;
}

export interface VideoCopyInput {
  content: string;
  platform: string;
  category: string;
  targetAudience: string;
}

export interface PlatformOption {
  id: string;
  name: string;
  icon: string;
}

export interface CategoryOption {
  id: string;
  name: string;
}
