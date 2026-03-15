'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  Leaf,
  Sun,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { plants, type Plant, formatPrice } from './_data';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const categories = [
  'All',
  'Indoor',
  'Outdoor',
  'Succulents',
  'Palms',
  'Ferns',
  'Flowering',
  'Air Purifying',
] as const;

const lightOptions = ['All', 'Low', 'Medium', 'Bright'] as const;
const sizeOptions = ['All', 'Small', 'Medium', 'Large'] as const;

const priceRanges = [
  { value: 'all', label: 'All Prices' },
  { value: '0-300', label: 'Under \u20B9300' },
  { value: '300-500', label: '\u20B9300 \u2013 \u20B9500' },
  { value: '500-1000', label: '\u20B9500 \u2013 \u20B91,000' },
  { value: '1000-above', label: 'Above \u20B91,000' },
] as const;

const sortOptions = [
  { value: 'popular', label: 'Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
] as const;

const ITEMS_PER_PAGE = 9;

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getLightColor(level: string): string {
  switch (level) {
    case 'Bright':
      return 'text-amber-500';
    case 'Medium':
      return 'text-yellow-500';
    case 'Low':
      return 'text-blue-400';
    default:
      return 'text-gray-400';
  }
}

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={cn(
              'h-3.5 w-3.5',
              s <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-200'
            )}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">({reviews})</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Plant Card
// ---------------------------------------------------------------------------

function PlantCard({ plant }: { plant: Plant }) {
  return (
    <Link href={`/marketplace/${plant.slug}`} className="block h-full">
      <motion.div
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-2xl',
          'bg-white border border-gray-100',
          'shadow-sm hover:shadow-xl hover:shadow-emerald-900/10',
          'transition-shadow duration-300'
        )}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Image placeholder */}
        <div
          className={cn(
            'relative h-56 overflow-hidden bg-gradient-to-br',
            plant.gradient
          )}
        >
          <Leaf className="absolute inset-0 m-auto h-16 w-16 text-white/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {plant.isBestseller && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md">
                <Sparkles className="h-3 w-3" />
                Bestseller
              </span>
            )}
            {plant.isNew && (
              <span className="inline-flex items-center rounded-full bg-blue-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md">
                New
              </span>
            )}
          </div>

          {/* Discount tag */}
          {plant.originalPrice && (
            <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
              {Math.round(
                ((plant.originalPrice - plant.price) / plant.originalPrice) * 100
              )}
              % OFF
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
          {/* Tags row */}
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600'
              )}
            >
              <Sun className={cn('h-3 w-3', getLightColor(plant.light))} />
              {plant.light}
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600">
              {plant.size}
            </span>
            <Badge
              variant={plant.health === 'Excellent' ? 'success' : 'default'}
              className="text-[11px] px-2 py-0.5"
            >
              {plant.health}
            </Badge>
          </div>

          {/* Name */}
          <h3 className="text-base font-semibold text-gray-900 tracking-tight">
            {plant.name}
          </h3>
          <p className="mt-0.5 text-xs text-gray-400 italic">
            {plant.scientificName}
          </p>

          {/* Rating */}
          <div className="mt-2">
            <StarRating rating={plant.rating} reviews={plant.reviews} />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price + CTA */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(plant.price)}
              </span>
              {plant.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(plant.originalPrice)}
                </span>
              )}
            </div>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Filter Pill Button
// ---------------------------------------------------------------------------

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
        active
          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
          : 'bg-white/80 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200'
      )}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Marketplace Page
