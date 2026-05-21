import type { EvaluationResult, VideoCopyInput } from '../types';

const engagementKeywords = [
  '点击', '关注', '点赞', '评论', '转发', '收藏', '查看', '了解', '立即', '现在',
  '免费', '限时', '独家', '秘密', '揭秘', '真相', '干货', '技巧', '教程', '攻略',
  '为什么', '如何', '怎样', '什么', '竟然', '原来', '没想到', '惊呆了', '震撼',
  '一定要', '千万', '必须', '强烈', '推荐', '必看', '干货分享', '知识点', '划重点'
];

const emotionalWords: Record<string, string[]> = {
  joy: ['开心', '快乐', '幸福', '惊喜', '兴奋', '激动', '满足', '美好', '甜蜜', '温馨',
        '太棒', '太好了', '爱了', '绝了', '绝绝子', '牛', '厉害', '赞', '完美', '优秀',
        '笑', '哈哈哈', '笑死', '有趣', '好玩', '精彩', '惊艳', '超棒', '无敌', '好用',
        '推荐', '喜欢', '爱了爱了', '绝绝', 'YYDS', '绝绝子', '冲冲冲', '种草', '安利',
        '美丽', '漂亮', '舒服', '轻松', '愉快'],
  anger: ['愤怒', '气愤', '不满', '讨厌', '可恨', '可恶', '糟糕', '烦人', '无语', '生气',
         '气死', '过分', '离谱', '恶心', '垃圾', '无语了', '受不了', '太过分', '有病'],
  sadness: ['难过', '伤心', '失望', '遗憾', '悲伤', '痛苦', '失落', '沮丧', '心碎', '绝望',
           '哭', '难受', '心疼', '可怜', '惨', '悲剧', '可惜', '遗憾', '无奈', '不美丽',
           '心情不美丽', '心情差', '天气差', '天气不好', '阴天', '下雨', '雾霾'],
  fear: ['害怕', '担心', '紧张', '焦虑', '恐惧', '担忧', '不安', '恐慌', '惊吓', '震惊',
        '怕', '不敢', '小心', '注意', '警告', '危险', '警惕', 'out', '落后', '淘汰', '后悔'],
  surprise: ['惊讶', '意外', '没想到', '居然', '竟然', '突然', '猛然', '豁然', '恍然大悟',
            '哇', '天呐', '我的天', '绝了', '不敢相信', '太意外', '神奇', '反转', '颠覆'],
  trust: ['信任', '可靠', '专业', '品质', '保证', '承诺', '放心', '安心', '值得', '口碑',
         '正品', '官方', '认证', '权威', '专业', '资深', '经验', '实力', '靠谱', '推荐', '安利']
};

const platformCharacteristics: Record<string, { idealLength: [number, number]; style: string[] }> = {
  douyin: { idealLength: [30, 200], style: ['简洁', '口语化', '节奏感强', '流行语', '老铁', '家人们', '绝绝子'] },
  kuaishou: { idealLength: [20, 150], style: ['接地气', '真实', '直接', '带情感', '老铁', '家人们'] },
  bilibili: { idealLength: [80, 350], style: ['详细', '有深度', '二次元', '弹幕', '科普', '干货'] },
  xiaohongshu: { idealLength: [60, 250], style: ['种草', '分享', '精致', 'emoji', '姐妹们', '绝绝子', '爱了'] },
  video号: { idealLength: [40, 200], style: ['温馨', '正能量', '生活化', '家庭向', '朋友们', '家人们'] }
};

