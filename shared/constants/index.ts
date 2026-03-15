// =============================================================================
// VRIKSHAM Platform - Shared Constants
// =============================================================================

import {
  LightRequirement,
  WateringFrequency,
  PlantGrowthStage,
  PlantHealthStatus,
  SubscriptionTier,
  ServiceType,
  PlantPlacement,
  InventoryCategory,
  NotificationType,
  NotificationPriority,
  UserRole,
} from '../types';

// -----------------------------------------------------------------------------
// Plant Care Constants
// -----------------------------------------------------------------------------

export const WATERING_FREQUENCY_DAYS: Record<WateringFrequency, number> = {
  [WateringFrequency.DAILY]: 1,
  [WateringFrequency.ALTERNATE_DAYS]: 2,
  [WateringFrequency.TWICE_WEEKLY]: 3,
  [WateringFrequency.WEEKLY]: 7,
  [WateringFrequency.BIWEEKLY]: 14,
  [WateringFrequency.MONTHLY]: 30,
  [WateringFrequency.AS_NEEDED]: 0,
};

export const WATERING_FREQUENCY_LABELS: Record<WateringFrequency, string> = {
  [WateringFrequency.DAILY]: 'Every Day',
  [WateringFrequency.ALTERNATE_DAYS]: 'Every Other Day',
  [WateringFrequency.TWICE_WEEKLY]: 'Twice a Week',
  [WateringFrequency.WEEKLY]: 'Once a Week',
  [WateringFrequency.BIWEEKLY]: 'Every Two Weeks',
  [WateringFrequency.MONTHLY]: 'Once a Month',
  [WateringFrequency.AS_NEEDED]: 'As Needed',
};

export const LIGHT_LEVEL_LABELS: Record<LightRequirement, string> = {
  [LightRequirement.FULL_SUN]: 'Full Sun (6+ hours direct)',
  [LightRequirement.PARTIAL_SUN]: 'Partial Sun (4-6 hours direct)',
  [LightRequirement.PARTIAL_SHADE]: 'Partial Shade (2-4 hours direct)',
  [LightRequirement.FULL_SHADE]: 'Full Shade (No direct sun)',
  [LightRequirement.INDIRECT_LIGHT]: 'Bright Indirect Light',
  [LightRequirement.LOW_LIGHT]: 'Low Light Tolerant',
};

export const LIGHT_LEVEL_LUX_RANGES: Record<LightRequirement, { min: number; max: number }> = {
  [LightRequirement.FULL_SUN]: { min: 25000, max: 100000 },
  [LightRequirement.PARTIAL_SUN]: { min: 15000, max: 25000 },
  [LightRequirement.PARTIAL_SHADE]: { min: 10000, max: 15000 },
  [LightRequirement.FULL_SHADE]: { min: 2500, max: 10000 },
  [LightRequirement.INDIRECT_LIGHT]: { min: 10000, max: 20000 },
  [LightRequirement.LOW_LIGHT]: { min: 500, max: 2500 },
};

export const GROWTH_STAGE_LABELS: Record<PlantGrowthStage, string> = {
  [PlantGrowthStage.SEEDLING]: 'Seedling',
  [PlantGrowthStage.JUVENILE]: 'Juvenile',
  [PlantGrowthStage.MATURE]: 'Mature',
  [PlantGrowthStage.FLOWERING]: 'Flowering',
  [PlantGrowthStage.FRUITING]: 'Fruiting',
  [PlantGrowthStage.DORMANT]: 'Dormant',
};

export const GROWTH_STAGE_ORDER: PlantGrowthStage[] = [
  PlantGrowthStage.SEEDLING,
  PlantGrowthStage.JUVENILE,
  PlantGrowthStage.MATURE,
  PlantGrowthStage.FLOWERING,
  PlantGrowthStage.FRUITING,
  PlantGrowthStage.DORMANT,
];

export const HEALTH_STATUS_LABELS: Record<PlantHealthStatus, string> = {
  [PlantHealthStatus.EXCELLENT]: 'Excellent',
  [PlantHealthStatus.GOOD]: 'Good',
  [PlantHealthStatus.FAIR]: 'Fair',
  [PlantHealthStatus.POOR]: 'Poor',
  [PlantHealthStatus.CRITICAL]: 'Critical',
  [PlantHealthStatus.DEAD]: 'Dead',
};

