import express from 'express';
import {
  saveEvaluationHistory,
  getEvaluationHistory,
  deleteEvaluationHistory,
  savePolishHistory,
  getPolishHistory,
} from '../controllers/evaluationController';

const router = express.Router();

router.post('/history', saveEvaluationHistory);
router.get('/history', getEvaluationHistory);
router.delete('/history/:id', deleteEvaluationHistory);

router.post('/polish', savePolishHistory);
router.get('/polish', getPolishHistory);

export default router;