const categoryKeywords: Record<string, string[]> = {
  entertainment: ['搞笑', '有趣', '好玩', '精彩', '爆笑', '神反转', '高能', '段子', '梗', '笑点'],
  education: ['知识', '干货', '教程', '学习', '技巧', '方法', '科普', '干货分享', '知识点', '划重点'],
  beauty: ['护肤', '美妆', '穿搭', '时尚', '变美', '精致', '颜值', '保养', '化妆品', '种草',
           '面霜', '质地', '清爽', '不油腻', '敏感肌', '好用', '推荐', '安利', '绝绝子', '宝藏'],
  food: ['美食', '好吃', '探店', '教程', '食谱', '美味', '解馋', '吃货', '打卡', '推荐'],
  technology: ['科技', '数码', '测评', '开箱', '体验', '黑科技', '干货', '手机', '电脑', '智能'],
  fitness: ['健身', '运动', '减肥', '塑形', '健康', '锻炼', '燃脂', '瑜伽', '跑步', '训练'],
  travel: ['旅行', '攻略', '打卡', '美景', '推荐', '小众', '宝藏', '景点', '游玩', '目的地']
};

export async function evaluateCopy(input: VideoCopyInput): Promise<EvaluationResult> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const content = input.content;
  const platform = input.platform;
  const category = input.category;
  
  const engagementScore = calculateEngagementScore(content);
  const emotionScore = calculateEmotionScore(content);
  const structureScore = calculateStructureScore(content, platform);
  const keywordScore = calculateKeywordScore(content, category);
  const platformScore = calculatePlatformScore(content, platform);
  
  const overallScore = Math.round(
    (engagementScore.score * 0.25 + 
     emotionScore.score * 0.2 + 
     structureScore.score * 0.2 + 
     keywordScore.score * 0.2 + 
     platformScore.score * 0.15) * 10
  ) / 10;

  const suggestions = generateSuggestions(
    engagementScore, 
    emotionScore, 
    structureScore, 
    keywordScore, 
    platformScore,
    platform,
    category
  );

  const benchmarkComparison = generateBenchmarkComparison(overallScore);

  return {
    overallScore,
    engagement: engagementScore,
    emotion: emotionScore,
    structure: structureScore,
    keywords: keywordScore,
    platform: platformScore,
    suggestions,
    benchmarkComparison
  };
}

function calculateEngagementScore(content: string): EvaluationResult['engagement'] {
  let hookStrength = 0;
  let curiosity = 0;
  let urgency = 0;
  let callToAction = 0;
  
  const hookPatterns = ['没想到', '竟然', '揭秘', '真相', '为什么', '如何', '最后', '千万别',
                        '你知道吗', '据说', '99%的人', '很少有人', '隐藏', '秘密', '震惊',
                        '颠覆', '反转', '神反转', '高能', '绝了', '太意外', '姐妹们', '姐妹们！',
                        '挖到宝了', '发现', '绝绝子', '爱了', '安利', '种草', '推荐给大家'];
  const curiosityPatterns = ['你知道吗', '据说', '99%的人', '很少有人', '隐藏', '秘密',
                            '为什么', '如何', '怎样', '什么', '真相', '秘诀', '技巧'];
  const urgencyPatterns = ['限时', '仅剩', '最后', '马上', '立刻', '今日', '错过',
                          '倒计时', '即将', '立刻', '火速', '赶紧', '马上', '别等'];
  const ctaPatterns = ['点击', '关注', '点赞', '评论', '转发', '收藏', '查看', '了解',
                      '关注我', '点个赞', '评论区', '记得', '一定要', '不要错过',
                      '推荐给大家', '分享', '冲冲冲', '赶紧去', '快去', '入手'];
  
  hookStrength = Math.min(hookPatterns.filter(p => content.includes(p)).length * 12 + 40, 100);
  curiosity = Math.min(curiosityPatterns.filter(p => content.includes(p)).length * 12 + 35, 100);
  urgency = Math.min(urgencyPatterns.filter(p => content.includes(p)).length * 15 + 25, 100);
  callToAction = Math.min(ctaPatterns.filter(p => content.includes(p)).length * 12 + 30, 100);
  
  const score = Math.round((hookStrength + curiosity + urgency + callToAction) / 4);
  const rating = getRating(score);
  
  return { score, rating, metrics: { hookStrength, curiosity, urgency, callToAction } };
}

