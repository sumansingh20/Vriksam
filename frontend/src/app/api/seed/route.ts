// =============================================================================
// VRIKSHAM API - POST /api/seed
// =============================================================================
// Seeds the MongoDB database with demo data. ONLY works in development.
// Creates 3 demo users, subscription plans, plant species, organizations,
// locations, plants, subscriptions, maintenance logs, payments, and
// notifications.
// =============================================================================

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import {
  User,
  Organization,
  Location,
  Plant,
  PlantSpecies,
  Subscription,
  SubscriptionPlan,
  MaintenanceLog,
  Payment,
  Notification,
  Counter,
  InvoiceCounter,
  UserRole,
  UserStatus,
  OrganizationType,
  OrganizationStatus,
  LocationType,
  LocationStatus,
  PlantStatus,
  GrowthStage,
  PlantPlacement,
  PlantCategory,
  CareDifficulty,
  SubscriptionStatus,
  BillingCycle,
  PlanTier,
  SupportLevel,
  MaintenanceType,
  MaintenanceStatus,
  PaymentMethod,
  PaymentStatus,
  NotificationType,
  NotificationPriority,
} from '@/lib/models';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

// ---------------------------------------------------------------------------
// POST /api/seed
// ---------------------------------------------------------------------------
export async function POST() {
  // Only allow seeding in development
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_SEED) {
    return NextResponse.json(
      { success: false, message: 'Seeding is only available in development environment' },
      { status: 403 },
    );
  }

  try {
    await connectDB();

    // ------------------------------------------------------------------
    // Clear all collections
    // ------------------------------------------------------------------
    await Promise.all([
      User.deleteMany({}),
      Organization.deleteMany({}),
      Location.deleteMany({}),
      Plant.deleteMany({}),
      PlantSpecies.deleteMany({}),
      Subscription.deleteMany({}),
      SubscriptionPlan.deleteMany({}),
      MaintenanceLog.deleteMany({}),
      Payment.deleteMany({}),
      Notification.deleteMany({}),
      Counter.deleteMany({}),
      InvoiceCounter.deleteMany({}),
    ]);

    // ------------------------------------------------------------------
    // 1. Users (passwords hashed by pre-save hook)
    // ------------------------------------------------------------------
    const users = await User.insertMany([
      {
        name: 'Priya Sharma',
        email: 'user@vriksham.org',
        password: 'User@123',
        phone: '+91 98765 43210',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        lastLoginAt: daysAgo(1),
        preferences: {
          notifications: {
            email: true, push: true, sms: false,
            maintenanceReminders: true, paymentAlerts: true, healthAlerts: true,
          },
        },
      },
      {
        name: 'Rahul Verma',
        email: 'partner@vriksham.org',
        password: 'Partner@123',
        phone: '+91 98765 43211',
        role: UserRole.PARTNER,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        lastLoginAt: daysAgo(0),
        preferences: {
          notifications: {
            email: true, push: true, sms: true,
            maintenanceReminders: true, paymentAlerts: true, healthAlerts: true,
          },
        },
      },
      {
        name: 'Anita Desai',
        email: 'admin@vriksham.org',
        password: 'Admin@123',
        phone: '+91 98765 43212',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        lastLoginAt: daysAgo(0),
        preferences: {
          notifications: {
            email: true, push: true, sms: true,
            maintenanceReminders: true, paymentAlerts: true, healthAlerts: true,
          },
        },
      },
    ]);
    const userClient = users[0]!;
    const userPartner = users[1]!;
    const userAdmin = users[2]!;

    // ------------------------------------------------------------------
    // 2. Subscription Plans
    // ------------------------------------------------------------------
    const plans = await SubscriptionPlan.insertMany([
      {
        name: 'Starter',
        slug: 'starter',
        description: 'Perfect for small offices and startups looking to add greenery to their workspace.',
        tier: PlanTier.STARTER,
        price: { monthly: 4999, quarterly: 13497, annual: 47988 },
        currency: 'INR',
        features: [
          'Up to 25 plants', 'Up to 2 locations', 'Monthly maintenance visits',
          'Basic plant health monitoring', 'Email support', 'Quarterly health reports',
        ],
        plantLimit: 25,
        locationLimit: 2,
        supportLevel: SupportLevel.EMAIL,
        isActive: true,
        sortOrder: 1,
      },
      {
        name: 'Professional',
        slug: 'professional',
        description: 'Ideal for mid-size companies that want comprehensive green infrastructure management.',
        tier: PlanTier.PROFESSIONAL,
        price: { monthly: 14999, quarterly: 40497, annual: 143988 },
        currency: 'INR',
        features: [
          'Up to 100 plants', 'Up to 10 locations', 'Bi-weekly maintenance visits',
          'Advanced AI health monitoring', 'Priority support', 'Monthly health reports',
          'Plant replacement guarantee', 'Dedicated account manager',
        ],
        plantLimit: 100,
        locationLimit: 10,
        supportLevel: SupportLevel.PRIORITY,
        isActive: true,
        sortOrder: 2,
      },
      {
        name: 'Enterprise',
        slug: 'enterprise',
        description: 'Full-scale green infrastructure solution for large organizations and campuses.',
        tier: PlanTier.ENTERPRISE,
        price: { monthly: 49999, quarterly: 134997, annual: 479988 },
        currency: 'INR',
        features: [
          'Unlimited plants', 'Unlimited locations', 'Weekly maintenance visits',
          'Premium AI health monitoring with predictions', 'Dedicated support team',
          'Weekly health reports', 'Plant replacement guarantee', 'Custom plant selection',
          'Sustainability reporting & CO2 dashboard', 'API access', 'White-label options',
        ],
        plantLimit: 9999,
        locationLimit: 999,
        supportLevel: SupportLevel.DEDICATED,
        isActive: true,
        sortOrder: 3,
      },
    ]);
    const planStarter = plans[0]!;
    const planPro = plans[1]!;
    const planEnterprise = plans[2]!;

    // ------------------------------------------------------------------
    // 3. Plant Species
    // ------------------------------------------------------------------
    const species = await PlantSpecies.insertMany([
      {
        commonName: 'Snake Plant', scientificName: 'Dracaena trifasciata',
        category: PlantCategory.INDOOR,
        description: 'One of the most tolerant indoor plants. Excellent air purifier that converts CO2 to oxygen even at night.',
        careInstructions: {
          watering: 'Water every 2-3 weeks, allowing soil to dry completely.',
          sunlight: 'Thrives in indirect light but tolerates low light.',
          temperature: '15-29C (60-85F). Avoid below 10C.',
          humidity: 'Tolerates normal room humidity.',
          fertilizer: 'Feed once a month during spring and summer.',
        },
        difficulty: CareDifficulty.EASY,
        co2Absorption: 6.8, o2Production: 4.9, airPurificationScore: 9,
        growthRate: 'Slow to moderate', maxHeight: '120 cm', isActive: true,
      },
      {
        commonName: 'Peace Lily', scientificName: 'Spathiphyllum wallisii',
        category: PlantCategory.FLOWERING,
        description: 'Elegant flowering plant known for its white blooms and exceptional ability to remove VOCs.',
        careInstructions: {
          watering: 'Keep soil consistently moist but not waterlogged.',
          sunlight: 'Prefers bright, indirect light.',
          temperature: '18-30C (65-86F). Keep away from cold drafts.',
          humidity: 'Prefers high humidity. Mist regularly.',
          fertilizer: 'Feed every 6-8 weeks during growing season.',
        },
        difficulty: CareDifficulty.EASY,
        co2Absorption: 5.2, o2Production: 3.8, airPurificationScore: 8,
        growthRate: 'Moderate', maxHeight: '90 cm', isActive: true,
      },
      {
        commonName: 'Money Plant', scientificName: 'Epipremnum aureum',
        category: PlantCategory.INDOOR,
        description: 'Fast-growing trailing vine popular in Indian households. Removes formaldehyde and xylene.',
        careInstructions: {
          watering: 'Water when top 2 inches of soil are dry.',
          sunlight: 'Bright, indirect light. Tolerates low light.',
          temperature: '18-30C (65-86F). Very adaptable.',
          humidity: 'Prefers moderate humidity.',
          fertilizer: 'Feed monthly during spring and summer.',
        },
        difficulty: CareDifficulty.EASY,
        co2Absorption: 4.5, o2Production: 3.2, airPurificationScore: 7,
        growthRate: 'Fast', maxHeight: '200 cm (trailing)', isActive: true,
      },
      {
        commonName: 'Areca Palm', scientificName: 'Dypsis lutescens',
        category: PlantCategory.PALM,
        description: 'The most effective air humidifying plant. Popular lobby and office plant in India.',
        careInstructions: {
          watering: 'Water regularly, keeping soil evenly moist.',
          sunlight: 'Bright, indirect sunlight. Avoid direct afternoon sun.',
          temperature: '18-30C (65-86F). Ideal for Indian offices.',
          humidity: 'Prefers high humidity (above 50%).',
          fertilizer: 'Feed every 2 months with palm-specific fertilizer.',
        },
        difficulty: CareDifficulty.MODERATE,
        co2Absorption: 8.5, o2Production: 6.1, airPurificationScore: 9,
        growthRate: 'Moderate to fast', maxHeight: '200 cm', isActive: true,
      },
      {
        commonName: 'Rubber Plant', scientificName: 'Ficus elastica',
        category: PlantCategory.INDOOR,
        description: 'Bold, glossy-leaved plant excellent at removing formaldehyde.',
        careInstructions: {
          watering: 'Water when top inch of soil is dry.',
          sunlight: 'Bright, indirect light.',
          temperature: '16-27C (60-80F).',
          humidity: 'Moderate humidity.',
          fertilizer: 'Feed monthly during spring and summer.',
        },
        difficulty: CareDifficulty.MODERATE,
        co2Absorption: 7.2, o2Production: 5.1, airPurificationScore: 8,
        growthRate: 'Moderate', maxHeight: '250 cm', isActive: true,
      },
      {
        commonName: 'Boston Fern', scientificName: 'Nephrolepis exaltata',
        category: PlantCategory.FERN,
        description: 'Lush, feathery fern. One of the best plants for removing formaldehyde.',
        careInstructions: {
          watering: 'Keep soil consistently moist.',
          sunlight: 'Indirect light to partial shade.',
          temperature: '16-24C (60-75F).',
          humidity: 'High humidity essential (above 60%).',
          fertilizer: 'Feed every 2 weeks during growing season.',
        },
        difficulty: CareDifficulty.HARD,
        co2Absorption: 4.0, o2Production: 2.9, airPurificationScore: 9,
        growthRate: 'Fast', maxHeight: '90 cm', isActive: true,
      },
      {
        commonName: 'Jade Plant', scientificName: 'Crassula ovata',
        category: PlantCategory.SUCCULENT,
        description: 'Considered auspicious in Indian culture. Hardy succulent.',
        careInstructions: {
          watering: 'Water sparingly. Let soil dry completely between waterings.',
          sunlight: 'Bright direct to indirect light.',
          temperature: '18-30C (65-86F).',
          humidity: 'Low to moderate humidity.',
          fertilizer: 'Feed once every 3 months.',
        },
        difficulty: CareDifficulty.EASY,
        co2Absorption: 2.1, o2Production: 1.5, airPurificationScore: 5,
        growthRate: 'Slow', maxHeight: '100 cm', isActive: true,
      },
      {
        commonName: 'Tulsi (Holy Basil)', scientificName: 'Ocimum tenuiflorum',
        category: PlantCategory.OUTDOOR,
        description: 'Sacred plant in Indian tradition with medicinal properties.',
        careInstructions: {
          watering: 'Water daily in summer, every other day in winter.',
          sunlight: 'Full sun. Requires at least 6 hours.',
          temperature: '20-35C (68-95F).',
          humidity: 'Moderate to high humidity.',
          fertilizer: 'Use organic compost monthly.',
        },
        difficulty: CareDifficulty.EASY,
        co2Absorption: 3.5, o2Production: 2.5, airPurificationScore: 7,
        growthRate: 'Fast', maxHeight: '75 cm', isActive: true,
      },
    ]);

    // ------------------------------------------------------------------
    // 4. Organizations
    // ------------------------------------------------------------------
    const orgs = await Organization.insertMany([
      {
        name: 'TechCorp Solutions Pvt. Ltd.',
        type: OrganizationType.CORPORATE,
        email: 'admin@techcorp.in',
        phone: '+91 80 4567 8901',
        address: {
          street: '42, MG Road, Indiranagar', city: 'Bengaluru',
          state: 'Karnataka', postalCode: '560038', country: 'India',
        },
        contactPerson: { name: 'Vikram Mehta', email: 'vikram@techcorp.in', phone: '+91 98765 11111' },
        status: OrganizationStatus.ACTIVE,
        gstNumber: '29AABCT1234F1ZH',
        panNumber: 'AABCT1234F',
        contractStartDate: daysAgo(180),
        contractEndDate: daysFromNow(185),
        notes: 'Premium corporate client. 3 floors with greenery.',
        userId: userClient._id,
        partnerId: userPartner._id,
      },
      {
        name: 'Green Valley Residences',
        type: OrganizationType.RESIDENTIAL,
        email: 'manager@greenvalley.in',
        phone: '+91 44 2345 6789',
        address: {
          street: '15, Anna Salai, T. Nagar', city: 'Chennai',
          state: 'Tamil Nadu', postalCode: '600017', country: 'India',
        },
        contactPerson: { name: 'Lakshmi Narayan', email: 'lakshmi@greenvalley.in', phone: '+91 98765 22222' },
        status: OrganizationStatus.ACTIVE,
        gstNumber: '33AABCG5678H1ZQ',
        panNumber: 'AABCG5678H',
        contractStartDate: daysAgo(90),
        contractEndDate: daysFromNow(275),
        notes: 'Residential society with common areas and terrace garden.',
        userId: userClient._id,
        partnerId: userPartner._id,
      },
      {
        name: 'Luxe Hotels & Resorts',
        type: OrganizationType.HOSPITALITY,
        email: 'operations@luxehotels.in',
        phone: '+91 22 6789 0123',
        address: {
          street: '7, Marine Drive, Colaba', city: 'Mumbai',
          state: 'Maharashtra', postalCode: '400005', country: 'India',
        },
        contactPerson: { name: 'Sanjay Kapoor', email: 'sanjay@luxehotels.in', phone: '+91 98765 33333' },
        status: OrganizationStatus.ACTIVE,
        gstNumber: '27AABCL9012J1ZR',
        panNumber: 'AABCL9012J',
        contractStartDate: daysAgo(365),
        contractEndDate: daysFromNow(0),
        notes: 'Five-star hotel chain. High-end botanical installations.',
        userId: userClient._id,
        partnerId: userPartner._id,
      },
    ]);
    const orgTechCorp = orgs[0]!;
    const orgGreenValley = orgs[1]!;
    const orgLuxe = orgs[2]!;

    // ------------------------------------------------------------------
    // 5. Locations
    // ------------------------------------------------------------------
    const locations = await Location.insertMany([
      {
        name: 'Main Lobby', organizationId: orgTechCorp._id,
        type: LocationType.LOBBY, floor: 'Ground Floor', area: 1500,
        address: '42, MG Road, Indiranagar, Bengaluru',
        coordinates: { lat: 12.9716, lng: 77.6412 },
        plantCapacity: 20, currentPlantCount: 5, maintenanceDay: 'Monday',
        status: LocationStatus.ACTIVE,
      },
      {
        name: 'Engineering Floor', organizationId: orgTechCorp._id,
        type: LocationType.OFFICE, floor: '3rd Floor', area: 3000,
        address: '42, MG Road, Indiranagar, Bengaluru',
        coordinates: { lat: 12.9716, lng: 77.6412 },
        plantCapacity: 30, currentPlantCount: 4, maintenanceDay: 'Monday',
        status: LocationStatus.ACTIVE,
      },
      {
        name: 'Rooftop Cafeteria', organizationId: orgTechCorp._id,
        type: LocationType.CAFETERIA, floor: '8th Floor', area: 2000,
        address: '42, MG Road, Indiranagar, Bengaluru',
        coordinates: { lat: 12.9716, lng: 77.6412 },
        plantCapacity: 15, currentPlantCount: 0, maintenanceDay: 'Tuesday',
        status: LocationStatus.ACTIVE,
      },
      {
        name: 'Society Lobby', organizationId: orgGreenValley._id,
        type: LocationType.LOBBY, floor: 'Ground Floor', area: 800,
        address: '15, Anna Salai, T. Nagar, Chennai',
        coordinates: { lat: 13.0418, lng: 80.2341 },
        plantCapacity: 12, currentPlantCount: 2, maintenanceDay: 'Wednesday',
        status: LocationStatus.ACTIVE,
      },
      {
        name: 'Terrace Garden', organizationId: orgGreenValley._id,
        type: LocationType.TERRACE, floor: 'Terrace', area: 1200,
        address: '15, Anna Salai, T. Nagar, Chennai',
        coordinates: { lat: 13.0418, lng: 80.2341 },
        plantCapacity: 25, currentPlantCount: 1, maintenanceDay: 'Wednesday',
        status: LocationStatus.ACTIVE,
      },
      {
        name: 'Grand Lobby', organizationId: orgLuxe._id,
        type: LocationType.LOBBY, floor: 'Ground Floor', area: 2500,
        address: '7, Marine Drive, Colaba, Mumbai',
        coordinates: { lat: 18.9322, lng: 72.8264 },
        plantCapacity: 35, currentPlantCount: 3, maintenanceDay: 'Thursday',
        status: LocationStatus.ACTIVE,
      },
      {
        name: 'Poolside Garden', organizationId: orgLuxe._id,
        type: LocationType.GARDEN, floor: '1st Floor', area: 4000,
        address: '7, Marine Drive, Colaba, Mumbai',
        coordinates: { lat: 18.9322, lng: 72.8264 },
        plantCapacity: 50, currentPlantCount: 2, maintenanceDay: 'Friday',
        status: LocationStatus.ACTIVE,
      },
    ]);
    const locTCLobby = locations[0]!;
    const locTCEng = locations[1]!;
    // locations[2] = TC Cafe (not used in seed plants below)
    const locGVLobby = locations[3]!;
    const locGVTerrace = locations[4]!;
    const locLuxeLobby = locations[5]!;
    const locLuxeGarden = locations[6]!;

    // ------------------------------------------------------------------
    // 6. Plants (sample selection)
    // ------------------------------------------------------------------
    const plantsCreated = await Plant.create([
      {
        name: 'Lobby Areca Palm #1', species: species[3]!._id,
        locationId: locTCLobby._id, organizationId: orgTechCorp._id,
        healthScore: 92, status: PlantStatus.HEALTHY, growthStage: GrowthStage.MATURE,
        placement: PlantPlacement.FLOOR, lastMaintenanceDate: daysAgo(7),
        nextMaintenanceDate: daysFromNow(7), installedDate: daysAgo(150),
      },
      {
        name: 'Lobby Snake Plant #1', species: species[0]!._id,
        locationId: locTCLobby._id, organizationId: orgTechCorp._id,
        healthScore: 88, status: PlantStatus.HEALTHY, growthStage: GrowthStage.MATURE,
        placement: PlantPlacement.FLOOR, lastMaintenanceDate: daysAgo(7),
        nextMaintenanceDate: daysFromNow(7), installedDate: daysAgo(150),
      },
      {
        name: 'Lobby Peace Lily #1', species: species[1]!._id,
        locationId: locTCLobby._id, organizationId: orgTechCorp._id,
        healthScore: 75, status: PlantStatus.NEEDS_ATTENTION, growthStage: GrowthStage.FLOWERING,
        placement: PlantPlacement.DESK, lastMaintenanceDate: daysAgo(14),
        nextMaintenanceDate: daysFromNow(0), installedDate: daysAgo(120),
        notes: 'Leaves showing slight yellowing. May need more indirect light.',
      },
      {
        name: 'Eng Desk Snake Plant #1', species: species[0]!._id,
        locationId: locTCEng._id, organizationId: orgTechCorp._id,
        healthScore: 40, status: PlantStatus.CRITICAL, growthStage: GrowthStage.MATURE,
        placement: PlantPlacement.DESK, lastMaintenanceDate: daysAgo(30),
        nextMaintenanceDate: daysAgo(16), installedDate: daysAgo(200),
        notes: 'Root rot detected. Scheduled for replacement.',
      },
      {
        name: 'Eng Jade Plant #1', species: species[6]!._id,
        locationId: locTCEng._id, organizationId: orgTechCorp._id,
        healthScore: 85, status: PlantStatus.HEALTHY, growthStage: GrowthStage.JUVENILE,
        placement: PlantPlacement.DESK, lastMaintenanceDate: daysAgo(14),
        nextMaintenanceDate: daysFromNow(0), installedDate: daysAgo(60),
      },
      {
        name: 'Society Lobby Areca Palm', species: species[3]!._id,
        locationId: locGVLobby._id, organizationId: orgGreenValley._id,
        healthScore: 91, status: PlantStatus.HEALTHY, growthStage: GrowthStage.MATURE,
        placement: PlantPlacement.FLOOR, lastMaintenanceDate: daysAgo(5),
        nextMaintenanceDate: daysFromNow(9), installedDate: daysAgo(80),
      },
      {
        name: 'Terrace Tulsi #1', species: species[7]!._id,
        locationId: locGVTerrace._id, organizationId: orgGreenValley._id,
        healthScore: 78, status: PlantStatus.NEEDS_ATTENTION, growthStage: GrowthStage.MATURE,
        placement: PlantPlacement.OUTDOOR, lastMaintenanceDate: daysAgo(10),
        nextMaintenanceDate: daysFromNow(4), installedDate: daysAgo(60),
        notes: 'Needs more direct sunlight. Consider relocating.',
      },
      {
        name: 'Grand Lobby Rubber Plant #1', species: species[4]!._id,
        locationId: locLuxeLobby._id, organizationId: orgLuxe._id,
        healthScore: 96, status: PlantStatus.HEALTHY, growthStage: GrowthStage.MATURE,
        placement: PlantPlacement.FLOOR, lastMaintenanceDate: daysAgo(3),
        nextMaintenanceDate: daysFromNow(4), installedDate: daysAgo(300),
      },
      {
        name: 'Grand Lobby Areca Palm #1', species: species[3]!._id,
        locationId: locLuxeLobby._id, organizationId: orgLuxe._id,
        healthScore: 93, status: PlantStatus.HEALTHY, growthStage: GrowthStage.MATURE,
        placement: PlantPlacement.FLOOR, lastMaintenanceDate: daysAgo(3),
        nextMaintenanceDate: daysFromNow(4), installedDate: daysAgo(350),
      },
      {
        name: 'Poolside Boston Fern #1', species: species[5]!._id,
        locationId: locLuxeGarden._id, organizationId: orgLuxe._id,
        healthScore: 82, status: PlantStatus.HEALTHY, growthStage: GrowthStage.MATURE,
        placement: PlantPlacement.HANGING, lastMaintenanceDate: daysAgo(5),
        nextMaintenanceDate: daysFromNow(2), installedDate: daysAgo(200),
      },
    ]);

    // ------------------------------------------------------------------
    // 7. Subscriptions
    // ------------------------------------------------------------------
    const subscriptions = await Subscription.insertMany([
      {
        organizationId: orgTechCorp._id,
        planId: planPro._id,
        status: SubscriptionStatus.ACTIVE,
        billingCycle: BillingCycle.QUARTERLY,
        startDate: daysAgo(180),
        endDate: daysFromNow(185),
        nextBillingDate: daysFromNow(5),
        amount: 40497,
        currency: 'INR',
        autoRenew: true,
      },
      {
        organizationId: orgGreenValley._id,
        planId: planStarter._id,
        status: SubscriptionStatus.ACTIVE,
        billingCycle: BillingCycle.MONTHLY,
        startDate: daysAgo(90),
        endDate: daysFromNow(275),
        nextBillingDate: daysFromNow(20),
        amount: 4999,
        currency: 'INR',
        autoRenew: true,
      },
      {
        organizationId: orgLuxe._id,
        planId: planEnterprise._id,
        status: SubscriptionStatus.ACTIVE,
        billingCycle: BillingCycle.ANNUAL,
        startDate: daysAgo(365),
        endDate: daysFromNow(0),
        nextBillingDate: daysFromNow(0),
        amount: 479988,
        currency: 'INR',
        autoRenew: true,
      },
    ]);

    // ------------------------------------------------------------------
    // 8. Maintenance Logs
    // ------------------------------------------------------------------
    const maintenanceLogs = await MaintenanceLog.insertMany([
      {
        plantId: plantsCreated[0]!._id,
        locationId: locTCLobby._id,
        organizationId: orgTechCorp._id,
        technicianId: userPartner._id,
        partnerId: userPartner._id,
        type: MaintenanceType.ROUTINE,
        status: MaintenanceStatus.COMPLETED,
        scheduledDate: daysAgo(7),
        completedDate: daysAgo(7),
        duration: 30,
        tasks: [
          { task: 'Water plant', completed: true },
          { task: 'Check soil moisture', completed: true },
          { task: 'Trim dead leaves', completed: true },
          { task: 'Apply fertilizer', completed: true },
        ],
        healthScoreBefore: 88,
        healthScoreAfter: 92,
        notes: 'Routine maintenance completed. Plant in excellent health.',
      },
      {
        plantId: plantsCreated[2]!._id,
        locationId: locTCLobby._id,
        organizationId: orgTechCorp._id,
        technicianId: userPartner._id,
        partnerId: userPartner._id,
        type: MaintenanceType.EMERGENCY,
        status: MaintenanceStatus.SCHEDULED,
        scheduledDate: daysFromNow(1),
        tasks: [
          { task: 'Inspect yellowing leaves', completed: false },
          { task: 'Test soil pH', completed: false },
          { task: 'Adjust light exposure', completed: false },
        ],
        healthScoreBefore: 75,
        notes: 'Peace Lily showing yellowing. Emergency inspection scheduled.',
      },
      {
        plantId: plantsCreated[3]!._id,
        locationId: locTCEng._id,
        organizationId: orgTechCorp._id,
        technicianId: userPartner._id,
        partnerId: userPartner._id,
        type: MaintenanceType.REPLACEMENT,
        status: MaintenanceStatus.SCHEDULED,
        scheduledDate: daysFromNow(3),
        tasks: [
          { task: 'Remove rotting plant', completed: false },
          { task: 'Sterilize pot', completed: false },
          { task: 'Install replacement plant', completed: false },
        ],
        healthScoreBefore: 40,
        notes: 'Root rot confirmed. Plant replacement scheduled.',
      },
      {
        plantId: plantsCreated[5]!._id,
        locationId: locGVLobby._id,
        organizationId: orgGreenValley._id,
        technicianId: userPartner._id,
        partnerId: userPartner._id,
        type: MaintenanceType.ROUTINE,
        status: MaintenanceStatus.COMPLETED,
        scheduledDate: daysAgo(5),
        completedDate: daysAgo(5),
        duration: 25,
        tasks: [
          { task: 'Water plant', completed: true },
          { task: 'Wipe leaves', completed: true },
          { task: 'Check for pests', completed: true },
        ],
        healthScoreBefore: 87,
        healthScoreAfter: 91,
        notes: 'Routine visit. Areca Palm responding well to care.',
      },
      {
        plantId: plantsCreated[7]!._id,
        locationId: locLuxeLobby._id,
        organizationId: orgLuxe._id,
        technicianId: userPartner._id,
        partnerId: userPartner._id,
        type: MaintenanceType.ROUTINE,
        status: MaintenanceStatus.COMPLETED,
        scheduledDate: daysAgo(3),
        completedDate: daysAgo(3),
        duration: 45,
        tasks: [
          { task: 'Deep watering', completed: true },
          { task: 'Leaf polishing', completed: true },
          { task: 'Pest inspection', completed: true },
          { task: 'Soil top-dressing', completed: true },
        ],
        healthScoreBefore: 93,
        healthScoreAfter: 96,
        feedback: { rating: 5, comment: 'Excellent service as always!' },
        notes: 'Premium maintenance for Luxe Hotels lobby.',
      },
    ]);

    // ------------------------------------------------------------------
    // 9. Payments
    // ------------------------------------------------------------------
    const payments = await Payment.create([
      {
        organizationId: orgTechCorp._id,
        subscriptionId: subscriptions[0]!._id,
        amount: 40497,
        currency: 'INR',
        method: PaymentMethod.STRIPE,
        status: PaymentStatus.COMPLETED,
        paidAt: daysAgo(90),
        dueDate: daysAgo(90),
        lineItems: [
          { description: 'Professional Plan - Quarterly', quantity: 1, unitPrice: 40497, total: 40497 },
        ],
        notes: 'Quarterly subscription payment.',
      },
      {
        organizationId: orgGreenValley._id,
        subscriptionId: subscriptions[1]!._id,
        amount: 4999,
        currency: 'INR',
        method: PaymentMethod.UPI,
        status: PaymentStatus.COMPLETED,
        paidAt: daysAgo(30),
        dueDate: daysAgo(30),
        lineItems: [
          { description: 'Starter Plan - Monthly', quantity: 1, unitPrice: 4999, total: 4999 },
        ],
      },
      {
        organizationId: orgLuxe._id,
        subscriptionId: subscriptions[2]!._id,
        amount: 479988,
        currency: 'INR',
        method: PaymentMethod.BANK_TRANSFER,
        status: PaymentStatus.COMPLETED,
        paidAt: daysAgo(365),
        dueDate: daysAgo(365),
        lineItems: [
          { description: 'Enterprise Plan - Annual', quantity: 1, unitPrice: 479988, total: 479988 },
        ],
        notes: 'Annual enterprise subscription.',
      },
      {
        organizationId: orgTechCorp._id,
        subscriptionId: subscriptions[0]!._id,
        amount: 40497,
        currency: 'INR',
        method: PaymentMethod.STRIPE,
        status: PaymentStatus.PENDING,
        dueDate: daysFromNow(5),
        lineItems: [
          { description: 'Professional Plan - Quarterly Renewal', quantity: 1, unitPrice: 40497, total: 40497 },
        ],
        notes: 'Upcoming quarterly renewal.',
      },
    ]);

    // ------------------------------------------------------------------
    // 10. Notifications
    // ------------------------------------------------------------------
    await Notification.insertMany([
      {
        userId: userClient._id,
        type: NotificationType.PLANT_HEALTH_ALERT,
        title: 'Plant Health Alert: Peace Lily',
        message: 'Your Peace Lily in TechCorp Main Lobby is showing yellowing leaves. Health score dropped to 75. An emergency maintenance visit has been scheduled.',
        priority: NotificationPriority.HIGH,
        isRead: false,
        actionUrl: '/dashboard/plants',
      },
      {
        userId: userClient._id,
        type: NotificationType.MAINTENANCE_SCHEDULED,
        title: 'Maintenance Scheduled',
        message: 'A routine maintenance visit has been scheduled for TechCorp Solutions on Monday. Our technician Rahul Verma will visit between 10 AM and 12 PM.',
        priority: NotificationPriority.MEDIUM,
        isRead: true,
        readAt: daysAgo(1),
        actionUrl: '/dashboard/maintenance',
      },
      {
        userId: userClient._id,
        type: NotificationType.PAYMENT_DUE,
        title: 'Payment Due Soon',
        message: 'Your quarterly subscription payment of INR 40,497 for TechCorp Solutions Professional plan is due in 5 days.',
        priority: NotificationPriority.HIGH,
        isRead: false,
        actionUrl: '/dashboard/billing',
      },
      {
        userId: userPartner._id,
        type: NotificationType.PLANT_HEALTH_ALERT,
        title: 'Critical: Snake Plant Replacement Needed',
        message: 'The Snake Plant on TechCorp Engineering Floor has been confirmed with root rot (health score: 40). Replacement has been scheduled.',
        priority: NotificationPriority.HIGH,
        isRead: false,
        actionUrl: '/dashboard/plants',
      },
      {
        userId: userPartner._id,
        type: NotificationType.MAINTENANCE_COMPLETED,
        title: 'Maintenance Completed: Luxe Hotels',
        message: 'Premium maintenance visit at Luxe Hotels Grand Lobby completed successfully. Client rated 5/5 stars.',
        priority: NotificationPriority.LOW,
        isRead: true,
        readAt: daysAgo(2),
      },
      {
        userId: userAdmin._id,
        type: NotificationType.SUBSCRIPTION_EXPIRING,
        title: 'Subscription Expiring: Luxe Hotels',
        message: 'The Enterprise subscription for Luxe Hotels & Resorts expires today. Please coordinate renewal.',
        priority: NotificationPriority.HIGH,
        isRead: false,
        actionUrl: '/dashboard/subscriptions',
      },
      {
        userId: userAdmin._id,
        type: NotificationType.SYSTEM_ALERT,
        title: 'Monthly Platform Summary',
        message: 'Platform summary: 10 active plants across 3 organizations. Average health score: 82. 5 maintenance visits completed this month.',
        priority: NotificationPriority.LOW,
        isRead: false,
      },
    ]);

    // ------------------------------------------------------------------
    // Summary
    // ------------------------------------------------------------------
    const summary = {
      users: users.length,
      subscriptionPlans: plans.length,
      plantSpecies: species.length,
      organizations: orgs.length,
      locations: locations.length,
      plants: plantsCreated.length,
      subscriptions: subscriptions.length,
      maintenanceLogs: maintenanceLogs.length,
      payments: payments.length,
      notifications: 7,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Database seeded successfully',
        data: summary,
        credentials: {
          user: { email: 'user@vriksham.org', password: 'User@123' },
          partner: { email: 'partner@vriksham.org', password: 'Partner@123' },
          admin: { email: 'admin@vriksham.org', password: 'Admin@123' },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[API] POST /api/seed error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to seed database',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
