'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
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
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface ServiceVisit {
  id: string;
  time: string;
  duration: string;
  client: string;
  location: string;
  technician: string;
  plants: string[];
  notes: string;
  status: 'scheduled' | 'completed' | 'in_progress' | 'overdue';
  day: number; // 0=Mon ... 6=Sun
}

/* -------------------------------------------------------------------------- */
/*  Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const maintenanceStats = [
  { label: 'Scheduled This Week', value: 28, icon: CalendarClock, color: 'text-blue-600', bg: 'bg-blue-500/10' },
  { label: 'Completed', value: 16, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { label: 'Pending', value: 9, icon: Timer, color: 'text-amber-600', bg: 'bg-amber-500/10' },
  { label: 'Overdue', value: 3, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-500/10' },
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weekDates = ['Mar 10', 'Mar 11', 'Mar 12', 'Mar 13', 'Mar 14', 'Mar 15', 'Mar 16'];

const technicians = ['All', 'Raj Patel', 'Priya Sharma', 'Deepak Nair', 'Sneha Reddy', 'Amit Kumar', 'Anita Desai'];
const statusOptions = ['All', 'Scheduled', 'Completed', 'In Progress', 'Overdue'];

const weekVisits: ServiceVisit[] = [
  { id: '1', time: '09:00', duration: '1h', client: 'TechCorp Ltd', location: 'Mumbai HQ, Floor 3', technician: 'Raj Patel', plants: ['Monstera', 'Peace Lily', 'Snake Plant'], notes: 'Regular weekly maintenance. Check humidity levels.', status: 'completed', day: 0 },
  { id: '2', time: '11:00', duration: '1.5h', client: 'GreenSpace Inc', location: 'Bangalore Campus A', technician: 'Priya Sharma', plants: ['Fiddle Leaf Fig', 'Pothos', 'ZZ Plant', 'Areca Palm'], notes: 'Deep watering needed. Inspect new installations.', status: 'completed', day: 0 },
  { id: '3', time: '09:30', duration: '2h', client: 'Wellness Hub', location: 'Hyderabad Tower', technician: 'Deepak Nair', plants: ['Calathea', 'Boston Fern', 'Rubber Plant'], notes: 'Pest control follow-up. Fertilizer application due.', status: 'completed', day: 1 },
  { id: '4', time: '14:00', duration: '1h', client: 'EcoVentures', location: 'Pune Office Park', technician: 'Sneha Reddy', plants: ['Bird of Paradise', 'Spider Plant'], notes: 'Monthly deep clean. Replace damaged pots.', status: 'completed', day: 1 },
  { id: '5', time: '10:00', duration: '1.5h', client: 'Palm Residences', location: 'Delhi Green Villas', technician: 'Amit Kumar', plants: ['Areca Palm', 'Money Plant', 'Jade Plant'], notes: 'New plant installation - 5 units.', status: 'completed', day: 2 },
  { id: '6', time: '13:00', duration: '1h', client: 'TechCorp Ltd', location: 'Mumbai HQ, Floor 5', technician: 'Raj Patel', plants: ['Dracaena', 'Philodendron'], notes: 'Health check after AC maintenance.', status: 'completed', day: 2 },
  { id: '7', time: '09:00', duration: '2h', client: 'Skyline Towers', location: 'Lobby & Atrium', technician: 'Priya Sharma', plants: ['Majesty Palm', 'Schefflera', 'Dieffenbachia'], notes: 'Quarterly deep maintenance session.', status: 'completed', day: 3 },
  { id: '8', time: '15:00', duration: '1h', client: 'Lotus Gardens', location: 'Community Hall', technician: 'Anita Desai', plants: ['Croton', 'Chinese Evergreen'], notes: 'Pruning and repotting scheduled.', status: 'completed', day: 3 },
  { id: '9', time: '10:00', duration: '1.5h', client: 'Metro Plaza', location: 'Reception Area', technician: 'Deepak Nair', plants: ['Fiddle Leaf Fig', 'Monstera', 'Snake Plant'], notes: 'Emergency visit - plant health issue.', status: 'overdue', day: 4 },
  { id: '10', time: '11:30', duration: '1h', client: 'GreenSpace Inc', location: 'Bangalore Campus B', technician: 'Sneha Reddy', plants: ['Peace Lily', 'Pothos'], notes: 'Standard weekly maintenance.', status: 'in_progress', day: 4 },
  { id: '11', time: '14:00', duration: '2h', client: 'EcoVentures', location: 'Pune Office Park', technician: 'Raj Patel', plants: ['Areca Palm', 'Rubber Plant', 'ZZ Plant'], notes: 'Plant replacement and new installations.', status: 'scheduled', day: 4 },
  { id: '12', time: '09:00', duration: '1h', client: 'Wellness Hub', location: 'Hyderabad Tower', technician: 'Priya Sharma', plants: ['Calathea', 'Boston Fern'], notes: 'Follow-up pest treatment.', status: 'scheduled', day: 5 },
  { id: '13', time: '10:30', duration: '1.5h', client: 'TechCorp Ltd', location: 'Mumbai HQ, Lobby', technician: 'Amit Kumar', plants: ['Majesty Palm', 'Bird of Paradise'], notes: 'Seasonal plant rotation.', status: 'scheduled', day: 5 },
  { id: '14', time: '13:00', duration: '1h', client: 'Palm Residences', location: 'Delhi Green Villas', technician: 'Anita Desai', plants: ['Money Plant', 'Jade Plant', 'Aloe Vera'], notes: 'Monthly health assessment.', status: 'scheduled', day: 5 },
  { id: '15', time: '09:30', duration: '2h', client: 'Skyline Towers', location: 'Rooftop Garden', technician: 'Deepak Nair', plants: ['Bougainvillea', 'Jasmine', 'Hibiscus'], notes: 'Outdoor plant maintenance.', status: 'scheduled', day: 6 },
  { id: '16', time: '14:00', duration: '1h', client: 'Lotus Gardens', location: 'Entrance Walkway', technician: 'Sneha Reddy', plants: ['Croton', 'Dieffenbachia'], notes: 'New installation walkthrough.', status: 'overdue', day: 4 },
];

/* -------------------------------------------------------------------------- */
/*  Helper Components                                                          */
/* -------------------------------------------------------------------------- */

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    scheduled: 'bg-blue-500',
    completed: 'bg-emerald-500',
    in_progress: 'bg-amber-500',
    overdue: 'bg-red-500',
  };
  return <span className={cn('inline-block h-2 w-2 rounded-full', colors[status] ?? colors.scheduled)} />;
}

