'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Activity,
  Building2,
  CheckCircle2,
  Clock3,
  Leaf,
  ShieldCheck,
  Sparkles,
  Sun,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BLUR_DATA_URL, IMAGES } from '@/lib/images';

interface PlantCareInstructions {
  sunlight?: string;
}

interface MarketplacePlant {
  _id?: string;
  id?: string;
  slug?: string;
  commonName?: string;
  scientificName?: string;
  category?: string;
  difficulty?: string;
  imageUrl?: string;
  images?: string[];
  careInstructions?: PlantCareInstructions;
  description?: string;
}

interface MarketplaceResponse {
  success?: boolean;
  plants?: MarketplacePlant[];
  pagination?: {
    total?: number;
  };
}

const orchestrationCards = [
  {
    title: 'Assess and Design',
    summary:
      'Site assessments, species selection, and rollout plans aligned to your workspace realities.',
    icon: Building2,
    href: '/contact',
    cta: 'Plan Deployment',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Operate in Real Time',
    summary:
      'Maintenance workflows, technician dispatch, and health tracking through live dashboards.',
    icon: Activity,
    href: '/partner',
    cta: 'Open Partner Hub',
    accent: 'from-teal-500 to-cyan-500',
  },
  {
    title: 'Report with Confidence',
    summary:
      'Client-ready operational and ESG reporting from actual platform data, not manual spreadsheets.',
    icon: ShieldCheck,
    href: '/client/reports',
    cta: 'View Client Reports',
    accent: 'from-slate-700 to-slate-900',
  },
];

const workspaceRoutes = [
  {
    title: 'Admin Command',
    href: '/admin',
    detail: 'Control operations, payments, subscriptions, and teams.',
  },
  {
    title: 'Partner Operations',
    href: '/partner',
    detail: 'Schedule care, assign technicians, and monitor service quality.',
  },
  {
    title: 'Client Workspace',
    href: '/client',
    detail: 'Track plant health, maintenance status, and impact outcomes.',
  },
  {
    title: 'Technician Console',
    href: '/technician',
    detail: 'Execute visits, update plant health, and close tasks in field.',
  },
];

