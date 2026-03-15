'use client';

import { motion } from 'framer-motion';
import {
  Sprout,
  CalendarPlus,
  FileText,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface QuickAction {
  label: string;
  icon: LucideIcon;
  href: string;
  color: string;
  bg: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  onAction?: (href: string) => void;
}

/* -------------------------------------------------------------------------- */
/*  Default actions                                                           */
/* -------------------------------------------------------------------------- */

const DEFAULT_ACTIONS: QuickAction[] = [
  {
    label: 'Add Plant',
    icon: Sprout,
    href: '/admin/plants/new',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
  },
  {
    label: 'Schedule Visit',
    icon: CalendarPlus,
    href: '/admin/maintenance/new',
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-500/10 group-hover:bg-sky-500/20',
  },
  {
    label: 'Create Invoice',
    icon: FileText,
    href: '/admin/invoices/new',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-500/10 group-hover:bg-violet-500/20',
  },
  {
    label: 'Add Client',
    icon: UserPlus,
    href: '/admin/clients/new',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10 group-hover:bg-amber-500/20',
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function QuickActions({ actions = DEFAULT_ACTIONS, onAction }: QuickActionsProps) {
  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAction?.(action.href)}
              className="group flex flex-col items-center gap-2.5 rounded-xl border border-gray-100/80 bg-gray-50/50 p-4 transition-all duration-200 hover:border-gray-200 hover:shadow-sm dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/10"
            >
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-200',
                  action.bg
                )}
              >
                <Icon className={cn('h-5 w-5', action.color)} />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
