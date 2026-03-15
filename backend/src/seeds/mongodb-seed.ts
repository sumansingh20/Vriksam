/**
 * VRIKSHAM MongoDB Seed Script
 * ----------------------------
 * Populates the MongoDB database with realistic demo data.
 *
 * Usage:
 *   npx tsx src/seeds/mongodb-seed.ts
 *   # or via package.json script:
 *   npm run seed:mongodb
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Import models
import User, { UserRole, UserStatus } from '../models/user.model';
import Organization, { OrganizationType, OrganizationStatus } from '../models/organization.model';
import Location, { LocationType, LocationStatus } from '../models/location.model';
import Plant, { PlantStatus, GrowthStage, PlantPlacement } from '../models/plant.model';
import PlantSpecies, { PlantCategory, CareDifficulty } from '../models/plant-species.model';
import Subscription, { SubscriptionStatus, BillingCycle } from '../models/subscription.model';
import SubscriptionPlan, { PlanTier, SupportLevel } from '../models/subscription-plan.model';
import MaintenanceLog, { MaintenanceType, MaintenanceStatus } from '../models/maintenance-log.model';
import Payment, { PaymentMethod, PaymentStatus } from '../models/payment.model';
import Notification, { NotificationType, NotificationPriority } from '../models/notification.model';

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

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------
async function seed(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vriksham';

  console.log('==========================================================');
  console.log('  VRIKSHAM - MongoDB Seed Script');
  console.log('==========================================================');
  console.log(`Connecting to: ${uri.replace(/\/\/.*@/, '//<credentials>@')}`);
  console.log('');

  await mongoose.connect(uri);
  console.log('[Seed] Connected to MongoDB\n');

  // ------------------------------------------------------------------
  // Clear all collections
  // ------------------------------------------------------------------
  console.log('[Seed] Clearing existing collections...');
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
    mongoose.connection.collection('counters').deleteMany({}).catch(() => {}),
    mongoose.connection.collection('invoicecounters').deleteMany({}).catch(() => {}),
  ]);
  console.log('[Seed] All collections cleared\n');

  // ------------------------------------------------------------------
  // 1. Users
  // ------------------------------------------------------------------
  console.log('[Seed] Creating users...');
  const users = await User.insertMany([
    {
      name: 'Priya Sharma',
      email: 'user@vriksham.org',
      password: await hashPassword('User@123'),
      phone: '+91 98765 43210',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      lastLoginAt: daysAgo(1),
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: false,
          maintenanceReminders: true,
          paymentAlerts: true,
          healthAlerts: true,
        },
      },
    },
    {
      name: 'Rahul Verma',
      email: 'partner@vriksham.org',
      password: await hashPassword('Partner@123'),
      phone: '+91 98765 43211',
      role: UserRole.PARTNER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      lastLoginAt: daysAgo(0),
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: true,
          maintenanceReminders: true,
          paymentAlerts: true,
          healthAlerts: true,
        },
      },
    },
    {
      name: 'Anita Desai',
      email: 'admin@vriksham.org',
      password: await hashPassword('Admin@123'),
      phone: '+91 98765 43212',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      lastLoginAt: daysAgo(0),
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: true,
          maintenanceReminders: true,
          paymentAlerts: true,
          healthAlerts: true,
        },
      },
    },
  ]);
  const [userClient, userPartner, userAdmin] = users;
  console.log(`  -> Created ${users.length} users`);

  // ------------------------------------------------------------------
  // 2. Subscription Plans
  // ------------------------------------------------------------------
  console.log('[Seed] Creating subscription plans...');
  const plans = await SubscriptionPlan.insertMany([
    {
      name: 'Starter',
      slug: 'starter',
      description: 'Perfect for small offices and startups looking to add greenery to their workspace.',
      tier: PlanTier.STARTER,
      price: { monthly: 4999, quarterly: 13497, annual: 47988 },
      currency: 'INR',
      features: [
        'Up to 25 plants',
        'Up to 2 locations',
        'Monthly maintenance visits',
        'Basic plant health monitoring',
        'Email support',
        'Quarterly health reports',
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
        'Up to 100 plants',
        'Up to 10 locations',
        'Bi-weekly maintenance visits',
        'Advanced AI health monitoring',
        'Priority support',
        'Monthly health reports',
        'Plant replacement guarantee',
        'Dedicated account manager',
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
        'Unlimited plants',
        'Unlimited locations',
        'Weekly maintenance visits',
        'Premium AI health monitoring with predictions',
        'Dedicated support team',
        'Weekly health reports',
        'Plant replacement guarantee',
        'Custom plant selection',
        'Sustainability reporting & CO2 dashboard',
        'API access',
        'White-label options',
      ],
      plantLimit: 9999,
      locationLimit: 999,
      supportLevel: SupportLevel.DEDICATED,
      isActive: true,
      sortOrder: 3,
    },
  ]);
  const [planStarter, planPro, planEnterprise] = plans;
  console.log(`  -> Created ${plans.length} subscription plans`);

  // ------------------------------------------------------------------
  // 3. Plant Species
  // ------------------------------------------------------------------
  console.log('[Seed] Creating plant species...');
  const species = await PlantSpecies.insertMany([
    {
      commonName: 'Snake Plant',
      scientificName: 'Dracaena trifasciata',
      category: PlantCategory.INDOOR,
      description: 'One of the most tolerant indoor plants. Excellent air purifier that converts CO2 to oxygen even at night.',
      careInstructions: {
        watering: 'Water every 2-3 weeks, allowing soil to dry completely between waterings.',
        sunlight: 'Thrives in indirect light but tolerates low light and some direct sun.',
        temperature: '15-29°C (60-85°F). Avoid temperatures below 10°C.',
        humidity: 'Tolerates normal room humidity. No misting needed.',
        fertilizer: 'Feed once a month during spring and summer with balanced liquid fertilizer.',
      },
      difficulty: CareDifficulty.EASY,
      co2Absorption: 6.8,
      o2Production: 4.9,
      airPurificationScore: 9,
      growthRate: 'Slow to moderate',
      maxHeight: '120 cm',
      isActive: true,
    },
    {
      commonName: 'Peace Lily',
      scientificName: 'Spathiphyllum wallisii',
      category: PlantCategory.FLOWERING,
      description: 'Elegant flowering plant known for its white blooms and exceptional ability to remove VOCs from indoor air.',
      careInstructions: {
        watering: 'Keep soil consistently moist but not waterlogged. Water when top inch is dry.',
        sunlight: 'Prefers bright, indirect light. Can tolerate low light but may not bloom.',
        temperature: '18-30°C (65-86°F). Keep away from cold drafts.',
        humidity: 'Prefers high humidity. Mist regularly or use a pebble tray.',
        fertilizer: 'Feed every 6-8 weeks during growing season with balanced fertilizer at half strength.',
      },
      difficulty: CareDifficulty.EASY,
      co2Absorption: 5.2,
      o2Production: 3.8,
      airPurificationScore: 8,
      growthRate: 'Moderate',
      maxHeight: '90 cm',
      isActive: true,
    },
    {
      commonName: 'Money Plant',
      scientificName: 'Epipremnum aureum',
      category: PlantCategory.INDOOR,
      description: 'Fast-growing trailing vine popular in Indian households. Removes formaldehyde and xylene from air.',
      careInstructions: {
        watering: 'Water when top 2 inches of soil are dry. Approximately once a week.',
        sunlight: 'Bright, indirect light. Tolerates low light but growth slows.',
        temperature: '18-30°C (65-86°F). Very adaptable to Indian climate.',
        humidity: 'Prefers moderate humidity. Tolerates normal room conditions well.',
        fertilizer: 'Feed monthly during spring and summer with diluted liquid fertilizer.',
      },
      difficulty: CareDifficulty.EASY,
      co2Absorption: 4.5,
      o2Production: 3.2,
      airPurificationScore: 7,
      growthRate: 'Fast',
      maxHeight: '200 cm (trailing)',
      isActive: true,
    },
    {
      commonName: 'Areca Palm',
      scientificName: 'Dypsis lutescens',
      category: PlantCategory.PALM,
      description: 'The most effective air humidifying plant. Removes toluene and xylene. Popular lobby and office plant in India.',
      careInstructions: {
        watering: 'Water regularly, keeping soil evenly moist. Reduce in winter.',
        sunlight: 'Bright, indirect sunlight. Avoid direct afternoon sun.',
        temperature: '18-30°C (65-86°F). Ideal for Indian office environments.',
        humidity: 'Prefers high humidity (above 50%). Mist leaves in dry conditions.',
        fertilizer: 'Feed every 2 months with palm-specific fertilizer during growing season.',
      },
      difficulty: CareDifficulty.MODERATE,
      co2Absorption: 8.5,
      o2Production: 6.1,
      airPurificationScore: 9,
      growthRate: 'Moderate to fast',
      maxHeight: '200 cm',
      isActive: true,
    },
    {
      commonName: 'Rubber Plant',
      scientificName: 'Ficus elastica',
      category: PlantCategory.INDOOR,
      description: 'Bold, glossy-leaved plant excellent at removing formaldehyde. A statement plant for corporate spaces.',
      careInstructions: {
        watering: 'Water when top inch of soil is dry. Approximately every 1-2 weeks.',
        sunlight: 'Bright, indirect light. Can tolerate some direct morning sun.',
        temperature: '16-27°C (60-80°F). Keep away from cold drafts.',
        humidity: 'Moderate humidity. Wipe leaves with damp cloth to maintain shine and health.',
        fertilizer: 'Feed monthly during spring and summer. Use balanced liquid fertilizer.',
      },
      difficulty: CareDifficulty.MODERATE,
      co2Absorption: 7.2,
      o2Production: 5.1,
      airPurificationScore: 8,
      growthRate: 'Moderate',
      maxHeight: '250 cm',
      isActive: true,
    },
    {
      commonName: 'Boston Fern',
      scientificName: 'Nephrolepis exaltata',
      category: PlantCategory.FERN,
      description: 'Lush, feathery fern that is one of the best plants for removing formaldehyde. Acts as a natural humidifier.',
      careInstructions: {
        watering: 'Keep soil consistently moist. Water frequently, especially in warm conditions.',
        sunlight: 'Indirect light to partial shade. Avoid direct sunlight.',
        temperature: '16-24°C (60-75°F). Prefers cooler temperatures.',
        humidity: 'High humidity essential (above 60%). Mist daily or use humidifier.',
        fertilizer: 'Feed every 2 weeks during growing season with diluted liquid fertilizer.',
      },
      difficulty: CareDifficulty.HARD,
      co2Absorption: 4.0,
      o2Production: 2.9,
      airPurificationScore: 9,
      growthRate: 'Fast',
      maxHeight: '90 cm',
      isActive: true,
    },
    {
      commonName: 'Jade Plant',
      scientificName: 'Crassula ovata',
      category: PlantCategory.SUCCULENT,
      description: 'Considered auspicious in Indian culture. Hardy succulent with thick, oval leaves that thrives on neglect.',
      careInstructions: {
        watering: 'Water sparingly. Let soil dry completely between waterings (every 2-3 weeks).',
        sunlight: 'Bright direct to indirect light. At least 4 hours of sunlight daily.',
        temperature: '18-30°C (65-86°F). Tolerates Indian summer well.',
        humidity: 'Low to moderate humidity. Does not need misting.',
        fertilizer: 'Feed once every 3 months with succulent fertilizer during growing season.',
      },
      difficulty: CareDifficulty.EASY,
      co2Absorption: 2.1,
      o2Production: 1.5,
      airPurificationScore: 5,
      growthRate: 'Slow',
      maxHeight: '100 cm',
      isActive: true,
    },
    {
      commonName: 'Tulsi (Holy Basil)',
      scientificName: 'Ocimum tenuiflorum',
      category: PlantCategory.OUTDOOR,
      description: 'Sacred plant in Indian tradition with medicinal properties. Excellent mosquito repellent and air purifier with religious significance.',
      careInstructions: {
        watering: 'Water daily in summer, every other day in winter. Keep soil moist but not waterlogged.',
        sunlight: 'Full sun. Requires at least 6 hours of direct sunlight.',
        temperature: '20-35°C (68-95°F). Thrives in Indian tropical climate.',
        humidity: 'Moderate to high humidity. Tolerates monsoon conditions.',
        fertilizer: 'Use organic compost monthly. Avoid chemical fertilizers for medicinal use.',
      },
      difficulty: CareDifficulty.EASY,
      co2Absorption: 3.5,
      o2Production: 2.5,
      airPurificationScore: 7,
      growthRate: 'Fast',
      maxHeight: '75 cm',
      isActive: true,
    },
  ]);
  console.log(`  -> Created ${species.length} plant species`);

  // ------------------------------------------------------------------
  // 4. Organizations
  // ------------------------------------------------------------------
  console.log('[Seed] Creating organizations...');
  const orgs = await Organization.insertMany([
    {
      name: 'TechCorp Solutions Pvt. Ltd.',
      type: OrganizationType.CORPORATE,
      email: 'admin@techcorp.in',
      phone: '+91 80 4567 8901',
      address: {
        street: '42, MG Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
      },
      contactPerson: {
        name: 'Vikram Mehta',
        email: 'vikram@techcorp.in',
        phone: '+91 98765 11111',
      },
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
        street: '15, Anna Salai, T. Nagar',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600017',
        country: 'India',
      },
      contactPerson: {
        name: 'Lakshmi Narayan',
        email: 'lakshmi@greenvalley.in',
        phone: '+91 98765 22222',
      },
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
        street: '7, Marine Drive, Colaba',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400005',
        country: 'India',
      },
      contactPerson: {
        name: 'Sanjay Kapoor',
        email: 'sanjay@luxehotels.in',
        phone: '+91 98765 33333',
      },
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
  const [orgTechCorp, orgGreenValley, orgLuxe] = orgs;
  console.log(`  -> Created ${orgs.length} organizations`);

  // ------------------------------------------------------------------
  // 5. Locations
  // ------------------------------------------------------------------
  console.log('[Seed] Creating locations...');
  const locations = await Location.insertMany([
    // TechCorp locations
    {
      name: 'Main Lobby',
      organizationId: orgTechCorp._id,
      type: LocationType.LOBBY,
      floor: 'Ground Floor',
      area: 1500,
      address: '42, MG Road, Indiranagar, Bengaluru',
      coordinates: { lat: 12.9716, lng: 77.6412 },
      plantCapacity: 20,
      currentPlantCount: 5,
      maintenanceDay: 'Monday',
      status: LocationStatus.ACTIVE,
    },
    {
      name: 'Engineering Floor',
      organizationId: orgTechCorp._id,
      type: LocationType.OFFICE,
      floor: '3rd Floor',
      area: 3000,
      address: '42, MG Road, Indiranagar, Bengaluru',
      coordinates: { lat: 12.9716, lng: 77.6412 },
      plantCapacity: 30,
      currentPlantCount: 4,
      maintenanceDay: 'Monday',
      status: LocationStatus.ACTIVE,
    },
    {
      name: 'Rooftop Cafeteria',
      organizationId: orgTechCorp._id,
      type: LocationType.CAFETERIA,
      floor: '8th Floor',
      area: 2000,
      address: '42, MG Road, Indiranagar, Bengaluru',
      coordinates: { lat: 12.9716, lng: 77.6412 },
      plantCapacity: 15,
      currentPlantCount: 0,
      maintenanceDay: 'Tuesday',
      status: LocationStatus.ACTIVE,
    },
    // Green Valley locations
    {
      name: 'Society Lobby',
      organizationId: orgGreenValley._id,
      type: LocationType.LOBBY,
      floor: 'Ground Floor',
      area: 800,
      address: '15, Anna Salai, T. Nagar, Chennai',
      coordinates: { lat: 13.0418, lng: 80.2341 },
      plantCapacity: 12,
      currentPlantCount: 2,
      maintenanceDay: 'Wednesday',
      status: LocationStatus.ACTIVE,
    },
    {
      name: 'Terrace Garden',
      organizationId: orgGreenValley._id,
      type: LocationType.TERRACE,
      floor: 'Terrace',
      area: 1200,
      address: '15, Anna Salai, T. Nagar, Chennai',
      coordinates: { lat: 13.0418, lng: 80.2341 },
      plantCapacity: 25,
      currentPlantCount: 1,
      maintenanceDay: 'Wednesday',
      status: LocationStatus.ACTIVE,
    },
    // Luxe Hotels locations
    {
      name: 'Grand Lobby',
      organizationId: orgLuxe._id,
      type: LocationType.LOBBY,
      floor: 'Ground Floor',
      area: 2500,
      address: '7, Marine Drive, Colaba, Mumbai',
      coordinates: { lat: 18.9322, lng: 72.8264 },
      plantCapacity: 35,
      currentPlantCount: 0,
      maintenanceDay: 'Thursday',
      status: LocationStatus.ACTIVE,
    },
    {
      name: 'Poolside Garden',
      organizationId: orgLuxe._id,
      type: LocationType.GARDEN,
      floor: '1st Floor',
      area: 4000,
      address: '7, Marine Drive, Colaba, Mumbai',
      coordinates: { lat: 18.9322, lng: 72.8264 },
      plantCapacity: 50,
      currentPlantCount: 0,
      maintenanceDay: 'Friday',
      status: LocationStatus.ACTIVE,
    },
  ]);
  const [
    locTCLobby, locTCEngineering, locTCCafe,
    locGVLobby, locGVTerrace,
    locLuxeLobby, locLuxeGarden,
  ] = locations;
  console.log(`  -> Created ${locations.length} locations`);

  // ------------------------------------------------------------------
  // 6. Plants
  // ------------------------------------------------------------------
  console.log('[Seed] Creating plants...');
  const plants = await Plant.create([
    // TechCorp Main Lobby (5 plants)
    {
      name: 'Lobby Areca Palm #1',
      species: species[3]._id, // Areca Palm
      locationId: locTCLobby._id,
      organizationId: orgTechCorp._id,
      healthScore: 92,
      status: PlantStatus.HEALTHY,
      growthStage: GrowthStage.MATURE,
      placement: PlantPlacement.FLOOR,
      lastMaintenanceDate: daysAgo(7),
      nextMaintenanceDate: daysFromNow(7),
      installedDate: daysAgo(150),
    },
    {
      name: 'Lobby Snake Plant #1',
      species: species[0]._id, // Snake Plant
      locationId: locTCLobby._id,
      organizationId: orgTechCorp._id,
      healthScore: 88,
      status: PlantStatus.HEALTHY,
      growthStage: GrowthStage.MATURE,
      placement: PlantPlacement.FLOOR,
      lastMaintenanceDate: daysAgo(7),
      nextMaintenanceDate: daysFromNow(7),
      installedDate: daysAgo(150),
    },
    {
      name: 'Lobby Peace Lily #1',
      species: species[1]._id, // Peace Lily
      locationId: locTCLobby._id,
      organizationId: orgTechCorp._id,
      healthScore: 75,
      status: PlantStatus.NEEDS_ATTENTION,
      growthStage: GrowthStage.FLOWERING,
      placement: PlantPlacement.DESK,
      lastMaintenanceDate: daysAgo(14),
      nextMaintenanceDate: daysFromNow(0),
      installedDate: daysAgo(120),
      notes: 'Leaves showing slight yellowing. May need more indirect light.',
    },
    {
      name: 'Lobby Rubber Plant #1',
      species: species[4]._id, // Rubber Plant
      locationId: locTCLobby._id,
      organizationId: orgTechCorp._id,
      healthScore: 95,
      status: PlantStatus.HEALTHY,
      growthStage: GrowthStage.MATURE,
      placement: PlantPlacement.FLOOR,
      lastMaintenanceDate: daysAgo(7),
      nextMaintenanceDate: daysFromNow(7),
      installedDate: daysAgo(180),
    },
    {
      name: 'Lobby Money Plant Hanging',
      species: species[2]._id, // Money Plant
      locationId: locTCLobby._id,
      organizationId: orgTechCorp._id,
      healthScore: 90,
      status: PlantStatus.HEALTHY,
      growthStage: GrowthStage.MATURE,
      placement: PlantPlacement.HANGING,
      lastMaintenanceDate: daysAgo(7),
      nextMaintenanceDate: daysFromNow(7),
      installedDate: daysAgo(100),
    },
    // TechCorp Engineering Floor (4 plants)
    {
      name: 'Eng Desk Snake Plant #1',
      species: species[0]._id, // Snake Plant
      locationId: locTCEngineering._id,
      organizationId: orgTechCorp._id,
      healthScore: 40,
      status: PlantStatus.CRITICAL,
      growthStage: GrowthStage.MATURE,
      placement: PlantPlacement.DESK,
      lastMaintenanceDate: daysAgo(30),
      nextMaintenanceDate: daysAgo(16),
      installedDate: daysAgo(200),
      notes: 'Root rot detected. Scheduled for replacement.',
      replacementHistory: [
        {
          date: daysAgo(90),
          reason: 'Pest infestation',
          previousPlant: 'Spider Plant',
        },
      ],
    },
    {
      name: 'Eng Jade Plant #1',
      species: species[6]._id, // Jade Plant
      locationId: locTCEngineering._id,
      organizationId: orgTechCorp._id,
      healthScore: 85,
      status: PlantStatus.HEALTHY,
      growthStage: GrowthStage.JUVENILE,
      placement: PlantPlacement.DESK,
      lastMaintenanceDate: daysAgo(14),
      nextMaintenanceDate: daysFromNow(0),
      installedDate: daysAgo(60),
    },
    {
      name: 'Eng Boston Fern Wall',
      species: species[5]._id, // Boston Fern
      locationId: locTCEngineering._id,
      organizationId: orgTechCorp._id,
      healthScore: 78,
      status: PlantStatus.NEEDS_ATTENTION,
      growthStage: GrowthStage.MATURE,
      placement: PlantPlacement.WALL,
      lastMaintenanceDate: daysAgo(10),
      nextMaintenanceDate: daysFromNow(4),
      installedDate: daysAgo(90),
      notes: 'Needs more humidity. Suggested adding misting schedule.',
    },
    {
      name: 'Eng Areca Palm Corner',
      species: species[3]._id, // Areca Palm
      locationId: locTCEngineering._id,
      organizationId: orgTechCorp._id,
      healthScore: 91,
      status: PlantStatus.HEALTHY,
      growthStage: GrowthStage.MATURE,
      placement: PlantPlacement.FLOOR,
      lastMaintenanceDate: daysAgo(7),
      nextMaintenanceDate: daysFromNow(7),
      installedDate: daysAgo(180),
    },
    // Green Valley Lobby (2 plants)
    {
      name: 'GV Lobby Peace Lily',
      species: species[1]._id, // Peace Lily
      locationId: locGVLobby._id,
      organizationId: orgGreenValley._id,
      healthScore: 87,
      status: PlantStatus.HEALTHY,
      growthStage: GrowthStage.FLOWERING,
      placement: PlantPlacement.FLOOR,
      lastMaintenanceDate: daysAgo(5),
      nextMaintenanceDate: daysFromNow(9),
      installedDate: daysAgo(80),
    },
    {
      name: 'GV Lobby Snake Plant',
      species: species[0]._id, // Snake Plant
      locationId: locGVLobby._id,
      organizationId: orgGreenValley._id,
      healthScore: 93,
      status: PlantStatus.HEALTHY,
      growthStage: GrowthStage.MATURE,
      placement: PlantPlacement.FLOOR,
      lastMaintenanceDate: daysAgo(5),
      nextMaintenanceDate: daysFromNow(9),
      installedDate: daysAgo(80),
    },
    // Green Valley Terrace (1 plant)
    {
      name: 'GV Terrace Tulsi',
      species: species[7]._id, // Tulsi
      locationId: locGVTerrace._id,
      organizationId: orgGreenValley._id,
      healthScore: 96,
      status: PlantStatus.HEALTHY,
      growthStage: GrowthStage.MATURE,
      placement: PlantPlacement.OUTDOOR,
      lastMaintenanceDate: daysAgo(3),
      nextMaintenanceDate: daysFromNow(11),
      installedDate: daysAgo(60),
    },
  ]);
  console.log(`  -> Created ${plants.length} plants`);

  // ------------------------------------------------------------------
  // 7. Maintenance Logs
  // ------------------------------------------------------------------
  console.log('[Seed] Creating maintenance logs...');
  const maintenanceLogs = await MaintenanceLog.insertMany([
    // Completed routine visits
    {
      plantId: plants[0]._id,
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
        { task: 'Check soil moisture', completed: true },
        { task: 'Water plant', completed: true },
        { task: 'Prune dead leaves', completed: true },
        { task: 'Check for pests', completed: true },
        { task: 'Apply fertilizer', completed: true },
      ],
      notes: 'All plants in the lobby looking healthy. Applied neem-based pest prevention.',
      healthScoreBefore: 89,
      healthScoreAfter: 92,
      feedback: { rating: 5, comment: 'Excellent maintenance as always.' },
      materialsUsed: [
        { name: 'Organic fertilizer (500g)', quantity: 1, cost: 250 },
        { name: 'Neem oil spray (100ml)', quantity: 1, cost: 180 },
      ],
    },
    {
      plantId: plants[9]._id,
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
        { task: 'Check soil moisture', completed: true },
        { task: 'Water plant', completed: true },
        { task: 'Wipe leaves', completed: true },
        { task: 'Check for pests', completed: true },
      ],
      notes: 'Peace Lily blooming beautifully. Residents pleased with the plants.',
      healthScoreBefore: 84,
      healthScoreAfter: 87,
      feedback: { rating: 4, comment: 'Good work. Could have come a bit earlier.' },
      materialsUsed: [
        { name: 'Distilled water (2L)', quantity: 2, cost: 60 },
      ],
    },
    {
      plantId: plants[5]._id,
      locationId: locTCEngineering._id,
      organizationId: orgTechCorp._id,
      technicianId: userPartner._id,
      partnerId: userPartner._id,
      type: MaintenanceType.EMERGENCY,
      status: MaintenanceStatus.COMPLETED,
      scheduledDate: daysAgo(30),
      completedDate: daysAgo(29),
      duration: 45,
      tasks: [
        { task: 'Diagnose issue', completed: true },
        { task: 'Remove rotted roots', completed: true },
        { task: 'Apply fungicide', completed: true },
        { task: 'Repot in fresh soil', completed: false },
      ],
      notes: 'Root rot advanced. Applied fungicide but plant may need replacement. Repotting delayed.',
      healthScoreBefore: 55,
      healthScoreAfter: 40,
      materialsUsed: [
        { name: 'Fungicide solution (200ml)', quantity: 1, cost: 320 },
        { name: 'Fresh potting mix (2kg)', quantity: 1, cost: 150 },
      ],
    },
    // Installation
    {
      plantId: plants[11]._id,
      locationId: locGVTerrace._id,
      organizationId: orgGreenValley._id,
      technicianId: userPartner._id,
      partnerId: userPartner._id,
      type: MaintenanceType.INSTALLATION,
      status: MaintenanceStatus.COMPLETED,
      scheduledDate: daysAgo(60),
      completedDate: daysAgo(60),
      duration: 20,
      tasks: [
        { task: 'Prepare pot and soil', completed: true },
        { task: 'Install plant', completed: true },
        { task: 'Water thoroughly', completed: true },
        { task: 'Brief client on care', completed: true },
      ],
      notes: 'Tulsi plant installed on terrace. Client briefed on daily watering.',
      healthScoreBefore: 0,
      healthScoreAfter: 96,
      feedback: { rating: 5, comment: 'Beautiful plant! Thank you.' },
      materialsUsed: [
        { name: 'Terracotta pot (12 inch)', quantity: 1, cost: 450 },
        { name: 'Organic potting mix (5kg)', quantity: 1, cost: 350 },
        { name: 'Tulsi sapling', quantity: 1, cost: 120 },
      ],
    },
    // Scheduled (upcoming)
    {
      plantId: plants[2]._id,
      locationId: locTCLobby._id,
      organizationId: orgTechCorp._id,
      technicianId: userPartner._id,
      partnerId: userPartner._id,
      type: MaintenanceType.ROUTINE,
      status: MaintenanceStatus.SCHEDULED,
      scheduledDate: daysFromNow(1),
      tasks: [
        { task: 'Check soil moisture', completed: false },
        { task: 'Water plant', completed: false },
        { task: 'Diagnose yellowing leaves', completed: false },
        { task: 'Adjust light positioning', completed: false },
      ],
      notes: 'Peace Lily needs attention - yellowing leaves reported.',
      materialsUsed: [],
    },
    {
      plantId: plants[5]._id,
      locationId: locTCEngineering._id,
      organizationId: orgTechCorp._id,
      technicianId: userPartner._id,
      partnerId: userPartner._id,
      type: MaintenanceType.REPLACEMENT,
      status: MaintenanceStatus.SCHEDULED,
      scheduledDate: daysFromNow(3),
      tasks: [
        { task: 'Remove damaged plant', completed: false },
        { task: 'Prepare new pot', completed: false },
        { task: 'Install replacement plant', completed: false },
        { task: 'Dispose of old plant responsibly', completed: false },
      ],
      notes: 'Replacing desk snake plant due to advanced root rot.',
      materialsUsed: [],
    },
    {
      plantId: plants[7]._id,
      locationId: locTCEngineering._id,
      organizationId: orgTechCorp._id,
      technicianId: userPartner._id,
      partnerId: userPartner._id,
      type: MaintenanceType.ROUTINE,
      status: MaintenanceStatus.SCHEDULED,
      scheduledDate: daysFromNow(4),
      tasks: [
        { task: 'Mist fern leaves', completed: false },
        { task: 'Check soil moisture', completed: false },
        { task: 'Trim brown fronds', completed: false },
        { task: 'Add humidity tray', completed: false },
      ],
      notes: 'Boston fern needs humidity boost. Bring humidity tray.',
      materialsUsed: [],
    },
    // In progress
    {
      plantId: plants[6]._id,
      locationId: locTCEngineering._id,
      organizationId: orgTechCorp._id,
      technicianId: userPartner._id,
      partnerId: userPartner._id,
      type: MaintenanceType.ROUTINE,
      status: MaintenanceStatus.IN_PROGRESS,
      scheduledDate: daysAgo(0),
      duration: 15,
      tasks: [
        { task: 'Check soil moisture', completed: true },
        { task: 'Water plant', completed: true },
        { task: 'Check for pests', completed: false },
        { task: 'Rotate plant', completed: false },
      ],
      notes: 'Currently visiting Engineering floor. Jade plant looking good so far.',
      healthScoreBefore: 85,
      materialsUsed: [],
    },
  ]);
  console.log(`  -> Created ${maintenanceLogs.length} maintenance logs`);

  // ------------------------------------------------------------------
  // 8. Subscriptions
  // ------------------------------------------------------------------
  console.log('[Seed] Creating subscriptions...');
  const subscriptions = await Subscription.insertMany([
    {
      organizationId: orgTechCorp._id,
      planId: planPro._id,
      status: SubscriptionStatus.ACTIVE,
      billingCycle: BillingCycle.MONTHLY,
      startDate: daysAgo(180),
      nextBillingDate: daysFromNow(12),
      amount: 14999,
      currency: 'INR',
      autoRenew: true,
    },
    {
      organizationId: orgGreenValley._id,
      planId: planStarter._id,
      status: SubscriptionStatus.ACTIVE,
      billingCycle: BillingCycle.QUARTERLY,
      startDate: daysAgo(90),
      nextBillingDate: daysFromNow(2),
      amount: 13497,
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
  console.log(`  -> Created ${subscriptions.length} subscriptions`);

  // ------------------------------------------------------------------
  // 9. Payments
  // ------------------------------------------------------------------
  console.log('[Seed] Creating payments...');
  const payments = await Payment.create([
    {
      organizationId: orgTechCorp._id,
      subscriptionId: subscriptions[0]._id,
      amount: 14999,
      currency: 'INR',
      method: PaymentMethod.STRIPE,
      status: PaymentStatus.COMPLETED,
      paidAt: daysAgo(30),
      dueDate: daysAgo(30),
      lineItems: [
        { description: 'Professional Plan - Monthly', quantity: 1, unitPrice: 14999, total: 14999 },
      ],
      notes: 'Monthly subscription payment - February 2026',
    },
    {
      organizationId: orgTechCorp._id,
      subscriptionId: subscriptions[0]._id,
      amount: 14999,
      currency: 'INR',
      method: PaymentMethod.STRIPE,
      status: PaymentStatus.COMPLETED,
      paidAt: daysAgo(60),
      dueDate: daysAgo(60),
      lineItems: [
        { description: 'Professional Plan - Monthly', quantity: 1, unitPrice: 14999, total: 14999 },
      ],
      notes: 'Monthly subscription payment - January 2026',
    },
    {
      organizationId: orgGreenValley._id,
      subscriptionId: subscriptions[1]._id,
      amount: 13497,
      currency: 'INR',
      method: PaymentMethod.UPI,
      status: PaymentStatus.COMPLETED,
      paidAt: daysAgo(90),
      dueDate: daysAgo(90),
      lineItems: [
        { description: 'Starter Plan - Quarterly', quantity: 1, unitPrice: 13497, total: 13497 },
      ],
      notes: 'Quarterly subscription payment - Q4 2025',
    },
    {
      organizationId: orgGreenValley._id,
      subscriptionId: subscriptions[1]._id,
      amount: 13497,
      currency: 'INR',
      method: PaymentMethod.UPI,
      status: PaymentStatus.PENDING,
      dueDate: daysFromNow(2),
      lineItems: [
        { description: 'Starter Plan - Quarterly', quantity: 1, unitPrice: 13497, total: 13497 },
      ],
      notes: 'Quarterly subscription payment - Q1 2026',
    },
    {
      organizationId: orgLuxe._id,
      subscriptionId: subscriptions[2]._id,
      amount: 479988,
      currency: 'INR',
      method: PaymentMethod.BANK_TRANSFER,
      status: PaymentStatus.COMPLETED,
      paidAt: daysAgo(365),
      dueDate: daysAgo(365),
      lineItems: [
        { description: 'Enterprise Plan - Annual', quantity: 1, unitPrice: 479988, total: 479988 },
      ],
      notes: 'Annual subscription payment - 2025-2026',
    },
  ]);
  console.log(`  -> Created ${payments.length} payments`);

  // ------------------------------------------------------------------
  // 10. Notifications
  // ------------------------------------------------------------------
  console.log('[Seed] Creating notifications...');
  const notifications = await Notification.insertMany([
    // Notifications for client user
    {
      userId: userClient._id,
      type: NotificationType.PLANT_HEALTH_ALERT,
      title: 'Plant Health Alert: Peace Lily',
      message: 'Your Peace Lily in the Main Lobby (TechCorp) has a health score of 75 and needs attention. Yellowing leaves detected.',
      priority: NotificationPriority.HIGH,
      isRead: false,
      actionUrl: '/dashboard/plants/' + plants[2]._id,
      metadata: { plantId: plants[2]._id, healthScore: 75 },
    },
    {
      userId: userClient._id,
      type: NotificationType.PLANT_HEALTH_ALERT,
      title: 'Critical: Snake Plant Root Rot',
      message: 'The Snake Plant on the Engineering Floor (TechCorp) has a critical health score of 40. Replacement has been scheduled.',
      priority: NotificationPriority.HIGH,
      isRead: true,
      readAt: daysAgo(2),
      actionUrl: '/dashboard/plants/' + plants[5]._id,
      metadata: { plantId: plants[5]._id, healthScore: 40 },
    },
    {
      userId: userClient._id,
      type: NotificationType.MAINTENANCE_SCHEDULED,
      title: 'Maintenance Visit Scheduled',
      message: 'A routine maintenance visit has been scheduled for TechCorp Main Lobby tomorrow. Technician: Rahul Verma.',
      priority: NotificationPriority.MEDIUM,
      isRead: false,
      actionUrl: '/dashboard/maintenance',
      metadata: { organizationId: orgTechCorp._id, technicianName: 'Rahul Verma' },
    },
    {
      userId: userClient._id,
      type: NotificationType.PAYMENT_DUE,
      title: 'Payment Due: Green Valley Residences',
      message: 'Your quarterly payment of Rs. 13,497 for Green Valley Residences Starter Plan is due in 2 days.',
      priority: NotificationPriority.HIGH,
      isRead: false,
      actionUrl: '/dashboard/billing',
      metadata: { amount: 13497, currency: 'INR', organizationId: orgGreenValley._id },
    },
    {
      userId: userClient._id,
      type: NotificationType.SUBSCRIPTION_EXPIRING,
      title: 'Subscription Expiring: Luxe Hotels',
      message: 'The Enterprise subscription for Luxe Hotels & Resorts is expiring today. Please renew to continue service.',
      priority: NotificationPriority.HIGH,
      isRead: false,
      actionUrl: '/dashboard/subscriptions',
      metadata: { organizationId: orgLuxe._id, planName: 'Enterprise' },
    },
    // Notifications for partner
    {
      userId: userPartner._id,
      type: NotificationType.MAINTENANCE_SCHEDULED,
      title: 'New Maintenance Assignment',
      message: 'You have been assigned a routine maintenance visit at TechCorp Main Lobby for tomorrow.',
      priority: NotificationPriority.MEDIUM,
      isRead: false,
      actionUrl: '/partner/schedule',
    },
    {
      userId: userPartner._id,
      type: NotificationType.MAINTENANCE_COMPLETED,
      title: 'Visit Report Submitted',
      message: 'Your maintenance report for Green Valley Lobby has been submitted and approved. Rating: 4/5.',
      priority: NotificationPriority.LOW,
      isRead: true,
      readAt: daysAgo(4),
      actionUrl: '/partner/reports',
    },
    // Notifications for admin
    {
      userId: userAdmin._id,
      type: NotificationType.PAYMENT_RECEIVED,
      title: 'Payment Received: TechCorp',
      message: 'Payment of Rs. 14,999 received from TechCorp Solutions for Professional Plan (Monthly).',
      priority: NotificationPriority.LOW,
      isRead: true,
      readAt: daysAgo(28),
      actionUrl: '/admin/payments',
      metadata: { amount: 14999, currency: 'INR' },
    },
    {
      userId: userAdmin._id,
      type: NotificationType.SYSTEM_ALERT,
      title: 'New Organization Registered',
      message: 'Green Valley Residences has been registered as a new client. Review and approve the account.',
      priority: NotificationPriority.MEDIUM,
      isRead: true,
      readAt: daysAgo(88),
      actionUrl: '/admin/organizations/' + orgGreenValley._id,
    },
    {
      userId: userAdmin._id,
      type: NotificationType.SYSTEM_ALERT,
      title: 'Monthly Platform Report Ready',
      message: 'The monthly platform analytics report for February 2026 is ready for review. Total active plants: 12, Organizations: 3.',
      priority: NotificationPriority.LOW,
      isRead: false,
      actionUrl: '/admin/reports',
      metadata: { month: 'February 2026', totalPlants: 12, totalOrgs: 3 },
    },
  ]);
  console.log(`  -> Created ${notifications.length} notifications`);

  // ------------------------------------------------------------------
  // Summary
  // ------------------------------------------------------------------
  console.log('\n==========================================================');
  console.log('  SEED COMPLETE - Summary');
  console.log('==========================================================');
  console.log(`  Users:              ${users.length}`);
  console.log(`  Subscription Plans: ${plans.length}`);
  console.log(`  Plant Species:      ${species.length}`);
  console.log(`  Organizations:      ${orgs.length}`);
  console.log(`  Locations:          ${locations.length}`);
  console.log(`  Plants:             ${plants.length}`);
  console.log(`  Maintenance Logs:   ${maintenanceLogs.length}`);
  console.log(`  Subscriptions:      ${subscriptions.length}`);
  console.log(`  Payments:           ${payments.length}`);
  console.log(`  Notifications:      ${notifications.length}`);
  console.log('----------------------------------------------------------');
  console.log('  LOGIN CREDENTIALS:');
  console.log('----------------------------------------------------------');
  console.log('  Client User:');
  console.log('    Email:    user@vriksham.org');
  console.log('    Password: User@123');
  console.log('');
  console.log('  Partner:');
  console.log('    Email:    partner@vriksham.org');
  console.log('    Password: Partner@123');
  console.log('');
  console.log('  Admin:');
  console.log('    Email:    admin@vriksham.org');
  console.log('    Password: Admin@123');
  console.log('==========================================================\n');
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
seed()
  .then(async () => {
    await mongoose.disconnect();
    console.log('[Seed] Disconnected from MongoDB. Done!');
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('[Seed] Error:', error);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });
