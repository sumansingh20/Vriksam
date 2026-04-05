'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  User,
  Mail,
  Phone,
  Building2,
  Eye,
  EyeOff,
  Pencil,
  Check,
  X,
  Shield,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import authService from '@/services/auth.service';
import api from '@/services/api';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface InvoiceRow {
  id: string;
  status?: string;
  totalAmount?: number;
  amountPaid?: number;
  issueDate?: string;
  paidDate?: string | null;
}

interface NotificationState {
  email: boolean;
  push: boolean;
  sms: boolean;
  maintenanceReminders: boolean;
  paymentAlerts: boolean;
  healthAlerts: boolean;
}

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
    label: 'Maintenance alerts',
    description: 'Upcoming and completed maintenance visits.',
  },
  {
    key: 'healthAlerts',
    label: 'Plant health updates',
    description: 'Health score changes and critical warnings.',
  },
  {
    key: 'paymentAlerts',
    label: 'Billing and invoices',
    description: 'Payment confirmations and invoice reminders.',
  },
  {
    key: 'email',
    label: 'Email channel',
    description: 'Receive updates by email.',
  },
  {
    key: 'push',
    label: 'Push channel',
    description: 'Allow in-app push notifications.',
  },
  {
    key: 'sms',
    label: 'SMS channel',
    description: 'Send urgent alerts by SMS.',
  },
];

