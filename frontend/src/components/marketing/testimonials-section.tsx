'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGES } from '@/lib/images';

/* -------------------------------------------------------------------------- */
/*  Testimonials data                                                         */
/* -------------------------------------------------------------------------- */

const testimonials = [
  {
    quote: 'Vriksham transformed our workspace. Employee satisfaction jumped 40% in the first quarter, and our lobby became the most Instagrammed spot in the building.',
    name: 'Rajesh Kumar',
    title: 'CTO',
    company: 'TechCorp India',
    image: IMAGES.testimonials.avatars.rajesh,
    rating: 5,
  },
  {
    quote: 'Their AI caught a fungal outbreak across three floors before any plant showed visible symptoms. That single detection saved us ₹4 lakhs in replacement costs.',
    name: 'Priya Sharma',
    title: 'Facilities Head',
    company: 'GreenSpaces',
    image: IMAGES.testimonials.avatars.priya,
    rating: 5,
  },
  {
    quote: 'We went from spending 20 hours a week on plant vendors to zero. The subscription model and automated scheduling made greenery management completely effortless.',
    name: 'Anil Mehta',
    title: 'CEO',
    company: 'EcoBuilders',
    image: IMAGES.testimonials.avatars.arjun,
    rating: 5,
  },
  {
    quote: 'The ESG reporting alone justified the investment. Board-ready sustainability metrics generated automatically—that used to take our team two weeks every quarter.',
    name: 'Kavitha Rao',
    title: 'Sustainability Director',
    company: 'Prestige Group',
    image: IMAGES.testimonials.avatars.meera,
    rating: 5,
  },
];

/* -------------------------------------------------------------------------- */
/*  Testimonials Section                                                      */
/* -------------------------------------------------------------------------- */

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

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
    const id = setInterval(next, 8000);
    return () => clearInterval(id);
  }, [next]);

  const t = testimonials[current]!;

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-6 sm:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-600">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            Customer Stories
          </span>
          <h2 className="mt-6 font-display text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Loved by teams everywhere
          </h2>
        </motion.div>

        {/* Testimonial card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-12">
            {/* Quote icon */}
            <div className="absolute -top-4 left-8 sm:left-12">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30">
                <Quote className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Quote text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="pt-4"
              >
                <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed text-gray-900 font-display">
                  "{t.quote}"
                </blockquote>
              </motion.div>
            </AnimatePresence>

            {/* Rating and author */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
              >
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-white shadow-lg">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">
                      {t.title} at {t.company}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-5 h-5',
                        i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200',
                      )}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className={cn(
                'flex items-center justify-center w-11 h-11 rounded-full',
                'bg-white border border-gray-200 text-gray-600',
                'hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900',
                'transition-all duration-300',
                'shadow-sm hover:shadow-md',
              )}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    i === current
                      ? 'w-8 bg-gray-900'
                      : 'w-2 bg-gray-300 hover:bg-gray-400',
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className={cn(
                'flex items-center justify-center w-11 h-11 rounded-full',
                'bg-white border border-gray-200 text-gray-600',
                'hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900',
                'transition-all duration-300',
                'shadow-sm hover:shadow-md',
              )}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Company logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-500 mb-6">
            Join 500+ organizations creating healthier workspaces
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {['TechCorp', 'GreenSpaces', 'EcoBuilders', 'Prestige', 'WeWork', 'Godrej'].map((name) => (
              <span
                key={name}
                className="text-sm font-semibold text-gray-300 hover:text-gray-400 transition-colors"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
