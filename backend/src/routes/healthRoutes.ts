import express from 'express';
import { success } from '../utils/response';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(success({ status: 'ok', timestamp: new Date().toISOString() }, '服务正常运行'));
});

export default router;
