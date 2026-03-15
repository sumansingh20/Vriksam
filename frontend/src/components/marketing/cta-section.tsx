'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  CTA Section — dramatic, immersive, premium                               */
/* -------------------------------------------------------------------------- */

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative overflow-hidden bg-gray-950 py-28 sm:py-36">
      {/* Animated gradient mesh */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.07] blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-teal-500/[0.05] blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-green-500/[0.04] blur-[120px]" />
      </div>

      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Decorative floating leaves */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-20 left-[10%] text-emerald-500/10"
      >
        <Leaf className="h-24 w-24" />
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10], rotate: [0, -8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-20 right-[10%] text-emerald-500/[0.06]"
      >
        <Leaf className="h-32 w-32 rotate-45" />
      </motion.div>

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Get Started Today
          </motion.div>

          <h2 className="font-heading text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight text-white">
            Ready to transform{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
              your green spaces
            </span>
            ?
          </h2>

          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-gray-400">
            Join 500+ organizations managing their green infrastructure with
            Vriksham. Start your 14-day free trial today.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-white px-8 py-4 text-[15px] font-semibold text-gray-900 shadow-2xl shadow-white/10 transition-all duration-300 hover:shadow-white/20"
              >
                Start free trial
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-100/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </motion.div>
            </Link>

            <Link href="/contact">
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 rounded-2xl border border-white/[0.12] bg-white/[0.04] px-8 py-4 text-[15px] font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/[0.08]"
              >
                Talk to sales
              </motion.div>
            </Link>
          </div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 flex items-center justify-center gap-3 text-sm text-gray-500"
          >
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-emerald-500/60" />
              14-day free trial
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-emerald-500/60" />
              No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-emerald-500/60" />
              Cancel anytime
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
