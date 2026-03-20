'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Sparkles, HelpCircle, Zap } from 'lucide-react';
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
    gradient: 'from-gray-100 to-gray-50',
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
    gradient: 'from-emerald-600 to-teal-600',
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
    gradient: 'from-gray-900 to-gray-800',
  },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN').format(price);
}

/* -------------------------------------------------------------------------- */
/*  Premium Pricing Card                                                       */
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
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        'group relative',
        plan.popular && 'lg:-mt-6 lg:mb-6 z-10',
      )}
    >
      {/* Glow effect for popular plan */}
      {plan.popular && (
        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 via-teal-500/20 to-green-500/30 rounded-[2rem] blur-2xl opacity-60" />
      )}

      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(
          'relative h-full rounded-3xl p-8 lg:p-10',
          'transition-all duration-500',
          plan.popular
            ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-2xl shadow-gray-900/30 ring-1 ring-white/10'
            : 'bg-white/80 backdrop-blur-xl border border-gray-200/80 hover:border-gray-300 hover:shadow-2xl',
        )}
      >
        {/* Popular badge */}
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-xl shadow-emerald-500/30"
            >
              <Sparkles className="w-4 h-4" />
              Most Popular
            </motion.span>
          </div>
        )}

        {/* Plan header */}
        <div className={cn('mb-8', plan.popular && 'pt-4')}>
          <h3 className={cn(
            'text-2xl font-bold font-display',
            plan.popular ? 'text-white' : 'text-gray-900',
          )}>
            {plan.name}
          </h3>
          <p className={cn(
            'mt-3 text-sm leading-relaxed',
            plan.popular ? 'text-gray-400' : 'text-gray-500',
          )}>
            {plan.description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-8">
          <div className="flex items-baseline gap-1">
            <span className={cn(
              'text-xl font-medium',
              plan.popular ? 'text-gray-400' : 'text-gray-400',
            )}>
              ₹
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={displayPrice}
                initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'text-5xl lg:text-6xl font-bold tracking-tight font-display',
                  plan.popular ? 'text-white' : 'text-gray-900',
                )}
              >
                {formatPrice(displayPrice)}
              </motion.span>
            </AnimatePresence>
            <span className={cn(
              'text-sm font-medium ml-2',
              plan.popular ? 'text-gray-500' : 'text-gray-400',
            )}>
              /month
            </span>
          </div>
          <AnimatePresence>
            {isAnnual && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  'mt-2 text-sm font-semibold',
                  plan.popular ? 'text-emerald-400' : 'text-emerald-600',
                )}
              >
                Save 20% with annual billing
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className={cn(
          'h-px mb-8',
          plan.popular ? 'bg-white/10' : 'bg-gray-100',
        )} />

        {/* Features */}
        <ul className="space-y-4 mb-10">
          {plan.features.map((feature, i) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.3,
                delay: index * 0.12 + i * 0.05 + 0.4,
              }}
              className="flex items-center gap-3"
            >
              <div className={cn(
                'flex items-center justify-center w-6 h-6 rounded-full shrink-0',
                plan.popular ? 'bg-emerald-500/20' : 'bg-emerald-50',
              )}>
                <Check className={cn(
                  'w-3.5 h-3.5',
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
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'w-full flex items-center justify-center gap-2.5 rounded-xl py-4 text-sm font-semibold',
              'transition-all duration-300',
              plan.popular
                ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg'
                : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/10',
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
    <section ref={sectionRef} className="relative py-28 sm:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />

      {/* Decorative orbs */}
      <div className="absolute top-20 -left-20 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
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
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-sm font-medium text-emerald-700"
          >
            <Zap className="w-4 h-4" />
            Pricing
          </motion.span>

          <h2 className="mt-8 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            Simple, transparent{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-emerald-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                pricing
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-2 left-0 right-0 h-3 bg-emerald-100/70 -z-0 origin-left rounded-full"
              />
            </span>
          </h2>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-xl mx-auto">
            Start with a 14-day free trial. No credit card required.
          </p>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 inline-flex items-center p-1.5 rounded-full bg-gray-100/80 backdrop-blur-sm border border-gray-200/50"
          >
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                'relative px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300',
                !isAnnual ? 'text-white' : 'text-gray-600 hover:text-gray-900',
              )}
            >
              {!isAnnual && (
                <motion.div
                  layoutId="pricing-toggle"
                  className="absolute inset-0 bg-gray-900 rounded-full shadow-lg"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">Monthly</span>
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                'relative px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300',
                isAnnual ? 'text-white' : 'text-gray-600 hover:text-gray-900',
              )}
            >
              {isAnnual && (
                <motion.div
                  layoutId="pricing-toggle"
                  className="absolute inset-0 bg-gray-900 rounded-full shadow-lg"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                Annual
                <span className={cn(
                  'px-2 py-0.5 text-xs font-bold rounded-full transition-colors duration-300',
                  isAnnual ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700',
                )}>
                  -20%
                </span>
              </span>
            </button>
          </motion.div>
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
          transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 text-center"
        >
          <Link
            href="/faq"
            className="inline-flex items-center gap-2.5 text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-300"
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
