'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import {
  Brain,
  Calendar,
  BarChart3,
  FileBarChart,
  Package,
  Users,
  Layout,
  Wifi,
  ArrowUpRight,
  Zap,
  Shield,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/images';
import { cardLift, iconBounce } from '@/animations/micro-interactions';

/* -------------------------------------------------------------------------- */
/*  Premium feature data with enhanced copy                                   */
/* -------------------------------------------------------------------------- */

const coreFeatures = [
  {
    icon: Brain,
    title: 'Intelligent Health Monitoring',
    description: 'Catch problems before they show. Our AI analyzes visual cues, growth patterns, and environmental data to predict plant health issues weeks in advance.',
    longDescription: 'Computer vision meets plant science. Every leaf tells a story—color changes, growth patterns, stress indicators. Our AI reads them all.',
    image: IMAGES.features.aiHealth,
    accent: 'from-emerald-600 to-emerald-500',
    category: 'Intelligence',
  },
  {
    icon: BarChart3,
    title: 'Real-time Impact Dashboard',
    description: 'See the bigger picture with live analytics. Track growth, environmental impact, and team performance across all locations in one beautiful dashboard.',
    longDescription: 'Data that drives decisions. From CO2 absorbed to team productivity, get insights that matter to your business and the planet.',
    image: IMAGES.features.analytics,
    accent: 'from-blue-600 to-blue-500',
    category: 'Analytics',
  },
  {
    icon: Calendar,
    title: 'Perfect Scheduling Intelligence',
    description: 'Never miss care again. AI-powered scheduling adapts to weather, plant needs, and team capacity for optimal timing every time.',
    longDescription: 'Smart schedules that work with nature. Weather delays? Growth spurts? Our system adjusts automatically.',
    image: IMAGES.features.maintenance,
    accent: 'from-purple-600 to-purple-500',
    category: 'Automation',
  },
];

const supportingFeatures = [
  {
    icon: FileBarChart,
    title: 'ESG Made Simple',
    description: 'Board-ready sustainability reports generated automatically.',
    accent: 'from-green-600 to-green-500',
  },
  {
    icon: Package,
    title: 'Smart Inventory',
    description: 'Track every plant, pot, and tool across all your locations.',
    accent: 'from-orange-600 to-orange-500',
  },
  {
    icon: Users,
    title: 'Team Coordination',
    description: 'Keep everyone aligned with real-time task management.',
    accent: 'from-pink-600 to-pink-500',
  },
  {
    icon: Layout,
    title: 'Client Transparency',
    description: 'Give clients real-time access to their green space data.',
    accent: 'from-indigo-600 to-indigo-500',
  },
  {
    icon: Wifi,
    title: 'IoT Ready',
    description: 'Connect sensors for fully automated monitoring.',
    accent: 'from-teal-600 to-teal-500',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security for your sensitive data.',
    accent: 'from-gray-600 to-gray-500',
  },
];

/* -------------------------------------------------------------------------- */
/*  Premium Core Feature Card                                                 */
/* -------------------------------------------------------------------------- */

interface CoreFeatureCardProps {
  feature: typeof coreFeatures[0];
  index: number;
  isInView: boolean;
}

function CoreFeatureCard({ feature, index, isInView }: CoreFeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, filter: 'blur(4px)' }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, y: 32, filter: 'blur(4px)' }
      }
      transition={{
        duration: 0.8,
        delay: 0.2 + index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        'group relative overflow-hidden rounded-3xl',
        'h-[480px] lg:h-[520px]',
        index === 1 ? 'lg:col-span-2' : 'lg:col-span-1'
      )}
    >
      <motion.div
        variants={cardLift}
        initial="rest"
        whileHover="hover"
        className="h-full w-full cursor-pointer"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={feature.image}
            alt={feature.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-gray-900/20" />
          {/* Accent color overlay */}
          <div className={cn(
            'absolute inset-0 bg-gradient-to-t opacity-20 group-hover:opacity-30 transition-opacity duration-500',
            feature.accent
          )} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-8 lg:p-10">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/90">
                <Zap className="h-3 w-3" />
                {feature.category}
              </span>
              <motion.div
                variants={iconBounce}
                initial="rest"
                whileHover="hover"
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg',
                  `bg-gradient-to-br ${feature.accent}`
                )}
              >
                <feature.icon className="h-6 w-6" />
              </motion.div>
            </div>
            <ArrowUpRight className="h-6 w-6 text-white/60 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>

          {/* Main content */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white lg:text-3xl font-heading">
              {feature.title}
            </h3>
            <p className="text-base leading-relaxed text-white/80 lg:text-lg">
              {feature.longDescription}
            </p>

            {/* Subtle shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Premium Supporting Feature Card                                           */
/* -------------------------------------------------------------------------- */

interface SupportingFeatureCardProps {
  feature: typeof supportingFeatures[0];
  index: number;
  isInView: boolean;
}

function SupportingFeatureCard({ feature, index, isInView }: SupportingFeatureCardProps) {
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
        delay: 0.6 + index * 0.08,
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
        {/* Gradient accent line */}
        <div className={cn(
          'absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r transition-all duration-300',
          'group-hover:h-1',
          feature.accent
        )} />

        {/* Background pattern */}
        <div className="absolute inset-0 bg-noise-subtle opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-300" />

        <div className="relative space-y-4">
          {/* Icon */}
          <motion.div
            variants={iconBounce}
            initial="rest"
            whileHover="hover"
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-xl',
              'bg-gradient-to-br shadow-sm ring-1 ring-black/5 text-white',
              feature.accent
            )}
          >
            <feature.icon className="h-5 w-5" />
          </motion.div>

          {/* Content */}
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-gray-900 font-heading">
              {feature.title}
            </h4>
            <p className="text-sm leading-relaxed text-gray-600">
              {feature.description}
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
/*  Premium Features Section                                                  */
/* -------------------------------------------------------------------------- */

export function FeaturesGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Premium background system */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />
      <div className="absolute inset-0 bg-gradient-mesh-premium opacity-60" />

      {/* Subtle animated dot pattern */}
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(16,185,129,0.15)_1px,_transparent_0)] bg-[length:32px_32px]"
      />

      <div
        ref={sectionRef}
        className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12"
      >
        {/* Premium Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass-emerald-premium px-4 py-2 text-sm font-bold uppercase tracking-widest text-emerald-700">
            <Target className="h-4 w-4" />
            Platform Capabilities
          </div>

          <h2 className="mt-8 text-display-lg lg:text-display-xl font-extrabold tracking-tight text-gray-900 font-heading">
            Intelligence meets
            <span className="block bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
              green infrastructure
            </span>
          </h2>

          <p className="mt-6 text-xl leading-relaxed text-gray-600 lg:text-2xl">
            Three core modules. Six supporting tools. Infinite possibilities for creating thriving spaces.
          </p>
        </motion.div>

        {/* Core Features Grid */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {coreFeatures.map((feature, index) => (
              <CoreFeatureCard
                key={feature.title}
                feature={feature}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        </div>

        {/* Supporting Features Grid */}
        <div className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 text-center"
          >
            <h3 className="text-display-sm font-bold text-gray-900 font-heading">
              Plus everything you need to scale
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Supporting tools that grow with your green infrastructure
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {supportingFeatures.map((feature, index) => (
              <SupportingFeatureCard
                key={feature.title}
                feature={feature}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}