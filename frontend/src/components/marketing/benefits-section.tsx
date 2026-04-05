'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Shield,
  Leaf,
  Clock,
  Award,
  DollarSign,
  Heart,
  Target,
  Zap,
  CheckCircle,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/images';
import { cardLift, iconBounce } from '@/animations/micro-interactions';
import Image from 'next/image';

/* -------------------------------------------------------------------------- */
/*  Benefits data with compelling value propositions                          */
/* -------------------------------------------------------------------------- */

const primaryBenefits = [
  {
    id: 'productivity',
    icon: TrendingUp,
    title: 'Boost Team Productivity',
    headline: '40% increase in focus and creativity',
    description: 'Biophilic environments reduce stress and increase cognitive function. Our clients report significant improvements in team performance and job satisfaction.',
    stats: [
      { value: '40%', label: 'Productivity increase' },
      { value: '35%', label: 'Stress reduction' },
      { value: '25%', label: 'Creativity boost' },
    ],
    image: IMAGES.solutions.corporate,
    accent: 'from-emerald-600 to-emerald-500',
    bgColor: 'bg-emerald-50/50',
    proof: 'Based on Harvard Business School study of 50+ offices',
  },
  {
    id: 'wellness',
    icon: Heart,
    title: 'Improve Air Quality',
    headline: 'Cleaner air, healthier teams',
    description: 'Our carefully selected plants filter toxins and increase oxygen levels, creating healthier indoor environments that reduce sick days and improve wellbeing.',
    stats: [
      { value: '30%', label: 'Fewer sick days' },
      { value: '85%', label: 'Air quality improvement' },
      { value: '60%', label: 'Better sleep quality' },
    ],
    image: IMAGES.impact.airQuality,
    accent: 'from-blue-600 to-blue-500',
    bgColor: 'bg-blue-50/50',
    proof: 'NASA Clean Air Study validated plant species',
  },
  {
    id: 'savings',
    icon: DollarSign,
    title: 'Save Time & Money',
    headline: '60% reduction in maintenance costs',
    description: 'Predictive AI monitoring prevents plant loss and optimizes care schedules. No more dead plants, no more guesswork, no more wasted resources.',
    stats: [
      { value: '60%', label: 'Lower maintenance costs' },
      { value: '95%', label: 'Plant survival rate' },
      { value: '80%', label: 'Time saved on care' },
    ],
    image: IMAGES.features.analytics,
    accent: 'from-purple-600 to-purple-500',
    bgColor: 'bg-purple-50/50',
    proof: 'Compared to traditional plant care methods',
  },
];

const supportingBenefits = [
  {
    icon: Shield,
    title: 'Risk-Free Guarantee',
    description: 'If any plant dies within the first 6 months, we replace it free of charge.',
    accent: 'from-gray-600 to-gray-500',
  },
  {
    icon: Clock,
    title: 'Zero Maintenance',
    description: 'Set it and forget it. Our team handles everything from watering to pruning.',
    accent: 'from-teal-600 to-teal-500',
  },
  {
    icon: Award,
    title: 'Expert Curation',
    description: 'Plants chosen by certified horticulturists for your specific environment.',
    accent: 'from-orange-600 to-orange-500',
  },
  {
    icon: Target,
    title: 'ESG Reporting',
    description: 'Automated sustainability reports for compliance and stakeholder updates.',
    accent: 'from-indigo-600 to-indigo-500',
  },
  {
    icon: Users,
    title: 'Team Engagement',
    description: 'Connect teams through shared green spaces and wellness initiatives.',
    accent: 'from-pink-600 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Instant Impact',
    description: 'See measurable improvements in air quality within the first week.',
    accent: 'from-yellow-600 to-yellow-500',
  },
];

/* -------------------------------------------------------------------------- */
/*  Primary Benefit Card Component                                            */
/* -------------------------------------------------------------------------- */

interface PrimaryBenefitCardProps {
  benefit: typeof primaryBenefits[0];
  index: number;
  isInView: boolean;
}

