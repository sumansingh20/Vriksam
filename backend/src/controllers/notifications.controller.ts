// =============================================================================
// VRIKSHAM - Notifications Controller
// =============================================================================
// REST endpoints for managing user notifications. All routes require
// authentication; users can only access their own notifications.
// =============================================================================

import { Request, Response } from 'express';
import notificationService from '../services/notification.service';
import { NotificationType } from '@prisma/client';

const notificationsController = {
  /**
   * GET /notifications
   * Returns a paginated list of notifications for the authenticated user,
   * including the current unread count.
   */
  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const type = req.query.type as NotificationType | undefined;
      const unreadOnly = req.query.unreadOnly === 'true';

      const result = await notificationService.getNotifications(userId, {
        page,
        limit,
        type,
        unreadOnly,
      });

      res.status(200).json({
        success: true,
        data: result.notifications,
        pagination: result.pagination,
        unreadCount: result.unreadCount,
      });
    } catch (error) {
      console.error('[NotificationsController] getNotifications error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch notifications.',
      });
    }
  },

  /**
   * PATCH /notifications/:id/read
   * Mark a single notification as read.
   */
  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const notificationId = req.params.id;

      if (!notificationId) {
        res.status(400).json({
          success: false,
          error: 'Notification ID is required.',
        });
        return;
      }

      const notification = await notificationService.markAsRead(notificationId, userId);

      if (!notification) {
        res.status(404).json({
          success: false,
          error: 'Notification not found.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: notification,
        message: 'Notification marked as read.',
      });
    } catch (error) {
      console.error('[NotificationsController] markAsRead error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark notification as read.',
      });
    }
  },

  /**
   * PATCH /notifications/read-all
   * Mark all notifications as read for the authenticated user.
   */
  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const count = await notificationService.markAllAsRead(userId);

      res.status(200).json({
        success: true,
        data: { markedCount: count },
        message: `${count} notification(s) marked as read.`,
      });
    } catch (error) {
      console.error('[NotificationsController] markAllAsRead error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark all notifications as read.',
      });
    }
  },

  /**
   * DELETE /notifications/:id
   * Delete a notification. Only the owner can delete.
   */
  async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const notificationId = req.params.id;

      if (!notificationId) {
        res.status(400).json({
          success: false,
          error: 'Notification ID is required.',
        });
        return;
      }

      const deleted = await notificationService.deleteNotification(notificationId, userId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Notification not found.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Notification deleted.',
      });
    } catch (error) {
      console.error('[NotificationsController] deleteNotification error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete notification.',
      });
    }
  },

  /**
   * GET /notifications/unread-count
   * Returns the number of unread notifications for the authenticated user.
   */
  async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const count = await notificationService.getUnreadCount(userId);

      res.status(200).json({
        success: true,
        data: { unreadCount: count },
      });
    } catch (error) {
      console.error('[NotificationsController] getUnreadCount error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch unread count.',
      });
    }
  },
};

export default notificationsController;
