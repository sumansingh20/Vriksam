import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import inventoryController from '../controllers/inventory.controller';

const router = Router();

// All inventory routes require authentication
router.use(authenticate);
router.use(authorize('ADMIN', 'TECHNICIAN'));

// CRUD
router.get('/', inventoryController.list);
router.get('/:id', inventoryController.getById);
router.post('/', inventoryController.create);
router.put('/:id', inventoryController.update);
router.delete('/:id', authorize('ADMIN'), inventoryController.delete);

// Restock
router.post('/:id/restock', inventoryController.restock);

export default router;
