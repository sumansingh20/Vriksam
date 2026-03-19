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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/images';

/* -------------------------------------------------------------------------- */
/*  Feature data                                                              */
/* -------------------------------------------------------------------------- */

const features = [
  {
    icon: Brain,
    title: 'AI Health Monitoring',
    description: 'Computer vision detects plant issues before they become visible. Our AI analyzes growth patterns, leaf color, and environmental stress.',
    image: IMAGES.features.aiHealth,
    span: 'lg:col-span-2 lg:row-span-2',
    size: 'large',
    color: 'emerald',
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
    description: 'Board-ready sustainability reports generated automatically.',
    span: 'lg:col-span-1 lg:row-span-1',
    size: 'small',
    color: 'green',
  },
  {
    icon: Package,
    title: 'Inventory Management',
    description: 'Track every plant, pot, and tool across all your locations.',
    span: 'lg:col-span-1 lg:row-span-1',
    size: 'small',
    color: 'orange',
  },
  {
    icon: Users,
    title: 'Team Coordination',
    description: 'Keep everyone aligned with real-time task updates.',
    span: 'lg:col-span-1 lg:row-span-1',
    size: 'small',
    color: 'pink',
  },
  {
    icon: Wifi,
    title: 'IoT Integration',
    description: 'Connect sensors for fully automated monitoring.',
    span: 'lg:col-span-1 lg:row-span-1',
    size: 'small',
    color: 'teal',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance certifications.',
    span: 'lg:col-span-1 lg:row-span-1',
    size: 'small',
    color: 'gray',
  },
];

const colorMap = {
  emerald: {
    bg: 'bg-emerald-50' as const,
    text: 'text-emerald-600' as const,
    border: 'border-emerald-100' as const,
    gradient: 'from-emerald-500 to-teal-500' as const,
  },
  blue: {
    bg: 'bg-blue-50' as const,
    text: 'text-blue-600' as const,
    border: 'border-blue-100' as const,
    gradient: 'from-blue-500 to-indigo-500' as const,
  },
  purple: {
    bg: 'bg-purple-50' as const,
    text: 'text-purple-600' as const,
    border: 'border-purple-100' as const,
    gradient: 'from-purple-500 to-pink-500' as const,
  },
  green: {
    bg: 'bg-green-50' as const,
    text: 'text-green-600' as const,
    border: 'border-green-100' as const,
    gradient: 'from-green-500 to-emerald-500' as const,
  },
  orange: {
    bg: 'bg-orange-50' as const,
    text: 'text-orange-600' as const,
    border: 'border-orange-100' as const,
    gradient: 'from-orange-500 to-amber-500' as const,
  },
  pink: {
    bg: 'bg-pink-50' as const,
    text: 'text-pink-600' as const,
    border: 'border-pink-100' as const,
    gradient: 'from-pink-500 to-rose-500' as const,
  },
  teal: {
    bg: 'bg-teal-50' as const,
    text: 'text-teal-600' as const,
    border: 'border-teal-100' as const,
    gradient: 'from-teal-500 to-cyan-500' as const,
  },
  gray: {
    bg: 'bg-gray-100' as const,
    text: 'text-gray-600' as const,
    border: 'border-gray-200' as const,
    gradient: 'from-gray-600 to-gray-700' as const,
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  Feature Card                                                              */
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
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(feature.span, 'group relative')}
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(
          'relative h-full overflow-hidden rounded-3xl',
          'bg-white border border-gray-100',
          'hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/80',
          'transition-all duration-500',
          isLarge ? 'min-h-[400px] lg:min-h-[480px]' : 'min-h-[200px]',
        )}
      >
        {/* Background image for large cards */}
        {hasBgImage && (
          <div className="absolute inset-0">
            <Image
              src={feature.image!}
              alt={feature.title}
              fill
              className="object-cover opacity-10 group-hover:opacity-15 transition-opacity duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/80" />
          </div>
        )}

        {/* Content */}
        <div className={cn(
          'relative z-10 flex flex-col h-full p-6 lg:p-8',
          isLarge && 'justify-between',
        )}>
          {/* Header */}
          <div>
            {/* Icon */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className={cn(
                'inline-flex items-center justify-center rounded-2xl',
                'ring-1',
                colors.bg,
                colors.border,
                isLarge ? 'w-14 h-14 mb-6' : 'w-11 h-11 mb-4',
              )}
            >
              <Icon className={cn(colors.text, isLarge ? 'w-6 h-6' : 'w-5 h-5')} strokeWidth={1.5} />
            </motion.div>

            {/* Title */}
            <h3 className={cn(
              'font-display font-semibold text-gray-900',
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
          {isLarge && (
            <div className="mt-8">
              {/* Feature highlights */}
              <div className="flex flex-wrap gap-2">
                {['Real-time alerts', 'Disease detection', 'Growth tracking'].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600"
                  >
                    <Zap className="w-3 h-3 mr-1.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hover arrow */}
          <div className="absolute top-6 right-6 lg:top-8 lg:right-8">
            <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
          </div>
        </div>

        {/* Gradient border on hover */}
        <div
          className={cn(
            'absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
            'ring-2 ring-inset',
            `ring-gradient-to-br ${colors.gradient}`,
          )}
          style={{
            background: `linear-gradient(135deg, ${colors.bg.replace('bg-', '')}00 0%, ${colors.bg.replace('bg-', '')}10 100%)`,
          }}
        />
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
    <section ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#FAFBFC]" />

      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600">
            <Zap className="w-4 h-4 text-emerald-500" />
            Platform Features
          </span>
          <h2 className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
              grow
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful tools designed to help you manage, monitor, and scale your green infrastructure with ease.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
