import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import aiController from '../controllers/ai.controller';

const router = Router();

// All AI routes require authentication
router.use(authenticate);

router.post('/plant-diagnosis', aiController.plantDiagnosis);
router.post('/health-prediction', aiController.healthPrediction);
router.post('/care-recommendation', aiController.careRecommendation);
router.post('/chat', aiController.chat);

export default router;