// ---------------------------------------------------------------------------

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLight, setSelectedLight] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLight, selectedSize, selectedPrice]);

  // Filtered & sorted plants
  const filteredPlants = useMemo(() => {
    let result = [...plants];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.scientificName.toLowerCase().includes(q) ||
          p.category.some((c) => c.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category.includes(selectedCategory));
    }

    // Light
    if (selectedLight !== 'All') {
      result = result.filter((p) => p.light === selectedLight);
    }

    // Size
    if (selectedSize !== 'All') {
      result = result.filter((p) => p.size === selectedSize);
    }

    // Price range
    switch (selectedPrice) {
      case '0-300':
        result = result.filter((p) => p.price < 300);
        break;
      case '300-500':
        result = result.filter((p) => p.price >= 300 && p.price <= 500);
        break;
      case '500-1000':
        result = result.filter((p) => p.price >= 500 && p.price <= 1000);
        break;
      case '1000-above':
        result = result.filter((p) => p.price > 1000);
        break;
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        result.sort(
          (a, b) => b.rating * b.reviews - a.rating * a.reviews
        );
    }

    return result;
  }, [
    searchQuery,
    selectedCategory,
    selectedLight,
    selectedSize,
    selectedPrice,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPlants.length / ITEMS_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPlants = filteredPlants.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  // Active filters for display
  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedLight !== 'All' ||
    selectedSize !== 'All' ||
    selectedPrice !== 'all';

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedLight('All');
    setSelectedSize('All');
    setSelectedPrice('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 via-white to-gray-50/50">
      {/* ================================================================= */}
      {/* HERO SECTION                                                       */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5" />
          <div className="absolute left-1/4 top-1/3 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />
          <Leaf className="absolute left-[10%] top-[20%] h-20 w-20 rotate-[-20deg] text-white/[0.04]" />
          <Leaf className="absolute right-[15%] top-[30%] h-16 w-16 rotate-[30deg] text-white/[0.04]" />
          <Leaf className="absolute left-[60%] bottom-[15%] h-24 w-24 rotate-[15deg] text-white/[0.04]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-32 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-emerald-50 backdrop-blur-sm">
              <Leaf className="h-4 w-4" />
              Over 100+ Plant Varieties
            </span>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Explore Our Plant
              <br />
              <span className="bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">
                Collection
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-emerald-100/90 sm:text-xl">
              From desktop succulents to towering palms &mdash; find the
              perfect green companion for every space in your life
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="relative mx-auto max-w-xl">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search plants by name, species, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'h-14 w-full rounded-2xl border-0 bg-white/95 pl-12 pr-5',
                  'text-base text-gray-900 placeholder-gray-400',
                  'shadow-2xl shadow-emerald-900/20 backdrop-blur-xl',
                  'focus:outline-none focus:ring-4 focus:ring-white/30',
                  'transition-shadow duration-300'
                )}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* MAIN CONTENT                                                       */}
      {/* ================================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Category pills */}
        <motion.div
          className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {categories.map((cat) => (
            <FilterPill
              key={cat}
              label={cat}
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </motion.div>

        {/* Toolbar: results count, filter toggle, sort */}
        <motion.div
          className="mb-6 flex flex-wrap items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">
                {filteredPlants.length}
              </span>{' '}
              plant{filteredPlants.length !== 1 ? 's' : ''} found
            </p>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
              >
                <X className="h-3 w-3" />
                Clear filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
                showFilters
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                  {
                    [selectedLight, selectedSize, selectedPrice].filter(
                      (v) => v !== 'All' && v !== 'all'
                    ).length
                  }
                </span>
              )}
            </button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-10 w-48 text-sm" size="sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Expandable filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div
                className={cn(
                  'mb-8 grid grid-cols-1 gap-6 rounded-2xl border border-gray-100',
                  'bg-white/80 p-6 backdrop-blur-xl shadow-sm',
                  'sm:grid-cols-3'
                )}
              >
                {/* Light filter */}
                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Light Requirement
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {lightOptions.map((opt) => (
                      <FilterPill
                        key={opt}
                        label={opt === 'All' ? 'Any Light' : `${opt} Light`}
                        active={selectedLight === opt}
                        onClick={() => setSelectedLight(opt)}
                      />
                    ))}
                  </div>
                </div>

                {/* Size filter */}
                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Plant Size
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((opt) => (
                      <FilterPill
                        key={opt}
                        label={opt === 'All' ? 'Any Size' : opt}
                        active={selectedSize === opt}
                        onClick={() => setSelectedSize(opt)}
                      />
                    ))}
                  </div>
                </div>

                {/* Price filter */}
                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Price Range
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map((opt) => (
                      <FilterPill
                        key={opt.value}
                        label={opt.label}
                        active={selectedPrice === opt.value}
                        onClick={() => setSelectedPrice(opt.value)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filter tags */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              className="mb-6 flex flex-wrap gap-2"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {selectedCategory !== 'All' && (
                <Badge
                  variant="default"
                  onRemove={() => setSelectedCategory('All')}
                >
                  {selectedCategory}
                </Badge>
              )}
              {selectedLight !== 'All' && (
                <Badge
                  variant="default"
                  onRemove={() => setSelectedLight('All')}
                >
                  {selectedLight} Light
                </Badge>
              )}
              {selectedSize !== 'All' && (
                <Badge
                  variant="default"
                  onRemove={() => setSelectedSize('All')}
                >
                  {selectedSize}
                </Badge>
              )}
              {selectedPrice !== 'all' && (
                <Badge
                  variant="default"
                  onRemove={() => setSelectedPrice('all')}
                >
                  {priceRanges.find((p) => p.value === selectedPrice)?.label}
                </Badge>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* =============================================================== */}
        {/* PLANT GRID                                                       */}
        {/* =============================================================== */}
        {paginatedPlants.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={`${safePage}-${sortBy}-${selectedCategory}-${selectedLight}-${selectedSize}-${selectedPrice}-${searchQuery}`}
          >
            {paginatedPlants.map((plant) => (
              <motion.div key={plant.id} variants={itemVariants}>
                <PlantCard plant={plant} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center py-24 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <Leaf className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              No plants found
            </h3>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Try adjusting your search or filters to discover more plants in
              our collection.
            </p>
            <Button
              variant="secondary"
              className="mt-6"
              onClick={clearAllFilters}
            >
              Clear all filters
            </Button>
          </motion.div>
        )}

        {/* =============================================================== */}
        {/* PAGINATION                                                       */}
        {/* =============================================================== */}
        {totalPages > 1 && (
          <motion.div
            className="mt-12 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl transition-all',
                safePage <= 1
                  ? 'cursor-not-allowed text-gray-300'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-all',
                    page === safePage
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={safePage >= totalPages}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl transition-all',
                safePage >= totalPages
                  ? 'cursor-not-allowed text-gray-300'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}

        {/* Bottom spacer */}
        <div className="h-16" />
      </section>
    </div>
  );
}
