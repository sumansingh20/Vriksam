import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createClientSchema, updateClientSchema } from '../validators/client.validator';
import clientsController from '../controllers/clients.controller';

const router = Router();

// All client routes require authentication
router.use(authenticate);

// CRUD
router.get('/', clientsController.list);
router.get('/:id', clientsController.getById);
router.post('/', authorize('ADMIN'), validate(createClientSchema), clientsController.create);
router.put('/:id', authorize('ADMIN', 'CLIENT'), validate(updateClientSchema), clientsController.update);
router.delete('/:id', authorize('ADMIN'), clientsController.delete);

// Client relations
router.get('/:id/locations', clientsController.getLocations);
router.get('/:id/plants', clientsController.getPlants);
router.get('/:id/subscriptions', clientsController.getSubscriptions);

export default router;
