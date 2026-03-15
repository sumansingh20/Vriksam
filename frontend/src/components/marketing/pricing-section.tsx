'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check, Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Pricing data                                                              */
/* -------------------------------------------------------------------------- */

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for small offices and startups getting started with greenery.',
    monthlyPrice: 4999,
    features: [
      'Up to 50 plants',
      'Basic monitoring',
      'Monthly maintenance',
      'Email support',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'Ideal for growing companies that need comprehensive plant management.',
    monthlyPrice: 14999,
    features: [
      'Up to 200 plants',
      'AI health monitoring',
      'Weekly maintenance',
      'Priority support',
      'ESG reports',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with complex, multi-site greenery needs.',
    monthlyPrice: 49999,
    features: [
      'Unlimited plants',
      'Advanced AI analytics',
      'Daily maintenance',
      'Dedicated manager',
      'Custom ESG reporting',
      'API access',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

/* -------------------------------------------------------------------------- */
/*  Price formatter                                                           */
/* -------------------------------------------------------------------------- */

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN').format(price);
}

/* -------------------------------------------------------------------------- */
/*  Animated price display                                                    */
/* -------------------------------------------------------------------------- */

function AnimatedPrice({ price, isAnnual }: { price: number; isAnnual: boolean }) {
  const displayPrice = isAnnual ? Math.round(price * 0.8) : price;

  return (
    <div className="flex items-baseline gap-1">
      <span className="text-sm font-medium text-gray-500">&#8377;</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={displayPrice}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
        >
          {formatPrice(displayPrice)}
        </motion.span>
      </AnimatePresence>
      <span className="text-sm font-medium text-gray-500">/mo</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pricing card                                                              */
/* -------------------------------------------------------------------------- */

function PricingCard({
  plan,
  isAnnual,
  index,
}: {
  plan: (typeof plans)[number];
  isAnnual: boolean;
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
      className={cn(
        'relative flex flex-col rounded-3xl p-8',
        plan.popular
          ? 'border-2 border-emerald-400 bg-white shadow-2xl shadow-emerald-500/10'
          : 'border border-gray-200 bg-white shadow-lg shadow-black/[0.03]',
        'transition-all duration-300 hover:-translate-y-1',
        plan.popular && 'hover:shadow-2xl hover:shadow-emerald-500/15',
      )}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25">
            <Star className="h-3.5 w-3.5 fill-current" />
            Most Popular
          </span>
        </div>
      )}

      {/* Glow effect for popular */}
      {plan.popular && (
        <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-b from-emerald-400/20 via-transparent to-emerald-400/10 opacity-60" />
      )}

      <div className="relative">
        {/* Plan name & description */}
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        <p className="mt-2 text-sm text-gray-500">{plan.description}</p>

        {/* Price */}
        <div className="mt-6">
          <AnimatedPrice price={plan.monthlyPrice} isAnnual={isAnnual} />
          {isAnnual && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-1 text-sm font-medium text-emerald-600"
            >
              Save 20% with annual billing
            </motion.p>
          )}
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-gray-100" />

        {/* Features */}
        <ul className="flex flex-col gap-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                  plan.popular
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-gray-100 text-gray-600',
                )}
              >
                <Check className="h-3 w-3" />
              </div>
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-200',
            plan.popular
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
              : 'border border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:text-emerald-700',
          )}
        >
          {plan.cta}
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pricing Section                                                           */
/* -------------------------------------------------------------------------- */

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-100px' });

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/30 to-white" />
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />

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
            Pricing
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Simple,{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
              transparent
            </span>{' '}
            pricing
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Choose the plan that fits your greenery needs. All plans include a 14-day
            free trial.
          </p>

          {/* Toggle */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span
              className={cn(
                'text-sm font-medium transition-colors',
                !isAnnual ? 'text-gray-900' : 'text-gray-400',
              )}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={cn(
                'relative h-7 w-12 rounded-full transition-colors duration-300',
                isAnnual ? 'bg-emerald-500' : 'bg-gray-300',
              )}
              aria-label="Toggle annual billing"
            >
              <motion.div
                animate={{ x: isAnnual ? 22 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="h-5 w-5 rounded-full bg-white shadow-sm"
                style={{ position: 'absolute', top: '4px' }}
              />
            </button>
            <span
              className={cn(
                'text-sm font-medium transition-colors',
                isAnnual ? 'text-gray-900' : 'text-gray-400',
              )}
            >
              Annual
              <span className="ml-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                -20%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} isAnnual={isAnnual} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
