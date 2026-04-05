'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Leaf,
  ArrowRight,
  Truck,
  Shield,
  Package,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  clearMarketplaceCart,
  getMarketplaceCart,
  removeMarketplaceCartItem,
  setMarketplaceCart,
  type MarketplaceCartEntry,
  updateMarketplaceCartItem,
} from '@/lib/marketplace-cart';
import marketplaceService, {
  formatMarketplaceCurrency,
  type MarketplaceCatalogItem,
} from '@/services/marketplace.service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ResolvedCartItem {
  entry: MarketplaceCartEntry;
  item: MarketplaceCatalogItem;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
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

function getItemCost(item: MarketplaceCatalogItem): number | null {
  return item.minUnitCost ?? item.averageUnitCost ?? null;
}

// ---------------------------------------------------------------------------
// Cart Page
// ---------------------------------------------------------------------------

export default function CartPage() {
  const [cartEntries, setCartEntries] = useState<MarketplaceCartEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const catalogQuery = useQuery({
    queryKey: ['marketplace', 'cart-catalog'],
    queryFn: () => marketplaceService.getCatalog({ limit: 300, sortBy: 'popular' }),
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    setCartEntries(getMarketplaceCart());
    setHydrated(true);
  }, []);

  const catalogItems = useMemo(
    () => catalogQuery.data?.items ?? [],
    [catalogQuery.data],
  );

  const itemById = useMemo(
    () => new Map(catalogItems.map((item) => [item.id, item])),
    [catalogItems],
  );

  const cartItems = useMemo<ResolvedCartItem[]>(
    () =>
      cartEntries
        .map((entry) => ({
          entry,
          item: itemById.get(entry.itemId),
        }))
        .filter((row): row is ResolvedCartItem => Boolean(row.item)),
    [cartEntries, itemById],
  );

  useEffect(() => {
    if (!hydrated || catalogQuery.isLoading) return;

    const validIds = new Set(catalogItems.map((item) => item.id));
    const filtered = cartEntries.filter((entry) => validIds.has(entry.itemId));

    if (filtered.length !== cartEntries.length) {
      setMarketplaceCart(filtered);
      setCartEntries(filtered);
    }
  }, [cartEntries, catalogItems, catalogQuery.isLoading, hydrated]);

  // Handlers
  const updateQuantity = (itemId: string, newQty: number) => {
    const updated = updateMarketplaceCartItem(itemId, newQty);
    setCartEntries(updated);
  };

  const removeItem = (itemId: string) => {
    const updated = removeMarketplaceCartItem(itemId);
    setCartEntries(updated);
  };

  // Price calculations
  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, row) => {
        const unitCost = getItemCost(row.item) ?? 0;
        return sum + unitCost * row.entry.quantity;
      }, 0),
    [cartItems]
  );
  const gstRate = 0.18;
  const gstAmount = subtotal * gstRate;
  const deliveryFee = subtotal >= 499 ? 0 : 49;
  const total = subtotal + gstAmount + deliveryFee;
  const totalItems = cartItems.reduce((sum, row) => sum + row.entry.quantity, 0);

  if (!hydrated || catalogQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading cart and live catalog...
        </div>
      </div>
    );
  }

  if (catalogQuery.isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-center text-sm text-amber-800">
          <div className="mb-2 inline-flex items-center gap-1 font-semibold">
            <AlertTriangle className="h-4 w-4" />
            Unable to load live catalog
          </div>
          <p className="text-xs">Please refresh and try again.</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // EMPTY CART STATE
  // =========================================================================
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50/80 via-white to-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col items-center justify-center py-24 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative mb-8">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-emerald-50">
                <ShoppingCart className="h-14 w-14 text-emerald-300" />
              </div>
              <div className="absolute -right-1 -top-1 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md">
                <Leaf className="h-5 w-5 text-emerald-500" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Your cart is empty
            </h1>
            <p className="mt-3 max-w-md text-base text-gray-500">
              Looks like you have not added any plants to your cart yet.
              Explore our collection and find the perfect green companion.
            </p>

            <Link href="/marketplace" className="mt-8">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Leaf className="h-5 w-5" />}
              >
                Browse Plants
              </Button>
            </Link>

              <button
                type="button"
                onClick={() => {
                  clearMarketplaceCart();
                  setCartEntries([]);
                }}
                className="mt-3 text-xs text-gray-400 underline-offset-2 hover:underline"
              >
                Clear saved cart state
              </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CART WITH ITEMS
  // =========================================================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 via-white to-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ============================================================= */}
          {/* CART ITEMS                                                      */}
          {/* ============================================================= */}
          <motion.div
            className="lg:col-span-2"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence mode="popLayout">
              {cartItems.map((row, index) => {
                const item = row.item;
                const quantity = row.entry.quantity;
                const unitCost = getItemCost(item);
                const lineCost = (unitCost ?? 0) * quantity;

                return (
                <motion.div
                  key={item.id}
                  layout
                  variants={staggerItem}
                  exit={{
                    opacity: 0,
                    x: -40,
                    transition: { duration: 0.3 },
                  }}
                  className={cn(
                    'mb-4 flex gap-4 rounded-2xl border border-gray-100',
                    'bg-white/80 p-4 backdrop-blur-xl shadow-sm',
                    'sm:items-center sm:gap-6 sm:p-6'
                  )}
                >
                  {/* Image */}
                  <Link
                    href={`/marketplace/${item.slug}`}
                    className="shrink-0"
                  >
                    <div
                      className={cn(
                        'flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br sm:h-24 sm:w-24',
                        getCardGradient(item, index)
                      )}
                    >
                      <Leaf className="h-8 w-8 text-white/25" />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                    <div className="flex-1">
                      <Link href={`/marketplace/${item.slug}`}>
                        <h3 className="text-sm font-semibold text-gray-900 transition-colors hover:text-emerald-600 sm:text-base">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs italic text-gray-400">
                        {item.scientificName}
                      </p>
                      <p className="mt-1 text-sm font-bold text-gray-900 sm:hidden">
                        {unitCost != null ? formatMarketplaceCurrency(unitCost) : 'Quote on request'}
                      </p>
                    </div>

                    {/* Price (desktop) */}
                    <div className="hidden w-24 text-right sm:block">
                      <p className="text-sm font-bold text-gray-900">
                        {unitCost != null ? formatMarketplaceCurrency(unitCost) : 'Quote'}
                      </p>
                    </div>

                    {/* Quantity adjuster */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-xl bg-gray-50 p-1">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              quantity - 1
                            )
                          }
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                            quantity <= 1
                              ? 'text-gray-300'
                              : 'text-gray-600 hover:bg-white hover:shadow-sm'
                          )}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold text-gray-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              quantity + 1
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-white hover:shadow-sm"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Item total */}
                      <p className="hidden w-24 text-right text-sm font-bold text-gray-900 sm:block">
                        {unitCost != null ? formatMarketplaceCurrency(lineCost) : 'Quote'}
                      </p>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Continue shopping link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/marketplace"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700"
              >
                <Leaf className="h-4 w-4" />
                Continue Shopping
              </Link>
            </motion.div>
          </motion.div>

          {/* ============================================================= */}
          {/* ORDER SUMMARY                                                  */}
          {/* ============================================================= */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="h-fit"
          >
            <div
              className={cn(
                'rounded-2xl border border-gray-100 bg-white/80 p-6',
                'backdrop-blur-xl shadow-sm'
              )}
            >
              <h2 className="text-lg font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                {/* Line items summary */}
                <div className="space-y-2 border-b border-gray-100 pb-4">
                  {cartItems.map((item) => {
                    const unitCost = getItemCost(item.item);
                    const lineCost = (unitCost ?? 0) * item.entry.quantity;

                    return (
                      <div
                        key={item.item.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-500">
                          {item.item.name} x{item.entry.quantity}
                        </span>
                        <span className="font-medium text-gray-700">
                          {unitCost != null ? formatMarketplaceCurrency(lineCost) : 'Quote'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrencyFull(subtotal)}
                  </span>
                </div>

                {/* GST */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">GST (18%)</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrencyFull(gstAmount)}
                  </span>
                </div>

                {/* Delivery */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span
                    className={cn(
                      'font-medium',
                      deliveryFee === 0
                        ? 'text-emerald-600'
                        : 'text-gray-900'
                    )}
                  >
                    {deliveryFee === 0 ? 'Free' : formatMarketplaceCurrency(deliveryFee)}
                  </span>
                </div>

                {deliveryFee === 0 && (
                  <p className="text-xs text-emerald-600">
                    You qualify for free delivery!
                  </p>
                )}

                {/* Total */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrencyFull(total)}
                    </span>
                  </div>
                  <p className="mt-1 text-right text-xs text-gray-400">
                    Inclusive of all taxes
                  </p>
                </div>
              </div>

              {/* Checkout button */}
              <Button
                variant="primary"
                size="lg"
                className="mt-6 w-full"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Proceed to Checkout
              </Button>

              {/* Trust signals */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <Truck className="h-4 w-4 shrink-0" />
                  <span>
                    Free delivery on orders above INR 499
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <Shield className="h-4 w-4 shrink-0" />
                  <span>7-day replacement guarantee on all plants</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <Package className="h-4 w-4 shrink-0" />
                  <span>Secure, eco-friendly packaging</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
