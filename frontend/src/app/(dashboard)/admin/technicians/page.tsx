'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  RefreshCw,
  Star,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  Search,
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
  rating: number;
  totalVisits?: number;
  specialization?: string | null;
  activeZones?: string[];
  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  _count?: {
    serviceVisits?: number;
  };
}

interface VisitRow {
  id: string;
  status: string;
  technicianId: string;
  scheduledDate: string;
  completedDate?: string | null;
}

type AvailabilityKey = 'available' | 'busy' | 'off_duty';

const AVAILABILITY_STYLES: Record<
  AvailabilityKey,
  { label: string; className: string; dotColor: string }
> = {
  available: {
    label: 'Available',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    dotColor: 'bg-emerald-500',
  },
  busy: {
    label: 'Busy',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    dotColor: 'bg-amber-500',
  },
  off_duty: {
    label: 'Off Duty',
    className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
    dotColor: 'bg-gray-400',
  },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i < Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : i < rating
                ? 'fill-amber-400/50 text-amber-400'
                : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700',
          )}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function isSameDay(value: string, reference: Date) {
  return new Date(value).toDateString() === reference.toDateString();
}

function TechnicianCard({
  tech,
  index,
}: {
  tech: {
    id: string;
    name: string;
    specialization: string;
    rating: number;
    activeVisits: number;
    completedToday: number;
    availability: AvailabilityKey;
    phone: string;
    email: string;
    zone: string;
  };
  index: number;
}) {
  const availability = AVAILABILITY_STYLES[tech.availability];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl transition-all duration-300 hover:border-emerald-200/60 hover:shadow-glow-sm dark:border-white/5 dark:bg-gray-900/50 dark:hover:border-emerald-500/20"
    >
      <div className="absolute right-4 top-4">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
            availability.className,
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', availability.dotColor)} />
          {availability.label}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 text-lg font-bold text-white">
          {tech.name
            .split(' ')
            .map((name) => name[0])
            .join('')
            .slice(0, 2)}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{tech.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{tech.specialization}</p>
        </div>
      </div>

      <div className="mt-3">
        <StarRating rating={tech.rating} />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-sky-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            <strong className="text-gray-900 dark:text-white">{tech.activeVisits}</strong> active
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            <strong className="text-gray-900 dark:text-white">{tech.completedToday}</strong> done today
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3 dark:border-white/5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="h-3 w-3" />
          {tech.zone}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Phone className="h-3 w-3" />
          {tech.phone}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Mail className="h-3 w-3" />
          {tech.email}
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminTechniciansPage() {
  const [search, setSearch] = useState('');

  const techniciansQuery = useQuery({
    queryKey: ['admin', 'technicians', 'list'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<TechnicianRow[]> & { pagination?: unknown }>(
        '/technicians',
        {
          params: {
            page: 1,
            limit: 120,
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
    queryKey: ['admin', 'technicians', 'visit-counts'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<VisitRow[]> & { pagination?: unknown }>(
        '/service-visits',
        {
          params: {
            page: 1,
            limit: 300,
            sortBy: 'scheduledDate',
            sortOrder: 'desc',
          },
        },
      );

      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const enrichedTechnicians = useMemo(() => {
    const today = new Date();
    const visits = visitsQuery.data ?? [];

    const activeByTech = new Map<string, number>();
    const completedTodayByTech = new Map<string, number>();

    for (const visit of visits) {
      if (visit.status === 'SCHEDULED' || visit.status === 'IN_PROGRESS') {
        activeByTech.set(
          visit.technicianId,
          (activeByTech.get(visit.technicianId) ?? 0) + 1,
        );
      }

      if (
        visit.status === 'COMPLETED' &&
        (isSameDay(visit.completedDate || visit.scheduledDate, today) ||
          isSameDay(visit.scheduledDate, today))
      ) {
        completedTodayByTech.set(
          visit.technicianId,
          (completedTodayByTech.get(visit.technicianId) ?? 0) + 1,
        );
      }
    }

    return (techniciansQuery.data ?? []).map((tech) => {
      const activeVisits = activeByTech.get(tech.id) ?? 0;
      const completedToday = completedTodayByTech.get(tech.id) ?? 0;

      const availability: AvailabilityKey = !tech.isAvailable
        ? 'off_duty'
        : activeVisits > 0
          ? 'busy'
          : 'available';

      return {
        id: tech.id,
        name: tech.user?.name || 'Unassigned technician',
        specialization:
          tech.specialization?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) ||
          'General Maintenance',
        rating: tech.rating ?? 0,
        activeVisits,
        completedToday,
        availability,
        phone: tech.user?.phone || 'Not provided',
        email: tech.user?.email || 'Not provided',
        zone: tech.activeZones?.[0] || 'Unassigned zone',
      };
    });
  }, [techniciansQuery.data, visitsQuery.data]);

  const filteredTechnicians = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return enrichedTechnicians;

    return enrichedTechnicians.filter(
      (tech) =>
        tech.name.toLowerCase().includes(q) ||
        tech.specialization.toLowerCase().includes(q) ||
        tech.zone.toLowerCase().includes(q) ||
        tech.email.toLowerCase().includes(q),
    );
  }, [enrichedTechnicians, search]);

  const isLoading = techniciansQuery.isLoading || visitsQuery.isLoading;
  const hasError = techniciansQuery.isError || visitsQuery.isError;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Technicians"
        description="Live technician availability, assignment load, and service performance."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Technicians' },
        ]}
        actions={
          <button
            type="button"
            onClick={() => techniciansQuery.refetch()}
            className="btn-emerald flex items-center gap-2 rounded-xl"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Technician Data
          </button>
        }
      />

      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search technicians by name, zone, or specialization"
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {hasError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
          Unable to load live technician data right now. Please retry shortly.
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200/70 bg-white/80 px-4 py-3 text-sm text-gray-600 dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading live technicians and visit workload...
        </div>
      )}

      {!isLoading && filteredTechnicians.length === 0 ? (
        <div className="flex items-center gap-2 rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500 dark:border-white/10 dark:text-gray-400">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          No technicians match the current search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredTechnicians.map((tech, index) => (
            <TechnicianCard key={tech.id} tech={tech} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
