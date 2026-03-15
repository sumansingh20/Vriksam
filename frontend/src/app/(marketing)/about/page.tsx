'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Leaf,
  Lightbulb,
  Heart,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

const stats = [
  { value: '50+', label: 'Cities' },
  { value: '500+', label: 'Clients' },
  { value: '10,000+', label: 'Plants' },
];

const teamMembers = [
  {
    name: 'Arjun Krishnamurthy',
    title: 'Founder & CEO',
    initials: 'AK',
    bio: 'Former sustainability lead at Google India.',
  },
  {
    name: 'Priya Sharma',
    title: 'CTO',
    initials: 'PS',
    bio: 'Ex-Amazon engineer with 12 years in AI/ML.',
  },
  {
    name: 'Vikram Reddy',
    title: 'Head of Operations',
    initials: 'VR',
    bio: 'Scaled logistics at Flipkart.',
  },
  {
    name: 'Meera Nair',
    title: 'Head of Design',
    initials: 'MN',
    bio: 'Award-winning product designer.',
  },
];

const values = [
  {
    icon: Leaf,
    title: 'Sustainability',
    description:
      'Every decision is guided by our commitment to a greener planet. We measure success by the positive environmental impact we create.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'We leverage AI, IoT sensors, and data analytics to revolutionize how urban green spaces are designed and maintained.',
  },
  {
    icon: Heart,
    title: 'Reliability',
    description:
      'Our technicians are trained horticulturists who treat every plant with expert attention and consistent, dependable care.',
  },
  {
    icon: TrendingUp,
    title: 'Impact',
    description:
      'We track real ESG metrics like CO2 absorption and air quality improvement to quantify the impact of every installation.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Scroll Reveal Wrapper                                                      */
/* -------------------------------------------------------------------------- */

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
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
    <main>
      {/* ================================================================ */}
      {/*  Hero                                                            */}
      {/* ================================================================ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              About Vriksham
            </p>

            <h1
              className="mt-4 font-bold tracking-tight text-gray-900"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                lineHeight: 1.1,
              }}
            >
              Making cities greener
              <br />
              through technology
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg">
              We combine expert horticulture with modern software to help
              businesses build and maintain thriving green spaces across India.
            </p>
          </motion.div>

          {/* Metric bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.15,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="mt-12 flex items-center justify-center divide-x divide-gray-200"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="px-8 text-center">
                <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  Mission                                                         */}
      {/* ================================================================ */}
      <section className="bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                Our mission
              </p>

              <h2
                className="mt-4 font-bold tracking-tight text-gray-900"
                style={{
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                  lineHeight: 1.2,
                }}
              >
                Bringing nature back into everyday workspaces
              </h2>

              <p className="mt-6 text-base leading-relaxed text-gray-500 sm:text-lg">
                Vriksham exists to close the gap between good intentions and
                lasting green impact. Companies invest in office greenery, yet
                most plants fail within months without expert care. We solve
                that with a technology-first approach: AI-powered health
                monitoring, trained horticulturists on the ground, and
                real-time ESG analytics that prove the environmental value of
                every installation. Our goal is to make sustainable greenery
                measurable, reliable, and effortless for businesses of every
                size.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  Team                                                            */}
      {/* ================================================================ */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Leadership
            </p>
            <h2
              className="mt-4 font-bold tracking-tight text-gray-900"
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                lineHeight: 1.2,
              }}
            >
              The people behind Vriksham
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.08}>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
                  {/* Initials */}
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-lg font-semibold text-white">
                    {member.initials}
                  </div>

                  <h3 className="text-base font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{member.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    {member.bio}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  Values                                                          */}
      {/* ================================================================ */}
      <section className="bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Values
            </p>
            <h2
              className="mt-4 font-bold tracking-tight text-gray-900"
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                lineHeight: 1.2,
              }}
            >
              What we stand for
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900">
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  CTA                                                             */}
      {/* ================================================================ */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-3xl bg-gray-900 px-8 py-16 text-center sm:px-16">
              <h2
                className="font-bold text-white"
                style={{
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                  lineHeight: 1.2,
                }}
              >
                Join the green revolution
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base text-gray-400">
                Whether you want to green your workspace or partner with us,
                we would love to hear from you.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100"
                >
                  Talk to us
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center rounded-lg border border-gray-700 px-6 py-3 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
                >
                  View pricing
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
