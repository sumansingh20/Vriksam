'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Brain,
  Calendar,
  BarChart3,
  FileBarChart,
  Package,
  Users,
  Layout,
  Wifi,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Featured features — dark cards with animated SVG visuals                   */
/* -------------------------------------------------------------------------- */

const featuredFeatures = [
  {
    icon: Brain,
    title: 'AI Plant Health',
    description:
      'AI-powered diagnostics and health monitoring that catches issues before they become visible. Computer vision analyzes leaf patterns, soil conditions, and growth metrics in real time.',
    visual: 'ai' as const,
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description:
      'Live dashboards with growth metrics, health trends, and performance indicators. Make data-driven decisions with comprehensive analytics across all your green spaces.',
    visual: 'chart' as const,
  },
];

/* -------------------------------------------------------------------------- */
/*  Regular features — white/glass cards                                       */
/* -------------------------------------------------------------------------- */

const regularFeatures = [
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description:
      'Automated maintenance scheduling and routing that adapts to weather, plant needs, and team availability.',
  },
  {
    icon: FileBarChart,
    title: 'ESG Reporting',
    description:
      'Environmental impact tracking and compliance reports. Board-ready sustainability metrics generated automatically.',
  },
  {
    icon: Package,
    title: 'Inventory Management',
    description:
      'Track plant assets, procurement, and supplier performance across all your locations.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Assign tasks, manage technicians, and track progress with real-time coordination tools.',
  },
  {
    icon: Layout,
    title: 'Client Portal',
    description:
      'Self-service dashboards where your clients can monitor their green spaces and view impact reports.',
  },
  {
    icon: Wifi,
    title: 'IoT Integration',
    description:
      'Connect soil moisture, light, and temperature sensors for fully automated monitoring.',
  },
];

/* -------------------------------------------------------------------------- */
/*  Animated SVG: AI neural-network dots & connections                         */
/* -------------------------------------------------------------------------- */

