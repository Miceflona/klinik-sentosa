// backend/src/routes/patient.routes.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import {
  getPatientProfile,
  updatePatientProfile,
  getPatientVisits,
  getPatientQueueStatus
} from '../controllers/patient.controller.js';

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole(['pasien']));

router.get('/me', getPatientProfile);
router.put('/me', updatePatientProfile);
router.get('/me/visits', getPatientVisits);
router.get('/me/queue', getPatientQueueStatus);

export default router;