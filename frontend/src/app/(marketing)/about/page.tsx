'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Leaf,
  Lightbulb,
  Heart,
  TrendingUp,
  MapPin,
  ArrowRight,
  Building2,
  Users,
  Globe,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

const teamMembers = [
  {
    name: 'Arjun Krishnamurthy',
    title: 'Founder & CEO',
    initials: 'AK',
    gradient: 'from-emerald-400 to-green-600',
    bio: 'Former sustainability lead at Google India. Passionate about bringing nature into urban spaces through technology.',
  },
  {
    name: 'Priya Sharma',
    title: 'CTO',
    initials: 'PS',
    gradient: 'from-teal-400 to-emerald-600',
    bio: 'Ex-Amazon engineer with 12 years in AI/ML. Built the core plant health detection algorithms powering VRIKSHAM.',
  },
  {
    name: 'Vikram Reddy',
    title: 'Head of Operations',
    initials: 'VR',
    gradient: 'from-green-400 to-teal-600',
    bio: 'Scaled logistics at Flipkart before joining VRIKSHAM. Manages our nationwide network of plant care technicians.',
  },
  {
    name: 'Meera Nair',
    title: 'Head of Design',
    initials: 'MN',
    gradient: 'from-lime-400 to-green-600',
    bio: 'Award-winning product designer. Believes great design makes sustainability accessible and delightful for everyone.',
  },
];

const coreValues = [
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'Every decision we make is guided by our commitment to a greener planet. We measure our success by the positive environmental impact we create.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We leverage AI, IoT sensors, and data analytics to revolutionize how urban green spaces are designed, installed, and maintained.',
  },
  {
    icon: Heart,
    title: 'Care',
    description: 'Plants are living beings that deserve expert attention. Our technicians are trained horticulturists who treat every plant with dedication.',
  },
  {
    icon: TrendingUp,
    title: 'Impact',
    description: 'We track real ESG metrics like CO2 absorption, oxygen production, and air quality improvement to quantify the impact of every green installation.',
  },
];

const milestones = [
  { year: '2020', title: 'Founded', description: 'VRIKSHAM was born in a small Bangalore co-working space with a mission to transform urban greenery.' },
  { year: '2021', title: '100 Clients', description: 'Crossed our first milestone of 100 corporate clients across Bangalore and Hyderabad.' },
  { year: '2022', title: 'AI Launch', description: 'Launched our AI-powered plant health monitoring system, reducing plant mortality by 60%.' },
  { year: '2023', title: '50 Cities', description: 'Expanded operations to 50 cities across India, servicing over 5,000 locations.' },
  { year: '2024', title: 'Series A', description: 'Raised Series A funding to accelerate our vision of making every urban space greener.' },
];

const offices = [
  { city: 'Bangalore', label: 'HQ', address: 'HSR Layout, Bangalore 560102' },
  { city: 'Hyderabad', label: 'South', address: 'HITEC City, Hyderabad 500081' },
  { city: 'Mumbai', label: 'West', address: 'BKC, Mumbai 400051' },
  { city: 'Chennai', label: 'East', address: 'OMR, Chennai 600096' },
];

