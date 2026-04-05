export interface MarketplaceCartEntry {
  itemId: string;
  quantity: number;
}

const CART_STORAGE_KEY = 'vriksham_marketplace_cart';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function normalize(entries: MarketplaceCartEntry[]): MarketplaceCartEntry[] {
  return entries
    .map((entry) => ({
      itemId: String(entry.itemId),
      quantity: Math.max(0, Math.floor(Number(entry.quantity) || 0)),
    }))
    .filter((entry) => entry.itemId.length > 0 && entry.quantity > 0);
}

export function getMarketplaceCart(): MarketplaceCartEntry[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as MarketplaceCartEntry[];
    if (!Array.isArray(parsed)) return [];

    return normalize(parsed);
  } catch {
    return [];
  }
}

export function setMarketplaceCart(entries: MarketplaceCartEntry[]): void {
  if (!isBrowser()) return;

  const normalized = normalize(entries);
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalized));
}

export function addMarketplaceCartItem(itemId: string, quantity = 1): MarketplaceCartEntry[] {
  const current = getMarketplaceCart();
  const existing = current.find((entry) => entry.itemId === itemId);

  if (existing) {
    existing.quantity += Math.max(1, Math.floor(quantity));
    setMarketplaceCart(current);
    return current;
  }

  const updated = [...current, { itemId, quantity: Math.max(1, Math.floor(quantity)) }];
  setMarketplaceCart(updated);
  return updated;
}

export function updateMarketplaceCartItem(itemId: string, quantity: number): MarketplaceCartEntry[] {
  const current = getMarketplaceCart();
  const updated = current
    .map((entry) =>
      entry.itemId === itemId
        ? { ...entry, quantity: Math.max(0, Math.floor(quantity)) }
        : entry
    )
    .filter((entry) => entry.quantity > 0);

  setMarketplaceCart(updated);
  return updated;
}

export function removeMarketplaceCartItem(itemId: string): MarketplaceCartEntry[] {
  const current = getMarketplaceCart();
  const updated = current.filter((entry) => entry.itemId !== itemId);
  setMarketplaceCart(updated);
  return updated;
}

export function clearMarketplaceCart(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(CART_STORAGE_KEY);
}
