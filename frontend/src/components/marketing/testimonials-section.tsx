'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/images';

/* -------------------------------------------------------------------------- */
/*  Testimonials data                                                         */
/* -------------------------------------------------------------------------- */

const testimonials = [
  {
    quote:
      'Vriksham transformed our workspace. Employee satisfaction jumped 40% in the first quarter, and our lobby became the most Instagrammed spot in the building.',
    name: 'Rajesh Kumar',
    title: 'CTO, TechCorp India',
    initials: 'RK',
    image: IMAGES.testimonials.avatars.rajesh,
  },
  {
    quote:
      'Their AI caught a fungal outbreak across three floors before any plant showed visible symptoms. That single detection saved us ₹4 lakhs in replacement costs.',
    name: 'Priya Sharma',
    title: 'Facilities Head, GreenSpaces',
    initials: 'PS',
    image: IMAGES.testimonials.avatars.priya,
  },
  {
    quote:
      'We went from spending 20 hours a week on plant vendors to zero. The subscription model and automated scheduling made greenery management completely effortless.',
    name: 'Anil Mehta',
    title: 'CEO, EcoBuilders',
    initials: 'AM',
    image: IMAGES.testimonials.avatars.arjun,
  },
  {
    quote:
      'The ESG reporting alone justified the investment. Board-ready sustainability metrics generated automatically — that used to take our team two weeks every quarter.',
    name: 'Kavitha Rao',
    title: 'Sustainability Director, Prestige Group',
    initials: 'KR',
    image: IMAGES.testimonials.avatars.meera,
  },
];

/* -------------------------------------------------------------------------- */
/*  TestimonialsSection — large single-quote carousel                        */
/* -------------------------------------------------------------------------- */

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' });

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % testimonials.length),
    [],
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length),
    [],
  );

  // Auto-advance
  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const t = testimonials[current]!;

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Testimonials
          </p>
        </motion.div>

        {/* Large quote */}
        <div className="mt-12 flex flex-col items-center text-center">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(1.25rem,3vw,2rem)] font-medium leading-[1.4] tracking-tight text-gray-900"
            >
              &ldquo;{t.quote}&rdquo;
            </motion.blockquote>
          </AnimatePresence>

          {/* Author */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-8 flex items-center gap-3"
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-emerald-100 ring-offset-2">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.title}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-10 flex items-center gap-4">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-600"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    i === current
                      ? 'w-6 bg-gray-900'
                      : 'w-2 bg-gray-300 hover:bg-gray-400',
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-600"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
