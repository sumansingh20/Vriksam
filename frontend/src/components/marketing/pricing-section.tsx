'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
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
      'Monthly maintenance',
      'Email support',
      'Simple dashboards',
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
      'AI health monitoring',
      'Weekly maintenance',
      'Priority support',
      'ESG reporting',
      'Team collaboration',
      'API access',
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
      'Advanced analytics',
      'Daily maintenance',
      'Dedicated manager',
      'Custom reporting',
      'Full API access',
      'SLA guarantee',
      'On-site training',
    ],
    cta: 'Contact sales',
    href: '/contact',
    popular: false,
  },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN').format(price);
}

/* -------------------------------------------------------------------------- */
/*  Pricing Card                                                              */
/* -------------------------------------------------------------------------- */

function PricingCard({
  plan,
  isAnnual,
  index,
  isInView,
}: {
  plan: (typeof plans)[number];
  isAnnual: boolean;
  index: number;
  isInView: boolean;
}) {
  const displayPrice = isAnnual ? Math.round(plan.monthlyPrice * 0.8) : plan.monthlyPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        'group relative',
        plan.popular && 'lg:-mt-4 lg:mb-4',
      )}
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(
          'relative h-full rounded-3xl p-8',
          'transition-all duration-300',
          plan.popular
            ? 'bg-gray-900 text-white shadow-2xl shadow-gray-900/20'
            : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg',
        )}
      >
        {/* Popular badge */}
        {plan.popular && (
          <div className="absolute -top-3.5 left-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-emerald-500/30">
              <Sparkles className="w-3 h-3" />
              Most Popular
            </span>
          </div>
        )}

        {/* Plan header */}
        <div className="mb-6">
          <h3 className={cn(
            'text-xl font-bold font-display',
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
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className={cn(
              'text-lg font-medium',
              plan.popular ? 'text-gray-400' : 'text-gray-400',
            )}>
              ₹
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={displayPrice}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'text-5xl font-bold tracking-tight font-display',
                  plan.popular ? 'text-white' : 'text-gray-900',
                )}
              >
                {formatPrice(displayPrice)}
              </motion.span>
            </AnimatePresence>
            <span className={cn(
              'text-sm font-medium ml-1',
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
                'mt-1 text-xs font-semibold',
                plan.popular ? 'text-emerald-400' : 'text-emerald-600',
              )}
            >
              Save 20% with annual billing
            </motion.p>
          )}
        </div>

        {/* Divider */}
        <div className={cn(
          'h-px mb-6',
          plan.popular ? 'bg-white/10' : 'bg-gray-100',
        )} />

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, i) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.3,
                delay: index * 0.1 + i * 0.05 + 0.3,
              }}
              className="flex items-center gap-3"
            >
              <div className={cn(
                'flex items-center justify-center w-5 h-5 rounded-full shrink-0',
                plan.popular ? 'bg-emerald-500/20' : 'bg-emerald-50',
              )}>
                <Check className={cn(
                  'w-3 h-3',
                  plan.popular ? 'text-emerald-400' : 'text-emerald-600',
                )} strokeWidth={2.5} />
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
        <Link href={plan.href} className="block">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold',
              'transition-all duration-300',
              plan.popular
                ? 'bg-white text-gray-900 hover:bg-gray-100'
                : 'bg-gray-900 text-white hover:bg-gray-800',
            )}
          >
            {plan.cta}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pricing Section                                                           */
/* -------------------------------------------------------------------------- */

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/30 to-white" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-sm font-medium text-emerald-700">
            Pricing
          </span>
          <h2 className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            Simple, transparent{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              pricing
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
            Start with a 14-day free trial. No credit card required.
          </p>

          {/* Toggle */}
          <div className="mt-10 inline-flex items-center p-1 rounded-full bg-gray-100 border border-gray-200">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                'relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300',
                !isAnnual ? 'text-white' : 'text-gray-600 hover:text-gray-900',
              )}
            >
              {!isAnnual && (
                <motion.div
                  layoutId="pricing-toggle"
                  className="absolute inset-0 bg-gray-900 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">Monthly</span>
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                'relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300',
                isAnnual ? 'text-white' : 'text-gray-600 hover:text-gray-900',
              )}
            >
              {isAnnual && (
                <motion.div
                  layoutId="pricing-toggle"
                  className="absolute inset-0 bg-gray-900 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                Annual
                <span className={cn(
                  'px-1.5 py-0.5 text-[10px] font-bold rounded-full',
                  isAnnual ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700',
                )}>
                  -20%
                </span>
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan, i) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              isAnnual={isAnnual}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>

        {/* FAQ link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 text-center"
        >
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Have questions? Read our FAQ
          </Link>
          <p className="mt-4 text-sm text-gray-400">
            Prices in INR. All plans include setup, onboarding, and training.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