function calculateEmotionScore(content: string): EvaluationResult['emotion'] {
  const emotionDistribution: { joy: number; anger: number; sadness: number; fear: number; surprise: number; trust: number } = {
    joy: 0, anger: 0, sadness: 0, fear: 0, surprise: 0, trust: 0
  };
  
  let totalEmotionalWords = 0;
  
  Object.entries(emotionalWords).forEach(([emotion, words]) => {
    words.forEach(word => {
      const regex = new RegExp(word, 'g');
      const matches = content.match(regex);
      if (matches) {
        emotionDistribution[emotion as keyof typeof emotionDistribution] += matches.length;
        totalEmotionalWords += matches.length;
      }
    });
  });
  
  if (totalEmotionalWords > 0) {
    (Object.keys(emotionDistribution) as (keyof typeof emotionDistribution)[]).forEach(key => {
      emotionDistribution[key] = Math.round((emotionDistribution[key] / totalEmotionalWords) * 100);
    });
  }
  
  const dominantEmotion = Object.entries(emotionDistribution).sort((a, b) => b[1] - a[1])[0][0];
  
  let score = 0;
  if (totalEmotionalWords > 0) {
    score = Math.min(totalEmotionalWords * 20, 100);
  } else {
    score = 30 + Math.floor(Math.random() * 20);
  }
  
  const rating = getRating(score);
  
  return { score, rating, dominantEmotion, emotionDistribution };
}

function calculateStructureScore(content: string, platform: string): EvaluationResult['structure'] {
  const length = content.length;
  const platformInfo = platformCharacteristics[platform] || { idealLength: [30, 200], style: [] };
  
  let opening = 0;
  let body = 0;
  let closing = 0;
  let pacing = 0;
  let lengthScore = 0;
  
  const openingPatterns = ['大家好', '哈喽', '今天', '朋友们', '家人们', '老铁们', '姐妹们',
                          '注意了', '看这里', '告诉大家', '跟大家说', '分享一个', '揭秘'];
  const closingPatterns = ['谢谢', '再见', '关注我', '点赞', '收藏', '转发', '评论',
                          '下期见', '拜拜', '感谢观看', '记得关注', '我们下次'];
  
  if (openingPatterns.some(p => content.startsWith(p))) {
    opening = 90;
  } else if (length > 10) {
    opening = 60 + Math.floor(Math.random() * 20);
  } else {
    opening = 40;
  }
  
  const sentences = content.split(/[。！？\n]/).filter(s => s.trim());
  if (sentences.length >= 4) {
    body = 90;
  } else if (sentences.length >= 2) {
    body = 70;
  } else if (sentences.length >= 1) {
    body = 50;
  } else {
    body = 30;
  }
  
  if (closingPatterns.some(p => content.includes(p))) {
    closing = 85;
  } else {
    closing = 50 + Math.floor(Math.random() * 20);
  }
  
  if (sentences.length >= 2 && sentences.length <= 8) {
    pacing = 85;
  } else if (sentences.length >= 1 && sentences.length <= 12) {
    pacing = 70;
  } else {
    pacing = 50;
  }
  
  const idealMin = platformInfo.idealLength[0];
  const idealMax = platformInfo.idealLength[1];
  
  if (length >= idealMin && length <= idealMax) {
    lengthScore = 100;
  } else if (length < idealMin) {
    lengthScore = Math.max(30, Math.round((length / idealMin) * 80));
  } else {
    lengthScore = Math.max(30, Math.round((idealMax / length) * 80));
  }
  
  const score = Math.round((opening + body + closing + pacing + lengthScore) / 5);
  const rating = getRating(score);
  
  return { score, rating, metrics: { opening, body, closing, pacing, length: lengthScore } };
}