export const HEALTH_SCORE_RANGES: Record<PlantHealthStatus, { min: number; max: number }> = {
  [PlantHealthStatus.EXCELLENT]: { min: 90, max: 100 },
  [PlantHealthStatus.GOOD]: { min: 70, max: 89 },
  [PlantHealthStatus.FAIR]: { min: 50, max: 69 },
  [PlantHealthStatus.POOR]: { min: 30, max: 49 },
  [PlantHealthStatus.CRITICAL]: { min: 1, max: 29 },
  [PlantHealthStatus.DEAD]: { min: 0, max: 0 },
};

export const PLACEMENT_LABELS: Record<PlantPlacement, string> = {
  [PlantPlacement.INDOOR]: 'Indoor',
  [PlantPlacement.OUTDOOR]: 'Outdoor',
  [PlantPlacement.BALCONY]: 'Balcony',
  [PlantPlacement.TERRACE]: 'Terrace',
  [PlantPlacement.LOBBY]: 'Lobby',
  [PlantPlacement.RECEPTION]: 'Reception',
  [PlantPlacement.CAFETERIA]: 'Cafeteria',
  [PlantPlacement.CONFERENCE_ROOM]: 'Conference Room',
  [PlantPlacement.WORKSTATION]: 'Workstation',
  [PlantPlacement.RESTROOM]: 'Restroom',
};

// Optimal temperature range in Celsius for common indoor plants
export const DEFAULT_TEMPERATURE_RANGE = {
  min: 15,
  max: 30,
  optimal: { min: 18, max: 26 },
  unit: 'celsius' as const,
};

// Optimal humidity range as percentage
export const DEFAULT_HUMIDITY_RANGE = {
  min: 30,
  max: 80,
  optimal: { min: 40, max: 60 },
};

// Health score thresholds
export const HEALTH_SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  FAIR: 50,
  POOR: 30,
  CRITICAL: 1,
} as const;

// -----------------------------------------------------------------------------
// CO2 Absorption & Oxygen Production
// -----------------------------------------------------------------------------

/**
 * Average CO2 absorption rates in kg per year per plant, by common species category.
 * These are approximate values based on published research.
 */
export const CO2_ABSORPTION_RATES: Record<string, number> = {
  // Indoor plants - kg CO2 absorbed per year
  snake_plant: 0.94,
  pothos: 0.72,
  peace_lily: 0.82,
  spider_plant: 0.65,
  rubber_plant: 1.12,
  fiddle_leaf_fig: 1.35,
  monstera: 1.08,
  dracaena: 0.78,
  bamboo_palm: 1.62,
  areca_palm: 1.84,
  boston_fern: 0.56,
  aloe_vera: 0.42,
  english_ivy: 0.68,
  zz_plant: 0.52,
  chinese_evergreen: 0.71,
  philodendron: 0.88,
  jade_plant: 0.38,
  money_plant: 0.74,
  ficus: 1.28,
  calathea: 0.61,

  // Outdoor / larger plants
  neem: 14.0,
  banyan: 21.77,
  peepal: 18.24,
  mango: 15.6,
  coconut_palm: 12.0,
  teak: 16.5,
  eucalyptus: 22.0,
  bamboo: 12.0,
  tulsi: 0.48,
  curry_leaf: 2.8,

  // Defaults by size category
  small_indoor: 0.55,
  medium_indoor: 0.85,
  large_indoor: 1.25,
  small_outdoor: 5.0,
  medium_outdoor: 12.0,
  large_outdoor: 20.0,
  default: 0.85,
};

/**
 * Oxygen production rate in litres per day per plant, by species category.
 * Average plant produces about 5ml of O2 per hour = ~120ml/day for small plants.
 * Larger plants can produce significantly more.
 */
