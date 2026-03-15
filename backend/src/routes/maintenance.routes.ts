import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import maintenanceController from '../controllers/maintenance.controller';

const router = Router();

// All maintenance routes require authentication
router.use(authenticate);

// Schedule view (must be before /:id to avoid conflict)
router.get('/schedule', maintenanceController.getSchedule);

// CRUD
router.get('/', maintenanceController.list);
router.get('/:id', maintenanceController.getById);
router.post('/', authorize('ADMIN', 'TECHNICIAN'), maintenanceController.create);
router.put('/:id', authorize('ADMIN', 'TECHNICIAN'), maintenanceController.update);
router.delete('/:id', authorize('ADMIN'), maintenanceController.delete);

// Complete a service visit
router.put('/:id/complete', authorize('ADMIN', 'TECHNICIAN'), maintenanceController.complete);

export default router;
