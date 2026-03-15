'use client';

import { motion } from 'framer-motion';
import {
  Users,
  Leaf,
  CalendarCheck,
  UserCog,
  Clock,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  UserPlus,
  IndianRupee,
  ClipboardCheck,
  FileBarChart,
  Search as SearchIcon,
  Wrench,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  sparklineData: number[];
}

interface ScheduleVisit {
  id: string;
  time: string;
  client: string;
  location: string;
  technician: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
}

interface ActivityItem {
  id: string;
  type: 'maintenance' | 'health_alert' | 'new_client' | 'payment' | 'inspection' | 'team' | 'plant' | 'report';
  description: string;
  timeAgo: string;
  user?: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  href: string;
}

/* -------------------------------------------------------------------------- */
/*  Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const stats: StatCard[] = [
  {
    title: 'Active Clients',
    value: 24,
    change: 8.3,
    icon: Users,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-500/10',
    sparklineData: [18, 19, 20, 20, 21, 22, 23, 24],
  },
  {
    title: 'Plants Managed',
    value: '1,847',
    change: 5.7,
    icon: Leaf,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-500/10',
    sparklineData: [1620, 1680, 1710, 1740, 1770, 1800, 1830, 1847],
  },
  {
    title: 'Scheduled Visits',
    value: 12,
    change: -4.2,
    icon: CalendarCheck,
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-500/10',
    sparklineData: [15, 14, 16, 13, 12, 14, 13, 12],
  },
  {
    title: 'Team Members',
    value: 8,
    change: 14.3,
    icon: UserCog,
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-500/10',
    sparklineData: [5, 5, 6, 6, 7, 7, 7, 8],
  },
];

const todaySchedule: ScheduleVisit[] = [
  { id: '1', time: '09:00 AM', client: 'TechCorp Ltd', location: 'Mumbai HQ, Floor 3', technician: 'Raj Patel', status: 'completed' },
  { id: '2', time: '10:30 AM', client: 'GreenSpace Inc', location: 'Bangalore Campus', technician: 'Priya Sharma', status: 'in_progress' },
  { id: '3', time: '12:00 PM', client: 'Wellness Hub', location: 'Hyderabad Tower, Lobby', technician: 'Deepak Nair', status: 'scheduled' },
  { id: '4', time: '02:30 PM', client: 'EcoVentures', location: 'Pune Office Park', technician: 'Sneha Reddy', status: 'scheduled' },
  { id: '5', time: '04:00 PM', client: 'Palm Residences', location: 'Delhi Green Villas', technician: 'Amit Kumar', status: 'overdue' },
];

const recentActivity: ActivityItem[] = [
  { id: '1', type: 'maintenance', description: 'Maintenance completed at TechCorp Ltd, Floor 3', timeAgo: '10 min ago', user: 'Raj Patel' },
  { id: '2', type: 'health_alert', description: 'Critical health alert: Fiddle Leaf Fig at Bangalore Campus', timeAgo: '25 min ago' },
  { id: '3', type: 'new_client', description: 'Skyline Towers onboarded as new corporate client', timeAgo: '1 hour ago' },
  { id: '4', type: 'payment', description: 'Payment received from GreenSpace Inc - Rs.67,500', timeAgo: '2 hours ago' },
  { id: '5', type: 'inspection', description: 'Plant inspection report submitted for Wellness Hub', timeAgo: '3 hours ago', user: 'Deepak Nair' },
  { id: '6', type: 'team', description: 'Anita Desai marked available for assignments', timeAgo: '3 hours ago' },
  { id: '7', type: 'plant', description: '23 new indoor plants added to Palm Residences inventory', timeAgo: '4 hours ago', user: 'Sneha Reddy' },
  { id: '8', type: 'report', description: 'Weekly performance report auto-generated for March W2', timeAgo: '5 hours ago' },
];

const quickActions: QuickAction[] = [
  { title: 'Schedule Visit', description: 'Book a new service visit', icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-500/10', href: '/dashboard/partner/maintenance' },
  { title: 'Add Client', description: 'Onboard a new client', icon: UserPlus, color: 'text-green-600', bg: 'bg-green-500/10', href: '/dashboard/partner/clients' },
  { title: 'Plant Inspection', description: 'Start a health checkup', icon: SearchIcon, color: 'text-teal-600', bg: 'bg-teal-500/10', href: '/dashboard/partner/plants' },
  { title: 'Generate Report', description: 'Create analytics report', icon: FileBarChart, color: 'text-sky-600', bg: 'bg-sky-500/10', href: '/dashboard/partner/reports' },
];

/* -------------------------------------------------------------------------- */
/*  Sparkline                                                                  */
/* -------------------------------------------------------------------------- */

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 28;
  const padding = 2;

  const points = data
    .map((val, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Status Badge                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; classes: string }> = {
    scheduled: { label: 'Scheduled', classes: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' },
    in_progress: { label: 'In Progress', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' },
    completed: { label: 'Completed', classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
    overdue: { label: 'Overdue', classes: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' },
  };

  const { label, classes } = (config[status] ?? config.scheduled)!;

  return (
    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold', classes)}>
      {label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Activity Icon                                                              */
/* -------------------------------------------------------------------------- */

function ActivityIcon({ type }: { type: string }) {
  const config: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    maintenance: { icon: Wrench, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    health_alert: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-500/10' },
    new_client: { icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    payment: { icon: IndianRupee, color: 'text-violet-600', bg: 'bg-violet-500/10' },
    inspection: { icon: ClipboardCheck, color: 'text-teal-600', bg: 'bg-teal-500/10' },
    team: { icon: UserCog, color: 'text-sky-600', bg: 'bg-sky-500/10' },
    plant: { icon: Leaf, color: 'text-green-600', bg: 'bg-green-500/10' },
    report: { icon: FileBarChart, color: 'text-amber-600', bg: 'bg-amber-500/10' },
  };

  const { icon: Icon, color, bg } = (config[type] ?? config.maintenance)!;

  return (
    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', bg)}>
      <Icon className={cn('h-4 w-4', color)} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PartnerDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Good morning, Partner Team"
        description="Here's an overview of your service operations and team activity today."
        showAccent={false}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl transition-shadow hover:shadow-lg hover:shadow-emerald-500/5 dark:border-white/5 dark:bg-gray-900/50"
            >
              <div className="flex items-start justify-between">
                <div className={cn('inline-flex rounded-xl p-2.5', stat.iconBg)}>
                  <Icon className={cn('h-5 w-5', stat.iconColor)} />
                </div>
                <MiniSparkline
                  data={stat.sparklineData}
                  color={stat.change >= 0 ? '#10b981' : '#ef4444'}
                />
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <div className="mt-1 flex items-end gap-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <span
                  className={cn(
                    'mb-0.5 flex items-center gap-0.5 text-xs font-semibold',
                    stat.change >= 0 ? 'text-emerald-600' : 'text-red-500',
                  )}
                >
                  {stat.change >= 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {Math.abs(stat.change)}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Two-column layout: Schedule + Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Service Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Today&apos;s Service Schedule
            </h3>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              {todaySchedule.length} visits
            </span>
          </div>
          <div className="space-y-3">
            {todaySchedule.map((visit, index) => (
              <motion.div
                key={visit.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.05 }}
                className="flex items-center gap-3 rounded-xl bg-gray-50/80 p-3 transition-colors hover:bg-gray-100/80 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
              >
                <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Clock className="mr-1 h-3 w-3 text-emerald-600" />
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    {visit.time.replace(' AM', '').replace(' PM', '')}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {visit.client}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{visit.location}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    Technician: {visit.technician}
                  </p>
                </div>
                <StatusBadge status={visit.status} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <button className="text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400">
              View All
            </button>
          </div>
          <div className="space-y-3" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.04 }}
                className="flex gap-3 rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]"
              >
                <ActivityIcon type={activity.type} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {activity.description}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                    <span>{activity.timeAgo}</span>
                    {activity.user && (
                      <>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <span>{activity.user}</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.a
                key={action.title}
                href={action.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl transition-all hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/10 dark:border-white/5 dark:bg-gray-900/50 dark:hover:border-emerald-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className={cn('relative mb-3 inline-flex rounded-xl p-2.5', action.bg)}>
                  <Icon className={cn('h-5 w-5', action.color)} />
                </div>
                <h4 className="relative text-sm font-semibold text-gray-900 dark:text-white">
                  {action.title}
                </h4>
                <p className="relative mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
