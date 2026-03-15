import { PrismaClient, UserRole, ClientType, ClientStatus, LocationType, PlantStatus, GrowthStage, LightRequirement, DifficultyLevel, SubscriptionStatus, BillingCycle, ServiceVisitType, ServiceVisitStatus, InvoiceStatus, PaymentMethod, PaymentStatus, NotificationType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function clearDatabase(): Promise<void> {
  console.log('Clearing existing data...');
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.serviceVisit.deleteMany();
  await prisma.plantHealthLog.deleteMany();
  await prisma.plant.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.location.deleteMany();
  await prisma.technician.deleteMany();
  await prisma.team.deleteMany();
  await prisma.client.deleteMany();
  await prisma.plantSpecies.deleteMany();
  await prisma.user.deleteMany();
  console.log('Database cleared.');
}

async function main(): Promise<void> {
  console.log('Starting seed...');
  await clearDatabase();

  const passwordHash = await bcrypt.hash('Password123!', 12);

  // -----------------------------------------------------------
  // Users
  // -----------------------------------------------------------
  console.log('Seeding users...');

  const adminUser = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'admin@vriksham.com',
      password: passwordHash,
      name: 'Rajesh Kumar',
      role: UserRole.ADMIN,
      phone: '+91-9876543210',
      isActive: true,
    },
  });

  const clientUser1 = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'priya@techcorp.in',
      password: passwordHash,
      name: 'Priya Sharma',
      role: UserRole.CLIENT,
      phone: '+91-9876543211',
      isActive: true,
    },
  });

  const clientUser2 = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'amit@greenvalley.in',
      password: passwordHash,
      name: 'Amit Patel',
      role: UserRole.CLIENT,
      phone: '+91-9876543212',
      isActive: true,
    },
  });

  const clientUser3 = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'sneha@luxehomes.in',
      password: passwordHash,
      name: 'Sneha Reddy',
      role: UserRole.CLIENT,
      phone: '+91-9876543213',
      isActive: true,
    },
  });

  const techUser1 = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'ravi@vriksham.com',
      password: passwordHash,
      name: 'Ravi Verma',
      role: UserRole.TECHNICIAN,
      phone: '+91-9876543214',
      isActive: true,
    },
  });

  const techUser2 = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'meera@vriksham.com',
      password: passwordHash,
      name: 'Meera Nair',
      role: UserRole.TECHNICIAN,
      phone: '+91-9876543215',
      isActive: true,
    },
  });

  const techUser3 = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'suresh@vriksham.com',
      password: passwordHash,
      name: 'Suresh Iyer',
      role: UserRole.TECHNICIAN,
      phone: '+91-9876543216',
      isActive: true,
    },
  });

  // -----------------------------------------------------------
  // Clients
  // -----------------------------------------------------------
  console.log('Seeding clients...');

  const client1 = await prisma.client.create({
    data: {
      id: uuidv4(),
      userId: clientUser1.id,
      companyName: 'TechCorp India Pvt Ltd',
      industry: 'Information Technology',
      type: ClientType.CORPORATE,
      address: '42 MG Road, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
      gstNumber: '29AABCT1234F1ZH',
      contactPerson: 'Priya Sharma',
      contactPhone: '+91-9876543211',
      contractStartDate: new Date('2025-01-01'),
      contractEndDate: new Date('2026-12-31'),
      status: ClientStatus.ACTIVE,
    },
  });

  const client2 = await prisma.client.create({
    data: {
      id: uuidv4(),
      userId: clientUser2.id,
      companyName: 'Green Valley Apartments',
      industry: 'Real Estate',
      type: ClientType.RESIDENTIAL,
      address: '15 Palm Avenue, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
      gstNumber: '29AABCG5678H1ZP',
      contactPerson: 'Amit Patel',
      contactPhone: '+91-9876543212',
      contractStartDate: new Date('2025-03-15'),
      contractEndDate: new Date('2026-03-14'),
      status: ClientStatus.ACTIVE,
    },
  });

  const client3 = await prisma.client.create({
    data: {
      id: uuidv4(),
      userId: clientUser3.id,
      companyName: 'Luxe Homes Villa',
      industry: 'Residential',
      type: ClientType.RESIDENTIAL,
      address: '8 Lake View Road, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      contactPerson: 'Sneha Reddy',
      contactPhone: '+91-9876543213',
      contractStartDate: new Date('2025-06-01'),
      contractEndDate: new Date('2026-05-31'),
      status: ClientStatus.ACTIVE,
    },
  });

  // -----------------------------------------------------------
  // Technicians
  // -----------------------------------------------------------
  console.log('Seeding technicians...');

  const tech1 = await prisma.technician.create({
    data: {
      id: uuidv4(),
      userId: techUser1.id,
      specialization: 'Indoor Plants & Tropical Species',
      rating: 4.8,
      totalVisits: 342,
      activeZones: ['Bangalore-East', 'Bangalore-Central'],
      availability: {
        monday: { start: '09:00', end: '18:00' },
        tuesday: { start: '09:00', end: '18:00' },
        wednesday: { start: '09:00', end: '18:00' },
        thursday: { start: '09:00', end: '18:00' },
        friday: { start: '09:00', end: '18:00' },
        saturday: { start: '09:00', end: '13:00' },
      },
      certifications: ['Certified Horticulturist', 'Plant Disease Specialist'],
      isAvailable: true,
    },
  });

  const tech2 = await prisma.technician.create({
    data: {
      id: uuidv4(),
      userId: techUser2.id,
      specialization: 'Succulents & Air Purifying Plants',
      rating: 4.9,
      totalVisits: 287,
      activeZones: ['Bangalore-North', 'Bangalore-West'],
      availability: {
        monday: { start: '08:00', end: '17:00' },
        tuesday: { start: '08:00', end: '17:00' },
        wednesday: { start: '08:00', end: '17:00' },
        thursday: { start: '08:00', end: '17:00' },
        friday: { start: '08:00', end: '17:00' },
      },
      certifications: ['Certified Arborist'],
      isAvailable: true,
    },
  });

  const tech3 = await prisma.technician.create({
    data: {
      id: uuidv4(),
      userId: techUser3.id,
      specialization: 'Landscape & Outdoor Greenery',
      rating: 4.6,
      totalVisits: 198,
      activeZones: ['Hyderabad-Central', 'Hyderabad-West'],
      availability: {
        monday: { start: '09:00', end: '18:00' },
        tuesday: { start: '09:00', end: '18:00' },
        wednesday: { start: '09:00', end: '18:00' },
        thursday: { start: '09:00', end: '18:00' },
        friday: { start: '09:00', end: '18:00' },
        saturday: { start: '10:00', end: '14:00' },
      },
      certifications: ['Landscape Design Certificate'],
      isAvailable: true,
    },
  });

  // -----------------------------------------------------------
  // Teams
  // -----------------------------------------------------------
  console.log('Seeding teams...');

  await prisma.team.create({
    data: {
      id: uuidv4(),
      name: 'Bangalore Green Squad',
      leadId: tech1.id,
      zone: 'Bangalore',
      memberCount: 2,
      isActive: true,
      description: 'Primary team handling all Bangalore corporate and residential clients',
    },
  });

  await prisma.team.create({
    data: {
      id: uuidv4(),
      name: 'Hyderabad Plant Care',
      leadId: tech3.id,
      zone: 'Hyderabad',
      memberCount: 1,
      isActive: true,
      description: 'Team handling Hyderabad region clients',
    },
  });

  // -----------------------------------------------------------
  // Locations
  // -----------------------------------------------------------
  console.log('Seeding locations...');

  const loc1 = await prisma.location.create({
    data: {
      id: uuidv4(),
      clientId: client1.id,
      name: 'TechCorp Main Office - Floor 5',
      address: '42 MG Road, Indiranagar',
      city: 'Bangalore',
      floor: '5',
      area: 5000,
      type: LocationType.OFFICE,
    },
  });

  const loc2 = await prisma.location.create({
    data: {
      id: uuidv4(),
      clientId: client1.id,
      name: 'TechCorp Lobby',
      address: '42 MG Road, Indiranagar',
      city: 'Bangalore',
      floor: 'Ground',
      area: 800,
      type: LocationType.LOBBY,
    },
  });

  const loc3 = await prisma.location.create({
    data: {
      id: uuidv4(),
      clientId: client1.id,
      name: 'TechCorp Cafeteria',
      address: '42 MG Road, Indiranagar',
      city: 'Bangalore',
      floor: '2',
      area: 2000,
      type: LocationType.CAFETERIA,
    },
  });

  const loc4 = await prisma.location.create({
    data: {
      id: uuidv4(),
      clientId: client2.id,
      name: 'Green Valley - Block A Lobby',
      address: '15 Palm Avenue, Whitefield',
      city: 'Bangalore',
      floor: 'Ground',
      area: 600,
      type: LocationType.LOBBY,
    },
  });

  const loc5 = await prisma.location.create({
    data: {
      id: uuidv4(),
      clientId: client2.id,
      name: 'Green Valley - Terrace Garden',
      address: '15 Palm Avenue, Whitefield',
      city: 'Bangalore',
      floor: 'Terrace',
      area: 3000,
      type: LocationType.TERRACE,
    },
  });

  const loc6 = await prisma.location.create({
    data: {
      id: uuidv4(),
      clientId: client3.id,
      name: 'Luxe Homes - Living Room',
      address: '8 Lake View Road, Jubilee Hills',
      city: 'Hyderabad',
      floor: 'Ground',
      area: 1200,
      type: LocationType.OTHER,
    },
  });

  const loc7 = await prisma.location.create({
    data: {
      id: uuidv4(),
      clientId: client3.id,
      name: 'Luxe Homes - Balcony',
      address: '8 Lake View Road, Jubilee Hills',
      city: 'Hyderabad',
      floor: '1',
      area: 400,
      type: LocationType.BALCONY,
    },
  });

  // -----------------------------------------------------------
  // Plant Species
  // -----------------------------------------------------------
  console.log('Seeding plant species...');

  const species1 = await prisma.plantSpecies.create({
    data: {
      id: uuidv4(),
      commonName: 'Snake Plant',
      scientificName: 'Sansevieria trifasciata',
      category: 'Succulents',
      lightRequirement: LightRequirement.LOW,
      wateringFrequency: 7,
      difficulty: DifficultyLevel.EASY,
      airPurifyingScore: 9.2,
      co2AbsorptionRate: 0.49,
      oxygenProductionRate: 0.93,
      humidityPreference: '40-50%',
      temperatureMin: 15,
      temperatureMax: 35,
      description: 'One of the best air purifying plants. Converts CO2 to oxygen at night.',
      careInstructions: 'Water sparingly. Allow soil to dry completely between watering. Tolerates low light.',
      imageUrl: '/images/species/snake-plant.jpg',
    },
  });

  const species2 = await prisma.plantSpecies.create({
    data: {
      id: uuidv4(),
      commonName: 'Money Plant',
      scientificName: 'Epipremnum aureum',
      category: 'Vines',
      lightRequirement: LightRequirement.MEDIUM,
      wateringFrequency: 5,
      difficulty: DifficultyLevel.EASY,
      airPurifyingScore: 8.5,
      co2AbsorptionRate: 0.42,
      oxygenProductionRate: 0.85,
      humidityPreference: '50-70%',
      temperatureMin: 18,
      temperatureMax: 30,
      description: 'Popular indoor vine that removes formaldehyde and benzene from air.',
      careInstructions: 'Keep soil moist but not waterlogged. Prune to maintain shape. Indirect sunlight preferred.',
      imageUrl: '/images/species/money-plant.jpg',
    },
  });

  const species3 = await prisma.plantSpecies.create({
    data: {
      id: uuidv4(),
      commonName: 'Peace Lily',
      scientificName: 'Spathiphyllum wallisii',
      category: 'Flowering',
      lightRequirement: LightRequirement.LOW,
      wateringFrequency: 4,
      difficulty: DifficultyLevel.MODERATE,
      airPurifyingScore: 9.5,
      co2AbsorptionRate: 0.55,
      oxygenProductionRate: 1.02,
      humidityPreference: '50-60%',
      temperatureMin: 18,
      temperatureMax: 30,
      description: 'Elegant flowering plant that excels at removing VOCs from indoor air.',
      careInstructions: 'Keep soil consistently moist. Mist leaves regularly. Avoid direct sunlight.',
      imageUrl: '/images/species/peace-lily.jpg',
    },
  });

  const species4 = await prisma.plantSpecies.create({
    data: {
      id: uuidv4(),
      commonName: 'Areca Palm',
      scientificName: 'Dypsis lutescens',
      category: 'Palms',
      lightRequirement: LightRequirement.HIGH,
      wateringFrequency: 3,
      difficulty: DifficultyLevel.MODERATE,
      airPurifyingScore: 9.8,
      co2AbsorptionRate: 0.65,
      oxygenProductionRate: 1.15,
      humidityPreference: '50-60%',
      temperatureMin: 16,
      temperatureMax: 35,
      description: 'Top-rated air purifying palm, excellent natural humidifier.',
      careInstructions: 'Water when top soil is dry. Bright indirect light. Feed monthly during growing season.',
      imageUrl: '/images/species/areca-palm.jpg',
    },
  });

  const species5 = await prisma.plantSpecies.create({
    data: {
      id: uuidv4(),
      commonName: 'Rubber Plant',
      scientificName: 'Ficus elastica',
      category: 'Foliage',
      lightRequirement: LightRequirement.MEDIUM,
      wateringFrequency: 5,
      difficulty: DifficultyLevel.EASY,
      airPurifyingScore: 8.8,
      co2AbsorptionRate: 0.52,
      oxygenProductionRate: 0.95,
      humidityPreference: '40-60%',
      temperatureMin: 15,
      temperatureMax: 30,
      description: 'Hardy foliage plant with large glossy leaves, great for offices.',
      careInstructions: 'Water when top inch of soil is dry. Wipe leaves to remove dust. Medium to bright indirect light.',
      imageUrl: '/images/species/rubber-plant.jpg',
    },
  });

  const species6 = await prisma.plantSpecies.create({
    data: {
      id: uuidv4(),
      commonName: 'Spider Plant',
      scientificName: 'Chlorophytum comosum',
      category: 'Foliage',
      lightRequirement: LightRequirement.MEDIUM,
      wateringFrequency: 4,
      difficulty: DifficultyLevel.EASY,
      airPurifyingScore: 8.0,
      co2AbsorptionRate: 0.38,
      oxygenProductionRate: 0.78,
      humidityPreference: '40-60%',
      temperatureMin: 12,
      temperatureMax: 30,
      description: 'Adaptable plant that produces baby plants on runners. Removes carbon monoxide.',
      careInstructions: 'Water moderately. Tolerates various light conditions. Remove brown tips with scissors.',
      imageUrl: '/images/species/spider-plant.jpg',
    },
  });

  const species7 = await prisma.plantSpecies.create({
    data: {
      id: uuidv4(),
      commonName: 'Aloe Vera',
      scientificName: 'Aloe barbadensis miller',
      category: 'Succulents',
      lightRequirement: LightRequirement.HIGH,
      wateringFrequency: 10,
      difficulty: DifficultyLevel.EASY,
      airPurifyingScore: 7.5,
      co2AbsorptionRate: 0.30,
      oxygenProductionRate: 0.70,
      humidityPreference: '30-40%',
      temperatureMin: 13,
      temperatureMax: 35,
      description: 'Medicinal succulent that purifies air and has healing gel properties.',
      careInstructions: 'Water deeply but infrequently. Ensure excellent drainage. Full to partial sun.',
      imageUrl: '/images/species/aloe-vera.jpg',
    },
  });

  const species8 = await prisma.plantSpecies.create({
    data: {
      id: uuidv4(),
      commonName: 'Bamboo Palm',
      scientificName: 'Chamaedorea seifrizii',
      category: 'Palms',
      lightRequirement: LightRequirement.MEDIUM,
      wateringFrequency: 3,
      difficulty: DifficultyLevel.MODERATE,
      airPurifyingScore: 9.0,
      co2AbsorptionRate: 0.58,
      oxygenProductionRate: 1.05,
      humidityPreference: '50-70%',
      temperatureMin: 18,
      temperatureMax: 32,
      description: 'Elegant palm ideal for adding a tropical feel while purifying air.',
      careInstructions: 'Keep soil moist. Indirect bright light. Mist regularly in dry conditions.',
      imageUrl: '/images/species/bamboo-palm.jpg',
    },
  });

  // -----------------------------------------------------------
  // Plants
  // -----------------------------------------------------------
  console.log('Seeding plants...');

  const plant1 = await prisma.plant.create({
    data: {
      id: uuidv4(),
      speciesId: species1.id,
      locationId: loc1.id,
      nickname: 'Office Guardian',
      status: PlantStatus.HEALTHY,
      qrCode: `VRK-PLT-${Date.now()}-001`,
      lastMaintenance: new Date('2026-03-10'),
      wateringCycle: 7,
      growthStage: GrowthStage.MATURE,
      placedDate: new Date('2025-01-15'),
    },
  });

  const plant2 = await prisma.plant.create({
    data: {
      id: uuidv4(),
      speciesId: species4.id,
      locationId: loc2.id,
      nickname: 'Lobby Palm',
      status: PlantStatus.HEALTHY,
      qrCode: `VRK-PLT-${Date.now()}-002`,
      lastMaintenance: new Date('2026-03-12'),
      wateringCycle: 3,
      growthStage: GrowthStage.MATURE,
      placedDate: new Date('2025-01-15'),
    },
  });

  const plant3 = await prisma.plant.create({
    data: {
      id: uuidv4(),
      speciesId: species3.id,
      locationId: loc1.id,
      nickname: 'Peaceful Pete',
      status: PlantStatus.NEEDS_ATTENTION,
      qrCode: `VRK-PLT-${Date.now()}-003`,
      lastMaintenance: new Date('2026-03-05'),
      wateringCycle: 4,
      growthStage: GrowthStage.FLOWERING,
      placedDate: new Date('2025-02-01'),
      notes: 'Leaves showing slight yellowing, needs fertilizer.',
    },
  });

  const plant4 = await prisma.plant.create({
    data: {
      id: uuidv4(),
      speciesId: species2.id,
      locationId: loc3.id,
      nickname: 'Cafeteria Vine',
      status: PlantStatus.HEALTHY,
      qrCode: `VRK-PLT-${Date.now()}-004`,
      lastMaintenance: new Date('2026-03-11'),
      wateringCycle: 5,
      growthStage: GrowthStage.MATURE,
      placedDate: new Date('2025-01-20'),
    },
  });

  const plant5 = await prisma.plant.create({
    data: {
      id: uuidv4(),
      speciesId: species5.id,
      locationId: loc4.id,
      nickname: 'Rubber Guard',
      status: PlantStatus.HEALTHY,
      qrCode: `VRK-PLT-${Date.now()}-005`,
      lastMaintenance: new Date('2026-03-09'),
      wateringCycle: 5,
      growthStage: GrowthStage.MATURE,
      placedDate: new Date('2025-03-20'),
    },
  });

  const plant6 = await prisma.plant.create({
    data: {
      id: uuidv4(),
      speciesId: species7.id,
      locationId: loc5.id,
      nickname: 'Terrace Aloe',
      status: PlantStatus.HEALTHY,
      qrCode: `VRK-PLT-${Date.now()}-006`,
      lastMaintenance: new Date('2026-03-08'),
      wateringCycle: 10,
      growthStage: GrowthStage.MATURE,
      placedDate: new Date('2025-04-01'),
    },
  });

  const plant7 = await prisma.plant.create({
    data: {
      id: uuidv4(),
      speciesId: species6.id,
      locationId: loc6.id,
      nickname: 'Living Room Spider',
      status: PlantStatus.CRITICAL,
      qrCode: `VRK-PLT-${Date.now()}-007`,
      lastMaintenance: new Date('2026-02-20'),
      wateringCycle: 4,
      growthStage: GrowthStage.MATURE,
      placedDate: new Date('2025-06-10'),
      notes: 'Root rot detected. Needs immediate repotting.',
    },
  });

  const plant8 = await prisma.plant.create({
    data: {
      id: uuidv4(),
      speciesId: species8.id,
      locationId: loc7.id,
      nickname: 'Balcony Bamboo',
      status: PlantStatus.HEALTHY,
      qrCode: `VRK-PLT-${Date.now()}-008`,
      lastMaintenance: new Date('2026-03-13'),
      wateringCycle: 3,
      growthStage: GrowthStage.JUVENILE,
      placedDate: new Date('2025-07-01'),
    },
  });

  // -----------------------------------------------------------
  // Plant Health Logs
  // -----------------------------------------------------------
  console.log('Seeding plant health logs...');

  await prisma.plantHealthLog.createMany({
    data: [
      {
        id: uuidv4(),
        plantId: plant1.id,
        technicianId: techUser1.id,
        healthScore: 9.2,
        notes: 'Plant is thriving. No issues detected.',
        temperature: 24,
        humidity: 55,
        soilMoisture: 35,
        lightLevel: 300,
        createdAt: new Date('2026-03-10'),
      },
      {
        id: uuidv4(),
        plantId: plant2.id,
        technicianId: techUser1.id,
        healthScore: 8.8,
        notes: 'Healthy growth. Slight dust on leaves, cleaned during visit.',
        temperature: 26,
        humidity: 48,
        soilMoisture: 42,
        lightLevel: 450,
        createdAt: new Date('2026-03-12'),
      },
      {
        id: uuidv4(),
        plantId: plant3.id,
        technicianId: techUser1.id,
        healthScore: 5.5,
        notes: 'Yellow leaves noticed. Possible overwatering or nutrient deficiency.',
        diseaseDetected: 'Chlorosis',
        temperature: 25,
        humidity: 60,
        soilMoisture: 70,
        lightLevel: 200,
        recommendations: 'Reduce watering frequency. Apply balanced NPK fertilizer.',
        createdAt: new Date('2026-03-05'),
      },
      {
        id: uuidv4(),
        plantId: plant4.id,
        technicianId: techUser2.id,
        healthScore: 9.0,
        notes: 'Excellent growth. New tendrils emerging.',
        temperature: 23,
        humidity: 52,
        soilMoisture: 40,
        lightLevel: 350,
        createdAt: new Date('2026-03-11'),
      },
      {
        id: uuidv4(),
        plantId: plant5.id,
        technicianId: techUser2.id,
        healthScore: 8.5,
        notes: 'Growing well. Leaves are glossy and firm.',
        temperature: 25,
        humidity: 50,
        soilMoisture: 38,
        lightLevel: 280,
        createdAt: new Date('2026-03-09'),
      },
      {
        id: uuidv4(),
        plantId: plant7.id,
        technicianId: techUser3.id,
        healthScore: 2.5,
        notes: 'Root rot detected. Soil is waterlogged. Urgent repotting needed.',
        diseaseDetected: 'Root Rot (Pythium)',
        temperature: 28,
        humidity: 65,
        soilMoisture: 90,
        lightLevel: 150,
        recommendations: 'Repot immediately with fresh well-draining soil. Trim affected roots. Reduce watering.',
        aiAnalysis: 'AI confirms root rot with 94% confidence. Likely caused by poor drainage and overwatering.',
        createdAt: new Date('2026-02-20'),
      },
    ],
  });

  // -----------------------------------------------------------
  // Subscription Plans
  // -----------------------------------------------------------
  console.log('Seeding subscription plans...');

  const starterPlan = await prisma.subscriptionPlan.create({
    data: {
      id: uuidv4(),
      name: 'Starter Green',
      description: 'Perfect for small offices and residences. Up to 15 plants with bi-weekly maintenance.',
      monthlyPrice: 4999,
      quarterlyPrice: 13499,
      annualPrice: 47988,
      maxPlants: 15,
      features: [
        'Up to 15 plants',
        'Bi-weekly maintenance visits',
        'Basic health monitoring',
        'Email support',
        'Monthly health reports',
        'Plant replacement (up to 2/year)',
      ],
      popular: false,
      sortOrder: 1,
    },
  });

  const growthPlan = await prisma.subscriptionPlan.create({
    data: {
      id: uuidv4(),
      name: 'Growth Garden',
      description: 'Ideal for medium offices. Up to 50 plants with weekly maintenance and AI health monitoring.',
      monthlyPrice: 12999,
      quarterlyPrice: 34999,
      annualPrice: 129588,
      maxPlants: 50,
      features: [
        'Up to 50 plants',
        'Weekly maintenance visits',
        'AI-powered health monitoring',
        'Priority support',
        'Weekly health reports',
        'Plant replacement (up to 5/year)',
        'QR code plant tracking',
        'Dedicated technician',
      ],
      popular: true,
      sortOrder: 2,
    },
  });

  const premiumPlan = await prisma.subscriptionPlan.create({
    data: {
      id: uuidv4(),
      name: 'Premium Forest',
      description: 'Enterprise-grade for large offices. Unlimited plants with daily care and full AI diagnostics.',
      monthlyPrice: 29999,
      quarterlyPrice: 79999,
      annualPrice: 299988,
      maxPlants: 200,
      features: [
        'Up to 200 plants',
        'Daily maintenance visits',
        'Full AI diagnostics & disease detection',
        '24/7 priority support',
        'Real-time health dashboard',
        'Unlimited plant replacements',
        'QR code plant tracking',
        'Dedicated team of technicians',
        'Custom landscape design',
        'Environmental impact reports',
        'Carbon offset certificates',
      ],
      popular: false,
      sortOrder: 3,
    },
  });

  // -----------------------------------------------------------
  // Subscriptions
  // -----------------------------------------------------------
  console.log('Seeding subscriptions...');

  const sub1 = await prisma.subscription.create({
    data: {
      id: uuidv4(),
      clientId: client1.id,
      planId: growthPlan.id,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date('2025-01-01'),
      billingCycle: BillingCycle.QUARTERLY,
    },
  });

  const sub2 = await prisma.subscription.create({
    data: {
      id: uuidv4(),
      clientId: client2.id,
      planId: starterPlan.id,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date('2025-03-15'),
      billingCycle: BillingCycle.MONTHLY,
    },
  });

  const sub3 = await prisma.subscription.create({
    data: {
      id: uuidv4(),
      clientId: client3.id,
      planId: starterPlan.id,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date('2025-06-01'),
      billingCycle: BillingCycle.ANNUAL,
    },
  });

  // -----------------------------------------------------------
  // Invoices
  // -----------------------------------------------------------
  console.log('Seeding invoices...');

  const invoice1 = await prisma.invoice.create({
    data: {
      id: uuidv4(),
      subscriptionId: sub1.id,
      clientId: client1.id,
      invoiceNumber: 'VRK-INV-2026-001',
      amount: 34999,
      tax: 6300,
      total: 41299,
      status: InvoiceStatus.PAID,
      dueDate: new Date('2026-01-15'),
      paidDate: new Date('2026-01-10'),
      billingPeriodStart: new Date('2026-01-01'),
      billingPeriodEnd: new Date('2026-03-31'),
    },
  });

  const invoice2 = await prisma.invoice.create({
    data: {
      id: uuidv4(),
      subscriptionId: sub2.id,
      clientId: client2.id,
      invoiceNumber: 'VRK-INV-2026-002',
      amount: 4999,
      tax: 900,
      total: 5899,
      status: InvoiceStatus.PAID,
      dueDate: new Date('2026-03-01'),
      paidDate: new Date('2026-02-28'),
      billingPeriodStart: new Date('2026-03-01'),
      billingPeriodEnd: new Date('2026-03-31'),
    },
  });

  const invoice3 = await prisma.invoice.create({
    data: {
      id: uuidv4(),
      subscriptionId: sub3.id,
      clientId: client3.id,
      invoiceNumber: 'VRK-INV-2026-003',
      amount: 47988,
      tax: 8638,
      total: 56626,
      status: InvoiceStatus.PENDING,
      dueDate: new Date('2026-06-01'),
      billingPeriodStart: new Date('2026-06-01'),
      billingPeriodEnd: new Date('2027-05-31'),
    },
  });

  const invoice4 = await prisma.invoice.create({
    data: {
      id: uuidv4(),
      subscriptionId: sub2.id,
      clientId: client2.id,
      invoiceNumber: 'VRK-INV-2026-004',
      amount: 4999,
      tax: 900,
      total: 5899,
      status: InvoiceStatus.OVERDUE,
      dueDate: new Date('2026-02-01'),
      billingPeriodStart: new Date('2026-02-01'),
      billingPeriodEnd: new Date('2026-02-28'),
    },
  });

  // -----------------------------------------------------------
  // Payments
  // -----------------------------------------------------------
  console.log('Seeding payments...');

  await prisma.payment.createMany({
    data: [
      {
        id: uuidv4(),
        invoiceId: invoice1.id,
        amount: 41299,
        method: PaymentMethod.STRIPE,
        status: PaymentStatus.SUCCESS,
        paidAt: new Date('2026-01-10'),
        metadata: { receiptNumber: 'RCP-2026-001' },
      },
      {
        id: uuidv4(),
        invoiceId: invoice2.id,
        amount: 5899,
        method: PaymentMethod.UPI,
        status: PaymentStatus.SUCCESS,
        paidAt: new Date('2026-02-28'),
        metadata: { upiTransactionId: 'UPI-TXN-789456' },
      },
    ],
  });

  // -----------------------------------------------------------
  // Service Visits
  // -----------------------------------------------------------
  console.log('Seeding service visits...');

  await prisma.serviceVisit.createMany({
    data: [
      {
        id: uuidv4(),
        plantId: plant1.id,
        technicianId: tech1.id,
        scheduledDate: new Date('2026-03-10T10:00:00'),
        completedDate: new Date('2026-03-10T10:30:00'),
        type: ServiceVisitType.ROUTINE,
        status: ServiceVisitStatus.COMPLETED,
        notes: 'Routine watering and health check. Plant is healthy.',
        durationMinutes: 30,
        rating: 5,
      },
      {
        id: uuidv4(),
        plantId: plant2.id,
        technicianId: tech1.id,
        scheduledDate: new Date('2026-03-12T11:00:00'),
        completedDate: new Date('2026-03-12T11:45:00'),
        type: ServiceVisitType.ROUTINE,
        status: ServiceVisitStatus.COMPLETED,
        notes: 'Watered, cleaned dust from leaves, checked for pests.',
        durationMinutes: 45,
        rating: 5,
      },
      {
        id: uuidv4(),
        plantId: plant3.id,
        technicianId: tech1.id,
        scheduledDate: new Date('2026-03-17T09:00:00'),
        type: ServiceVisitType.EMERGENCY,
        status: ServiceVisitStatus.SCHEDULED,
        notes: 'Scheduled emergency visit for chlorosis treatment.',
      },
      {
        id: uuidv4(),
        plantId: plant7.id,
        technicianId: tech3.id,
        scheduledDate: new Date('2026-03-16T10:00:00'),
        type: ServiceVisitType.REPLACEMENT,
        status: ServiceVisitStatus.SCHEDULED,
        notes: 'Repotting with new soil. May need full replacement if roots are too damaged.',
      },
      {
        id: uuidv4(),
        plantId: plant5.id,
        technicianId: tech2.id,
        scheduledDate: new Date('2026-03-15T14:00:00'),
        type: ServiceVisitType.ROUTINE,
        status: ServiceVisitStatus.IN_PROGRESS,
        notes: 'Routine weekly maintenance.',
      },
      {
        id: uuidv4(),
        plantId: plant8.id,
        technicianId: tech3.id,
        scheduledDate: new Date('2026-03-18T09:00:00'),
        type: ServiceVisitType.ROUTINE,
        status: ServiceVisitStatus.SCHEDULED,
        notes: 'Weekly watering and growth check for juvenile bamboo palm.',
      },
    ],
  });

  // -----------------------------------------------------------
  // Inventory
  // -----------------------------------------------------------
  console.log('Seeding inventory...');

  await prisma.inventory.createMany({
    data: [
      {
        id: uuidv4(),
        speciesId: species1.id,
        quantity: 45,
        cost: 350,
        supplier: 'Bangalore Nursery Co.',
        supplierPhone: '+91-9800123456',
        lastRestocked: new Date('2026-03-01'),
        minStock: 10,
        location: 'Warehouse A - Shelf 1',
      },
      {
        id: uuidv4(),
        speciesId: species2.id,
        quantity: 60,
        cost: 200,
        supplier: 'Bangalore Nursery Co.',
        supplierPhone: '+91-9800123456',
        lastRestocked: new Date('2026-03-01'),
        minStock: 15,
        location: 'Warehouse A - Shelf 2',
      },
      {
        id: uuidv4(),
        speciesId: species3.id,
        quantity: 30,
        cost: 500,
        supplier: 'Flora India Suppliers',
        supplierPhone: '+91-9800654321',
        lastRestocked: new Date('2026-02-20'),
        minStock: 8,
        location: 'Warehouse A - Shelf 3',
      },
      {
        id: uuidv4(),
        speciesId: species4.id,
        quantity: 20,
        cost: 1200,
        supplier: 'Palm Paradise Nursery',
        supplierPhone: '+91-9800111222',
        lastRestocked: new Date('2026-02-15'),
        minStock: 5,
        location: 'Warehouse B - Bay 1',
      },
      {
        id: uuidv4(),
        speciesId: species5.id,
        quantity: 35,
        cost: 450,
        supplier: 'Bangalore Nursery Co.',
        supplierPhone: '+91-9800123456',
        lastRestocked: new Date('2026-03-05'),
        minStock: 10,
        location: 'Warehouse A - Shelf 4',
      },
      {
        id: uuidv4(),
        speciesId: species6.id,
        quantity: 50,
        cost: 250,
        supplier: 'Flora India Suppliers',
        supplierPhone: '+91-9800654321',
        lastRestocked: new Date('2026-03-10'),
        minStock: 12,
        location: 'Warehouse A - Shelf 5',
      },
      {
        id: uuidv4(),
        speciesId: species7.id,
        quantity: 3,
        cost: 300,
        supplier: 'Deccan Nurseries',
        supplierPhone: '+91-9800333444',
        lastRestocked: new Date('2026-01-15'),
        minStock: 8,
        location: 'Warehouse B - Bay 2',
        notes: 'LOW STOCK - reorder immediately',
      },
      {
        id: uuidv4(),
        speciesId: species8.id,
        quantity: 15,
        cost: 900,
        supplier: 'Palm Paradise Nursery',
        supplierPhone: '+91-9800111222',
        lastRestocked: new Date('2026-02-28'),
        minStock: 5,
        location: 'Warehouse B - Bay 1',
      },
    ],
  });

  // -----------------------------------------------------------
  // Notifications
  // -----------------------------------------------------------
  console.log('Seeding notifications...');

  await prisma.notification.createMany({
    data: [
      {
        id: uuidv4(),
        userId: clientUser1.id,
        title: 'Service Visit Completed',
        message: 'Routine maintenance for your TechCorp Lobby plants has been completed successfully.',
        type: NotificationType.VISIT_COMPLETED,
        read: false,
        createdAt: new Date('2026-03-12T12:00:00'),
      },
      {
        id: uuidv4(),
        userId: clientUser1.id,
        title: 'Plant Health Alert',
        message: 'Your Peace Lily "Peaceful Pete" in Floor 5 Office needs attention. Chlorosis detected.',
        type: NotificationType.PLANT_ALERT,
        read: false,
        createdAt: new Date('2026-03-05T15:30:00'),
      },
      {
        id: uuidv4(),
        userId: clientUser2.id,
        title: 'Payment Overdue',
        message: 'Invoice VRK-INV-2026-004 for February billing period is overdue. Please make payment at your earliest.',
        type: NotificationType.PAYMENT_DUE,
        read: true,
        createdAt: new Date('2026-02-10T09:00:00'),
      },
      {
        id: uuidv4(),
        userId: clientUser3.id,
        title: 'Critical Plant Alert',
        message: 'Your Spider Plant "Living Room Spider" is in critical condition. Root rot detected. Emergency visit scheduled.',
        type: NotificationType.PLANT_ALERT,
        read: false,
        createdAt: new Date('2026-02-20T16:00:00'),
      },
      {
        id: uuidv4(),
        userId: techUser1.id,
        title: 'Emergency Visit Assigned',
        message: 'You have been assigned an emergency visit for Peace Lily at TechCorp Main Office on March 17.',
        type: NotificationType.SERVICE_REMINDER,
        read: false,
        createdAt: new Date('2026-03-14T10:00:00'),
      },
      {
        id: uuidv4(),
        userId: techUser3.id,
        title: 'Replacement Visit Assigned',
        message: 'Plant replacement visit scheduled at Luxe Homes on March 16. Spider plant repotting/replacement.',
        type: NotificationType.SERVICE_REMINDER,
        read: false,
        createdAt: new Date('2026-03-14T10:30:00'),
      },
      {
        id: uuidv4(),
        userId: adminUser.id,
        title: 'Low Inventory Alert',
        message: 'Aloe Vera stock is critically low (3 remaining, minimum: 8). Reorder from Deccan Nurseries.',
        type: NotificationType.SYSTEM,
        read: false,
        createdAt: new Date('2026-03-14T08:00:00'),
      },
    ],
  });

  console.log('Seed completed successfully!');
  console.log('---');
  console.log('Admin login:  admin@vriksham.com / Password123!');
  console.log('Client login: priya@techcorp.in / Password123!');
  console.log('Tech login:   ravi@vriksham.com / Password123!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
