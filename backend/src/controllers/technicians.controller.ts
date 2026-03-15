import { Request, Response } from 'express';
import prisma from '../config/database';
import { parsePagination, buildPaginatedResponse } from '../types';
import { Prisma } from '@prisma/client';

export const techniciansController = {
  /**
   * GET /technicians
   * List all technicians with pagination and filters
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, skip, sortBy, sortOrder } = parsePagination(req.query);
      const { search, isAvailable, zone } = req.query;

      const where: Prisma.TechnicianWhereInput = {};

      if (search && typeof search === 'string') {
        where.user = {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        };
      }

      if (isAvailable !== undefined) {
        where.isAvailable = isAvailable === 'true';
      }

      if (zone && typeof zone === 'string') {
        where.activeZones = { has: zone };
      }

      const [technicians, total] = await Promise.all([
        prisma.technician.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                avatar: true,
                isActive: true,
              },
            },
            teamMember: {
              select: { id: true, name: true },
            },
            _count: {
              select: { serviceVisits: true },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        prisma.technician.count({ where }),
      ]);

      res.status(200).json({
        success: true,
        ...buildPaginatedResponse(technicians, total, page, limit),
      });
    } catch (error) {
      console.error('List technicians error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch technicians.',
      });
    }
  },

  /**
   * GET /technicians/:id
   * Get a single technician with full details
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const technician = await prisma.technician.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
              avatar: true,
              isActive: true,
              lastLogin: true,
            },
          },
          teamMember: {
            select: { id: true, name: true, zone: true },
          },
          team: {
            select: { id: true, name: true },
          },
          serviceVisits: {
            orderBy: { scheduledDate: 'desc' },
            take: 10,
            select: {
              id: true,
              scheduledDate: true,
              completedDate: true,
              type: true,
              status: true,
              rating: true,
              plant: {
                select: {
                  id: true,
                  nickname: true,
                  species: { select: { commonName: true } },
                },
              },
            },
          },
        },
      });

      if (!technician) {
        res.status(404).json({
          success: false,
          error: 'Technician not found.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: technician,
      });
    } catch (error) {
      console.error('Get technician error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch technician.',
      });
    }
  },

  /**
   * POST /technicians
   * Create a new technician profile
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      // Check if technician profile already exists
      const existing = await prisma.technician.findUnique({
        where: { userId: data.userId },
      });
      if (existing) {
        res.status(409).json({
          success: false,
          error: 'Technician profile already exists for this user.',
        });
        return;
      }

      const technician = await prisma.technician.create({
        data: {
          userId: data.userId,
          specialization: data.specialization || null,
          activeZones: data.activeZones || [],
          certifications: data.certifications || [],
          availability: data.availability || {},
          isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        },
        include: {
          user: { select: { name: true, email: true } },
        },
      });

      // Update user role to TECHNICIAN
      await prisma.user.update({
        where: { id: data.userId },
        data: { role: 'TECHNICIAN' },
      });

      res.status(201).json({
        success: true,
        message: 'Technician profile created successfully.',
        data: technician,
      });
    } catch (error) {
      console.error('Create technician error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create technician profile.',
      });
    }
  },

  /**
   * PUT /technicians/:id
   * Update a technician profile
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      const updateData: Prisma.TechnicianUpdateInput = {};
      if (data.specialization !== undefined) updateData.specialization = data.specialization;
      if (data.activeZones !== undefined) updateData.activeZones = data.activeZones;
      if (data.certifications !== undefined) updateData.certifications = data.certifications;
      if (data.availability !== undefined) updateData.availability = data.availability;
      if (data.isAvailable !== undefined) updateData.isAvailable = data.isAvailable;
      if (data.teamId !== undefined) {
        updateData.teamMember = data.teamId ? { connect: { id: data.teamId } } : { disconnect: true };
      }

      const technician = await prisma.technician.update({
        where: { id },
        data: updateData,
        include: {
          user: { select: { name: true, email: true } },
        },
      });

      res.status(200).json({
        success: true,
        message: 'Technician updated successfully.',
        data: technician,
      });
    } catch (error) {
      console.error('Update technician error:', error);
      if ((error as { code?: string }).code === 'P2025') {
        res.status(404).json({ success: false, error: 'Technician not found.' });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to update technician.',
      });
    }
  },

  /**
   * DELETE /technicians/:id
   * Deactivate a technician
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const technician = await prisma.technician.update({
        where: { id },
        data: { isAvailable: false },
        select: { id: true, user: { select: { name: true } } },
      });

      res.status(200).json({
        success: true,
        message: 'Technician deactivated successfully.',
        data: technician,
      });
    } catch (error) {
      console.error('Delete technician error:', error);
      if ((error as { code?: string }).code === 'P2025') {
        res.status(404).json({ success: false, error: 'Technician not found.' });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to deactivate technician.',
      });
    }
  },

  /**
   * GET /technicians/:id/schedule
   * Get a technician's upcoming schedule
   */
  async getSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { from, to } = req.query;

      const technician = await prisma.technician.findUnique({ where: { id } });
      if (!technician) {
        res.status(404).json({ success: false, error: 'Technician not found.' });
        return;
      }

      const dateFilter: Prisma.DateTimeFilter = {};
      if (from && typeof from === 'string') {
        dateFilter.gte = new Date(from);
      } else {
        dateFilter.gte = new Date(); // Default: from now
      }
      if (to && typeof to === 'string') {
        dateFilter.lte = new Date(to);
      }

      const schedule = await prisma.serviceVisit.findMany({
        where: {
          technicianId: id,
          scheduledDate: dateFilter,
          status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
        },
        include: {
          plant: {
            select: {
              id: true,
              nickname: true,
              species: { select: { commonName: true } },
              location: {
                select: {
                  id: true,
                  name: true,
                  address: true,
                  client: { select: { companyName: true } },
                },
              },
            },
          },
        },
        orderBy: { scheduledDate: 'asc' },
      });

      res.status(200).json({
        success: true,
        data: {
          technicianId: id,
          availability: technician.availability,
          schedule,
        },
      });
    } catch (error) {
      console.error('Get technician schedule error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch schedule.',
      });
    }
  },

  /**
   * GET /technicians/:id/performance
   * Get performance metrics for a technician
   */
  async getPerformance(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const technician = await prisma.technician.findUnique({
        where: { id },
        include: { user: { select: { name: true } } },
      });
      if (!technician) {
        res.status(404).json({ success: false, error: 'Technician not found.' });
        return;
      }

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const [
        totalVisits,
        completedVisits,
        missedVisits,
        thisMonthVisits,
        lastMonthVisits,
        avgRatingResult,
        avgDurationResult,
        recentRatings,
      ] = await Promise.all([
        prisma.serviceVisit.count({ where: { technicianId: id } }),
        prisma.serviceVisit.count({ where: { technicianId: id, status: 'COMPLETED' } }),
        prisma.serviceVisit.count({ where: { technicianId: id, status: 'MISSED' } }),
        prisma.serviceVisit.count({
          where: { technicianId: id, status: 'COMPLETED', completedDate: { gte: startOfMonth } },
        }),
        prisma.serviceVisit.count({
          where: {
            technicianId: id,
            status: 'COMPLETED',
            completedDate: { gte: startOfLastMonth, lt: startOfMonth },
          },
        }),
        prisma.serviceVisit.aggregate({
          _avg: { rating: true },
          where: { technicianId: id, rating: { not: null } },
        }),
        prisma.serviceVisit.aggregate({
          _avg: { durationMinutes: true },
          where: { technicianId: id, status: 'COMPLETED', durationMinutes: { not: null } },
        }),
        prisma.serviceVisit.findMany({
          where: { technicianId: id, rating: { not: null } },
          orderBy: { completedDate: 'desc' },
          take: 20,
          select: { rating: true, completedDate: true, clientFeedback: true },
        }),
      ]);

      const completionRate = totalVisits > 0 ? (completedVisits / totalVisits) * 100 : 100;
      const monthlyGrowth =
        lastMonthVisits > 0
          ? ((thisMonthVisits - lastMonthVisits) / lastMonthVisits) * 100
          : 0;

      res.status(200).json({
        success: true,
        data: {
          technicianId: id,
          name: technician.user.name,
          totalVisits,
          completedVisits,
          missedVisits,
          thisMonthVisits,
          completionRate: Math.round(completionRate * 10) / 10,
          monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
          averageRating: Math.round((avgRatingResult._avg.rating || 0) * 10) / 10,
          averageDurationMinutes: Math.round(avgDurationResult._avg.durationMinutes || 0),
          overallRating: technician.rating,
          recentRatings,
        },
      });
    } catch (error) {
      console.error('Get technician performance error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch performance metrics.',
      });
    }
  },
};

export default techniciansController;
