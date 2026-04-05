import { Request, Response } from 'express';
import prisma from '../config/database';
import { parsePagination, buildPaginatedResponse } from '../types';
import { Prisma } from '@prisma/client';

interface CatalogStatusCounts {
  total: number;
  healthy: number;
  needsAttention: number;
  critical: number;
}

interface CatalogItem {
  id: string;
  slug: string;
  name: string;
  scientificName: string;
  category: string;
  categories: string[];
  lightRequirement: string;
  difficulty: string;
  description: string | null;
  careInstructions: string | null;
  imageUrl: string | null;
  humidityPreference: string | null;
  temperatureMin: number | null;
  temperatureMax: number | null;
  plantCount: number;
  healthyPlantCount: number;
  needsAttentionCount: number;
  criticalCount: number;
  healthRatio: number;
  healthBand: 'Excellent' | 'Good' | 'Needs Attention' | 'No Data';
  inventoryQuantity: number;
  averageUnitCost: number | null;
  minUnitCost: number | null;
  maxUnitCost: number | null;
  updatedAt: Date;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function toCatalogSlug(name: string, id: string): string {
  return `${slugify(name)}--${id}`;
}

function parseCatalogId(slugOrId: string): string | null {
  if (!slugOrId) return null;

  const fromSlug = slugOrId.includes('--')
    ? slugOrId.split('--').pop()
    : slugOrId;

  if (!fromSlug) return null;

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(fromSlug)
    ? fromSlug
    : null;
}

function toHealthBand(ratio: number, total: number): CatalogItem['healthBand'] {
  if (total === 0) return 'No Data';
  if (ratio >= 0.8) return 'Excellent';
  if (ratio >= 0.6) return 'Good';
  return 'Needs Attention';
}

function mapCatalogItem(
  species: {
    id: string;
    commonName: string;
    scientificName: string;
    category: string;
    lightRequirement: string;
    difficulty: string;
    description: string | null;
    careInstructions: string | null;
    imageUrl: string | null;
    humidityPreference: string | null;
    temperatureMin: number | null;
    temperatureMax: number | null;
    updatedAt: Date;
    inventory: Array<{ quantity: number; cost: number }>;
  },
  counts: CatalogStatusCounts
): CatalogItem {
  const costs = species.inventory
    .map((item) => Number(item.cost || 0))
    .filter((cost) => cost > 0);

  const inventoryQuantity = species.inventory.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const averageUnitCost =
    costs.length > 0
      ? costs.reduce((sum, cost) => sum + cost, 0) / costs.length
      : null;

  const minUnitCost = costs.length > 0 ? Math.min(...costs) : null;
  const maxUnitCost = costs.length > 0 ? Math.max(...costs) : null;
  const healthRatio = counts.total > 0 ? counts.healthy / counts.total : 0;

  return {
    id: species.id,
    slug: toCatalogSlug(species.commonName, species.id),
    name: species.commonName,
    scientificName: species.scientificName,
    category: species.category,
    categories: species.category
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
    lightRequirement: species.lightRequirement,
    difficulty: species.difficulty,
    description: species.description,
    careInstructions: species.careInstructions,
    imageUrl: species.imageUrl,
    humidityPreference: species.humidityPreference,
    temperatureMin: species.temperatureMin,
    temperatureMax: species.temperatureMax,
    plantCount: counts.total,
    healthyPlantCount: counts.healthy,
    needsAttentionCount: counts.needsAttention,
    criticalCount: counts.critical,
    healthRatio,
    healthBand: toHealthBand(healthRatio, counts.total),
    inventoryQuantity,
    averageUnitCost,
    minUnitCost,
    maxUnitCost,
    updatedAt: species.updatedAt,
  };
}

export const plantsController = {
  /**
   * GET /plants/catalog
   * Public marketplace catalog with real species + inventory + health aggregates
   */
  async listCatalog(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = parsePagination(req.query);
      const { search, category, light, difficulty, sortBy } = req.query;

      const where: Prisma.PlantSpeciesWhereInput = { isActive: true };

      if (search && typeof search === 'string') {
        where.OR = [
          { commonName: { contains: search, mode: 'insensitive' } },
          { scientificName: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (category && typeof category === 'string' && category !== 'All') {
        where.category = { contains: category, mode: 'insensitive' };
      }

      if (light && typeof light === 'string' && light !== 'All') {
        where.lightRequirement = light as Prisma.EnumLightRequirementFilter;
      }

      if (difficulty && typeof difficulty === 'string' && difficulty !== 'All') {
        where.difficulty = difficulty as Prisma.EnumDifficultyLevelFilter;
      }

      const species = await prisma.plantSpecies.findMany({
        where,
        select: {
          id: true,
          commonName: true,
          scientificName: true,
          category: true,
          lightRequirement: true,
          difficulty: true,
          description: true,
          careInstructions: true,
          imageUrl: true,
          humidityPreference: true,
          temperatureMin: true,
          temperatureMax: true,
          updatedAt: true,
          inventory: {
            select: {
              quantity: true,
              cost: true,
            },
          },
        },
      });

      const speciesIds = species.map((item) => item.id);

      const groupedStatuses = speciesIds.length
        ? await prisma.plant.groupBy({
            by: ['speciesId', 'status'],
            where: {
              isActive: true,
              speciesId: { in: speciesIds },
            },
            _count: { _all: true },
          })
        : [];

      const statusCounts = groupedStatuses.reduce<Record<string, CatalogStatusCounts>>(
        (acc, group) => {
          const current =
            acc[group.speciesId] ||
            ({ total: 0, healthy: 0, needsAttention: 0, critical: 0 } as CatalogStatusCounts);

          const count = group._count._all;
          current.total += count;

          if (group.status === 'HEALTHY') {
            current.healthy += count;
          }
          if (group.status === 'NEEDS_ATTENTION') {
            current.needsAttention += count;
          }
          if (group.status === 'CRITICAL') {
            current.critical += count;
          }

          acc[group.speciesId] = current;
          return acc;
        },
        {}
      );

      const catalogItems = species.map((item) =>
        mapCatalogItem(
          item,
          statusCounts[item.id] || {
            total: 0,
            healthy: 0,
            needsAttention: 0,
            critical: 0,
          }
        )
      );

      const sortKey = typeof sortBy === 'string' ? sortBy : 'popular';
      catalogItems.sort((a, b) => {
        switch (sortKey) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price-asc':
            return (a.minUnitCost ?? Number.MAX_SAFE_INTEGER) - (b.minUnitCost ?? Number.MAX_SAFE_INTEGER);
          case 'price-desc':
            return (b.minUnitCost ?? 0) - (a.minUnitCost ?? 0);
          case 'inventory':
            return b.inventoryQuantity - a.inventoryQuantity;
          case 'newest':
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          case 'health':
            return b.healthRatio - a.healthRatio;
          case 'popular':
          default:
            return b.plantCount - a.plantCount;
        }
      });

      const total = catalogItems.length;
      const start = (page - 1) * limit;
      const paginated = catalogItems.slice(start, start + limit);

      res.status(200).json({
        success: true,
        ...buildPaginatedResponse(paginated, total, page, limit),
      });
    } catch (error) {
      console.error('List marketplace catalog error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch marketplace catalog.',
      });
    }
  },

  /**
   * GET /plants/catalog/:slug
   * Public single marketplace catalog item
   */
  async getCatalogItem(req: Request, res: Response): Promise<void> {
    try {
      const slug = String(req.params.slug || '');
      const id = parseCatalogId(slug);

      if (!id) {
        res.status(404).json({
          success: false,
          error: 'Catalog item not found.',
        });
        return;
      }

      const species = await prisma.plantSpecies.findFirst({
        where: { id, isActive: true },
        select: {
          id: true,
          commonName: true,
          scientificName: true,
          category: true,
          lightRequirement: true,
          difficulty: true,
          description: true,
          careInstructions: true,
          imageUrl: true,
          humidityPreference: true,
          temperatureMin: true,
          temperatureMax: true,
          updatedAt: true,
          inventory: {
            select: {
              quantity: true,
              cost: true,
            },
          },
        },
      });

      if (!species) {
        res.status(404).json({
          success: false,
          error: 'Catalog item not found.',
        });
        return;
      }

      const groupedStatuses = await prisma.plant.groupBy({
        by: ['status'],
        where: {
          isActive: true,
          speciesId: species.id,
        },
        _count: { _all: true },
      });

      const counts: CatalogStatusCounts = {
        total: 0,
        healthy: 0,
        needsAttention: 0,
        critical: 0,
      };

      groupedStatuses.forEach((group) => {
        const count = group._count._all;
        counts.total += count;
        if (group.status === 'HEALTHY') counts.healthy += count;
        if (group.status === 'NEEDS_ATTENTION') counts.needsAttention += count;
        if (group.status === 'CRITICAL') counts.critical += count;
      });

      res.status(200).json({
        success: true,
        data: mapCatalogItem(species, counts),
      });
    } catch (error) {
      console.error('Get marketplace catalog item error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch catalog item.',
      });
    }
  },

