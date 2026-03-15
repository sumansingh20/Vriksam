import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import techniciansController from '../controllers/technicians.controller';

const router = Router();

// All technician routes require authentication
router.use(authenticate);

// CRUD
router.get('/', techniciansController.list);
router.get('/:id', techniciansController.getById);
router.post('/', authorize('ADMIN'), techniciansController.create);
router.put('/:id', authorize('ADMIN', 'TECHNICIAN'), techniciansController.update);
router.delete('/:id', authorize('ADMIN'), techniciansController.delete);

// Technician-specific endpoints
router.get('/:id/schedule', techniciansController.getSchedule);
router.get('/:id/performance', authorize('ADMIN', 'TECHNICIAN'), techniciansController.getPerformance);

export default router;
