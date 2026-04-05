'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Shield, Zap, Calendar, Clock, Sparkles, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Benefits list                                                             */
/* -------------------------------------------------------------------------- */

const benefits = [
  { icon: Calendar, text: '14-day free trial' },
  { icon: Shield, text: 'No credit card' },
  { icon: Clock, text: 'Cancel anytime' },
  { icon: Zap, text: 'Setup in 24h' },
];

/* -------------------------------------------------------------------------- */
/*  CTA Section                                                               */
/* -------------------------------------------------------------------------- */

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative overflow-hidden bg-gray-900 py-28 sm:py-36">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-1/4 w-[700px] h-[700px] rounded-full bg-emerald-500 blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-teal-500 blur-[130px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-green-500 blur-[120px]"
        />
      </div>

      {/* Subtle grid pattern */}
      <div className="cta-grid-pattern absolute inset-0 opacity-[0.03]" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-emerald-400/20"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [null, '-100%'],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto px-6 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm text-sm font-medium text-emerald-400"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            Join 500+ teams thriving
          </motion.span>

          {/* Headline */}
          <h2 className="mt-10 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Ready to transform{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                your space
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400/50 to-teal-400/50 origin-left rounded-full"
              />
            </span>
            ?
          </h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Create healthier, more productive workspaces with AI-powered plant care.
            Start your free trial and see results within the first month.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'group relative flex items-center gap-3 rounded-full overflow-hidden',
                  'px-9 py-4.5 text-base font-semibold text-gray-900',
                  'shadow-2xl shadow-white/20',
                  'transition-all duration-300',
                )}
              >
                <div className="absolute inset-0 bg-white group-hover:bg-gray-50 transition-colors duration-300" />
                <Sparkles className="relative w-5 h-5 text-emerald-600" />
                <span className="relative">Start free trial</span>
                <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </Link>

            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'group flex items-center gap-3 rounded-full',
                  'bg-white/10 hover:bg-white/15 backdrop-blur-xl',
                  'border border-white/20 hover:border-white/30',
                  'px-9 py-4.5 text-base font-semibold text-white',
                  'transition-all duration-300',
                )}
              >
                Talk to sales
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-8"
          >
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.text}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-2.5 text-sm text-gray-400"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <benefit.icon className="w-4 h-4 text-emerald-400" />
                </div>
                <span>{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-14 flex items-center justify-center gap-3 text-sm text-gray-500"
          >
            <Leaf className="w-4 h-4 text-emerald-400/50" />
            <span>Trusted by teams at Infosys, WeWork, Prestige and more</span>
            <Leaf className="w-4 h-4 text-emerald-400/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
