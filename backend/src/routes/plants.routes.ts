import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createPlantSchema,
  updatePlantSchema,
  healthLogSchema,
  createSpeciesSchema,
} from '../validators/plant.validator';
import plantsController from '../controllers/plants.controller';

const router = Router();

// All plant routes require authentication
router.use(authenticate);

// Species routes (must be before /:id to avoid conflict)
router.get('/species', plantsController.listSpecies);
router.post('/species', authorize('ADMIN'), validate(createSpeciesSchema), plantsController.createSpecies);

// CRUD
router.get('/', plantsController.list);
router.get('/:id', plantsController.getById);
router.post('/', authorize('ADMIN', 'TECHNICIAN'), validate(createPlantSchema), plantsController.create);
router.put('/:id', authorize('ADMIN', 'TECHNICIAN'), validate(updatePlantSchema), plantsController.update);
router.delete('/:id', authorize('ADMIN'), plantsController.delete);

// Health logs
router.get('/:id/health-logs', plantsController.getHealthLogs);
router.post('/:id/health-check', authorize('ADMIN', 'TECHNICIAN'), validate(healthLogSchema), plantsController.createHealthCheck);

export default router;
