'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  Star,
  MapPin,
  User,
  Phone,
  ChevronRight,
  Calendar,
  Sprout,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type VisitStatus = 'pending' | 'in_progress' | 'completed';

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

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                 */
/* -------------------------------------------------------------------------- */

const todayVisits: TodayVisit[] = [
  { id: 'V-001', time: '09:00 AM', clientName: 'Rahul Mehta', company: 'TechCorp Ltd', location: 'Mumbai HQ - Floor 3', address: 'Andheri East, Mumbai', plantsCount: 15, status: 'completed', contactPhone: '+91 98765 43210' },
  { id: 'V-002', time: '10:30 AM', clientName: 'Rahul Mehta', company: 'TechCorp Ltd', location: 'Mumbai HQ - Lobby', address: 'Andheri East, Mumbai', plantsCount: 8, status: 'completed', contactPhone: '+91 98765 43210' },
  { id: 'V-003', time: '12:00 PM', clientName: 'Anita Desai', company: 'GreenSpace Inc', location: 'GreenSpace Office', address: 'BKC, Mumbai', plantsCount: 22, status: 'in_progress', contactPhone: '+91 87654 32109' },
  { id: 'V-004', time: '02:30 PM', clientName: 'Deepak Kumar', company: 'Regal Hotels', location: 'Regal Grand Lobby', address: 'Juhu, Mumbai', plantsCount: 35, status: 'pending', contactPhone: '+91 21098 76543' },
  { id: 'V-005', time: '04:30 PM', clientName: 'Meera Shah', company: 'InfoSys Garden', location: 'InfoSys Atrium', address: 'Powai, Mumbai', plantsCount: 18, status: 'pending', contactPhone: '+91 10987 65432' },
];

/* -------------------------------------------------------------------------- */
/*  Status config                                                             */
/* -------------------------------------------------------------------------- */

const STATUS_STYLES: Record<VisitStatus, { label: string; className: string; dot: string }> = {
  pending: { label: 'Pending', className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400', dot: 'bg-gray-400' },
  in_progress: { label: 'In Progress', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400', dot: 'bg-amber-500 animate-pulse' },
  completed: { label: 'Completed', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
};

/* -------------------------------------------------------------------------- */
/*  Stat Card                                                                 */
/* -------------------------------------------------------------------------- */

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
  index,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bg: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
    >
      <div className={cn('mb-3 inline-flex rounded-xl p-2.5', bg)}>
        <Icon className={cn('h-5 w-5', color)} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Visit Card                                                                */
/* -------------------------------------------------------------------------- */

function VisitCard({ visit, index }: { visit: TodayVisit; index: number }) {
  const status = STATUS_STYLES[visit.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group flex items-center gap-4 rounded-2xl border border-gray-200/60 bg-white/80 p-4 backdrop-blur-xl transition-all duration-200 hover:border-emerald-200/60 hover:shadow-sm dark:border-white/5 dark:bg-gray-900/50 dark:hover:border-emerald-500/20"
    >
      {/* Time */}
      <div className="w-20 shrink-0 text-center">
        <p className="text-sm font-bold text-gray-900 dark:text-white">{visit.time}</p>
        <span className={cn('mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', status.className)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
          {status.label}
        </span>
      </div>

      {/* Divider */}
      <div className="h-14 w-px bg-gray-200 dark:bg-white/10" />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {visit.company}
          </h3>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
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

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <a
          href={`tel:${visit.contactPhone}`}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5"
        >
          <Phone className="h-4 w-4" />
        </a>
        {visit.status === 'pending' && (
          <button className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-600">
            Start
          </button>
        )}
        {visit.status === 'in_progress' && (
          <button className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-600">
            Complete
          </button>
        )}
        {visit.status === 'completed' && (
          <CheckCircle className="h-5 w-5 text-emerald-500" />
        )}
        <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600" />
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function TechnicianDashboardPage() {
  const completedToday = todayVisits.filter((v) => v.status === 'completed').length;
  const pendingCount = todayVisits.filter((v) => v.status === 'pending').length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Good morning, Raj"
        description="Here's your schedule for today. You have service visits to complete."
        showAccent={false}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Calendar} label="Today's Schedule" value={`${todayVisits.length} visits`} color="text-sky-600" bg="bg-sky-500/10" index={0} />
        <StatCard icon={Clock} label="Pending" value={`${pendingCount}`} color="text-amber-600" bg="bg-amber-500/10" index={1} />
        <StatCard icon={CheckCircle} label="Completed Today" value={`${completedToday}`} color="text-emerald-600" bg="bg-emerald-500/10" index={2} />
        <StatCard icon={Star} label="Average Rating" value="4.8" color="text-violet-600" bg="bg-violet-500/10" index={3} />
      </div>

      {/* Today's visits */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Today&apos;s Service Visits
        </h2>
        <div className="space-y-3">
          {todayVisits.map((visit, index) => (
            <VisitCard key={visit.id} visit={visit} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
