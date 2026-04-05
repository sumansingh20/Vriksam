import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import analyticsController from '../controllers/analytics.controller';

const router = Router();

// All analytics routes require authentication and admin/technician access
router.use(authenticate);
router.use(authorize('ADMIN', 'TECHNICIAN', 'PARTNER', 'CLIENT'));

router.get('/overview', analyticsController.getOverview);
router.get('/plants', analyticsController.getPlantMetrics);
router.get('/revenue', analyticsController.getRevenue);
router.get('/maintenance', analyticsController.getMaintenance);
router.get('/esg', analyticsController.getESG);
router.get('/teams', analyticsController.getTeams);

export default router;