function PrimaryBenefitCard({ benefit, index, isInView }: PrimaryBenefitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, y: 40, filter: 'blur(6px)' }
      }
      transition={{
        duration: 0.8,
        delay: 0.2 + index * 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative"
    >
      <motion.div
        variants={cardLift}
        initial="rest"
        whileHover="hover"
        className="relative h-full overflow-hidden rounded-3xl"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={benefit.image}
            alt={benefit.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-gray-900/30" />
          {/* Accent overlay */}
          <div className={cn(
            'absolute inset-0 bg-gradient-to-t opacity-20 group-hover:opacity-30 transition-opacity duration-500',
            benefit.accent
          )} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-between p-8 lg:p-10">
          {/* Header */}
          <div className="space-y-4">
            <motion.div
              variants={iconBounce}
              initial="rest"
              whileHover="hover"
              className={cn(
                'flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-lg',
                `bg-gradient-to-br ${benefit.accent}`
              )}
            >
              <benefit.icon className="h-7 w-7" />
            </motion.div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white lg:text-3xl font-heading">
                {benefit.title}
              </h3>
              <p className="text-lg font-semibold text-emerald-300">
                {benefit.headline}
              </p>
              <p className="text-base leading-relaxed text-white/90 lg:text-lg">
                {benefit.description}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {benefit.stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + index * 0.2 + idx * 0.1,
                  }}
                  className="glass-premium rounded-2xl p-4 text-center"
                >
                  <div className="text-2xl font-bold text-white font-heading">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-white/80 mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Proof statement */}
            <div className="flex items-center gap-2 text-sm text-white/70">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              {benefit.proof}
            </div>
          </div>

          {/* Hover indicator */}
          <ArrowUpRight className="absolute top-8 right-8 h-6 w-6 text-white/60 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1" />

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Supporting Benefit Card Component                                         */
/* -------------------------------------------------------------------------- */

interface SupportingBenefitCardProps {
  benefit: typeof supportingBenefits[0];
  index: number;
  isInView: boolean;
}

function SupportingBenefitCard({ benefit, index, isInView }: SupportingBenefitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, y: 24, filter: 'blur(4px)' }
      }
      transition={{
        duration: 0.7,
        delay: 0.8 + index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        variants={cardLift}
        initial="rest"
        whileHover="hover"
        className={cn(
          'group relative h-full overflow-hidden rounded-2xl p-6',
          'glass-premium border-white/60 shadow-premium',
          'cursor-pointer transition-all duration-300',
          'hover:shadow-card-hover'
        )}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-noise-subtle opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-300" />

        {/* Gradient accent line */}
        <div className={cn(
          'absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r transition-all duration-300',
          'group-hover:h-1',
          benefit.accent
        )} />

        <div className="relative space-y-4">
          {/* Icon */}
          <motion.div
            variants={iconBounce}
            initial="rest"
            whileHover="hover"
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              'bg-gradient-to-br shadow-sm ring-1 ring-black/5',
              benefit.accent,
              'text-white'
            )}
          >
            <benefit.icon className="h-6 w-6" />
          </motion.div>

          {/* Content */}
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-gray-900 font-heading">
              {benefit.title}
            </h4>
            <p className="text-sm leading-relaxed text-gray-600">
              {benefit.description}
            </p>
          </div>

          {/* Hover indicator */}
          <ArrowUpRight className="absolute top-6 right-6 h-4 w-4 text-gray-400 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Benefits Section                                                          */
/* -------------------------------------------------------------------------- */

export function BenefitsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Premium background system */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 via-white to-gray-50/30" />
      <div className="absolute inset-0 bg-gradient-mesh-premium opacity-50" />

      {/* Animated orb pattern */}
      <motion.div
        animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.05, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="benefits-orb-radial absolute -left-[10%] -top-[5%] h-[600px] w-[600px] rounded-full opacity-[0.06]"
      />

      <div
        ref={sectionRef}
        className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12"
      >
        {/* Premium Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass-emerald-premium px-4 py-2 text-sm font-bold uppercase tracking-widest text-emerald-700">
            <Leaf className="h-4 w-4" />
            Benefits
          </div>

          <h2 className="mt-8 text-display-lg lg:text-display-xl font-extrabold tracking-tight text-gray-900 font-heading">
            More than just plants.
            <span className="block bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
              It{"'"}s transformation.
            </span>
          </h2>

          <p className="mt-6 text-xl leading-relaxed text-gray-600 lg:text-2xl">
            Experience measurable improvements in productivity, wellness, and cost savings from day one.
          </p>
        </motion.div>

        {/* Primary Benefits Grid */}
        <div className="mt-20">
          <div className="grid gap-8 lg:grid-cols-3">
            {primaryBenefits.map((benefit, index) => (
              <PrimaryBenefitCard
                key={benefit.id}
                benefit={benefit}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        </div>

        {/* Supporting Benefits Section */}
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 text-center"
          >
            <h3 className="text-display-sm font-bold text-gray-900 font-heading">
              Plus everything you need for success
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive support that eliminates every barrier to thriving plants
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {supportingBenefits.map((benefit, index) => (
              <SupportingBenefitCard
                key={benefit.title}
                benefit={benefit}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
            <TrendingUp className="h-4 w-4" />
            Join 500+ teams already thriving
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50/30 to-transparent" />
    </section>
  );
}