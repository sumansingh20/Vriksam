'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from 'framer-motion';
import { ArrowRight, Play, Leaf, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGES, BLUR_DATA_URL } from '@/lib/images';

/* -------------------------------------------------------------------------- */
/*  Trusted-by companies                                                       */
/* -------------------------------------------------------------------------- */

const trustedBy = [
  { name: 'Infosys', logo: 'INFOSYS' },
  { name: 'WeWork', logo: 'WEWORK' },
  { name: 'Prestige', logo: 'PRESTIGE' },
  { name: 'Godrej', logo: 'GODREJ' },
  { name: 'Tata Realty', logo: 'TATA' },
  { name: 'Embassy', logo: 'EMBASSY' },
];

/* -------------------------------------------------------------------------- */
/*  Animated text with word-by-word reveal                                     */
/* -------------------------------------------------------------------------- */

function AnimatedText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(' ');

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Floating particles                                                         */
/* -------------------------------------------------------------------------- */

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-emerald-400/30"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          animate={{
            y: [null, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Animated gradient orb with complex motion                                  */
/* -------------------------------------------------------------------------- */

function GradientOrb({
  className,
  color,
  delay = 0,
  size = 400,
}: {
  className?: string;
  color: string;
  delay?: number;
  size?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn('absolute rounded-full blur-[100px]', className)}
      style={{
        width: size,
        height: size,
        background: color,
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1.1, 1],
          x: [0, 30, -20, 0],
          y: [0, -20, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-full h-full"
      />
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Premium stat badge                                                         */
/* -------------------------------------------------------------------------- */

function StatBadge({
  value,
  label,
  icon: Icon,
  delay,
  position,
}: {
  value: string;
  label: string;
  icon: React.ElementType;
  delay: number;
  position: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn('absolute hidden lg:block', position)}
    >
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl" />
        <div className="relative glass-premium rounded-2xl px-5 py-4 shadow-2xl shadow-black/5 border border-white/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Animated counter                                                           */
/* -------------------------------------------------------------------------- */

function useCounter(end: number, duration: number = 2000, start: boolean = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(end * eased));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
}

/* -------------------------------------------------------------------------- */
/*  Hero Section                                                               */
/* -------------------------------------------------------------------------- */

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  const smoothY = useSpring(y, { stiffness: 80, damping: 20 });
  const smoothScale = useSpring(scale, { stiffness: 80, damping: 20 });
  const smoothImageY = useSpring(imageY, { stiffness: 80, damping: 20 });
  const smoothImageScale = useSpring(imageScale, { stiffness: 80, damping: 20 });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16, 185, 129, 0.15), transparent),
              radial-gradient(ellipse 60% 40% at 80% 50%, rgba(20, 184, 166, 0.1), transparent),
              radial-gradient(ellipse 50% 30% at 20% 80%, rgba(52, 211, 153, 0.08), transparent)
            `,
          }}
        />
      </div>

      {/* Premium grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated gradient orbs */}
      <GradientOrb
        className="-top-[200px] -left-[200px]"
        color="radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)"
        delay={0.2}
        size={600}
      />
      <GradientOrb
        className="top-[30%] -right-[200px]"
        color="radial-gradient(circle, rgba(20, 184, 166, 0.2) 0%, transparent 70%)"
        delay={0.4}
        size={500}
      />
      <GradientOrb
        className="bottom-[10%] left-[10%]"
        color="radial-gradient(circle, rgba(52, 211, 153, 0.15) 0%, transparent 70%)"
        delay={0.6}
        size={400}
      />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Main content */}
      <motion.div
        style={{ y: smoothY, opacity, scale: smoothScale }}
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-28 pb-16 sm:px-8 lg:px-12"
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Announcement badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/case-studies"
              className={cn(
                'group inline-flex items-center gap-3 rounded-full',
                'bg-white/90 backdrop-blur-xl border border-emerald-100',
                'px-5 py-2.5 text-sm font-medium',
                'shadow-lg shadow-emerald-500/5 hover:shadow-xl hover:shadow-emerald-500/10',
                'hover:border-emerald-200 hover:bg-white',
                'transition-all duration-500',
              )}
            >
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </motion.span>
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-semibold">
                  New
                </span>
              </span>
              <span className="w-px h-4 bg-gray-200" />
              <span className="text-gray-600">Serving 50+ cities across India</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all duration-300" />
            </Link>
          </motion.div>

          {/* Main headline with animated text */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 font-display text-[clamp(2.8rem,7vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.04em]"
          >
            <AnimatedText
              text="Transform your space"
              className="block text-gray-900"
              delay={0.2}
            />
            <span className="block mt-2">
              <AnimatedText
                text="into a"
                className="text-gray-900"
                delay={0.5}
              />
              {' '}
              <motion.span
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative inline-block"
              >
                <span className="relative z-10 bg-gradient-to-r from-emerald-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                  living ecosystem
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-r from-emerald-200/60 to-teal-200/60 -z-0 origin-left rounded-full blur-sm"
                />
              </motion.span>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed"
          >
            AI-powered plant care that monitors health, schedules maintenance, and tracks
            environmental impact—so your green spaces{' '}
            <span className="text-emerald-600 font-medium">thrive effortlessly</span>.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Primary CTA */}
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'group relative flex items-center gap-3 rounded-full overflow-hidden',
                  'px-8 py-4 text-[15px] font-semibold text-white',
                  'shadow-xl shadow-gray-900/20',
                  'transition-all duration-300',
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 group-hover:from-gray-800 group-hover:via-gray-700 group-hover:to-gray-800 transition-all duration-500" />
                <span className="relative">Start free trial</span>
                <ArrowRight className="relative w-4.5 h-4.5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </Link>

            {/* Secondary CTA */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'group flex items-center gap-3 rounded-full',
                'bg-white/80 backdrop-blur-xl hover:bg-white',
                'border border-gray-200 hover:border-emerald-200',
                'px-7 py-4 text-[15px] font-semibold text-gray-700',
                'shadow-lg shadow-gray-100/50 hover:shadow-xl hover:shadow-emerald-100/50',
                'transition-all duration-300',
              )}
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-shadow">
                <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="currentColor" />
              </span>
              Watch demo
            </motion.button>
          </motion.div>

          {/* Hero visual with floating stats */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 relative mx-auto max-w-5xl"
          >
            {/* Glow effect behind image */}
            <div className="absolute -inset-8 bg-gradient-to-r from-emerald-200/40 via-teal-200/30 to-green-200/40 rounded-[3rem] blur-3xl opacity-70" />

            {/* Main image container */}
            <motion.div
              style={{ y: smoothImageY, scale: smoothImageScale }}
              className="relative"
            >
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl shadow-gray-900/15 ring-1 ring-gray-200/50">
                {/* Dashboard preview image */}
                <Image
                  src={IMAGES.hero.greenWall}
                  alt="Vriksham - Transform your space with living green walls"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />

                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 via-transparent to-teal-900/10" />

                {/* Animated scan line effect */}
                <motion.div
                  initial={{ y: '-100%' }}
                  animate={{ y: '100%' }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatDelay: 2,
                  }}
                  className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent pointer-events-none"
                />
              </div>

              {/* Floating stat badges */}
              <StatBadge
                value="98.5%"
                label="Plant Health"
                icon={Leaf}
                delay={1.8}
                position="bottom-8 -left-6"
              />
              <StatBadge
                value="2.4M kg"
                label="CO₂ Offset"
                icon={TrendingUp}
                delay={2}
                position="top-8 -right-6"
              />
              <StatBadge
                value="99.9%"
                label="Uptime"
                icon={Shield}
                delay={2.2}
                position="bottom-24 -right-8"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Trusted by section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="relative z-10 pb-16"
      >
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-gray-400 mb-8">
            Trusted by leading organizations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
            {trustedBy.map((company, i) => (
              <motion.span
                key={company.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.1 + i * 0.1, duration: 0.5 }}
                className="text-sm font-bold text-gray-300 hover:text-emerald-500/70 transition-colors duration-300 cursor-default tracking-wide"
              >
                {company.logo}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
    </section>
  );
}
