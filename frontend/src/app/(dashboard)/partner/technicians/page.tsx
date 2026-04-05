'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  RefreshCw,
  Star,
  MapPin,
  Phone,
  Calendar,
  CheckCircle2,
  Zap,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import api from '@/services/api';
import { cn } from '@/lib/utils';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface TechnicianRow {
  id: string;
  isAvailable: boolean;
  specialization?: string | null;
  activeZones?: string[];
  rating?: number;
  user?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

interface VisitRow {
  id: string;
  technicianId: string;
  status: string;
  scheduledDate: string;
  completedDate?: string | null;
}

type AvailabilityStatus = 'Available' | 'On Route' | 'Off Duty';

interface TechnicianCardRow {
  id: string;
  name: string;
  initials: string;
  specialization: string;
  rating: number;
  activeVisitsToday: number;
  completedThisWeek: number;
  availability: AvailabilityStatus;
  zone: string;
  phone: string;
  avatarBg: string;
}

interface PerformanceRow {
  id: string;
  name: string;
  visitsMonth: number;
  avgRating: number;
  plantsMaintained: number;
  efficiency: number;
}

const AVATAR_GRADIENTS = [
  'from-emerald-400 to-green-600',
  'from-teal-400 to-cyan-600',
  'from-violet-400 to-purple-600',
  'from-sky-400 to-blue-600',
  'from-amber-400 to-orange-600',
  'from-rose-400 to-red-600',
];

function AvailabilityBadge({ status }: { status: AvailabilityStatus }) {
  const config: Record<AvailabilityStatus, { classes: string; dot: string }> = {
    Available: {
      classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
      dot: 'bg-emerald-500',
    },
    'On Route': {
      classes: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
      dot: 'bg-blue-500',
    },
    'Off Duty': {
      classes: 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400',
      dot: 'bg-gray-400',
    },
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold', config[status].classes)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', config[status].dot)} />
      {status}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  const safeRating = Math.max(0, Math.min(5, rating));
  const full = Math.floor(safeRating);
  const hasHalf = safeRating - full >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            'h-3.5 w-3.5',
            index < full
              ? 'fill-amber-400 text-amber-400'
              : index === full && hasHalf
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-gray-200 dark:text-gray-600',
          )}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-gray-700 dark:text-gray-300">{safeRating.toFixed(1)}</span>
    </div>
  );
}

function isSameDay(value: string, reference: Date) {
  return new Date(value).toDateString() === reference.toDateString();
}

