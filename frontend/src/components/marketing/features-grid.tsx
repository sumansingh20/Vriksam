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
  Wifi,
  Shield,
  Zap,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGES, BLUR_DATA_URL } from '@/lib/images';

/* -------------------------------------------------------------------------- */
/*  Feature data                                                              */
/* -------------------------------------------------------------------------- */

const features = [
  {
    icon: Brain,
    title: 'AI Health Monitoring',
    description: 'Computer vision detects plant issues before they become visible. Our AI analyzes growth patterns, leaf color, and environmental stress in real-time.',
    image: IMAGES.features.aiHealth,
    span: 'lg:col-span-2 lg:row-span-2',
    size: 'large',
    color: 'emerald',
    tags: ['Real-time alerts', 'Disease detection', 'Growth tracking'],
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Live dashboards track growth, health scores, and environmental impact across all locations.',
    image: IMAGES.features.analytics,
    span: 'lg:col-span-1 lg:row-span-1',
    size: 'medium',
    color: 'blue',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'AI-powered maintenance schedules that adapt to weather, plant needs, and team availability.',
    image: IMAGES.features.maintenance,
    span: 'lg:col-span-1 lg:row-span-1',
    size: 'medium',
    color: 'purple',
  },
  {
    icon: FileBarChart,
    title: 'ESG Reporting',
    description: 'Board-ready sustainability reports generated automatically with verified metrics.',
    span: 'lg:col-span-1 lg:row-span-1',
    size: 'small',
    color: 'green',
  },
  {
    icon: Package,
    title: 'Inventory Management',
    description: 'Track every plant, pot, and tool across all your locations effortlessly.',
    span: 'lg:col-span-1 lg:row-span-1',
    size: 'small',
    color: 'orange',
  },
  {
    icon: Users,
    title: 'Team Coordination',
    description: 'Keep everyone aligned with real-time task updates and notifications.',
    span: 'lg:col-span-1 lg:row-span-1',
    size: 'small',
    color: 'pink',
  },
  {
    icon: Wifi,
    title: 'IoT Integration',
    description: 'Connect sensors for fully automated environmental monitoring.',
    span: 'lg:col-span-1 lg:row-span-1',
    size: 'small',
    color: 'teal',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance certifications included.',
    span: 'lg:col-span-1 lg:row-span-1',
    size: 'small',
    color: 'gray',
  },
];

const colorMap = {
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'group-hover:shadow-emerald-500/20',
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100',
    gradient: 'from-blue-500 to-indigo-500',
    glow: 'group-hover:shadow-blue-500/20',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-100',
    gradient: 'from-purple-500 to-pink-500',
    glow: 'group-hover:shadow-purple-500/20',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-100',
    gradient: 'from-green-500 to-emerald-500',
    glow: 'group-hover:shadow-green-500/20',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-100',
    gradient: 'from-orange-500 to-amber-500',
    glow: 'group-hover:shadow-orange-500/20',
  },
  pink: {
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    border: 'border-pink-100',
    gradient: 'from-pink-500 to-rose-500',
    glow: 'group-hover:shadow-pink-500/20',
  },
  teal: {
    bg: 'bg-teal-50',
    text: 'text-teal-600',
    border: 'border-teal-100',
    gradient: 'from-teal-500 to-cyan-500',
    glow: 'group-hover:shadow-teal-500/20',
  },
  gray: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200',
    gradient: 'from-gray-600 to-gray-700',
    glow: 'group-hover:shadow-gray-500/20',
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  Premium Feature Card                                                       */
/* -------------------------------------------------------------------------- */

interface FeatureCardProps {
  feature: (typeof features)[number];
  index: number;
  isInView: boolean;
}

