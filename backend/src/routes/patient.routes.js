import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  listPatients,
  createPatient,
  updatePatient,
  deletePatient
} from '../controllers/patient.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', requireRole('admin', 'doctor', 'assistant'), listPatients);
router.post('/', requireRole('admin', 'doctor', 'assistant'), createPatient);
router.put('/:id', requireRole('admin', 'doctor', 'assistant'), updatePatient);
router.delete('/:id', requireRole('admin'), deletePatient);

export default router;
