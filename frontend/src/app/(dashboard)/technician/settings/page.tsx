'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface DaySchedule {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface NotificationPref {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const profileData = {
  name: 'Raj Patel',
  phone: '+91 98765 43210',
  specialization: 'Indoor Tropical Plants',
  certifications: ['Certified Horticulturist (AIPH)', 'Plant Health Inspector', 'Integrated Pest Management'],
};

const initialSchedule: DaySchedule[] = [
  { day: 'Monday', enabled: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Tuesday', enabled: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Wednesday', enabled: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Thursday', enabled: true, startTime: '09:00', endTime: '18:00' },
  { day: 'Friday', enabled: true, startTime: '09:00', endTime: '17:00' },
  { day: 'Saturday', enabled: true, startTime: '10:00', endTime: '14:00' },
  { day: 'Sunday', enabled: false, startTime: '09:00', endTime: '18:00' },
];

const initialNotifications: NotificationPref[] = [
  { id: 'new_assignment', label: 'New Assignments', description: 'Get notified when a new service visit is assigned to you', enabled: true },
  { id: 'schedule_change', label: 'Schedule Changes', description: 'Alerts when your schedule is modified or visits are rescheduled', enabled: true },
  { id: 'reminders', label: 'Visit Reminders', description: 'Receive reminders 30 minutes before each scheduled visit', enabled: true },
  { id: 'client_feedback', label: 'Client Feedback', description: 'Get notified when clients leave feedback on your visits', enabled: false },
  { id: 'weekly_summary', label: 'Weekly Summary', description: 'Receive a weekly performance summary every Monday', enabled: true },
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

export default function TechnicianSettingsPage() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [newCert, setNewCert] = useState('');
  const [certifications, setCertifications] = useState(profileData.certifications);

  const toggleDay = (dayIndex: number) => {
    setSchedule((prev) =>
      prev.map((d, i) => (i === dayIndex ? { ...d, enabled: !d.enabled } : d)),
    );
  };

  const updateTime = (dayIndex: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedule((prev) =>
      prev.map((d, i) => (i === dayIndex ? { ...d, [field]: value } : d)),
    );
  };

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)),
    );
  };

  const addCertification = () => {
    if (newCert.trim()) {
      setCertifications((prev) => [...prev, newCert.trim()]);
      setNewCert('');
    }
  };

  const removeCertification = (index: number) => {
    setCertifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, availability, and preferences."
        breadcrumbs={[
          { label: 'Technician', href: '/technician' },
          { label: 'Settings' },
        ]}
      />

      {/* Profile Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard>
          <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Profile</h3>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <User className="h-3.5 w-3.5" />
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={profileData.name}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Phone className="h-3.5 w-3.5" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue={profileData.phone}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Briefcase className="h-3.5 w-3.5" />
                Specialization
              </label>
              <select
                defaultValue={profileData.specialization}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
              >
                <option>Indoor Tropical Plants</option>
                <option>Succulents & Cacti</option>
                <option>Outdoor Landscaping</option>
                <option>Vertical Gardens</option>
                <option>Hydroponics</option>
                <option>General Horticulture</option>
              </select>
            </div>

            {/* Certifications */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Award className="h-3.5 w-3.5" />
                Certifications
              </label>
              <div className="space-y-2">
                {certifications.map((cert, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl bg-gray-50/80 px-4 py-2.5 dark:bg-white/[0.03]"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">{cert}</span>
                    <button
                      onClick={() => removeCertification(i)}
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
                    onChange={(e) => setNewCert(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCertification()}
                    placeholder="Add a certification..."
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    onClick={addCertification}
                    className="flex items-center gap-1 rounded-xl bg-emerald-500 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40">
                Save Profile
              </button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Availability Schedule */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard>
          <div className="mb-6 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Availability Schedule</h3>
          </div>
          <div className="space-y-3">
            {schedule.map((day, i) => (
              <div
                key={day.day}
                className={cn(
                  'flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center',
                  day.enabled
                    ? 'bg-gray-50/80 dark:bg-white/[0.03]'
                    : 'bg-gray-50/40 opacity-60 dark:bg-white/[0.01]',
                )}
              >
                <div className="flex items-center gap-3 sm:w-36">
                  <ToggleSwitch enabled={day.enabled} onChange={() => toggleDay(i)} />
                  <span className={cn('text-sm font-medium', day.enabled ? 'text-gray-900 dark:text-white' : 'text-gray-400')}>
                    {day.day}
                  </span>
                </div>

                {day.enabled && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <input
                        type="time"
                        value={day.startTime}
                        onChange={(e) => updateTime(i, 'startTime', e.target.value)}
                        className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <span className="text-xs text-gray-400">to</span>
                    <input
                      type="time"
                      value={day.endTime}
                      onChange={(e) => updateTime(i, 'endTime', e.target.value)}
                      className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none dark:border-white/10 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                )}

                {!day.enabled && (
                  <span className="text-xs text-gray-400">Unavailable</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40">
              Save Schedule
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard>
          <div className="mb-6 flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
          </div>
          <div className="space-y-3">
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
      </motion.div>
    </div>
  );
}