export const OXYGEN_PRODUCTION_RATES: Record<string, number> = {
  snake_plant: 0.93,
  pothos: 0.72,
  peace_lily: 0.85,
  spider_plant: 0.68,
  rubber_plant: 1.15,
  fiddle_leaf_fig: 1.38,
  monstera: 1.1,
  dracaena: 0.8,
  bamboo_palm: 1.65,
  areca_palm: 1.88,
  boston_fern: 0.58,
  aloe_vera: 0.55,
  english_ivy: 0.7,
  zz_plant: 0.52,
  chinese_evergreen: 0.73,
  philodendron: 0.9,
  jade_plant: 0.4,
  money_plant: 0.76,
  ficus: 1.3,
  calathea: 0.62,
  neem: 14.4,
  banyan: 22.0,
  peepal: 18.8,
  mango: 15.9,

  small_indoor: 0.55,
  medium_indoor: 0.87,
  large_indoor: 1.3,
  small_outdoor: 5.2,
  medium_outdoor: 12.5,
  large_outdoor: 21.0,
  default: 0.87,
};

/**
 * Conversion constants for environmental calculations.
 */
export const ENVIRONMENTAL_CONSTANTS = {
  // 1 kg of CO2 absorbed is equivalent to approximately this many mature tree-months
  CO2_PER_MATURE_TREE_KG_PER_YEAR: 21.77,

  // Average CO2 concentration improvement per plant per 100 sqft (in ppm reduction)
  CO2_REDUCTION_PPM_PER_PLANT_PER_100SQFT: 12,

  // Average air quality improvement factor per plant (percentage per 100 sqft)
  AIR_QUALITY_IMPROVEMENT_FACTOR: 0.035,

  // Litres of water saved per year per indoor plant vs artificial alternatives
  WATER_SAVINGS_LITRES_PER_PLANT_PER_YEAR: 18,

  // kWh of energy saved per year per plant (cooling benefit)
  ENERGY_SAVINGS_KWH_PER_PLANT_PER_YEAR: 6.4,

  // Wellness score improvement per plant per 100 sqft (out of 100)
  WELLNESS_IMPROVEMENT_PER_PLANT_PER_100SQFT: 2.5,

  // Productivity improvement percentage per plant per 100 sqft
  PRODUCTIVITY_IMPROVEMENT_FACTOR: 0.012,

  // Noise reduction in dB per plant per 100 sqft
  NOISE_REDUCTION_DB_PER_PLANT: 0.5,

  // CO2 in kg to carbon credit conversion (1 credit = 1 tonne CO2)
  KG_CO2_PER_CARBON_CREDIT: 1000,
} as const;

// -----------------------------------------------------------------------------
// Subscription Plan Details
// -----------------------------------------------------------------------------

