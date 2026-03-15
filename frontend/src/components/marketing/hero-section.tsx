'use client';

import { useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
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
/*  Ambient particles (CSS, deterministic positions)                          */
/* -------------------------------------------------------------------------- */

const PARTICLE_SEEDS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  size: 2 + (((i * 7 + 3) % 5) * 0.8),
  left: ((i * 17 + 11) % 100),
  top: ((i * 23 + 7) % 100),
  duration: 6 + ((i * 3) % 5),
  delay: (i * 0.7) % 4,
}));

function AmbientParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLE_SEEDS.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-emerald-400/15"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Word reveal animation                                                     */
/* -------------------------------------------------------------------------- */

function RevealText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.55,
            delay: delay + i * 0.07,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Trusted-by logos                                                          */
/* -------------------------------------------------------------------------- */

const trustedBy = ['Infosys', 'WeWork', 'Prestige', 'Godrej', 'Tata'];

/* -------------------------------------------------------------------------- */
/*  Hero Section                                                              */
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
      {/* -- Background layers ------------------------------------------------ */}

      {/* Base gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_#f0fdf4_0%,_#ffffff_40%,_#ffffff_100%)]" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Center radial glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.07] blur-[120px]" />
        <div className="absolute right-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-teal-300/[0.05] blur-[100px]" />
      </div>

      {/* 3D Scene */}
      <motion.div
        style={{ scale: sceneScale }}
        className="absolute inset-0 z-0 opacity-30"
      >
        <HeroSceneWrapper />
      </motion.div>

      {/* Ambient particles */}
      <AmbientParticles />

      {/* -- Content ---------------------------------------------------------- */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 pt-32 pb-20 sm:px-8 lg:px-12"
      >
        {/* Announcement pill */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="mb-10"
        >
          <Link
            href="/marketplace"
            className={cn(
              'group inline-flex items-center gap-2.5 rounded-full',
              'border border-emerald-200/80 bg-white/70 backdrop-blur-md',
              'px-4 py-2 text-[13px] font-medium text-emerald-700',
              'shadow-sm shadow-emerald-500/5',
              'transition-all duration-300 hover:border-emerald-300 hover:shadow-emerald-500/10',
            )}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Now serving 50+ cities across India
            <ArrowRight className="h-3.5 w-3.5 text-emerald-500 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Headline */}
        <h1 className="max-w-4xl text-center">
          <span className="block text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.035em] text-gray-900">
            <RevealText text="The Future of" delay={0.1} />
          </span>
          <span className="mt-1 block text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.035em]">
            <RevealText
              text="Green Infrastructure"
              delay={0.3}
              className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent"
            />
          </span>
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-7 max-w-xl text-center text-lg leading-relaxed text-gray-500 sm:text-[1.175rem]"
        >
          Intelligent plant management for modern spaces. Monitor health,
          schedule maintenance, and measure environmental impact &mdash; all
          from one platform.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85 }}
          className="mt-10 flex flex-col items-center gap-3.5 sm:flex-row"
        >
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.975 }}
              className={cn(
                'group relative flex items-center gap-2.5 overflow-hidden rounded-full',
                'bg-gray-900 px-7 py-3.5 text-[15px] font-semibold text-white',
                'shadow-xl shadow-gray-900/15',
                'transition-shadow duration-300 hover:shadow-gray-900/25',
              )}
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.025, y: -1 }}
            whileTap={{ scale: 0.975 }}
            className={cn(
              'group flex items-center gap-2.5 rounded-full',
              'border border-gray-200 bg-white/80 backdrop-blur-sm',
              'px-7 py-3.5 text-[15px] font-semibold text-gray-700',
              'shadow-sm',
              'transition-all duration-200',
              'hover:border-gray-300 hover:shadow-md',
            )}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
              <Play className="ml-0.5 h-3 w-3 fill-current" />
            </span>
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Trusted-by bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20 flex flex-col items-center gap-4"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
            Trusted by leading enterprises
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {trustedBy.map((name) => (
              <span
                key={name}
                className="text-[15px] font-semibold tracking-tight text-gray-300 transition-colors duration-200 hover:text-gray-400"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
            Explore
          </span>
          <ChevronDown className="h-4 w-4 text-gray-300" />
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
