import { Router } from 'express';
import { registerController, loginController, getUserInfoController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/userinfo', authMiddleware, getUserInfoController);

export default router;
