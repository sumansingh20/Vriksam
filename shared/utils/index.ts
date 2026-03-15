// =============================================================================
// VRIKSHAM Platform - Shared Utility Functions
// =============================================================================

import {
  PlantHealthStatus,
  type PlantSpecies,
} from '../types';

import {
  CO2_ABSORPTION_RATES,
  OXYGEN_PRODUCTION_RATES,
  ENVIRONMENTAL_CONSTANTS,
  HEALTH_SCORE_THRESHOLDS,
  CURRENCY,
  VALIDATION,
  THEME_COLORS,
} from '../constants';

// -----------------------------------------------------------------------------
// Formatting Utilities
// -----------------------------------------------------------------------------

/**
 * Formats an amount as currency with proper locale and symbol.
 *
 * @param amount - The numeric amount to format (in smallest unit, e.g., paise for INR)
 * @param currency - ISO 4217 currency code (default: INR)
 * @param locale - Locale string for formatting (default: en-IN)
 * @param convertFromMinor - If true, divides amount by 100 to convert from minor units
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(299900) // "₹2,999.00"
 * formatCurrency(4999, 'USD', 'en-US') // "$49.99"
 * formatCurrency(2999, 'INR', 'en-IN', false) // "₹2,999.00"
 */
export function formatCurrency(
  amount: number,
  currency: string = CURRENCY.DEFAULT,
  locale: string = CURRENCY.LOCALE,
  convertFromMinor: boolean = false,
): string {
  const value = convertFromMinor ? amount / 100 : amount;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: CURRENCY.DECIMAL_PLACES,
      maximumFractionDigits: CURRENCY.DECIMAL_PLACES,
    }).format(value);
  } catch {
    // Fallback for unsupported currency/locale combos
    return `${CURRENCY.SYMBOL}${value.toFixed(CURRENCY.DECIMAL_PLACES)}`;
  }
}

/**
 * Formats a date string or Date object into a human-readable format.
 *
 * @param date - ISO date string or Date object
 * @param format - Predefined format option
 * @param locale - Locale for formatting (default: en-IN)
 * @returns Formatted date string
 *
 * @example
 * formatDate('2024-03-15T10:30:00Z', 'short') // "15/03/2024"
 * formatDate('2024-03-15', 'long') // "15 March 2024"
 * formatDate('2024-03-15T10:30:00Z', 'datetime') // "15 Mar 2024, 04:00 PM"
 */
export function formatDate(
  date: string | Date,
  format: 'short' | 'medium' | 'long' | 'datetime' | 'time' | 'relative' | 'monthYear' = 'medium',
  locale: string = 'en-IN',
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }

  if (format === 'relative') {
    return getRelativeTimeString(d);
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
    return new Intl.DateTimeFormat(locale, options[format]).format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

/**
 * Returns a human-readable relative time string (e.g., "2 hours ago", "in 3 days").
 */
function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const absDiffMs = Math.abs(diffMs);
  const isPast = diffMs > 0;

  const seconds = Math.floor(absDiffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const wrap = (value: number, unit: string): string => {
    const plural = value !== 1 ? 's' : '';
    return isPast
      ? `${value} ${unit}${plural} ago`
      : `in ${value} ${unit}${plural}`;
  };

  if (seconds < 60) return isPast ? 'just now' : 'in a moment';
  if (minutes < 60) return wrap(minutes, 'minute');
  if (hours < 24) return wrap(hours, 'hour');
  if (days < 7) return wrap(days, 'day');
  if (weeks < 5) return wrap(weeks, 'week');
  if (months < 12) return wrap(months, 'month');
  return wrap(years, 'year');
}

/**
 * Formats a number with locale-appropriate thousand separators.
 *
 * @param value - The number to format
 * @param options - Configuration for decimal places and notation
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1234567) // "12,34,567"
 * formatNumber(1234567, { notation: 'compact' }) // "12L"
 * formatNumber(0.8523, { style: 'percent' }) // "85.23%"
 */
export function formatNumber(
  value: number,
  options: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    notation?: 'standard' | 'compact' | 'scientific' | 'engineering';
    style?: 'decimal' | 'percent';
    unit?: string;
  } = {},
): string {
  const {
    locale = 'en-IN',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    notation = 'standard',
    style = 'decimal',
  } = options;

  try {
    return new Intl.NumberFormat(locale, {
      style,
      notation,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);
  } catch {
    return value.toString();
  }
}

/**
 * Formats a large number with appropriate suffix (K, L, Cr for Indian numbering).
 *
 * @example
 * formatCompactNumber(1500) // "1.5K"
 * formatCompactNumber(150000) // "1.5L"
 * formatCompactNumber(15000000) // "1.5Cr"
 */
export function formatCompactNumber(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 10000000) {
    return `${sign}${(absValue / 10000000).toFixed(1)}Cr`;
  }
  if (absValue >= 100000) {
    return `${sign}${(absValue / 100000).toFixed(1)}L`;
  }
  if (absValue >= 1000) {
    return `${sign}${(absValue / 1000).toFixed(1)}K`;
  }
  return `${sign}${absValue}`;
}

