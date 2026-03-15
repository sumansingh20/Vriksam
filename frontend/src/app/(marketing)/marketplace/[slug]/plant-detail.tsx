'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Leaf,
  Sun,
  Droplets,
  Thermometer,
  Wind,
  Check,
  ShoppingCart,
  RefreshCw,
  ChevronRight,
  Home,
  Star,
  Truck,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { plants, type Plant, formatPrice } from '../_data';

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

// ---------------------------------------------------------------------------
// Care icon helper
// ---------------------------------------------------------------------------

function CareIcon({ type }: { type: keyof Plant['careInstructions'] }) {
  const iconClass = 'h-6 w-6';
  switch (type) {
    case 'light':
      return <Sun className={cn(iconClass, 'text-amber-500')} />;
    case 'water':
      return <Droplets className={cn(iconClass, 'text-blue-500')} />;
    case 'temperature':
      return <Thermometer className={cn(iconClass, 'text-red-400')} />;
    case 'humidity':
      return <Wind className={cn(iconClass, 'text-teal-500')} />;
  }
}

const careLabels: Record<keyof Plant['careInstructions'], string> = {
  light: 'Light',
  water: 'Water',
  temperature: 'Temperature',
  humidity: 'Humidity',
};

// ---------------------------------------------------------------------------
// Star rating
// ---------------------------------------------------------------------------

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={cn(
              'h-4 w-4',
              s <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-200'
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-gray-700">{rating}</span>
      <span className="text-sm text-gray-400">({reviews} reviews)</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Related Plant Card
// ---------------------------------------------------------------------------

function RelatedPlantCard({ plant }: { plant: Plant }) {
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
            plant.gradient
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
            {formatPrice(plant.price)}
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
  const plant = plants.find((p) => p.slug === slug);

  const relatedPlants = useMemo(() => {
    if (!plant) return [];
    return plants
      .filter(
        (p) =>
          p.id !== plant.id &&
          p.category.some((c) => plant.category.includes(c))
      )
      .slice(0, 4);
  }, [plant]);

  const monthlyPrice = plant ? Math.floor(plant.price * 0.7) : 0;

  // Not found state
  if (!plant) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
          <Leaf className="h-10 w-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Plant not found</h1>
        <p className="mt-2 text-gray-500">
          The plant you are looking for does not exist or may have been removed.
        </p>
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
        {/* MAIN CONTENT: IMAGE + INFO                                       */}
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
                plant.gradient
              )}
            >
              <Leaf className="absolute inset-0 m-auto h-32 w-32 text-white/15" />

              {/* Top badges */}
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {plant.isBestseller && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    Bestseller
                  </span>
                )}
                {plant.isNew && (
                  <span className="inline-flex items-center rounded-full bg-blue-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    New Arrival
                  </span>
                )}
              </div>

              {/* Discount */}
              {plant.originalPrice && (
                <span className="absolute right-4 top-4 rounded-full bg-red-500/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  {Math.round(
                    ((plant.originalPrice - plant.price) /
                      plant.originalPrice) *
                      100
                  )}
                  % OFF
                </span>
              )}
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
              {plant.category.map((cat) => (
                <Badge key={cat} variant="outline" className="text-xs">
                  {cat}
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

            {/* Rating */}
            <div className="mt-4">
              <StarRating rating={plant.rating} reviews={plant.reviews} />
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(plant.price)}
              </span>
              {plant.originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(plant.originalPrice)}
                  </span>
                  <Badge variant="success" className="text-xs">
                    Save {formatPrice(plant.originalPrice - plant.price)}
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            <p className="mt-6 text-base leading-relaxed text-gray-600">
              {plant.description}
            </p>

            {/* Quick info */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Sun className="h-4 w-4 text-amber-500" />
                {plant.light} Light
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Leaf className="h-4 w-4 text-emerald-500" />
                {plant.size} Size
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Badge
                  variant={
                    plant.health === 'Excellent' ? 'success' : 'default'
                  }
                  className="text-xs"
                >
                  {plant.health} Health
                </Badge>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/marketplace/cart" className="flex-1">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  leftIcon={<ShoppingCart className="h-5 w-5" />}
                >
                  Add to Cart &mdash; {formatPrice(plant.price)}
                </Button>
              </Link>

              <Link href="/marketplace/cart" className="flex-1">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  leftIcon={<RefreshCw className="h-5 w-5" />}
                >
                  Subscribe Monthly &mdash; {formatPrice(monthlyPrice)}/mo
                </Button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-6 flex flex-wrap gap-6 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4" />
                Free delivery above {'\u20B9'}499
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
            {(
              Object.keys(plant.careInstructions) as Array<
                keyof typeof plant.careInstructions
              >
            ).map((key) => (
              <motion.div
                key={key}
                variants={staggerItem}
                className={cn(
                  'rounded-2xl border border-gray-100 bg-white/80 p-6',
                  'backdrop-blur-xl shadow-sm transition-shadow hover:shadow-md'
                )}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
                    <CareIcon type={key} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {careLabels[key]}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-500">
                  {plant.careInstructions[key]}
                </p>
              </motion.div>
            ))}
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
            Health Benefits
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {plant.benefits.map((benefit, index) => (
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
              {relatedPlants.map((rp) => (
                <motion.div key={rp.id} variants={staggerItem}>
                  <RelatedPlantCard plant={rp} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
