// ---------------------------------------------------------------------------
// Mongoose Models - Barrel Export
// ---------------------------------------------------------------------------
// Central export point for all MongoDB/Mongoose models used by VRIKSHAM.
// Import models from here to ensure consistent usage across the application.
// ---------------------------------------------------------------------------

// User
export { default as User } from './user.model';
export {
  UserRole,
  UserStatus,
  type IUser,
  type IUserDocument,
  type IUserModel,
  type IRefreshToken,
  type IUserPreferences,
} from './user.model';

// Organization
export { default as Organization } from './organization.model';
export {
  OrganizationType,
  OrganizationStatus,
  type IOrganization,
  type IOrganizationDocument,
  type IOrganizationModel,
  type IAddress,
  type IContactPerson,
} from './organization.model';

// Location
export { default as Location } from './location.model';
export {
  LocationType,
  LocationStatus,
  type ILocation,
  type ILocationDocument,
  type ILocationModel,
  type ICoordinates,
} from './location.model';

// Plant
export { default as Plant } from './plant.model';
export {
  PlantStatus,
  GrowthStage,
  PlantPlacement,
  type IPlant,
  type IPlantDocument,
  type IPlantModel,
  type IReplacementEntry,
} from './plant.model';

// Plant Species
export { default as PlantSpecies } from './plant-species.model';
export {
  PlantCategory,
  CareDifficulty,
  type IPlantSpecies,
  type IPlantSpeciesDocument,
  type IPlantSpeciesModel,
  type ICareInstructions,
} from './plant-species.model';

// Subscription
export { default as Subscription } from './subscription.model';
export {
  SubscriptionStatus,
  BillingCycle,
  type ISubscription,
  type ISubscriptionDocument,
  type ISubscriptionModel,
} from './subscription.model';

// Subscription Plan
export { default as SubscriptionPlan } from './subscription-plan.model';
export {
  PlanTier,
  SupportLevel,
  type ISubscriptionPlan,
  type ISubscriptionPlanDocument,
  type ISubscriptionPlanModel,
  type IPlanPrice,
  type IStripePriceIds,
} from './subscription-plan.model';

// Maintenance Log
export { default as MaintenanceLog } from './maintenance-log.model';
export {
  MaintenanceType,
  MaintenanceStatus,
  type IMaintenanceLog,
  type IMaintenanceLogDocument,
  type IMaintenanceLogModel,
  type IMaintenanceTask,
  type IMaintenanceFeedback,
  type IMaterialUsed,
} from './maintenance-log.model';

// Payment
export { default as Payment } from './payment.model';
export {
  PaymentMethod,
  PaymentStatus,
  type IPayment,
  type IPaymentDocument,
  type IPaymentModel,
  type ILineItem,
} from './payment.model';

// Notification
export { default as Notification } from './notification.model';
export {
  NotificationType,
  NotificationPriority,
  type INotification,
  type INotificationDocument,
  type INotificationModel,
} from './notification.model';
