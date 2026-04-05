'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Settings,
  Bell,
  CreditCard,
  Users,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  Monitor,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import authService from '@/services/auth.service';
import api from '@/services/api';

type SettingsTab = 'general' | 'notifications' | 'billing' | 'team' | 'security';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface TechnicianRow {
  id: string;
  specialization?: string | null;
  isAvailable?: boolean;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string | null;
  };
  _count?: {
    serviceVisits?: number;
  };
}

interface InvoiceRow {
  id: string;
  status?: string;
  totalAmount?: number;
  amountPaid?: number;
  issueDate?: string;
  paidDate?: string | null;
  client?: {
    companyName?: string;
  };
}

interface NotificationPreferencesState {
  email: boolean;
  push: boolean;
  sms: boolean;
  maintenanceReminders: boolean;
  paymentAlerts: boolean;
  healthAlerts: boolean;
}

const defaultNotifications: NotificationPreferencesState = {
  email: true,
  push: true,
  sms: false,
  maintenanceReminders: true,
  paymentAlerts: true,
  healthAlerts: true,
};

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'security', label: 'Security', icon: Shield },
];

const notificationRows: Array<{
  key: keyof NotificationPreferencesState;
  label: string;
  description: string;
}> = [
  {
    key: 'maintenanceReminders',
    label: 'Maintenance reminders',
    description: 'Receive alerts for upcoming and overdue maintenance.',
  },
  {
    key: 'healthAlerts',
    label: 'Plant health alerts',
    description: 'Get notified when plant health falls below thresholds.',
  },
  {
    key: 'paymentAlerts',
    label: 'Payment alerts',
    description: 'Track successful and failed payments quickly.',
  },
  {
    key: 'email',
    label: 'Email channel',
    description: 'Send notifications to your registered email.',
  },
  {
    key: 'push',
    label: 'Push channel',
    description: 'Enable in-app push notification delivery.',
  },
  {
    key: 'sms',
    label: 'SMS channel',
    description: 'Send critical alerts to your phone number.',
  },
];