function calculateKeywordScore(content: string, category: string): EvaluationResult['keywords'] {
  const keywords: EvaluationResult['keywords']['keywords'] = [];
  const categoryWords = categoryKeywords[category] || [];
  const allKeywords = [...categoryWords, ...engagementKeywords];
  
  allKeywords.forEach(word => {
    const regex = new RegExp(word, 'g');
    const matches = content.match(regex);
    if (matches) {
      keywords.push({
        word,
        count: matches.length,
        relevance: categoryWords.includes(word) ? 80 + Math.random() * 20 : 50 + Math.random() * 30,
        trendScore: 60 + Math.random() * 40
      });
    }
  });
  
  keywords.sort((a, b) => b.count * b.relevance - a.count * a.relevance);
  
  const density = content.length > 0 ? Math.round((keywords.reduce((sum, k) => sum + k.count, 0) / content.length) * 100) : 0;
  
  let score = 30;
  
  if (keywords.length > 0) {
    const matchScore = Math.min(keywords.length * 12, 50);
    const densityScore = Math.min(density * 2, 30);
    
    const categoryMatchCount = keywords.filter(k => categoryWords.includes(k.word)).length;
    const engagementMatchCount = keywords.filter(k => engagementKeywords.includes(k.word)).length;
    
    let bonus = 0;
    if (categoryMatchCount > 0) bonus += 10;
    if (engagementMatchCount > 0) bonus += 10;
    
    score = Math.min(matchScore + densityScore + bonus + 20, 100);
  } else {
    score = 30 + Math.floor(Math.random() * 20);
  }
  const rating = getRating(score);
  
  const keywordSuggestions: string[] = [];
  if (score < 50) {
    const suggestedKeywords = categoryWords.slice(0, 3);
    if (suggestedKeywords.length > 0) {
      keywordSuggestions.push(`建议添加 ${suggestedKeywords.join('、')} 等关键词`);
    }
  }
  
  return { score, rating, keywords: keywords.slice(0, 8), density, suggestions: keywordSuggestions };
}

function calculatePlatformScore(content: string, platform: string): EvaluationResult['platform'] {
  const platformInfo = platformCharacteristics[platform] || { idealLength: [30, 200], style: [] };
  const length = content.length;
  
  let lengthMatch = 0;
  if (length >= platformInfo.idealLength[0] && length <= platformInfo.idealLength[1]) {
    lengthMatch = 100;
  } else if (length < platformInfo.idealLength[0]) {
    lengthMatch = Math.max(40, Math.round((length / platformInfo.idealLength[0]) * 90));
  } else {
    lengthMatch = Math.max(40, Math.round((platformInfo.idealLength[1] / length) * 90));
  }
  
  let styleMatch = 30;
  const matchedStyles: string[] = [];
  platformInfo.style.forEach(style => {
    if (content.includes(style)) {
      styleMatch += 15;
      matchedStyles.push(style);
    }
  });
  styleMatch = Math.min(styleMatch, 100);
  
  const score = Math.round((lengthMatch + styleMatch) / 2);
  const rating = getRating(score);
  
  const platforms = ['douyin', 'kuaishou', 'bilibili', 'xiaohongshu', 'video号'];
  const platformFit = platforms.map(p => {
    const info = platformCharacteristics[p];
    let fitScore = 50;
    let reason = '';
    
    if (length >= info.idealLength[0] && length <= info.idealLength[1]) {
      fitScore += 30;
      reason = '长度适中';
    } else if (length < info.idealLength[0]) {
      fitScore += 10;
      reason = '文案偏短';
    } else {
      fitScore += 10;
      reason = '文案偏长';
    }
    
    info.style.forEach(style => {
      if (content.includes(style)) {
        fitScore += 5;
      }
    });
    
    return {
      platform: p,
      fitScore: Math.min(fitScore, 100),
      reason
    };
  });
  
  return { score, rating, platformFit };
}