  /**
   * GET /plants
   * List all plants with pagination, search, and filters
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, skip, sortBy, sortOrder } = parsePagination(req.query);
      const { search, status, locationId, speciesId, growthStage } = req.query;

      const where: Prisma.PlantWhereInput = { isActive: true };

      if (search && typeof search === 'string') {
        where.OR = [
          { nickname: { contains: search, mode: 'insensitive' } },
          { species: { commonName: { contains: search, mode: 'insensitive' } } },
          { species: { scientificName: { contains: search, mode: 'insensitive' } } },
        ];
      }

      if (status && typeof status === 'string') {
        where.status = status as Prisma.EnumPlantStatusFilter;
      }

      if (locationId && typeof locationId === 'string') {
        where.locationId = locationId;
      }

      if (speciesId && typeof speciesId === 'string') {
        where.speciesId = speciesId;
      }

      if (growthStage && typeof growthStage === 'string') {
        where.growthStage = growthStage as Prisma.EnumGrowthStageFilter;
      }

      const [plants, total] = await Promise.all([
        prisma.plant.findMany({
          where,
          include: {
            species: {
              select: {
                id: true,
                commonName: true,
                scientificName: true,
                category: true,
                lightRequirement: true,
                wateringFrequency: true,
                imageUrl: true,
              },
            },
            location: {
              select: {
                id: true,
                name: true,
                type: true,
                client: {
                  select: { id: true, companyName: true },
                },
              },
            },
            _count: {
              select: { healthLogs: true, serviceVisits: true },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        prisma.plant.count({ where }),
      ]);

      res.status(200).json({
        success: true,
        ...buildPaginatedResponse(plants, total, page, limit),
      });
    } catch (error) {
      console.error('List plants error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch plants.',
      });
    }
  },

  /**
   * GET /plants/:id
   * Get a single plant with full details
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const plant = await prisma.plant.findUnique({
        where: { id },
        include: {
          species: true,
          location: {
            include: {
              client: {
                select: { id: true, companyName: true, user: { select: { name: true, email: true } } },
              },
            },
          },
          healthLogs: {
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
              technician: { select: { name: true } },
            },
          },
          serviceVisits: {
            orderBy: { scheduledDate: 'desc' },
            take: 10,
            include: {
              technician: {
                select: { user: { select: { name: true } } },
              },
            },
          },
        },
      });

      if (!plant) {
        res.status(404).json({
          success: false,
          error: 'Plant not found.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: plant,
      });
    } catch (error) {
      console.error('Get plant error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch plant.',
      });
    }
  },

  /**
   * POST /plants
   * Create a new plant
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      // Validate species exists
      const species = await prisma.plantSpecies.findUnique({ where: { id: data.speciesId } });
      if (!species) {
        res.status(404).json({ success: false, error: 'Plant species not found.' });
        return;
      }

      // Validate location exists
      const location = await prisma.location.findUnique({ where: { id: data.locationId } });
      if (!location) {
        res.status(404).json({ success: false, error: 'Location not found.' });
        return;
      }

      const plant = await prisma.plant.create({
        data: {
          speciesId: data.speciesId,
          locationId: data.locationId,
          nickname: data.nickname || null,
          status: data.status || 'HEALTHY',
          qrCode: data.qrCode || null,
          wateringCycle: data.wateringCycle || species.wateringFrequency,
          growthStage: data.growthStage || 'MATURE',
          placedDate: data.placedDate ? new Date(data.placedDate) : new Date(),
          notes: data.notes || null,
        },
        include: {
          species: {
            select: { id: true, commonName: true, scientificName: true },
          },
          location: {
            select: { id: true, name: true },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Plant created successfully.',
        data: plant,
      });
    } catch (error) {
      console.error('Create plant error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create plant.',
      });
    }
  },

  /**
   * PUT /plants/:id
   * Update a plant
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = req.body;

      const updateData: Prisma.PlantUpdateInput = {};
      if (data.speciesId !== undefined) updateData.species = { connect: { id: data.speciesId } };
      if (data.locationId !== undefined) updateData.location = { connect: { id: data.locationId } };
      if (data.nickname !== undefined) updateData.nickname = data.nickname;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.qrCode !== undefined) updateData.qrCode = data.qrCode;
      if (data.wateringCycle !== undefined) updateData.wateringCycle = data.wateringCycle;
      if (data.growthStage !== undefined) updateData.growthStage = data.growthStage;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;

      const plant = await prisma.plant.update({
        where: { id },
        data: updateData,
        include: {
          species: { select: { id: true, commonName: true } },
          location: { select: { id: true, name: true } },
        },
      });

      res.status(200).json({
        success: true,
        message: 'Plant updated successfully.',
        data: plant,
      });
    } catch (error) {
      console.error('Update plant error:', error);
      if ((error as { code?: string }).code === 'P2025') {
        res.status(404).json({ success: false, error: 'Plant not found.' });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to update plant.',
      });
    }
  },

  /**
   * DELETE /plants/:id
   * Soft-delete a plant (set isActive to false)
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const plant = await prisma.plant.update({
        where: { id },
        data: { isActive: false, status: 'REMOVED' },
        select: { id: true, nickname: true },
      });

      res.status(200).json({
        success: true,
        message: 'Plant removed successfully.',
        data: plant,
      });
    } catch (error) {
      console.error('Delete plant error:', error);
      if ((error as { code?: string }).code === 'P2025') {
        res.status(404).json({ success: false, error: 'Plant not found.' });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to delete plant.',
      });
    }
  },

  /**
   * GET /plants/:id/health-logs
   * Get health logs for a specific plant
   */
  async getHealthLogs(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { page, limit, skip } = parsePagination(req.query);

      const plant = await prisma.plant.findUnique({ where: { id } });
      if (!plant) {
        res.status(404).json({ success: false, error: 'Plant not found.' });
        return;
      }

      const [logs, total] = await Promise.all([
        prisma.plantHealthLog.findMany({
          where: { plantId: id },
          include: {
            technician: { select: { name: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.plantHealthLog.count({ where: { plantId: id } }),
      ]);

      res.status(200).json({
        success: true,
        ...buildPaginatedResponse(logs, total, page, limit),
      });
    } catch (error) {
      console.error('Get health logs error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch health logs.',
      });
    }
  },

  /**
   * POST /plants/:id/health-check
   * Create a new health log entry for a plant
   */
  async createHealthCheck(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = req.body;

      const plant = await prisma.plant.findUnique({ where: { id } });
      if (!plant) {
        res.status(404).json({ success: false, error: 'Plant not found.' });
        return;
      }

      const healthLog = await prisma.plantHealthLog.create({
        data: {
          plantId: id,
          technicianId: req.user?.id || null,
          healthScore: data.healthScore,
          notes: data.notes || null,
          diseaseDetected: data.diseaseDetected || null,
          imageUrl: data.imageUrl || null,
          temperature: data.temperature || null,
          humidity: data.humidity || null,
          soilMoisture: data.soilMoisture || null,
          lightLevel: data.lightLevel || null,
          aiAnalysis: data.aiAnalysis || null,
          recommendations: data.recommendations || null,
        },
      });

      // Update plant status based on health score
      let newStatus: 'HEALTHY' | 'NEEDS_ATTENTION' | 'CRITICAL' = 'HEALTHY';
      if (data.healthScore < 30) {
        newStatus = 'CRITICAL';
      } else if (data.healthScore < 60) {
        newStatus = 'NEEDS_ATTENTION';
      }

      await prisma.plant.update({
        where: { id },
        data: {
          status: newStatus,
          lastMaintenance: new Date(),
        },
      });

      res.status(201).json({
        success: true,
        message: 'Health check recorded successfully.',
        data: healthLog,
      });
    } catch (error) {
      console.error('Create health check error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to record health check.',
      });
    }
  },

  /**
   * GET /plants/species
   * List all plant species
   */
  async listSpecies(req: Request, res: Response): Promise<void> {
    try {
      const { search, category, difficulty } = req.query;

      const where: Prisma.PlantSpeciesWhereInput = { isActive: true };

      if (search && typeof search === 'string') {
        where.OR = [
          { commonName: { contains: search, mode: 'insensitive' } },
          { scientificName: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (category && typeof category === 'string') {
        where.category = { contains: category, mode: 'insensitive' };
      }

      if (difficulty && typeof difficulty === 'string') {
        where.difficulty = difficulty as Prisma.EnumDifficultyLevelFilter;
      }

      const species = await prisma.plantSpecies.findMany({
        where,
        include: {
          _count: { select: { plants: true } },
        },
        orderBy: { commonName: 'asc' },
      });

      res.status(200).json({
        success: true,
        data: species,
      });
    } catch (error) {
      console.error('List species error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch species.',
      });
    }
  },

  /**
   * POST /plants/species
   * Create a new plant species
   */
  async createSpecies(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      const species = await prisma.plantSpecies.create({
        data: {
          commonName: data.commonName,
          scientificName: data.scientificName,
          category: data.category,
          lightRequirement: data.lightRequirement || 'MEDIUM',
          wateringFrequency: data.wateringFrequency || 3,
          difficulty: data.difficulty || 'MODERATE',
          airPurifyingScore: data.airPurifyingScore || 0,
          co2AbsorptionRate: data.co2AbsorptionRate || 0,
          oxygenProductionRate: data.oxygenProductionRate || 0,
          humidityPreference: data.humidityPreference || null,
          temperatureMin: data.temperatureMin || null,
          temperatureMax: data.temperatureMax || null,
          description: data.description || null,
          careInstructions: data.careInstructions || null,
          imageUrl: data.imageUrl || null,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Plant species created successfully.',
        data: species,
      });
    } catch (error) {
      console.error('Create species error:', error);
      if ((error as { code?: string }).code === 'P2002') {
        res.status(409).json({
          success: false,
          error: 'A species with this scientific name already exists.',
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to create species.',
      });
    }
  },
};

export default plantsController;
