import { Response, NextFunction } from 'express';
import Joi from 'joi';
import { register, login, getUserById } from '../services/authService';
import { AuthRequest } from '../middlewares/auth.middleware';

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': '请输入有效的邮箱地址',
    'any.required': '邮箱是必填项',
  }),
  password: Joi.string().min(6).max(20).required().messages({
    'string.min': '密码至少6个字符',
    'string.max': '密码最多20个字符',
    'any.required': '密码是必填项',
  }),
  name: Joi.string().max(50).optional().messages({
    'string.max': '昵称最多50个字符',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': '请输入有效的邮箱地址',
    'any.required': '邮箱是必填项',
  }),
  password: Joi.string().required().messages({
    'any.required': '密码是必填项',
  }),
});

export async function registerController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { error: validationError, value } = registerSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ code: 400, message: validationError.details[0].message });
    }

    const result = await register(value);
    return res.status(201).json({ code: 201, message: '注册成功', data: result });
  } catch (err: any) {
    if (err.message === '该邮箱已被注册') {
      return res.status(409).json({ code: 409, message: err.message });
    }
    next(err);
  }
}

export async function loginController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { error: validationError, value } = loginSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ code: 400, message: validationError.details[0].message });
    }

    const result = await login(value);
    return res.status(200).json({ code: 200, message: '登录成功', data: result });
  } catch (err: any) {
    if (err.message === '邮箱或密码错误') {
      return res.status(401).json({ code: 401, message: err.message });
    }
    next(err);
  }
}

export async function getUserInfoController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const user = await getUserById(userId!);

    if (!user) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }

    return res.status(200).json({ code: 200, message: '获取用户信息成功', data: user });
  } catch (err) {
    next(err);
  }
}