/**
 * Formats a weight value with appropriate unit.
 *
 * @example
 * formatWeight(1500, 'kg') // "1.5 tonnes"
 * formatWeight(0.5, 'kg') // "500 g"
 */
export function formatWeight(value: number, unit: 'kg' | 'g' = 'kg'): string {
  const valueInKg = unit === 'g' ? value / 1000 : value;

  if (valueInKg >= 1000) {
    return `${(valueInKg / 1000).toFixed(2)} tonnes`;
  }
  if (valueInKg >= 1) {
    return `${valueInKg.toFixed(2)} kg`;
  }
  return `${(valueInKg * 1000).toFixed(0)} g`;
}

// -----------------------------------------------------------------------------
// Environmental Calculation Utilities
// -----------------------------------------------------------------------------

/**
 * Calculates the total CO2 absorbed by a collection of plants over a given period.
 *
 * @param plants - Array of objects with speciesKey and optional count
 * @param periodDays - Number of days for the calculation (default: 365)
 * @returns Total CO2 absorbed in kg
 *
 * @example
 * calculateCO2Absorption([
 *   { speciesKey: 'areca_palm', count: 5 },
 *   { speciesKey: 'snake_plant', count: 10 },
 * ], 30)
 * // Returns: (1.84 * 5 + 0.94 * 10) * (30/365) = 1.51 kg
 */
export function calculateCO2Absorption(
  plants: Array<{ speciesKey: string; count?: number }>,
  periodDays: number = 365,
): number {
  const yearFraction = periodDays / 365;

  const totalKgPerYear = plants.reduce((total, plant) => {
    const rate = CO2_ABSORPTION_RATES[plant.speciesKey] ?? CO2_ABSORPTION_RATES['default'];
    const count = plant.count ?? 1;
    return total + rate * count;
  }, 0);

  return Math.round(totalKgPerYear * yearFraction * 100) / 100;
}

/**
 * Calculates CO2 absorption for a single plant based on species data.
 *
 * @param species - PlantSpecies object or co2AbsorptionRate value
 * @param periodDays - Number of days
 * @returns CO2 absorbed in kg
 */
export function calculatePlantCO2(
  species: Pick<PlantSpecies, 'co2AbsorptionRate'> | number,
  periodDays: number = 365,
): number {
  const rate = typeof species === 'number' ? species : species.co2AbsorptionRate;
  return Math.round(rate * (periodDays / 365) * 100) / 100;
}

/**
 * Calculates total oxygen produced by a collection of plants.
 *
 * @param plants - Array of objects with speciesKey and optional count
 * @param periodDays - Number of days for the calculation (default: 365)
 * @returns Total oxygen produced in litres
 *
 * @example
 * calculateOxygenProduction([
 *   { speciesKey: 'areca_palm', count: 5 },
 * ], 30)
 * // Returns: 1.88 * 5 * 30 = 282 litres
 */
export function calculateOxygenProduction(
  plants: Array<{ speciesKey: string; count?: number }>,
  periodDays: number = 365,
): number {
  const totalLitresPerDay = plants.reduce((total, plant) => {
    const rate = OXYGEN_PRODUCTION_RATES[plant.speciesKey] ?? OXYGEN_PRODUCTION_RATES['default'];
    const count = plant.count ?? 1;
    return total + rate * count;
  }, 0);

  return Math.round(totalLitresPerDay * periodDays * 100) / 100;
}

