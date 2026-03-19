'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Calendar,
  Smartphone,
  Brain,
  TrendingUp,
  Users,
  PlayCircle,
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/images';
import { cardLift, iconBounce } from '@/animations/micro-interactions';
import Image from 'next/image';

/* -------------------------------------------------------------------------- */
/*  How It Works data with engaging step-by-step process                     */
/* -------------------------------------------------------------------------- */

const steps = [
  {
    id: 1,
    icon: Smartphone,
    title: 'Book Your Assessment',
    description: 'Schedule a free consultation where our experts evaluate your space, lighting, and plant care requirements.',
    details: 'Our horticultural experts visit your location to understand your specific needs, space constraints, and aesthetic preferences.',
    image: IMAGES.hero.office,
    accent: 'from-emerald-600 to-emerald-500',
    bgGradient: 'from-emerald-50/50 to-white',
    duration: '15 minutes',
    outcome: 'Customized plant selection & care plan',
  },
  {
    id: 2,
    icon: Target,
    title: 'Smart Installation',
    description: 'We install your curated plants with IoT sensors and set up automated monitoring systems.',
    details: 'Professional installation includes plant placement, sensor setup, and system configuration for optimal growth conditions.',
    image: IMAGES.features.monitoring,
    accent: 'from-blue-600 to-blue-500',
    bgGradient: 'from-blue-50/50 to-white',
    duration: '2-4 hours',
    outcome: 'Fully monitored green ecosystem',
  },
  {
    id: 3,
    icon: Brain,
    title: 'AI Takes Over',
    description: 'Our AI continuously monitors plant health, predicts needs, and schedules maintenance visits automatically.',
    details: 'Advanced computer vision and environmental sensors provide 24/7 monitoring with predictive health analysis.',
    image: IMAGES.features.aiHealth,
    accent: 'from-purple-600 to-purple-500',
    bgGradient: 'from-purple-50/50 to-white',
    duration: 'Continuous',
    outcome: 'Proactive plant healthcare',
  },
  {
    id: 4,
    icon: TrendingUp,
    title: 'Track Your Impact',
    description: 'Watch your green investment grow through real-time analytics showing health metrics and environmental benefits.',
    details: 'Comprehensive dashboard tracks CO2 absorption, air quality improvement, team wellness scores, and ROI metrics.',
    image: IMAGES.features.analytics,
    accent: 'from-teal-600 to-teal-500',
    bgGradient: 'from-teal-50/50 to-white',
    duration: 'Real-time',
    outcome: 'Measurable green ROI',
  },
];

/* -------------------------------------------------------------------------- */
/*  Premium Step Card Component                                               */
/* -------------------------------------------------------------------------- */

interface StepCardProps {
  step: typeof steps[0];
  index: number;
  isActive: boolean;
  onHover: () => void;
  isInView: boolean;
}

function StepCard({ step, index, isActive, onHover, isInView }: StepCardProps) {
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
        delay: 0.2 + index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onHoverStart={onHover}
      className="relative"
    >
      <motion.div
        variants={cardLift}
        initial="rest"
        whileHover="hover"
        className={cn(
          'group relative overflow-hidden rounded-3xl p-8 lg:p-10',
          'glass-premium border-white/60 shadow-premium',
          'cursor-pointer transition-all duration-500',
          isActive ? 'ring-2 ring-emerald-500/20 shadow-emerald-premium' : 'hover:shadow-card-hover'
        )}
      >
        {/* Background gradient */}
        <div className={cn(
          'absolute inset-0 opacity-0 transition-opacity duration-500',
          `bg-gradient-to-br ${step.bgGradient}`,
          isActive ? 'opacity-100' : 'group-hover:opacity-50'
        )} />

        {/* Step number indicator */}
        <div className="relative z-10 mb-6 flex items-center gap-4">
          <div className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white transition-all duration-300',
            `bg-gradient-to-br ${step.accent} shadow-lg`,
            isActive ? 'scale-110' : 'group-hover:scale-105'
          )}>
            {step.id}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Step {step.id}
            </span>
            <span className="text-sm font-medium text-emerald-600">
              {step.duration}
            </span>
          </div>
        </div>

        {/* Icon */}
        <motion.div
          variants={iconBounce}
          initial="rest"
          whileHover="hover"
          className={cn(
            'relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-xl',
            'bg-gradient-to-br shadow-lg ring-1 ring-black/5',
            step.accent
          )}
        >
          <step.icon className="h-8 w-8 text-white" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 space-y-4">
          <h3 className="text-xl font-bold tracking-tight text-gray-900 font-heading lg:text-2xl">
            {step.title}
          </h3>
          <p className="text-base leading-relaxed text-gray-600 lg:text-lg">
            {step.description}
          </p>
          <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            {step.outcome}
          </div>
        </div>

        {/* Hover arrow */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: isActive ? 1 : 0,
            x: isActive ? 0 : -10
          }}
          className="absolute top-8 right-8 z-10"
        >
          <ArrowRight className="h-6 w-6 text-emerald-600" />
        </motion.div>

        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Premium Visual Panel Component                                            */
