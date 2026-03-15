// =============================================================================
// VRIKSHAM - Notification Service
// =============================================================================
// Handles creating, fetching, updating, and deleting notifications.
// Persists to PostgreSQL via Prisma and pushes real-time events through
// the WebSocket service.
// =============================================================================

import prisma from '../config/database';
import { NotificationType, Prisma } from '@prisma/client';
import websocketService from './websocket.service';
import redisService, { CACHE_KEYS, CACHE_TTL } from './redis.service';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  metadata?: Record<string, unknown>;
}

export interface GetNotificationsOptions {
  page?: number;
  limit?: number;
  type?: NotificationType;
  unreadOnly?: boolean;
}

export interface NotificationListResult {
  notifications: NotificationRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  unreadCount: number;
}

interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  metadata: Prisma.JsonValue;
  createdAt: Date;
}

// -----------------------------------------------------------------------------
// Notification Service
// -----------------------------------------------------------------------------

const notificationService = {
  /**
   * Create a new notification, persist it to the database,
   * and push a real-time event via WebSocket.
   */
  async createNotification(data: CreateNotificationInput): Promise<NotificationRecord> {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        metadata: data.metadata ? (data.metadata as Prisma.InputJsonValue) : undefined,
        read: false,
      },
    });

    // Invalidate the cached unread count for this user
    await redisService.del(CACHE_KEYS.NOTIFICATION_UNREAD(data.userId));

    // Push real-time notification via WebSocket
    websocketService.notifyNewAlert(data.userId, {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      priority: getPriorityFromType(notification.type),
    });

    return notification;
  },

  /**
   * Get paginated notifications for a user, along with their unread count.
   */
  async getNotifications(
    userId: string,
    options: GetNotificationsOptions = {}
  ): Promise<NotificationListResult> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = { userId };

    if (options.type) {
      where.type = options.type;
    }

    if (options.unreadOnly) {
      where.read = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, read: false } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      unreadCount,
    };
  },

  /**
   * Mark a single notification as read.
   */
  async markAsRead(notificationId: string, userId: string): Promise<NotificationRecord | null> {
    // Verify ownership before updating
    const existing = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!existing) {
      return null;
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    // Invalidate cached unread count
    await redisService.del(CACHE_KEYS.NOTIFICATION_UNREAD(userId));

    return updated;
  },

  /**
   * Mark all notifications as read for a user.
   */
  async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    // Invalidate cached unread count
    await redisService.del(CACHE_KEYS.NOTIFICATION_UNREAD(userId));

    // Notify the user via WebSocket that all are read
    websocketService.sendToUser(userId, 'notifications:all_read', {
      count: result.count,
    });

    return result.count;
  },

  /**
   * Delete (hard delete) a notification. Only the owner can delete.
   */
  async deleteNotification(
    notificationId: string,
    userId: string
  ): Promise<boolean> {
    const existing = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!existing) {
      return false;
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    // Invalidate cached unread count if the deleted notification was unread
    if (!existing.read) {
      await redisService.del(CACHE_KEYS.NOTIFICATION_UNREAD(userId));
    }

    return true;
  },

  /**
   * Get the count of unread notifications for a user.
   * Uses Redis cache with a short TTL for performance.
   */
  async getUnreadCount(userId: string): Promise<number> {
    return redisService.getOrSet(
      CACHE_KEYS.NOTIFICATION_UNREAD(userId),
      async () => {
        return prisma.notification.count({
          where: { userId, read: false },
        });
      },
      CACHE_TTL.SHORT
    );
  },
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Map notification types to priority levels for the WebSocket alert payload.
 */
function getPriorityFromType(type: NotificationType): string {
  switch (type) {
    case 'PLANT_ALERT':
      return 'high';
    case 'PAYMENT_DUE':
      return 'high';
    case 'SERVICE_REMINDER':
      return 'medium';
    case 'VISIT_COMPLETED':
      return 'medium';
    case 'SYSTEM':
      return 'low';
    case 'PROMOTION':
      return 'low';
    default:
      return 'medium';
  }
}

export default notificationService;