function resolvePlantSlug(plant: MarketplacePlant): string {
  if (typeof plant.slug === 'string' && plant.slug.trim().length > 0) {
    return plant.slug.trim();
  }

  if (typeof plant.commonName === 'string' && plant.commonName.trim().length > 0) {
    return plant.commonName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  return typeof plant.id === 'string'
    ? plant.id
    : (typeof plant._id === 'string' ? plant._id : 'plant');
}

function resolvePlantName(plant: MarketplacePlant): string {
  if (typeof plant.commonName === 'string' && plant.commonName.trim().length > 0) {
    return plant.commonName.trim();
  }

  if (typeof plant.scientificName === 'string' && plant.scientificName.trim().length > 0) {
    return plant.scientificName.trim();
  }

  return 'Catalog Species';
}

function resolvePlantImage(plant: MarketplacePlant): string {
  if (typeof plant.imageUrl === 'string' && plant.imageUrl.trim().length > 0) {
    return plant.imageUrl.trim();
  }

  if (Array.isArray(plant.images) && typeof plant.images[0] === 'string' && plant.images[0].trim().length > 0) {
    return plant.images[0].trim();
  }

  return IMAGES.plants.monstera;
}

function formatDifficulty(difficulty: string | undefined): string {
  if (!difficulty) return 'Unspecified';

  const normalized = difficulty.trim().toLowerCase();
  if (normalized === 'easy') return 'Easy Care';
  if (normalized === 'medium') return 'Moderate Care';
  if (normalized === 'hard') return 'Specialized Care';

  return difficulty;
}

function sectionFade(delay = 0) {
  return {
    initial: { opacity: 0, y: 28, filter: 'blur(10px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
    viewport: { once: true, margin: '-100px' as const },
  };
}

export function HomepageReimagined() {
  const [plants, setPlants] = useState<MarketplacePlant[]>([]);
  const [totalSpecies, setTotalSpecies] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    const loadCatalog = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await fetch('/api/marketplace?limit=24&sortBy=newest', {
          method: 'GET',
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch live catalog data.');
        }

        const payload = (await response.json()) as MarketplaceResponse;
        const incomingPlants = Array.isArray(payload.plants) ? payload.plants : [];

        if (!mounted) return;

        setPlants(incomingPlants);
        setTotalSpecies(payload.pagination?.total ?? incomingPlants.length);
        setLastSyncedAt(
          new Intl.DateTimeFormat('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date()),
        );
      } catch (error) {
        if (!mounted) return;

        const fallbackMessage =
          error instanceof Error && error.message.length > 0
            ? error.message
            : 'Unable to load live catalog data at the moment.';

        setLoadError(fallbackMessage);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCatalog();

    return () => {
      mounted = false;
    };
  }, []);

  const marketplaceSummary = useMemo(() => {
    const categoryCount = new Set(
      plants
        .map((plant) => (typeof plant.category === 'string' ? plant.category.trim().toLowerCase() : ''))
        .filter((entry) => entry.length > 0),
    ).size;

    const sunlightProfiles = new Set(
      plants
        .map((plant) =>
          typeof plant.careInstructions?.sunlight === 'string'
            ? plant.careInstructions.sunlight.trim().toLowerCase()
            : '',
        )
        .filter((entry) => entry.length > 0),
    ).size;

    const easyCareCount = plants.filter((plant) => {
      const difficulty = typeof plant.difficulty === 'string' ? plant.difficulty.toLowerCase() : '';
      return difficulty.includes('easy');
    }).length;

    const easyCareRatio = plants.length > 0 ? Math.round((easyCareCount / plants.length) * 100) : 0;

    return {
      categoryCount,
      sunlightProfiles,
      easyCareRatio,
    };
  }, [plants]);

  const featuredPlants = useMemo(() => plants.slice(0, 6), [plants]);

  return (
    <div className="relative overflow-hidden">
      <section className="relative isolate overflow-hidden border-b border-emerald-100/70 bg-[#f3f9f4]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-48 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-emerald-400/20 blur-[140px]" />
          <div className="absolute right-[-8rem] top-24 h-[26rem] w-[26rem] rounded-full bg-cyan-300/20 blur-[120px]" />
          <div className="absolute left-[-6rem] bottom-0 h-[20rem] w-[20rem] rounded-full bg-lime-300/20 blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.05),transparent_45%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(5,150,105,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(5,150,105,0.06)_1px,transparent_1px)] bg-[size:52px_52px] opacity-45" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-6 pb-20 pt-32 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-12 lg:pt-36">
          <motion.div {...sectionFade(0.05)} className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              <Sparkles className="h-4 w-4" />
              Real-Time Green Infrastructure Platform
            </div>

            <div className="space-y-6">
              <h1 className="font-display text-[clamp(2.9rem,8vw,6rem)] leading-[0.98] tracking-[-0.04em] text-slate-950">
                Build Living Spaces
                <span className="block bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  That Perform Every Day
                </span>
              </h1>

              <p className="max-w-2xl text-lg leading-relaxed text-slate-700 sm:text-xl">
                Vriksham connects design, maintenance, and reporting in one operating system.
                Your teams see live plant health, live service status, and live impact data from a running platform.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900"
              >
                Plan Your Deployment
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/70 px-6 py-3.5 text-sm font-semibold text-slate-800 backdrop-blur transition-all duration-300 hover:border-emerald-400/60 hover:text-emerald-700"
              >
                Browse Live Catalog
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-lg shadow-emerald-900/5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Data Integrity</p>
                <p className="mt-1 text-sm font-medium text-slate-800">Live operational feeds only</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-lg shadow-emerald-900/5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Service Rhythm</p>
                <p className="mt-1 text-sm font-medium text-slate-800">Field actions tracked in platform</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-lg shadow-emerald-900/5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Reporting</p>
                <p className="mt-1 text-sm font-medium text-slate-800">Client and ESG outputs ready</p>
              </div>
            </div>
          </motion.div>

          <motion.div {...sectionFade(0.15)} className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-white/90 bg-white/75 p-4 shadow-2xl shadow-emerald-950/10 backdrop-blur-xl">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem]">
                <Image
                  src={IMAGES.hero.greenWall}
                  alt="Living green wall installation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-900/15 to-transparent" />

                <div className="absolute left-4 right-4 top-4 flex items-center justify-between rounded-2xl border border-white/20 bg-slate-950/40 px-3 py-2 text-xs text-white/90 backdrop-blur-lg">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    {isLoading ? 'Syncing live catalog...' : `Synced: ${lastSyncedAt || 'just now'}`}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-0.5">
                    <Leaf className="h-3 w-3" />
                    Live
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 grid gap-2 rounded-2xl border border-white/20 bg-slate-950/55 p-4 text-white backdrop-blur-lg sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200">Active Species</p>
                    <p className="mt-1 text-2xl font-semibold">{totalSpecies > 0 ? totalSpecies : '--'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200">Category Coverage</p>
                    <p className="mt-1 text-2xl font-semibold">
                      {marketplaceSummary.categoryCount > 0 ? marketplaceSummary.categoryCount : '--'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200">Easy Care Ratio</p>
                    <p className="mt-1 text-2xl font-semibold">
                      {plants.length > 0 ? `${marketplaceSummary.easyCareRatio}%` : '--'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200">Sunlight Profiles</p>
                    <p className="mt-1 text-2xl font-semibold">
                      {marketplaceSummary.sunlightProfiles > 0 ? marketplaceSummary.sunlightProfiles : '--'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <motion.div {...sectionFade(0)} className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Live Catalog Snapshot</p>
            <h2 className="mt-3 max-w-3xl font-display text-[clamp(2rem,4vw,3.6rem)] leading-[1.03] tracking-[-0.03em] text-slate-950">
              Real species data from your running marketplace
            </h2>
          </div>
          <Link href="/marketplace" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800">
            Open full marketplace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`catalog-skeleton-${index}`}
                className="h-[18rem] animate-pulse rounded-3xl border border-emerald-100 bg-emerald-50/60"
              />
            ))}
          </div>
        ) : loadError ? (
          <div className="mt-10 rounded-3xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700">
            <p className="font-semibold">Live catalog unavailable</p>
            <p className="mt-1 text-sm">{loadError}</p>
          </div>
        ) : featuredPlants.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-6 text-slate-700">
            <p className="font-semibold">No active catalog entries available yet.</p>
            <p className="mt-1 text-sm">Add active species to start showcasing your live marketplace feed.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPlants.map((plant, index) => {
              const slug = resolvePlantSlug(plant);
              const name = resolvePlantName(plant);
              const scientificName =
                typeof plant.scientificName === 'string' && plant.scientificName.trim().length > 0
                  ? plant.scientificName.trim()
                  : 'Scientific name pending';
              const category =
                typeof plant.category === 'string' && plant.category.trim().length > 0
                  ? plant.category.trim()
                  : 'Uncategorized';
              const light =
                typeof plant.careInstructions?.sunlight === 'string' && plant.careInstructions.sunlight.trim().length > 0
                  ? plant.careInstructions.sunlight.trim()
                  : 'Light profile pending';

              return (
                <motion.article
                  key={`${slug}-${index}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: '-100px' }}
                  className="group overflow-hidden rounded-3xl border border-emerald-100/80 bg-white shadow-lg shadow-emerald-950/5"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={resolvePlantImage(plant)}
                      alt={name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <p className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border border-white/30 bg-slate-950/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                      <Sun className="h-3 w-3" />
                      {light}
                    </p>
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-950">{name}</h3>
                      <p className="mt-1 text-sm italic text-slate-600">{scientificName}</p>
                    </div>

                    <p className="line-clamp-2 text-sm leading-relaxed text-slate-700">
                      {typeof plant.description === 'string' && plant.description.trim().length > 0
                        ? plant.description.trim()
                        : 'Detailed species profile is available in the marketplace detail page.'}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-700">
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">{category}</span>
                      <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1">
                        {formatDifficulty(plant.difficulty)}
                      </span>
                    </div>

                    <Link
                      href={`/marketplace/${slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
                    >
                      View live profile
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>

      <section className="relative border-y border-emerald-100/60 bg-gradient-to-b from-white to-emerald-50/40 py-20">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <motion.div {...sectionFade(0)} className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Operations Architecture</p>
            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.03em] text-slate-950">
              A platform built for real teams and real daily operations
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {orchestrationCards.map((card, index) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: '-100px' }}
                className="relative overflow-hidden rounded-3xl border border-emerald-100/80 bg-white p-6 shadow-lg shadow-emerald-950/5"
              >
                <div
                  className={cn(
                    'mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white',
                    card.accent,
                  )}
                >
                  <card.icon className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-semibold text-slate-950">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">{card.summary}</p>

                <Link
                  href={card.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
                >
                  {card.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <motion.div {...sectionFade(0)} className="rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-10 text-white sm:px-10">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Workspace Access</p>
              <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,3.2rem)] leading-[1.05] tracking-[-0.03em]">
                Every function runs in one connected operating layer
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                Move from public discovery to role-specific execution without broken routes,
                mock dashboards, or placeholder flows.
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-all hover:-translate-y-0.5"
            >
              Create Live Workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {workspaceRoutes.map((route, index) => (
              <motion.div
                key={route.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                viewport={{ once: true, margin: '-100px' }}
                className="rounded-2xl border border-white/15 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold">{route.title}</p>
                    <p className="mt-1 text-sm text-slate-300">{route.detail}</p>
                  </div>
                  <Link
                    href={route.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-emerald-300 transition-colors hover:text-emerald-200"
                  >
                    Enter
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/10 pt-6 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              No demo credentials exposed on public pages
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              Marketplace and dashboards linked to live data paths
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
