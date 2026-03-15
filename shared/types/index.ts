// =============================================================================
// VRIKSHAM Platform - Shared Types & Interfaces
// =============================================================================

// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  PARTNER = 'partner',
  TECHNICIAN = 'technician',
  CLIENT = 'client',
  USER = 'user',
  VIEWER = 'viewer',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
  DEACTIVATED = 'deactivated',
}

export enum PlantHealthStatus {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  CRITICAL = 'critical',
  DEAD = 'dead',
}

export enum PlantGrowthStage {
  SEEDLING = 'seedling',
  JUVENILE = 'juvenile',
  MATURE = 'mature',
  FLOWERING = 'flowering',
  FRUITING = 'fruiting',
  DORMANT = 'dormant',
}

export enum LightRequirement {
  FULL_SUN = 'full_sun',
  PARTIAL_SUN = 'partial_sun',
  PARTIAL_SHADE = 'partial_shade',
  FULL_SHADE = 'full_shade',
  INDIRECT_LIGHT = 'indirect_light',
  LOW_LIGHT = 'low_light',
}

export enum WateringFrequency {
  DAILY = 'daily',
  ALTERNATE_DAYS = 'alternate_days',
  TWICE_WEEKLY = 'twice_weekly',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  AS_NEEDED = 'as_needed',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PENDING = 'pending',
  TRIAL = 'trial',
}

export enum SubscriptionTier {
  STARTER = 'starter',
  GROWTH = 'growth',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

export enum ServiceVisitStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  MISSED = 'missed',
  RESCHEDULED = 'rescheduled',
}

