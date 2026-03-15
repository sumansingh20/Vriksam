'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronDown, ArrowRight, Phone } from 'lucide-react';
import { PricingSection } from '@/components/marketing/pricing-section';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  FAQ Data                                                                   */
/* -------------------------------------------------------------------------- */

const billingFaqs = [
  {
    question: 'Can I change my plan at any time?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. When upgrading, the new rate takes effect immediately with a prorated charge. Downgrades take effect at the start of your next billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards, UPI, net banking, and bank transfers. For Enterprise plans, we also support purchase orders and custom invoicing terms.',
  },
  {
    question: 'Is there a free trial available?',
    answer: 'All plans include a 14-day free trial with full access. No credit card required. Cancel anytime during the trial with zero charges.',
  },
  {
    question: 'How does annual billing work?',
    answer: 'Annual billing gives you a 20% discount compared to monthly pricing. You are billed once per year. You can switch to monthly billing when your annual term ends.',
  },
  {
    question: 'What is included in the Enterprise plan?',
    answer: 'Unlimited plants, advanced AI analytics, daily maintenance, a dedicated account manager, custom ESG reporting, full API access, SLA guarantees, and priority onboarding support.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee for all new subscriptions. After 30 days, refunds are prorated based on usage.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Comparison Matrix                                                          */
/* -------------------------------------------------------------------------- */

interface FeatureRow {
  feature: string;
  starter: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
}

const comparisonFeatures: FeatureRow[] = [
  { feature: 'Number of Plants', starter: 'Up to 50', professional: 'Up to 200', enterprise: 'Unlimited' },
  { feature: 'AI Health Monitoring', starter: false, professional: true, enterprise: true },
  { feature: 'Maintenance Frequency', starter: 'Monthly', professional: 'Weekly', enterprise: 'Daily' },
  { feature: 'ESG Reports', starter: false, professional: true, enterprise: true },
  { feature: 'Custom Reporting', starter: false, professional: false, enterprise: true },
  { feature: 'API Access', starter: false, professional: false, enterprise: true },
  { feature: 'Dedicated Manager', starter: false, professional: false, enterprise: true },
  { feature: 'Support', starter: 'Email', professional: 'Priority', enterprise: '24/7 Phone' },
  { feature: 'Locations', starter: '1', professional: 'Up to 5', enterprise: 'Unlimited' },
  { feature: 'Technician Visits', starter: '1/month', professional: '4/month', enterprise: 'Daily' },
  { feature: 'Plant Replacement', starter: false, professional: true, enterprise: true },
  { feature: 'Custom Integrations', starter: false, professional: false, enterprise: true },
];

/* -------------------------------------------------------------------------- */
/*  FAQ Item                                                                   */
/* -------------------------------------------------------------------------- */

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="border-b border-gray-200 last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-4 text-sm font-medium text-gray-900">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-gray-500">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Cell renderer                                                              */
/* -------------------------------------------------------------------------- */

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="mx-auto h-4 w-4 text-emerald-600" />
    ) : (
      <X className="mx-auto h-4 w-4 text-gray-300" />
    );
  }
  return <span className="text-sm text-gray-700">{value}</span>;
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PricingPage() {
  const tableRef = useRef<HTMLDivElement>(null);
  const isTableInView = useInView(tableRef, { once: true, margin: '-80px' });

  return (
    <div>
      {/* Pricing cards (shared component) */}
      <PricingSection />

      {/* Comparison table */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={tableRef}
            initial={{ opacity: 0, y: 24 }}
            animate={isTableInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
                Compare
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                Feature comparison
              </h2>
              <p className="mt-3 text-gray-500">
                See exactly what each plan includes.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-900">
                      Feature
                    </th>
                    <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-900">
                      Starter
                    </th>
                    <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-900">
                      Professional
                    </th>
                    <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-900">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {comparisonFeatures.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={cn(
                        'transition-colors hover:bg-gray-50',
                        i % 2 === 0 && 'bg-gray-50/50',
                      )}
                    >
                      <td className="px-6 py-3 text-sm text-gray-700">{row.feature}</td>
                      <td className="px-6 py-3 text-center">
                        <FeatureCell value={row.starter} />
                      </td>
                      <td className="px-6 py-3 text-center">
                        <FeatureCell value={row.professional} />
                      </td>
                      <td className="px-6 py-3 text-center">
                        <FeatureCell value={row.enterprise} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
              Common questions
            </h2>
          </div>

          <div>
            {billingFaqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gray-900 px-8 py-14 text-center sm:px-16">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Need a custom plan?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-gray-400">
              For large organizations with unique requirements, we create
              tailored solutions around your green infrastructure goals.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100"
              >
                <Phone className="h-4 w-4" />
                Contact sales
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex items-center rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
              >
                View case studies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
