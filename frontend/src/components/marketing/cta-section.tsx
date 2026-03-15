'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  CTA Section                                                               */
/* -------------------------------------------------------------------------- */

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      {/* Full dark green gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-900 to-forest-900" />

      {/* Radial glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.2)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(52,211,153,0.1)_0%,_transparent_50%)]" />

      {/* Decorative floating elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large glowing orb */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating dots */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-emerald-400/20"
            style={{
              width: `${3 + Math.random() * 6}px`,
              height: `${3 + Math.random() * 6}px`,
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animation: `float ${6 + Math.random() * 6}s ease-in-out ${Math.random() * 4}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-300 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            14-day free trial, no credit card required
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Ready to go{' '}
            <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent">
              green
            </span>
            ?
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-emerald-100/70">
            Join hundreds of companies already transforming their spaces with
            intelligent plant management. Start your green journey today.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'group flex items-center gap-2.5 rounded-full',
                  'bg-white px-8 py-4',
                  'text-base font-semibold text-emerald-900',
                  'shadow-xl shadow-black/20',
                  'transition-all duration-200 hover:bg-emerald-50',
                )}
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </motion.button>
            </Link>

            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'flex items-center gap-2.5 rounded-full',
                  'border-2 border-emerald-400/30 bg-transparent',
                  'px-8 py-4 text-base font-semibold text-white',
                  'transition-all duration-200',
                  'hover:border-emerald-400/60 hover:bg-emerald-400/10',
                )}
              >
                Contact Sales
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
