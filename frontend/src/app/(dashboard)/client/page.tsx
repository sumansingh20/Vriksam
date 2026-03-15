'use client';

import { motion } from 'framer-motion';
import {
  TreePine,
  Calendar,
  CreditCard,
  Heart,
  CloudRain,
  Wind,
  Award,
} from 'lucide-react';
import { PlantHealthChart } from '@/components/dashboard/plant-health-chart';
import { MaintenanceCalendar } from '@/components/dashboard/maintenance-calendar';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Quick Stat Card                                                           */
/* -------------------------------------------------------------------------- */

function QuickStat({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
  bg,
  index,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtitle?: string;
  color: string;
  bg: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl border border-gray-200 bg-white p-5"
    >
      <div className={cn('mb-3 inline-flex rounded-lg p-2.5', bg)}>
        <Icon className={cn('h-5 w-5', color)} />
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
      )}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  ESG Summary Card                                                          */
/* -------------------------------------------------------------------------- */

function ESGSummaryCard() {
  const metrics = [
    { icon: CloudRain, label: 'CO2 Absorbed', value: '324 kg', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { icon: Wind, label: 'O2 Produced', value: '248 kg', color: 'text-sky-600', bg: 'bg-sky-500/10' },
    { icon: Award, label: 'Green Score', value: '87/100', color: 'text-amber-600', bg: 'bg-amber-500/10' },
    { icon: Heart, label: 'Wellness', value: '92%', color: 'text-rose-600', bg: 'bg-rose-500/10' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white p-5"
    >
      <h3 className="mb-4 text-sm font-semibold text-gray-900">
        ESG Impact Summary
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', metric.bg)}>
                <Icon className={cn('h-4 w-4', metric.color)} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{metric.label}</p>
                <p className="text-sm font-bold text-gray-900">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

const myPlantHealth = [
  { name: 'Healthy', value: 38, color: '#10b981' },
  { name: 'Needs Attention', value: 5, color: '#f59e0b' },
  { name: 'Critical', value: 2, color: '#ef4444' },
  { name: 'Replaced', value: 0, color: '#8b5cf6' },
];

export default function ClientDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome back, Rahul"
        description="Here's the status of your green infrastructure at TechCorp Ltd."
        showAccent={false}
      />

      {/* Quick stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <QuickStat icon={TreePine} label="My Plants" value="45" subtitle="Across 3 locations" color="text-emerald-600" bg="bg-emerald-500/10" index={0} />
        <QuickStat icon={Calendar} label="Next Maintenance" value="Mar 18" subtitle="Raj Patel assigned" color="text-sky-600" bg="bg-sky-500/10" index={1} />
        <QuickStat icon={CreditCard} label="Subscription" value="Enterprise" subtitle="Active - Annual billing" color="text-violet-600" bg="bg-violet-500/10" index={2} />
        <QuickStat icon={Heart} label="Health Score" value="92%" subtitle="+3% from last month" color="text-rose-600" bg="bg-rose-500/10" index={3} />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PlantHealthChart data={myPlantHealth} />
        <ESGSummaryCard />
      </div>

      {/* Upcoming maintenance */}
      <MaintenanceCalendar
        visits={[
          { id: '1', date: '2026-03-18', clientName: 'TechCorp Ltd', location: 'Mumbai HQ, Floor 3', technician: 'Raj Patel', status: 'scheduled' },
          { id: '2', date: '2026-03-20', clientName: 'TechCorp Ltd', location: 'Mumbai HQ, Lobby', technician: 'Raj Patel', status: 'scheduled' },
          { id: '3', date: '2026-03-25', clientName: 'TechCorp Ltd', location: 'Pune Office', technician: 'Sneha Reddy', status: 'scheduled' },
          { id: '4', date: '2026-03-14', clientName: 'TechCorp Ltd', location: 'Mumbai HQ, Floor 5', technician: 'Raj Patel', status: 'completed' },
        ]}
      />
    </div>
  );
}
