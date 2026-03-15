'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type LogStatus = 'completed' | 'partial' | 'skipped';

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

/* -------------------------------------------------------------------------- */
/*  Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const todayEntries: MaintenanceEntry[] = [
  { id: 'ML-001', date: '2026-03-15', time: '09:00 AM', location: 'TechCorp HQ, Floor 3', client: 'Rahul Mehta', plantsServiced: 15, duration: '1h 20m', status: 'completed', notes: 'All plants in good condition. Repotted 2 Monstera. Applied fertilizer to ferns.' },
  { id: 'ML-002', date: '2026-03-15', time: '10:45 AM', location: 'TechCorp HQ, Lobby', client: 'Rahul Mehta', plantsServiced: 8, duration: '45m', status: 'completed', notes: 'Replaced 1 Peace Lily showing root rot. Adjusted watering schedule for indoor palms.' },
  { id: 'ML-003', date: '2026-03-15', time: '12:30 PM', location: 'GreenSpace Office', client: 'Anita Desai', plantsServiced: 20, duration: '1h 30m', status: 'completed', notes: 'Pruned all trailing plants. Applied neem oil to 3 plants showing pest signs.' },
];

const fullLog: MaintenanceEntry[] = [
  ...todayEntries,
  { id: 'ML-004', date: '2026-03-14', time: '09:30 AM', location: 'Regal Hotel Lobby', client: 'Deepak Kumar', plantsServiced: 35, duration: '2h 15m', status: 'completed', notes: 'Deep cleaned all planters. Replaced soil for 5 plants.' },
  { id: 'ML-005', date: '2026-03-14', time: '02:00 PM', location: 'InfoSys Atrium', client: 'Meera Shah', plantsServiced: 18, duration: '1h', status: 'completed', notes: 'Routine maintenance. All plants healthy.' },
  { id: 'ML-006', date: '2026-03-13', time: '09:00 AM', location: 'Mumbai HQ, Floor 5', client: 'Rahul Mehta', plantsServiced: 12, duration: '50m', status: 'partial', notes: 'Could not access server room area. Completed rest of floor.' },
  { id: 'ML-007', date: '2026-03-13', time: '11:30 AM', location: 'Metro Living, Residence', client: 'Amit Joshi', plantsServiced: 12, duration: '40m', status: 'completed', notes: 'Pruned balcony plants. Applied growth hormones to bougainvillea.' },
  { id: 'ML-008', date: '2026-03-12', time: '09:00 AM', location: 'Wellness Hub', client: 'Sunita Rao', plantsServiced: 25, duration: '1h 45m', status: 'completed', notes: 'Full quarterly assessment completed. Updated plant tags.' },
  { id: 'ML-009', date: '2026-03-12', time: '02:30 PM', location: 'StartUp Valley', client: 'Kiran Patel', plantsServiced: 8, duration: '30m', status: 'skipped', notes: 'Office closed for renovation. Rescheduled to next week.' },
  { id: 'ML-010', date: '2026-03-11', time: '10:00 AM', location: 'Palm Residences', client: 'Green Valley', plantsServiced: 30, duration: '2h', status: 'completed', notes: 'Seasonal plant swap for 10 units. Installed new planters in lobby.' },
];

const STATUS_STYLES: Record<LogStatus, { label: string; className: string }> = {
  completed: { label: 'Completed', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' },
  partial: { label: 'Partial', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' },
  skipped: { label: 'Skipped', className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400' },
};

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function TechnicianMaintenanceLogPage() {
  const [showNewEntry, setShowNewEntry] = useState(false);

  const weekVisitsCompleted = fullLog.filter(
    (e) => e.date >= '2026-03-10' && e.date <= '2026-03-16' && e.status === 'completed',
  ).length;
  const weekPlantsMaintained = fullLog
    .filter((e) => e.date >= '2026-03-10' && e.date <= '2026-03-16')
    .reduce((sum, e) => sum + e.plantsServiced, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance Log"
        description="Track and record your maintenance activities."
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

      {/* New Entry Form */}
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
                <button onClick={() => setShowNewEntry(false)} className="text-gray-400 hover:text-gray-600">
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
                <button className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600">
                  Save Entry
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Week Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: CheckCircle, label: 'Visits Completed', value: `${weekVisitsCompleted}`, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          { icon: Sprout, label: 'Plants Maintained', value: `${weekPlantsMaintained}`, color: 'text-green-600', bg: 'bg-green-500/10' },
          { icon: Star, label: 'Avg Rating', value: '4.8', color: 'text-violet-600', bg: 'bg-violet-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
          >
            <div className={cn('mb-3 inline-flex rounded-xl p-2.5', stat.bg)}>
              <stat.icon className={cn('h-5 w-5', stat.color)} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="mt-0.5 text-xs text-gray-400">This week (Mar 10-16)</p>
          </motion.div>
        ))}
      </div>

      {/* Today's Completed Visits */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
          Today&apos;s Completed Visits
        </h3>
        <div className="space-y-3">
          {todayEntries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
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

                <div className="flex-1 min-w-0">
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
        </div>
      </div>

      {/* Full Log Table */}
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
              {fullLog.map((entry, _i) => {
                const status = STATUS_STYLES[entry.status];
                return (
                  <tr key={entry.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                    <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">
                      <div>
                        <p className="font-medium">{new Date(entry.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
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
                    <td className="max-w-[200px] px-6 py-3 text-xs text-gray-500 truncate">{entry.notes}</td>
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
