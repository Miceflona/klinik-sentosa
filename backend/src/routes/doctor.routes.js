// backend/src/routes/doctor.routes.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import {
  getDoctorQueue,
  getPatientRecords,
  createMedicalRecord,
  completeExamination
} from '../controllers/doctor.controller.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole(['dokter', 'admin']));

router.get('/queue', getDoctorQueue);
router.get('/patients/:id/records', getPatientRecords);
router.post('/records', createMedicalRecord);
router.patch('/records/:id/complete', completeExamination);

export default router;