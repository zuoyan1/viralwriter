import 'dotenv/config';
import express from 'express';
import corsMiddleware from './middlewares/cors';
import { errorHandler } from './middlewares/errorHandler';
import { apiRateLimiter } from './middlewares/rateLimiter';
import healthRoutes from './routes/healthRoutes';
import evaluationRoutes from './routes/evaluationRoutes';
import authRoutes from './routes/authRoutes';
import prisma from './utils/prisma';
import { error } from './utils/response';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 应用请求限流
app.use('/api', apiRateLimiter);

app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/evaluation', evaluationRoutes);

// 404处理 - 必须在所有路由之后
app.use((req, res) => {
  res.status(404).json(error('请求的资源不存在', 404));
});

app.use(errorHandler);

async function main() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`ViralWriter Backend Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
