// =============================================================================
// VRIKSHAM - Notification Routes
// =============================================================================
// Mounts notification endpoints under /api/v1/notifications.
// All routes require authentication.
// =============================================================================

import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import notificationsController from '../controllers/notifications.controller';

const router = Router();

// All notification routes require authentication
router.use(authenticate);

// GET /notifications - paginated list with unread count
router.get('/', notificationsController.getNotifications);

// GET /notifications/unread-count - just the unread count
// NOTE: This route must come BEFORE /:id routes to avoid "unread-count" being treated as an ID
router.get('/unread-count', notificationsController.getUnreadCount);

// PATCH /notifications/read-all - mark all as read
// NOTE: This route must come BEFORE /:id routes
router.patch('/read-all', notificationsController.markAllAsRead);

// PATCH /notifications/:id/read - mark single as read
router.patch('/:id/read', notificationsController.markAsRead);

// DELETE /notifications/:id - delete a notification
router.delete('/:id', notificationsController.deleteNotification);

export default router;
