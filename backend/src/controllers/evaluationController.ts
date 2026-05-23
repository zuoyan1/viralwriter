import { Request, Response, NextFunction } from 'express';
import { success } from '../utils/response';
import { EvaluationService } from '../services/evaluationService';
import Joi from 'joi';

const evaluationService = new EvaluationService();

const evaluationSchema = Joi.object({
  content: Joi.string().required(),
  platform: Joi.string().required(),
  category: Joi.string().required(),
  targetAudience: Joi.string().default(''),
  overallScore: Joi.number().required(),
  result: Joi.object().required(),
});

const polishSchema = Joi.object({
  original: Joi.string().required(),
  polished: Joi.string().required(),
  style: Joi.string().required(),
  platform: Joi.string().required(),
  category: Joi.string().required(),
  changes: Joi.array().required(),
});

export const saveEvaluationHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error: validationError, value } = evaluationSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json(success(null, validationError.message));
    }

    const evaluation = await evaluationService.createEvaluationHistory(value);
    res.json(success(evaluation, '保存成功'));
  } catch (error) {
    next(error);
  }
};

export const getEvaluationHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await evaluationService.getEvaluationHistory(page, limit);
    res.json(success(result, '获取成功'));
  } catch (error) {
    next(error);
  }
};

export const deleteEvaluationHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await evaluationService.deleteEvaluationHistory(req.params.id);
    res.json(success(null, '删除成功'));
  } catch (error) {
    next(error);
  }
};

export const savePolishHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error: validationError, value } = polishSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json(success(null, validationError.message));
    }

    const { original, polished, style, platform, category, changes } = value;
    const polishHistory = await evaluationService.createPolishHistory(
      original, polished, style, platform, category, changes
    );
    res.json(success(polishHistory, '保存成功'));
  } catch (error) {
    next(error);
  }
};

export const getPolishHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await evaluationService.getPolishHistory(page, limit);
    res.json(success(result, '获取成功'));
  } catch (error) {
    next(error);
  }
};
