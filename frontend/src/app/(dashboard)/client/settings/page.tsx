'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Building2,
  Bell,
  Smartphone,
  Eye,
  EyeOff,
  Pencil,
  Check,
  X,
  Shield,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface NotificationPref {
  id: string;
  label: string;
  description: string;
  email: boolean;
  sms: boolean;
  push: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const profileData = {
  name: 'Rahul Mehta',
  email: 'rahul.mehta@techcorp.com',
  phone: '+91 98765 43210',
  company: 'TechCorp Ltd',
};

const initialNotifications: NotificationPref[] = [
  { id: 'maintenance', label: 'Maintenance Alerts', description: 'Upcoming and completed maintenance visits', email: true, sms: true, push: true },
  { id: 'health', label: 'Plant Health Updates', description: 'Alerts when plant health scores change', email: true, sms: false, push: true },
  { id: 'billing', label: 'Billing & Invoices', description: 'Payment confirmations and invoice reminders', email: true, sms: false, push: false },
  { id: 'reports', label: 'Report Ready', description: 'Notification when reports are generated', email: true, sms: false, push: true },
  { id: 'newsletter', label: 'Tips & Newsletter', description: 'Plant care tips and product updates', email: false, sms: false, push: false },
];

const connectedAccounts = [
  { id: 'google', name: 'Google', description: 'Sign in with Google', connected: true, icon: '🔗' },
  { id: 'slack', name: 'Slack', description: 'Receive notifications in Slack', connected: false, icon: '💬' },
];

/* -------------------------------------------------------------------------- */
/*  Toggle Switch                                                              */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Glass Card                                                                 */
/* -------------------------------------------------------------------------- */

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50', className)}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ClientSettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(profileData);
  const [editProfile, setEditProfile] = useState(profileData);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSaveProfile = () => {
    setProfile(editProfile);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  const toggleNotification = (id: string, channel: 'email' | 'sms' | 'push') => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [channel]: !n[channel] } : n)),
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences."
        breadcrumbs={[
          { label: 'Client', href: '/client' },
          { label: 'Settings' },
        ]}
      />

      {/* Profile Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-300"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 dark:border-white/10"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {[
              { key: 'name' as const, label: 'Full Name', icon: User, type: 'text' },
              { key: 'email' as const, label: 'Email Address', icon: Mail, type: 'email' },
              { key: 'phone' as const, label: 'Phone Number', icon: Phone, type: 'tel' },
              { key: 'company' as const, label: 'Company', icon: Building2, type: 'text' },
            ].map((field) => {
              const Icon = field.icon;
              const isCompany = field.key === 'company';
              return (
                <div key={field.key} className="flex items-center gap-4 rounded-xl bg-gray-50/80 p-4 dark:bg-white/[0.03]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5">
                    <Icon className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <label className="mb-0.5 block text-xs font-medium text-gray-400">
                      {field.label}
                    </label>
                    {isEditing && !isCompany ? (
                      <input
                        type={field.type}
                        value={editProfile[field.key]}
                        onChange={(e) => setEditProfile((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full border-none bg-transparent p-0 text-sm font-medium text-gray-900 outline-none focus:ring-0 dark:text-white"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {profile[field.key]}
                        {isCompany && isEditing && (
                          <span className="ml-2 text-xs text-gray-400">(read-only)</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard>
          <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            Notification Preferences
          </h3>

          {/* Header */}
          <div className="mb-3 flex items-center gap-4 px-4">
            <div className="flex-1" />
            <div className="flex items-center gap-6">
              <div className="flex w-14 items-center justify-center gap-1">
                <Mail className="h-3 w-3 text-gray-400" />
                <span className="text-[10px] font-semibold text-gray-400">Email</span>
              </div>
              <div className="flex w-14 items-center justify-center gap-1">
                <Smartphone className="h-3 w-3 text-gray-400" />
                <span className="text-[10px] font-semibold text-gray-400">SMS</span>
              </div>
              <div className="flex w-14 items-center justify-center gap-1">
                <Bell className="h-3 w-3 text-gray-400" />
                <span className="text-[10px] font-semibold text-gray-400">Push</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center gap-4 rounded-xl bg-gray-50/80 p-4 dark:bg-white/[0.03]"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {notification.label}
                  </p>
                  <p className="text-xs text-gray-500">{notification.description}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex w-14 justify-center">
                    <ToggleSwitch
                      enabled={notification.email}
                      onChange={() => toggleNotification(notification.id, 'email')}
                    />
                  </div>
                  <div className="flex w-14 justify-center">
                    <ToggleSwitch
                      enabled={notification.sms}
                      onChange={() => toggleNotification(notification.id, 'sms')}
                    />
                  </div>
                  <div className="flex w-14 justify-center">
                    <ToggleSwitch
                      enabled={notification.push}
                      onChange={() => toggleNotification(notification.id, 'push')}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Connected Accounts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard>
          <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            Connected Accounts
          </h3>
          <div className="space-y-3">
            {connectedAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between rounded-xl bg-gray-50/80 p-4 dark:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg dark:bg-white/5">
                    {account.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{account.name}</p>
                    <p className="text-xs text-gray-500">{account.description}</p>
                  </div>
                </div>
                <button
                  className={cn(
                    'rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                    account.connected
                      ? 'border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:text-red-400'
                      : 'border border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/20 dark:text-emerald-400',
                  )}
                >
                  {account.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <GlassCard>
          <div className="mb-6 flex items-center gap-3">
            <Shield className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Change Password
            </h3>
          </div>
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
      </motion.div>
    </div>
  );
}
