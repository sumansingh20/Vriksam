'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  Phone,
  Sprout,
  Star,
  User,
} from 'lucide-react';
import {
  RevealBlock,
  SectionTransition,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion/section-transition';
import { PageHeader } from '@/components/layout/page-header';
import api from '@/services/api';
import { cn } from '@/lib/utils';

type VisitStatus = 'pending' | 'in_progress' | 'completed';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface VisitApi {
  id: string;
  status: string;
  scheduledDate: string;
  technician?: {
    user?: {
      name?: string;
    };
  };
  plant?: {
    location?: {
      name?: string;
      client?: {
        companyName?: string;
      };
      address?: string;
    };
  };
}

interface TodayVisit {
  id: string;
  time: string;
  clientName: string;
  company: string;
  location: string;
  address: string;
  plantsCount: number;
  status: VisitStatus;
  contactPhone: string;
}

const STATUS_STYLES: Record<
  VisitStatus,
  { label: string; className: string; dot: string }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-slate-100 text-slate-700',
    dot: 'bg-slate-400',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-500 animate-pulse',
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
  },
};

function normalizeStatus(value: string): VisitStatus {
  const status = value.toLowerCase();
  if (status.includes('complete')) return 'completed';
  if (status.includes('progress')) return 'in_progress';
  return 'pending';
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="h-full rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-lg shadow-emerald-900/5">
      <div className={cn('mb-3 inline-flex rounded-2xl p-2.5', bg)}>
        <Icon className={cn('h-5 w-5', color)} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

function VisitCard({ visit }: { visit: TodayVisit }) {
  const status = STATUS_STYLES[visit.status];

  return (
    <div className="group flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-lg shadow-emerald-900/5 transition-all duration-200 hover:border-emerald-200 hover:shadow-emerald-600/10">
      <div className="w-20 shrink-0 text-center">
        <p className="text-sm font-bold text-slate-900">{visit.time}</p>
        <span
          className={cn(
            'mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em]',
            status.className,
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
          {status.label}
        </span>
      </div>

      <div className="h-14 w-px bg-slate-200" />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-slate-900">{visit.company}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {visit.location}
          </span>
          <span className="flex items-center gap-1">
            <Sprout className="h-3 w-3" />
            {visit.plantsCount} plants
          </span>
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {visit.clientName}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <a
          href={`tel:${visit.contactPhone}`}
          aria-label={`Call ${visit.clientName}`}
          title={`Call ${visit.clientName}`}
          className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <Phone className="h-4 w-4" />
        </a>
        <Link
          href="/technician/schedule"
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
        >
          Open schedule
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function TechnicianDashboardPage() {
  const visitsQuery = useQuery({
    queryKey: ['technician', 'dashboard', 'today-visits'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<VisitApi[]> & { pagination?: unknown }>(
        '/service-visits',
        {
          params: {
            page: 1,
            limit: 200,
            sortBy: 'scheduledDate',
            sortOrder: 'asc',
          },
        },
      );

      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const todayVisits = useMemo<TodayVisit[]>(() => {
    const today = new Date().toDateString();

    return (visitsQuery.data ?? [])
      .filter((visit) => new Date(visit.scheduledDate).toDateString() === today)
      .map((visit) => ({
        id: visit.id,
        time: new Date(visit.scheduledDate).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        clientName: visit.plant?.location?.client?.companyName || 'Client',
        company: visit.plant?.location?.client?.companyName || 'Client account',
        location: visit.plant?.location?.name || 'Site location',
        address: visit.plant?.location?.address || 'Address unavailable',
        plantsCount: 1,
        status: normalizeStatus(visit.status),
        contactPhone: '+91 00000 00000',
      }));
  }, [visitsQuery.data]);

  const completedToday = todayVisits.filter((visit) => visit.status === 'completed').length;
  const pendingCount = todayVisits.filter((visit) => visit.status === 'pending').length;
  const inProgressCount = todayVisits.filter((visit) => visit.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      <SectionTransition className="relative isolate overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-[#f4faf5] via-[#f8fcf9] to-white p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-12 h-48 w-48 rounded-full bg-emerald-300/20 blur-[90px]" />
          <div className="absolute right-[-3rem] top-6 h-40 w-40 rounded-full bg-cyan-300/18 blur-[80px]" />
        </div>

        <div className="relative">
          <PageHeader
            title="Technician Field Console"
            description="Live schedule, visit progress, and completion focus for today's route."
            showAccent={false}
            className="mb-0"
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm shadow-emerald-900/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Today&apos;s Visits</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">{todayVisits.length}</p>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm shadow-emerald-900/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Completed</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">{completedToday}</p>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm shadow-emerald-900/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">In Progress</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">{inProgressCount}</p>
            </div>
          </div>
        </div>
      </SectionTransition>

      {visitsQuery.isLoading && (
        <RevealBlock>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading your live schedule...
          </div>
        </RevealBlock>
      )}

      {visitsQuery.isError && (
        <RevealBlock>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Unable to load technician schedule right now.
          </div>
        </RevealBlock>
      )}

      <SectionTransition>
        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" staggerChildren={0.08}>
          <StaggerItem>
            <StatCard
              icon={Calendar}
              label="Today Schedule"
              value={`${todayVisits.length} visits`}
              color="text-sky-600"
              bg="bg-sky-500/10"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              icon={Clock}
              label="Pending"
              value={`${pendingCount}`}
              color="text-amber-600"
              bg="bg-amber-500/10"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              icon={CheckCircle}
              label="Completed Today"
              value={`${completedToday}`}
              color="text-emerald-600"
              bg="bg-emerald-500/10"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              icon={Star}
              label="In Progress"
              value={`${inProgressCount}`}
              color="text-violet-600"
              bg="bg-violet-500/10"
            />
          </StaggerItem>
        </StaggerContainer>
      </SectionTransition>

      <SectionTransition>
        <RevealBlock>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Today&apos;s Service Visits</h2>
        </RevealBlock>

        {todayVisits.length === 0 && !visitsQuery.isLoading ? (
          <div className="rounded-3xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
            No scheduled visits for today.
          </div>
        ) : (
          <StaggerContainer className="space-y-3" staggerChildren={0.06}>
            {todayVisits.map((visit) => (
              <StaggerItem key={visit.id}>
                <VisitCard visit={visit} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </SectionTransition>

      <SectionTransition>
        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-3" staggerChildren={0.08}>
          <StaggerItem>
            <Link
              href="/technician/schedule"
              className="block rounded-3xl border border-slate-200/80 bg-white/90 p-5 text-sm text-slate-700 shadow-lg shadow-emerald-900/5 transition-colors hover:border-emerald-300"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">Route Planning</p>
              <p className="mt-2 text-base font-semibold text-slate-900">Open schedule manager</p>
              <p className="mt-1 text-xs text-slate-500">Review upcoming visits and travel flow.</p>
            </Link>
          </StaggerItem>
          <StaggerItem>
            <Link
              href="/technician/maintenance-log"
              className="block rounded-3xl border border-slate-200/80 bg-white/90 p-5 text-sm text-slate-700 shadow-lg shadow-emerald-900/5 transition-colors hover:border-emerald-300"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">Execution</p>
              <p className="mt-2 text-base font-semibold text-slate-900">Update maintenance logs</p>
              <p className="mt-1 text-xs text-slate-500">Capture visit notes and completed tasks.</p>
            </Link>
          </StaggerItem>
          <StaggerItem>
            <Link
              href="/technician/plant-health"
              className="block rounded-3xl border border-slate-200/80 bg-white/90 p-5 text-sm text-slate-700 shadow-lg shadow-emerald-900/5 transition-colors hover:border-emerald-300"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">Plant Health</p>
              <p className="mt-2 text-base font-semibold text-slate-900">Review health updates</p>
              <p className="mt-1 text-xs text-slate-500">Submit condition updates directly from the field.</p>
            </Link>
          </StaggerItem>
        </StaggerContainer>
      </SectionTransition>
    </div>
  );
}
