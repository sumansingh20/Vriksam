'use client';

import { type ElementType, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Leaf,
  Sun,
  Thermometer,
  Wind,
  Check,
  ShoppingCart,
  RefreshCw,
  ChevronRight,
  Home,
  Truck,
  Shield,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Boxes,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  addMarketplaceCartItem,
} from '@/lib/marketplace-cart';
import marketplaceService, {
  type MarketplaceCatalogItem,
  formatMarketplaceCurrency,
} from '@/services/marketplace.service';

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function toTitle(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getCardGradient(item: MarketplaceCatalogItem, index: number): string {
  const firstCategory = (item.categories[0] || item.category || '').toLowerCase();

  if (firstCategory.includes('indoor')) return 'from-emerald-400 to-green-600';
  if (firstCategory.includes('outdoor')) return 'from-sky-400 to-cyan-600';
  if (firstCategory.includes('flower')) return 'from-fuchsia-400 to-rose-500';
  if (firstCategory.includes('succulent')) return 'from-lime-400 to-emerald-500';
  if (firstCategory.includes('palm')) return 'from-teal-400 to-green-700';

  const fallback = [
    'from-emerald-400 to-teal-500',
    'from-amber-400 to-orange-500',
    'from-cyan-400 to-sky-500',
    'from-lime-400 to-emerald-500',
    'from-violet-400 to-fuchsia-500',
  ];

  return fallback[index % fallback.length] ?? 'from-emerald-400 to-teal-500';
}

function getDisplayCost(item: MarketplaceCatalogItem): number | null {
  return item.minUnitCost ?? item.averageUnitCost ?? null;
}

interface CareRow {
  key: string;
  label: string;
  value: string;
  icon: ElementType;
  iconClass: string;
}

function buildCareRows(item: MarketplaceCatalogItem): CareRow[] {
  const temperature =
    item.temperatureMin != null || item.temperatureMax != null
      ? `${item.temperatureMin ?? '-'} C to ${item.temperatureMax ?? '-'} C`
      : 'Standard indoor range';

  return [
    {
      key: 'light',
      label: 'Light',
      value: toTitle(item.lightRequirement),
      icon: Sun,
      iconClass: 'text-amber-500',
    },
    {
      key: 'difficulty',
      label: 'Difficulty',
      value: toTitle(item.difficulty),
      icon: Leaf,
      iconClass: 'text-emerald-500',
    },
    {
      key: 'temperature',
      label: 'Temperature',
      value: temperature,
      icon: Thermometer,
      iconClass: 'text-red-400',
    },
    {
      key: 'humidity',
      label: 'Humidity',
      value: item.humidityPreference || 'Moderate',
      icon: Wind,
      iconClass: 'text-teal-500',
    },
  ];
}

function buildBenefits(item: MarketplaceCatalogItem): string[] {
  const benefits = [
    `${item.healthyPlantCount.toLocaleString('en-IN')} healthy plants out of ${item.plantCount.toLocaleString('en-IN')} active installations.`,
    `${Math.round(item.healthRatio * 100)}% live health ratio tracked across client locations.`,
    `Current inventory supports ${item.inventoryQuantity.toLocaleString('en-IN')} unit placements.`,
  ];

  if (item.careInstructions) {
    benefits.push(item.careInstructions);
  }

  return benefits.slice(0, 5);
}

function HealthScoreTag({ item }: { item: MarketplaceCatalogItem }) {
  const healthPercent = Math.round(item.healthRatio * 100);

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
      <Check className="h-3.5 w-3.5" />
      {healthPercent}% healthy
    </div>
  );
}

// ---------------------------------------------------------------------------
// Related Plant Card
// ---------------------------------------------------------------------------

