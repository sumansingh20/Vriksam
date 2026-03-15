import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import usersController from '../controllers/users.controller';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// List users (admin only)
router.get('/', authorize('ADMIN'), usersController.list);

// Get user by ID (admin or self)
router.get('/:id', usersController.getById);

// Update user (admin or self)
router.put('/:id', usersController.update);

// Delete (deactivate) user - admin only
router.delete('/:id', authorize('ADMIN'), usersController.delete);

export default router;
