'use client';

import { Suspense, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, Play, Sparkles, Zap, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Lazy-load the 3D hero scene (no SSR)                                      */
/* -------------------------------------------------------------------------- */

const HeroSceneWrapper = dynamic(
  () =>
    Promise.all([
      import('@/components/three/scene'),
      import('@/components/three/hero-scene'),
    ]).then(([sceneMod, heroMod]) => {
      const SceneCanvas = sceneMod.Scene;
      const HeroSceneContent = heroMod.HeroSceneContent;

      function Wrapped() {
        return (
          <SceneCanvas
            className="h-full w-full"
            orbit={false}
            fov={45}
            cameraPosition={[0, 1.5, 8]}
            bloom
            bloomIntensity={0.35}
          >
            <HeroSceneContent plantCount={7} particleCount={200} speed={0.6} />
          </SceneCanvas>
        );
      }
      Wrapped.displayName = 'HeroSceneWrapper';
      return { default: Wrapped };
    }),
  { ssr: false },
);

/* -------------------------------------------------------------------------- */
/*  Floating badge component                                                   */
/* -------------------------------------------------------------------------- */

interface FloatingBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
  delay?: number;
  floatDuration?: number;
  floatDistance?: number;
}

function FloatingBadge({
  icon,
  label,
  value,
  className,
  delay = 0,
  floatDuration = 6,
  floatDistance = 12,
}: FloatingBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: 1.2 + delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn('absolute z-20 hidden lg:block', className)}
    >
      <motion.div
        animate={{ y: [-floatDistance / 2, floatDistance / 2, -floatDistance / 2] }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={cn(
          'flex items-center gap-3 rounded-2xl',
          'border border-white/60 bg-white/70 backdrop-blur-xl',
          'px-4 py-3 shadow-lg shadow-black/[0.03]',
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20">
          {icon}
        </span>
        <div className="flex flex-col">
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            {label}
          </span>
          <span className="text-sm font-bold tracking-tight text-gray-900">
            {value}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stagger animation config                                                   */
/* -------------------------------------------------------------------------- */

const stagger = {
  pill: 0,
  headline: 0.15,
  subheadline: 0.45,
  cta: 0.65,
  trusted: 0.9,
};

/* -------------------------------------------------------------------------- */
/*  Trusted-by companies                                                       */
/* -------------------------------------------------------------------------- */

const trustedBy = [
  'Infosys',
  'WeWork',
  'Prestige',
  'Godrej',
  'Tata Realty',
  'Embassy',
];

/* -------------------------------------------------------------------------- */
/*  Hero Section                                                               */
/* -------------------------------------------------------------------------- */

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden"
    >
      {/* ================================================================== */}
      {/*  Background layers                                                 */}
      {/* ================================================================== */}

      {/* Base warm-white gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_#f0fdf4_0%,_#f8fffe_20%,_#ffffff_50%,_#ffffff_100%)]" />

      {/* Organic gradient mesh blobs */}
      <div className="pointer-events-none absolute inset-0">
        {/* Top-left emerald blob */}
        <div
          className="absolute -left-[10%] -top-[5%] h-[700px] w-[700px] rounded-full opacity-[0.07]"
          style={{
            background:
              'radial-gradient(circle, #10b981 0%, #059669 40%, transparent 70%)',
          }}
        />
        {/* Center-right teal blob */}
        <div
          className="absolute right-[5%] top-[15%] h-[600px] w-[600px] rounded-full opacity-[0.05]"
          style={{
            background:
              'radial-gradient(circle, #14b8a6 0%, #0d9488 40%, transparent 70%)',
          }}
        />
        {/* Bottom-center green blob */}
        <div
          className="absolute bottom-[5%] left-[30%] h-[500px] w-[500px] rounded-full opacity-[0.06]"
          style={{
            background:
              'radial-gradient(circle, #34d399 0%, #6ee7b7 40%, transparent 70%)',
          }}
        />
      </div>

      {/* Dot grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(16,185,129,0.12) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Subtle top edge glow line */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />

      {/* 3D Scene behind content */}
      <motion.div
        style={{ scale: sceneScale }}
        className="absolute inset-0 z-0 opacity-25"
      >
        <Suspense fallback={null}>
          <HeroSceneWrapper />
        </Suspense>
      </motion.div>

      {/* ================================================================== */}
      {/*  Floating social-proof badges                                      */}
      {/* ================================================================== */}

      <FloatingBadge
        icon={<Sparkles className="h-4 w-4" />}
        label="Intelligence"
        value="AI-Powered"
        className="left-[6%] top-[28%] xl:left-[8%]"
        delay={0}
        floatDuration={7}
        floatDistance={14}
      />
      <FloatingBadge
        icon={<Zap className="h-4 w-4" />}
        label="Reliability"
        value="99.9% Uptime"
        className="right-[6%] top-[22%] xl:right-[8%]"
        delay={0.2}
        floatDuration={8}
        floatDistance={10}
      />
      <FloatingBadge
        icon={<Leaf className="h-4 w-4" />}
        label="Scale"
        value="10K+ Plants"
        className="left-[10%] bottom-[28%] xl:left-[12%]"
        delay={0.4}
        floatDuration={6.5}
        floatDistance={12}
      />

      {/* ================================================================== */}
      {/*  Main content                                                       */}
      {/* ================================================================== */}

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-5 pt-32 pb-24 sm:px-8 lg:px-12"
      >
        {/* Announcement pill */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.6,
            delay: stagger.pill,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-8"
        >
          <Link
            href="/marketplace"
            className={cn(
              'group inline-flex items-center gap-2.5 rounded-full',
              'border border-emerald-200/70 bg-white/80 backdrop-blur-md',
              'px-4 py-2 text-[13px] font-medium text-emerald-700',
              'shadow-sm shadow-emerald-500/[0.04]',
              'transition-all duration-300 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/10',
            )}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Now serving 50+ cities across India
            <ChevronRight className="h-3.5 w-3.5 text-emerald-500 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.7,
            delay: stagger.headline,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-5xl text-center font-heading"
        >
          <span className="block text-[clamp(3rem,6.5vw,5rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-gray-900">
            The Future of
          </span>
          <span className="mt-1 block text-[clamp(3rem,6.5vw,5rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
            <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-400 bg-clip-text text-transparent">
              Green Infrastructure
            </span>
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.6,
            delay: stagger.subheadline,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-7 max-w-2xl text-center text-lg leading-relaxed text-gray-600 sm:text-xl"
        >
          Intelligent plant management for modern spaces. Monitor health,
          schedule maintenance, and measure environmental impact &mdash; all from
          one beautifully crafted platform.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.5,
            delay: stagger.cta,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          {/* Primary CTA */}
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className={cn(
                'group relative flex items-center gap-2.5 overflow-hidden rounded-full',
                'bg-gradient-to-r from-emerald-600 to-emerald-500',
                'px-8 py-4 text-[15px] font-semibold text-white',
                'shadow-xl shadow-emerald-500/25',
                'transition-shadow duration-300 hover:shadow-2xl hover:shadow-emerald-500/30',
              )}
            >
              Start Free Trial
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              {/* Shine sweep on hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.15] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            </motion.button>
          </Link>

          {/* Secondary CTA */}
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={cn(
              'group flex items-center gap-2.5 rounded-full',
              'border border-gray-200/80 bg-white/80 backdrop-blur-sm',
              'px-7 py-4 text-[15px] font-semibold text-gray-700',
              'shadow-sm',
              'transition-all duration-300',
              'hover:border-gray-300 hover:bg-white hover:shadow-md',
            )}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition-colors duration-200 group-hover:bg-emerald-100">
              <Play className="ml-0.5 h-3 w-3 fill-current" />
            </span>
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Trusted-by bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: stagger.trusted }}
          className="mt-20 flex flex-col items-center gap-5"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
            Trusted by leading companies
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
            {trustedBy.map((name, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: stagger.trusted + 0.08 * i }}
                className="text-[15px] font-semibold tracking-tight text-gray-300 transition-colors duration-300 hover:text-gray-500"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ================================================================== */}
      {/*  Scroll indicator                                                   */}
      {/* ================================================================== */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
            Explore
          </span>
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-gray-300/60 p-1.5">
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom fade to white */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