export default function PartnerTechniciansPage() {
  const techniciansQuery = useQuery({
    queryKey: ['partner', 'technicians', 'list'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<TechnicianRow[]> & { pagination?: unknown }>(
        '/technicians',
        {
          params: {
            page: 1,
            limit: 200,
            sortBy: 'createdAt',
            sortOrder: 'desc',
          },
        },
      );

      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const visitsQuery = useQuery({
    queryKey: ['partner', 'technicians', 'visit-stats'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<VisitRow[]> & { pagination?: unknown }>(
        '/service-visits',
        {
          params: {
            page: 1,
            limit: 700,
            sortBy: 'scheduledDate',
            sortOrder: 'desc',
          },
        },
      );

      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const { technicians, performance } = useMemo(() => {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const activeToday = new Map<string, number>();
    const completedThisWeek = new Map<string, number>();
    const completedThisMonth = new Map<string, number>();
    const assignedThisMonth = new Map<string, number>();

    for (const visit of visitsQuery.data ?? []) {
      if (visit.status === 'SCHEDULED' || visit.status === 'IN_PROGRESS') {
        if (isSameDay(visit.scheduledDate, today)) {
          activeToday.set(visit.technicianId, (activeToday.get(visit.technicianId) ?? 0) + 1);
        }
      }

      const completedDate = visit.completedDate ? new Date(visit.completedDate) : null;
      if (visit.status === 'COMPLETED' && completedDate && completedDate >= weekAgo) {
        completedThisWeek.set(visit.technicianId, (completedThisWeek.get(visit.technicianId) ?? 0) + 1);
      }

      const scheduledDate = new Date(visit.scheduledDate);
      if (scheduledDate >= monthStart) {
        assignedThisMonth.set(visit.technicianId, (assignedThisMonth.get(visit.technicianId) ?? 0) + 1);
      }

      if (visit.status === 'COMPLETED' && completedDate && completedDate >= monthStart) {
        completedThisMonth.set(visit.technicianId, (completedThisMonth.get(visit.technicianId) ?? 0) + 1);
      }
    }

    const techRows: TechnicianCardRow[] = (techniciansQuery.data ?? []).map((technician, index) => {
      const name = technician.user?.name || 'Unassigned Technician';
      const initials = name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      const activeVisits = activeToday.get(technician.id) ?? 0;
      const completedWeek = completedThisWeek.get(technician.id) ?? 0;

      const availability: AvailabilityStatus = !technician.isAvailable
        ? 'Off Duty'
        : activeVisits > 0
          ? 'On Route'
          : 'Available';

      const avatarBg =
        AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] || 'from-emerald-400 to-green-600';

      return {
        id: technician.id,
        name,
        initials,
        specialization: technician.specialization || 'General Plant Care',
        rating: typeof technician.rating === 'number' ? technician.rating : 0,
        activeVisitsToday: activeVisits,
        completedThisWeek: completedWeek,
        availability,
        zone: technician.activeZones?.[0] || 'Unassigned zone',
        phone: technician.user?.phone || 'Not provided',
        avatarBg,
      };
    });

    const performanceRows: PerformanceRow[] = techRows
      .map((technician) => {
        const monthVisits = completedThisMonth.get(technician.id) ?? 0;
        const totalAssigned = assignedThisMonth.get(technician.id) ?? 0;
        const efficiency = totalAssigned > 0 ? Math.round((monthVisits / totalAssigned) * 100) : 0;

        return {
          id: technician.id,
          name: technician.name,
          visitsMonth: monthVisits,
          avgRating: technician.rating,
          plantsMaintained: monthVisits,
          efficiency,
        };
      })
      .sort((a, b) => b.visitsMonth - a.visitsMonth);

    return { technicians: techRows, performance: performanceRows };
  }, [techniciansQuery.data, visitsQuery.data]);

  const isLoading = techniciansQuery.isLoading || visitsQuery.isLoading;
  const hasError = techniciansQuery.isError || visitsQuery.isError;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Technician Team"
        description="Manage your technicians and monitor live workload and performance."
        breadcrumbs={[
          { label: 'Partner', href: '/partner' },
          { label: 'Technicians' },
        ]}
        actions={
          <button
            type="button"
            onClick={() => {
              techniciansQuery.refetch();
              visitsQuery.refetch();
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Team Data
          </button>
        }
      />

      {isLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200/70 bg-white/80 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading live technician performance...
        </div>
      )}

      {hasError && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4" />
          Unable to load technicians right now.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {technicians.map((technician, index) => (
          <motion.div
            key={technician.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl transition-shadow hover:shadow-lg hover:shadow-emerald-500/5 dark:border-white/5 dark:bg-gray-900/50"
          >
            <div className="flex items-start gap-4">
              <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-lg font-bold text-white shadow-lg', technician.avatarBg)}>
                {technician.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{technician.name}</h4>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{technician.specialization}</p>
                  </div>
                  <AvailabilityBadge status={technician.availability} />
                </div>
                <div className="mt-2">
                  <StarRating rating={technician.rating} />
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <Calendar className="h-3 w-3" />
                  Active Today
                </div>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{technician.activeVisitsToday}</p>
              </div>
              <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <CheckCircle2 className="h-3 w-3" />
                  This Week
                </div>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{technician.completedThisWeek}</p>
              </div>
            </div>

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <MapPin className="h-3 w-3 shrink-0" />
                {technician.zone}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Phone className="h-3 w-3 shrink-0" />
                {technician.phone}
              </div>
            </div>

            <Link
              href={`/partner/maintenance?technicianId=${encodeURIComponent(technician.id)}`}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
            >
              <Zap className="h-3.5 w-3.5" />
              Open Schedule
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
      >
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Monthly Performance</h3>
          <p className="mt-0.5 text-xs text-gray-500">Live performance metrics for the current month</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">#</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Technician</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">Visits (Month)</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">Avg Rating</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">Plants Maintained</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
              {performance.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + index * 0.04 }}
                  className="transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-3.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{row.name}</p>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{row.visitsMonth}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{row.avgRating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{row.plantsMaintained}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${row.efficiency}%` }}
                          transition={{ delay: 0.6 + index * 0.04, duration: 0.5 }}
                          className={cn(
                            'h-full rounded-full',
                            row.efficiency >= 95
                              ? 'bg-emerald-500'
                              : row.efficiency >= 90
                                ? 'bg-green-500'
                                : 'bg-amber-500',
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          'text-xs font-semibold',
                          row.efficiency >= 95
                            ? 'text-emerald-600'
                            : row.efficiency >= 90
                              ? 'text-green-600'
                              : 'text-amber-600',
                        )}
                      >
                        {row.efficiency}%
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}

              {performance.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">No technician performance data</p>
                    <p className="mt-1 text-xs text-gray-500">Performance metrics will appear from live visit logs.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