/**
 * Calculates oxygen production for a single plant.
 */
export function calculatePlantOxygen(
  species: Pick<PlantSpecies, 'oxygenProductionRate'> | number,
  periodDays: number = 365,
): number {
  const rate = typeof species === 'number' ? species : species.oxygenProductionRate;
  return Math.round(rate * periodDays * 100) / 100;
}

/**
 * Calculates the equivalent number of mature trees based on CO2 absorbed.
 */
export function calculateEquivalentTrees(co2AbsorbedKg: number): number {
  return Math.round(
    (co2AbsorbedKg / ENVIRONMENTAL_CONSTANTS.CO2_PER_MATURE_TREE_KG_PER_YEAR) * 100,
  ) / 100;
}

/**
 * Calculates carbon credits earned from CO2 absorption.
 */
export function calculateCarbonCredits(co2AbsorbedKg: number): number {
  return Math.round(
    (co2AbsorbedKg / ENVIRONMENTAL_CONSTANTS.KG_CO2_PER_CARBON_CREDIT) * 10000,
  ) / 10000;
}

/**
 * Calculates a Green Score (0-100) representing overall environmental impact.
 * Takes into account plant count, diversity, health, and coverage.
 *
 * @param params - Input parameters for the calculation
 * @returns Green Score from 0 to 100
 */
export function calculateGreenScore(params: {
  totalPlants: number;
  healthyPlantPercentage: number;
  speciesCount: number;
  coverageAreaSqft: number;
  totalAreaSqft: number;
  co2AbsorbedKg: number;
  airPurifyingPlantPercentage: number;
}): number {
  const {
    totalPlants,
    healthyPlantPercentage,
    speciesCount,
    coverageAreaSqft,
    totalAreaSqft,
    co2AbsorbedKg,
    airPurifyingPlantPercentage,
  } = params;

  // Plant density score (0-20): ideal is 1 plant per 100 sqft
  const idealPlantCount = totalAreaSqft / 100;
  const densityRatio = Math.min(totalPlants / Math.max(idealPlantCount, 1), 1.5);
  const densityScore = Math.min(densityRatio * 13.33, 20);

  // Health score (0-25): based on percentage of healthy plants
  const healthScore = (healthyPlantPercentage / 100) * 25;

  // Biodiversity score (0-15): more species = better
  const diversityRatio = Math.min(speciesCount / 15, 1);
  const diversityScore = diversityRatio * 15;

  // Coverage score (0-15): green area vs total area
  const coverageRatio = Math.min(coverageAreaSqft / Math.max(totalAreaSqft, 1), 0.3) / 0.3;
  const coverageScore = coverageRatio * 15;

  // CO2 impact score (0-15): based on absorption
  const co2PerSqft = co2AbsorbedKg / Math.max(totalAreaSqft / 100, 1);
  const co2Score = Math.min(co2PerSqft / 2, 1) * 15;

  // Air purification bonus (0-10): percentage of air-purifying plants
  const airPurifyScore = (airPurifyingPlantPercentage / 100) * 10;

  const totalScore = densityScore + healthScore + diversityScore + coverageScore + co2Score + airPurifyScore;

  return Math.round(Math.min(Math.max(totalScore, 0), 100) * 10) / 10;
}

/**
 * Calculates a Wellness Impact score (0-100) representing the impact
 * of plants on human wellness in a space.
 *
 * @param params - Input parameters
 * @returns Wellness Impact score from 0 to 100
 */
