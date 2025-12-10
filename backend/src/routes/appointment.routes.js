import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  listAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointment.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', requireRole('admin', 'doctor', 'assistant'), listAppointments);
router.post('/', requireRole('admin', 'doctor', 'assistant'), createAppointment);
router.put('/:id', requireRole('admin', 'doctor', 'assistant'), updateAppointment);
router.delete('/:id', requireRole('admin'), deleteAppointment);

export default router;
