import express from 'express';
import {
  saveEvaluationHistory,
  getEvaluationHistory,
  deleteEvaluationHistory,
  savePolishHistory,
  getPolishHistory,
} from '../controllers/evaluationController';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/history', authMiddleware, saveEvaluationHistory);
router.get('/history', optionalAuthMiddleware, getEvaluationHistory);
router.delete('/history/:id', authMiddleware, deleteEvaluationHistory);

router.post('/polish', authMiddleware, savePolishHistory);
router.get('/polish', optionalAuthMiddleware, getPolishHistory);

export default router;
