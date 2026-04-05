'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Leaf,
  Sparkles,
  TrendingUp,
  Wind,
} from 'lucide-react';
import {
  RevealBlock,
  SectionTransition,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion/section-transition';
import { BLUR_DATA_URL, IMAGES } from '@/lib/images';

interface CaseStudyItem {
  company: string;
  vertical: string;
  summary: string;
  challenge: string;
  strategy: string;
  outcome: string;
  headlineMetric: string;
  metricLabel: string;
  image: string;
  stats: Array<{ label: string; value: string }>;
}

const caseStudies: CaseStudyItem[] = [
  {
    company: 'TechCorp Mumbai Campus',
    vertical: 'Technology',
    summary:
      'A fast-scaling technology company needed reliability across three campuses with over 500 active plants.',
    challenge:
      'Frequent plant loss and inconsistent service logs made leadership question ongoing green investments.',
    strategy:
      'Vriksham deployed structured maintenance, field accountability, and predictive health workflows tied to one dashboard.',
    outcome:
      'Plant mortality dropped below 5%, executive reporting improved, and air quality indicators improved in under two quarters.',
    headlineMetric: '40%',
    metricLabel: 'Air quality uplift in 8 months',
    image: IMAGES.caseStudies.techCorp,
    stats: [
      { label: 'Plants in scope', value: '500+' },
      { label: 'Active campuses', value: '3' },
      { label: 'Service SLA adherence', value: '96%' },
      { label: 'Mortality rate', value: '<5%' },
    ],
  },
  {
    company: 'Green Valley Residences',
    vertical: 'Residential Real Estate',
    summary:
      'Premium residential community wanted a consistent biophilic experience across shared spaces.',
    challenge:
      'Lobby and rooftop zones showed poor plant retention and frequent resident complaints on upkeep quality.',
    strategy:
      'We combined species redesign, sensor-driven irrigation, and recurring technician visits under a transparent service workflow.',
    outcome:
      'Resident satisfaction reached 95%, renewals improved, and shared spaces saw sustained usage growth.',
    headlineMetric: '95%',
    metricLabel: 'Resident satisfaction score',
    image: IMAGES.solutions.residential,
    stats: [
      { label: 'Homes covered', value: '200' },
      { label: 'Green zones', value: '12' },
      { label: 'Renewal lift', value: '+15%' },
      { label: 'Space usage', value: '+60%' },
    ],
  },
  {
    company: 'Luxe Hotels Group',
    vertical: 'Hospitality',
    summary:
      'A hospitality chain wanted measurable sustainability progress across distributed properties.',
    challenge:
      'Corporate sustainability targets were ambitious, but property-level data lacked consistency and credibility.',
    strategy:
      'Vriksham implemented a unified operating model with per-property analytics and centralized executive reporting.',
    outcome:
      'The group achieved meaningful carbon-offset milestones and reduced HVAC costs at high-coverage properties.',
    headlineMetric: '30%',
    metricLabel: 'Carbon-offset target achieved',
    image: IMAGES.caseStudies.hotel,
    stats: [
      { label: 'Properties in rollout', value: '15' },
      { label: 'Plants deployed', value: '3,000+' },
      { label: 'HVAC savings', value: '12%' },
      { label: 'Corporate reporting cadence', value: 'Monthly' },
    ],
  },
];

const portfolioMetrics = [
  { icon: Building2, value: '2,000+', label: 'Organizations served' },
  { icon: Leaf, value: '50,000+', label: 'Plants under active care' },
  { icon: Wind, value: '12,000 kg', label: 'Estimated monthly CO2 absorption' },
  { icon: TrendingUp, value: '95%', label: 'Average service SLA adherence' },
];

export default function CaseStudiesPage() {
  return (
    <div className="relative overflow-hidden pb-20 sm:pb-24">
      <SectionTransition className="relative isolate overflow-hidden border-b border-emerald-100/80 bg-[#f2faf4] pb-14 pt-28 sm:pb-18 sm:pt-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-14rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-emerald-400/18 blur-[130px]" />
          <div className="absolute -left-14 top-36 h-72 w-72 rounded-full bg-cyan-300/16 blur-[105px]" />
          <div className="absolute right-[-8rem] bottom-0 h-80 w-80 rounded-full bg-lime-300/18 blur-[110px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(5,150,105,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(5,150,105,0.06)_1px,transparent_1px)] bg-[size:52px_52px] opacity-45" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <RevealBlock className="mx-auto max-w-4xl text-center" delay={0.04}>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              <Sparkles className="h-4 w-4" />
              Case Studies
            </p>
            <h1 className="mt-5 font-display text-[clamp(2.4rem,6vw,4.8rem)] leading-[1.02] tracking-[-0.04em] text-slate-950">
              Real operating outcomes
              <span className="block bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                across real client environments
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-700 sm:text-xl">
              These stories show how disciplined maintenance workflows, clear accountability, and live reporting turn plant programs into reliable infrastructure.
            </p>
          </RevealBlock>

          <StaggerContainer className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4" staggerChildren={0.08}>
            {portfolioMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <StaggerItem key={metric.label}>
                  <div className="rounded-2xl border border-white/85 bg-white/80 px-4 py-4 shadow-lg shadow-emerald-900/5">
                    <Icon className="h-5 w-5 text-emerald-700" />
                    <p className="mt-3 text-xl font-semibold text-slate-950">{metric.value}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{metric.label}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </SectionTransition>

      <SectionTransition className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-12 lg:py-18" delay={0.04}>
        <StaggerContainer className="space-y-6" staggerChildren={0.1}>
          {caseStudies.map((study) => (
            <StaggerItem key={study.company}>
              <article className="overflow-hidden rounded-[1.9rem] border border-slate-200 bg-white/90 shadow-2xl shadow-emerald-900/8">
                <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="relative min-h-[22rem]">
                    <Image
                      src={study.image}
                      alt={`${study.company} case study visual`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/25 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-slate-950/55 px-4 py-3 text-white backdrop-blur-lg">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-200">{study.vertical}</p>
                      <p className="mt-2 text-3xl font-semibold tracking-tight">{study.headlineMetric}</p>
                      <p className="text-sm text-slate-200">{study.metricLabel}</p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 lg:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">{study.vertical}</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{study.company}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{study.summary}</p>

                    <div className="mt-5 grid gap-2.5 rounded-2xl bg-[#f6fbf7] p-4 sm:grid-cols-2">
                      {study.stats.map((entry) => (
                        <div key={entry.label}>
                          <p className="text-lg font-semibold text-slate-950">{entry.value}</p>
                          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{entry.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-600">
                      <div>
                        <p className="font-semibold text-slate-900">Challenge</p>
                        <p className="mt-1">{study.challenge}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Strategy</p>
                        <p className="mt-1">{study.strategy}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Outcome</p>
                        <p className="mt-1">{study.outcome}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </SectionTransition>

      <SectionTransition className="mx-auto w-full max-w-7xl px-6 py-2 sm:px-8 lg:px-12" delay={0.05}>
        <RevealBlock>
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 px-7 py-10 text-white shadow-2xl shadow-slate-950/20 sm:px-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100">
              <Leaf className="h-3.5 w-3.5" />
              Build Your Story
            </p>
            <h3 className="mt-4 font-display text-[clamp(1.6rem,3.5vw,2.5rem)] leading-[1.1] tracking-[-0.03em]">
              Ready to turn your green initiative into an operational success case?
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
              We can map your current maturity, design your rollout sequence, and deliver a measurable outcome model tailored to your portfolio.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Plan a deployment
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10"
              >
                Explore pricing options
              </Link>
            </div>
          </div>
        </RevealBlock>
      </SectionTransition>
    </div>
  );
}
