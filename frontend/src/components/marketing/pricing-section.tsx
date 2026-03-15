'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Pricing data                                                              */
/* -------------------------------------------------------------------------- */

const plans = [
  {
    name: 'Starter',
    description: 'For small offices getting started with green infrastructure.',
    monthlyPrice: 4999,
    features: [
      'Up to 50 plants',
      'Basic health monitoring',
      'Monthly maintenance visits',
      'Email support',
    ],
    cta: 'Start free trial',
    href: '/register',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'For growing companies that need comprehensive plant management.',
    monthlyPrice: 14999,
    features: [
      'Up to 200 plants',
      'AI-powered health monitoring',
      'Weekly maintenance visits',
      'Priority support',
      'ESG reporting dashboard',
    ],
    cta: 'Start free trial',
    href: '/register',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with multi-site greenery programs.',
    monthlyPrice: 49999,
    features: [
      'Unlimited plants',
      'Advanced AI analytics',
      'Daily maintenance',
      'Dedicated account manager',
      'Custom ESG reporting',
      'API access & integrations',
    ],
    cta: 'Contact sales',
    href: '/contact',
    popular: false,
  },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN').format(price);
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
  const displayPrice = isAnnual ? Math.round(plan.monthlyPrice * 0.8) : plan.monthlyPrice;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative flex flex-col rounded-2xl p-8',
        'transition-all duration-300',
        plan.popular
          ? 'bg-gray-900 text-white shadow-2xl shadow-gray-900/20'
          : 'bg-white border border-gray-200/80 shadow-sm hover:shadow-lg hover:shadow-black/[0.04]',
      )}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute -top-3.5 left-8">
          <span className="inline-block rounded-full bg-emerald-500 px-3.5 py-1 text-xs font-semibold text-white">
            Most popular
          </span>
        </div>
      )}

      {/* Plan name & description */}
      <h3 className={cn(
        'text-lg font-semibold',
        plan.popular ? 'text-white' : 'text-gray-900',
      )}>
        {plan.name}
      </h3>
      <p className={cn(
        'mt-2 text-sm',
        plan.popular ? 'text-gray-400' : 'text-gray-500',
      )}>
        {plan.description}
      </p>

      {/* Price */}
      <div className="mt-6 flex items-baseline gap-1">
        <span className={cn(
          'text-sm font-medium',
          plan.popular ? 'text-gray-400' : 'text-gray-500',
        )}>
          ₹
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={displayPrice}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className={cn(
              'text-4xl font-bold tracking-tight',
              plan.popular ? 'text-white' : 'text-gray-900',
            )}
          >
            {formatPrice(displayPrice)}
          </motion.span>
        </AnimatePresence>
        <span className={cn(
          'text-sm font-medium',
          plan.popular ? 'text-gray-400' : 'text-gray-500',
        )}>
          /mo
        </span>
      </div>
      {isAnnual && (
        <p className={cn(
          'mt-1 text-xs font-medium',
          plan.popular ? 'text-emerald-400' : 'text-emerald-600',
        )}>
          Save 20% with annual billing
        </p>
      )}

      {/* Divider */}
      <div className={cn(
        'my-6 h-px',
        plan.popular ? 'bg-white/10' : 'bg-gray-100',
      )} />

      {/* Features */}
      <ul className="flex flex-col gap-3 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <div className={cn(
              'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
              plan.popular
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-gray-100 text-gray-500',
            )}>
              <Check className="h-3 w-3" />
            </div>
            <span className={cn(
              'text-sm',
              plan.popular ? 'text-gray-300' : 'text-gray-600',
            )}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={plan.href}
        className={cn(
          'mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-200',
          plan.popular
            ? 'bg-white text-gray-900 hover:bg-gray-100'
            : 'bg-gray-900 text-white hover:bg-gray-800',
        )}
      >
        {plan.cta}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pricing Section                                                           */
/* -------------------------------------------------------------------------- */

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '-80px' });

  return (
    <section className="relative overflow-hidden bg-gray-50/60 py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Pricing
          </p>
          <h2 className="mt-3 text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.1] tracking-tight text-gray-900">
            Transparent pricing,
            <br className="hidden sm:block" />
            no hidden fees
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-500">
            Every plan includes a 14-day free trial. No credit card required.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white p-1.5">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
                !isAnnual
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-700',
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
                isAnnual
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:text-gray-700',
              )}
            >
              Annual
              <span className="ml-1.5 text-xs font-semibold text-emerald-500">
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} isAnnual={isAnnual} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
