// =============================================================================
// VRIKSHAM - Notifications Hook
// =============================================================================
// React hook for managing user notifications. Fetches from the REST API,
// listens for real-time updates via WebSocket, and provides mutation methods.
// =============================================================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/services/api';
import type { WebSocketMessage } from './use-websocket';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

interface NotificationsApiResponse {
  success: boolean;
  data: NotificationItem[];
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

interface UseNotificationsOptions {
  /** WebSocket subscribe function from useWebSocket or WebSocketProvider */
  wsSubscribe?: (event: string, handler: (data: unknown, msg: WebSocketMessage) => void) => void;
  /** WebSocket unsubscribe function */
  wsUnsubscribe?: (event: string, handler: (data: unknown, msg: WebSocketMessage) => void) => void;
  /** Whether WebSocket is connected */
  wsConnected?: boolean;
  /** Whether the user is authenticated */
  enabled?: boolean;
  /** Number of notifications per page */
  pageSize?: number;
}

interface UseNotificationsReturn {
  /** List of notifications */
  notifications: NotificationItem[];
  /** Number of unread notifications */
  unreadCount: number;
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Mark a single notification as read */
  markAsRead: (notificationId: string) => Promise<void>;
  /** Mark all notifications as read */
  markAllAsRead: () => Promise<void>;
  /** Delete a notification */
  deleteNotification: (notificationId: string) => Promise<void>;
  /** Refresh notifications from the server */
  refresh: () => Promise<void>;
  /** Load more notifications (next page) */
  loadMore: () => Promise<void>;
  /** Whether there are more notifications to load */
  hasMore: boolean;
}

// -----------------------------------------------------------------------------
// Hook Implementation
// -----------------------------------------------------------------------------

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const {
    wsSubscribe,
    wsUnsubscribe,
    wsConnected = false,
    enabled = true,
    pageSize = 20,
  } = options;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const initialFetchDone = useRef(false);

  // ---------------------------------------------------------------------------
  // Fetch Notifications
  // ---------------------------------------------------------------------------

  const fetchNotifications = useCallback(
    async (page = 1, append = false) => {
      if (!enabled) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get<NotificationsApiResponse>(
          `/notifications?page=${page}&limit=${pageSize}`
        );

        if (response.success) {
          if (append) {
            setNotifications((prev) => [...prev, ...response.data]);
          } else {
            setNotifications(response.data);
          }

          setUnreadCount(response.unreadCount);
          setHasMore(response.pagination.hasNext);
          setCurrentPage(page);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch notifications';
        setError(message);
        console.error('[Notifications] Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [enabled, pageSize]
  );

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await api.patch(`/notifications/${notificationId}/read`);

        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error('[Notifications] markAsRead error:', err);
      }
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await api.patch('/notifications/read-all');

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('[Notifications] markAllAsRead error:', err);
    }
  }, []);

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        await api.delete(`/notifications/${notificationId}`);

        setNotifications((prev) => {
          const removed = prev.find((n) => n.id === notificationId);
          if (removed && !removed.read) {
            setUnreadCount((c) => Math.max(0, c - 1));
          }
          return prev.filter((n) => n.id !== notificationId);
        });
      } catch (err) {
        console.error('[Notifications] deleteNotification error:', err);
      }
    },
    []
  );

  const refresh = useCallback(async () => {
    await fetchNotifications(1, false);
  }, [fetchNotifications]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    await fetchNotifications(currentPage + 1, true);
  }, [fetchNotifications, currentPage, hasMore, isLoading]);

  // ---------------------------------------------------------------------------
  // Initial Fetch
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (enabled && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchNotifications(1, false);
    }
  }, [enabled, fetchNotifications]);

  // ---------------------------------------------------------------------------
  // WebSocket: Listen for Real-Time Notifications
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!wsSubscribe || !wsUnsubscribe || !wsConnected) return;

    const handleNewNotification = (data: unknown) => {
      const alert = data as {
        id: string;
        type: string;
        title: string;
        message: string;
        priority?: string;
        actionUrl?: string;
      };

      // Add the new notification to the top of the list
      const newNotification: NotificationItem = {
        id: alert.id,
        userId: '',
        title: alert.title,
        message: alert.message,
        type: alert.type,
        read: false,
        metadata: { priority: alert.priority, actionUrl: alert.actionUrl },
        createdAt: new Date().toISOString(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Play notification sound (optional -- non-blocking)
      playNotificationSound();
    };

    const handleAllRead = () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    };

    wsSubscribe('notification:new', handleNewNotification);
    wsSubscribe('notifications:all_read', handleAllRead);

    return () => {
      wsUnsubscribe('notification:new', handleNewNotification);
      wsUnsubscribe('notifications:all_read', handleAllRead);
    };
  }, [wsSubscribe, wsUnsubscribe, wsConnected]);

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
    loadMore,
    hasMore,
  };
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Play a subtle notification sound. Fails silently if the browser blocks audio.
 */
function playNotificationSound(): void {
  try {
    if (typeof window === 'undefined') return;

    // Create a short beep using the Web Audio API
    const audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.1;

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch {
    // Audio not supported or blocked -- ignore silently
  }
}

export default useNotifications;