export interface PlanConfig {
  tier: SubscriptionTier;
  name: string;
  description: string;
  features: string[];
  maxPlants: number;
  maxLocations: number;
  visitsPerMonth: number;
  responseTimeHours: number;
  includedServices: ServiceType[];
  priceMonthly: number;
  priceQuarterly: number;
  priceAnnual: number;
  perPlantCost: number;
  setupFee: number;
  isPopular: boolean;
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, PlanConfig> = {
  [SubscriptionTier.STARTER]: {
    tier: SubscriptionTier.STARTER,
    name: 'Starter',
    description: 'Perfect for small offices and home gardens with basic plant care needs.',
    features: [
      'Up to 25 plants',
      '1 location',
      '2 maintenance visits per month',
      'Basic health monitoring',
      'Email support',
      'Monthly ESG report',
      'Plant replacement (up to 2/year)',
    ],
    maxPlants: 25,
    maxLocations: 1,
    visitsPerMonth: 2,
    responseTimeHours: 48,
    includedServices: [
      ServiceType.ROUTINE_MAINTENANCE,
      ServiceType.PLANT_REPLACEMENT,
    ],
    priceMonthly: 2999,
    priceQuarterly: 7999,
    priceAnnual: 29999,
    perPlantCost: 120,
    setupFee: 4999,
    isPopular: false,
  },
  [SubscriptionTier.GROWTH]: {
    tier: SubscriptionTier.GROWTH,
    name: 'Growth',
    description: 'Ideal for growing businesses with multiple areas needing green coverage.',
    features: [
      'Up to 100 plants',
      'Up to 3 locations',
      '4 maintenance visits per month',
      'Advanced health monitoring with photos',
      'Pest management included',
      'Priority email & phone support',
      'Weekly ESG reports',
      'Plant replacement (up to 5/year)',
      'Quarterly consultation',
      'QR code plant tracking',
    ],
    maxPlants: 100,
    maxLocations: 3,
    visitsPerMonth: 4,
    responseTimeHours: 24,
    includedServices: [
      ServiceType.ROUTINE_MAINTENANCE,
      ServiceType.PEST_TREATMENT,
      ServiceType.PLANT_REPLACEMENT,
      ServiceType.CONSULTATION,
    ],
    priceMonthly: 7999,
    priceQuarterly: 21999,
    priceAnnual: 79999,
    perPlantCost: 80,
    setupFee: 9999,
    isPopular: true,
  },
  [SubscriptionTier.PREMIUM]: {
    tier: SubscriptionTier.PREMIUM,
    name: 'Premium',
    description: 'Comprehensive plant care for large offices and commercial spaces.',
    features: [
      'Up to 500 plants',
      'Up to 10 locations',
      '8 maintenance visits per month',
      'Real-time health monitoring',
      'Full pest & disease management',
      'Dedicated account manager',
      'Daily ESG dashboard',
      'Unlimited plant replacements',
      'Monthly consultation',
      'QR code plant tracking',
      'Custom plant designs',
      'Emergency response within 4 hours',
      'Seasonal decoration updates',
    ],
    maxPlants: 500,
    maxLocations: 10,
    visitsPerMonth: 8,
    responseTimeHours: 4,
    includedServices: [
      ServiceType.ROUTINE_MAINTENANCE,
      ServiceType.PEST_TREATMENT,
      ServiceType.PRUNING,
      ServiceType.REPOTTING,
      ServiceType.PLANT_REPLACEMENT,
      ServiceType.CONSULTATION,
      ServiceType.EMERGENCY,
    ],
    priceMonthly: 19999,
    priceQuarterly: 54999,
    priceAnnual: 199999,
    perPlantCost: 40,
    setupFee: 19999,
    isPopular: false,
  },
  [SubscriptionTier.ENTERPRISE]: {
    tier: SubscriptionTier.ENTERPRISE,
    name: 'Enterprise',
    description: 'Tailored solutions for large enterprises, campuses, and multi-location organizations.',
    features: [
      'Unlimited plants',
      'Unlimited locations',
      'Unlimited maintenance visits',
      'IoT sensor integration',
      'Full pest & disease management',
      'Dedicated team assigned',
      'Real-time ESG analytics & API',
      'Unlimited plant replacements',
      'Weekly consultation & audits',
      'QR code & NFC plant tracking',
      'Custom plant designs & landscaping',
      '2-hour emergency response',
      'Seasonal decoration & events',
      'White-label ESG reporting',
      'API access for integration',
      'SLA guarantees',
    ],
    maxPlants: Infinity,
    maxLocations: Infinity,
    visitsPerMonth: -1, // unlimited
    responseTimeHours: 2,
    includedServices: [
      ServiceType.ROUTINE_MAINTENANCE,
      ServiceType.PLANT_INSTALLATION,
      ServiceType.PEST_TREATMENT,
      ServiceType.PRUNING,
      ServiceType.REPOTTING,
      ServiceType.PLANT_REPLACEMENT,
      ServiceType.EMERGENCY,
      ServiceType.CONSULTATION,
      ServiceType.AUDIT,
    ],
    priceMonthly: 0, // Custom pricing
    priceQuarterly: 0,
    priceAnnual: 0,
    perPlantCost: 0,
    setupFee: 0,
    isPopular: false,
  },
};

// -----------------------------------------------------------------------------
// Service Type Labels
// -----------------------------------------------------------------------------

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  [ServiceType.ROUTINE_MAINTENANCE]: 'Routine Maintenance',
  [ServiceType.PLANT_INSTALLATION]: 'Plant Installation',
  [ServiceType.PEST_TREATMENT]: 'Pest Treatment',
  [ServiceType.PRUNING]: 'Pruning',
  [ServiceType.REPOTTING]: 'Repotting',
  [ServiceType.PLANT_REPLACEMENT]: 'Plant Replacement',
  [ServiceType.EMERGENCY]: 'Emergency Service',
  [ServiceType.CONSULTATION]: 'Consultation',
  [ServiceType.AUDIT]: 'Plant Audit',
};

