'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  Leaf,
  FileText,
  X,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Timer,
  CalendarClock,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import api from '@/services/api';
import { cn } from '@/lib/utils';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface VisitRow {
  id: string;
  status: string;
  scheduledDate: string;
  notes?: string | null;
  technicianId: string;
  technician?: {
    user?: {
      name?: string;
    };
  };
  plant?: {
    nickname?: string;
    species?: {
      commonName?: string;
    };
    location?: {
      name?: string;
      client?: {
        companyName?: string;
      };
    };
  };
}

interface VisitCardData {
  id: string;
  dateKey: string;
  time: string;
  client: string;
  location: string;
  technician: string;
  plants: string[];
  notes: string;
  status: 'scheduled' | 'completed' | 'in_progress' | 'overdue' | 'cancelled';
}

const STATUS_OPTIONS = ['All', 'Scheduled', 'Completed', 'In Progress', 'Overdue', 'Cancelled'];

function startOfWeek(input: Date) {
  const date = new Date(input);
  const day = date.getDay();
  const delta = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + delta);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(date: Date, count: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + count);
  return copy;
}

function dateKey(date: Date) {
  return date.toISOString().split('T')[0] || '';
}

function mapStatus(value: string): VisitCardData['status'] {
  if (value === 'COMPLETED') return 'completed';
  if (value === 'IN_PROGRESS') return 'in_progress';
  if (value === 'MISSED') return 'overdue';
  if (value === 'CANCELLED') return 'cancelled';
  return 'scheduled';
}

function StatusDot({ status }: { status: VisitCardData['status'] }) {
  const colors: Record<VisitCardData['status'], string> = {
    scheduled: 'bg-blue-500',
    completed: 'bg-emerald-500',
    in_progress: 'bg-amber-500',
    overdue: 'bg-red-500',
    cancelled: 'bg-gray-500',
  };

  return <span className={cn('inline-block h-2 w-2 rounded-full', colors[status])} />;
}

function VisitCard({
  visit,
  onClick,
}: {
  visit: VisitCardData;
  onClick: () => void;
}) {
  const borderColors: Record<VisitCardData['status'], string> = {
    scheduled: 'border-l-blue-500',
    completed: 'border-l-emerald-500',
    in_progress: 'border-l-amber-500',
    overdue: 'border-l-red-500',
    cancelled: 'border-l-gray-500',
  };

  const bgColors: Record<VisitCardData['status'], string> = {
    scheduled: 'bg-blue-50/50 dark:bg-blue-500/5',
    completed: 'bg-emerald-50/50 dark:bg-emerald-500/5',
    in_progress: 'bg-amber-50/50 dark:bg-amber-500/5',
    overdue: 'bg-red-50/50 dark:bg-red-500/5',
    cancelled: 'bg-gray-50/70 dark:bg-white/[0.04]',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'w-full rounded-lg border-l-[3px] p-2 text-left transition-shadow hover:shadow-md',
        borderColors[visit.status],
        bgColors[visit.status],
      )}
    >
      <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 dark:text-gray-400">
        <Clock className="h-3 w-3" />
        {visit.time}
      </div>
      <p className="mt-0.5 truncate text-xs font-medium text-gray-900 dark:text-white">{visit.client}</p>
      <p className="truncate text-[10px] text-gray-500">{visit.technician}</p>
    </motion.button>
  );
}

