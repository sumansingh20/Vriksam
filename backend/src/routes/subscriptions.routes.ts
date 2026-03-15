import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
  pauseSubscriptionSchema,
  cancelSubscriptionSchema,
} from '../validators/subscription.validator';
import subscriptionsController from '../controllers/subscriptions.controller';

const router = Router();

// All subscription routes require authentication
router.use(authenticate);

// CRUD
router.get('/', subscriptionsController.list);
router.get('/:id', subscriptionsController.getById);
router.post('/', authorize('ADMIN'), validate(createSubscriptionSchema), subscriptionsController.create);
router.put('/:id', authorize('ADMIN'), validate(updateSubscriptionSchema), subscriptionsController.update);
router.delete('/:id', authorize('ADMIN'), subscriptionsController.delete);

// Subscription actions
router.post('/:id/pause', authorize('ADMIN', 'CLIENT'), validate(pauseSubscriptionSchema), subscriptionsController.pause);
router.post('/:id/resume', authorize('ADMIN', 'CLIENT'), subscriptionsController.resume);
router.post('/:id/cancel', authorize('ADMIN', 'CLIENT'), validate(cancelSubscriptionSchema), subscriptionsController.cancel);

export default router;