// -----------------------------------------------------------------------------
// Color Theme Constants
// -----------------------------------------------------------------------------

export const THEME_COLORS = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  secondary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  accent: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006',
  },
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  health: {
    excellent: '#22c55e',
    good: '#84cc16',
    fair: '#f59e0b',
    poor: '#f97316',
    critical: '#ef4444',
    dead: '#6b7280',
  },

  chart: [
    '#22c55e',
    '#0ea5e9',
    '#8b5cf6',
    '#f59e0b',
    '#ef4444',
    '#ec4899',
    '#14b8a6',
    '#f97316',
    '#6366f1',
    '#84cc16',
  ],

  background: {
    light: '#ffffff',
    lightSecondary: '#f8fafc',
    dark: '#0f172a',
    darkSecondary: '#1e293b',
  },

  text: {
    light: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#94a3b8',
      disabled: '#cbd5e1',
    },
    dark: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      tertiary: '#64748b',
      disabled: '#475569',
    },
  },

  border: {
    light: '#e2e8f0',
    dark: '#334155',
  },
} as const;

// CSS variable names for runtime theming
export const CSS_VARIABLES = {
  '--color-primary': THEME_COLORS.primary[600],
  '--color-primary-light': THEME_COLORS.primary[100],
  '--color-primary-dark': THEME_COLORS.primary[800],
  '--color-secondary': THEME_COLORS.secondary[600],
  '--color-accent': THEME_COLORS.accent[500],
  '--color-success': THEME_COLORS.success,
  '--color-warning': THEME_COLORS.warning,
  '--color-error': THEME_COLORS.error,
  '--color-info': THEME_COLORS.info,
  '--font-sans': "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  '--font-mono': "'JetBrains Mono', 'Fira Code', monospace",
  '--radius-sm': '0.25rem',
  '--radius-md': '0.5rem',
  '--radius-lg': '0.75rem',
  '--radius-xl': '1rem',
  '--radius-full': '9999px',
  '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const;

// -----------------------------------------------------------------------------
// Route Paths
// -----------------------------------------------------------------------------

export const ROUTES = {
  // Public
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  PRICING: '/pricing',
  CONTACT: '/contact',
  BLOG: '/blog',
  PRIVACY: '/privacy',
  TERMS: '/terms',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  // Dashboard (common)
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',
  NOTIFICATIONS: '/dashboard/notifications',

  // Admin routes
  ADMIN: {
    ROOT: '/dashboard/admin',
    CLIENTS: '/dashboard/admin/clients',
    CLIENT_DETAIL: '/dashboard/admin/clients/:id',
    PLANTS: '/dashboard/admin/plants',
    PLANT_DETAIL: '/dashboard/admin/plants/:id',
    SPECIES: '/dashboard/admin/species',
    SPECIES_DETAIL: '/dashboard/admin/species/:id',
    LOCATIONS: '/dashboard/admin/locations',
    LOCATION_DETAIL: '/dashboard/admin/locations/:id',
    SUBSCRIPTIONS: '/dashboard/admin/subscriptions',
    SERVICE_VISITS: '/dashboard/admin/service-visits',
    VISIT_DETAIL: '/dashboard/admin/service-visits/:id',
    TECHNICIANS: '/dashboard/admin/technicians',
    TECHNICIAN_DETAIL: '/dashboard/admin/technicians/:id',
    TEAMS: '/dashboard/admin/teams',
    TEAM_DETAIL: '/dashboard/admin/teams/:id',
    INVOICES: '/dashboard/admin/invoices',
    INVOICE_DETAIL: '/dashboard/admin/invoices/:id',
    PAYMENTS: '/dashboard/admin/payments',
    INVENTORY: '/dashboard/admin/inventory',
    INVENTORY_DETAIL: '/dashboard/admin/inventory/:id',
    ESG_REPORTS: '/dashboard/admin/esg-reports',
    ANALYTICS: '/dashboard/admin/analytics',
    REVENUE: '/dashboard/admin/revenue',
    USERS: '/dashboard/admin/users',
    SETTINGS: '/dashboard/admin/settings',
  },

  // Client routes
  CLIENT: {
    ROOT: '/dashboard/client',
    MY_PLANTS: '/dashboard/client/plants',
    PLANT_DETAIL: '/dashboard/client/plants/:id',
    MY_LOCATIONS: '/dashboard/client/locations',
    LOCATION_DETAIL: '/dashboard/client/locations/:id',
    SERVICE_HISTORY: '/dashboard/client/service-history',
    MY_SUBSCRIPTION: '/dashboard/client/subscription',
    INVOICES: '/dashboard/client/invoices',
    ESG_DASHBOARD: '/dashboard/client/esg',
    SUPPORT: '/dashboard/client/support',
    FEEDBACK: '/dashboard/client/feedback',
  },

  // Technician routes
  TECHNICIAN: {
    ROOT: '/dashboard/technician',
    MY_SCHEDULE: '/dashboard/technician/schedule',
    VISIT_DETAIL: '/dashboard/technician/visits/:id',
    MY_LOCATIONS: '/dashboard/technician/locations',
    PLANT_CHECKUP: '/dashboard/technician/plant-checkup/:id',
    INVENTORY: '/dashboard/technician/inventory',
    MY_PERFORMANCE: '/dashboard/technician/performance',
  },

  // API base paths
  API: {
    BASE: '/api/v1',
    AUTH: '/api/v1/auth',
    USERS: '/api/v1/users',
    CLIENTS: '/api/v1/clients',
    PLANTS: '/api/v1/plants',
    SPECIES: '/api/v1/species',
    LOCATIONS: '/api/v1/locations',
    SUBSCRIPTIONS: '/api/v1/subscriptions',
    SERVICE_VISITS: '/api/v1/service-visits',
    TECHNICIANS: '/api/v1/technicians',
    TEAMS: '/api/v1/teams',
    INVOICES: '/api/v1/invoices',
    PAYMENTS: '/api/v1/payments',
    INVENTORY: '/api/v1/inventory',
    NOTIFICATIONS: '/api/v1/notifications',
    ESG: '/api/v1/esg',
    ANALYTICS: '/api/v1/analytics',
    UPLOAD: '/api/v1/upload',
  },
} as const;

// -----------------------------------------------------------------------------
// Notification Constants
// -----------------------------------------------------------------------------

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  [NotificationType.SERVICE_REMINDER]: 'Service Reminder',
  [NotificationType.PAYMENT_DUE]: 'Payment Due',
  [NotificationType.PLANT_ALERT]: 'Plant Alert',
  [NotificationType.HEALTH_UPDATE]: 'Health Update',
  [NotificationType.SUBSCRIPTION_RENEWAL]: 'Subscription Renewal',
  [NotificationType.SYSTEM_UPDATE]: 'System Update',
  [NotificationType.PROMOTION]: 'Promotion',
  [NotificationType.TEAM_ASSIGNMENT]: 'Team Assignment',
  [NotificationType.VISIT_COMPLETED]: 'Visit Completed',
  [NotificationType.INVOICE_GENERATED]: 'Invoice Generated',
};

