'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Compass,
  Leaf,
  ShieldCheck,
  Sparkles,
  Target,
  Users2,
} from 'lucide-react';
import {
  RevealBlock,
  SectionTransition,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion/section-transition';
import { BLUR_DATA_URL, IMAGES } from '@/lib/images';

const headlineStats = [
  { value: '500+', label: 'Client locations in service' },
  { value: '10k+', label: 'Plants actively maintained' },
  { value: '95%', label: 'Quarterly service adherence' },
];

const operatingPrinciples = [
  {
    title: 'Measurable Outcomes',
    description:
      'Every deployment is mapped to health, service, and reporting outcomes before execution begins.',
    icon: Target,
  },
  {
    title: 'Field-First Execution',
    description:
      'Technicians, partners, and clients work from one operating cadence so work never drifts from plan.',
    icon: Users2,
  },
  {
    title: 'Continuous Learning',
    description:
      'Health trends and service loops continuously reshape species planning and maintenance strategies.',
    icon: Compass,
  },
  {
    title: 'Trust by Default',
    description:
      'Transparent logs, auditable actions, and role-based accountability are built into every workflow.',
    icon: ShieldCheck,
  },
];

const journeyMilestones = [
  {
    phase: '01',
    title: 'Site Discovery',
    detail:
      'We evaluate climate, light profiles, occupancy patterns, and service constraints before planning.',
  },
  {
    phase: '02',
    title: 'Biophilic Design',
    detail:
      'Species mix, placement zones, and care cycles are engineered for long-term plant resilience.',
  },
  {
    phase: '03',
    title: 'Operations Rollout',
    detail:
      'Partner teams deploy with tracked SLAs, checklists, and in-field updates tied to the platform.',
  },
  {
    phase: '04',
    title: 'Impact Reporting',
    detail:
      'Clients receive live health, service, and ESG reporting that reflects actual delivery activity.',
  },
];

const leadershipTeam = [
  {
    name: 'Arjun Krishnamurthy',
    role: 'Founder & CEO',
    narrative:
      'Built Vriksham to make green infrastructure operationally dependable, not just visually impressive.',
  },
  {
    name: 'Priya Sharma',
    role: 'Chief Technology Officer',
    narrative:
      'Leads platform reliability, data integrity, and product architecture across operations and reporting.',
  },
  {
    name: 'Vikram Reddy',
    role: 'Head of Field Operations',
    narrative:
      'Designs execution systems that keep service quality high across regions, crews, and client sites.',
  },
  {
    name: 'Meera Nair',
    role: 'Head of Experience Design',
    narrative:
      'Shapes stakeholder journeys so complex green operations remain intuitive for every role in the platform.',
  },
];

function toInitials(name: string): string {
  const fragments = name.trim().split(/\s+/).slice(0, 2);
  return fragments.map((fragment) => fragment.charAt(0).toUpperCase()).join('');
}

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden pb-20 sm:pb-24">
      <SectionTransition className="relative isolate overflow-hidden border-b border-emerald-100/80 bg-[#f2faf4] pb-16 pt-28 sm:pb-20 sm:pt-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-15rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-emerald-400/20 blur-[130px]" />
          <div className="absolute -left-16 bottom-0 h-[18rem] w-[18rem] rounded-full bg-cyan-300/20 blur-[100px]" />
          <div className="absolute right-[-7rem] top-32 h-[20rem] w-[20rem] rounded-full bg-lime-300/20 blur-[110px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(5,150,105,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(5,150,105,0.06)_1px,transparent_1px)] bg-[size:52px_52px] opacity-45" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16 lg:px-12">
          <RevealBlock className="space-y-8" delay={0.05}>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              <Sparkles className="h-4 w-4" />
              About Vriksham
            </div>

            <div className="space-y-5">
              <h1 className="font-display text-[clamp(2.4rem,6vw,4.8rem)] leading-[1.02] tracking-[-0.04em] text-slate-950">
                We run green infrastructure
                <span className="block bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  like a mission-critical system
                </span>
              </h1>

              <p className="max-w-2xl text-lg leading-relaxed text-slate-700 sm:text-xl">
                Vriksham combines horticulture, software, and disciplined field operations to help organizations sustain living spaces at scale.
                We focus on reliability, traceability, and measurable environmental outcomes.
              </p>
            </div>

            <StaggerContainer className="grid gap-3 sm:grid-cols-3" staggerChildren={0.07}>
              {headlineStats.map((stat) => (
                <StaggerItem key={stat.label}>
                  <div className="rounded-2xl border border-white/85 bg-white/80 px-4 py-4 shadow-lg shadow-emerald-900/5">
                    <p className="text-2xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{stat.label}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </RevealBlock>

          <RevealBlock delay={0.12}>
            <div className="overflow-hidden rounded-[2rem] border border-white/85 bg-white/75 p-4 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem]">
                <Image
                  src={IMAGES.about.office}
                  alt="Vriksham team collaborating in workspace"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-900/15 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-slate-950/55 p-4 text-white backdrop-blur-lg">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200">Operating Thesis</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-100">
                    Beautiful greenery succeeds only when planning, maintenance, and reporting stay synchronized.
                  </p>
                </div>
              </div>
            </div>
          </RevealBlock>
        </div>
      </SectionTransition>

      <SectionTransition className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-20" delay={0.04}>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <RevealBlock className="rounded-3xl border border-emerald-100 bg-white/80 p-7 shadow-xl shadow-emerald-900/5 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">How We Work</p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,3rem)] leading-[1.08] tracking-[-0.03em] text-slate-950">
              Strategy, service, and software in one feedback loop
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Most green programs fail when teams operate in silos. We built Vriksham so site design, maintenance execution, and client reporting all reflect the same operational truth.
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
              This gives clients confidence, partners clarity, and technicians a repeatable path to quality outcomes week after week.
            </p>
          </RevealBlock>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2" staggerChildren={0.09}>
            {operatingPrinciples.map((principle) => {
              const Icon = principle.icon;
              return (
                <StaggerItem key={principle.title}>
                  <div className="h-full rounded-3xl border border-slate-200/80 bg-[#f8fcf9] p-6 shadow-sm">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm shadow-emerald-900/10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{principle.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{principle.description}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </SectionTransition>

      <SectionTransition className="border-y border-emerald-100/80 bg-[#f7fcf8] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <RevealBlock>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Delivery Journey</p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.08] tracking-[-0.03em] text-slate-950">
              Every account follows one clear operating rhythm
            </h2>
          </RevealBlock>

          <StaggerContainer className="mt-10 grid gap-4 lg:grid-cols-4" delayChildren={0.08} staggerChildren={0.08}>
            {journeyMilestones.map((milestone) => (
              <StaggerItem key={milestone.phase}>
                <div className="h-full rounded-3xl border border-emerald-100 bg-white/85 p-5 shadow-sm shadow-emerald-900/5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Phase {milestone.phase}</p>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">{milestone.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{milestone.detail}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </SectionTransition>

      <SectionTransition className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-20" delay={0.06}>
        <RevealBlock>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Leadership</p>
          <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.08] tracking-[-0.03em] text-slate-950">
            The team shaping Vriksham&apos;s operating standards
          </h2>
        </RevealBlock>

        <StaggerContainer className="mt-10 grid gap-4 sm:grid-cols-2" staggerChildren={0.09}>
          {leadershipTeam.map((member) => (
            <StaggerItem key={member.name}>
              <div className="h-full rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-emerald-900/5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                    {toInitials(member.name)}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{member.name}</p>
                    <p className="text-sm font-medium text-emerald-700">{member.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{member.narrative}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <RevealBlock className="mt-12">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 px-7 py-10 text-white shadow-2xl shadow-slate-950/20 sm:px-10">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
                <Leaf className="h-3.5 w-3.5" />
                Build With Vriksham
              </p>
              <h3 className="mt-4 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.12] tracking-[-0.03em]">
                Ready to operationalize your green infrastructure program?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                We will map your sites, define service rhythm, and set up reporting workflows your stakeholders can trust.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Talk to our team
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex items-center rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10"
              >
                Explore client stories
              </Link>
            </div>
          </div>
        </RevealBlock>
      </SectionTransition>
    </div>
  );
}
