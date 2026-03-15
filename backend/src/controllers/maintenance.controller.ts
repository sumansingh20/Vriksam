import { Request, Response } from 'express';
import prisma from '../config/database';
import { parsePagination, buildPaginatedResponse } from '../types';
import { Prisma } from '@prisma/client';

export const maintenanceController = {
  /**
   * GET /service-visits
   * List all service visits with pagination and filters
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, skip, sortBy, sortOrder } = parsePagination(req.query);
      const { status, type, technicianId, plantId, from, to } = req.query;

      const where: Prisma.ServiceVisitWhereInput = {};

      if (status && typeof status === 'string') {
        where.status = status as Prisma.EnumServiceVisitStatusFilter;
      }

      if (type && typeof type === 'string') {
        where.type = type as Prisma.EnumServiceVisitTypeFilter;
      }

      if (technicianId && typeof technicianId === 'string') {
        where.technicianId = technicianId;
      }

      if (plantId && typeof plantId === 'string') {
        where.plantId = plantId;
      }

      if (from && typeof from === 'string') {
        where.scheduledDate = {
          ...(where.scheduledDate as Prisma.DateTimeFilter || {}),
          gte: new Date(from),
        };
      }

      if (to && typeof to === 'string') {
        where.scheduledDate = {
          ...(where.scheduledDate as Prisma.DateTimeFilter || {}),
          lte: new Date(to),
        };
      }

      // Technicians can only see their own visits
      if (req.user && req.user.role === 'TECHNICIAN') {
        const tech = await prisma.technician.findUnique({
          where: { userId: req.user.id },
          select: { id: true },
        });
        if (tech) {
          where.technicianId = tech.id;
        }
      }

      const [visits, total] = await Promise.all([
        prisma.serviceVisit.findMany({
          where,
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
                    client: { select: { id: true, companyName: true } },
                  },
                },
              },
            },
            technician: {
              select: {
                id: true,
                user: { select: { name: true, phone: true } },
              },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        prisma.serviceVisit.count({ where }),
      ]);

      res.status(200).json({
        success: true,
        ...buildPaginatedResponse(visits, total, page, limit),
      });
    } catch (error) {
      console.error('List service visits error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch service visits.',
      });
    }
  },

  /**
   * GET /service-visits/:id
   * Get a single service visit with details
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const visit = await prisma.serviceVisit.findUnique({
        where: { id },
        include: {
          plant: {
            include: {
              species: true,
              location: {
                include: {
                  client: {
                    select: {
                      id: true,
                      companyName: true,
                      user: { select: { name: true, email: true, phone: true } },
                    },
                  },
                },
              },
            },
          },
          technician: {
            include: {
              user: { select: { name: true, email: true, phone: true } },
            },
          },
        },
      });

      if (!visit) {
        res.status(404).json({
          success: false,
          error: 'Service visit not found.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: visit,
      });
    } catch (error) {
      console.error('Get service visit error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch service visit.',
      });
    }
  },

  /**
   * POST /service-visits
   * Create a new service visit
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      // Validate plant exists
      const plant = await prisma.plant.findUnique({ where: { id: data.plantId } });
      if (!plant) {
        res.status(404).json({ success: false, error: 'Plant not found.' });
        return;
      }

      // Validate technician exists
      const technician = await prisma.technician.findUnique({ where: { id: data.technicianId } });
      if (!technician) {
        res.status(404).json({ success: false, error: 'Technician not found.' });
        return;
      }

      const visit = await prisma.serviceVisit.create({
        data: {
          plantId: data.plantId,
          technicianId: data.technicianId,
          scheduledDate: new Date(data.scheduledDate),
          type: data.type || 'ROUTINE',
          status: 'SCHEDULED',
          notes: data.notes || null,
        },
        include: {
          plant: { select: { nickname: true, species: { select: { commonName: true } } } },
          technician: { select: { user: { select: { name: true } } } },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Service visit scheduled successfully.',
        data: visit,
      });
    } catch (error) {
      console.error('Create service visit error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create service visit.',
      });
    }
  },

  /**
   * PUT /service-visits/:id
   * Update a service visit
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = req.body;

      const updateData: Prisma.ServiceVisitUpdateInput = {};
      if (data.scheduledDate !== undefined) updateData.scheduledDate = new Date(data.scheduledDate);
      if (data.type !== undefined) updateData.type = data.type;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.technicianId !== undefined) {
        updateData.technician = { connect: { id: data.technicianId } };
      }
      if (data.beforeImageUrl !== undefined) updateData.beforeImageUrl = data.beforeImageUrl;
      if (data.afterImageUrl !== undefined) updateData.afterImageUrl = data.afterImageUrl;

      const visit = await prisma.serviceVisit.update({
        where: { id },
        data: updateData,
        include: {
          plant: { select: { nickname: true } },
          technician: { select: { user: { select: { name: true } } } },
        },
      });

      res.status(200).json({
        success: true,
        message: 'Service visit updated successfully.',
        data: visit,
      });
    } catch (error) {
      console.error('Update service visit error:', error);
      if ((error as { code?: string }).code === 'P2025') {
        res.status(404).json({ success: false, error: 'Service visit not found.' });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to update service visit.',
      });
    }
  },

  /**
   * DELETE /service-visits/:id
   * Cancel a service visit
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const visit = await prisma.serviceVisit.update({
        where: { id },
        data: { status: 'CANCELLED' },
        select: { id: true, status: true },
      });

      res.status(200).json({
        success: true,
        message: 'Service visit cancelled.',
        data: visit,
      });
    } catch (error) {
      console.error('Cancel service visit error:', error);
      if ((error as { code?: string }).code === 'P2025') {
        res.status(404).json({ success: false, error: 'Service visit not found.' });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to cancel service visit.',
      });
    }
  },

  /**
   * PUT /service-visits/:id/complete
   * Mark a service visit as completed
   */
  async complete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { notes, beforeImageUrl, afterImageUrl, durationMinutes, rating, clientFeedback } = req.body;

      const visit = await prisma.serviceVisit.findUnique({ where: { id } });
      if (!visit) {
        res.status(404).json({ success: false, error: 'Service visit not found.' });
        return;
      }

      if (visit.status === 'COMPLETED') {
        res.status(400).json({
          success: false,
          error: 'Service visit is already completed.',
        });
        return;
      }

      if (visit.status === 'CANCELLED') {
        res.status(400).json({
          success: false,
          error: 'Cannot complete a cancelled service visit.',
        });
        return;
      }

      const updateData: Prisma.ServiceVisitUpdateInput = {
        status: 'COMPLETED',
        completedDate: new Date(),
      };

      if (notes !== undefined) updateData.notes = notes;
      if (beforeImageUrl !== undefined) updateData.beforeImageUrl = beforeImageUrl;
      if (afterImageUrl !== undefined) updateData.afterImageUrl = afterImageUrl;
      if (durationMinutes !== undefined) updateData.durationMinutes = durationMinutes;
      if (rating !== undefined) updateData.rating = rating;
      if (clientFeedback !== undefined) updateData.clientFeedback = clientFeedback;

      const completedVisit = await prisma.serviceVisit.update({
        where: { id },
        data: updateData,
        include: {
          plant: { select: { id: true, nickname: true } },
          technician: { select: { id: true, user: { select: { name: true } } } },
        },
      });

      // Update the plant's lastMaintenance date
      await prisma.plant.update({
        where: { id: visit.plantId },
        data: { lastMaintenance: new Date() },
      });

      // Update technician's total visits count
      await prisma.technician.update({
        where: { id: visit.technicianId },
        data: { totalVisits: { increment: 1 } },
      });

      // If rating was provided, recalculate technician average rating
      if (rating !== undefined) {
        const avgResult = await prisma.serviceVisit.aggregate({
          _avg: { rating: true },
          where: { technicianId: visit.technicianId, rating: { not: null } },
        });
        if (avgResult._avg.rating !== null) {
          await prisma.technician.update({
            where: { id: visit.technicianId },
            data: { rating: Math.round(avgResult._avg.rating * 10) / 10 },
          });
        }
      }

      res.status(200).json({
        success: true,
        message: 'Service visit completed successfully.',
        data: completedVisit,
      });
    } catch (error) {
      console.error('Complete service visit error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to complete service visit.',
      });
    }
  },

  /**
   * GET /service-visits/schedule
   * Get schedule view (upcoming visits grouped by date)
   */
  async getSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { from, to, technicianId } = req.query;

      const where: Prisma.ServiceVisitWhereInput = {
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      };

      if (from && typeof from === 'string') {
        where.scheduledDate = {
          ...(where.scheduledDate as Prisma.DateTimeFilter || {}),
          gte: new Date(from),
        };
      } else {
        where.scheduledDate = { gte: new Date() };
      }

      if (to && typeof to === 'string') {
        where.scheduledDate = {
          ...(where.scheduledDate as Prisma.DateTimeFilter || {}),
          lte: new Date(to),
        };
      }

      if (technicianId && typeof technicianId === 'string') {
        where.technicianId = technicianId;
      }

      // Technicians see only their own schedule
      if (req.user && req.user.role === 'TECHNICIAN') {
        const tech = await prisma.technician.findUnique({
          where: { userId: req.user.id },
          select: { id: true },
        });
        if (tech) {
          where.technicianId = tech.id;
        }
      }

      const visits = await prisma.serviceVisit.findMany({
        where,
        include: {
          plant: {
            select: {
              id: true,
              nickname: true,
              species: { select: { commonName: true } },
              location: {
                select: {
                  name: true,
                  address: true,
                  client: { select: { companyName: true } },
                },
              },
            },
          },
          technician: {
            select: {
              id: true,
              user: { select: { name: true, phone: true } },
            },
          },
        },
        orderBy: { scheduledDate: 'asc' },
      });

      // Group by date
      const scheduleMap = new Map<string, typeof visits>();
      visits.forEach((visit) => {
        const dateKey = visit.scheduledDate.toISOString().split('T')[0];
        const existing = scheduleMap.get(dateKey) || [];
        existing.push(visit);
        scheduleMap.set(dateKey, existing);
      });

      const schedule = Array.from(scheduleMap.entries()).map(([date, dateVisits]) => ({
        date,
        count: dateVisits.length,
        visits: dateVisits,
      }));

      res.status(200).json({
        success: true,
        data: schedule,
      });
    } catch (error) {
      console.error('Get schedule error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch schedule.',
      });
    }
  },
};

export default maintenanceController;
