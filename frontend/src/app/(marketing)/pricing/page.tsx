'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Leaf,
  Minus,
  Phone,
  Sparkles,
} from 'lucide-react';
import {
  RevealBlock,
  SectionTransition,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion/section-transition';
import { cn } from '@/lib/utils';

type BillingCycle = 'monthly' | 'annual';

interface PricingPlan {
  name: string;
  subtitle: string;
  description: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  featured?: boolean;
  ctaLabel: string;
  ctaHref: string;
  notes?: string;
  features: string[];
}

interface ComparisonRow {
  feature: string;
  starter: string | boolean;
  growth: string | boolean;
  enterprise: string | boolean;
}

const plans: PricingPlan[] = [
  {
    name: 'Starter',
    subtitle: 'For single-site teams',
    description: 'Launch with reliable maintenance workflows and health tracking in one location.',
    monthlyPrice: 24999,
    annualPrice: 19999,
    ctaLabel: 'Start Starter Plan',
    ctaHref: '/register',
    notes: 'Best for up to 75 active plants',
    features: [
      'Up to 75 plants under active care',
      'Weekly technician service rhythm',
      'Basic health dashboard and alerts',
      'Monthly client service summary',
      'Email support during business hours',
    ],
  },
  {
    name: 'Growth',
    subtitle: 'For scaling operations',
    description: 'Scale across sites with deeper analytics, stronger SLAs, and partner coordination.',
    monthlyPrice: 54999,
    annualPrice: 44999,
    featured: true,
    ctaLabel: 'Choose Growth',
    ctaHref: '/register',
    notes: 'Most selected by multi-location teams',
    features: [
      'Up to 350 plants across multiple sites',
      'Advanced maintenance SLA monitoring',
      'Role-based dashboards for all teams',
      'Quarterly ESG impact reporting',
      'Priority support and onboarding guidance',
    ],
  },
  {
    name: 'Enterprise',
    subtitle: 'For complex portfolios',
    description: 'Custom operating model for large estates, distributed teams, and strict compliance needs.',
    monthlyPrice: null,
    annualPrice: null,
    ctaLabel: 'Talk to Sales',
    ctaHref: '/contact',
    notes: 'Custom scopes, integrations, and governance',
    features: [
      'Unlimited plant and site capacity',
      'Dedicated account and solution architect',
      'Custom API and data integration support',
      'Executive reporting and audit trails',
      'Contracted SLAs with response guarantees',
    ],
  },
];

const comparisonRows: ComparisonRow[] = [
  { feature: 'Plant Capacity', starter: 'Up to 75', growth: 'Up to 350', enterprise: 'Unlimited' },
  { feature: 'Locations', starter: '1 site', growth: 'Up to 8 sites', enterprise: 'Unlimited' },
  { feature: 'Predictive Health Alerts', starter: true, growth: true, enterprise: true },
  { feature: 'ESG Reporting', starter: false, growth: true, enterprise: true },
  { feature: 'Custom Integrations', starter: false, growth: false, enterprise: true },
  { feature: 'Dedicated Success Team', starter: false, growth: true, enterprise: true },
  { feature: 'Support Coverage', starter: 'Email', growth: 'Priority', enterprise: '24/7 + phone' },
  { feature: 'Quarterly Business Reviews', starter: false, growth: true, enterprise: true },
];

const pricingFaqs = [
  {
    question: 'Can I move between plans later?',
    answer:
      'Yes. You can upgrade anytime, and downgrades apply at the next billing cycle so operations stay uninterrupted.',
  },
  {
    question: 'What does annual billing include?',
    answer:
      'Annual billing locks a lower effective monthly rate and includes strategic planning checkpoints each quarter.',
  },
  {
    question: 'Do you support procurement workflows?',
    answer:
      'For Growth and Enterprise plans we support invoicing, purchase orders, and procurement documentation.',
  },
  {
    question: 'How quickly can onboarding start?',
    answer:
      'Starter can begin in days. Growth and Enterprise onboarding typically starts within 1-2 weeks after scope confirmation.',
  },
];

function formatPrice(value: number | null): string {
  if (value === null) return 'Custom';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function ComparisonCell({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-600" />
    ) : (
      <Minus className="mx-auto h-4 w-4 text-slate-300" />
    );
  }

  return <span className="text-sm font-medium text-slate-700">{value}</span>;
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <div className="relative overflow-hidden pb-20 sm:pb-24">
      <SectionTransition className="relative isolate overflow-hidden border-b border-emerald-100/80 bg-[#f2faf4] pb-14 pt-28 sm:pb-18 sm:pt-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-14rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-emerald-400/18 blur-[130px]" />
          <div className="absolute -left-12 top-28 h-72 w-72 rounded-full bg-cyan-300/16 blur-[100px]" />
          <div className="absolute right-[-5rem] bottom-0 h-72 w-72 rounded-full bg-lime-300/18 blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(5,150,105,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(5,150,105,0.06)_1px,transparent_1px)] bg-[size:50px_50px] opacity-45" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <RevealBlock className="mx-auto max-w-4xl text-center" delay={0.04}>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              <Sparkles className="h-4 w-4" />
              Pricing
            </p>
            <h1 className="mt-5 font-display text-[clamp(2.4rem,6vw,4.8rem)] leading-[1.02] tracking-[-0.04em] text-slate-950">
              Flexible plans for every
              <span className="block bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                stage of green operations
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-700 sm:text-xl">
              Start with a focused deployment or scale across a distributed portfolio. Every plan includes live operational visibility and service accountability.
            </p>
          </RevealBlock>

          <RevealBlock className="mt-8 flex items-center justify-center" delay={0.1}>
            <div className="inline-flex rounded-full border border-slate-200 bg-white/80 p-1 shadow-lg shadow-emerald-900/5">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={cn(
                  'rounded-full px-5 py-2 text-sm font-semibold transition-colors',
                  billingCycle === 'monthly' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:text-slate-900',
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={cn(
                  'rounded-full px-5 py-2 text-sm font-semibold transition-colors',
                  billingCycle === 'annual' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:text-slate-900',
                )}
              >
                Annual (save up to 20%)
              </button>
            </div>
          </RevealBlock>
        </div>
      </SectionTransition>

      <SectionTransition className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-12 lg:py-18" delay={0.03}>
        <StaggerContainer className="grid gap-5 lg:grid-cols-3" staggerChildren={0.1}>
          {plans.map((plan) => {
            const effectivePrice = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
            return (
              <StaggerItem key={plan.name}>
                <article
                  className={cn(
                    'h-full rounded-[1.8rem] border p-6 shadow-xl shadow-emerald-900/5 transition-transform duration-300 hover:-translate-y-1',
                    plan.featured
                      ? 'border-emerald-300 bg-slate-950 text-white'
                      : 'border-slate-200 bg-white/85 text-slate-900',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={cn('text-xs font-semibold uppercase tracking-[0.16em]', plan.featured ? 'text-emerald-200' : 'text-emerald-700')}>
                        {plan.subtitle}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight">{plan.name}</h2>
                    </div>
                    {plan.featured && (
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <p className={cn('mt-4 text-sm leading-relaxed', plan.featured ? 'text-slate-200' : 'text-slate-600')}>
                    {plan.description}
                  </p>

                  <div className="mt-6">
                    <p className="text-[clamp(2rem,4vw,2.8rem)] font-semibold tracking-tight">
                      {formatPrice(effectivePrice)}
                      {effectivePrice !== null && (
                        <span className={cn('ml-1 text-sm font-medium', plan.featured ? 'text-slate-300' : 'text-slate-500')}>
                          /month
                        </span>
                      )}
                    </p>
                    <p className={cn('mt-1 text-xs font-medium uppercase tracking-[0.12em]', plan.featured ? 'text-slate-300' : 'text-slate-500')}>
                      {billingCycle === 'annual'
                        ? 'Billed annually'
                        : 'Billed monthly'}
                    </p>
                  </div>

                  {plan.notes && (
                    <p className={cn('mt-4 rounded-2xl px-3 py-2 text-xs', plan.featured ? 'bg-white/10 text-emerald-100' : 'bg-emerald-50 text-emerald-700')}>
                      {plan.notes}
                    </p>
                  )}

                  <ul className="mt-5 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className={cn('mt-0.5 h-4 w-4 shrink-0', plan.featured ? 'text-emerald-300' : 'text-emerald-600')} />
                        <span className={plan.featured ? 'text-slate-100' : 'text-slate-700'}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.ctaHref}
                    className={cn(
                      'group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors duration-300',
                      plan.featured
                        ? 'bg-white text-slate-900 hover:bg-slate-100'
                        : 'bg-slate-950 text-white hover:bg-slate-800',
                    )}
                  >
                    {plan.ctaLabel}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </SectionTransition>

      <SectionTransition className="border-y border-emerald-100/80 bg-[#f7fcf8] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <RevealBlock>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Detailed Comparison</p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.9rem)] leading-[1.08] tracking-[-0.03em] text-slate-950">
              Choose the operating scope that matches your ambition
            </h2>
          </RevealBlock>

          <RevealBlock className="mt-8 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-lg shadow-emerald-900/5" delay={0.08}>
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">Feature</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">Starter</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">Growth</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonRows.map((row, index) => (
                  <tr key={row.feature} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      <ComparisonCell value={row.starter} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <ComparisonCell value={row.growth} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <ComparisonCell value={row.enterprise} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </RevealBlock>
        </div>
      </SectionTransition>

      <SectionTransition className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <RevealBlock>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">FAQ</p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.08] tracking-[-0.03em] text-slate-950">
              Common pricing and onboarding questions
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Need a custom scope, procurement support, or integration details? Our team can shape a pricing model around your operating reality.
            </p>

            <div className="mt-8 rounded-[1.8rem] border border-slate-200 bg-slate-950 px-6 py-7 text-white">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100">
                <Leaf className="h-3.5 w-3.5" />
                Enterprise Support
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">Need a tailored deployment model?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Speak with our solutions team for custom rollout plans, SLA structures, and multi-region operating frameworks.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
              >
                <Phone className="h-4 w-4" />
                Contact sales
              </Link>
            </div>
          </RevealBlock>

          <StaggerContainer className="rounded-[1.8rem] border border-slate-200 bg-white/90 p-5 shadow-lg shadow-emerald-900/5 sm:p-6" staggerChildren={0.08}>
            {pricingFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <StaggerItem key={faq.question}>
                  <div className="border-b border-slate-200/80 py-2 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between gap-3 py-3 text-left"
                    >
                      <span className="text-sm font-semibold text-slate-900">{faq.question}</span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0 text-slate-400"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pb-3 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </SectionTransition>
    </div>
  );
}
