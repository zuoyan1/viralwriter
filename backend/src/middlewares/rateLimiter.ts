import rateLimit from 'express-rate-limit';
import { error } from '../utils/response';

// 15分钟内最多100次请求
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 最多100次请求
  standardHeaders: true, // 返回标准的RateLimit-*头
  legacyHeaders: false, // 禁用X-RateLimit-*头
  message: error('请求过于频繁，请稍后再试', 429),
  skip: (req) => {
    // 跳过健康检查接口的限流
    return req.path === '/health';
  },
});
