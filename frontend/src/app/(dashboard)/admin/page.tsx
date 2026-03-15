'use client';

import {
  Users,
  Sprout,
  IndianRupee,
  Wrench,
} from 'lucide-react';
import { StatsOverview, type StatItem } from '@/components/dashboard/stats-overview';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { PlantHealthChart } from '@/components/dashboard/plant-health-chart';
import { RecentActivity, type ActivityItem } from '@/components/dashboard/recent-activity';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { PageHeader } from '@/components/layout/page-header';

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                 */
/* -------------------------------------------------------------------------- */

const stats: StatItem[] = [
  {
    title: 'Total Clients',
    value: 248,
    change: 12.5,
    icon: Users,
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-500/10',
    sparklineData: [180, 195, 210, 205, 220, 235, 240, 248],
  },
  {
    title: 'Active Plants',
    value: 1842,
    change: 8.3,
    icon: Sprout,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-500/10',
    sparklineData: [1500, 1580, 1620, 1700, 1750, 1790, 1820, 1842],
  },
  {
    title: 'Monthly Revenue',
    value: 950000,
    prefix: '₹',
    formattedValue: '₹9,50,000',
    change: 15.2,
    icon: IndianRupee,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-500/10',
    sparklineData: [620, 680, 720, 750, 810, 860, 920, 950],
  },
  {
    title: 'Active Technicians',
    value: 36,
    change: -2.1,
    icon: Wrench,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-500/10',
    sparklineData: [38, 37, 36, 38, 37, 35, 36, 36],
  },
];

const activities: ActivityItem[] = [
  { id: '1', type: 'new_client', description: 'EcoVentures signed up for Premium plan', timeAgo: '5 min ago', user: 'System' },
  { id: '2', type: 'maintenance', description: 'Scheduled maintenance completed at TechCorp HQ', timeAgo: '12 min ago', user: 'Raj Patel' },
  { id: '3', type: 'health_alert', description: 'Critical health alert: Boston Fern at Hyderabad Tower', timeAgo: '25 min ago' },
  { id: '4', type: 'payment', description: 'Payment received from GreenSpace Inc - ₹45,000', timeAgo: '1 hour ago' },
  { id: '5', type: 'plant', description: '15 new Monstera plants added to Mumbai HQ inventory', timeAgo: '2 hours ago', user: 'Priya Sharma' },
  { id: '6', type: 'maintenance', description: 'Maintenance visit rescheduled for Delhi Campus', timeAgo: '3 hours ago', user: 'Amit Kumar' },
  { id: '7', type: 'new_client', description: 'Palm Residences joined as new residential client', timeAgo: '4 hours ago' },
  { id: '8', type: 'payment', description: 'Invoice #INV-2026-0342 paid by Wellness Hub', timeAgo: '5 hours ago' },
  { id: '9', type: 'health_alert', description: 'Calathea at Delhi Campus needs attention', timeAgo: '6 hours ago' },
  { id: '10', type: 'maintenance', description: 'Weekly maintenance report generated', timeAgo: '8 hours ago', user: 'System' },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Welcome back, Admin"
        description="Here's what's happening with your green infrastructure today."
        showAccent={false}
      />

      {/* Stats */}
      <StatsOverview stats={stats} />

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Revenue chart - takes 2 columns */}
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>

        {/* Plant health - 1 column */}
        <div>
          <PlantHealthChart />
        </div>
      </div>

      {/* Secondary grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity feed - 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} maxHeight="380px" />
        </div>

        {/* Quick actions - 1 column */}
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
