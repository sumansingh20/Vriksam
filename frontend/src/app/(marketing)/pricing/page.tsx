'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  ChevronDown,
  ArrowRight,
  Phone,
  HelpCircle,
} from 'lucide-react';
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
    answer: 'Absolutely! All plans include a 14-day free trial with full access to all features. No credit card required to start. You can cancel anytime during the trial with zero charges.',
  },
  {
    question: 'How does annual billing work?',
    answer: 'Annual billing gives you a 20% discount compared to monthly pricing. You are billed once per year and receive a single invoice. You can switch to monthly billing when your annual term ends.',
  },
  {
    question: 'What is included in the Enterprise plan?',
    answer: 'The Enterprise plan includes unlimited plants, advanced AI analytics, daily maintenance visits, a dedicated account manager, custom ESG reporting, full API access, SLA guarantees, and priority onboarding support.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee for all new subscriptions. If you are not satisfied within the first 30 days, contact us for a full refund. After 30 days, refunds are prorated based on usage.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Comparison Features Matrix                                                 */
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
  { feature: 'Plant Replacement Guarantee', starter: false, professional: true, enterprise: true },
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
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="rounded-2xl border border-gray-200/60 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <span className="pr-4 text-sm font-semibold text-gray-900">{question}</span>
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
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 px-5 pb-5 pt-4">
              <p className="text-sm leading-relaxed text-gray-600">{answer}</p>
            </div>
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
      <Check className="mx-auto h-5 w-5 text-emerald-500" />
    ) : (
      <X className="mx-auto h-5 w-5 text-gray-300" />
    );
  }
  return <span className="text-sm font-medium text-gray-700">{value}</span>;
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function PricingPage() {
  const tableRef = useRef<HTMLDivElement>(null);
  const isTableInView = useInView(tableRef, { once: true, margin: '-80px' });

  return (
    <div className="relative overflow-hidden">
      {/* Pricing Section (imported component) */}
      <PricingSection />

      {/* ================================================================== */}
      {/*  Comparison Table                                                   */}
      {/* ================================================================== */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={tableRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isTableInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Compare{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                  plans
                </span>
              </h2>
              <p className="mt-4 text-gray-600">
                A detailed look at what each plan includes.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200/60 bg-white shadow-lg">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Starter
                    </th>
                    <th className="bg-emerald-50/50 px-6 py-4 text-center text-sm font-semibold text-emerald-700">
                      Professional
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {comparisonFeatures.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={cn(
                        'transition-colors hover:bg-gray-50/50',
                        i % 2 === 0 && 'bg-gray-50/30',
                      )}
                    >
                      <td className="px-6 py-3.5 text-sm text-gray-700">{row.feature}</td>
                      <td className="px-6 py-3.5 text-center">
                        <FeatureCell value={row.starter} />
                      </td>
                      <td className="bg-emerald-50/30 px-6 py-3.5 text-center">
                        <FeatureCell value={row.professional} />
                      </td>
                      <td className="px-6 py-3.5 text-center">
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

      {/* ================================================================== */}
      {/*  Billing FAQ                                                        */}
      {/* ================================================================== */}
      <section className="bg-gradient-to-b from-white via-emerald-50/30 to-white py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="mx-auto mb-4 inline-flex rounded-xl bg-emerald-500/10 p-3">
              <HelpCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Billing FAQs
            </h2>
            <p className="mt-4 text-gray-600">
              Common questions about plans, billing, and payments.
            </p>
          </motion.div>

          <div className="space-y-3">
            {billingFaqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  Enterprise CTA                                                     */}
      {/* ================================================================== */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-8 py-16 text-center shadow-2xl shadow-emerald-500/20 sm:px-16"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Need a custom plan?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-100">
                For large organizations with unique requirements, we create tailored solutions
                that fit your exact needs. Let us design a plan around your green infrastructure goals.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="group flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-emerald-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Phone className="h-4 w-4" />
                  Contact Sales
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/case-studies"
                  className="rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  View Case Studies
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