/* -------------------------------------------------------------------------- */
/*  Animated Section Wrapper                                                   */
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
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* ================================================================== */}
      {/*  Hero Section                                                       */}
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
              About Us
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              About{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                VRIKSHAM
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl">
              We are on a mission to transform every urban space into a thriving green
              ecosystem. Through technology and expert care, we make sustainable greenery
              accessible, measurable, and impactful for businesses across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  Our Story                                                          */}
      {/* ================================================================== */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimatedSection>
              <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-emerald-600">
                Our Story
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Founded in Bangalore to transform urban green spaces
              </h2>
              <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
                <p>
                  VRIKSHAM began in 2020 when our founder, Arjun Krishnamurthy, noticed a
                  stark disconnect in corporate India. Companies spent lakhs on office interiors
                  but their plants withered within months due to lack of expert care. The
                  environmental benefits of indoor greenery were being lost.
                </p>
                <p>
                  What started as a plant maintenance service for 10 offices in Bangalore has
                  grown into India&apos;s most comprehensive green infrastructure management
                  platform. We combine AI-powered health monitoring, trained horticulturists,
                  and real-time ESG analytics to ensure every plant thrives.
                </p>
                <p>
                  Today, VRIKSHAM serves over 2,000 corporate clients across 50 cities,
                  managing more than 50,000 plants and delivering measurable environmental
                  impact through our proprietary technology platform.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="relative rounded-3xl bg-gradient-to-br from-emerald-500 to-green-700 p-1">
                <div className="rounded-[22px] bg-gradient-to-br from-emerald-50 to-green-50 p-8 sm:p-12">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { icon: Building2, value: '2,000+', label: 'Corporate Clients' },
                      { icon: Globe, value: '50+', label: 'Cities in India' },
                      { icon: Leaf, value: '50,000+', label: 'Plants Managed' },
                      { icon: Users, value: '500+', label: 'Expert Technicians' },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="text-center"
                      >
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                          <stat.icon className="h-5 w-5 text-emerald-700" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  Leadership Team                                                    */}
      {/* ================================================================== */}
      <section className="bg-gradient-to-b from-white via-emerald-50/30 to-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mx-auto mb-16 max-w-2xl text-center">
            <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-emerald-600">
              Leadership
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Meet our team
            </h2>
            <p className="mt-4 text-gray-600">
              A passionate team of technologists, horticulturists, and sustainability
              advocates building the future of urban greenery.
            </p>
          </AnimatedSection>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, i) => (
              <AnimatedSection key={member.name} delay={i * 0.1}>
                <div className="group rounded-2xl border border-gray-200/60 bg-white p-6 text-center shadow-lg shadow-black/[0.03] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5">
                  {/* Avatar */}
                  <div
                    className={cn(
                      'mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-xl font-bold text-white shadow-lg',
                      member.gradient,
                    )}
                  >
                    {member.initials}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-emerald-600">{member.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-500">
                    {member.bio}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  Core Values                                                        */}
      {/* ================================================================== */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mx-auto mb-16 max-w-2xl text-center">
            <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-emerald-600">
              Our Values
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What drives us every day
            </h2>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 0.1}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/60 p-6 shadow-lg shadow-black/[0.02] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5">
                  {/* Glass overlay */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="relative">
                    <div className="mb-4 inline-flex rounded-xl bg-emerald-500/10 p-3">
                      <value.icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      {value.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  Milestones Timeline                                                */}
      {/* ================================================================== */}
      <section className="bg-gradient-to-b from-white via-emerald-50/30 to-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mx-auto mb-16 max-w-2xl text-center">
            <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-emerald-600">
              Our Journey
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Milestones that define us
            </h2>
          </AnimatedSection>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-emerald-200 via-emerald-400 to-emerald-200 md:block" />

            <div className="space-y-12 md:space-y-0">
              {milestones.map((milestone, i) => (
                <AnimatedSection key={milestone.year} delay={i * 0.12}>
                  <div
                    className={cn(
                      'relative flex flex-col md:flex-row md:items-center md:py-8',
                      i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse',
                    )}
                  >
                    {/* Content */}
                    <div className={cn('md:w-1/2', i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16')}>
                      <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-lg shadow-black/[0.03]">
                        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                          {milestone.year}
                        </span>
                        <h3 className="mt-3 text-xl font-bold text-gray-900">
                          {milestone.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  Office Locations                                                   */}
      {/* ================================================================== */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mx-auto mb-16 max-w-2xl text-center">
            <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-emerald-600">
              Our Offices
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Where we work
            </h2>
            <p className="mt-4 text-gray-600">
              Headquartered in Bangalore with offices across Southern and Western India.
            </p>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {offices.map((office, i) => (
              <AnimatedSection key={office.city} delay={i * 0.1}>
                <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-lg shadow-black/[0.03] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="mb-4 inline-flex rounded-xl bg-emerald-500/10 p-3">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">{office.city}</h3>
                    {office.label === 'HQ' && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        HQ
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{office.address}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  CTA Banner                                                         */}
      {/* ================================================================== */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-8 py-16 text-center shadow-2xl shadow-emerald-500/20 sm:px-16">
              {/* Background decoration */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              </div>

              <div className="relative">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  Join Our Mission
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-100">
                  Whether you want to green your workspace or join our team, we would love
                  to hear from you. Together, let us build a greener tomorrow.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/contact"
                    className="group flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-emerald-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Get in Touch
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    View Plans
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
