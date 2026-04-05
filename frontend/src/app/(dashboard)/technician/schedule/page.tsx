'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sprout,
  Filter,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import api from '@/services/api';
import { cn } from '@/lib/utils';

type VisitStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface ScheduleVisitApi {
  id: string;
  status: string;
  scheduledDate: string;
  plant?: {
    location?: {
      name?: string;
      client?: {
        companyName?: string;
      };
    };
  };
}

interface ScheduleDayApi {
  date: string;
  visits: ScheduleVisitApi[];
  totalVisits: number;
  completedCount: number;
}

interface ScheduleVisit {
  id: string;
  dateKey: string;
  time: string;
  clientName: string;
  location: string;
  plantsCount: number;
  status: VisitStatus;
}

const STATUS_COLORS: Record<VisitStatus, string> = {
  pending: 'border-l-sky-500 bg-sky-50/80 dark:bg-sky-500/5',
  in_progress: 'border-l-amber-500 bg-amber-50/80 dark:bg-amber-500/5',
  completed: 'border-l-emerald-500 bg-emerald-50/80 dark:bg-emerald-500/5',
  cancelled: 'border-l-gray-400 bg-gray-50/80 dark:bg-gray-500/5 opacity-60',
  overdue: 'border-l-red-500 bg-red-50/80 dark:bg-red-500/5',
};

const STATUS_LABELS: Record<VisitStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  overdue: 'Overdue',
};

function startOfWeek(value: Date): Date {
  const date = new Date(value);
  const day = date.getDay();
  const delta = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + delta);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function normalizeStatus(value: string): VisitStatus {
  const status = value.toLowerCase();
  if (status.includes('complete')) return 'completed';
  if (status.includes('progress')) return 'in_progress';
  if (status.includes('cancel')) return 'cancelled';
  if (status.includes('miss') || status.includes('overdue')) return 'overdue';
  return 'pending';
}

function VisitSlot({ visit }: { visit: ScheduleVisit }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'cursor-pointer rounded-lg border-l-4 p-2.5 transition-shadow hover:shadow-sm',
        STATUS_COLORS[visit.status],
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-900 dark:text-white">{visit.time}</span>
        <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-gray-900/60">
          {STATUS_LABELS[visit.status]}
        </span>
      </div>
      <p className="mt-1 truncate text-xs font-semibold text-gray-800 dark:text-gray-200">{visit.clientName}</p>
      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-gray-500">
        <MapPin className="h-2.5 w-2.5" />
        <span className="truncate">{visit.location}</span>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-gray-500">
        <Sprout className="h-2.5 w-2.5" />
        {visit.plantsCount} plants
      </div>
    </motion.div>
  );
}

type StatusFilter = 'all' | VisitStatus;

export default function TechnicianSchedulePage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(() => addDays(startOfWeek(new Date()), weekOffset * 7), [weekOffset]);
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  const scheduleQuery = useQuery({
    queryKey: ['technician', 'schedule', weekStart.toISOString()],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<ScheduleDayApi[]>>('/service-visits/schedule', {
        params: {
          from: weekStart.toISOString(),
          to: addDays(weekEnd, 1).toISOString(),
        },
      });

      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = addDays(weekStart, index);
        return {
          key: date.toISOString().split('T')[0] || '',
          label: date.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' }),
          isToday: date.toDateString() === new Date().toDateString(),
        };
      }),
    [weekStart],
  );

  const visits = useMemo<ScheduleVisit[]>(() => {
    return (scheduleQuery.data ?? []).flatMap((day) =>
      day.visits.map((visit) => ({
        id: visit.id,
        dateKey: day.date,
        time: new Date(visit.scheduledDate).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        clientName: visit.plant?.location?.client?.companyName || 'Client account',
        location: visit.plant?.location?.name || 'Site location',
        plantsCount: 1,
        status: normalizeStatus(visit.status),
      })),
    );
  }, [scheduleQuery.data]);

  const filteredVisits = useMemo(
    () =>
      statusFilter === 'all'
        ? visits
        : visits.filter((visit) => visit.status === statusFilter),
    [statusFilter, visits],
  );

  const weekStats = useMemo(
    () => ({
      total: visits.length,
      pending: visits.filter((visit) => visit.status === 'pending').length,
      plants: visits.reduce((sum, visit) => sum + visit.plantsCount, 0),
      cancelled: visits.filter((visit) => visit.status === 'cancelled').length,
    }),
    [visits],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Schedule"
        description="Your live service visits for the selected week."
        breadcrumbs={[
          { label: 'Technician', href: '/technician' },
          { label: 'Schedule' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset((current) => current - 1)}
              aria-label="Previous week"
              title="Previous week"
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {weekStart.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - {weekEnd.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <button
              onClick={() => setWeekOffset((current) => current + 1)}
              aria-label="Next week"
              title="Next week"
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        }
      />

      {scheduleQuery.isLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200/70 bg-white/80 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading weekly schedule...
        </div>
      )}

      {scheduleQuery.isError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
          Unable to load schedule data right now.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-gray-400" />
        {(['all', 'pending', 'in_progress', 'completed', 'cancelled', 'overdue'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
              statusFilter === status
                ? 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-400',
            )}
          >
            {status === 'all' ? 'All' : STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
      >
        <div className="grid grid-cols-7 divide-x divide-gray-200/60 dark:divide-white/5">
          {days.map((day) => {
            const dayVisits = filteredVisits.filter((visit) => visit.dateKey.startsWith(day.key));

            return (
              <div key={day.key} className="min-h-[300px]">
                <div
                  className={cn(
                    'border-b border-gray-200/60 p-3 text-center text-xs font-semibold dark:border-white/5',
                    day.isToday
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : 'text-gray-600 dark:text-gray-400',
                  )}
                >
                  {day.label}
                  {day.isToday && (
                    <span className="ml-1 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold text-white">TODAY</span>
                  )}
                </div>

                <div className="space-y-2 p-2">
                  {dayVisits.map((visit) => (
                    <VisitSlot key={visit.id} visit={visit} />
                  ))}
                  {dayVisits.length === 0 && (
                    <div className="flex h-20 items-center justify-center">
                      <p className="text-[10px] text-gray-300 dark:text-gray-600">No visits</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200/60 bg-white/80 p-4 text-center backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{weekStats.total}</p>
          <p className="text-xs text-gray-500">Total This Week</p>
        </div>
        <div className="rounded-xl border border-gray-200/60 bg-white/80 p-4 text-center backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
          <p className="text-2xl font-bold text-sky-600">{weekStats.pending}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="rounded-xl border border-gray-200/60 bg-white/80 p-4 text-center backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
          <p className="text-2xl font-bold text-emerald-600">{weekStats.plants}</p>
          <p className="text-xs text-gray-500">Plants to Service</p>
        </div>
        <div className="rounded-xl border border-gray-200/60 bg-white/80 p-4 text-center backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
          <p className="text-2xl font-bold text-gray-400">{weekStats.cancelled}</p>
          <p className="text-xs text-gray-500">Cancelled</p>
        </div>
      </div>
    </div>
  );
}
