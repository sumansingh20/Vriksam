'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Bell,
  CreditCard,
  Users,
  Shield,
  Code,
  Upload,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  LogOut,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type SettingsTab = 'general' | 'notifications' | 'billing' | 'team' | 'security' | 'api';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  icon: React.ElementType;
  current: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const initialNotifications: NotificationSetting[] = [
  { id: 'maintenance', label: 'Maintenance Due', description: 'Get notified when plant maintenance is scheduled or overdue', enabled: true },
  { id: 'plant_health', label: 'Plant Health Alerts', description: 'Receive alerts when plant health drops below threshold', enabled: true },
  { id: 'payments', label: 'Payment Notifications', description: 'Get notified about payment receipts, failures, and refunds', enabled: true },
  { id: 'new_clients', label: 'New Client Signups', description: 'Receive notifications when new clients register', enabled: false },
  { id: 'weekly_report', label: 'Weekly Summary Report', description: 'Automated weekly summary delivered every Monday', enabled: true },
  { id: 'technician_updates', label: 'Technician Updates', description: 'Updates when technicians complete visits or report issues', enabled: false },
];

const activeSessions: ActiveSession[] = [
  { id: '1', device: 'MacBook Pro', browser: 'Chrome 122', location: 'Bangalore, India', lastActive: 'Now', icon: Monitor, current: true },
  { id: '2', device: 'iPhone 15', browser: 'Safari Mobile', location: 'Bangalore, India', lastActive: '2 hours ago', icon: Smartphone, current: false },
  { id: '3', device: 'Windows Desktop', browser: 'Firefox 124', location: 'Mumbai, India', lastActive: '1 day ago', icon: Monitor, current: false },
];

/* -------------------------------------------------------------------------- */
/*  Tab config                                                                 */
/* -------------------------------------------------------------------------- */

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'api', label: 'API', icon: Code },
];

/* -------------------------------------------------------------------------- */
/*  Toggle Switch                                                              */
/* -------------------------------------------------------------------------- */

function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
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

/* -------------------------------------------------------------------------- */
/*  Glass Card                                                                 */
/* -------------------------------------------------------------------------- */

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50',
        className,
      )}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [notifications, setNotifications] = useState(initialNotifications);
  const [twoFactor, setTwoFactor] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)),
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your platform settings and preferences."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
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
            {/* ---- General ---- */}
            {activeTab === 'general' && (
              <GlassCard>
                <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                  General Settings
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company Name
                    </label>
                    <input
                      type="text"
                      defaultValue="VRIKSHAM Green Infrastructure Pvt. Ltd."
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="admin@vriksham.com"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone
                      </label>
                      <input
                        type="tel"
                        defaultValue="+91 80 4567 8901"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company Logo
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 text-lg font-bold text-white shadow-lg">
                        V
                      </div>
                      <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300">
                        <Upload className="h-4 w-4" />
                        Upload New Logo
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Timezone
                    </label>
                    <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white">
                      <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
                      <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4:00)</option>
                      <option value="America/New_York">America/New_York (EST, UTC-5:00)</option>
                      <option value="Europe/London">Europe/London (GMT, UTC+0:00)</option>
                    </select>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40">
                      Save Changes
                    </button>
                  </div>
                </div>
              </GlassCard>
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

            {/* ---- Billing ---- */}
            {activeTab === 'billing' && (
              <GlassCard>
                <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                  Billing Settings
                </h3>
                <div className="space-y-6">
                  <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 p-5 dark:from-emerald-500/5 dark:to-green-500/5">
                    <p className="text-sm font-medium text-gray-500">Current Plan</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400">Enterprise</p>
                    <p className="mt-1 text-sm text-gray-500">Billed annually - next renewal on Apr 1, 2026</p>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</p>
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 dark:border-white/10">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Visa ending in 4242</p>
                        <p className="text-xs text-gray-500">Expires 12/2027</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-300">
                      Update Payment Method
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
                  {[
                    { name: 'Arjun K.', email: 'arjun@vriksham.com', role: 'Owner', initials: 'AK' },
                    { name: 'Priya S.', email: 'priya@vriksham.com', role: 'Admin', initials: 'PS' },
                    { name: 'Vikram R.', email: 'vikram@vriksham.com', role: 'Manager', initials: 'VR' },
                  ].map((member) => (
                    <div key={member.email} className="flex items-center justify-between rounded-xl bg-gray-50/80 p-4 dark:bg-white/[0.03]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-xs font-bold text-white">
                          {member.initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* ---- Security ---- */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <GlassCard>
                  <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          placeholder="Enter current password"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Enter new password"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div className="flex justify-end pt-2">
                      <button className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40">
                        Update Password
                      </button>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Two-Factor Authentication
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                    <ToggleSwitch enabled={twoFactor} onChange={setTwoFactor} />
                  </div>
                </GlassCard>

                <GlassCard>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Active Sessions
                  </h3>
                  <div className="space-y-3">
                    {activeSessions.map((session) => {
                      const DeviceIcon = session.icon;
                      return (
                        <div key={session.id} className="flex items-center justify-between rounded-xl bg-gray-50/80 p-4 dark:bg-white/[0.03]">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5">
                              <DeviceIcon className="h-4 w-4 text-gray-500" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {session.device}
                                </p>
                                {session.current && (
                                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                                    CURRENT
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                {session.browser} - {session.location} - {session.lastActive}
                              </p>
                            </div>
                          </div>
                          {!session.current && (
                            <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
                              <LogOut className="h-3 w-3" />
                              Revoke
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </div>
            )}

            {/* ---- API ---- */}
            {activeTab === 'api' && (
              <GlassCard>
                <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                  API Configuration
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      API Key
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        readOnly
                        value="vk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-600 dark:border-white/10 dark:bg-gray-800 dark:text-gray-400"
                      />
                      <button className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-300">
                        Copy
                      </button>
                    </div>
                    <p className="mt-1.5 text-xs text-gray-400">
                      Keep your API key secret. Do not share it publicly.
                    </p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Webhook URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://your-server.com/webhook"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-gray-50/80 p-4 dark:bg-white/[0.03]">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Rate Limiting</p>
                      <p className="text-xs text-gray-500">Current: 1,000 requests/minute</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      Enterprise
                    </span>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40">
                      Save API Settings
                    </button>
                  </div>
                </div>
              </GlassCard>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
