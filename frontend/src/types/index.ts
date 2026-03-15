// =============================================================================
// VRIKSHAM Frontend - Type Definitions
// Re-exports shared types and defines frontend-specific types
// =============================================================================

// -----------------------------------------------------------------------------
// Re-export all shared types for convenient frontend imports
// -----------------------------------------------------------------------------

export type {
  // Base / Common
  Timestamps,
  SoftDeletable,
  GeoCoordinates,
  Address,
  ContactInfo,
  ImageAsset,
  DateRange,

  // User & Auth
  User,
  UserPreferences,
  NotificationPreferences,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  AuthTokens,
  AuthSession,

  // Client
  Client,

  // Location
  Location,
  OperatingHours,
  DaySchedule,

  // Plant & Species
  PlantSpecies,
  CareInstructions,
  Plant,
  PlantReplacement,
  PlantHealthLog,
  HealthIssue,
  Treatment,
  EnvironmentalReading,

  // Subscription
  SubscriptionPlan,
  Subscription,

  // Service Visit & Technician
  Technician,
  Certification,
  VehicleInfo,
  EmergencyContact,
  ServiceVisit,
  ServiceTask,
  MaterialUsage,
  ServiceFeedback,
  RescheduleRecord,

  // Team
  Team,
  TeamPerformance,

  // Invoice & Payment
  Invoice,
  InvoiceLineItem,
  InvoiceReminder,
  Payment,

  // Inventory
  Inventory,
  SupplierInfo,
  InventoryTransaction,

  // Notification
  Notification,

  // Dashboard & Analytics
  ESGMetrics,
  PlantAnalytics,
  SpeciesCount,
  LocationPlantCount,
  MonthlyMetric,
  SpeciesPerformance,
  IssueCount,
  RevenueMetrics,
  PlanRevenue,
  ServiceRevenue,
  ClientRevenue,
  DashboardStats,

  // API Response Types
  ApiResponse,
  PaginatedResponse,
  PaginationMeta,
  ErrorResponse,
  ValidationError,

  // Query & Filter Types
  PaginationParams,
  PlantFilters,
  ClientFilters,
  ServiceVisitFilters,
  InvoiceFilters,

  // Utility Types
  WithOptional,
  WithRequired,
  CreateInput,
  UpdateInput,
  ID,
  Nullable,
  DeepPartial,
} from '../../../shared/types';

export {
  // Enums
  UserRole,
  UserStatus,
  PlantHealthStatus,
  PlantGrowthStage,
  LightRequirement,
  WateringFrequency,
  SubscriptionStatus,
  SubscriptionTier,
  ServiceVisitStatus,
  ServiceType,
  InvoiceStatus,
  PaymentMethod,
  PaymentStatus,
  NotificationType,
  NotificationPriority,
  InventoryCategory,
  InventoryStatus,
  LocationType,
  PlantPlacement,
} from '../../../shared/types';

// -----------------------------------------------------------------------------
// Frontend-Specific Types
// -----------------------------------------------------------------------------

/**
 * Navigation item for top-level navigation bars.
 */
export interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: string;
  external?: boolean;
  disabled?: boolean;
  badge?: string;
  children?: NavItem[];
}

/**
 * Sidebar link for dashboard navigation.
 */
export interface SidebarLink {
  title: string;
  href: string;
  icon: string;
  badge?: number | string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'destructive';
  disabled?: boolean;
  isNew?: boolean;
  children?: SidebarLink[];
  requiredRoles?: string[];
}

/**
 * Generic chart data point for Recharts integration.
 */
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

/**
 * Configuration for chart rendering.
 */
export interface ChartConfig {
  colors?: string[];
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
  height?: number;
  type?: 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'radar';
}

/**
 * Table column definition for data tables.
 */
export interface TableColumn<T = unknown> {
  key: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  sticky?: boolean;
  hidden?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  headerRender?: () => React.ReactNode;
  className?: string;
}

/**
 * Props for modal/dialog components.
 */
export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  preventClose?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Option for filter dropdowns and select components.
 */
export interface FilterOption {
  label: string;
  value: string;
  count?: number;
  icon?: string;
  disabled?: boolean;
  group?: string;
  description?: string;
}

/**
 * Breadcrumb navigation item.
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
  isCurrent?: boolean;
}

/**
 * Toast/notification configuration for the frontend.
 */
export interface ToastConfig {
  id?: string;
  title: string;
  description?: string;
  variant: 'default' | 'success' | 'warning' | 'error' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Time series data point for charts and analytics.
 */
export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

/**
 * Search result item for global search.
 */
export interface SearchResult {
  id: string;
  type: 'client' | 'plant' | 'location' | 'technician' | 'invoice' | 'visit';
  title: string;
  subtitle?: string;
  href: string;
  icon?: string;
  imageUrl?: string;
  metadata?: Record<string, string>;
}

/**
 * Tab configuration for tabbed interfaces.
 */
export interface TabItem {
  value: string;
  label: string;
  icon?: string;
  badge?: number | string;
  disabled?: boolean;
  content?: React.ReactNode;
}

/**
 * Form field configuration for dynamic forms.
 */
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file' | 'phone';
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  options?: FilterOption[];
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    message?: string;
  };
}

/**
 * Stat card data for dashboard overview.
 */
export interface StatCardData {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  iconColor?: string;
  trend?: 'up' | 'down' | 'stable';
  href?: string;
  description?: string;
}

/**
 * Activity log entry for recent activity feeds.
 */
export interface ActivityLogEntry {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatarUrl?: string;
  };
  icon?: string;
  iconColor?: string;
  href?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Page metadata for SEO and page headers.
 */
export interface PageMeta {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: string;
    variant?: 'default' | 'outline' | 'ghost';
  }[];
}

// React type import for component-related types
import type React from 'react';

/**
 * Generic async state for data fetching.
 */
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isRefetching?: boolean;
}

/**
 * Theme mode options.
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Notification preferences for the frontend notification system.
 */
export interface FrontendNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

/**
 * AI Chat types for the frontend.
 */
export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    plantId?: string;
    imageUrl?: string;
    sources?: string[];
  };
}

export interface AIChatRequest {
  message: string;
  conversationId?: string;
  context?: {
    plantId?: string;
    imageUrl?: string;
  };
}

export interface AIChatResponse {
  message: AIChatMessage;
  conversationId: string;
}

/**
 * AI diagnosis types for plant health.
 */
export interface AIDiagnosisRequest {
  plantId: string;
  imageUrl?: string;
  symptoms?: string[];
  metrics?: {
    soilMoisture?: number;
    temperature?: number;
    humidity?: number;
    lightLevel?: number;
    pH?: number;
  };
}

export interface AIDiagnosisResponse {
  plantId: string;
  diagnosis: {
    condition: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    recommendations: string[];
    possibleCauses: string[];
  };
  confidence: number;
  suggestedActions: string[];
  estimatedRecoveryDays?: number;
}

export interface AIHealthPrediction {
  plantId: string;
  currentScore: number;
  predictedScore: number;
  predictedDate: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  recommendations: string[];
}