export function calculateWellnessImpact(params: {
  totalPlants: number;
  areaSqft: number;
  airPurifyingPlants: number;
  averageHealthScore: number;
  hasNaturalLight: boolean;
  indoorPlantPercentage: number;
}): number {
  const {
    totalPlants,
    areaSqft,
    airPurifyingPlants,
    averageHealthScore,
    hasNaturalLight,
    indoorPlantPercentage,
  } = params;

  const plantsPerHundredSqft = (totalPlants / Math.max(areaSqft, 1)) * 100;

  // Air quality improvement (0-30)
  const airPurifyRatio = totalPlants > 0 ? airPurifyingPlants / totalPlants : 0;
  const airQualityScore = Math.min(plantsPerHundredSqft * 3, 15) + (airPurifyRatio * 15);

  // Stress reduction (0-25): plant density + health
  const stressReductionBase = Math.min(plantsPerHundredSqft * ENVIRONMENTAL_CONSTANTS.WELLNESS_IMPROVEMENT_PER_PLANT_PER_100SQFT, 15);
  const healthFactor = (averageHealthScore / 100) * 10;
  const stressScore = stressReductionBase + healthFactor;

  // Productivity boost (0-20)
  const productivityBase = Math.min(
    plantsPerHundredSqft * ENVIRONMENTAL_CONSTANTS.PRODUCTIVITY_IMPROVEMENT_FACTOR * 100,
    15,
  );
  const lightBonus = hasNaturalLight ? 5 : 0;
  const productivityScore = productivityBase + lightBonus;

  // Noise reduction (0-10)
  const noiseScore = Math.min(
    plantsPerHundredSqft * ENVIRONMENTAL_CONSTANTS.NOISE_REDUCTION_DB_PER_PLANT * 2,
    10,
  );

  // Indoor greenery bonus (0-15)
  const indoorScore = (indoorPlantPercentage / 100) * 15;

  const totalScore = airQualityScore + stressScore + productivityScore + noiseScore + indoorScore;

  return Math.round(Math.min(Math.max(totalScore, 0), 100) * 10) / 10;
}

// -----------------------------------------------------------------------------
// ID & Code Generation Utilities
// -----------------------------------------------------------------------------

/**
 * Generates a unique plant ID with the VRIKSHAM prefix.
 *
 * @param sequenceNumber - Optional sequential number; if not provided, uses timestamp
 * @returns A plant ID string like "VRK-PLT-00001234"
 *
 * @example
 * generatePlantId(1234) // "VRK-PLT-00001234"
 * generatePlantId()     // "VRK-PLT-17105832" (timestamp-based)
 */
export function generatePlantId(sequenceNumber?: number): string {
  const seq = sequenceNumber ?? Math.floor(Date.now() / 1000) % 100000000;
  return `${VALIDATION.PLANT_CODE_PREFIX}-PLT-${String(seq).padStart(8, '0')}`;
}

/**
 * Generates an invoice number with prefix and date component.
 *
 * @example
 * generateInvoiceNumber(1234) // "INV-202403-1234"
 */
export function generateInvoiceNumber(sequenceNumber: number, date?: Date): string {
  const d = date ?? new Date();
  const yearMonth = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
  return `${VALIDATION.INVOICE_PREFIX}-${yearMonth}-${String(sequenceNumber).padStart(4, '0')}`;
}

/**
 * Generates a service visit code.
 *
 * @example
 * generateVisitCode(5678) // "SV-202403-5678"
 */
export function generateVisitCode(sequenceNumber: number, date?: Date): string {
  const d = date ?? new Date();
  const yearMonth = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
  return `${VALIDATION.VISIT_PREFIX}-${yearMonth}-${String(sequenceNumber).padStart(4, '0')}`;
}

/**
 * Generates a payment reference number.
 *
 * @example
 * generatePaymentNumber(789) // "PAY-202403-0789"
 */
export function generatePaymentNumber(sequenceNumber: number, date?: Date): string {
  const d = date ?? new Date();
  const yearMonth = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
  return `${VALIDATION.PAYMENT_PREFIX}-${yearMonth}-${String(sequenceNumber).padStart(4, '0')}`;
}

/**
 * Generates a QR code data string for a plant.
 * The QR code encodes a URL that links to the plant's detail page.
 *
 * @param plantId - The plant's unique identifier
 * @param baseUrl - The base URL of the application
 * @returns A URL string to be encoded as a QR code
 *
 * @example
 * generateQRCode('VRK-PLT-00001234', 'https://app.vriksham.com')
 * // "https://app.vriksham.com/plant/VRK-PLT-00001234"
 */
