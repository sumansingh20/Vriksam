'use client';

import {
  Sprout,
  CalendarPlus,
  FileText,
  UserPlus,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface QuickAction {
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
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
    label: 'Add plant',
    description: 'Register new inventory',
    icon: Sprout,
    href: '/admin/plants/new',
  },
  {
    label: 'Schedule visit',
    description: 'Book maintenance',
    icon: CalendarPlus,
    href: '/admin/maintenance/new',
  },
  {
    label: 'Create invoice',
    description: 'Bill a client',
    icon: FileText,
    href: '/admin/invoices/new',
  },
  {
    label: 'Add client',
    description: 'Onboard new client',
    icon: UserPlus,
    href: '/admin/clients/new',
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function QuickActions({ actions = DEFAULT_ACTIONS, onAction }: QuickActionsProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">
        Quick actions
      </h3>
      <div className="flex flex-col gap-1.5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => onAction?.(action.href)}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left',
                'transition-colors duration-150',
                'hover:bg-gray-50',
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 transition-colors group-hover:bg-gray-200">
                <Icon className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{action.label}</p>
                <p className="text-xs text-gray-400">{action.description}</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
