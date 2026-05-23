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

// Helper functions for JSON serialization
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

// Extend types to return parsed JSON
type EvaluationWithParsedResult = Omit<EvaluationHistory, 'result'> & { result: any };
type PolishWithParsedChanges = Omit<PolishHistory, 'changes'> & { changes: any };

export class EvaluationService {
  async createEvaluationHistory(data: EvaluationInput): Promise<EvaluationWithParsedResult> {
    const record = await prisma.evaluationHistory.create({
      data: {
        content: data.content,
        platform: data.platform,
        category: data.category,
        overallScore: data.overallScore,
        result: serializeJSON(data.result),
      },
    });
    
    return {
      ...record,
      result: deserializeJSON(record.result),
    };
  }

  async getEvaluationHistory(
    page: number = 1,
    limit: number = 10
  ): Promise<{ evaluations: EvaluationWithParsedResult[], total: number }> {
    const skip = (page - 1) * limit;
    const [evaluations, total] = await Promise.all([
      prisma.evaluationHistory.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.evaluationHistory.count(),
    ]);
    
    return {
      evaluations: evaluations.map(ev => ({
        ...ev,
        result: deserializeJSON(ev.result),
      })),
      total,
    };
  }

  async deleteEvaluationHistory(id: string): Promise<void> {
    await prisma.evaluationHistory.delete({ where: { id } });
  }

  async createPolishHistory(
    original: string,
    polished: string,
    style: string,
    platform: string,
    category: string,
    changes: any[]
  ): Promise<PolishWithParsedChanges> {
    const record = await prisma.polishHistory.create({
      data: {
        original,
        polished,
        style,
        platform,
        category,
        changes: serializeJSON(changes),
      },
    });
    
    return {
      ...record,
      changes: deserializeJSON(record.changes),
    };
  }

  async getPolishHistory(
    page: number = 1,
    limit: number = 10
  ): Promise<{ polishHistory: PolishWithParsedChanges[], total: number }> {
    const skip = (page - 1) * limit;
    const [polishHistory, total] = await Promise.all([
      prisma.polishHistory.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.polishHistory.count(),
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
