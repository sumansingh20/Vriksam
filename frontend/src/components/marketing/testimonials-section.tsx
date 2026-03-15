'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Testimonials data                                                         */
/* -------------------------------------------------------------------------- */

const testimonials = [
  {
    quote:
      'Vriksham transformed our office environment. Employee satisfaction increased by 40% and our workspace became a talking point for every visitor.',
    name: 'Rajesh Kumar',
    title: 'CTO',
    company: 'TechCorp',
    rating: 5,
    initials: 'RK',
    gradient: 'from-emerald-400 to-green-500',
  },
  {
    quote:
      'The AI monitoring system caught plant diseases before they spread. Incredible technology that saved us thousands in replacement costs.',
    name: 'Priya Sharma',
    title: 'Facilities Head',
    company: 'GreenSpaces',
    rating: 5,
    initials: 'PS',
    gradient: 'from-green-400 to-teal-500',
  },
  {
    quote:
      'Their subscription model made corporate greenery management effortless. We went from spending hours on plant care to zero intervention.',
    name: 'Anil Mehta',
    title: 'CEO',
    company: 'EcoBuilders',
    rating: 5,
    initials: 'AM',
    gradient: 'from-teal-400 to-emerald-500',
  },
];

/* -------------------------------------------------------------------------- */
/*  Star rating                                                               */
/* -------------------------------------------------------------------------- */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-gray-200 text-gray-200',
          )}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Testimonial card                                                          */
/* -------------------------------------------------------------------------- */

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div
        className={cn(
          'relative flex h-full flex-col rounded-3xl p-8',
          'border border-white/60 bg-white/50 backdrop-blur-xl',
          'shadow-lg shadow-black/[0.03]',
          'transition-all duration-500',
          'hover:border-emerald-200/80 hover:bg-white/80',
          'hover:shadow-xl hover:shadow-emerald-500/[0.06]',
          'hover:-translate-y-1',
        )}
      >
        {/* Quote icon */}
        <div className="mb-4 flex items-center justify-between">
          <Quote className="h-8 w-8 text-emerald-200" />
          <StarRating rating={testimonial.rating} />
        </div>

        {/* Quote text */}
        <blockquote className="flex-1 text-base leading-relaxed text-gray-700">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        {/* Author */}
        <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-6">
          {/* Avatar placeholder */}
          <div
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-full',
              'bg-gradient-to-br text-sm font-bold text-white',
              testimonial.gradient,
            )}
          >
            {testimonial.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {testimonial.name}
            </p>
            <p className="text-sm text-gray-500">
              {testimonial.title}, {testimonial.company}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Testimonials Section                                                      */
/* -------------------------------------------------------------------------- */

export function TestimonialsSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-100px' });

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Testimonials
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
              industry leaders
            </span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            See what our clients say about transforming their spaces with Vriksham.
          </p>
        </motion.div>

        {/* Testimonial cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
