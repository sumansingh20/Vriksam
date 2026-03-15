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
            bloomIntensity={0.4}
          >
            <HeroSceneContent plantCount={7} particleCount={250} speed={0.8} />
          </SceneCanvas>
        );
      }
      Wrapped.displayName = 'HeroSceneWrapper';
      return { default: Wrapped };
    }),
  { ssr: false },
);

/* -------------------------------------------------------------------------- */
/*  Floating particle overlay (pure CSS)                                      */
/* -------------------------------------------------------------------------- */

function ParticlesOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-emerald-400/20"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 5}s ease-in-out ${Math.random() * 5}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Animated word-by-word text                                                */
/* -------------------------------------------------------------------------- */

function AnimatedHeading({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.6,
            delay: 0.15 + i * 0.08,
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
/*  Stats bar items                                                           */
/* -------------------------------------------------------------------------- */

const stats = [
  { value: '10,000+', label: 'Plants Managed' },
  { value: '500+', label: 'Companies' },
  { value: '98%', label: 'Survival Rate' },
  { value: '50', label: 'Cities' },
];

/* -------------------------------------------------------------------------- */
/*  Hero Section                                                              */
/* -------------------------------------------------------------------------- */

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-white"
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-50" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.08)_0%,_transparent_70%)]" />

      {/* 3D Scene background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <HeroSceneWrapper />
      </div>

      {/* Floating particles */}
      <ParticlesOverlay />

      {/* Content */}
      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-sm font-medium text-emerald-700 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Now serving 50+ cities across India
            </span>
          </motion.div>

          {/* Main Heading */}
          <h1 className="max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <AnimatedHeading
              text="The Future of"
              className="text-gray-900"
            />
            <br />
            <AnimatedHeading
              text="Green Infrastructure"
              className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent"
            />
          </h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl"
          >
            Transform your spaces with intelligent plant management. Monitor, maintain,
            and maximize your green assets with AI-powered insights.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'group relative flex items-center gap-2.5 overflow-hidden rounded-full',
                  'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500',
                  'px-8 py-4 text-base font-semibold text-white',
                  'shadow-xl shadow-emerald-500/25',
                  'transition-shadow duration-300 hover:shadow-emerald-500/40',
                )}
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                'group flex items-center gap-2.5 rounded-full',
                'border-2 border-gray-200 bg-white/80 backdrop-blur-sm',
                'px-8 py-4 text-base font-semibold text-gray-700',
                'transition-all duration-200',
                'hover:border-emerald-300 hover:text-emerald-700',
              )}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-colors duration-200 group-hover:bg-emerald-200">
                <Play className="h-3 w-3 fill-current" />
              </div>
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-20 w-full max-w-3xl"
          >
            <div className="rounded-2xl border border-emerald-100/80 bg-white/60 p-6 shadow-lg shadow-emerald-500/5 backdrop-blur-xl">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={cn(
                      'flex flex-col items-center gap-1',
                      i < stats.length - 1 && 'sm:border-r sm:border-emerald-100',
                    )}
                  >
                    <span className="text-2xl font-bold text-gray-900 sm:text-3xl">
                      {stat.value}
                    </span>
                    <span className="text-sm text-gray-500">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-medium tracking-wider text-gray-400 uppercase">
            Scroll to explore
          </span>
          <ChevronDown className="h-5 w-5 text-emerald-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
