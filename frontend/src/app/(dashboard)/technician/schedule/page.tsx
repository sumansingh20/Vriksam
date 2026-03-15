'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sprout,
  Filter,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type VisitStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

interface ScheduleVisit {
  id: string;
  day: number; // 0-6 (Mon-Sun)
  time: string;
  duration: string;
  clientName: string;
  company: string;
  location: string;
  plantsCount: number;
  status: VisitStatus;
}

/* -------------------------------------------------------------------------- */
/*  Mock data (week of March 16-22, 2026)                                     */
/* -------------------------------------------------------------------------- */

const weekDays = ['Mon 16', 'Tue 17', 'Wed 18', 'Thu 19', 'Fri 20', 'Sat 21', 'Sun 22'];

const weekVisits: ScheduleVisit[] = [
  { id: 'S-001', day: 0, time: '09:00', duration: '1.5h', clientName: 'Rahul Mehta', company: 'TechCorp Ltd', location: 'Mumbai HQ', plantsCount: 15, status: 'pending' },
  { id: 'S-002', day: 0, time: '11:00', duration: '1h', clientName: 'Anita Desai', company: 'GreenSpace Inc', location: 'BKC Office', plantsCount: 22, status: 'pending' },
  { id: 'S-003', day: 0, time: '14:00', duration: '2h', clientName: 'Deepak Kumar', company: 'Regal Hotels', location: 'Juhu Branch', plantsCount: 35, status: 'pending' },
  { id: 'S-004', day: 1, time: '09:30', duration: '1h', clientName: 'Meera Shah', company: 'InfoSys Garden', location: 'Powai Campus', plantsCount: 18, status: 'pending' },
  { id: 'S-005', day: 1, time: '13:00', duration: '1.5h', clientName: 'Amit Joshi', company: 'Metro Living', location: 'Residence', plantsCount: 12, status: 'pending' },
  { id: 'S-006', day: 2, time: '10:00', duration: '2h', clientName: 'Rahul Mehta', company: 'TechCorp Ltd', location: 'Pune Office', plantsCount: 20, status: 'pending' },
  { id: 'S-007', day: 3, time: '09:00', duration: '1h', clientName: 'Priya Nair', company: 'Wellness Hub', location: 'Hyderabad Tower', plantsCount: 28, status: 'pending' },
  { id: 'S-008', day: 3, time: '11:30', duration: '1.5h', clientName: 'Sunita Rao', company: 'Municipal Corp', location: 'Govt. Building', plantsCount: 42, status: 'pending' },
  { id: 'S-009', day: 3, time: '15:00', duration: '1h', clientName: 'Kiran Patel', company: 'StartUp Valley', location: 'Co-working Space', plantsCount: 8, status: 'cancelled' },
  { id: 'S-010', day: 4, time: '09:00', duration: '1.5h', clientName: 'Deepak Kumar', company: 'Regal Hotels', location: 'Main Hotel', plantsCount: 45, status: 'pending' },
  { id: 'S-011', day: 4, time: '14:00', duration: '1h', clientName: 'Anita Desai', company: 'GreenSpace Inc', location: 'BKC Office', plantsCount: 22, status: 'pending' },
];

/* -------------------------------------------------------------------------- */
/*  Status config                                                             */
/* -------------------------------------------------------------------------- */

const STATUS_COLORS: Record<VisitStatus, string> = {
  pending: 'border-l-sky-500 bg-sky-50/80 dark:bg-sky-500/5',
  in_progress: 'border-l-amber-500 bg-amber-50/80 dark:bg-amber-500/5',
  completed: 'border-l-emerald-500 bg-emerald-50/80 dark:bg-emerald-500/5',
  cancelled: 'border-l-gray-400 bg-gray-50/80 dark:bg-gray-500/5 opacity-60',
};

const STATUS_LABELS: Record<VisitStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

/* -------------------------------------------------------------------------- */
/*  Visit Slot                                                                */
/* -------------------------------------------------------------------------- */

function VisitSlot({ visit }: { visit: ScheduleVisit }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'cursor-pointer rounded-lg border-l-4 p-2.5 transition-shadow hover:shadow-sm',
        STATUS_COLORS[visit.status]
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-900 dark:text-white">{visit.time}</span>
        <span className="text-[10px] text-gray-400">{visit.duration}</span>
      </div>
      <p className="mt-1 text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
        {visit.company}
      </p>
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

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

type StatusFilter = 'all' | VisitStatus;

export default function TechnicianSchedulePage() {
  const [filter, setFilter] = useState<StatusFilter>('all');

  const filteredVisits = filter === 'all'
    ? weekVisits
    : weekVisits.filter((v) => v.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Schedule"
        description="Your service visits for this week. Click on a visit to view details."
        breadcrumbs={[
          { label: 'Technician', href: '/technician' },
          { label: 'Schedule' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              March 16 - 22, 2026
            </span>
            <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-gray-400" />
        {(['all', 'pending', 'in_progress', 'completed', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
              filter === status
                ? 'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-400'
            )}
          >
            {status === 'all' ? 'All' : STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {/* Week grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
      >
        <div className="grid grid-cols-7 divide-x divide-gray-200/60 dark:divide-white/5">
          {weekDays.map((day, dayIndex) => {
            const dayVisits = filteredVisits.filter((v) => v.day === dayIndex);
            const isToday = dayIndex === 0; // Mon is today (March 16)

            return (
              <div key={day} className="min-h-[300px]">
                {/* Day header */}
                <div
                  className={cn(
                    'border-b border-gray-200/60 p-3 text-center text-xs font-semibold dark:border-white/5',
                    isToday
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  {day}
                  {isToday && (
                    <span className="ml-1 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                      TODAY
                    </span>
                  )}
                </div>

                {/* Visits */}
                <div className="space-y-2 p-2">
                  {dayVisits.map((visit) => (
                    <VisitSlot key={visit.id} visit={visit} />
                  ))}
                  {dayVisits.length === 0 && (
                    <div className="flex h-20 items-center justify-center">
                      <p className="text-[10px] text-gray-300 dark:text-gray-600">
                        No visits
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200/60 bg-white/80 p-4 text-center backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{weekVisits.length}</p>
          <p className="text-xs text-gray-500">Total This Week</p>
        </div>
        <div className="rounded-xl border border-gray-200/60 bg-white/80 p-4 text-center backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
          <p className="text-2xl font-bold text-sky-600">{weekVisits.filter((v) => v.status === 'pending').length}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="rounded-xl border border-gray-200/60 bg-white/80 p-4 text-center backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
          <p className="text-2xl font-bold text-emerald-600">{weekVisits.reduce((sum, v) => sum + v.plantsCount, 0)}</p>
          <p className="text-xs text-gray-500">Plants to Service</p>
        </div>
        <div className="rounded-xl border border-gray-200/60 bg-white/80 p-4 text-center backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
          <p className="text-2xl font-bold text-gray-400">{weekVisits.filter((v) => v.status === 'cancelled').length}</p>
          <p className="text-xs text-gray-500">Cancelled</p>
        </div>
      </div>
    </div>
  );
}
