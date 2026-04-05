'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  SlidersHorizontal,
  Leaf,
  Sun,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Boxes,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import marketplaceService, {
  type MarketplaceCatalogItem,
  formatMarketplaceCurrency,
} from '@/services/marketplace.service';

const lightOptions = ['All', 'LOW', 'MEDIUM', 'HIGH', 'DIRECT_SUNLIGHT'] as const;
const difficultyOptions = ['All', 'EASY', 'MODERATE', 'HARD', 'EXPERT'] as const;

const priceRanges = [
  { value: 'all', label: 'All prices' },
  { value: '0-300', label: 'Under INR 300' },
  { value: '300-500', label: 'INR 300 - INR 500' },
  { value: '500-1000', label: 'INR 500 - INR 1,000' },
  { value: '1000-above', label: 'Above INR 1,000' },
] as const;

const sortOptions = [
  { value: 'popular', label: 'Most installed' },
  { value: 'health', label: 'Best health ratio' },
  { value: 'price-asc', label: 'Cost: Low to High' },
  { value: 'price-desc', label: 'Cost: High to Low' },
  { value: 'newest', label: 'Recently updated' },
  { value: 'name', label: 'Name (A-Z)' },
] as const;

const ITEMS_PER_PAGE = 9;

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
    transition: { type: 'spring', stiffness: 240, damping: 22 },
  },
};

