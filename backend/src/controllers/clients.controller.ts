import { Request, Response } from 'express';
import prisma from '../config/database';
import { parsePagination, buildPaginatedResponse } from '../types';
import { Prisma } from '@prisma/client';

export const clientsController = {
  /**
   * GET /clients
   * List all clients with pagination, search, and filters
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, skip, sortBy, sortOrder } = parsePagination(req.query);
      const { search, status, type, city } = req.query;

      const where: Prisma.ClientWhereInput = {};

      if (search && typeof search === 'string') {
        where.OR = [
          { companyName: { contains: search, mode: 'insensitive' } },
          { contactPerson: { contains: search, mode: 'insensitive' } },
          { user: { name: { contains: search, mode: 'insensitive' } } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
        ];
      }

      if (status && typeof status === 'string') {
        where.status = status as Prisma.EnumClientStatusFilter;
      }

      if (type && typeof type === 'string') {
        where.type = type as Prisma.EnumClientTypeFilter;
      }

      if (city && typeof city === 'string') {
        where.city = { contains: city, mode: 'insensitive' };
      }

      const [clients, total] = await Promise.all([
        prisma.client.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                locations: true,
                subscriptions: true,
                invoices: true,
              },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        prisma.client.count({ where }),
      ]);

      res.status(200).json({
        success: true,
        ...buildPaginatedResponse(clients, total, page, limit),
      });
    } catch (error) {
      console.error('List clients error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch clients.',
      });
    }
  },

  /**
   * GET /clients/:id
   * Get a single client with all details
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const client = await prisma.client.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
              avatar: true,
              lastLogin: true,
            },
          },
          locations: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              type: true,
              city: true,
              floor: true,
              area: true,
              _count: { select: { plants: true } },
            },
          },
          subscriptions: {
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
              plan: {
                select: { id: true, name: true, monthlyPrice: true },
              },
            },
          },
          _count: {
            select: {
              locations: true,
              subscriptions: true,
              invoices: true,
            },
          },
        },
      });

      if (!client) {
        res.status(404).json({
          success: false,
          error: 'Client not found.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: client,
      });
    } catch (error) {
      console.error('Get client error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch client.',
      });
    }
  },

  /**
   * POST /clients
   * Create a new client
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      // If userId is provided, link to existing user
      if (data.userId) {
        const existingClient = await prisma.client.findUnique({
          where: { userId: data.userId },
        });
        if (existingClient) {
          res.status(409).json({
            success: false,
            error: 'A client record already exists for this user.',
          });
          return;
        }
      }

      const clientData: Prisma.ClientCreateInput = {
        user: { connect: { id: data.userId } },
        companyName: data.companyName || null,
        industry: data.industry || null,
        type: data.type || 'CORPORATE',
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        pincode: data.pincode || null,
        gstNumber: data.gstNumber || null,
        contactPerson: data.contactPerson || null,
        contactPhone: data.contactPhone || null,
        contractStartDate: data.contractStartDate ? new Date(data.contractStartDate) : null,
        contractEndDate: data.contractEndDate ? new Date(data.contractEndDate) : null,
        status: data.status || 'ACTIVE',
        notes: data.notes || null,
      };

      const client = await prisma.client.create({
        data: clientData,
        include: {
          user: {
            select: { id: true, email: true, name: true },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Client created successfully.',
        data: client,
      });
    } catch (error) {
      console.error('Create client error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create client.',
      });
    }
  },

  /**
   * PUT /clients/:id
   * Update a client
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      const updateData: Prisma.ClientUpdateInput = {};
      if (data.companyName !== undefined) updateData.companyName = data.companyName;
      if (data.industry !== undefined) updateData.industry = data.industry;
      if (data.type !== undefined) updateData.type = data.type;
      if (data.address !== undefined) updateData.address = data.address;
      if (data.city !== undefined) updateData.city = data.city;
      if (data.state !== undefined) updateData.state = data.state;
      if (data.pincode !== undefined) updateData.pincode = data.pincode;
      if (data.gstNumber !== undefined) updateData.gstNumber = data.gstNumber;
      if (data.contactPerson !== undefined) updateData.contactPerson = data.contactPerson;
      if (data.contactPhone !== undefined) updateData.contactPhone = data.contactPhone;
      if (data.contractStartDate !== undefined) {
        updateData.contractStartDate = data.contractStartDate ? new Date(data.contractStartDate) : null;
      }
      if (data.contractEndDate !== undefined) {
        updateData.contractEndDate = data.contractEndDate ? new Date(data.contractEndDate) : null;
      }
      if (data.status !== undefined) updateData.status = data.status;
      if (data.notes !== undefined) updateData.notes = data.notes;

      const client = await prisma.client.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: { id: true, email: true, name: true },
          },
        },
      });

      res.status(200).json({
        success: true,
        message: 'Client updated successfully.',
        data: client,
      });
    } catch (error) {
      console.error('Update client error:', error);
      if ((error as { code?: string }).code === 'P2025') {
        res.status(404).json({ success: false, error: 'Client not found.' });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to update client.',
      });
    }
  },

  /**
   * DELETE /clients/:id
   * Soft-delete a client (set status to INACTIVE)
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const client = await prisma.client.update({
        where: { id },
        data: { status: 'INACTIVE' },
        select: { id: true, companyName: true },
      });

      res.status(200).json({
        success: true,
        message: 'Client deactivated successfully.',
        data: client,
      });
    } catch (error) {
      console.error('Delete client error:', error);
      if ((error as { code?: string }).code === 'P2025') {
        res.status(404).json({ success: false, error: 'Client not found.' });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to delete client.',
      });
    }
  },

  /**
   * GET /clients/:id/locations
   * Get all locations for a client
   */
  async getLocations(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const client = await prisma.client.findUnique({ where: { id } });
      if (!client) {
        res.status(404).json({ success: false, error: 'Client not found.' });
        return;
      }

      const locations = await prisma.location.findMany({
        where: { clientId: id },
        include: {
          _count: { select: { plants: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({
        success: true,
        data: locations,
      });
    } catch (error) {
      console.error('Get client locations error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch client locations.',
      });
    }
  },

  /**
   * GET /clients/:id/plants
   * Get all plants for a client (across all locations)
   */
  async getPlants(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const client = await prisma.client.findUnique({
        where: { id },
        select: { id: true, locations: { select: { id: true } } },
      });

      if (!client) {
        res.status(404).json({ success: false, error: 'Client not found.' });
        return;
      }

      const locationIds = client.locations.map((l) => l.id);

      const plants = await prisma.plant.findMany({
        where: { locationId: { in: locationIds }, isActive: true },
        include: {
          species: {
            select: { id: true, commonName: true, scientificName: true, category: true },
          },
          location: {
            select: { id: true, name: true, type: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({
        success: true,
        data: plants,
      });
    } catch (error) {
      console.error('Get client plants error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch client plants.',
      });
    }
  },

  /**
   * GET /clients/:id/subscriptions
   * Get all subscriptions for a client
   */
  async getSubscriptions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const client = await prisma.client.findUnique({ where: { id } });
      if (!client) {
        res.status(404).json({ success: false, error: 'Client not found.' });
        return;
      }

      const subscriptions = await prisma.subscription.findMany({
        where: { clientId: id },
        include: {
          plan: true,
          _count: { select: { invoices: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({
        success: true,
        data: subscriptions,
      });
    } catch (error) {
      console.error('Get client subscriptions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch client subscriptions.',
      });
    }
  },
};

export default clientsController;
