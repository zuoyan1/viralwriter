import prisma from '../utils/prisma';
import { EvaluationHistory, PolishHistory } from '@prisma/client';

interface EvaluationInput {
  content: string;
  platform: string;
  category: string;
  targetAudience: string;
  overallScore: number;
  result: any;
}

function serializeJSON(data: any): string {
  return JSON.stringify(data);
}

function deserializeJSON(data: string): any {
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

type EvaluationWithParsedResult = Omit<EvaluationHistory, 'result'> & { result: any };
type PolishWithParsedChanges = Omit<PolishHistory, 'changes'> & { changes: any };

export class EvaluationService {
  async createEvaluationHistory(
    data: EvaluationInput,
    userId?: string
  ): Promise<EvaluationWithParsedResult> {
    const record = await prisma.evaluationHistory.create({
      data: {
        content: data.content,
        platform: data.platform,
        category: data.category,
        overallScore: data.overallScore,
        result: serializeJSON(data.result),
        userId: userId || null,
      },
    });

    return {
      ...record,
      result: deserializeJSON(record.result),
    };
  }

  async getEvaluationHistory(
    page: number = 1,
    limit: number = 10,
    userId?: string | null
  ): Promise<{ evaluations: EvaluationWithParsedResult[], total: number }> {
    const skip = (page - 1) * limit;

    const where = userId ? { userId } : {};

    const [evaluations, total] = await Promise.all([
      prisma.evaluationHistory.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.evaluationHistory.count({ where }),
    ]);

    return {
      evaluations: evaluations.map(ev => ({
        ...ev,
        result: deserializeJSON(ev.result),
      })),
      total,
    };
  }

  async deleteEvaluationHistory(id: string, userId?: string): Promise<void> {
    if (userId) {
      await prisma.evaluationHistory.delete({
        where: { id, userId },
      });
    } else {
      await prisma.evaluationHistory.delete({ where: { id } });
    }
  }

  async createPolishHistory(
    original: string,
    polished: string,
    style: string,
    platform: string,
    category: string,
    changes: any[],
    userId?: string
  ): Promise<PolishWithParsedChanges> {
    const record = await prisma.polishHistory.create({
      data: {
        original,
        polished,
        style,
        platform,
        category,
        changes: serializeJSON(changes),
        userId: userId || null,
      },
    });

    return {
      ...record,
      changes: deserializeJSON(record.changes),
    };
  }

  async getPolishHistory(
    page: number = 1,
    limit: number = 10,
    userId?: string | null
  ): Promise<{ polishHistory: PolishWithParsedChanges[], total: number }> {
    const skip = (page - 1) * limit;

    const where = userId ? { userId } : {};

    const [polishHistory, total] = await Promise.all([
      prisma.polishHistory.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.polishHistory.count({ where }),
    ]);

    return {
      polishHistory: polishHistory.map(ph => ({
        ...ph,
        changes: deserializeJSON(ph.changes),
      })),
      total,
    };
  }
}
