// =============================================================================
// VRIKSHAM Frontend - Utility Functions
// =============================================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// -----------------------------------------------------------------------------
// Tailwind CSS Class Merging
// -----------------------------------------------------------------------------

/**
 * Merges class names using clsx and tailwind-merge to handle Tailwind CSS
 * class conflicts intelligently.
 *
 * @param inputs - Class values (strings, arrays, objects, conditionals)
 * @returns Merged and deduplicated class string
 *
 * @example
 * cn('px-4 py-2', 'px-6')           // "px-6 py-2"
 * cn('text-red-500', isActive && 'text-green-500') // "text-green-500" when isActive
 * cn('bg-white dark:bg-gray-900', className)       // Merges with override
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// -----------------------------------------------------------------------------
// Date & Time Formatting
// -----------------------------------------------------------------------------

/**
 * Returns a human-readable relative time string.
 * Uses natural language like "2 hours ago", "in 3 days", "just now".
 *
 * @param date - ISO date string or Date object
 * @returns Relative time string
 *
 * @example
 * formatRelativeTime('2024-03-15T10:00:00Z') // "3 hours ago"
 * formatRelativeTime(new Date(Date.now() - 60000)) // "1 minute ago"
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const absDiffMs = Math.abs(diffMs);
  const isPast = diffMs > 0;

  const seconds = Math.floor(absDiffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const format = (value: number, unit: string): string => {
    const plural = value !== 1 ? 's' : '';
    return isPast
      ? `${value} ${unit}${plural} ago`
      : `in ${value} ${unit}${plural}`;
  };

  if (seconds < 10) return 'just now';
  if (seconds < 60) return isPast ? 'a few seconds ago' : 'in a few seconds';
  if (minutes === 1) return isPast ? '1 minute ago' : 'in 1 minute';
  if (minutes < 60) return format(minutes, 'minute');
  if (hours === 1) return isPast ? '1 hour ago' : 'in 1 hour';
  if (hours < 24) return format(hours, 'hour');
  if (days === 1) return isPast ? 'yesterday' : 'tomorrow';
  if (days < 7) return format(days, 'day');
  if (weeks === 1) return isPast ? 'last week' : 'next week';
  if (weeks < 5) return format(weeks, 'week');
  if (months === 1) return isPast ? 'last month' : 'next month';
  if (months < 12) return format(months, 'month');
  if (years === 1) return isPast ? 'last year' : 'next year';
  return format(years, 'year');
}

/**
 * Formats a date for display in the UI using date-fns-compatible patterns.
 *
 * @param date - ISO date string or Date object
 * @param formatStr - The format to use (predefined options)
 * @returns Formatted date string
 *
 * @example
 * formatDisplayDate('2024-03-15') // "15 Mar 2024"
 * formatDisplayDate('2024-03-15T10:30:00Z', 'datetime') // "15 Mar 2024, 10:30 AM"
 */
export function formatDisplayDate(
  date: string | Date,
  formatStr: 'short' | 'medium' | 'long' | 'datetime' | 'time' | 'monthYear' = 'medium',
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }

  const options: Record<string, Intl.DateTimeFormatOptions> = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: '2-digit', month: 'short', year: 'numeric' },
    long: { day: '2-digit', month: 'long', year: 'numeric' },
    datetime: {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    },
    time: { hour: '2-digit', minute: '2-digit', hour12: true },
    monthYear: { month: 'short', year: 'numeric' },
  };

  try {
    return new Intl.DateTimeFormat('en-IN', options[formatStr]).format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

// -----------------------------------------------------------------------------
// String Utilities
// -----------------------------------------------------------------------------

/**
 * Extracts initials from a name string.
 * Takes the first letter of the first and last name parts.
 *
 * @param name - Full name string
 * @param maxChars - Maximum number of initials (default: 2)
 * @returns Uppercase initials string
 *
 * @example
 * getInitials('John Doe')       // "JD"
 * getInitials('Jane Mary Smith') // "JS"
 * getInitials('Priya')          // "P"
 * getInitials('')               // "?"
 */
export function getInitials(name: string, maxChars: number = 2): string {
  if (!name || !name.trim()) return '?';

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]![0]?.toUpperCase() ?? '?';

  // Take first and last name initials
  const initials = [parts[0]!, parts[parts.length - 1]!]
    .map((part) => part[0]?.toUpperCase() ?? '')
    .filter(Boolean)
    .slice(0, maxChars)
    .join('');

  return initials || '?';
}

