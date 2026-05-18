import type { PlatformOption, CategoryOption } from '../types';

export const platforms: PlatformOption[] = [
  { id: 'douyin', name: '抖音', icon: '🎵' },
  { id: 'kuaishou', name: '快手', icon: '📱' },
  { id: 'bilibili', name: 'B站', icon: '📺' },
  { id: 'xiaohongshu', name: '小红书', icon: '📕' },
  { id: 'video号', name: '视频号', icon: '🎬' }
];

export const categories: CategoryOption[] = [
  { id: 'entertainment', name: '娱乐搞笑' },
  { id: 'education', name: '知识教育' },
  { id: 'beauty', name: '美妆时尚' },
  { id: 'food', name: '美食探店' },
  { id: 'technology', name: '科技数码' },
  { id: 'fitness', name: '健身运动' },
  { id: 'travel', name: '旅游攻略' }
];

export const targetAudiences = [
  { id: 'young', name: '年轻人群 (18-25岁)' },
  { id: 'adult', name: '成年人群 (25-40岁)' },
  { id: 'family', name: '家庭用户' },
  { id: 'professional', name: '职场人士' },
  { id: 'all', name: '全年龄段' }
];

export const sampleCopy = `大家好，今天给大家分享一个超级实用的生活小技巧！

你是不是也经常遇到这种情况：家里的东西总是找不到？其实只要一个简单的方法就能解决！

首先，准备几个收纳盒，然后按照类别把东西分好类放进去。最重要的是，一定要贴上标签！

这样下次找东西就再也不用翻箱倒柜了，真的太方便了！

喜欢这个视频的话，记得点赞关注哦，每天分享更多实用干货！`;

export const industryBenchmarks = {
  entertainment: { avgScore: 68, topScore: 88 },
  education: { avgScore: 72, topScore: 90 },
  beauty: { avgScore: 70, topScore: 89 },
  food: { avgScore: 65, topScore: 86 },
  technology: { avgScore: 75, topScore: 92 },
  fitness: { avgScore: 67, topScore: 87 },
  travel: { avgScore: 69, topScore: 88 }
};