function ToggleSwitch({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(value);
}

function detectBrowser(userAgent: string): string {
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Edg')) return 'Edge';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  return 'Browser';
}

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    timezone: 'Asia/Kolkata',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState<NotificationPreferencesState>(
    defaultNotifications,
  );

  useEffect(() => {
    const u = (user ?? {}) as Record<string, unknown>;
    const userPreferences =
      ((u.preferences as { notifications?: Partial<NotificationPreferencesState> } | undefined)
        ?.notifications as Partial<NotificationPreferencesState> | undefined) ?? {};

    setProfileForm((prev) => ({
      ...prev,
      name: String(u.name ?? ''),
      email: String(u.email ?? ''),
      phone: String(u.phone ?? ''),
    }));

    setNotifications({
      ...defaultNotifications,
      ...userPreferences,
    });
  }, [user]);

  const deviceSession = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        device: 'Current Device',
        browser: 'Browser',
        platform: 'Web',
      };
    }

    const ua = window.navigator.userAgent;
    const platform = window.navigator.platform || 'Unknown Platform';

    return {
      device: /Mobile|Android|iPhone|iPad/i.test(ua) ? 'Mobile Device' : 'Desktop Device',
      browser: detectBrowser(ua),
      platform,
    };
  }, []);

  const techniciansQuery = useQuery({
    queryKey: ['admin', 'settings', 'technicians'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<TechnicianRow[]> & { pagination?: unknown }>(
        '/technicians',
        {
          params: { page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' },
        },
      );

      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const invoicesQuery = useQuery({
    queryKey: ['admin', 'settings', 'invoices'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<InvoiceRow[]> & { pagination?: unknown }>(
        '/invoices',
        {
          params: { page: 1, limit: 100, sortBy: 'issueDate', sortOrder: 'desc' },
        },
      );

      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const billingStats = useMemo(() => {
    const invoices = invoicesQuery.data ?? [];

    const paid = invoices.filter((invoice) =>
      String(invoice.status ?? '').toUpperCase().includes('PAID'),
    );

    const pending = invoices.filter((invoice) =>
      String(invoice.status ?? '').toUpperCase().includes('PENDING'),
    );

    const paidAmount = paid.reduce(
      (sum, invoice) => sum + Number(invoice.amountPaid ?? invoice.totalAmount ?? 0),
      0,
    );

    const pendingAmount = pending.reduce(
      (sum, invoice) => sum + Number(invoice.totalAmount ?? 0),
      0,
    );

    return {
      paidInvoices: paid.length,
      pendingInvoices: pending.length,
      paidAmount,
      pendingAmount,
    };
  }, [invoicesQuery.data]);

  const saveProfileMutation = useMutation({
    mutationFn: async () => {
      return authService.updateProfile({
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim(),
        preferences: {
          notifications,
        },
      } as never);
    },
    onSuccess: (nextUser) => {
      updateUser(nextUser as never);
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      return authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
    },
    onSuccess: () => {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
  });

  const notificationsDirty = useMemo(() => {
    const original =
      (((user as unknown as { preferences?: { notifications?: NotificationPreferencesState } })
        ?.preferences?.notifications as NotificationPreferencesState | undefined) ??
        defaultNotifications);

    return Object.keys(defaultNotifications).some((key) => {
      const k = key as keyof NotificationPreferencesState;
      return Boolean(original[k]) !== Boolean(notifications[k]);
    });
  }, [notifications, user]);

  const isSaving = saveProfileMutation.isPending;
  const isPasswordUpdating = changePasswordMutation.isPending;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage real account settings, billing visibility, team access, and security controls."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Settings' },
        ]}
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full shrink-0 lg:w-56">
          <GlassCard className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
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

        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'general' && (
              <GlassCard>
                <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                  General Settings
                </h3>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="admin-name" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <input
                      id="admin-name"
                      type="text"
                      value={profileForm.name}
                      onChange={(event) =>
                        setProfileForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <input
                        id="admin-email"
                        type="email"
                        value={profileForm.email}
                        readOnly
                        title="Email is managed by authentication and cannot be edited here"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 dark:border-white/10 dark:bg-gray-800 dark:text-gray-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="admin-phone" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone
                      </label>
                      <input
                        id="admin-phone"
                        type="tel"
                        value={profileForm.phone}
                        onChange={(event) =>
                          setProfileForm((prev) => ({ ...prev, phone: event.target.value }))
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="admin-timezone" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Timezone
                    </label>
                    <select
                      id="admin-timezone"
                      value={profileForm.timezone}
                      onChange={(event) =>
                        setProfileForm((prev) => ({ ...prev, timezone: event.target.value }))
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
                      <option value="Asia/Dubai">Asia/Dubai (UTC+4:00)</option>
                      <option value="Europe/London">Europe/London (UTC+0:00)</option>
                      <option value="America/New_York">America/New_York (UTC-5:00)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {saveProfileMutation.isError ? (
                      <p className="text-xs text-red-600">
                        {(saveProfileMutation.error as Error)?.message || 'Unable to save profile.'}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">Profile is saved to your authenticated account.</p>
                    )}
                    <button
                      type="button"
                      onClick={() => saveProfileMutation.mutate()}
                      disabled={isSaving}
                      className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </GlassCard>
            )}

            {activeTab === 'notifications' && (
              <GlassCard>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notification Preferences
                  </h3>
                  <button
                    type="button"
                    onClick={() => saveProfileMutation.mutate()}
                    disabled={!notificationsDirty || isSaving}
                    className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:text-gray-300"
                  >
                    {isSaving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>

                <div className="space-y-4">
                  {notificationRows.map((row) => (
                    <div
                      key={row.key}
                      className="flex items-center justify-between rounded-xl bg-gray-50/80 p-4 dark:bg-white/[0.03]"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{row.label}</p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {row.description}
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={notifications[row.key]}
                        onChange={(nextValue) =>
                          setNotifications((prev) => ({ ...prev, [row.key]: nextValue }))
                        }
                        label={`Toggle ${row.label}`}
                      />
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {activeTab === 'billing' && (
              <GlassCard>
                <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                  Billing Snapshot
                </h3>

                {invoicesQuery.isLoading ? (
                  <div className="flex items-center gap-2 rounded-xl bg-gray-50/80 px-4 py-3 text-sm text-gray-600 dark:bg-white/[0.03] dark:text-gray-300">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading invoice analytics...
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-xl bg-emerald-50/70 p-4 dark:bg-emerald-500/10">
                        <p className="text-xs text-gray-500">Paid amount</p>
                        <p className="mt-1 text-xl font-bold text-emerald-700 dark:text-emerald-400">
                          {formatCurrency(billingStats.paidAmount)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-amber-50/70 p-4 dark:bg-amber-500/10">
                        <p className="text-xs text-gray-500">Pending amount</p>
                        <p className="mt-1 text-xl font-bold text-amber-700 dark:text-amber-400">
                          {formatCurrency(billingStats.pendingAmount)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-sky-50/70 p-4 dark:bg-sky-500/10">
                        <p className="text-xs text-gray-500">Paid invoices</p>
                        <p className="mt-1 text-xl font-bold text-sky-700 dark:text-sky-400">
                          {billingStats.paidInvoices}
                        </p>
                      </div>
                      <div className="rounded-xl bg-violet-50/70 p-4 dark:bg-violet-500/10">
                        <p className="text-xs text-gray-500">Pending invoices</p>
                        <p className="mt-1 text-xl font-bold text-violet-700 dark:text-violet-400">
                          {billingStats.pendingInvoices}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200/70 p-4 dark:border-white/10">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Recent invoices</p>
                      <div className="mt-3 space-y-2">
                        {(invoicesQuery.data ?? []).slice(0, 6).map((invoice) => (
                          <div
                            key={invoice.id}
                            className="flex items-center justify-between rounded-lg bg-gray-50/70 px-3 py-2 text-xs dark:bg-white/[0.03]"
                          >
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-200">
                                {invoice.client?.companyName || 'Client account'}
                              </p>
                              <p className="text-gray-500">{invoice.id}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(Number(invoice.totalAmount ?? 0))}
                              </p>
                              <p className="text-gray-500">{String(invoice.status ?? 'UNKNOWN')}</p>
                            </div>
                          </div>
                        ))}
                        {(invoicesQuery.data ?? []).length === 0 && (
                          <p className="text-xs text-gray-500">No invoice records found for this account.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>
            )}

            {activeTab === 'team' && (
              <GlassCard>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Field Team
                  </h3>
                  <button
                    type="button"
                    onClick={() => techniciansQuery.refetch()}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh
                  </button>
                </div>

                {techniciansQuery.isLoading ? (
                  <div className="flex items-center gap-2 rounded-xl bg-gray-50/80 px-4 py-3 text-sm text-gray-600 dark:bg-white/[0.03] dark:text-gray-300">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading technician roster...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(techniciansQuery.data ?? []).map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between rounded-xl bg-gray-50/80 p-4 dark:bg-white/[0.03]"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {member.user?.name || 'Unnamed technician'}
                          </p>
                          <p className="text-xs text-gray-500">{member.user?.email || 'No email'}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {member.specialization || 'General maintenance'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            Visits: {member._count?.serviceVisits ?? 0}
                          </p>
                          <span
                            className={cn(
                              'mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                              member.isAvailable
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400',
                            )}
                          >
                            {member.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </div>
                    ))}

                    {(techniciansQuery.data ?? []).length === 0 && (
                      <p className="text-sm text-gray-500">No technicians found.</p>
                    )}
                  </div>
                )}
              </GlassCard>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <GlassCard>
                  <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="admin-current-password" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          id="admin-current-password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(event) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              currentPassword: event.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                        />
                        <button
                          type="button"
                          aria-label="Toggle current password visibility"
                          title="Toggle current password visibility"
                          onClick={() => setShowCurrentPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="admin-new-password" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="admin-new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(event) =>
                            setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
                          }
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                        />
                        <button
                          type="button"
                          aria-label="Toggle new password visibility"
                          title="Toggle new password visibility"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="admin-confirm-password" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm New Password
                      </label>
                      <input
                        id="admin-confirm-password"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(event) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            confirmPassword: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {changePasswordMutation.isError ? (
                        <p className="text-xs text-red-600">
                          {(changePasswordMutation.error as Error)?.message ||
                            'Unable to update password.'}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400">Use a strong password with uppercase, lowercase, number, and symbol.</p>
                      )}
                      <button
                        type="button"
                        onClick={() => changePasswordMutation.mutate()}
                        disabled={isPasswordUpdating}
                        className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isPasswordUpdating ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Active Session</h3>
                  <div className="rounded-xl bg-gray-50/80 p-4 dark:bg-white/[0.03]">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5">
                          {deviceSession.device.includes('Mobile') ? (
                            <Smartphone className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Monitor className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {deviceSession.device}
                          </p>
                          <p className="text-xs text-gray-500">
                            {deviceSession.browser} - {deviceSession.platform}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        CURRENT
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    Session revocation is managed by central security policy. Use account logout flows to end active access.
                  </p>
                </GlassCard>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