/**
 * Truncates text to a specified length and appends an ellipsis.
 *
 * @param text - The text to truncate
 * @param maxLength - Maximum character length before truncation
 * @param suffix - The suffix to append (default: "...")
 * @returns Truncated text string
 *
 * @example
 * truncateText('Hello World', 5)  // "Hello..."
 * truncateText('Short', 10)       // "Short"
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = '...',
): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + suffix;
}

/**
 * Converts a string to title case.
 *
 * @example
 * toTitleCase('hello world')   // "Hello World"
 * toTitleCase('SNAKE_CASE')    // "Snake Case"
 */
export function toTitleCase(str: string): string {
  return str
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Generates a URL-friendly slug from a string.
 *
 * @example
 * slugify('Hello World!') // "hello-world"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// -----------------------------------------------------------------------------
// Number & Currency Formatting
// -----------------------------------------------------------------------------

/**
 * Formats a currency amount in a compact, human-readable form using INR conventions.
 * Uses Indian numbering (K, L, Cr) with the Rupee symbol.
 *
 * @param amount - The numeric amount
 * @param currency - Currency symbol to use (default: "₹")
 * @returns Compact currency string
 *
 * @example
 * formatCurrencyShort(1500)      // "₹1.5K"
 * formatCurrencyShort(14900)     // "₹14.9K"
 * formatCurrencyShort(150000)    // "₹1.5L"
 * formatCurrencyShort(15000000)  // "₹1.5Cr"
 * formatCurrencyShort(750)       // "₹750"
 */
export function formatCurrencyShort(
  amount: number,
  currency: string = '\u20B9',
): string {
  const absValue = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (absValue >= 10000000) {
    const crores = absValue / 10000000;
    return `${sign}${currency}${crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(1)}Cr`;
  }
  if (absValue >= 100000) {
    const lakhs = absValue / 100000;
    return `${sign}${currency}${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
  }
  if (absValue >= 1000) {
    const thousands = absValue / 1000;
    return `${sign}${currency}${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
  }
  return `${sign}${currency}${absValue}`;
}

/**
 * Formats a number with locale-appropriate thousand separators (Indian numbering system).
 *
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1234567)    // "12,34,567"
 * formatNumber(1234.56, 2) // "1,234.56"
 */
export function formatNumber(value: number, decimals: number = 0): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch {
    return value.toFixed(decimals);
  }
}

/**
 * Formats a full currency amount with proper locale formatting.
 *
 * @param amount - The numeric amount
 * @param currency - ISO currency code (default: 'INR')
 * @returns Full currency-formatted string
 *
 * @example
 * formatCurrency(2999)           // "₹2,999.00"
 * formatCurrency(49.99, 'USD')   // "$49.99"
 */
export function formatCurrency(
  amount: number,
  currency: string = 'INR',
): string {
  const localeMap: Record<string, string> = {
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    AED: 'en-AE',
    SGD: 'en-SG',
  };

  const locale = localeMap[currency] ?? 'en-IN';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `\u20B9${amount.toFixed(2)}`;
  }
}

/**
 * Formats a percentage value.
 *
 * @param value - The percentage value (e.g., 85.5 for 85.5%)
 * @param decimals - Decimal places (default: 1)
 * @returns Formatted percentage string
 *
 * @example
 * formatPercentage(85.5)   // "85.5%"
 * formatPercentage(100)    // "100%"
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// -----------------------------------------------------------------------------
// Async Utilities
// -----------------------------------------------------------------------------

/**
 * Returns a promise that resolves after a specified delay.
 * Useful for debouncing, animations, and testing.
 *
 * @param ms - Number of milliseconds to wait
 * @returns Promise that resolves after the delay
 *
 * @example
 * await sleep(1000); // Wait 1 second
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a debounced version of a function that delays invocation
 * until after the specified wait time has elapsed since the last call.
 *
 * @param fn - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

// -----------------------------------------------------------------------------
// Color & Theme Utilities
// -----------------------------------------------------------------------------

/**
 * Returns the appropriate Tailwind CSS color class for a health score or status.
 *
 * @param score - Health score (0-100)
 * @returns Tailwind color class prefix
 *
 * @example
 * getHealthColorClass(95) // "text-green-500"
 * getHealthColorClass(45) // "text-orange-500"
 */