export function generateQRCode(plantId: string, baseUrl: string = 'https://app.vriksham.com'): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  return `${cleanBase}/plant/${encodeURIComponent(plantId)}`;
}

/**
 * Generates a short unique identifier suitable for temporary or reference use.
 * NOT a UUID -- meant for user-facing short codes.
 *
 * @param length - Length of the generated code (default: 8)
 * @returns An alphanumeric string
 */
export function generateShortId(length: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  const timestamp = Date.now().toString(36);
  for (let i = 0; i < length; i++) {
    const index = (timestamp.charCodeAt(i % timestamp.length) + Math.floor(Math.random() * chars.length)) % chars.length;
    result += chars[index];
  }
  return result;
}

// -----------------------------------------------------------------------------
// Health Score Utilities
// -----------------------------------------------------------------------------

/**
 * Converts a numeric health score (0-100) to a PlantHealthStatus enum value.
 *
 * @param score - Numeric health score (0-100)
 * @returns Corresponding PlantHealthStatus
 *
 * @example
 * healthScoreToStatus(95)  // PlantHealthStatus.EXCELLENT
 * healthScoreToStatus(72)  // PlantHealthStatus.GOOD
 * healthScoreToStatus(15)  // PlantHealthStatus.CRITICAL
 */
export function healthScoreToStatus(score: number): PlantHealthStatus {
  if (score >= HEALTH_SCORE_THRESHOLDS.EXCELLENT) return PlantHealthStatus.EXCELLENT;
  if (score >= HEALTH_SCORE_THRESHOLDS.GOOD) return PlantHealthStatus.GOOD;
  if (score >= HEALTH_SCORE_THRESHOLDS.FAIR) return PlantHealthStatus.FAIR;
  if (score >= HEALTH_SCORE_THRESHOLDS.POOR) return PlantHealthStatus.POOR;
  if (score >= HEALTH_SCORE_THRESHOLDS.CRITICAL) return PlantHealthStatus.CRITICAL;
  return PlantHealthStatus.DEAD;
}

/**
 * Returns the theme color associated with a health status or score.
 *
 * @param statusOrScore - A PlantHealthStatus enum value or numeric score (0-100)
 * @returns Hex color string
 *
 * @example
 * getHealthColor(PlantHealthStatus.EXCELLENT) // "#22c55e"
 * getHealthColor(45)                          // "#f97316"
 */
export function getHealthColor(statusOrScore: PlantHealthStatus | number): string {
  const status = typeof statusOrScore === 'number'
    ? healthScoreToStatus(statusOrScore)
    : statusOrScore;

  const colorMap: Record<PlantHealthStatus, string> = {
    [PlantHealthStatus.EXCELLENT]: THEME_COLORS.health.excellent,
    [PlantHealthStatus.GOOD]: THEME_COLORS.health.good,
    [PlantHealthStatus.FAIR]: THEME_COLORS.health.fair,
    [PlantHealthStatus.POOR]: THEME_COLORS.health.poor,
    [PlantHealthStatus.CRITICAL]: THEME_COLORS.health.critical,
    [PlantHealthStatus.DEAD]: THEME_COLORS.health.dead,
  };

  return colorMap[status] ?? THEME_COLORS.health.fair;
}

/**
 * Returns a human-readable label for a health status.
 */
export function getHealthLabel(statusOrScore: PlantHealthStatus | number): string {
  const status = typeof statusOrScore === 'number'
    ? healthScoreToStatus(statusOrScore)
    : statusOrScore;

  const labelMap: Record<PlantHealthStatus, string> = {
    [PlantHealthStatus.EXCELLENT]: 'Excellent',
    [PlantHealthStatus.GOOD]: 'Good',
    [PlantHealthStatus.FAIR]: 'Fair',
    [PlantHealthStatus.POOR]: 'Poor',
    [PlantHealthStatus.CRITICAL]: 'Critical',
    [PlantHealthStatus.DEAD]: 'Dead',
  };

  return labelMap[status] ?? 'Unknown';
}

/**
 * Calculates a health trend direction based on current and previous scores.
 */
