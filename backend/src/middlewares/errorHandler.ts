import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { error } from '../utils/response';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json(error(err.message, 400));
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json(error('未授权访问', 401));
  }

  if (err.name === 'NotFoundError') {
    return res.status(404).json(error('资源不存在', 404));
  }

  res.status(err.status || 500).json(error(err.message || '服务器内部错误', err.status || 500));
};
