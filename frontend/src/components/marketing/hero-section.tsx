'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Play, Leaf, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/images';

/* -------------------------------------------------------------------------- */
/*  Trusted-by companies with logos                                           */
/* -------------------------------------------------------------------------- */

const trustedBy = [
  { name: 'Infosys', width: 80 },
  { name: 'WeWork', width: 70 },
  { name: 'Prestige', width: 75 },
  { name: 'Godrej', width: 65 },
  { name: 'Tata Realty', width: 85 },
  { name: 'Embassy', width: 70 },
];

/* -------------------------------------------------------------------------- */
/*  Floating visual elements                                                  */
/* -------------------------------------------------------------------------- */

function FloatingLeaf({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5 + delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn('absolute pointer-events-none', className)}
    >
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6 + delay * 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Leaf className="w-8 h-8 text-emerald-400/40" />
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Animated gradient orb                                                     */
/* -------------------------------------------------------------------------- */

function GradientOrb({ className, color, delay = 0 }: { className?: string; color: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 1.2, ease: 'easeOut' }}
      className={cn('absolute rounded-full blur-3xl', className)}
      style={{ background: color }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="w-full h-full"
      />
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero Section                                                              */
/* -------------------------------------------------------------------------- */

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#FAFBFC]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Gradient orbs */}
      <GradientOrb
        className="w-[600px] h-[600px] -top-[200px] -left-[200px] opacity-60"
        color="radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)"
        delay={0.2}
      />
      <GradientOrb
        className="w-[500px] h-[500px] top-[20%] -right-[150px] opacity-40"
        color="radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)"
        delay={0.4}
      />
      <GradientOrb
        className="w-[400px] h-[400px] bottom-[10%] left-[20%] opacity-30"
        color="radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)"
        delay={0.6}
      />

      {/* Floating leaves */}
      <FloatingLeaf className="top-[15%] left-[8%]" delay={0} />
      <FloatingLeaf className="top-[25%] right-[12%]" delay={0.3} />
      <FloatingLeaf className="bottom-[30%] left-[15%]" delay={0.6} />

      {/* Main content */}
      <motion.div
        style={{ y: smoothY, opacity, scale: smoothScale }}
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-16 sm:px-8 lg:px-12"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Announcement badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/case-studies"
              className={cn(
                'group inline-flex items-center gap-2.5 rounded-full',
                'bg-white/80 backdrop-blur-sm border border-gray-200/80',
                'px-4 py-2 text-[13px] font-medium text-gray-700',
                'shadow-sm hover:shadow-md hover:border-emerald-200',
                'transition-all duration-300',
              )}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 font-semibold">New</span>
              </span>
              <span className="w-px h-3.5 bg-gray-300" />
              <span>Serving 50+ cities across India</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-gray-900"
          >
            <span className="block">Transform your space</span>
            <span className="block mt-1">
              into a{' '}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
                  living ecosystem
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-2 left-0 right-0 h-3 bg-emerald-100/60 -z-0 origin-left rounded-sm"
                />
              </span>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed"
          >
            AI-powered plant care that monitors health, schedules maintenance, and tracks
            environmental impact—so your green spaces thrive effortlessly.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Primary CTA */}
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'group relative flex items-center gap-2.5 rounded-full',
                  'bg-gray-900 hover:bg-gray-800',
                  'px-7 py-3.5 text-[15px] font-semibold text-white',
                  'shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/25',
                  'transition-all duration-300',
                )}
              >
                Start free trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </Link>

            {/* Secondary CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'group flex items-center gap-2.5 rounded-full',
                'bg-white hover:bg-gray-50 border border-gray-200',
                'px-6 py-3.5 text-[15px] font-semibold text-gray-700',
                'shadow-sm hover:shadow-md',
                'transition-all duration-300',
              )}
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Play className="w-3 h-3 ml-0.5" fill="currentColor" />
              </span>
              Watch demo
            </motion.button>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 relative mx-auto max-w-4xl"
          >
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/10 ring-1 ring-gray-200/50">
              {/* Dashboard preview image */}
              <Image
                src={IMAGES.hero.office}
                alt="Vriksham dashboard preview"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent" />

              {/* Floating stats cards */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-6 left-6 hidden sm:block"
              >
                <div className="glass-premium rounded-xl px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10">
                      <Leaf className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Plants Healthy</p>
                      <p className="text-lg font-bold text-gray-900">98.5%</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-6 right-6 hidden sm:block"
              >
                <div className="glass-premium rounded-xl px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">CO₂ Offset</p>
                      <p className="text-lg font-bold text-gray-900">2.4M kg</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative elements around image */}
            <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-emerald-100/50 via-teal-100/30 to-green-100/50 rounded-3xl blur-2xl opacity-60" />
          </motion.div>
        </div>
      </motion.div>

      {/* Trusted by section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative z-10 pb-12"
      >
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-6">
            Trusted by leading organizations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {trustedBy.map((company, i) => (
              <motion.span
                key={company.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 + i * 0.1, duration: 0.5 }}
                className="text-sm font-semibold text-gray-300 hover:text-gray-500 transition-colors cursor-default"
              >
                {company.name}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
