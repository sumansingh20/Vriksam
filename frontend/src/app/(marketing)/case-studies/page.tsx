'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Building2,
  Home,
  Hotel,
  TrendingUp,
  Users,
  Leaf,
  ArrowRight,
  BarChart3,
  Wind,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Case Study Data                                                            */
/* -------------------------------------------------------------------------- */

interface CaseStudy {
  company: string;
  industry: string;
  industryIcon: React.ElementType;
  gradient: string;
  accentColor: string;
  challenge: string;
  solution: string;
  result: string;
  metric: { value: string; label: string };
  stats: { label: string; value: string }[];
}

const caseStudies: CaseStudy[] = [
  {
    company: 'TechCorp',
    industry: 'Technology',
    industryIcon: Building2,
    gradient: 'from-emerald-500 to-green-700',
    accentColor: 'emerald',
    challenge:
      'TechCorp had over 500 indoor plants across their 3 Mumbai offices but was experiencing a 40% annual plant mortality rate. Their office air quality was declining, and they lacked any way to measure the environmental impact of their greenery investment.',
    solution:
      'VRIKSHAM deployed AI-powered health sensors on every plant, assigned dedicated technicians for weekly maintenance, and provided real-time ESG dashboards. Our predictive algorithms identified at-risk plants before visible symptoms appeared.',
    result:
      'Within 8 months, TechCorp saw a 40% measurable improvement in indoor air quality, reduced plant mortality to under 5%, and can now report verified ESG metrics for their sustainability commitments.',
    metric: { value: '40%', label: 'Air Quality Improvement' },
    stats: [
      { label: 'Plants Managed', value: '500+' },
      { label: 'Locations', value: '3 offices' },
      { label: 'Plant Mortality', value: '<5%' },
      { label: 'ROI Timeline', value: '8 months' },
    ],
  },
  {
    company: 'Green Valley Residences',
    industry: 'Real Estate',
    industryIcon: Home,
    gradient: 'from-teal-500 to-emerald-700',
    accentColor: 'teal',
    challenge:
      'Green Valley, a premium residential complex with 200 units in Bangalore, struggled to maintain communal green spaces. Residents frequently complained about dying plants in lobbies, corridors, and rooftop gardens, impacting resident satisfaction scores.',
    solution:
      'VRIKSHAM designed and installed a comprehensive greenery plan for all common areas, implemented automated irrigation tied to our IoT sensors, and scheduled bi-weekly technician visits. A resident portal provided transparency into maintenance activities.',
    result:
      'Resident satisfaction scores jumped to 95%, communal space usage increased by 60%, and the property management company reported a 15% increase in lease renewals directly attributed to improved green spaces.',
    metric: { value: '95%', label: 'Resident Satisfaction' },
    stats: [
      { label: 'Units Covered', value: '200' },
      { label: 'Green Areas', value: '12 zones' },
      { label: 'Lease Renewal', value: '+15%' },
      { label: 'Space Usage', value: '+60%' },
    ],
  },
  {
    company: 'Luxe Hotels',
    industry: 'Hospitality',
    industryIcon: Hotel,
    gradient: 'from-green-500 to-teal-700',
    accentColor: 'green',
    challenge:
      'Luxe Hotels, a chain of 15 luxury properties across India, wanted to achieve meaningful carbon offset goals as part of their global sustainability pledge. They needed verifiable data on the environmental impact of their interior and exterior plantings.',
    solution:
      'VRIKSHAM installed over 3,000 plants across all 15 properties, equipped with environmental sensors tracking CO2 absorption, O2 production, and air quality metrics in real-time. Custom ESG dashboards were built for each property and rolled up to corporate reporting.',
    result:
      'Luxe Hotels achieved a 30% carbon offset through their green infrastructure, received a prestigious Green Hospitality award, and reduced their HVAC costs by 12% in properties with extensive interior greenery.',
    metric: { value: '30%', label: 'Carbon Offset Achievement' },
    stats: [
      { label: 'Properties', value: '15' },
      { label: 'Plants Installed', value: '3,000+' },
      { label: 'HVAC Savings', value: '12%' },
      { label: 'Awards Won', value: '1 major' },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Animated Section                                                           */
/* -------------------------------------------------------------------------- */

function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Case Study Card                                                            */
/* -------------------------------------------------------------------------- */

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const Icon = study.industryIcon;

  return (
    <AnimatedSection delay={index * 0.15}>
      <div className="overflow-hidden rounded-3xl border border-gray-200/60 bg-white shadow-xl shadow-black/[0.03] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/5">
        {/* Gradient Image Placeholder */}
        <div className={cn('relative h-56 bg-gradient-to-br', study.gradient)}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Icon className="mx-auto mb-3 h-12 w-12 opacity-80" />
              <h3 className="text-3xl font-bold">{study.company}</h3>
            </div>
          </div>
          {/* Decorative overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        </div>

        <div className="p-8">
          {/* Industry Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Icon className="h-3 w-3" />
            {study.industry}
          </span>

          {/* Key Metric Callout */}
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 p-5">
            <p className="text-4xl font-bold text-emerald-700">{study.metric.value}</p>
            <p className="mt-1 text-sm font-medium text-emerald-600">{study.metric.label}</p>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {study.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <p className="text-[11px] text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Sections */}
          <div className="mt-8 space-y-6">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <BarChart3 className="h-4 w-4 text-red-500" />
                Challenge
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{study.challenge}</p>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Leaf className="h-4 w-4 text-emerald-500" />
                Solution
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{study.solution}</p>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Result
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{study.result}</p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function CaseStudiesPage() {
  return (
    <div className="relative overflow-hidden">
      {/* ================================================================== */}
      {/*  Hero                                                               */}
      {/* ================================================================== */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-white to-white" />
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
              Case Studies
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Real{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                impact
              </span>
              , real results
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl">
              See how leading organizations across India have transformed their spaces
              and achieved measurable environmental impact with VRIKSHAM.
            </p>
          </motion.div>

          {/* Summary stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-6"
          >
            {[
              { icon: Users, value: '2,000+', label: 'Clients Served' },
              { icon: Leaf, value: '50,000+', label: 'Plants Thriving' },
              { icon: Wind, value: '12,000 kg', label: 'CO2 Absorbed Monthly' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <stat.icon className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="text-xl font-bold text-gray-900 sm:text-2xl">{stat.value}</p>
                <p className="mt-0.5 text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  Case Study Cards                                                   */}
      {/* ================================================================== */}
      <section className="pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-1">
            {caseStudies.map((study, i) => (
              <div key={study.company} className="mx-auto w-full max-w-4xl">
                <CaseStudyCard study={study} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  CTA                                                                */}
      {/* ================================================================== */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-8 py-16 text-center shadow-2xl shadow-emerald-500/20 sm:px-16">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              </div>

              <div className="relative">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  Ready to transform your space?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-100">
                  Join 2,000+ companies already creating healthier, greener workspaces
                  with VRIKSHAM. Start your 14-day free trial today.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/register"
                    className="group flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-emerald-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Start Free Trial
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    Talk to Sales
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
