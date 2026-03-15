'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, User, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue';

export interface MaintenanceVisit {
  id: string;
  date: string;
  clientName: string;
  location: string;
  technician: string;
  status: MaintenanceStatus;
}

interface MaintenanceCalendarProps {
  visits?: MaintenanceVisit[];
}

/* -------------------------------------------------------------------------- */
/*  Status config                                                             */
/* -------------------------------------------------------------------------- */

const STATUS_STYLES: Record<MaintenanceStatus, { label: string; className: string }> = {
  scheduled: {
    label: 'Scheduled',
    className: 'bg-sky-500/10 text-sky-700 dark:text-sky-400',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  },
  overdue: {
    label: 'Overdue',
    className: 'bg-red-500/10 text-red-700 dark:text-red-400',
  },
};

/* -------------------------------------------------------------------------- */
/*  Default mock data                                                         */
/* -------------------------------------------------------------------------- */

const DEFAULT_VISITS: MaintenanceVisit[] = [
  { id: '1', date: '2026-03-16', clientName: 'TechCorp Ltd', location: 'Mumbai HQ, Floor 3', technician: 'Raj Patel', status: 'scheduled' },
  { id: '2', date: '2026-03-16', clientName: 'GreenSpace Inc', location: 'Bangalore Office', technician: 'Priya Sharma', status: 'scheduled' },
  { id: '3', date: '2026-03-17', clientName: 'EcoVentures', location: 'Delhi Campus', technician: 'Amit Kumar', status: 'scheduled' },
  { id: '4', date: '2026-03-17', clientName: 'Wellness Hub', location: 'Hyderabad Tower', technician: 'Sneha Reddy', status: 'in_progress' },
  { id: '5', date: '2026-03-18', clientName: 'InfoSys Garden', location: 'Pune SEZ', technician: 'Raj Patel', status: 'scheduled' },
  { id: '6', date: '2026-03-15', clientName: 'StartUp Valley', location: 'Chennai Office', technician: 'Priya Sharma', status: 'overdue' },
  { id: '7', date: '2026-03-14', clientName: 'Metro Living', location: 'Kolkata Mall', technician: 'Amit Kumar', status: 'completed' },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

type SortField = 'date' | 'clientName' | 'technician' | 'status';

export function MaintenanceCalendar({ visits = DEFAULT_VISITS }: MaintenanceCalendarProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortAsc, setSortAsc] = useState(true);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  }

  const sorted = [...visits].sort((a, b) => {
    const dir = sortAsc ? 1 : -1;
    const aVal = a[sortField];
    const bVal = b[sortField];
    return aVal < bVal ? -1 * dir : aVal > bVal ? 1 * dir : 0;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
    >
      <div className="border-b border-gray-200/60 px-5 py-4 dark:border-white/5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Upcoming Maintenance
        </h3>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          Scheduled service visits
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100/80 dark:border-white/5">
              {([
                { field: 'date' as const, label: 'Date', icon: Calendar },
                { field: 'clientName' as const, label: 'Client', icon: User },
                { field: 'technician' as const, label: 'Technician', icon: User },
                { field: 'status' as const, label: 'Status', icon: ArrowUpDown },
              ]).map(({ field, label }) => (
                <th
                  key={field}
                  className="cursor-pointer px-5 py-3 text-left text-xs font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => handleSort(field)}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <ArrowUpDown className="h-3 w-3 opacity-40" />
                  </div>
                </th>
              ))}
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Location
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/80 dark:divide-white/5">
            {sorted.map((visit) => {
              const status = STATUS_STYLES[visit.status];

              return (
                <tr
                  key={visit.id}
                  className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                >
                  <td className="whitespace-nowrap px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {new Date(visit.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 font-medium text-gray-900 dark:text-white">
                    {visit.clientName}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-600 dark:text-gray-400">
                    {visit.technician}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        status.className
                      )}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="text-xs">{visit.location}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default MaintenanceCalendar;