function RelatedPlantCard({ plant, index }: { plant: MarketplaceCatalogItem; index: number }) {
  const displayCost = getDisplayCost(plant);

  return (
    <Link href={`/marketplace/${plant.slug}`} className="block">
      <motion.div
        className={cn(
          'group overflow-hidden rounded-2xl border border-gray-100 bg-white',
          'shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-emerald-900/10'
        )}
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div
          className={cn(
            'relative h-40 overflow-hidden bg-gradient-to-br',
            getCardGradient(plant, index)
          )}
        >
          <Leaf className="absolute inset-0 m-auto h-10 w-10 text-white/20 transition-transform duration-500 group-hover:scale-110" />
        </div>
        <div className="p-4">
          <h4 className="text-sm font-semibold text-gray-900">
            {plant.name}
          </h4>
          <p className="mt-0.5 text-xs italic text-gray-400">
            {plant.scientificName}
          </p>
          <p className="mt-2 text-sm font-bold text-gray-900">
            {displayCost != null ? formatMarketplaceCurrency(displayCost) : 'Quote on request'}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Plant Detail Component
// ---------------------------------------------------------------------------

export default function PlantDetail({ slug }: { slug: string }) {
  const router = useRouter();
  const plantQuery = useQuery({
    queryKey: ['marketplace', 'item', slug],
    queryFn: () => marketplaceService.getBySlug(slug),
    staleTime: 2 * 60 * 1000,
  });

  const plant = plantQuery.data;

  const catalogQuery = useQuery({
    queryKey: ['marketplace', 'related', slug],
    queryFn: () => marketplaceService.getCatalog({ limit: 120, sortBy: 'popular' }),
    enabled: Boolean(plant),
    staleTime: 2 * 60 * 1000,
  });

  const relatedPlants = useMemo(() => {
    if (!plant) return [] as MarketplaceCatalogItem[];

    const catalogItems = catalogQuery.data?.items ?? [];

    return catalogItems
      .filter(
        (item) =>
          item.id !== plant.id &&
          item.categories.some((value) =>
            plant.categories.some((current) =>
              current.toLowerCase() === value.toLowerCase(),
            ),
          ),
      )
      .slice(0, 4);
  }, [catalogQuery.data?.items, plant]);

  const monthlyPrice = plant ? getDisplayCost(plant) : null;
  const monthlySubscriptionPrice =
    monthlyPrice != null ? Math.max(1, Math.round(monthlyPrice * 0.7)) : null;

  const careRows = useMemo(
    () => (plant ? buildCareRows(plant) : []),
    [plant],
  );

  const benefits = useMemo(
    () => (plant ? buildBenefits(plant) : []),
    [plant],
  );

  const installCountLabel = plant
    ? `${plant.plantCount.toLocaleString('en-IN')} active installs`
    : '';

  const handleAddToCart = () => {
    if (!plant) return;
    addMarketplaceCartItem(plant.id, 1);
    router.push('/marketplace/cart');
  };

  if (plantQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading live plant profile...
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
          <Leaf className="h-10 w-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Plant not available</h1>
        <p className="mt-2 text-gray-500">
          We could not find this species in the live catalog.
        </p>
        {plantQuery.isError && (
          <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5" />
            {plantQuery.error instanceof Error ? plantQuery.error.message : 'Please try again.'}
          </p>
        )}
        <Link href="/marketplace">
          <Button variant="primary" className="mt-6">
            Browse all plants
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 via-white to-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =============================================================== */}
        {/* BREADCRUMBS                                                      */}
        {/* =============================================================== */}
        <motion.nav
          className="mb-8 flex items-center gap-2 text-sm"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="flex items-center gap-1 text-gray-400 transition-colors hover:text-emerald-600"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-300" />
          <Link
            href="/marketplace"
            className="text-gray-400 transition-colors hover:text-emerald-600"
          >
            Marketplace
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-300" />
          <span className="font-medium text-gray-700">{plant.name}</span>
        </motion.nav>

        {/* Back button (mobile) */}
        <motion.div
          className="mb-6 sm:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-gray-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </motion.div>

        {/* =============================================================== */}
        {/* MAIN CONTENT */}
        {/* =============================================================== */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: Image */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <div
              className={cn(
                'relative aspect-square w-full overflow-hidden rounded-3xl bg-gradient-to-br shadow-xl',
                getCardGradient(plant, 0)
              )}
            >
              <Leaf className="absolute inset-0 m-auto h-32 w-32 text-white/15" />

              {/* Top badges */}
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {plant.healthBand === 'Excellent' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    High Performing
                  </span>
                )}
                {plant.inventoryQuantity > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    <Boxes className="h-3.5 w-3.5" />
                    In Stock
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex flex-col"
          >
            {/* Category badges */}
            <div className="mb-3 flex flex-wrap gap-2">
              {(plant.categories.length > 0 ? plant.categories : [plant.category]).map((category) => (
                <Badge key={category} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>

            {/* Name */}
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {plant.name}
            </h1>
            <p className="mt-1 text-base italic text-gray-400">
              {plant.scientificName}
            </p>

            <div className="mt-4">
              <HealthScoreTag item={plant} />
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {monthlyPrice != null ? formatMarketplaceCurrency(monthlyPrice) : 'Quote on request'}
              </span>
              {monthlyPrice != null && monthlySubscriptionPrice != null && (
                <Badge variant="success" className="text-xs">
                  Subscription from {formatMarketplaceCurrency(monthlySubscriptionPrice)}/mo
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="mt-6 text-base leading-relaxed text-gray-600">
              {plant.description || 'Live species profile sourced from active installation data.'}
            </p>

            {/* Quick info */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Sun className="h-4 w-4 text-amber-500" />
                {toTitle(plant.lightRequirement)} Light
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Leaf className="h-4 w-4 text-emerald-500" />
                {toTitle(plant.difficulty)} Care
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Badge variant="default" className="text-xs">
                  {installCountLabel}
                </Badge>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  leftIcon={<ShoppingCart className="h-5 w-5" />}
                  onClick={handleAddToCart}
                  disabled={plant.inventoryQuantity <= 0}
                >
                  {plant.inventoryQuantity > 0
                    ? `Add to Cart - ${monthlyPrice != null ? formatMarketplaceCurrency(monthlyPrice) : 'Quote'}`
                    : 'Out of Stock'}
                </Button>
              </div>

              <Link href="/marketplace/cart" className="flex-1">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  leftIcon={<RefreshCw className="h-5 w-5" />}
                >
                  Subscribe Monthly - {monthlySubscriptionPrice != null ? `${formatMarketplaceCurrency(monthlySubscriptionPrice)}/mo` : 'Contact sales'}
                </Button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-6 flex flex-wrap gap-6 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4" />
                Free delivery above INR 499
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" />
                7-day replacement guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <Leaf className="h-4 w-4" />
                Freshness assured
              </span>
            </div>
          </motion.div>
        </div>

        {/* =============================================================== */}
        {/* CARE INSTRUCTIONS                                                */}
        {/* =============================================================== */}
        <motion.section
          className="mt-16"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900">
            Care Instructions
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {careRows.map((row) => {
              const Icon = row.icon;

              return (
              <motion.div
                key={row.key}
                variants={staggerItem}
                className={cn(
                  'rounded-2xl border border-gray-100 bg-white/80 p-6',
                  'backdrop-blur-xl shadow-sm transition-shadow hover:shadow-md'
                )}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
                    <Icon className={cn('h-6 w-6', row.iconClass)} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {row.label}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-500">
                  {row.value}
                </p>
              </motion.div>
            );
            })}
          </div>
        </motion.section>

        {/* =============================================================== */}
        {/* HEALTH BENEFITS                                                  */}
        {/* =============================================================== */}
        <motion.section
          className="mt-16"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900">
            Operational Insights
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className={cn(
                  'flex items-start gap-4 rounded-2xl border border-gray-100',
                  'bg-white/80 p-5 backdrop-blur-xl shadow-sm'
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-4 w-4" />
                </div>
                <p className="text-sm leading-relaxed text-gray-700">
                  {benefit}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* =============================================================== */}
        {/* RELATED PLANTS                                                   */}
        {/* =============================================================== */}
        {relatedPlants.length > 0 && (
          <motion.section
            className="mt-16 pb-16"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                You Might Also Like
              </h2>
              <Link
                href="/marketplace"
                className="text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700"
              >
                View all plants &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {relatedPlants.map((rp, index) => (
                <motion.div key={rp.id} variants={staggerItem}>
                  <RelatedPlantCard plant={rp} index={index} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
