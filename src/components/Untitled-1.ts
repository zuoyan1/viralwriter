import type { EvaluationResult } from '../types';

// 添加文案优化建议生成器
export function generateOptimizationSuggestions(
  result: EvaluationResult,
  content: string
): string[] {
  const suggestions: string[] = [];
  
  // 根据互动潜力生成建议
  if (result.engagement.score < 60) {
    suggestions.push("建议添加行动号召词：如「点击关注」「点赞收藏」「评论区见」");
    suggestions.push("建议使用紧迫感词汇：如「限时」「最后」「仅剩」");
  }
  
  // 根据关键词生成建议
  if (result.keywords.score < 60 && result.keywords.suggestions.length > 0) {
    suggestions.push(...result.keywords.suggestions);
  }
  
  // 根据情感共鸣生成建议
  if (result.emotion.score < 60) {
    suggestions.push("建议增加情感词汇：如「绝绝子」「太赞了」「强烈推荐」");
  }
  
  // 根据结构生成建议
  if (result.structure.closing < 60) {
    suggestions.push("建议优化结尾：添加明确的行动号召或引导关注");
  }
  
  return suggestions;
}

// 添加文案润色功能
export function polishCopy(content: string, platform: string): string {
  let polished = content;
  
  // 根据平台特点润色
  const platformFeatures: Record<string, {prefix: string, suffix: string}> = {
    douyin: { prefix: "家人们！", suffix: "点击关注不迷路～" },
    kuaishou: { prefix: "老铁们好！", suffix: "双击666！" },
    xiaohongshu: { prefix: "姐妹们！", suffix: "❤️喜欢的宝子们点个赞" },
    bilibili: { prefix: "大家好我是UP主！", suffix: "欢迎在弹幕讨论～" },
    video: { prefix: "朋友们好！", suffix: "感谢观看，记得关注！" }
  };
  
  const features = platformFeatures[platform] || platformFeatures.douyin;
  
  // 添加平台特色开头和结尾
  if (!polished.startsWith(features.prefix)) {
    polished = features.prefix + polished;
  }
  if (!polished.endsWith(features.suffix)) {
    polished = polished + features.suffix;
  }
  
  // 添加热门词汇
  const hotWords = ["绝绝子", "太绝了", "YYDS", "谁懂啊", "挖到宝了"];
  const randomHotWord = hotWords[Math.floor(Math.random() * hotWords.length)];
  if (!polished.includes(randomHotWord)) {
    polished = polished.replace(/！/g, `！${randomHotWord}！`);
  }
  
  return polished;
}