'use client';

import { Suspense, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronRight, Play, TrendingUp, Users, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/images';
import { buttonPress } from '@/animations/micro-interactions';

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
/*  Premium floating badge component                                          */
/* -------------------------------------------------------------------------- */

interface FloatingBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  className?: string;
  delay?: number;
  floatDuration?: number;
  floatDistance?: number;
  glowColor?: string;
}

function FloatingBadge({
  icon,
  label,
  value,
  accent,
  className,
  delay = 0,
  floatDuration = 6,
  floatDistance = 12,
  glowColor = 'emerald',
}: FloatingBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20, filter: 'blur(4px)' }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        duration: 0.8,
        delay: 1.4 + delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn('absolute z-30 hidden xl:block', className)}
    >
      <motion.div
        animate={{ y: [-floatDistance / 2, floatDistance / 2, -floatDistance / 2] }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="group cursor-pointer"
      >
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={cn(
            'glass-premium relative flex items-center gap-4 rounded-2xl px-5 py-4',
            'border-white/70 shadow-premium-md',
            `hover:shadow-${glowColor}-premium`,
            'transition-all duration-300'
          )}
        >
          {/* Background glow effect */}
          <div className={cn(
            'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300',
            `bg-${glowColor}-500/5`
          )} />

          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className={cn(
              'relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
              'bg-gradient-to-br shadow-sm ring-1 ring-black/5',
              accent
            )}
          >
            {icon}
          </motion.div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              {label}
            </span>
            <span className="text-base font-bold tracking-tight text-gray-900">
              {value}
            </span>
          </div>

          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </motion.div>
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

  // Enhanced parallax transforms with spring physics
  const y = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.15]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.3], [0.4, 0]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  // Smooth spring transforms for fluid motion
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothScale = useSpring(sceneScale, { stiffness: 100, damping: 30 });

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden"
    >
      {/* ================================================================== */}
      {/*  Enhanced background system                                        */}
      {/* ================================================================== */}

      {/* Premium gradient base with enhanced depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-emerald-50/30" />

      {/* Hero mesh gradient overlay */}
      <div className="absolute inset-0 bg-hero-glow opacity-60" />

      {/* Real office background with plants (subtle) */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-[0.03]"
      >
        <Image
          src={IMAGES.hero.office}
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </motion.div>

      {/* Organic floating gradient orbs with enhanced movement */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-[8%] -top-[3%] h-[800px] w-[800px] rounded-full opacity-[0.08]"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.6) 0%, rgba(5,150,105,0.3) 40%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute right-[3%] top-[12%] h-[700px] w-[700px] rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, rgba(20,184,166,0.5) 0%, rgba(13,148,136,0.2) 40%, transparent 70%)',
          }}
        />
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          className="absolute bottom-[3%] left-[25%] h-[600px] w-[600px] rounded-full opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle, rgba(52,211,153,0.4) 0%, rgba(110,231,183,0.2) 40%, transparent 70%)',
          }}
        />
      </div>

      {/* Premium dot pattern with subtle animation */}
      <motion.div
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          backgroundPosition: '16px 16px',
        }}
      />

      {/* Enhanced 3D Scene with better integration */}
      <motion.div
        style={{ scale: smoothScale, opacity: sceneOpacity }}
        className="absolute inset-0 z-10"
      >
        <Suspense fallback={null}>
          <HeroSceneWrapper />
        </Suspense>
      </motion.div>

      {/* ================================================================== */}
      {/*  Premium floating badges with enhanced content                     */}
      {/* ================================================================== */}

      <FloatingBadge
        icon={<TrendingUp className="h-5 w-5 text-white" />}
        label="Growth"
        value="40% Faster"
        accent="from-emerald-600 to-emerald-500 text-white"
        className="left-[4%] top-[20%] xl:left-[6%]"
        delay={0}
        floatDuration={8}
        floatDistance={16}
        glowColor="emerald"
      />
      <FloatingBadge
        icon={<Shield className="h-5 w-5 text-white" />}
        label="Reliability"
        value="99.9% Uptime"
        accent="from-blue-600 to-blue-500 text-white"
        className="right-[4%] top-[16%] xl:right-[6%]"
        delay={0.3}
        floatDuration={7.5}
        floatDistance={12}
        glowColor="blue"
      />
      <FloatingBadge
        icon={<Users className="h-5 w-5 text-white" />}
        label="Trust"
        value="500+ Teams"
        accent="from-teal-600 to-teal-500 text-white"
        className="left-[8%] bottom-[22%] xl:left-[10%]"
        delay={0.6}
        floatDuration={9}
        floatDistance={14}
        glowColor="teal"
      />

      {/* ================================================================== */}
      {/*  Enhanced main content with premium typography                     */}
      {/* ================================================================== */}

      <motion.div
        style={{ y: smoothY, opacity }}
        className="relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-32 pb-24 sm:px-8 lg:px-12"
      >
        {/* Premium announcement pill */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.8,
            delay: stagger.pill,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-10"
        >
          <Link
            href="/marketplace"
            className={cn(
              'group inline-flex items-center gap-3 rounded-full',
              'glass-premium border-emerald-200/60 px-5 py-3',
              'text-sm font-semibold text-emerald-700',
              'shadow-emerald-soft hover:shadow-emerald-premium-lg',
              'transition-all duration-300 hover:scale-105',
            )}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
            </span>
            Now serving 50+ cities across India
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronRight className="h-4 w-4 text-emerald-600" />
            </motion.div>
          </Link>
        </motion.div>

        {/* Enhanced headline with premium typography */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.9,
            delay: stagger.headline,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-6xl text-center font-heading"
        >
          <h1 className="text-display-xl lg:text-display-2xl font-extrabold tracking-[-0.04em] text-gray-900">
            <span className="block">
              Spaces that breathe.
            </span>
            <span className="mt-2 block">
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Intelligence that cares.
              </span>
            </span>
          </h1>
        </motion.div>

        {/* Enhanced subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.7,
            delay: stagger.subheadline,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-8 max-w-2xl text-center text-xl leading-relaxed text-gray-600 lg:text-2xl lg:leading-relaxed"
        >
          Transform any space into a thriving ecosystem. Our AI monitors plant health in real-time, schedules perfect care, and tracks environmental impact—so you can focus on what matters most.
        </motion.p>

        {/* Enhanced CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.6,
            delay: stagger.cta,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-12 flex flex-col items-center gap-5 sm:flex-row"
        >
          {/* Primary CTA with enhanced interactions */}
          <Link href="/register">
            <motion.button
              variants={buttonPress}
              initial="rest"
              whileHover="hover"
              whileTap="pressed"
              className={cn(
                'group relative flex items-center gap-3 overflow-hidden rounded-full',
                'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600',
                'px-10 py-5 text-base font-bold text-white',
                'shadow-emerald-premium hover:shadow-emerald-premium-lg',
                'transition-all duration-300 ring-1 ring-emerald-500/20',
              )}
            >
              <span className="relative z-10">Start Free Trial</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.div>

              {/* Enhanced shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-emerald-400/0 group-hover:bg-emerald-400/10 transition-all duration-300 rounded-full" />
            </motion.button>
          </Link>

          {/* Enhanced secondary CTA */}
          <motion.button
            variants={buttonPress}
            initial="rest"
            whileHover="hover"
            whileTap="pressed"
            className={cn(
              'group flex items-center gap-3 rounded-full',
              'glass-premium px-8 py-5 text-base font-bold text-gray-700',
              'shadow-premium hover:shadow-card-hover',
              'transition-all duration-300',
            )}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm"
            >
              <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
            </motion.div>
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Enhanced trusted-by section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: stagger.trusted }}
          className="mt-24 flex flex-col items-center gap-6"
        >
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
            Trusted by industry leaders
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-16">
            {trustedBy.map((name, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: stagger.trusted + 0.1 * i,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ scale: 1.05, color: '#374151' }}
                className="text-base font-bold tracking-tight text-gray-300 transition-all duration-300 cursor-pointer"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ================================================================== */}
      {/*  Premium scroll indicator                                          */}
      {/* ================================================================== */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-3 cursor-pointer group"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-gray-600 transition-colors duration-300">
            Discover More
          </span>
          <div className="flex h-12 w-6 items-start justify-center rounded-full glass-subtle p-2 group-hover:bg-white/80 transition-all duration-300">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="h-2 w-2 rounded-full bg-emerald-500"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent" />
    </section>
  );
}
