'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  User,
  Phone,
  Award,
  Clock,
  Bell,
  Calendar,
  Plus,
  X,
  Briefcase,
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

interface TechnicianRow {
  id: string;
  specialization?: string | null;
  certifications?: string[];
  availability?: Record<string, { enabled?: boolean; startTime?: string; endTime?: string }>;
  user?: {
    id?: string;
    name?: string;
    phone?: string;
    email?: string;
  };
}

interface DaySchedule {
  day: string;
  key: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
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

const defaultSchedule: DaySchedule[] = [
  { day: 'Monday', key: 'monday', enabled: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Tuesday', key: 'tuesday', enabled: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Wednesday', key: 'wednesday', enabled: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Thursday', key: 'thursday', enabled: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Friday', key: 'friday', enabled: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Saturday', key: 'saturday', enabled: false, startTime: '10:00', endTime: '14:00' },
  { day: 'Sunday', key: 'sunday', enabled: false, startTime: '10:00', endTime: '14:00' },
];

const specializationOptions = [
  'Indoor Tropical Plants',
  'Succulents and Cacti',
  'Outdoor Landscaping',
  'Vertical Gardens',
  'Hydroponics',
  'General Horticulture',
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

export default function TechnicianSettingsPage() {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuth();

  const [profileName, setProfileName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState(specializationOptions[0] || 'General Horticulture');
  const [schedule, setSchedule] = useState<DaySchedule[]>(defaultSchedule);
  const [notifications, setNotifications] = useState<NotificationState>(defaultNotifications);

  const [newCert, setNewCert] = useState('');
  const [certifications, setCertifications] = useState<string[]>([]);

  const techniciansQuery = useQuery({
    queryKey: ['technician', 'settings', 'technicians'],
    queryFn: async () => {
      const response = await api.get<ApiEnvelope<TechnicianRow[]>>('/technicians', {
        params: { page: 1, limit: 100, sortBy: 'createdAt', sortOrder: 'desc' },
      });

      return response.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  const currentTechnician = useMemo(() => {
    const currentUserId = String((user as unknown as { id?: string })?.id ?? '');
    return (techniciansQuery.data ?? []).find(
      (technician) => String(technician.user?.id ?? '') === currentUserId,
    );
  }, [techniciansQuery.data, user]);

  useEffect(() => {
    const currentUser = (user ?? {}) as Record<string, unknown>;
    const userNotifications =
      ((currentUser.preferences as { notifications?: Partial<NotificationState> } | undefined)
        ?.notifications as Partial<NotificationState> | undefined) ?? {};

    setProfileName(String(currentUser.name ?? ''));
    setPhone(String(currentUser.phone ?? ''));
    setNotifications({ ...defaultNotifications, ...userNotifications });

    if (currentTechnician) {
      setSpecialization(currentTechnician.specialization || specializationOptions[0] || 'General Horticulture');
      setCertifications(currentTechnician.certifications ?? []);

      const availability = currentTechnician.availability ?? {};
      setSchedule(
        defaultSchedule.map((day) => ({
          ...day,
          enabled: availability[day.key]?.enabled ?? day.enabled,
          startTime: availability[day.key]?.startTime ?? day.startTime,
          endTime: availability[day.key]?.endTime ?? day.endTime,
        })),
      );
    }
  }, [currentTechnician, user]);

  const saveSettingsMutation = useMutation({
    mutationFn: async () => {
      await authService.updateProfile({
        name: profileName.trim(),
        phone: phone.trim(),
        preferences: { notifications },
      } as never);

      if (currentTechnician?.id) {
        const availability = schedule.reduce<Record<string, { enabled: boolean; startTime: string; endTime: string }>>(
          (acc, day) => {
            acc[day.key] = {
              enabled: day.enabled,
              startTime: day.startTime,
              endTime: day.endTime,
            };
            return acc;
          },
          {},
        );

        await api.put(`/technicians/${currentTechnician.id}`, {
          specialization,
          certifications,
          availability,
        });
      }
    },
    onSuccess: async () => {
      const refreshed = await authService.getMe();
      updateUser(refreshed as never);
      queryClient.invalidateQueries({ queryKey: ['technician', 'settings'] });
    },
  });

  const toggleDay = (dayIndex: number) => {
    setSchedule((prev) =>
      prev.map((day, index) => (index === dayIndex ? { ...day, enabled: !day.enabled } : day)),
    );
  };

  const updateTime = (dayIndex: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedule((prev) =>
      prev.map((day, index) => (index === dayIndex ? { ...day, [field]: value } : day)),
    );
  };

  const addCertification = () => {
    const value = newCert.trim();
    if (!value) return;
    if (certifications.includes(value)) {
      setNewCert('');
      return;
    }
    setCertifications((prev) => [...prev, value]);
    setNewCert('');
  };

  const removeCertification = (index: number) => {
    setCertifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your technician profile, availability, certifications, and alerts with live data."
        breadcrumbs={[
          { label: 'Technician', href: '/technician' },
          { label: 'Settings' },
        ]}
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard>
          <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Profile</h3>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="tech-name" className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <User className="h-3.5 w-3.5" />
                  Full Name
                </label>
                <input
                  id="tech-name"
                  type="text"
                  value={profileName}
                  onChange={(event) => setProfileName(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="tech-phone" className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Phone className="h-3.5 w-3.5" />
                  Phone Number
                </label>
                <input
                  id="tech-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="tech-specialization" className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Briefcase className="h-3.5 w-3.5" />
                Specialization
              </label>
              <select
                id="tech-specialization"
                value={specialization}
                onChange={(event) => setSpecialization(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
              >
                {specializationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Award className="h-3.5 w-3.5" />
                Certifications
              </label>
              <div className="space-y-2">
                {certifications.map((certification, index) => (
                  <div
                    key={`${certification}-${index}`}
                    className="flex items-center justify-between rounded-xl bg-gray-50/80 px-4 py-2.5 dark:bg-white/[0.03]"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">{certification}</span>
                    <button
                      type="button"
                      title={`Remove certification ${certification}`}
                      aria-label={`Remove certification ${certification}`}
                      onClick={() => removeCertification(index)}
                      className="text-gray-400 transition-colors hover:text-red-500"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCert}
                    onChange={(event) => setNewCert(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addCertification();
                      }
                    }}
                    placeholder="Add a certification"
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={addCertification}
                    className="flex items-center gap-1 rounded-xl bg-emerald-500 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard>
          <div className="mb-6 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Availability Schedule</h3>
          </div>

          {techniciansQuery.isLoading ? (
            <div className="flex items-center gap-2 rounded-xl bg-gray-50/80 px-4 py-3 text-sm text-gray-600 dark:bg-white/[0.03] dark:text-gray-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading technician schedule...
            </div>
          ) : (
            <div className="space-y-3">
              {schedule.map((day, index) => (
                <div
                  key={day.key}
                  className={cn(
                    'flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center',
                    day.enabled
                      ? 'bg-gray-50/80 dark:bg-white/[0.03]'
                      : 'bg-gray-50/40 opacity-70 dark:bg-white/[0.01]',
                  )}
                >
                  <div className="flex items-center gap-3 sm:w-36">
                    <ToggleSwitch
                      enabled={day.enabled}
                      onChange={() => toggleDay(index)}
                      label={`Toggle ${day.day}`}
                    />
                    <span className={cn('text-sm font-medium', day.enabled ? 'text-gray-900 dark:text-white' : 'text-gray-400')}>
                      {day.day}
                    </span>
                  </div>

                  {day.enabled ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <input
                          type="time"
                          value={day.startTime}
                          onChange={(event) => updateTime(index, 'startTime', event.target.value)}
                          title={`${day.day} start time`}
                          className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      <span className="text-xs text-gray-400">to</span>
                      <input
                        type="time"
                        value={day.endTime}
                        onChange={(event) => updateTime(index, 'endTime', event.target.value)}
                        title={`${day.day} end time`}
                        className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Unavailable</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard>
          <div className="mb-6 flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
          </div>

          <div className="space-y-3">
            {[
              {
                key: 'maintenanceReminders' as const,
                label: 'New assignments and reminders',
                description: 'Notify when a new visit is assigned or upcoming.',
              },
              {
                key: 'healthAlerts' as const,
                label: 'Plant health alerts',
                description: 'Get alerts for plants requiring urgent attention.',
              },
              {
                key: 'paymentAlerts' as const,
                label: 'Payment and invoice alerts',
                description: 'Receive payment status updates.',
              },
              {
                key: 'email' as const,
                label: 'Email channel',
                description: 'Deliver notifications through email.',
              },
              {
                key: 'push' as const,
                label: 'Push channel',
                description: 'Deliver notifications in app.',
              },
              {
                key: 'sms' as const,
                label: 'SMS channel',
                description: 'Send urgent updates by SMS.',
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between rounded-xl bg-gray-50/80 p-4 dark:bg-white/[0.03]"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
                <ToggleSwitch
                  enabled={notifications[item.key]}
                  onChange={(value) => setNotifications((prev) => ({ ...prev, [item.key]: value }))}
                  label={`Toggle ${item.label}`}
                />
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      <div className="flex items-center justify-between rounded-2xl border border-gray-200/60 bg-white/80 px-5 py-4 backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/50">
        {saveSettingsMutation.isError ? (
          <p className="text-xs text-red-600">
            {(saveSettingsMutation.error as Error)?.message || 'Unable to save technician settings.'}
          </p>
        ) : (
          <p className="text-xs text-gray-500">All changes are stored against your real account and technician profile.</p>
        )}

        <button
          type="button"
          onClick={() => saveSettingsMutation.mutate()}
          disabled={saveSettingsMutation.isPending}
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saveSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
