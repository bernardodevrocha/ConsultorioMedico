import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { listDoctors } from '../controllers/user.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/doctors', requireRole('admin', 'doctor', 'assistant'), listDoctors);

export default router;
