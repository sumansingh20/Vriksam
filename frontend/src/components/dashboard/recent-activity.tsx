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
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-500/10',
  },
  health_alert: {
    icon: AlertTriangle,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
  },
  payment: {
    icon: CreditCard,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  new_client: {
    icon: UserPlus,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-500/10',
  },
  plant: {
    icon: Sprout,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-500/10',
  },
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function RecentActivity({ activities, maxHeight = '400px' }: RecentActivityProps) {
  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
      <div className="border-b border-gray-200/60 px-5 py-4 dark:border-white/5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h3>
      </div>

      <div
        className="overflow-y-auto scrollbar-thin"
        style={{ maxHeight }}
      >
        <div className="divide-y divide-gray-100/80 dark:divide-white/5">
          {activities.map((activity, index) => {
            const config = TYPE_CONFIG[activity.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
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
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {activity.description}
                  </p>
                  {activity.user && (
                    <p className="mt-0.5 text-xs text-gray-400">by {activity.user}</p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
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
