import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  listPatients,
  createPatient,
  updatePatient,
  deletePatient
} from '../controllers/patient.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', listPatients);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

export default router;