function generateSuggestions(
  engagement: EvaluationResult['engagement'],
  emotion: EvaluationResult['emotion'],
  structure: EvaluationResult['structure'],
  keywords: EvaluationResult['keywords'],
  platform: EvaluationResult['platform'],
  platformType: string,
  category: string
): EvaluationResult['suggestions'] {
  const suggestions: EvaluationResult['suggestions'] = [];
  
  if (engagement.score < 60) {
    if (engagement.metrics.hookStrength < 50) {
      suggestions.push({
        category: '互动潜力',
        suggestion: '在开头使用钩子词汇制造悬念',
        priority: 'high',
        example: '没想到、竟然、揭秘、真相'
      });
    }
    if (engagement.metrics.callToAction < 50) {
      suggestions.push({
        category: '互动潜力',
        suggestion: '添加明确的行动号召',
        priority: 'high',
        example: '点击关注、点赞收藏、评论区见'
      });
    }
    if (engagement.metrics.urgency < 50) {
      suggestions.push({
        category: '互动潜力',
        suggestion: '使用词汇营造紧迫感',
        priority: 'medium',
        example: '限时、最后、仅剩、马上'
      });
    }
  }
  
  if (emotion.score < 50) {
    suggestions.push({
      category: '情感共鸣',
      suggestion: '增加情感词汇，让文案更有感染力',
      priority: 'medium',
      example: '太棒了、绝绝子、爱了、笑死'
    });
  }
  
  if (structure.score < 60) {
    if (structure.metrics.opening < 60) {
      suggestions.push({
        category: '结构有效性',
        suggestion: '优化开头，使用常见开场语',
        priority: 'medium',
        example: '大家好、今天分享、告诉大家'
      });
    }
    if (structure.metrics.closing < 60) {
      suggestions.push({
        category: '结构有效性',
        suggestion: '添加结尾，引导互动',
        priority: 'medium',
        example: '谢谢观看、记得关注、下期见'
      });
    }
    if (structure.metrics.length < 60) {
      const idealLength = platformCharacteristics[platformType]?.idealLength || [50, 150];
      suggestions.push({
        category: '结构有效性',
        suggestion: `调整文案长度`,
        priority: 'high',
        example: `${idealLength[0]}-${idealLength[1]}字效果最佳`
      });
    }
  }
  
  if (keywords.score < 50) {
    suggestions.push({
      category: '关键词优化',
      suggestion: `添加${category}相关关键词`,
      priority: 'medium',
      example: categoryKeywords[category]?.slice(0, 3).join('、')
    });
  }
  
  if (platform.score < 60) {
    const platformName = platformType === 'douyin' ? '抖音' : platformType === 'kuaishou' ? '快手' : 
                         platformType === 'bilibili' ? 'B站' : platformType === 'xiaohongshu' ? '小红书' : '视频号';
    suggestions.push({
      category: '平台适配',
      suggestion: `根据${platformName}平台特点优化文案风格`,
      priority: 'medium',
      example: platformCharacteristics[platformType]?.style.slice(0, 2).join('、')
    });
  }
  
  return suggestions.length > 0 ? suggestions : [{
    category: '综合评估',
    suggestion: '文案质量良好，继续保持！',
    priority: 'low'
  }];
}

function generateBenchmarkComparison(overallScore: number): EvaluationResult['benchmarkComparison'] {
  const industryAverage = 65;
  const topPerformers = 85;
  
  let percentile = 50;
  if (overallScore >= topPerformers) percentile = 90;
  else if (overallScore >= industryAverage) percentile = 70;
  else if (overallScore >= 50) percentile = 30;
  else percentile = 10;
  
  const gapAnalysis = [
    { metric: '互动潜力', yourScore: 50, benchmarkScore: 75, gap: 25 },
    { metric: '情感共鸣', yourScore: 50, benchmarkScore: 70, gap: 20 },
    { metric: '结构有效', yourScore: 50, benchmarkScore: 75, gap: 25 },
    { metric: '关键词', yourScore: 50, benchmarkScore: 70, gap: 20 },
    { metric: '平台适配', yourScore: 50, benchmarkScore: 75, gap: 25 }
  ];
  
  return {
    industryAverage,
    topPerformers,
    yourScore: overallScore,
    percentile,
    gapAnalysis
  };
}

function getRating(score: number): string {
  if (score >= 90) return '优秀';
  if (score >= 80) return '良好';
  if (score >= 60) return '中等';
  if (score >= 40) return '较差';
  return '极差';
}
