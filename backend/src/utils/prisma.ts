import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// 数据库连接错误重试机制
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function connectWithRetry(retries: number = MAX_RETRIES): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      console.log('Database connected successfully');
      return true;
    } catch (error) {
      console.error(`Database connection attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  return false;
}

// 优雅关闭连接
process.on('SIGINT', async () => {
  console.log('Closing database connection...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Closing database connection...');
  await prisma.$disconnect();
  process.exit(0);
});

export { connectWithRetry };
export default prisma;