function FeatureCard({ feature, index, isInView }: FeatureCardProps) {
  const Icon = feature.icon;
  const colors = colorMap[feature.color as keyof typeof colorMap] ?? colorMap.emerald;
  const isLarge = feature.size === 'large';
  const hasBgImage = feature.image && isLarge;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(feature.span, 'group relative')}
    >
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(
          'relative h-full overflow-hidden rounded-3xl',
          'bg-white/80 backdrop-blur-xl',
          'border border-gray-100/80',
          'hover:border-gray-200 hover:shadow-2xl',
          colors.glow,
          'transition-all duration-500',
          isLarge ? 'min-h-[420px] lg:min-h-[500px]' : 'min-h-[220px]',
        )}
      >
        {/* Background image for large cards */}
        {hasBgImage && (
          <div className="absolute inset-0">
            <Image
              src={feature.image!}
              alt={feature.title}
              fill
              className="object-cover opacity-[0.08] group-hover:opacity-[0.12] group-hover:scale-105 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/85" />
          </div>
        )}

        {/* Hover gradient overlay */}
        <div className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500',
          'bg-gradient-to-br',
          colors.gradient,
        )} />

        {/* Content */}
        <div className={cn(
          'relative z-10 flex flex-col h-full p-7 lg:p-9',
          isLarge && 'justify-between',
        )}>
          {/* Header */}
          <div>
            {/* Icon with gradient background */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="relative inline-flex"
            >
              <div className={cn(
                'flex items-center justify-center rounded-2xl',
                'bg-gradient-to-br shadow-lg',
                colors.gradient,
                isLarge ? 'w-16 h-16 mb-8' : 'w-12 h-12 mb-5',
              )}>
                <Icon className={cn('text-white', isLarge ? 'w-7 h-7' : 'w-5 h-5')} strokeWidth={1.5} />
              </div>
              {/* Glow effect */}
              <div className={cn(
                'absolute inset-0 rounded-2xl blur-xl opacity-40',
                'bg-gradient-to-br',
                colors.gradient,
              )} />
            </motion.div>

            {/* Title */}
            <h3 className={cn(
              'font-display font-bold text-gray-900',
              isLarge ? 'text-2xl lg:text-3xl' : 'text-lg',
            )}>
              {feature.title}
            </h3>

            {/* Description */}
            <p className={cn(
              'mt-3 text-gray-600 leading-relaxed',
              isLarge ? 'text-base lg:text-lg max-w-md' : 'text-sm',
            )}>
              {feature.description}
            </p>
          </div>

          {/* Large card extras */}
          {isLarge && feature.tags && (
            <div className="mt-8">
              {/* Feature tags */}
              <div className="flex flex-wrap gap-2">
                {feature.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    className={cn(
                      'inline-flex items-center px-4 py-2 rounded-full',
                      'bg-gradient-to-r from-gray-50 to-gray-100/80',
                      'border border-gray-100',
                      'text-xs font-semibold text-gray-700',
                      'hover:border-emerald-200 hover:from-emerald-50 hover:to-teal-50',
                      'transition-all duration-300',
                    )}
                  >
                    <Sparkles className="w-3 h-3 mr-2 text-emerald-500" />
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Hover arrow */}
          <motion.div
            initial={{ opacity: 0.3, x: 0, y: 0 }}
            whileHover={{ opacity: 1, x: 2, y: -2 }}
            className="absolute top-7 right-7 lg:top-9 lg:right-9"
          >
            <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors duration-300" />
          </motion.div>
        </div>

        {/* Animated border gradient on hover */}
        <div className={cn(
          'absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
          'ring-2 ring-inset ring-transparent',
        )}>
          <div className={cn(
            'absolute inset-0 rounded-3xl',
            'bg-gradient-to-r p-[1px] opacity-30',
            colors.gradient,
          )}>
            <div className="w-full h-full bg-white rounded-3xl" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Features Grid                                                             */
/* -------------------------------------------------------------------------- */

export function FeaturesGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="relative py-28 sm:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#FAFBFC]" />

      {/* Decorative elements */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl" />

      {/* Subtle grid pattern */}
      <div className="features-grid-pattern absolute inset-0 opacity-[0.4]" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-600"
          >
            <Zap className="w-4 h-4 text-emerald-500" />
            Platform Features
          </motion.span>

          <h2 className="mt-8 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            Everything you need to{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-emerald-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                grow
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-2 left-0 right-0 h-3 bg-emerald-100/70 -z-0 origin-left rounded-full"
              />
            </span>
          </h2>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful tools designed to help you manage, monitor, and scale your green infrastructure with ease.
          </p>
        </motion.div>

        {/* Premium Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