function VisitCard({
  visit,
  onClick,
}: {
  visit: ServiceVisit;
  onClick: () => void;
}) {
  const borderColors: Record<string, string> = {
    scheduled: 'border-l-blue-500',
    completed: 'border-l-emerald-500',
    in_progress: 'border-l-amber-500',
    overdue: 'border-l-red-500',
  };

  const bgColors: Record<string, string> = {
    scheduled: 'bg-blue-50/50 dark:bg-blue-500/5',
    completed: 'bg-emerald-50/50 dark:bg-emerald-500/5',
    in_progress: 'bg-amber-50/50 dark:bg-amber-500/5',
    overdue: 'bg-red-50/50 dark:bg-red-500/5',
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
        {visit.time} ({visit.duration})
      </div>
      <p className="mt-0.5 truncate text-xs font-medium text-gray-900 dark:text-white">{visit.client}</p>
      <p className="truncate text-[10px] text-gray-500">{visit.technician}</p>
    </motion.button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PartnerMaintenancePage() {
  const [selectedVisit, setSelectedVisit] = useState<ServiceVisit | null>(null);
  const [techFilter, setTechFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredVisits = weekVisits.filter((visit) => {
    const matchesTech = techFilter === 'All' || visit.technician === techFilter;
    const matchesStatus =
      statusFilter === 'All' ||
      visit.status === statusFilter.toLowerCase().replace(' ', '_');
    return matchesTech && matchesStatus;
  });

  const getVisitsForDay = (day: number) =>
    filteredVisits.filter((v) => v.day === day).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance Schedule"
        description="Plan, track, and manage service visits for all your clients."
        breadcrumbs={[
          { label: 'Partner', href: '/dashboard/partner' },
          { label: 'Maintenance' },
        ]}
        actions={
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40">
            <Plus className="h-4 w-4" />
            Schedule Visit
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {maintenanceStats.map((stat, index) => {
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

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Filter className="h-4 w-4 text-gray-400" />
        <select
          value={techFilter}
          onChange={(e) => setTechFilter(e.target.value)}
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
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s === 'All' ? 'All Statuses' : s}
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

      {/* Week Calendar View */}
      <div className="flex gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            'flex-1 overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50',
          )}
        >
          {/* Week header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 dark:border-white/5">
            <button className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              March 10 - 16, 2026
            </h3>
            <button className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Day columns */}
          <div className="grid grid-cols-7 divide-x divide-gray-100 dark:divide-white/5">
            {weekDays.map((day, dayIndex) => {
              const isToday = dayIndex === 5; // Saturday Mar 15
              const dayVisits = getVisitsForDay(dayIndex);

              return (
                <div key={day} className="min-h-[320px]">
                  {/* Day header */}
                  <div
                    className={cn(
                      'border-b border-gray-100 px-2 py-2 text-center dark:border-white/5',
                      isToday && 'bg-emerald-50/60 dark:bg-emerald-500/5',
                    )}
                  >
                    <p className={cn('text-[11px] font-semibold uppercase', isToday ? 'text-emerald-600' : 'text-gray-400')}>
                      {day}
                    </p>
                    <p className={cn('text-xs font-medium', isToday ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300')}>
                      {weekDates[dayIndex]}
                    </p>
                  </div>

                  {/* Visit cards */}
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

        {/* Visit Detail Panel */}
        <AnimatePresence>
          {selectedVisit && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 320 }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="shrink-0 overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
            >
              <div className="p-5">
                {/* Header */}
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
                    className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Details */}
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
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedVisit.time} - Duration: {selectedVisit.duration}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <Leaf className="h-3.5 w-3.5" />
                      Plants to Service
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedVisit.plants.map((plant) => (
                        <span
                          key={plant}
                          className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        >
                          {plant}
                        </span>
                      ))}
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
