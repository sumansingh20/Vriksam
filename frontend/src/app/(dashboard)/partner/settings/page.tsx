'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Users,
  CreditCard,
  Bell,
  Upload,
  Trash2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type SettingsTab = 'profile' | 'team' | 'billing' | 'notifications';

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  email: string;
  status: 'Active' | 'Invited' | 'Inactive';
  avatarBg: string;
}

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface PaymentHistoryItem {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

/* -------------------------------------------------------------------------- */
/*  Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const teamMembers: TeamMember[] = [
  { id: '1', name: 'Arjun Kapoor', initials: 'AK', role: 'Owner', email: 'arjun@partner.vriksham.org', status: 'Active', avatarBg: 'from-emerald-400 to-green-600' },
  { id: '2', name: 'Priya Menon', initials: 'PM', role: 'Operations Manager', email: 'priya@partner.vriksham.org', status: 'Active', avatarBg: 'from-teal-400 to-cyan-600' },
  { id: '3', name: 'Vikram Shah', initials: 'VS', role: 'Team Lead', email: 'vikram@partner.vriksham.org', status: 'Active', avatarBg: 'from-violet-400 to-purple-600' },
  { id: '4', name: 'Neha Gupta', initials: 'NG', role: 'Coordinator', email: 'neha@partner.vriksham.org', status: 'Invited', avatarBg: 'from-amber-400 to-orange-600' },
];

const initialNotifications: NotificationSetting[] = [
  { id: 'visit_scheduled', label: 'Visit Scheduled', description: 'Notify when a new service visit is scheduled', enabled: true },
  { id: 'visit_completed', label: 'Visit Completed', description: 'Notify when a technician completes a visit', enabled: true },
  { id: 'health_alert', label: 'Plant Health Alerts', description: 'Receive alerts when plant health drops below threshold', enabled: true },
  { id: 'new_client', label: 'New Client Onboarded', description: 'Notify when a new client is added to your portfolio', enabled: true },
  { id: 'payment_received', label: 'Payment Received', description: 'Notify when a client payment is received', enabled: false },
  { id: 'weekly_report', label: 'Weekly Summary Report', description: 'Receive automated weekly performance summary', enabled: true },
  { id: 'technician_issue', label: 'Technician Issues', description: 'Alert when a technician reports an issue', enabled: true },
  { id: 'overdue_visit', label: 'Overdue Visit Alerts', description: 'Notify when visits become overdue', enabled: true },
];

const paymentHistory: PaymentHistoryItem[] = [
  { id: '1', date: 'Mar 1, 2026', description: 'Monthly Subscription - Professional Plan', amount: '\u20B924,999', status: 'Paid' },
  { id: '2', date: 'Feb 1, 2026', description: 'Monthly Subscription - Professional Plan', amount: '\u20B924,999', status: 'Paid' },
  { id: '3', date: 'Jan 1, 2026', description: 'Monthly Subscription - Professional Plan', amount: '\u20B924,999', status: 'Paid' },
  { id: '4', date: 'Dec 1, 2025', description: 'Monthly Subscription - Professional Plan', amount: '\u20B924,999', status: 'Paid' },
  { id: '5', date: 'Nov 1, 2025', description: 'Monthly Subscription - Basic Plan', amount: '\u20B914,999', status: 'Paid' },
];

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: Settings },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

/* -------------------------------------------------------------------------- */
/*  Helper Components                                                          */
/* -------------------------------------------------------------------------- */

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50', className)}>
      {children}
    </div>
  );
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors duration-200',
        enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600',
      )}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    Invited: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    Inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400',
    Paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    Failed: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  };
  return (
    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold', config[status] ?? config.Active)}>
      {status}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PartnerSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [notifications, setNotifications] = useState(initialNotifications);

  const toggleNotification = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)));
  };

  const inputClasses =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your partner account, team, billing, and notification preferences."
        breadcrumbs={[
          { label: 'Partner', href: '/dashboard/partner' },
          { label: 'Settings' },
        ]}
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full shrink-0 lg:w-56">
          <GlassCard className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                      activeTab === tab.id
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </GlassCard>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* ---- Profile ---- */}
            {activeTab === 'profile' && (
              <GlassCard>
                <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                  Company Profile
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company Name
                    </label>
                    <input type="text" defaultValue="GreenCare Solutions Pvt. Ltd." className={inputClasses} />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <input type="email" defaultValue="partner@vriksham.org" className={inputClasses} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone
                      </label>
                      <input type="tel" defaultValue="+91 80 4567 8901" className={inputClasses} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Address
                    </label>
                    <input type="text" defaultValue="42, Green Avenue, Koramangala, Bangalore - 560034" className={inputClasses} />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        GST Number
                      </label>
                      <input type="text" defaultValue="29AADCG1234F1ZH" className={inputClasses} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        PAN Number
                      </label>
                      <input type="text" defaultValue="AADCG1234F" className={inputClasses} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company Logo
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 text-lg font-bold text-white shadow-lg">
                        GC
                      </div>
                      <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300">
                        <Upload className="h-4 w-4" />
                        Upload New Logo
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40">
                      Save Changes
                    </button>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* ---- Team ---- */}
            {activeTab === 'team' && (
              <GlassCard>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Team Members
                  </h3>
                  <button className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600">
                    Invite Member
                  </button>
                </div>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-xl bg-gray-50/80 p-4 dark:bg-white/[0.03]"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white', member.avatarBg)}>
                          {member.initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          {member.role}
                        </span>
                        <StatusBadge status={member.status} />
                        {member.role !== 'Owner' && (
                          <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* ---- Billing ---- */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                {/* Current Plan */}
                <GlassCard>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Current Plan
                  </h3>
                  <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 p-5 dark:from-emerald-500/5 dark:to-green-500/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Subscription</p>
                        <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400">Professional Plan</p>
                        <p className="mt-1 text-sm text-gray-500">Billed monthly - next renewal on Apr 1, 2026</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Monthly Cost</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{'\u20B9'}24,999</p>
                      </div>
                    </div>
                  </div>

                  {/* Usage */}
                  <div className="mt-5 space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Usage</h4>
                    {[
                      { label: 'Clients', current: 24, max: 50 },
                      { label: 'Technicians', current: 8, max: 15 },
                      { label: 'Plants', current: 1847, max: 5000 },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {item.current.toLocaleString()} / {item.max.toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${(item.current / item.max) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Payment History */}
                <GlassCard>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Payment History
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-white/5">
                          <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Date</th>
                          <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">Description</th>
                          <th className="px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">Amount</th>
                          <th className="px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                        {paymentHistory.map((payment) => (
                          <tr key={payment.id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                            <td className="px-3 py-3 text-sm text-gray-600 dark:text-gray-400">{payment.date}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 dark:text-white">{payment.description}</td>
                            <td className="px-3 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">{payment.amount}</td>
                            <td className="px-3 py-3 text-center">
                              <StatusBadge status={payment.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              </div>
            )}

            {/* ---- Notifications ---- */}
            {activeTab === 'notifications' && (
              <GlassCard>
                <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-center justify-between rounded-xl bg-gray-50/80 p-4 dark:bg-white/[0.03]"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.label}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {notification.description}
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={notification.enabled}
                        onChange={() => toggleNotification(notification.id)}
                      />
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
