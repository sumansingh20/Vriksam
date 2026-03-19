'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Leaf,
  Brain,
  BarChart3,
  ArrowRight,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/images';

/* -------------------------------------------------------------------------- */
/*  Steps data                                                                */
/* -------------------------------------------------------------------------- */

const steps = [
  {
    id: 1,
    icon: Calendar,
    title: 'Book Assessment',
    shortTitle: 'Assess',
    description: 'Schedule a free consultation. Our experts visit your space to understand needs and create a custom plan.',
    duration: '15 min',
    image: IMAGES.hero.office,
    color: 'emerald',
  },
  {
    id: 2,
    icon: Leaf,
    title: 'Smart Installation',
    shortTitle: 'Install',
    description: 'We install curated plants with IoT sensors and configure automated monitoring systems.',
    duration: '2-4 hrs',
    image: IMAGES.features.maintenance,
    color: 'blue',
  },
  {
    id: 3,
    icon: Brain,
    title: 'AI Takes Over',
    shortTitle: 'Monitor',
    description: 'Our AI continuously monitors health, predicts needs, and schedules maintenance automatically.',
    duration: '24/7',
    image: IMAGES.features.aiHealth,
    color: 'purple',
  },
  {
    id: 4,
    icon: BarChart3,
    title: 'Track Impact',
    shortTitle: 'Track',
    description: 'Watch your green investment grow through real-time analytics and environmental metrics.',
    duration: 'Real-time',
    image: IMAGES.features.analytics,
    color: 'teal',
  },
];

const colorMap = {
  emerald: { bg: 'bg-emerald-500' as const, text: 'text-emerald-600' as const, light: 'bg-emerald-50' as const },
  blue: { bg: 'bg-blue-500' as const, text: 'text-blue-600' as const, light: 'bg-blue-50' as const },
  purple: { bg: 'bg-purple-500' as const, text: 'text-purple-600' as const, light: 'bg-purple-50' as const },
  teal: { bg: 'bg-teal-500' as const, text: 'text-teal-600' as const, light: 'bg-teal-50' as const },
} as const;

/* -------------------------------------------------------------------------- */
/*  How It Works Section                                                      */
/* -------------------------------------------------------------------------- */

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const currentStep = steps[activeStep]!;
  const colors = colorMap[currentStep.color as keyof typeof colorMap] ?? colorMap.emerald;

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            How It Works
          </span>
          <h2 className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            Four steps to a{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              thriving space
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our proven process ensures success from consultation to flourishing ecosystem.
          </p>
        </motion.div>

        {/* Steps navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center p-1 rounded-full bg-gray-100">
            {steps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(i)}
                className={cn(
                  'relative flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-sm font-medium',
                  'transition-all duration-300',
                  activeStep === i ? 'text-white' : 'text-gray-600 hover:text-gray-900',
                )}
              >
                {activeStep === i && (
                  <motion.div
                    layoutId="step-tab"
                    className="absolute inset-0 bg-gray-900 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 hidden sm:inline">{step.shortTitle}</span>
                <span className="relative z-10 sm:hidden">{step.id}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Image panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-[4/3] rounded-3xl overflow-hidden group"
              >
                <Image
                  src={currentStep.image}
                  alt={currentStep.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent" />

                {/* Step badge */}
                <div className="absolute top-6 left-6">
                  <div className={cn(
                    'inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white font-bold text-lg',
                    colors.bg,
                  )}>
                    {currentStep.id}
                  </div>
                </div>

                {/* Duration badge */}
                <div className="absolute top-6 right-6">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700">
                    {currentStep.duration}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Steps list */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            {steps.map((step, i) => {
              const stepColors = colorMap[step.color as keyof typeof colorMap] ?? colorMap.emerald;
              const isActive = i === activeStep;

              return (
                <motion.button
                  key={step.id}
                  onClick={() => setActiveStep(i)}
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={cn(
                    'w-full flex items-start gap-4 p-5 rounded-2xl text-left',
                    'transition-all duration-300',
                    isActive
                      ? 'bg-gray-50 ring-1 ring-gray-200'
                      : 'hover:bg-gray-50',
                  )}
                >
                  {/* Icon */}
                  <div className={cn(
                    'flex items-center justify-center w-12 h-12 rounded-xl shrink-0',
                    'transition-colors duration-300',
                    isActive ? stepColors.bg : stepColors.light,
                  )}>
                    <step.icon className={cn(
                      'w-5 h-5',
                      isActive ? 'text-white' : stepColors.text,
                    )} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={cn(
                        'font-semibold transition-colors',
                        isActive ? 'text-gray-900' : 'text-gray-700',
                      )}>
                        {step.title}
                      </h3>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500"
                        >
                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                        </motion.div>
                      )}
                    </div>
                    <p className={cn(
                      'mt-1 text-sm transition-colors',
                      isActive ? 'text-gray-600' : 'text-gray-500',
                    )}>
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className={cn(
                    'w-5 h-5 shrink-0 mt-0.5 transition-all',
                    isActive ? 'text-gray-900 translate-x-1' : 'text-gray-300',
                  )} />
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