function ToggleSwitch({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
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
    <div className={cn('rounded-2xl border border-gray-200/60 bg-white/80 p-6 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50', className)}>
      {children}
    </div>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ClientSettingsPage() {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  const [editProfile, setEditProfile] = useState(profile);
  const [notifications, setNotifications] = useState<NotificationState>(
    defaultNotifications,
  );

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const currentUser = (user ?? {}) as Record<string, unknown>;
    const userNotifications =
      ((currentUser.preferences as { notifications?: Partial<NotificationState> } | undefined)
        ?.notifications as Partial<NotificationState> | undefined) ?? {};

    const nextProfile = {
      name: String(currentUser.name ?? ''),
      email: String(currentUser.email ?? ''),
      phone: String(currentUser.phone ?? ''),
      company: String((currentUser as { company?: string }).company ?? ''),
    };

    setProfile(nextProfile);
    setEditProfile(nextProfile);
    setNotifications({ ...defaultNotifications, ...userNotifications });
  }, [user]);

  const invoicesQuery = useQuery({
    queryKey: ['client', 'settings', 'invoices'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<InvoiceRow[]> & { pagination?: unknown }>(
        '/invoices',
        {
          params: {
            page: 1,
            limit: 40,
            sortBy: 'issueDate',
            sortOrder: 'desc',
          },
        },
      );

      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const billingSummary = useMemo(() => {
    const invoices = invoicesQuery.data ?? [];
    const paid = invoices.filter((invoice) =>
      String(invoice.status ?? '').toUpperCase().includes('PAID'),
    );
    const pending = invoices.filter((invoice) =>
      String(invoice.status ?? '').toUpperCase().includes('PENDING'),
    );

    return {
      paidAmount: paid.reduce(
        (sum, invoice) => sum + Number(invoice.amountPaid ?? invoice.totalAmount ?? 0),
        0,
      ),
      paidCount: paid.length,
      pendingCount: pending.length,
    };
  }, [invoicesQuery.data]);

  const saveProfileMutation = useMutation({
    mutationFn: async () => {
      return authService.updateProfile({
        name: editProfile.name.trim(),
        phone: editProfile.phone.trim(),
        preferences: { notifications },
      } as never);
    },
    onSuccess: (updated) => {
      const next = {
        ...profile,
        name: editProfile.name,
        phone: editProfile.phone,
      };
      setProfile(next);
      setEditProfile(next);
      setIsEditing(false);
      updateUser(updated as never);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      return authService.changePassword(passwordForm);
    },
    onSuccess: () => {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
  });

  const toggleNotification = (id: keyof NotificationState, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [id]: value }));
  };

  const handleCancelEdit = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account settings and notification preferences with live account data."
        breadcrumbs={[
          { label: 'Client', href: '/client' },
          { label: 'Settings' },
        ]}
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h3>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-300"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 dark:border-white/10"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => saveProfileMutation.mutate()}
                  disabled={saveProfileMutation.isPending}
                  className="flex items-center gap-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Check className="h-3.5 w-3.5" />
                  {saveProfileMutation.isPending ? 'Saving...' : 'Save'}
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
              const readOnly = field.key === 'email' || field.key === 'company';
              const inputId = `client-profile-${field.key}`;

              return (
                <div key={field.key} className="flex items-center gap-4 rounded-xl bg-gray-50/80 p-4 dark:bg-white/[0.03]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5">
                    <Icon className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <label htmlFor={inputId} className="mb-0.5 block text-xs font-medium text-gray-400">
                      {field.label}
                    </label>
                    {isEditing && !readOnly ? (
                      <input
                        id={inputId}
                        type={field.type}
                        value={editProfile[field.key]}
                        onChange={(event) =>
                          setEditProfile((prev) => ({ ...prev, [field.key]: event.target.value }))
                        }
                        className="w-full border-none bg-transparent p-0 text-sm font-medium text-gray-900 outline-none focus:ring-0 dark:text-white"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {profile[field.key] || (readOnly ? 'Not available' : '-')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {saveProfileMutation.isError && (
            <p className="mt-3 text-xs text-red-600">
              {(saveProfileMutation.error as Error)?.message || 'Unable to save profile changes.'}
            </p>
          )}
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Preferences</h3>
            <button
              type="button"
              onClick={() => saveProfileMutation.mutate()}
              disabled={saveProfileMutation.isPending}
              className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:text-gray-300"
            >
              {saveProfileMutation.isPending ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>

          <div className="space-y-2">
            {notificationRows.map((notification) => (
              <div
                key={notification.key}
                className="flex items-center gap-4 rounded-xl bg-gray-50/80 p-4 dark:bg-white/[0.03]"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {notification.label}
                  </p>
                  <p className="text-xs text-gray-500">{notification.description}</p>
                </div>
                <ToggleSwitch
                  enabled={notifications[notification.key]}
                  onChange={(value) => toggleNotification(notification.key, value)}
                  label={`Toggle ${notification.label}`}
                />
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard>
          <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Billing</h3>

          {invoicesQuery.isLoading ? (
            <div className="flex items-center gap-2 rounded-xl bg-gray-50/80 px-4 py-3 text-sm text-gray-600 dark:bg-white/[0.03] dark:text-gray-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading billing records...
            </div>
          ) : (
            <>
              <div className="mb-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-emerald-50/70 p-4 dark:bg-emerald-500/10">
                  <p className="text-xs text-gray-500">Amount paid</p>
                  <p className="mt-1 text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(billingSummary.paidAmount)}
                  </p>
                </div>
                <div className="rounded-xl bg-sky-50/70 p-4 dark:bg-sky-500/10">
                  <p className="text-xs text-gray-500">Paid invoices</p>
                  <p className="mt-1 text-lg font-bold text-sky-700 dark:text-sky-400">
                    {billingSummary.paidCount}
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50/70 p-4 dark:bg-amber-500/10">
                  <p className="text-xs text-gray-500">Pending invoices</p>
                  <p className="mt-1 text-lg font-bold text-amber-700 dark:text-amber-400">
                    {billingSummary.pendingCount}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {(invoicesQuery.data ?? []).slice(0, 8).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between rounded-xl bg-gray-50/80 px-4 py-3 text-sm dark:bg-white/[0.03]">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Invoice {invoice.id}</p>
                      <p className="text-xs text-gray-500">
                        {invoice.issueDate
                          ? new Date(invoice.issueDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Unknown date'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(Number(invoice.totalAmount ?? 0))}
                      </p>
                      <p className="text-xs text-gray-500">{String(invoice.status ?? 'UNKNOWN')}</p>
                    </div>
                  </div>
                ))}

                {(invoicesQuery.data ?? []).length === 0 && (
                  <p className="text-sm text-gray-500">No invoices available for this account.</p>
                )}
              </div>
            </>
          )}
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <GlassCard>
          <div className="mb-6 flex items-center gap-3">
            <Shield className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="client-current-password" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Password
              </label>
              <div className="relative">
                <input
                  id="client-current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
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
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="client-new-password" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <div className="relative">
                <input
                  id="client-new-password"
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
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="client-confirm-password" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>
              <input
                id="client-confirm-password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(event) =>
                  setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                }
                  title="Confirm new password"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {changePasswordMutation.isError ? (
                <p className="text-xs text-red-600">
                  {(changePasswordMutation.error as Error)?.message || 'Unable to update password.'}
                </p>
              ) : (
                <p className="text-xs text-gray-400">Password changes are applied immediately after validation.</p>
              )}
              <button
                type="button"
                onClick={() => changePasswordMutation.mutate()}
                disabled={changePasswordMutation.isPending}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