export const NOTIFICATION_PRIORITY_LABELS: Record<NotificationPriority, string> = {
  [NotificationPriority.LOW]: 'Low',
  [NotificationPriority.MEDIUM]: 'Medium',
  [NotificationPriority.HIGH]: 'High',
  [NotificationPriority.URGENT]: 'Urgent',
};

// -----------------------------------------------------------------------------
// Inventory Constants
// -----------------------------------------------------------------------------

export const INVENTORY_CATEGORY_LABELS: Record<InventoryCategory, string> = {
  [InventoryCategory.PLANTS]: 'Plants',
  [InventoryCategory.POTS]: 'Pots & Planters',
  [InventoryCategory.SOIL]: 'Soil & Growing Media',
  [InventoryCategory.FERTILIZER]: 'Fertilizers',
  [InventoryCategory.PESTICIDE]: 'Pesticides & Fungicides',
  [InventoryCategory.TOOLS]: 'Tools & Equipment',
  [InventoryCategory.ACCESSORIES]: 'Accessories',
  [InventoryCategory.DECORATIVE]: 'Decorative Items',
};

// -----------------------------------------------------------------------------
// User Role Labels & Permissions
// -----------------------------------------------------------------------------

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Admin',
  [UserRole.ADMIN]: 'Admin',
  [UserRole.MANAGER]: 'Manager',
  [UserRole.TECHNICIAN]: 'Technician',
  [UserRole.CLIENT]: 'Client',
  [UserRole.VIEWER]: 'Viewer',
};

