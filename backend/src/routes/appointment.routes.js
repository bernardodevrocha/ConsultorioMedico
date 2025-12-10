import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  listAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointment.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', listAppointments);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;