function AIVisual() {
  const dots = [
    { cx: 18, cy: 18, delay: 0 },
    { cx: 50, cy: 12, delay: 0.3 },
    { cx: 82, cy: 22, delay: 0.6 },
    { cx: 34, cy: 42, delay: 0.2 },
    { cx: 66, cy: 38, delay: 0.5 },
    { cx: 18, cy: 62, delay: 0.4 },
    { cx: 50, cy: 68, delay: 0.1 },
    { cx: 82, cy: 58, delay: 0.7 },
    { cx: 96, cy: 42, delay: 0.35 },
  ];

  const connections: [number, number][] = [
    [0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 4],
    [3, 5], [3, 6], [4, 6], [4, 7], [5, 6], [6, 7],
    [2, 8], [4, 8], [7, 8],
  ];

  return (
    <svg viewBox="0 0 110 82" className="h-full w-full" fill="none">
      {/* Connection lines */}
      {connections.map(([from, to], i) => (
        <motion.line
          key={`conn-${i}`}
          x1={dots[from]!.cx}
          y1={dots[from]!.cy}
          x2={dots[to]!.cx}
          y2={dots[to]!.cy}
          stroke="rgba(52, 211, 153, 0.18)"
          strokeWidth="0.7"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.6, 1] }}
          transition={{
            duration: 2,
            delay: 0.4 + i * 0.06,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Pulsing dots */}
      {dots.map((dot, i) => (
        <g key={`dot-${i}`}>
          {/* Outer pulse ring */}
          <motion.circle
            cx={dot.cx}
            cy={dot.cy}
            r="7"
            fill="rgba(16, 185, 129, 0.08)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.6, 1, 1.4, 1], opacity: [0, 0.6, 0.3, 0.5, 0.3] }}
            transition={{
              duration: 3.5,
              delay: dot.delay,
              repeat: Infinity,
              repeatDelay: 1.5,
            }}
          />
          {/* Core dot */}
          <motion.circle
            cx={dot.cx}
            cy={dot.cy}
            r="2.8"
            fill="#10b981"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: dot.delay + 0.2, ease: 'backOut' }}
          />
        </g>
      ))}

      {/* Traveling data pulse along a connection */}
      <motion.circle
        r="1.5"
        fill="#34d399"
        initial={{ opacity: 0 }}
        animate={{
          cx: [dots[0]!.cx, dots[1]!.cx, dots[4]!.cx, dots[7]!.cx, dots[8]!.cx],
          cy: [dots[0]!.cy, dots[1]!.cy, dots[4]!.cy, dots[7]!.cy, dots[8]!.cy],
          opacity: [0, 1, 1, 1, 0],
        }}
        transition={{
          duration: 3,
          delay: 2,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut',
        }}
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Animated SVG: line chart drawing itself                                    */
/* -------------------------------------------------------------------------- */

function ChartVisual() {
  const chartPath =
    'M 5 52 C 12 48, 18 46, 25 42 S 35 36, 45 30 S 55 22, 62 24 S 72 18, 80 14 L 95 6';
  const areaPath =
    'M 5 52 C 12 48, 18 46, 25 42 S 35 36, 45 30 S 55 22, 62 24 S 72 18, 80 14 L 95 6 L 95 62 L 5 62 Z';

  return (
    <svg viewBox="0 0 100 68" className="h-full w-full" fill="none">
      {/* Horizontal grid lines */}
      {[18, 30, 42, 54].map((y, i) => (
        <motion.line
          key={`grid-${i}`}
          x1="5"
          y1={y}
          x2="95"
          y2={y}
          stroke="rgba(52, 211, 153, 0.08)"
          strokeWidth="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
        />
      ))}

      {/* Vertical grid lines */}
      {[5, 25, 45, 65, 85, 95].map((x, i) => (
        <motion.line
          key={`vgrid-${i}`}
          x1={x}
          y1="6"
          x2={x}
          y2="62"
          stroke="rgba(52, 211, 153, 0.05)"
          strokeWidth="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
        />
      ))}

      {/* Gradient area fill */}
      <motion.path
        d={areaPath}
        fill="url(#bentoChartGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      />

      {/* Chart line */}
      <motion.path
        d={chartPath}
        stroke="url(#bentoLineGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.6, ease: 'easeOut' }}
      />

      {/* Data points along the line */}
      {[
        { cx: 25, cy: 42, delay: 1.0 },
        { cx: 45, cy: 30, delay: 1.3 },
        { cx: 62, cy: 24, delay: 1.5 },
        { cx: 80, cy: 14, delay: 1.7 },
      ].map((pt, i) => (
        <motion.circle
          key={`pt-${i}`}
          cx={pt.cx}
          cy={pt.cy}
          r="1.8"
          fill="#10b981"
          stroke="#064e3b"
          strokeWidth="0.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: pt.delay, ease: 'backOut' }}
        />
      ))}

      {/* Endpoint pulse */}
      <motion.circle
        cx="95"
        cy="6"
        r="2.5"
        fill="#10b981"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.4, 1] }}
        transition={{ duration: 0.5, delay: 2.2, ease: 'backOut' }}
      />
      <motion.circle
        cx="95"
        cy="6"
        r="6"
        fill="rgba(16, 185, 129, 0.15)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 1, 1.3, 1], opacity: [0, 0.6, 0.3, 0.5, 0.3] }}
        transition={{
          duration: 3,
          delay: 2.4,
          repeat: Infinity,
          repeatDelay: 1.5,
        }}
      />

      <defs>
        <linearGradient id="bentoChartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(16, 185, 129, 0.15)" />
          <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
        </linearGradient>
        <linearGradient id="bentoLineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Featured Card — dark gradient bg, spans 2 cols, animated visual            */
/* -------------------------------------------------------------------------- */