export const ROLE_HIERARCHY: UserRole[] = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.TECHNICIAN,
  UserRole.CLIENT,
  UserRole.VIEWER,
];

// -----------------------------------------------------------------------------
// Pagination Defaults
// -----------------------------------------------------------------------------

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// -----------------------------------------------------------------------------
// Date & Time Formats
// -----------------------------------------------------------------------------

export const DATE_FORMATS = {
  DISPLAY: 'dd MMM yyyy',
  DISPLAY_SHORT: 'dd/MM/yyyy',
  DISPLAY_LONG: 'dd MMMM yyyy',
  DISPLAY_WITH_TIME: 'dd MMM yyyy, hh:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
  API: 'yyyy-MM-dd',
  TIME_12H: 'hh:mm a',
  TIME_24H: 'HH:mm',
  MONTH_YEAR: 'MMM yyyy',
  DAY_MONTH: 'dd MMM',
} as const;

// -----------------------------------------------------------------------------
// Currency Constants
// -----------------------------------------------------------------------------

export const CURRENCY = {
  DEFAULT: 'INR',
  SYMBOL: '\u20B9',
  LOCALE: 'en-IN',
  DECIMAL_PLACES: 2,
} as const;

// Supported currencies
export const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '\u20B9', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '\u20AC', name: 'Euro', locale: 'en-EU' },
  { code: 'GBP', symbol: '\u00A3', name: 'British Pound', locale: 'en-GB' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', locale: 'en-AE' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
] as const;

// -----------------------------------------------------------------------------
// File Upload Constraints
// -----------------------------------------------------------------------------

export const FILE_UPLOAD = {
  MAX_FILE_SIZE_MB: 10,
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
  MAX_FILES_PER_UPLOAD: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.heic'],
  IMAGE_QUALITY: 0.85,
  THUMBNAIL_WIDTH: 200,
  THUMBNAIL_HEIGHT: 200,
} as const;

// -----------------------------------------------------------------------------
// Validation Constants
// -----------------------------------------------------------------------------

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  PHONE_REGEX: /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  GST_REGEX: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  PAN_REGEX: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  PINCODE_REGEX: /^[1-9][0-9]{5}$/,
  PLANT_CODE_PREFIX: 'VRK',
  INVOICE_PREFIX: 'INV',
  VISIT_PREFIX: 'SV',
  PAYMENT_PREFIX: 'PAY',
  MAX_TAGS: 10,
  MAX_NOTES_LENGTH: 2000,
  MAX_DESCRIPTION_LENGTH: 5000,
} as const;

// -----------------------------------------------------------------------------
// Application Metadata
// -----------------------------------------------------------------------------

export const APP_CONFIG = {
  NAME: 'VRIKSHAM',
  FULL_NAME: 'VRIKSHAM Green Solutions',
  TAGLINE: 'Nurturing Nature, Enriching Spaces',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@vriksham.com',
  SUPPORT_PHONE: '+91-9876543210',
  WEBSITE: 'https://vriksham.com',
  COPYRIGHT_YEAR: 2024,
  COMPANY_NAME: 'VRIKSHAM Green Solutions Pvt. Ltd.',
} as const;