export function getHealthColorClass(score: number): string {
  if (score >= 90) return 'text-green-500';
  if (score >= 70) return 'text-lime-500';
  if (score >= 50) return 'text-amber-500';
  if (score >= 30) return 'text-orange-500';
  if (score >= 1) return 'text-red-500';
  return 'text-gray-500';
}

/**
 * Returns the appropriate Tailwind CSS background color class for a health score.
 *
 * @param score - Health score (0-100)
 * @returns Tailwind background color class
 */
export function getHealthBgClass(score: number): string {
  if (score >= 90) return 'bg-green-100 dark:bg-green-900/30';
  if (score >= 70) return 'bg-lime-100 dark:bg-lime-900/30';
  if (score >= 50) return 'bg-amber-100 dark:bg-amber-900/30';
  if (score >= 30) return 'bg-orange-100 dark:bg-orange-900/30';
  if (score >= 1) return 'bg-red-100 dark:bg-red-900/30';
  return 'bg-gray-100 dark:bg-gray-900/30';
}

/**
 * Returns a badge variant based on a status string.
 *
 * @param status - The status string
 * @returns Badge variant class name
 */
export function getStatusBadgeVariant(
  status: string,
): 'default' | 'success' | 'warning' | 'destructive' | 'secondary' {
  const normalizedStatus = status.toLowerCase().replace(/[_\s]/g, '');

  const successStatuses = ['active', 'completed', 'paid', 'excellent', 'good', 'healthy', 'available', 'instock'];
  const warningStatuses = ['paused', 'pending', 'fair', 'warning', 'scheduled', 'lowstock', 'overdue', 'needsattention'];
  const destructiveStatuses = ['cancelled', 'failed', 'critical', 'dead', 'suspended', 'outofstock', 'inactive'];

  if (successStatuses.includes(normalizedStatus)) return 'success';
  if (warningStatuses.includes(normalizedStatus)) return 'warning';
  if (destructiveStatuses.includes(normalizedStatus)) return 'destructive';
  return 'default';
}

// -----------------------------------------------------------------------------
// Miscellaneous Utilities
// -----------------------------------------------------------------------------

/**
 * Safely parses a JSON string, returning a default value on failure.
 *
 * @param json - The JSON string to parse
 * @param fallback - Default value if parsing fails
 * @returns Parsed value or fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Copies text to the clipboard using the Clipboard API.
 *
 * @param text - The text to copy
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Checks if the current environment is a browser.
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Checks if the current environment is a server (SSR).
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Generates a random hex color string.
 */
export function randomColor(): string {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;
}

/**
 * Downloads a file from a URL or blob.
 *
 * @param url - The file URL or blob URL
 * @param filename - The desired filename
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Calculates a safe percentage, avoiding division by zero.
 *
 * @param value - The numerator
 * @param total - The denominator
 * @param decimals - Decimal places (default: 1)
 * @returns Percentage value
 */
export function calcPercentage(value: number, total: number, decimals: number = 1): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Clamps a value between a minimum and maximum.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Pluralizes a word based on a count.
 *
 * @param count - The number of items
 * @param singular - Singular form
 * @param plural - Plural form (default: singular + 's')
 * @returns The appropriate form
 *
 * @example
 * pluralize(1, 'plant')  // "1 plant"
 * pluralize(5, 'plant')  // "5 plants"
 * pluralize(0, 'leaf', 'leaves') // "0 leaves"
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const form = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${count} ${form}`;
}

/**
 * Returns a consistent avatar URL for a user. Falls back to UI Avatars.
 *
 * @param name - User name for generating initials
 * @param avatarUrl - Optional existing avatar URL
 * @returns Avatar URL string
 */
export function getAvatarUrl(name: string, avatarUrl?: string): string {
  if (avatarUrl) return avatarUrl;
  const initials = getInitials(name);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=16a34a&color=fff&size=128`;
}
