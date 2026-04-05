'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star, Sparkles, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGES, BLUR_DATA_URL } from '@/lib/images';

/* -------------------------------------------------------------------------- */
/*  Testimonials data                                                         */
/* -------------------------------------------------------------------------- */

const testimonials = [
  {
    quote: 'Vriksham transformed our workspace completely. Employee satisfaction jumped 40% in the first quarter, and our lobby became the most Instagrammed spot in the building. The ROI was evident within months.',
    name: 'Rajesh Kumar',
    title: 'CTO',
    company: 'TechCorp India',
    image: IMAGES.testimonials.avatars.rajesh,
    rating: 5,
    highlight: '40% satisfaction boost',
  },
  {
    quote: 'Their AI caught a fungal outbreak across three floors before any plant showed visible symptoms. That single detection saved us ₹4 lakhs in replacement costs. The predictive capabilities are remarkable.',
    name: 'Priya Sharma',
    title: 'Facilities Head',
    company: 'GreenSpaces',
    image: IMAGES.testimonials.avatars.priya,
    rating: 5,
    highlight: '₹4L saved',
  },
  {
    quote: 'We went from spending 20 hours a week managing plant vendors to zero. The subscription model and automated scheduling made greenery management completely effortless for our team.',
    name: 'Anil Mehta',
    title: 'CEO',
    company: 'EcoBuilders',
    image: IMAGES.testimonials.avatars.arjun,
    rating: 5,
    highlight: '20+ hours saved weekly',
  },
  {
    quote: 'The ESG reporting alone justified the investment. Board-ready sustainability metrics generated automatically—that used to take our team two weeks every quarter. Now it\'s instant.',
    name: 'Kavitha Rao',
    title: 'Sustainability Director',
    company: 'Prestige Group',
    image: IMAGES.testimonials.avatars.meera,
    rating: 5,
    highlight: '2 weeks → instant',
  },
];

const companyLogos = ['TechCorp', 'GreenSpaces', 'EcoBuilders', 'Prestige', 'WeWork', 'Godrej', 'Infosys', 'Embassy'];

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
    const id = setInterval(next, 7000);
    return () => clearInterval(id);
  }, [next]);

  const t = testimonials[current]!;

  return (
    <section ref={sectionRef} className="relative py-28 sm:py-36 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />

      {/* Decorative gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-10 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-600"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            Customer Stories
          </motion.span>

          <h2 className="mt-8 font-display text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            Loved by teams{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-emerald-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                everywhere
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-2 left-0 right-0 h-3 bg-emerald-100/70 -z-0 origin-left rounded-full"
              />
            </span>
          </h2>
        </motion.div>

        {/* Testimonial card */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-200/30 via-teal-200/20 to-green-200/30 rounded-[2.5rem] blur-2xl" />

          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100/80 p-10 sm:p-14">
            {/* Quote icon */}
            <div className="absolute -top-5 left-10 sm:left-14">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/30"
              >
                <Quote className="w-6 h-6 text-white" />
              </motion.div>
            </div>

            {/* Highlight badge */}
            <div className="absolute top-6 right-6 sm:top-10 sm:right-10">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100"
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-700">{t.highlight}</span>
              </motion.div>
            </div>

            {/* Quote text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="pt-6"
              >
                <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed text-gray-900 font-display">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </motion.div>
            </AnimatePresence>

            {/* Rating and author */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
              >
                {/* Author */}
                <div className="flex items-center gap-5">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-30 blur" />
                    <div className="relative w-16 h-16 rounded-full overflow-hidden ring-3 ring-white shadow-xl">
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                      />
                    </div>
                  </motion.div>
                  <div>
                    <p className="font-semibold text-lg text-gray-900">{t.name}</p>
                    <p className="text-gray-500 flex items-center gap-2">
                      <span>{t.title}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="text-emerald-600 font-medium">{t.company}</span>
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
                    >
                      <Star
                        className={cn(
                          'w-6 h-6',
                          i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200',
                        )}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={prev}
              className={cn(
                'flex items-center justify-center w-12 h-12 rounded-xl',
                'bg-white/80 backdrop-blur-xl border border-gray-200',
                'text-gray-600 hover:text-gray-900',
                'hover:bg-white hover:border-gray-300 hover:shadow-lg',
                'transition-all duration-300',
              )}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* Progress dots */}
            <div className="flex items-center gap-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    'h-2.5 rounded-full transition-all duration-500',
                    i === current
                      ? 'w-10 bg-gradient-to-r from-emerald-500 to-teal-500'
                      : 'w-2.5 bg-gray-200 hover:bg-gray-300',
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={next}
              className={cn(
                'flex items-center justify-center w-12 h-12 rounded-xl',
                'bg-white/80 backdrop-blur-xl border border-gray-200',
                'text-gray-600 hover:text-gray-900',
                'hover:bg-white hover:border-gray-300 hover:shadow-lg',
                'transition-all duration-300',
              )}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Company logos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 text-center"
        >
          <div className="flex items-center justify-center gap-3 text-sm text-gray-500 mb-8">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span>Join 500+ organizations creating healthier workspaces</span>
          </div>

          {/* Animated logo marquee effect */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {companyLogos.map((name, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.05, duration: 0.5 }}
                className="text-sm font-bold text-gray-300 hover:text-emerald-500/70 transition-colors duration-300 cursor-default tracking-wide"
              >
                {name.toUpperCase()}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