/* -------------------------------------------------------------------------- */

interface VisualPanelProps {
  activeStep: typeof steps[0];
  isInView: boolean;
}

function VisualPanel({ activeStep, isInView }: VisualPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      animate={
        isInView
          ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
          : { opacity: 0, scale: 0.95, filter: 'blur(8px)' }
      }
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-8"
    >
      <motion.div
        key={activeStep.id}
        initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        variants={cardLift}
        whileHover="hover"
        className="group relative aspect-[4/3] overflow-hidden rounded-3xl"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={activeStep.image}
            alt={activeStep.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-transparent" />
          {/* Accent color overlay */}
          <div className={cn(
            'absolute inset-0 bg-gradient-to-t opacity-20 group-hover:opacity-30 transition-opacity duration-500',
            activeStep.accent
          )} />
        </div>

        {/* Floating info card */}
        <div className="absolute bottom-6 left-6 right-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-premium rounded-2xl p-6 shadow-premium-lg ring-1 ring-white/20"
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-lg',
                `bg-gradient-to-br ${activeStep.accent}`
              )}>
                <activeStep.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 font-heading">
                  {activeStep.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {activeStep.details}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Step indicator */}
        <div className="absolute top-6 left-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg',
              `bg-gradient-to-br ${activeStep.accent}`
            )}
          >
            {activeStep.id}
          </motion.div>
        </div>

        {/* Hover shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  How It Works Section                                                      */
/* -------------------------------------------------------------------------- */

export function HowItWorksSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const activeStep = steps[activeStepIndex]!;

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Premium background system */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/30 to-white" />
      <div className="absolute inset-0 bg-gradient-mesh-subtle opacity-40" />

      {/* Animated dot pattern */}
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(16,185,129,0.1)_1px,_transparent_0)] bg-[length:40px_40px]"
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
            <PlayCircle className="h-4 w-4" />
            How It Works
          </div>

          <h2 className="mt-8 text-display-lg lg:text-display-xl font-extrabold tracking-tight text-gray-900 font-heading">
            From consultation to
            <span className="block bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
              thriving ecosystem
            </span>
          </h2>

          <p className="mt-6 text-xl leading-relaxed text-gray-600 lg:text-2xl">
            Experience the seamless journey from empty space to vibrant green environment. Our proven 4-step process ensures success every time.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="mt-20 grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Steps Panel */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <StepCard
                key={step.id}
                step={step}
                index={index}
                isActive={index === activeStepIndex}
                onHover={() => setActiveStepIndex(index)}
                isInView={isInView}
              />
            ))}
          </div>

          {/* Visual Panel */}
          <div className="relative">
            <VisualPanel activeStep={activeStep} isInView={isInView} />
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            <Zap className="h-4 w-4" />
            Ready to transform your space?
          </div>
          <p className="mt-3 text-lg text-gray-600">
            Book your free assessment and see your personalized plan within 24 hours.
          </p>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}