export function getHealthTrend(
  currentScore: number,
  previousScore: number,
): { direction: 'up' | 'down' | 'stable'; change: number } {
  const change = currentScore - previousScore;

  if (Math.abs(change) < 2) {
    return { direction: 'stable', change: 0 };
  }

  return {
    direction: change > 0 ? 'up' : 'down',
    change: Math.round(change * 10) / 10,
  };
}

// -----------------------------------------------------------------------------
// Validation Utilities
// -----------------------------------------------------------------------------

/**
 * Validates an Indian phone number.
 */
export function isValidPhone(phone: string): boolean {
  return VALIDATION.PHONE_REGEX.test(phone.replace(/\s/g, ''));
}

/**
 * Validates an email address format.
 */
export function isValidEmail(email: string): boolean {
  return VALIDATION.EMAIL_REGEX.test(email);
}

/**
 * Validates an Indian GST number.
 */
export function isValidGST(gst: string): boolean {
  return VALIDATION.GST_REGEX.test(gst.toUpperCase());
}

/**
 * Validates an Indian PAN number.
 */
export function isValidPAN(pan: string): boolean {
  return VALIDATION.PAN_REGEX.test(pan.toUpperCase());
}

/**
 * Validates an Indian PIN code.
 */
export function isValidPincode(pincode: string): boolean {
  return VALIDATION.PINCODE_REGEX.test(pincode);
}

/**
 * Validates password strength.
 * Requirements: min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special char.
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= VALIDATION.PASSWORD_MIN_LENGTH) {
    score += 1;
  } else {
    feedback.push(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`);
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one lowercase letter');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one uppercase letter');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one number');
  }

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one special character');
  }

  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  return {
    isValid: score >= 5,
    score: Math.min(score, 7),
    feedback,
  };
}

// -----------------------------------------------------------------------------
// String Utilities
// -----------------------------------------------------------------------------

/**
 * Converts a string to title case.
 *
 * @example
 * toTitleCase('hello world') // "Hello World"
 * toTitleCase('SNAKE_PLANT') // "Snake Plant"
 */
export function toTitleCase(str: string): string {
  return str
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Truncates a string to a maximum length and appends an ellipsis.
 *
 * @example
 * truncate('Hello World', 5) // "Hello..."
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + suffix;
}

/**
 * Generates initials from a full name.
 *
 * @example
 * getInitials('John Doe')        // "JD"
 * getInitials('Jane Mary Smith')  // "JS"
 */
export function getInitials(name: string, maxLength: number = 2): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .filter(Boolean)
    .slice(0, maxLength)
    .join('');
}

/**
 * Slugifies a string for URL use.
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
// Object & Array Utilities
// -----------------------------------------------------------------------------

/**
 * Safely picks specified keys from an object.
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Creates a new object with specified keys omitted.
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

/**
 * Groups an array of items by a key.
 *
 * @example
 * groupBy([{ type: 'a', v: 1 }, { type: 'b', v: 2 }, { type: 'a', v: 3 }], 'type')
 * // { a: [{ type: 'a', v: 1 }, { type: 'a', v: 3 }], b: [{ type: 'b', v: 2 }] }
 */
export function groupBy<T>(items: T[], keyFn: keyof T | ((item: T) => string)): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const key = typeof keyFn === 'function' ? keyFn(item) : String(item[keyFn]);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

/**
 * Removes duplicate items from an array based on a key.
 */
export function uniqueBy<T>(items: T[], keyFn: (item: T) => string | number): T[] {
  const seen = new Set<string | number>();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// -----------------------------------------------------------------------------
// Calculation Helpers
// -----------------------------------------------------------------------------

/**
 * Calculates a percentage safely (avoids division by zero).
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
 * Calculates the number of days between two dates.
 */
export function daysBetween(date1: string | Date, date2: string | Date): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Checks if a date is overdue (past the current date).
 */
export function isOverdue(dueDate: string | Date): boolean {
  const d = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  return d.getTime() < Date.now();
}

/**
 * Checks if a date is within the next N days.
 */
export function isDueWithinDays(dueDate: string | Date, days: number): boolean {
  const d = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const now = new Date();
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return d.getTime() >= now.getTime() && d.getTime() <= future.getTime();
}
