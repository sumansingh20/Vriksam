'use client';

import { motion } from 'framer-motion';
import {
  Wrench,
  AlertTriangle,
  CreditCard,
  UserPlus,
  Sprout,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type ActivityType = 'maintenance' | 'health_alert' | 'payment' | 'new_client' | 'plant';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  timeAgo: string;
  user?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  maxHeight?: string;
}

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

const TYPE_CONFIG: Record<
  ActivityType,
  { icon: LucideIcon; color: string; bg: string }
> = {
  maintenance: {
    icon: Wrench,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
  },
  health_alert: {
    icon: AlertTriangle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  payment: {
    icon: CreditCard,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  new_client: {
    icon: UserPlus,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  plant: {
    icon: Sprout,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function RecentActivity({ activities, maxHeight = '400px' }: RecentActivityProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-5 py-4">
        <h3 className="text-sm font-semibold text-gray-900">
          Recent Activity
        </h3>
      </div>

      <div
        className="overflow-y-auto scrollbar-thin"
        style={{ maxHeight }}
      >
        <div className="divide-y divide-gray-100">
          {activities.map((activity, index) => {
            const config = TYPE_CONFIG[activity.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-gray-50"
              >
                <div
                  className={cn(
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    config.bg
                  )}
                >
                  <Icon className={cn('h-4 w-4', config.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-700">
                    {activity.description}
                  </p>
                  {activity.user && (
                    <p className="mt-0.5 text-xs text-gray-400">by {activity.user}</p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-gray-400">
                  {activity.timeAgo}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RecentActivity;
