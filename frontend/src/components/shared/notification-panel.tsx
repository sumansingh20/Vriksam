// =============================================================================
// VRIKSHAM - Notification Panel Component
// =============================================================================
// A dropdown panel triggered from a bell icon that displays the user's
// notifications with type-based color coding, time-ago formatting,
// unread indicators, and mark-all-read functionality.
// =============================================================================

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { NotificationItem } from '@/hooks/use-notifications';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface NotificationPanelProps {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading?: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onNotificationClick?: (notification: NotificationItem) => void;
  className?: string;
}

// -----------------------------------------------------------------------------
// Type -> Style Mapping
// -----------------------------------------------------------------------------

const TYPE_CONFIG: Record<
  string,
  { icon: string; color: string; bgColor: string; label: string }
> = {
  PLANT_ALERT: {
    icon: 'leaf',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    label: 'Plant Alert',
  },
  SERVICE_REMINDER: {
    icon: 'wrench',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    label: 'Maintenance',
  },
  VISIT_COMPLETED: {
    icon: 'check-circle',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    label: 'Visit Complete',
  },
  PAYMENT_DUE: {
    icon: 'credit-card',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    label: 'Payment',
  },
  SYSTEM: {
    icon: 'info',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    label: 'System',
  },
  PROMOTION: {
    icon: 'megaphone',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    label: 'Promotion',
  },
};

const DEFAULT_TYPE_CONFIG = {
  icon: 'bell',
  color: 'text-gray-500',
  bgColor: 'bg-gray-50',
  label: 'Notification',
};

// -----------------------------------------------------------------------------
// SVG Icons (inline to avoid external dependency issues)
// -----------------------------------------------------------------------------

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function NotificationTypeIcon({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  const config = TYPE_CONFIG[type] || DEFAULT_TYPE_CONFIG;

  return (
    <div
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
        config.bgColor,
        className
      )}
    >
      <span className={cn('text-sm', config.color)}>
        {config.icon === 'leaf' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.5 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
        )}
        {config.icon === 'wrench' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        )}
        {config.icon === 'check-circle' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        )}
        {config.icon === 'credit-card' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        )}
        {config.icon === 'info' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )}
        {config.icon === 'megaphone' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 11 18-5v12L3 13v-2z" />
            <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
          </svg>
        )}
        {config.icon === 'bell' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        )}
      </span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Time Ago Formatting
// -----------------------------------------------------------------------------

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;

  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });
}

// -----------------------------------------------------------------------------
// Animation Variants
// -----------------------------------------------------------------------------

const panelVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -8,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.2,
    },
  }),
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function NotificationPanel({
  notifications,
  unreadCount,
  isLoading = false,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onNotificationClick,
  className,
}: NotificationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleNotificationClick = useCallback(
    (notification: NotificationItem) => {
      if (!notification.read) {
        onMarkAsRead(notification.id);
      }
      onNotificationClick?.(notification);
    },
    [onMarkAsRead, onNotificationClick]
  );

  return (
    <div ref={panelRef} className={cn('relative', className)}>
      {/* Trigger: Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-full z-50 mt-2 w-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-green-600 transition-colors hover:bg-green-50"
                >
                  <CheckIcon />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-[400px] overflow-y-auto">
              {isLoading && notifications.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
                </div>
              ) : notifications.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center px-4 py-10">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
                    <BellIcon className="h-7 w-7 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    All caught up!
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    No new notifications at the moment.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map((notification, index) => {
                    const typeConfig =
                      TYPE_CONFIG[notification.type] || DEFAULT_TYPE_CONFIG;

                    return (
                      <motion.div
                        key={notification.id}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className={cn(
                          'group relative flex cursor-pointer gap-3 px-4 py-3 transition-colors hover:bg-gray-50',
                          !notification.read && 'bg-green-50/30'
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {/* Type Icon */}
                        <NotificationTypeIcon type={notification.type} />

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={cn(
                                'text-sm leading-tight',
                                notification.read
                                  ? 'font-normal text-gray-700'
                                  : 'font-semibold text-gray-900'
                              )}
                            >
                              {notification.title}
                            </p>

                            {/* Unread dot */}
                            {!notification.read && (
                              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                            )}
                          </div>

                          <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                            {notification.message}
                          </p>

                          <div className="mt-1 flex items-center gap-2">
                            <span
                              className={cn(
                                'text-[10px] font-medium uppercase tracking-wide',
                                typeConfig.color
                              )}
                            >
                              {typeConfig.label}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {timeAgo(notification.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons (visible on hover) */}
                        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsRead(notification.id);
                              }}
                              className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
                              title="Mark as read"
                            >
                              <CheckIcon />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(notification.id);
                            }}
                            className="rounded p-1 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-500"
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-md py-1.5 text-center text-xs font-medium text-green-600 transition-colors hover:bg-green-50"
                >
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationPanel;