export default function PartnerMaintenancePage() {
  const [selectedVisit, setSelectedVisit] = useState<VisitCardData | null>(null);
  const [techFilter, setTechFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [weekOffset, setWeekOffset] = useState(0);

  const visitsQuery = useQuery({
    queryKey: ['partner', 'maintenance', 'calendar', weekOffset],
    queryFn: async () => {
      const weekStart = addDays(startOfWeek(new Date()), weekOffset * 7);
      const weekEnd = addDays(weekStart, 7);

      const response = await api.get<ApiEnvelope<VisitRow[]> & { pagination?: unknown }>(
        '/service-visits',
        {
          params: {
            page: 1,
            limit: 400,
            sortBy: 'scheduledDate',
            sortOrder: 'asc',
            from: weekStart.toISOString(),
            to: weekEnd.toISOString(),
          },
        },
      );

      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const weekStart = useMemo(
    () => addDays(startOfWeek(new Date()), weekOffset * 7),
    [weekOffset],
  );

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = addDays(weekStart, index);
        return {
          key: dateKey(date),
          dayLabel: date.toLocaleDateString('en-IN', { weekday: 'short' }),
          dateLabel: date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
          }),
        };
      }),
    [weekStart],
  );

  const allVisits = useMemo<VisitCardData[]>(
    () =>
      (visitsQuery.data ?? []).map((visit) => {
        const date = new Date(visit.scheduledDate);
        return {
          id: visit.id,
          dateKey: dateKey(date),
          time: date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          client: visit.plant?.location?.client?.companyName ?? 'Client account',
          location: visit.plant?.location?.name ?? 'Site location',
          technician: visit.technician?.user?.name ?? 'Unassigned',
          plants: [
            visit.plant?.nickname,
            visit.plant?.species?.commonName,
          ].filter(Boolean) as string[],
          notes: visit.notes || 'No notes provided for this visit.',
          status: mapStatus(visit.status),
        };
      }),
    [visitsQuery.data],
  );

  const technicians = useMemo(() => {
    const names = new Set<string>();
    allVisits.forEach((visit) => names.add(visit.technician));

    return ['All', ...Array.from(names).sort((a, b) => a.localeCompare(b))];
  }, [allVisits]);

  const filteredVisits = useMemo(
    () =>
      allVisits.filter((visit) => {
        const matchesTech = techFilter === 'All' || visit.technician === techFilter;
        const matchesStatus =
          statusFilter === 'All' ||
          visit.status === statusFilter.toLowerCase().replace(' ', '_');

        return matchesTech && matchesStatus;
      }),
    [allVisits, techFilter, statusFilter],
  );

  const stats = useMemo(() => {
    const scheduled = filteredVisits.filter((visit) => visit.status === 'scheduled').length;
    const completed = filteredVisits.filter((visit) => visit.status === 'completed').length;
    const pending = filteredVisits.filter((visit) => visit.status === 'in_progress').length;
    const overdue = filteredVisits.filter((visit) => visit.status === 'overdue').length;

    return [
      {
        label: 'Scheduled This Week',
        value: scheduled,
        icon: CalendarClock,
        color: 'text-blue-600',
        bg: 'bg-blue-500/10',
      },
      {
        label: 'Completed',
        value: completed,
        icon: CheckCircle2,
        color: 'text-emerald-600',
        bg: 'bg-emerald-500/10',
      },
      {
        label: 'Pending',
        value: pending,
        icon: Timer,
        color: 'text-amber-600',
        bg: 'bg-amber-500/10',
      },
      {
        label: 'Overdue',
        value: overdue,
        icon: AlertTriangle,
        color: 'text-red-600',
        bg: 'bg-red-500/10',
      },
    ];
  }, [filteredVisits]);

  const getVisitsForDay = (dayKey: string) =>
    filteredVisits.filter((visit) => visit.dateKey === dayKey);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance Schedule"
        description="Live weekly service calendar with technician assignment and visit status."
        breadcrumbs={[
          { label: 'Partner', href: '/partner' },
          { label: 'Maintenance' },
        ]}
        actions={
          <button
            type="button"
            onClick={() => visitsQuery.refetch()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Schedule
          </button>
        }
      />

      {visitsQuery.isError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
          Unable to load live maintenance schedule. Please retry shortly.
        </div>
      )}

      {visitsQuery.isLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200/70 bg-white/80 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading live maintenance schedule...
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
            >
              <div className={cn('mb-3 inline-flex rounded-xl p-2.5', stat.bg)}>
                <Icon className={cn('h-5 w-5', stat.color)} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Filter className="h-4 w-4 text-gray-400" />
        <select
          value={techFilter}
          onChange={(event) => setTechFilter(event.target.value)}
          aria-label="Filter schedule by technician"
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300"
        >
          {technicians.map((tech) => (
            <option key={tech} value={tech}>
              {tech === 'All' ? 'All Technicians' : tech}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter schedule by status"
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status === 'All' ? 'All Statuses' : status}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <StatusDot status="scheduled" /><span className="text-xs text-gray-500">Scheduled</span>
          <StatusDot status="completed" /><span className="text-xs text-gray-500">Completed</span>
          <StatusDot status="in_progress" /><span className="text-xs text-gray-500">In Progress</span>
          <StatusDot status="overdue" /><span className="text-xs text-gray-500">Overdue</span>
        </div>
      </div>

      <div className="flex gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 dark:border-white/5">
            <button
              onClick={() => setWeekOffset((prev) => prev - 1)}
              aria-label="Go to previous week"
              title="Go to previous week"
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {days[0]?.dateLabel} - {days[6]?.dateLabel}
            </h3>
            <button
              onClick={() => setWeekOffset((prev) => prev + 1)}
              aria-label="Go to next week"
              title="Go to next week"
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 divide-x divide-gray-100 dark:divide-white/5">
            {days.map((day) => {
              const dayVisits = getVisitsForDay(day.key);
              const isToday = day.key === dateKey(new Date());

              return (
                <div key={day.key} className="min-h-[320px]">
                  <div
                    className={cn(
                      'border-b border-gray-100 px-2 py-2 text-center dark:border-white/5',
                      isToday && 'bg-emerald-50/60 dark:bg-emerald-500/5',
                    )}
                  >
                    <p className={cn('text-[11px] font-semibold uppercase', isToday ? 'text-emerald-600' : 'text-gray-400')}>
                      {day.dayLabel}
                    </p>
                    <p
                      className={cn(
                        'text-xs font-medium',
                        isToday
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-gray-600 dark:text-gray-300',
                      )}
                    >
                      {day.dateLabel}
                    </p>
                  </div>

                  <div className="space-y-1.5 p-1.5">
                    {dayVisits.map((visit) => (
                      <VisitCard
                        key={visit.id}
                        visit={visit}
                        onClick={() => setSelectedVisit(visit)}
                      />
                    ))}
                    {dayVisits.length === 0 && (
                      <p className="py-8 text-center text-[10px] text-gray-300 dark:text-gray-600">
                        No visits
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <AnimatePresence>
          {selectedVisit && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="w-[320px] shrink-0 overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
            >
              <div className="p-5">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Visit Details</h4>
                    <div className="mt-1 flex items-center gap-1.5">
                      <StatusDot status={selectedVisit.status} />
                      <span className="text-xs capitalize text-gray-500">
                        {selectedVisit.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedVisit(null)}
                    aria-label="Close visit details"
                    title="Close visit details"
                    className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <User className="h-3.5 w-3.5" />
                      Client
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedVisit.client}</p>
                  </div>

                  <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <MapPin className="h-3.5 w-3.5" />
                      Location
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedVisit.location}</p>
                  </div>

                  <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <User className="h-3.5 w-3.5" />
                      Technician
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedVisit.technician}</p>
                  </div>

                  <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      Schedule
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedVisit.time}</p>
                  </div>

                  <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <Leaf className="h-3.5 w-3.5" />
                      Plant Context
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedVisit.plants.length > 0 ? (
                        selectedVisit.plants.map((plant) => (
                          <span
                            key={plant}
                            className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          >
                            {plant}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">No plant label available</span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <FileText className="h-3.5 w-3.5" />
                      Notes
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{selectedVisit.notes}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
