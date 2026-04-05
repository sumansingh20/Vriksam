'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  MapPin,
  User,
  Sprout,
  Star,
  CheckCircle,
  Plus,
  MessageSquare,
  X,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

type LogStatus = 'completed' | 'partial' | 'skipped';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface VisitApi {
  id: string;
  status: string;
  scheduledDate: string;
  notes?: string | null;
  plant?: {
    location?: {
      name?: string;
      client?: {
        companyName?: string;
      };
    };
  };
}

interface MaintenanceEntry {
  id: string;
  date: string;
  time: string;
  location: string;
  client: string;
  plantsServiced: number;
  duration: string;
  status: LogStatus;
  notes: string;
}

const STATUS_STYLES: Record<LogStatus, { label: string; className: string }> = {
  completed: {
    label: 'Completed',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  },
  partial: {
    label: 'Partial',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  skipped: {
    label: 'Skipped',
    className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
  },
};

function normalizeStatus(value: string): LogStatus {
  const status = value.toLowerCase();
  if (status.includes('complete')) return 'completed';
  if (status.includes('miss') || status.includes('cancel')) return 'skipped';
  return 'partial';
}

export default function TechnicianMaintenanceLogPage() {
  const [showNewEntry, setShowNewEntry] = useState(false);

  const visitsQuery = useQuery({
    queryKey: ['technician', 'maintenance', 'logs'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<VisitApi[]> & { pagination?: unknown }>('/service-visits', {
        params: {
          page: 1,
          limit: 300,
          sortBy: 'scheduledDate',
          sortOrder: 'desc',
        },
      });

      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const fullLog = useMemo<MaintenanceEntry[]>(
    () =>
      (visitsQuery.data ?? []).map((visit) => ({
        id: visit.id,
        date: visit.scheduledDate,
        time: new Date(visit.scheduledDate).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        location: visit.plant?.location?.name || 'Site location',
        client: visit.plant?.location?.client?.companyName || 'Client account',
        plantsServiced: 1,
        duration: '1h',
        status: normalizeStatus(visit.status),
        notes: visit.notes || 'No visit notes submitted.',
      })),
    [visitsQuery.data],
  );

  const today = new Date().toDateString();

  const todayEntries = useMemo(
    () => fullLog.filter((entry) => new Date(entry.date).toDateString() === today),
    [fullLog, today],
  );

  const weekStart = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 6);
    return date;
  }, []);

  const weekEntries = useMemo(
    () => fullLog.filter((entry) => new Date(entry.date) >= weekStart),
    [fullLog, weekStart],
  );

  const weekVisitsCompleted = weekEntries.filter((entry) => entry.status === 'completed').length;
  const weekPlantsMaintained = weekEntries.reduce((sum, entry) => sum + entry.plantsServiced, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance Log"
        description="Track and review your completed maintenance activities."
        breadcrumbs={[
          { label: 'Technician', href: '/technician' },
          { label: 'Maintenance Log' },
        ]}
        actions={
          <button
            onClick={() => setShowNewEntry(!showNewEntry)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40"
          >
            <Plus className="h-4 w-4" />
            Log New Entry
          </button>
        }
      />

      {visitsQuery.isLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200/70 bg-white/80 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading maintenance logs...
        </div>
      )}

      {visitsQuery.isError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
          Unable to load maintenance logs right now.
        </div>
      )}

      <AnimatePresence>
        {showNewEntry && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/30 p-6 dark:border-emerald-500/20 dark:bg-emerald-500/5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">New Maintenance Entry</h3>
                <button onClick={() => setShowNewEntry(false)} className="text-gray-400 hover:text-gray-600" title="Close new entry form">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Client</label>
                  <input type="text" placeholder="Client name" className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Location</label>
                  <input type="text" placeholder="Location" className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Plants Serviced</label>
                  <input type="number" placeholder="0" className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Duration</label>
                  <input type="text" placeholder="e.g., 1h 30m" className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Notes</label>
                  <textarea rows={2} placeholder="Maintenance notes..." className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white" />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600" disabled>
                  Save Entry
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            icon: CheckCircle,
            label: 'Visits Completed',
            value: `${weekVisitsCompleted}`,
            color: 'text-emerald-600',
            bg: 'bg-emerald-500/10',
          },
          {
            icon: Sprout,
            label: 'Plants Maintained',
            value: `${weekPlantsMaintained}`,
            color: 'text-green-600',
            bg: 'bg-green-500/10',
          },
          {
            icon: Star,
            label: 'Completion Rate',
            value: `${weekEntries.length > 0 ? Math.round((weekVisitsCompleted / weekEntries.length) * 100) : 0}%`,
            color: 'text-violet-600',
            bg: 'bg-violet-500/10',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
          >
            <div className={cn('mb-3 inline-flex rounded-xl p-2.5', stat.bg)}>
              <stat.icon className={cn('h-5 w-5', stat.color)} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="mt-0.5 text-xs text-gray-400">Last 7 days</p>
          </motion.div>
        ))}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Today Completed Visits</h3>
        <div className="space-y-3">
          {todayEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-gray-200/60 bg-white/80 p-4 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
            >
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                    <Clock className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{entry.time}</p>
                    <p className="text-[10px] text-gray-400">{entry.duration}</p>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {entry.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {entry.client}
                    </span>
                    <span className="flex items-center gap-1">
                      <Sprout className="h-3 w-3" />
                      {entry.plantsServiced} plants
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500">
                    <MessageSquare className="mr-1 inline h-3 w-3" />
                    {entry.notes}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {todayEntries.length === 0 && !visitsQuery.isLoading && (
            <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500 dark:border-white/10 dark:text-gray-400">
              No completed visits logged today.
            </div>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
      >
        <div className="border-b border-gray-100 px-6 py-4 dark:border-white/5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Full Maintenance Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-50 dark:border-white/5">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Client</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Plants</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Duration</th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {fullLog.map((entry) => {
                const status = STATUS_STYLES[entry.status];

                return (
                  <tr key={entry.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                    <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">
                      <div>
                        <p className="font-medium">
                          {new Date(entry.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </p>
                        <p className="text-[10px] text-gray-400">{entry.time}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{entry.location}</td>
                    <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{entry.client}</td>
                    <td className="px-6 py-3 text-center text-sm font-medium text-gray-900 dark:text-white">{entry.plantsServiced}</td>
                    <td className="px-6 py-3 text-center text-sm text-gray-500">{entry.duration}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold', status.className)}>
                        {status.label}
                      </span>
                    </td>
                    <td className="max-w-[220px] truncate px-6 py-3 text-xs text-gray-500">{entry.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