function toTitle(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getLightColor(level: string): string {
  switch (level) {
    case 'DIRECT_SUNLIGHT':
      return 'text-amber-500';
    case 'HIGH':
      return 'text-yellow-500';
    case 'MEDIUM':
      return 'text-lime-500';
    case 'LOW':
      return 'text-sky-500';
    default:
      return 'text-gray-400';
  }
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

function getHealthBadgeClass(healthBand: MarketplaceCatalogItem['healthBand']): string {
  if (healthBand === 'Excellent') return 'bg-emerald-500/10 text-emerald-700';
  if (healthBand === 'Good') return 'bg-sky-500/10 text-sky-700';
  if (healthBand === 'Needs Attention') return 'bg-amber-500/10 text-amber-700';
  return 'bg-gray-100 text-gray-600';
}

function getDisplayCost(item: MarketplaceCatalogItem): number | null {
  return item.minUnitCost ?? item.averageUnitCost ?? null;
}

function matchesPriceRange(item: MarketplaceCatalogItem, selectedPrice: string): boolean {
  if (selectedPrice === 'all') return true;

  const cost = getDisplayCost(item);
  if (cost === null) return false;

  switch (selectedPrice) {
    case '0-300':
      return cost < 300;
    case '300-500':
      return cost >= 300 && cost <= 500;
    case '500-1000':
      return cost >= 500 && cost <= 1000;
    case '1000-above':
      return cost > 1000;
    default:
      return true;
  }
}

function PlantCard({ item, index }: { item: MarketplaceCatalogItem; index: number }) {
  const estimatedCost = getDisplayCost(item);
  const healthPercent = item.plantCount > 0 ? Math.round(item.healthRatio * 100) : 0;

  return (
    <Link href={`/marketplace/${item.slug}`} className="block h-full">
      <motion.div
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white',
          'shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-emerald-900/10'
        )}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
      >
        <div className={cn('relative h-56 overflow-hidden bg-gradient-to-br', getCardGradient(item, index))}>
          <Leaf className="absolute inset-0 m-auto h-16 w-16 text-white/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />

          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {item.inventoryQuantity > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-900/20 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                <Boxes className="h-3 w-3" />
                In stock
              </span>
            )}
            {item.healthBand === 'Excellent' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                <Sparkles className="h-3 w-3" />
                High performing
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
          <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600">
              <Sun className={cn('h-3 w-3', getLightColor(item.lightRequirement))} />
              {toTitle(item.lightRequirement)}
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600">
              {toTitle(item.difficulty)}
            </span>
            <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold', getHealthBadgeClass(item.healthBand))}>
              {item.healthBand}
            </span>
          </div>

          <h3 className="text-base font-semibold tracking-tight text-gray-900">{item.name}</h3>
          <p className="mt-0.5 text-xs italic text-gray-400">{item.scientificName}</p>

          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
            {item.description || 'Healthy, managed plant species from active Vriksham sites.'}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="rounded-lg bg-gray-50 px-2.5 py-2">
              <p className="text-[11px] uppercase tracking-wide text-gray-400">Installed</p>
              <p className="mt-0.5 text-sm font-semibold text-gray-800">{item.plantCount.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-2.5 py-2">
              <p className="text-[11px] uppercase tracking-wide text-gray-400">Healthy</p>
              <p className="mt-0.5 text-sm font-semibold text-gray-800">{healthPercent}%</p>
            </div>
          </div>

          <div className="flex-1" />

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-gray-400">Estimated unit cost</p>
              <p className="text-lg font-bold text-gray-900">
                {estimatedCost !== null ? formatMarketplaceCurrency(estimatedCost) : 'Quote on request'}
              </p>
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
      type="button"
      onClick={onClick}
      className={cn(
        'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
        active
          ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
          : 'border-gray-200 bg-white/80 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
      )}
    >
      {label}
    </button>
  );
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLight, setSelectedLight] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const catalogQuery = useQuery({
    queryKey: ['marketplace', 'catalog'],
    queryFn: () => marketplaceService.getCatalog({ limit: 240, sortBy: 'popular' }),
    staleTime: 2 * 60 * 1000,
  });

  const catalogItems = useMemo(
    () => catalogQuery.data?.items ?? [],
    [catalogQuery.data],
  );

  const categories = useMemo(() => {
    const values = new Set<string>();
    catalogItems.forEach((item) => {
      const parts = item.categories.length > 0 ? item.categories : [item.category];
      parts.forEach((value) => {
        const normalized = String(value || '').trim();
        if (normalized) values.add(normalized);
      });
    });

    return ['All', ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [catalogItems]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLight, selectedDifficulty, selectedPrice]);

  const filteredItems = useMemo(() => {
    let result = [...catalogItems];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((item) => {
        const searchable = [
          item.name,
          item.scientificName,
          item.category,
          item.description || '',
          item.difficulty,
          item.lightRequirement,
          ...item.categories,
        ]
          .join(' ')
          .toLowerCase();

        return searchable.includes(q);
      });
    }

    if (selectedCategory !== 'All') {
      result = result.filter((item) => {
        const values = item.categories.length > 0 ? item.categories : [item.category];
        return values.some((value) => value.toLowerCase() === selectedCategory.toLowerCase());
      });
    }

    if (selectedLight !== 'All') {
      result = result.filter((item) => item.lightRequirement === selectedLight);
    }

    if (selectedDifficulty !== 'All') {
      result = result.filter((item) => item.difficulty === selectedDifficulty);
    }

    if (selectedPrice !== 'all') {
      result = result.filter((item) => matchesPriceRange(item, selectedPrice));
    }

    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        result.sort((a, b) => (getDisplayCost(a) ?? Number.MAX_SAFE_INTEGER) - (getDisplayCost(b) ?? Number.MAX_SAFE_INTEGER));
        break;
      case 'price-desc':
        result.sort((a, b) => (getDisplayCost(b) ?? 0) - (getDisplayCost(a) ?? 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'health':
        result.sort((a, b) => b.healthRatio - a.healthRatio);
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.plantCount - a.plantCount);
        break;
    }

    return result;
  }, [
    catalogItems,
    searchQuery,
    selectedCategory,
    selectedLight,
    selectedDifficulty,
    selectedPrice,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredItems.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedLight !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedPrice !== 'all' ||
    searchQuery.trim().length > 0;

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedLight('All');
    setSelectedDifficulty('All');
    setSelectedPrice('all');
    setSearchQuery('');
  };

  const totalManagedPlants = catalogItems.reduce((sum, item) => sum + item.plantCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 via-white to-gray-50/50">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-green-700 to-teal-800">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-white/5" />
          <div className="absolute left-1/4 top-1/3 h-48 w-48 rounded-full bg-emerald-300/15 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-teal-300/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-28 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-emerald-50 backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4" />
              Live catalog from active operations
            </span>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Real Plant Catalog,
              <br />
              <span className="bg-gradient-to-r from-emerald-100 to-teal-100 bg-clip-text text-transparent">
                Real Site Performance
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-emerald-100/90 sm:text-xl">
              Discover species currently managed across Vriksham installations, with live health and inventory signals.
            </p>

            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 text-left sm:grid-cols-3">
              <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-wide text-emerald-100/80">Species</p>
                <p className="mt-1 text-xl font-bold text-white">{catalogItems.length.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-wide text-emerald-100/80">Managed plants</p>
                <p className="mt-1 text-xl font-bold text-white">{totalManagedPlants.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-wide text-emerald-100/80">Data source</p>
                <p className="mt-1 text-xl font-bold text-white">Live API</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="relative mx-auto max-w-xl">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, species, category, or care profile"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className={cn(
                  'h-14 w-full rounded-2xl border-0 bg-white/95 pl-12 pr-5',
                  'text-base text-gray-900 placeholder:text-gray-400',
                  'shadow-2xl shadow-emerald-900/20 backdrop-blur-xl',
                  'focus:outline-none focus:ring-4 focus:ring-white/30'
                )}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {categories.map((category) => (
            <FilterPill
              key={category}
              label={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </motion.div>

        <motion.div
          className="mb-6 flex flex-wrap items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{filteredItems.length}</span> live catalog item
              {filteredItems.length !== 1 ? 's' : ''}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
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
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
                showFilters
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-10 w-52 text-sm" size="sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mb-8 grid grid-cols-1 gap-6 rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur-xl sm:grid-cols-3">
                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Light</h4>
                  <div className="flex flex-wrap gap-2">
                    {lightOptions.map((option) => (
                      <FilterPill
                        key={option}
                        label={option === 'All' ? 'Any Light' : toTitle(option)}
                        active={selectedLight === option}
                        onClick={() => setSelectedLight(option)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Difficulty</h4>
                  <div className="flex flex-wrap gap-2">
                    {difficultyOptions.map((option) => (
                      <FilterPill
                        key={option}
                        label={option === 'All' ? 'Any Level' : toTitle(option)}
                        active={selectedDifficulty === option}
                        onClick={() => setSelectedDifficulty(option)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Estimated Cost</h4>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map((option) => (
                      <FilterPill
                        key={option.value}
                        label={option.label}
                        active={selectedPrice === option.value}
                        onClick={() => setSelectedPrice(option.value)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {catalogQuery.isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="h-56 animate-pulse bg-gradient-to-br from-emerald-100 to-teal-100" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : catalogQuery.isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50/70 p-6 text-sm text-red-700">
            Unable to load live catalog right now. Please refresh in a moment.
          </div>
        ) : paginatedItems.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={`${safePage}-${sortBy}-${selectedCategory}-${selectedLight}-${selectedDifficulty}-${selectedPrice}-${searchQuery}`}
          >
            {paginatedItems.map((item, index) => (
              <motion.div key={item.id} variants={itemVariants}>
                <PlantCard item={item} index={index} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center py-24 text-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <Leaf className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No catalog items found</h3>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Try adjusting your search or filters to view more live plant species.
            </p>
            <Button variant="secondary" className="mt-6" onClick={clearAllFilters}>
              Clear all filters
            </Button>
          </motion.div>
        )}

        {totalPages > 1 && (
          <motion.div
            className="mt-12 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safePage <= 1}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl transition-all',
                safePage <= 1 ? 'cursor-not-allowed text-gray-300' : 'text-gray-600 hover:bg-gray-100'
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
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
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
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

        <div className="h-16" />
      </section>
    </div>
  );
}