function FeaturedCard({
  feature,
  index,
  isInView,
}: {
  feature: (typeof featuredFeatures)[number];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative col-span-1 sm:col-span-2"
    >
      <div
        className={cn(
          'relative h-full overflow-hidden rounded-3xl',
          'bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950',
          'p-8 sm:p-10',
          'border border-white/[0.06]',
          'shadow-2xl shadow-emerald-900/10',
          'transition-all duration-500',
          'hover:shadow-emerald-900/20 hover:border-emerald-500/20',
        )}
      >
        {/* Ambient glow spots */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-emerald-400/[0.05] blur-3xl" />

        {/* Content + Visual */}
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
          {/* Text side */}
          <div className="flex-1 min-w-0">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <feature.icon className="h-6 w-6 text-emerald-400" />
            </div>

            <h3 className="text-xl font-semibold text-white sm:text-2xl">
              {feature.title}
            </h3>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-gray-400">
              {feature.description}
            </p>
          </div>

          {/* Animated SVG visual */}
          <div className="h-36 w-full flex-shrink-0 sm:h-44 sm:w-52">
            {feature.visual === 'ai' ? <AIVisual /> : <ChartVisual />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Regular Card — white/glass with emerald hover glow                         */
/* -------------------------------------------------------------------------- */

function RegularCard({
  feature,
  index,
  isInView,
}: {
  feature: (typeof regularFeatures)[number];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: 0.15 + index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative"
    >
      <div
        className={cn(
          'relative h-full overflow-hidden rounded-2xl',
          'bg-white/80 backdrop-blur-sm',
          'border border-gray-200/80',
          'p-7',
          'shadow-sm',
          'transition-all duration-300',
          'hover:shadow-lg hover:shadow-emerald-500/[0.08]',
          'hover:border-emerald-300/60',
        )}
      >
        {/* Hover gradient wash */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-50/0 to-transparent transition-all duration-500 group-hover:from-emerald-50/60" />

        <div className="relative">
          {/* Icon container */}
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 ring-1 ring-gray-200/60 transition-all duration-300 group-hover:bg-emerald-50 group-hover:ring-emerald-200/60">
            <feature.icon className="h-5 w-5 text-gray-600 transition-colors duration-300 group-hover:text-emerald-600" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            {feature.title}
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Features Grid — bento layout with visual variety                           */
/* -------------------------------------------------------------------------- */

export function FeaturesGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section className="relative overflow-hidden bg-gray-50/60 py-24 sm:py-32">
      {/* Subtle dot-grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.03)_1px,_transparent_0)] bg-[length:24px_24px]" />

      <div
        ref={sectionRef}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* ---- Section header ---- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center rounded-full border border-emerald-200/60 bg-emerald-50/80 px-4 py-1.5 text-sm font-medium text-emerald-700 backdrop-blur-sm">
            Platform Features
          </div>

          <h2 className="mt-5 text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.1] tracking-tight text-gray-900">
            Everything you need to manage{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
              green spaces
            </span>
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-gray-500">
            Eight integrated modules. One unified platform. Zero complexity.
          </p>
        </motion.div>

        {/* ---- Bento grid ---- */}
        <div className="mt-14 space-y-5">
          {/* Row 1: Featured (span 2) + Regular (1) */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <FeaturedCard
              feature={featuredFeatures[0]!}
              index={0}
              isInView={isInView}
            />
            <RegularCard
              feature={regularFeatures[0]!}
              index={0}
              isInView={isInView}
            />
          </div>

          {/* Row 2: Regular (1) + Featured (span 2) */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <RegularCard
              feature={regularFeatures[1]!}
              index={1}
              isInView={isInView}
            />
            <FeaturedCard
              feature={featuredFeatures[1]!}
              index={1}
              isInView={isInView}
            />
          </div>

          {/* Row 3: 4 equal regular cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {regularFeatures.slice(2).map((feature, i) => (
              <RegularCard
                key={feature.title}
                feature={feature}
                index={i + 2}
                isInView={isInView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