export enum ServiceType {
  ROUTINE_MAINTENANCE = 'routine_maintenance',
  PLANT_INSTALLATION = 'plant_installation',
  PEST_TREATMENT = 'pest_treatment',
  PRUNING = 'pruning',
  REPOTTING = 'repotting',
  PLANT_REPLACEMENT = 'plant_replacement',
  EMERGENCY = 'emergency',
  CONSULTATION = 'consultation',
  AUDIT = 'audit',
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  UPI = 'upi',
  CASH = 'cash',
  CHEQUE = 'cheque',
  WALLET = 'wallet',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export enum NotificationType {
  SERVICE_REMINDER = 'service_reminder',
  PAYMENT_DUE = 'payment_due',
  PLANT_ALERT = 'plant_alert',
  HEALTH_UPDATE = 'health_update',
  SUBSCRIPTION_RENEWAL = 'subscription_renewal',
  SYSTEM_UPDATE = 'system_update',
  PROMOTION = 'promotion',
  TEAM_ASSIGNMENT = 'team_assignment',
  VISIT_COMPLETED = 'visit_completed',
  INVOICE_GENERATED = 'invoice_generated',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum InventoryCategory {
  PLANTS = 'plants',
  POTS = 'pots',
  SOIL = 'soil',
  FERTILIZER = 'fertilizer',
  PESTICIDE = 'pesticide',
  TOOLS = 'tools',
  ACCESSORIES = 'accessories',
  DECORATIVE = 'decorative',
}

export enum InventoryStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
  ON_ORDER = 'on_order',
}

export enum LocationType {
  OFFICE = 'office',
  RESIDENCE = 'residence',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  RETAIL = 'retail',
  HOSPITALITY = 'hospitality',
  HEALTHCARE = 'healthcare',
  EDUCATIONAL = 'educational',
  PUBLIC_SPACE = 'public_space',
}

export enum PlantPlacement {
  INDOOR = 'indoor',
  OUTDOOR = 'outdoor',
  BALCONY = 'balcony',
  TERRACE = 'terrace',
  LOBBY = 'lobby',
  RECEPTION = 'reception',
  CAFETERIA = 'cafeteria',
  CONFERENCE_ROOM = 'conference_room',
  WORKSTATION = 'workstation',
  RESTROOM = 'restroom',
}

// -----------------------------------------------------------------------------
// Base / Common Types
// -----------------------------------------------------------------------------

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

export interface SoftDeletable {
  deletedAt?: string | null;
  isDeleted: boolean;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: GeoCoordinates;
}

export interface ContactInfo {
  phone: string;
  alternatePhone?: string;
  email: string;
  website?: string;
}

export interface ImageAsset {
  id: string;
  url: string;
  thumbnailUrl?: string;
  alt: string;
  width?: number;
  height?: number;
  mimeType?: string;
  sizeBytes?: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

// -----------------------------------------------------------------------------
// User & Auth
// -----------------------------------------------------------------------------

export interface User extends Timestamps {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  preferences: UserPreferences;
  metadata?: Record<string, unknown>;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  notifications: NotificationPreferences;
  theme: 'light' | 'dark' | 'system';
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  serviceReminders: boolean;
  paymentAlerts: boolean;
  plantHealthAlerts: boolean;
  promotions: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceId?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  role?: UserRole;
  companyName?: string;
  agreeToTerms: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
  issuedAt: string;
  expiresAt: string;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
  permissions: string[];
}

// -----------------------------------------------------------------------------
// Client
// -----------------------------------------------------------------------------

export interface Client extends Timestamps, SoftDeletable {
  id: string;
  userId: string;
  user?: User;
  companyName: string;
  displayName: string;
  industry?: string;
  gstNumber?: string;
  panNumber?: string;
  contactInfo: ContactInfo;
  billingAddress: Address;
  locations: Location[];
  subscriptionId?: string;
  subscription?: Subscription;
  accountManagerId?: string;
  accountManager?: User;
  totalPlants: number;
  activeLocations: number;
  esgScore?: number;
  notes?: string;
  tags: string[];
  metadata?: Record<string, unknown>;
}

// -----------------------------------------------------------------------------
// Location
// -----------------------------------------------------------------------------

export interface Location extends Timestamps {
  id: string;
  clientId: string;
  client?: Client;
  name: string;
  type: LocationType;
  address: Address;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  floorArea?: number;
  floorAreaUnit?: 'sqft' | 'sqm';
  numberOfFloors?: number;
  plants: Plant[];
  totalPlants: number;
  healthyPlants: number;
  assignedTeamId?: string;
  assignedTeam?: Team;
  accessInstructions?: string;
  operatingHours?: OperatingHours;
  photos: ImageAsset[];
  isActive: boolean;
  metadata?: Record<string, unknown>;
}

export interface OperatingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

// -----------------------------------------------------------------------------
// Plant & Species
// -----------------------------------------------------------------------------

export interface PlantSpecies extends Timestamps {
  id: string;
  commonName: string;
  scientificName: string;
  family: string;
  genus: string;
  description: string;
  nativeRegion: string;
  lightRequirement: LightRequirement;
  wateringFrequency: WateringFrequency;
  temperatureMin: number;
  temperatureMax: number;
  temperatureUnit: 'celsius' | 'fahrenheit';
  humidityMin: number;
  humidityMax: number;
  soilType: string;
  growthRate: 'slow' | 'moderate' | 'fast';
  maxHeight: number;
  maxHeightUnit: 'cm' | 'inches' | 'feet' | 'meters';
  toxicity: 'non_toxic' | 'mildly_toxic' | 'toxic' | 'highly_toxic';
  petFriendly: boolean;
  airPurifying: boolean;
  co2AbsorptionRate: number;
  oxygenProductionRate: number;
  indoorSuitability: number;
  maintenanceDifficulty: 'easy' | 'moderate' | 'hard' | 'expert';
  commonDiseases: string[];
  commonPests: string[];
  careInstructions: CareInstructions;
  images: ImageAsset[];
  isActive: boolean;
}

export interface CareInstructions {
  watering: string;
  light: string;
  soil: string;
  fertilizing: string;
  pruning: string;
  repotting: string;
  propagation: string;
  commonIssues: string;
  seasonalCare?: Record<string, string>;
}

export interface Plant extends Timestamps {
  id: string;
  plantCode: string;
  qrCode: string;
  speciesId: string;
  species?: PlantSpecies;
  locationId: string;
  location?: Location;
  clientId: string;
  client?: Client;
  nickname?: string;
  placement: PlantPlacement;
  placementDescription?: string;
  floorNumber?: number;
  zone?: string;
  growthStage: PlantGrowthStage;
  healthStatus: PlantHealthStatus;
  healthScore: number;
  lastWateredAt?: string;
  lastFertilizedAt?: string;
  lastPrunedAt?: string;
  lastInspectedAt?: string;
  installedAt: string;
  potType?: string;
  potSize?: string;
  potColor?: string;
  currentHeight?: number;
  currentHeightUnit?: 'cm' | 'inches';
  photos: ImageAsset[];
  healthLogs: PlantHealthLog[];
  notes?: string;
  tags: string[];
  isActive: boolean;
  replacementHistory: PlantReplacement[];
  metadata?: Record<string, unknown>;
}

export interface PlantReplacement {
  id: string;
  plantId: string;
  previousSpeciesId: string;
  newSpeciesId: string;
  reason: string;
  replacedAt: string;
  replacedBy: string;
  notes?: string;
}

export interface PlantHealthLog extends Timestamps {
  id: string;
  plantId: string;
  plant?: Plant;
  technicianId: string;
  technician?: Technician;
  serviceVisitId?: string;
  healthScore: number;
  previousHealthScore?: number;
  healthStatus: PlantHealthStatus;
  previousHealthStatus?: PlantHealthStatus;
  issues: HealthIssue[];
  treatmentsApplied: Treatment[];
  observations: string;
  recommendations: string;
  photos: ImageAsset[];
  environmentalReadings?: EnvironmentalReading;
  metadata?: Record<string, unknown>;
}

export interface HealthIssue {
  type: 'pest' | 'disease' | 'nutrient_deficiency' | 'overwatering' | 'underwatering' | 'light_issue' | 'temperature_stress' | 'physical_damage' | 'other';
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  affectedParts: string[];
}

export interface Treatment {
  type: 'pesticide' | 'fungicide' | 'fertilizer' | 'pruning' | 'repotting' | 'watering_adjustment' | 'relocation' | 'other';
  product?: string;
  dosage?: string;
  description: string;
  followUpRequired: boolean;
  followUpDate?: string;
}

export interface EnvironmentalReading {
  temperature?: number;
  humidity?: number;
  lightLevel?: number;
  soilMoisture?: number;
  soilPh?: number;
  recordedAt: string;
}

// -----------------------------------------------------------------------------
// Subscription & Plans
// -----------------------------------------------------------------------------

export interface SubscriptionPlan extends Timestamps {
  id: string;
  name: string;
  tier: SubscriptionTier;
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
  currency: string;
  setupFee: number;
  perPlantCost: number;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  metadata?: Record<string, unknown>;
}

export interface Subscription extends Timestamps {
  id: string;
  clientId: string;
  client?: Client;
  planId: string;
  plan?: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  nextBillingDate: string;
  totalPlants: number;
  totalLocations: number;
  monthlyAmount: number;
  currency: string;
  autoRenew: boolean;
  trialEndsAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  pausedAt?: string;
  resumeDate?: string;
  discountPercentage?: number;
  discountEndDate?: string;
  customTerms?: string;
  invoices: Invoice[];
  metadata?: Record<string, unknown>;
}

// -----------------------------------------------------------------------------
// Service Visit & Technician
// -----------------------------------------------------------------------------

export interface Technician extends Timestamps {
  id: string;
  userId: string;
  user?: User;
  employeeCode: string;
  specializations: ServiceType[];
  certifications: Certification[];
  teamId?: string;
  team?: Team;
  assignedLocations: string[];
  currentLocation?: GeoCoordinates;
  isAvailable: boolean;
  rating: number;
  totalVisitsCompleted: number;
  totalPlantsManaged: number;
  hireDate: string;
  vehicleInfo?: VehicleInfo;
  emergencyContact?: EmergencyContact;
  metadata?: Record<string, unknown>;
}

export interface Certification {
  name: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate?: string;
  certificateUrl?: string;
}

export interface VehicleInfo {
  type: string;
  registrationNumber: string;
  model?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface ServiceVisit extends Timestamps {
  id: string;
  visitCode: string;
  clientId: string;
  client?: Client;
  locationId: string;
  location?: Location;
  technicianId: string;
  technician?: Technician;
  teamId?: string;
  team?: Team;
  serviceType: ServiceType;
  status: ServiceVisitStatus;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduledDate: string;
  scheduledTimeStart: string;
  scheduledTimeEnd: string;
  actualStartTime?: string;
  actualEndTime?: string;
  duration?: number;
  plantsServiced: number;
  plantHealthLogs: PlantHealthLog[];
  tasksCompleted: ServiceTask[];
  materialsUsed: MaterialUsage[];
  photos: ImageAsset[];
  clientSignature?: string;
  clientFeedback?: ServiceFeedback;
  travelDistance?: number;
  notes?: string;
  internalNotes?: string;
  rescheduleHistory: RescheduleRecord[];
  metadata?: Record<string, unknown>;
}

export interface ServiceTask {
  id: string;
  description: string;
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
}

export interface MaterialUsage {
  inventoryItemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  cost: number;
}

export interface ServiceFeedback {
  rating: number;
  comment?: string;
  submittedAt: string;
}

export interface RescheduleRecord {
  previousDate: string;
  newDate: string;
  reason: string;
  rescheduledBy: string;
  rescheduledAt: string;
}

// -----------------------------------------------------------------------------
// Team
// -----------------------------------------------------------------------------

export interface Team extends Timestamps {
  id: string;
  name: string;
  leadId: string;
  lead?: Technician;
  members: Technician[];
  memberCount: number;
  assignedLocations: string[];
  assignedClients: string[];
  operatingArea?: string;
  isActive: boolean;
  performance: TeamPerformance;
  metadata?: Record<string, unknown>;
}

export interface TeamPerformance {
  avgRating: number;
  totalVisitsCompleted: number;
  onTimePercentage: number;
  clientSatisfaction: number;
  plantsManaged: number;
  period: string;
}

// -----------------------------------------------------------------------------
// Invoice & Payment
// -----------------------------------------------------------------------------

export interface Invoice extends Timestamps {
  id: string;
  invoiceNumber: string;
  clientId: string;
  client?: Client;
  subscriptionId?: string;
  subscription?: Subscription;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  currency: string;
  notes?: string;
  terms?: string;
  billingAddress: Address;
  pdfUrl?: string;
  payments: Payment[];
  reminders: InvoiceReminder[];
  metadata?: Record<string, unknown>;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate?: number;
  taxAmount?: number;
  serviceType?: ServiceType;
  period?: DateRange;
}

export interface InvoiceReminder {
  sentAt: string;
  method: 'email' | 'sms' | 'both';
  templateUsed: string;
}

export interface Payment extends Timestamps {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoice?: Invoice;
  clientId: string;
  client?: Client;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  gatewayResponse?: Record<string, unknown>;
  paidAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  refundReason?: string;
  receiptUrl?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

// -----------------------------------------------------------------------------
// Inventory
// -----------------------------------------------------------------------------

export interface Inventory extends Timestamps {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: InventoryCategory;
  status: InventoryStatus;
  quantity: number;
  unit: string;
  reorderLevel: number;
  reorderQuantity: number;
  costPrice: number;
  sellingPrice: number;
  currency: string;
  supplier?: SupplierInfo;
  warehouseLocation?: string;
  batchNumber?: string;
  expiryDate?: string;
  images: ImageAsset[];
  isActive: boolean;
  lastRestockedAt?: string;
  transactions: InventoryTransaction[];
  metadata?: Record<string, unknown>;
}

export interface SupplierInfo {
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: Address;
}

export interface InventoryTransaction {
  id: string;
  type: 'purchase' | 'usage' | 'adjustment' | 'return' | 'write_off';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  referenceId?: string;
  performedBy: string;
  performedAt: string;
  notes?: string;
}

// -----------------------------------------------------------------------------
// Notification
// -----------------------------------------------------------------------------

export interface Notification extends Timestamps {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  actionUrl?: string;
  actionLabel?: string;
  expiresAt?: string;
  channels: ('email' | 'sms' | 'push' | 'in_app')[];
  deliveredVia: ('email' | 'sms' | 'push' | 'in_app')[];
  metadata?: Record<string, unknown>;
}

// -----------------------------------------------------------------------------
// Dashboard & Analytics Types
// -----------------------------------------------------------------------------

export interface ESGMetrics {
  totalCO2Absorbed: number;
  totalCO2AbsorbedUnit: 'kg' | 'tonnes';
  totalOxygenProduced: number;
  totalOxygenProducedUnit: 'kg' | 'litres';
  greenCoverArea: number;
  greenCoverAreaUnit: 'sqft' | 'sqm';
  biodiversityIndex: number;
  airQualityImprovement: number;
  waterSaved: number;
  waterSavedUnit: 'litres' | 'gallons';
  energySaved: number;
  energySavedUnit: 'kWh';
  wellnessScore: number;
  equivalentTreesPlanted: number;
  carbonCreditsEarned: number;
  periodStart: string;
  periodEnd: string;
  comparisonPeriod?: ESGMetrics;
  trendDirection: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface PlantAnalytics {
  totalPlants: number;
  activePlants: number;
  healthyPlants: number;
  unhealthyPlants: number;
  criticalPlants: number;
  plantsAdded: number;
  plantsRemoved: number;
  plantsReplaced: number;
  averageHealthScore: number;
  healthDistribution: Record<PlantHealthStatus, number>;
  speciesDistribution: SpeciesCount[];
  locationDistribution: LocationPlantCount[];
  growthStageDistribution: Record<PlantGrowthStage, number>;
  monthlyHealthTrend: MonthlyMetric[];
  topPerformingSpecies: SpeciesPerformance[];
  commonIssues: IssueCount[];
  survivalRate: number;
  period: string;
}

export interface SpeciesCount {
  speciesId: string;
  speciesName: string;
  count: number;
  percentage: number;
}

export interface LocationPlantCount {
  locationId: string;
  locationName: string;
  totalPlants: number;
  healthyPlants: number;
  healthPercentage: number;
}

export interface MonthlyMetric {
  month: string;
  value: number;
  previousValue?: number;
  changePercentage?: number;
}

export interface SpeciesPerformance {
  speciesId: string;
  speciesName: string;
  averageHealthScore: number;
  survivalRate: number;
  totalCount: number;
}

export interface IssueCount {
  issue: string;
  count: number;
  percentage: number;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface RevenueMetrics {
  totalRevenue: number;
  recurringRevenue: number;
  oneTimeRevenue: number;
  currency: string;
  activeSubscriptions: number;
  newSubscriptions: number;
  cancelledSubscriptions: number;
  churnRate: number;
  averageRevenuePerClient: number;
  averageRevenuePerPlant: number;
  outstandingAmount: number;
  overdueAmount: number;
  collectionRate: number;
  monthlyRevenueTrend: MonthlyMetric[];
  revenueByPlan: PlanRevenue[];
  revenueByService: ServiceRevenue[];
  topClients: ClientRevenue[];
  period: string;
}

export interface PlanRevenue {
  planId: string;
  planName: string;
  tier: SubscriptionTier;
  subscribers: number;
  revenue: number;
  percentage: number;
}

export interface ServiceRevenue {
  serviceType: ServiceType;
  revenue: number;
  count: number;
  percentage: number;
}

export interface ClientRevenue {
  clientId: string;
  clientName: string;
  revenue: number;
  plantCount: number;
  plan: string;
}

export interface DashboardStats {
  totalClients: number;
  totalPlants: number;
  totalLocations: number;
  totalTechnicians: number;
  activeSubscriptions: number;
  scheduledVisits: number;
  completedVisitsToday: number;
  pendingInvoices: number;
  monthlyRevenue: number;
  clientSatisfaction: number;
  plantHealthAverage: number;
  co2AbsorbedThisMonth: number;
  recentNotifications: Notification[];
  upcomingVisits: ServiceVisit[];
  recentHealthAlerts: PlantHealthLog[];
  esgMetrics: ESGMetrics;
  plantAnalytics: PlantAnalytics;
  revenueMetrics: RevenueMetrics;
}

// -----------------------------------------------------------------------------
// API Response Types
// -----------------------------------------------------------------------------

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
    stack?: string;
  };
  timestamp: string;
  requestId?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// -----------------------------------------------------------------------------
// Query & Filter Types
// -----------------------------------------------------------------------------

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PlantFilters extends PaginationParams {
  clientId?: string;
  locationId?: string;
  speciesId?: string;
  healthStatus?: PlantHealthStatus;
  growthStage?: PlantGrowthStage;
  placement?: PlantPlacement;
  search?: string;
  isActive?: boolean;
  healthScoreMin?: number;
  healthScoreMax?: number;
  installedAfter?: string;
  installedBefore?: string;
}

export interface ClientFilters extends PaginationParams {
  search?: string;
  status?: UserStatus;
  subscriptionTier?: SubscriptionTier;
  industry?: string;
  city?: string;
  accountManagerId?: string;
  tags?: string[];
  hasActiveSubscription?: boolean;
}

export interface ServiceVisitFilters extends PaginationParams {
  clientId?: string;
  locationId?: string;
  technicianId?: string;
  teamId?: string;
  status?: ServiceVisitStatus;
  serviceType?: ServiceType;
  scheduledDateFrom?: string;
  scheduledDateTo?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface InvoiceFilters extends PaginationParams {
  clientId?: string;
  status?: InvoiceStatus;
  issueDateFrom?: string;
  issueDateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  amountMin?: number;
  amountMax?: number;
}

// -----------------------------------------------------------------------------
// Utility Types
// -----------------------------------------------------------------------------

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type WithRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'>;

export type UpdateInput<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

export type ID = string;

export type Nullable<T> = T | null;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
