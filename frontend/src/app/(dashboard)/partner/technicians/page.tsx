'use client';

import { motion } from 'framer-motion';
import {
  UserPlus,
  Star,
  MapPin,
  Phone,
  Calendar,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface Technician {
  id: string;
  name: string;
  initials: string;
  specialization: string;
  rating: number;
  activeVisitsToday: number;
  completedThisWeek: number;
  availability: 'Available' | 'On Route' | 'Off Duty';
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

/* -------------------------------------------------------------------------- */
/*  Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const technicians: Technician[] = [
  {
    id: '1', name: 'Raj Patel', initials: 'RP', specialization: 'Indoor Plants & Hydroponics',
    rating: 4.9, activeVisitsToday: 3, completedThisWeek: 14, availability: 'On Route',
    zone: 'Mumbai - Central', phone: '+91 98765 43210', avatarBg: 'from-emerald-400 to-green-600',
  },
  {
    id: '2', name: 'Priya Sharma', initials: 'PS', specialization: 'Tropical & Exotic Plants',
    rating: 4.9, activeVisitsToday: 2, completedThisWeek: 12, availability: 'Available',
    zone: 'Bangalore - North', phone: '+91 98765 43211', avatarBg: 'from-teal-400 to-cyan-600',
  },
  {
    id: '3', name: 'Deepak Nair', initials: 'DN', specialization: 'Pest Control & Plant Health',
    rating: 4.8, activeVisitsToday: 1, completedThisWeek: 11, availability: 'Available',
    zone: 'Hyderabad - Hitech City', phone: '+91 98765 43212', avatarBg: 'from-violet-400 to-purple-600',
  },
  {
    id: '4', name: 'Sneha Reddy', initials: 'SR', specialization: 'Landscaping & Outdoor Plants',
    rating: 4.7, activeVisitsToday: 2, completedThisWeek: 10, availability: 'On Route',
    zone: 'Pune - Hinjewadi', phone: '+91 98765 43213', avatarBg: 'from-sky-400 to-blue-600',
  },
  {
    id: '5', name: 'Amit Kumar', initials: 'AK', specialization: 'Succulents & Cacti',
    rating: 4.6, activeVisitsToday: 0, completedThisWeek: 9, availability: 'Off Duty',
    zone: 'Delhi - South', phone: '+91 98765 43214', avatarBg: 'from-amber-400 to-orange-600',
  },
  {
    id: '6', name: 'Anita Desai', initials: 'AD', specialization: 'Vertical Gardens & Green Walls',
    rating: 4.8, activeVisitsToday: 1, completedThisWeek: 13, availability: 'Available',
    zone: 'Mumbai - Navi Mumbai', phone: '+91 98765 43215', avatarBg: 'from-rose-400 to-red-600',
  },
];

const performanceData: PerformanceRow[] = [
  { id: '1', name: 'Raj Patel', visitsMonth: 56, avgRating: 4.9, plantsMaintained: 420, efficiency: 97 },
  { id: '2', name: 'Priya Sharma', visitsMonth: 52, avgRating: 4.9, plantsMaintained: 388, efficiency: 95 },
  { id: '6', name: 'Anita Desai', visitsMonth: 50, avgRating: 4.8, plantsMaintained: 375, efficiency: 96 },
  { id: '3', name: 'Deepak Nair', visitsMonth: 48, avgRating: 4.8, plantsMaintained: 340, efficiency: 93 },
  { id: '4', name: 'Sneha Reddy', visitsMonth: 44, avgRating: 4.7, plantsMaintained: 310, efficiency: 91 },
  { id: '5', name: 'Amit Kumar', visitsMonth: 38, avgRating: 4.6, plantsMaintained: 280, efficiency: 89 },
];

/* -------------------------------------------------------------------------- */
/*  Helper Components                                                          */
/* -------------------------------------------------------------------------- */

function AvailabilityBadge({ status }: { status: string }) {
  const config: Record<string, { classes: string; dot: string }> = {
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
  const { classes, dot } = (config[status] ?? config.Available)!;

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold', classes)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />
      {status}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i < full
              ? 'fill-amber-400 text-amber-400'
              : i === full && hasHalf
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-gray-200 dark:text-gray-600',
          )}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-gray-700 dark:text-gray-300">{rating}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PartnerTechniciansPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Technician Team"
        description="Manage your technicians, view performance, and assign tasks."
        breadcrumbs={[
          { label: 'Partner', href: '/dashboard/partner' },
          { label: 'Technicians' },
        ]}
        actions={
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40">
            <UserPlus className="h-4 w-4" />
            Add Technician
          </button>
        }
      />

      {/* Technician Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {technicians.map((tech, index) => (
          <motion.div
            key={tech.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl transition-shadow hover:shadow-lg hover:shadow-emerald-500/5 dark:border-white/5 dark:bg-gray-900/50"
          >
            {/* Top Section */}
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-lg font-bold text-white shadow-lg', tech.avatarBg)}>
                {tech.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{tech.name}</h4>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{tech.specialization}</p>
                  </div>
                  <AvailabilityBadge status={tech.availability} />
                </div>
                <div className="mt-2">
                  <StarRating rating={tech.rating} />
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <Calendar className="h-3 w-3" />
                  Active Today
                </div>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{tech.activeVisitsToday}</p>
              </div>
              <div className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <CheckCircle2 className="h-3 w-3" />
                  This Week
                </div>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{tech.completedThisWeek}</p>
              </div>
            </div>

            {/* Zone & Contact */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <MapPin className="h-3 w-3 shrink-0" />
                {tech.zone}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Phone className="h-3 w-3 shrink-0" />
                {tech.phone}
              </div>
            </div>

            {/* Quick Assign Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
            >
              <Zap className="h-3.5 w-3.5" />
              Quick Assign
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
      >
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Monthly Performance</h3>
          <p className="mt-0.5 text-xs text-gray-500">Performance metrics for the current month</p>
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
              {performanceData.map((row, index) => (
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
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{row.avgRating}</span>
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
                            row.efficiency >= 95 ? 'bg-emerald-500' : row.efficiency >= 90 ? 'bg-green-500' : 'bg-amber-500',
                          )}
                        />
                      </div>
                      <span className={cn(
                        'text-xs font-semibold',
                        row.efficiency >= 95 ? 'text-emerald-600' : row.efficiency >= 90 ? 'text-green-600' : 'text-amber-600',
                      )}>
                        {row.efficiency}%
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
