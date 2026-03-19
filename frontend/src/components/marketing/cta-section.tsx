'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Leaf, Sparkles, Users, Shield, Zap, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonPress } from '@/animations/micro-interactions';

/* -------------------------------------------------------------------------- */
/*  Enhanced CTA Section — premium, compelling, conversion-focused            */
/* -------------------------------------------------------------------------- */

const benefits = [
  { icon: Calendar, text: '14-day free trial' },
  { icon: Shield, text: 'No credit card required' },
  { icon: Users, text: 'Cancel anytime' },
  { icon: Zap, text: 'Setup in 24 hours' },
];

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative overflow-hidden bg-gray-950 py-32 sm:py-40">
      {/* Enhanced animated gradient mesh */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-emerald-500/[0.08] blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-teal-500/[0.06] blur-[100px]"
        />
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-green-500/[0.04] blur-[140px]"
        />
      </div>

      {/* Enhanced dot grid with animation */}
      <motion.div
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Enhanced floating decorations */}
      <motion.div
        animate={{ y: [-15, 15, -15], rotate: [0, 8, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-16 left-[8%] text-emerald-500/8"
      >
        <Sparkles className="h-20 w-20" />
      </motion.div>
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-24 left-[15%] text-emerald-500/10"
      >
        <Leaf className="h-16 w-16" />
      </motion.div>
      <motion.div
        animate={{ y: [12, -12, 12], rotate: [0, -10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-16 right-[8%] text-emerald-500/6"
      >
        <Leaf className="h-28 w-28 rotate-45" />
      </motion.div>
      <motion.div
        animate={{ y: [8, -8, 8], rotate: [0, 12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-32 right-[20%] text-emerald-500/8"
      >
        <Sparkles className="h-12 w-12" />
      </motion.div>

      <div className="relative mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Enhanced Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
            animate={isInView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-10 inline-flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-6 py-3 text-sm font-bold uppercase tracking-widest text-emerald-400 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Join 500+ Teams Thriving
            <Sparkles className="h-4 w-4" />
          </motion.div>

          {/* Enhanced Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[0.95] tracking-tight text-white"
          >
            Ready to create spaces that{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                inspire greatness
              </span>
              {/* Subtle underline animation */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400/60 to-teal-400/60 origin-left"
              />
            </span>
            ?
          </motion.h2>

          {/* Enhanced Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-gray-300"
          >
            Transform your workspace into a thriving ecosystem. Our AI-powered platform delivers measurable improvements in productivity, wellness, and environmental impact.
          </motion.p>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:justify-center"
          >
            <Link href="/register">
              <motion.div
                variants={buttonPress}
                initial="rest"
                whileHover="hover"
                whileTap="pressed"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40"
              >
                <span className="relative z-10">Start Your Free Trial</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10"
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
                {/* Enhanced shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                {/* Glow effect */}
                <div className="absolute inset-0 bg-emerald-400/0 group-hover:bg-emerald-400/10 transition-all duration-300 rounded-2xl" />
              </motion.div>
            </Link>

            <Link href="/contact">
              <motion.div
                variants={buttonPress}
                initial="rest"
                whileHover="hover"
                whileTap="pressed"
                className="group inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-10 py-5 text-lg font-bold text-white backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-white/10"
              >
                Talk to Expert
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </motion.div>
            </Link>
          </motion.div>

          {/* Enhanced Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.text}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                className="flex items-center justify-center gap-2 rounded-xl bg-white/5 py-4 px-3 text-sm font-medium text-gray-300 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <benefit.icon className="h-4 w-4 text-emerald-400" />
                <span className="text-center">{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-gray-400">
              Trusted by teams at Infosys, WeWork, Godrej, and Tata Realty
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
