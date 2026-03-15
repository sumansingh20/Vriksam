'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Star,
  Users,
  MapPin,
  X,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface Team {
  id: string;
  name: string;
  lead: string;
  memberCount: number;
  zone: string;
  averageRating: number;
  color: string;
}

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                 */
/* -------------------------------------------------------------------------- */

const teams: Team[] = [
  { id: 'TM-001', name: 'Green Warriors', lead: 'Raj Patel', memberCount: 6, zone: 'Mumbai', averageRating: 4.8, color: 'from-emerald-500 to-green-600' },
  { id: 'TM-002', name: 'Leaf Legends', lead: 'Priya Sharma', memberCount: 5, zone: 'Bangalore', averageRating: 4.9, color: 'from-sky-500 to-cyan-600' },
  { id: 'TM-003', name: 'Root Rangers', lead: 'Amit Kumar', memberCount: 4, zone: 'Delhi', averageRating: 4.6, color: 'from-violet-500 to-purple-600' },
  { id: 'TM-004', name: 'Canopy Crew', lead: 'Sneha Reddy', memberCount: 7, zone: 'Hyderabad', averageRating: 4.7, color: 'from-amber-500 to-orange-500' },
  { id: 'TM-005', name: 'Flora Force', lead: 'Anita Desai', memberCount: 5, zone: 'Chennai', averageRating: 4.9, color: 'from-rose-500 to-pink-600' },
  { id: 'TM-006', name: 'Nature Knights', lead: 'Deepak Nair', memberCount: 4, zone: 'Pune', averageRating: 4.5, color: 'from-teal-500 to-emerald-600' },
];

/* -------------------------------------------------------------------------- */
/*  Team Card                                                                 */
/* -------------------------------------------------------------------------- */

function TeamCard({ team, index }: { team: Team; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl transition-all duration-300 hover:border-emerald-200/60 hover:shadow-glow-sm dark:border-white/5 dark:bg-gray-900/50 dark:hover:border-emerald-500/20"
    >
      {/* Top color band */}
      <div className={cn('h-1.5 bg-gradient-to-r', team.color)} />

      <div className="p-5">
        {/* Name and zone */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {team.name}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="h-3 w-3" />
              {team.zone}
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              {team.averageRating}
            </span>
          </div>
        </div>

        {/* Lead */}
        <div className="mt-4">
          <p className="text-xs text-gray-400">Team Lead</p>
          <div className="mt-1 flex items-center gap-2">
            <div className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white',
              team.color
            )}>
              {team.lead.split(' ').map((n) => n[0]).join('')}
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {team.lead}
            </span>
          </div>
        </div>

        {/* Member count */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/5">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <strong className="text-gray-900 dark:text-white">{team.memberCount}</strong> members
            </span>
          </div>
          <button className="text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400">
            View Team
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Create Team Modal                                                         */
/* -------------------------------------------------------------------------- */

function CreateTeamModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-elevated dark:border-white/10 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Team
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Team Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Bloom Brigade"
                  className="w-full rounded-xl border border-gray-200/80 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Team Lead
                </label>
                <select className="w-full rounded-xl border border-gray-200/80 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-700 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
                  <option value="">Select lead...</option>
                  <option value="raj">Raj Patel</option>
                  <option value="priya">Priya Sharma</option>
                  <option value="amit">Amit Kumar</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Zone
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mumbai"
                  className="w-full rounded-xl border border-gray-200/80 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button className="btn-emerald rounded-xl">
                Create Team
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AdminTeamsPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teams"
        description="Organize technicians into teams by zone and specialization."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Teams' },
        ]}
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="btn-emerald flex items-center gap-2 rounded-xl"
          >
            <Plus className="h-4 w-4" />
            Create Team
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {teams.map((team, index) => (
          <TeamCard key={team.id} team={team} index={index} />
        ))}
      </div>

      <CreateTeamModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
