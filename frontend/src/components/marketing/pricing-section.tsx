'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
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
      'Team collaboration tools',
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
      whileHover={{ y: plan.popular ? -6 : -3 }}
      className={cn(
        'relative flex flex-col rounded-3xl p-8',
        'transition-all duration-300',
        plan.popular
          ? 'bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white shadow-2xl shadow-emerald-900/20 ring-1 ring-white/10'
          : 'bg-white border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.08)] hover:border-emerald-200/60',
      )}
    >
      {/* Popular card glow effect */}
      {plan.popular && (
        <>
          <div className="absolute -inset-[1px] -z-10 rounded-3xl bg-gradient-to-b from-emerald-500/30 via-emerald-500/10 to-transparent blur-sm" />
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
        </>
      )}

      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute -top-3.5 left-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-emerald-500/30">
            <Sparkles className="h-3 w-3" />
            Most popular
          </span>
        </div>
      )}

      {/* Plan name & description */}
      <h3 className={cn(
        'text-lg font-bold font-heading',
        plan.popular ? 'text-white' : 'text-gray-900',
      )}>
        {plan.name}
      </h3>
      <p className={cn(
        'mt-2 text-sm leading-relaxed',
        plan.popular ? 'text-gray-400' : 'text-gray-500',
      )}>
        {plan.description}
      </p>

      {/* Price */}
      <div className="mt-8 flex items-baseline gap-1">
        <span className={cn(
          'text-base font-medium',
          plan.popular ? 'text-gray-400' : 'text-gray-400',
        )}>
          ₹
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={displayPrice}
            initial={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
            transition={{ duration: 0.25 }}
            className={cn(
              'text-5xl font-extrabold tracking-tight font-heading',
              plan.popular ? 'text-white' : 'text-gray-900',
            )}
          >
            {formatPrice(displayPrice)}
          </motion.span>
        </AnimatePresence>
        <span className={cn(
          'ml-1 text-sm font-medium',
          plan.popular ? 'text-gray-500' : 'text-gray-400',
        )}>
          /month
        </span>
      </div>
      {isAnnual && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={cn(
            'mt-1.5 text-xs font-semibold',
            plan.popular ? 'text-emerald-400' : 'text-emerald-600',
          )}
        >
          Save 20% with annual billing
        </motion.p>
      )}

      {/* Divider */}
      <div className={cn(
        'my-8 h-px',
        plan.popular
          ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent'
          : 'bg-gradient-to-r from-transparent via-gray-200 to-transparent',
      )} />

      {/* Features */}
      <ul className="flex flex-col gap-3.5 flex-1">
        {plan.features.map((feature, featureIdx) => (
          <motion.li
            key={feature}
            initial={{ opacity: 0, x: -8 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3, delay: index * 0.1 + featureIdx * 0.05 + 0.3 }}
            className="flex items-center gap-3"
          >
            <div className={cn(
              'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
              plan.popular
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-emerald-50 text-emerald-600',
            )}>
              <Check className="h-3 w-3" strokeWidth={2.5} />
            </div>
            <span className={cn(
              'text-sm',
              plan.popular ? 'text-gray-300' : 'text-gray-600',
            )}>
              {feature}
            </span>
          </motion.li>
        ))}
      </ul>

      {/* CTA */}
      <Link href={plan.href}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'mt-10 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-all duration-200',
            plan.popular
              ? 'bg-white text-gray-900 shadow-lg shadow-white/10 hover:bg-gray-50'
              : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20',
          )}
        >
          {plan.cta}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </motion.div>
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
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/80 to-white" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.03),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-700">
            Pricing
          </span>
          <h2 className="mt-6 font-heading text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-tight text-gray-900">
            Transparent pricing,{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
              no hidden fees
            </span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-500">
            Every plan includes a 14-day free trial. No credit card required.
          </p>

          {/* Toggle */}
          <div className="mt-10 inline-flex items-center gap-1 rounded-full border border-gray-200/80 bg-white p-1 shadow-sm">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                'relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-300',
                !isAnnual
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-700',
              )}
            >
              {!isAnnual && (
                <motion.div
                  layoutId="pricing-toggle-pill"
                  className="absolute inset-0 rounded-full bg-gray-900"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">Monthly</span>
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                'relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-300',
                isAnnual
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-700',
              )}
            >
              {isAnnual && (
                <motion.div
                  layoutId="pricing-toggle-pill"
                  className="absolute inset-0 rounded-full bg-gray-900"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                Annual
                <span className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                  isAnnual ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700',
                )}>
                  -20%
                </span>
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {plans.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} isAnnual={isAnnual} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isHeadingInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 text-center text-sm text-gray-400"
        >
          Prices are in INR. All plans include setup, onboarding, and training.
        </motion.p>
      </div>
    </section>
  );
}
