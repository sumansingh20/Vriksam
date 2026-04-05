'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Settings,
  Users,
  CreditCard,
  Bell,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import authService from '@/services/auth.service';
import api from '@/services/api';

type SettingsTab = 'profile' | 'team' | 'billing' | 'notifications';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  pagination?: {
    total?: number;
  };
}

interface TechnicianRow {
  id: string;
  specialization?: string | null;
  isAvailable?: boolean;
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
}

interface InvoiceRow {
  id: string;
  status?: string;
  totalAmount?: number;
  amountPaid?: number;
  issueDate?: string;
  client?: {
    companyName?: string;
  };
}

interface NotificationState {
  email: boolean;
  push: boolean;
  sms: boolean;
  maintenanceReminders: boolean;
  paymentAlerts: boolean;
  healthAlerts: boolean;
}

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: Settings },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const defaultNotifications: NotificationState = {
  email: true,
  push: true,
  sms: false,
  maintenanceReminders: true,
  paymentAlerts: true,
  healthAlerts: true,
};

const notificationRows: Array<{
  key: keyof NotificationState;
  label: string;
  description: string;
}> = [
  {
    key: 'maintenanceReminders',
    label: 'Visit reminders',
    description: 'Notify when a service visit is due or overdue.',
  },
  {
    key: 'healthAlerts',
    label: 'Plant health alerts',
    description: 'Get critical updates when plant condition degrades.',
  },
  {
    key: 'paymentAlerts',
    label: 'Payment updates',
    description: 'Receive payment confirmation and failure alerts.',
  },
  {
    key: 'email',
    label: 'Email channel',
    description: 'Send notifications to your registered email.',
  },
  {
    key: 'push',
    label: 'Push channel',
    description: 'Allow in-app and browser push notifications.',
  },
  {
    key: 'sms',
    label: 'SMS channel',
    description: 'Send urgent notifications to your phone.',
  },
];

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

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function PartnerSettingsPage() {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [notifications, setNotifications] = useState<NotificationState>(
    defaultNotifications,
  );

  useEffect(() => {
    const currentUser = (user ?? {}) as Record<string, unknown>;
    const userNotifications =
      ((currentUser.preferences as { notifications?: Partial<NotificationState> } | undefined)
        ?.notifications as Partial<NotificationState> | undefined) ?? {};

    setProfileForm((prev) => ({
      ...prev,
      name: String(currentUser.name ?? ''),
      email: String(currentUser.email ?? ''),
      phone: String(currentUser.phone ?? ''),
    }));

    setNotifications({
      ...defaultNotifications,
      ...userNotifications,
    });
  }, [user]);

  const techniciansQuery = useQuery({
    queryKey: ['partner', 'settings', 'technicians'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<TechnicianRow[]>>('/technicians', {
        params: { page: 1, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' },
      });

      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const invoicesQuery = useQuery({
    queryKey: ['partner', 'settings', 'invoices'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<InvoiceRow[]>>('/invoices', {
        params: { page: 1, limit: 80, sortBy: 'issueDate', sortOrder: 'desc' },
      });

      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const clientsTotalQuery = useQuery({
    queryKey: ['partner', 'settings', 'clientCount'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<unknown[]>>('/clients', {
        params: { page: 1, limit: 1 },
      });

      return Number(response.pagination?.total ?? response.data?.length ?? 0);
    },
    staleTime: 60 * 1000,
  });

  const plantsTotalQuery = useQuery({
    queryKey: ['partner', 'settings', 'plantCount'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<unknown[]>>('/plants', {
        params: { page: 1, limit: 1 },
      });

      return Number(response.pagination?.total ?? response.data?.length ?? 0);
    },
    staleTime: 60 * 1000,
  });

  const billingStats = useMemo(() => {
    const invoices = invoicesQuery.data ?? [];
    const paid = invoices.filter((invoice) =>
      String(invoice.status ?? '').toUpperCase().includes('PAID'),
    );
    const paidAmount = paid.reduce(
      (sum, invoice) => sum + Number(invoice.amountPaid ?? invoice.totalAmount ?? 0),
      0,
    );

    return {
      paidAmount,
      paidCount: paid.length,
      totalCount: invoices.length,
      pendingCount: invoices.filter((invoice) =>
        String(invoice.status ?? '').toUpperCase().includes('PENDING'),
      ).length,
    };
  }, [invoicesQuery.data]);

  const saveProfileMutation = useMutation({
    mutationFn: async () => {
      return authService.updateProfile({
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim(),
        preferences: { notifications },
      } as never);
    },
    onSuccess: (updated) => {
      updateUser(updated as never);
    },
  });

  const teamSize = techniciansQuery.data?.length ?? 0;
  const clientsTotal = clientsTotalQuery.data ?? 0;
  const plantsTotal = plantsTotalQuery.data ?? 0;

  const usageRows = [
    { label: 'Clients', current: clientsTotal },
    { label: 'Technicians', current: teamSize },
    { label: 'Plants', current: plantsTotal },
  ];
  const usageScaleMax = Math.max(...usageRows.map((item) => item.current), 1);

  const inputClasses =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your live partner profile, team visibility, billing, and notifications."
        breadcrumbs={[
          { label: 'Partner', href: '/partner' },
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
            {activeTab === 'profile' && (
              <GlassCard>
                <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                  Company Profile
                </h3>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="partner-name" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company / Account Name
                    </label>
                    <input
                      id="partner-name"
                      type="text"
                      value={profileForm.name}
                      onChange={(event) =>
                        setProfileForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                      className={inputClasses}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="partner-email" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <input id="partner-email" type="email" value={profileForm.email} readOnly className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 dark:border-white/10 dark:bg-gray-800 dark:text-gray-400" />
                    </div>
                    <div>
                      <label htmlFor="partner-phone" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone
                      </label>
                      <input
                        id="partner-phone"
                        type="tel"
                        value={profileForm.phone}
                        onChange={(event) =>
                          setProfileForm((prev) => ({ ...prev, phone: event.target.value }))
                        }
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <p className="rounded-xl border border-emerald-100/60 bg-emerald-50/70 px-4 py-3 text-xs text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 sm:col-span-2">
                      Profile fields are connected to your live account data. Tax IDs and brand assets are managed through onboarding support.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {saveProfileMutation.isError ? (
                      <p className="text-xs text-red-600">
                        {(saveProfileMutation.error as Error)?.message || 'Unable to save profile.'}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">Saved to your authenticated profile.</p>
                    )}
                    <button
                      type="button"
                      onClick={() => saveProfileMutation.mutate()}
                      disabled={saveProfileMutation.isPending}
                      className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {saveProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </GlassCard>
            )}

            {activeTab === 'team' && (
              <GlassCard>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Team Members
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
                    Loading live team data...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(techniciansQuery.data ?? []).map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between rounded-xl bg-gray-50/80 p-4 dark:bg-white/[0.03]"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.user?.name || 'Unnamed technician'}
                          </p>
                          <p className="text-xs text-gray-500">{member.user?.email || 'No email'}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {member.specialization || 'General maintenance'}
                          </p>
                        </div>
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-1 text-[11px] font-semibold',
                            member.isAvailable
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400',
                          )}
                        >
                          {member.isAvailable ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                    {(techniciansQuery.data ?? []).length === 0 && (
                      <p className="text-sm text-gray-500">No team members available.</p>
                    )}
                  </div>
                )}
              </GlassCard>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <GlassCard>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Billing Overview
                  </h3>
                  {invoicesQuery.isLoading ? (
                    <div className="flex items-center gap-2 rounded-xl bg-gray-50/80 px-4 py-3 text-sm text-gray-600 dark:bg-white/[0.03] dark:text-gray-300">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading invoice data...
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-xl bg-emerald-50/70 p-4 dark:bg-emerald-500/10">
                        <p className="text-xs text-gray-500">Revenue collected</p>
                        <p className="mt-1 text-lg font-bold text-emerald-700 dark:text-emerald-400">
                          {formatCurrency(billingStats.paidAmount)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-sky-50/70 p-4 dark:bg-sky-500/10">
                        <p className="text-xs text-gray-500">Paid invoices</p>
                        <p className="mt-1 text-lg font-bold text-sky-700 dark:text-sky-400">
                          {billingStats.paidCount}
                        </p>
                      </div>
                      <div className="rounded-xl bg-amber-50/70 p-4 dark:bg-amber-500/10">
                        <p className="text-xs text-gray-500">Pending invoices</p>
                        <p className="mt-1 text-lg font-bold text-amber-700 dark:text-amber-400">
                          {billingStats.pendingCount}
                        </p>
                      </div>
                      <div className="rounded-xl bg-violet-50/70 p-4 dark:bg-violet-500/10">
                        <p className="text-xs text-gray-500">Total invoices</p>
                        <p className="mt-1 text-lg font-bold text-violet-700 dark:text-violet-400">
                          {billingStats.totalCount}
                        </p>
                      </div>
                    </div>
                  )}
                </GlassCard>

                <GlassCard>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Usage</h3>
                  <div className="space-y-3">
                    {usageRows.map((item) => {
                      const usagePercent = Math.round((item.current / usageScaleMax) * 100);

                      return (
                        <div key={item.label} className="rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.03]">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {item.current.toLocaleString()} live records
                            </span>
                          </div>
                          <progress
                            value={item.current}
                            max={usageScaleMax}
                            className="mt-2 h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-emerald-500"
                            aria-label={`${item.label} usage ${usagePercent} percent`}
                            title={`${item.label} usage ${usagePercent} percent`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </div>
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
                    disabled={saveProfileMutation.isPending}
                    className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:text-gray-300"
                  >
                    {saveProfileMutation.isPending ? 'Saving...' : 'Save'}
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
                        onChange={(value) =>
                          setNotifications((prev) => ({ ...prev, [row.key]: value }))
                        }
                        label={`Toggle ${row.label}`}
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
