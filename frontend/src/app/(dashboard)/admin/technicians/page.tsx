'use client';

import { motion } from 'framer-motion';
import { Plus, Star, MapPin, Phone, Mail, CheckCircle, Clock } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                 */
/* -------------------------------------------------------------------------- */

interface Technician {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  activeVisits: number;
  completedToday: number;
  availability: 'available' | 'busy' | 'off_duty';
  phone: string;
  email: string;
  zone: string;
  avatar?: string;
}

const technicians: Technician[] = [
  { id: 'T001', name: 'Raj Patel', specialization: 'Indoor Plants', rating: 4.8, activeVisits: 3, completedToday: 5, availability: 'busy', phone: '+91 98765 43210', email: 'raj@vriksham.com', zone: 'Mumbai' },
  { id: 'T002', name: 'Priya Sharma', specialization: 'Tropical Plants', rating: 4.9, activeVisits: 2, completedToday: 4, availability: 'available', phone: '+91 87654 32109', email: 'priya@vriksham.com', zone: 'Bangalore' },
  { id: 'T003', name: 'Amit Kumar', specialization: 'Landscape & Outdoor', rating: 4.6, activeVisits: 4, completedToday: 3, availability: 'busy', phone: '+91 76543 21098', email: 'amit@vriksham.com', zone: 'Delhi' },
  { id: 'T004', name: 'Sneha Reddy', specialization: 'Succulents & Cacti', rating: 4.7, activeVisits: 1, completedToday: 6, availability: 'available', phone: '+91 65432 10987', email: 'sneha@vriksham.com', zone: 'Hyderabad' },
  { id: 'T005', name: 'Vikram Singh', specialization: 'Palm & Fern Care', rating: 4.5, activeVisits: 0, completedToday: 0, availability: 'off_duty', phone: '+91 54321 09876', email: 'vikram@vriksham.com', zone: 'Pune' },
  { id: 'T006', name: 'Anita Desai', specialization: 'Flowering Plants', rating: 4.9, activeVisits: 2, completedToday: 7, availability: 'busy', phone: '+91 43210 98765', email: 'anita@vriksham.com', zone: 'Chennai' },
  { id: 'T007', name: 'Kiran Joshi', specialization: 'Bonsai & Miniatures', rating: 4.4, activeVisits: 1, completedToday: 3, availability: 'available', phone: '+91 32109 87654', email: 'kiran@vriksham.com', zone: 'Kolkata' },
  { id: 'T008', name: 'Deepak Nair', specialization: 'Vertical Gardens', rating: 4.8, activeVisits: 3, completedToday: 4, availability: 'busy', phone: '+91 21098 76543', email: 'deepak@vriksham.com', zone: 'Mumbai' },
];

/* -------------------------------------------------------------------------- */
/*  Availability styles                                                       */
/* -------------------------------------------------------------------------- */

const AVAILABILITY_STYLES: Record<
  Technician['availability'],
  { label: string; className: string; dotColor: string }
> = {
  available: {
    label: 'Available',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    dotColor: 'bg-emerald-500',
  },
  busy: {
    label: 'Busy',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    dotColor: 'bg-amber-500',
  },
  off_duty: {
    label: 'Off Duty',
    className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
    dotColor: 'bg-gray-400',
  },
};

/* -------------------------------------------------------------------------- */
/*  Star Rating                                                               */
/* -------------------------------------------------------------------------- */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i < Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : i < rating
                ? 'fill-amber-400/50 text-amber-400'
                : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
          )}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Technician Card                                                           */
/* -------------------------------------------------------------------------- */

function TechnicianCard({ tech, index }: { tech: Technician; index: number }) {
  const availability = AVAILABILITY_STYLES[tech.availability];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 p-5 backdrop-blur-xl transition-all duration-300 hover:border-emerald-200/60 hover:shadow-glow-sm dark:border-white/5 dark:bg-gray-900/50 dark:hover:border-emerald-500/20"
    >
      {/* Availability badge */}
      <div className="absolute right-4 top-4">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
            availability.className
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', availability.dotColor)} />
          {availability.label}
        </span>
      </div>

      {/* Avatar & Name */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 text-lg font-bold text-white">
          {tech.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{tech.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{tech.specialization}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="mt-3">
        <StarRating rating={tech.rating} />
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-sky-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            <strong className="text-gray-900 dark:text-white">{tech.activeVisits}</strong> active
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            <strong className="text-gray-900 dark:text-white">{tech.completedToday}</strong> done today
          </span>
        </div>
      </div>

      {/* Contact & Zone */}
      <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3 dark:border-white/5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="h-3 w-3" />
          {tech.zone}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Phone className="h-3 w-3" />
          {tech.phone}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Mail className="h-3 w-3" />
          {tech.email}
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AdminTechniciansPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Technicians"
        description="Manage your field technicians, specializations, and availability."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Technicians' },
        ]}
        actions={
          <button className="btn-emerald flex items-center gap-2 rounded-xl">
            <Plus className="h-4 w-4" />
            Add Technician
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {technicians.map((tech, index) => (
          <TechnicianCard key={tech.id} tech={tech} index={index} />
        ))}
      </div>
    </div>
  );
}
