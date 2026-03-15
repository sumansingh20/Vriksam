'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  CTA Section — clean, minimal, high-contrast                              */
/* -------------------------------------------------------------------------- */

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative overflow-hidden bg-gray-900 py-24 sm:py-32">
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.12)_0%,_transparent_60%)]" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-white">
            Ready to transform
            <br />
            your spaces?
          </h2>

          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-gray-400">
            Join 500+ organizations managing their green infrastructure with
            Vriksham. Start your 14-day free trial today.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-900 shadow-xl shadow-black/10 transition-all duration-200 hover:bg-gray-100"
            >
              Start free trial
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/15 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:border-white/30 hover:bg-white/5"
            >
              Talk to sales
            </Link>
          </div>

          {/* Trust line */}
          <p className="mt-8 text-sm text-gray-500">
            14-day free trial &middot; No credit card required &middot; Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
