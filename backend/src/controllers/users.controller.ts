import { Request, Response } from 'express';
import prisma from '../config/database';
import { parsePagination, buildPaginatedResponse } from '../types';
import { Prisma } from '@prisma/client';

export const usersController = {
  /**
   * GET /users
   * List all users with pagination, search, and filtering
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, skip, sortBy, sortOrder } = parsePagination(req.query);
      const { search, role, isActive } = req.query;

      const where: Prisma.UserWhereInput = {};

      if (search && typeof search === 'string') {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (role && typeof role === 'string') {
        where.role = role as Prisma.EnumUserRoleFilter;
      }

      if (isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            avatar: true,
            phone: true,
            isActive: true,
            lastLogin: true,
            createdAt: true,
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        prisma.user.count({ where }),
      ]);

      res.status(200).json({
        success: true,
        ...buildPaginatedResponse(users, total, page, limit),
      });
    } catch (error) {
      console.error('List users error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users.',
      });
    }
  },

  /**
   * GET /users/:id
   * Get a single user by ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          phone: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
          client: {
            select: {
              id: true,
              companyName: true,
              type: true,
              status: true,
              city: true,
              state: true,
            },
          },
          technician: {
            select: {
              id: true,
              specialization: true,
              rating: true,
              totalVisits: true,
              isAvailable: true,
              activeZones: true,
              certifications: true,
            },
          },
        },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user.',
      });
    }
  },

  /**
   * PUT /users/:id
   * Update a user by ID
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, phone, avatar, isActive } = req.body;

      // Users can only update themselves unless they're admin
      if (req.user && req.user.id !== id && req.user.role !== 'ADMIN') {
        res.status(403).json({
          success: false,
          error: 'You can only update your own profile.',
        });
        return;
      }

      const updateData: Prisma.UserUpdateInput = {};
      if (name !== undefined) updateData.name = name;
      if (phone !== undefined) updateData.phone = phone;
      if (avatar !== undefined) updateData.avatar = avatar;
      // Only admins can toggle isActive
      if (isActive !== undefined && req.user?.role === 'ADMIN') {
        updateData.isActive = isActive;
      }

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          phone: true,
          isActive: true,
          updatedAt: true,
        },
      });

      res.status(200).json({
        success: true,
        message: 'User updated successfully.',
        data: user,
      });
    } catch (error) {
      console.error('Update user error:', error);
      if ((error as { code?: string }).code === 'P2025') {
        res.status(404).json({
          success: false,
          error: 'User not found.',
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to update user.',
      });
    }
  },

  /**
   * DELETE /users/:id
   * Soft-delete a user by deactivating their account (admin only)
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Prevent self-deletion
      if (req.user && req.user.id === id) {
        res.status(400).json({
          success: false,
          error: 'You cannot delete your own account.',
        });
        return;
      }

      const user = await prisma.user.update({
        where: { id },
        data: { isActive: false },
        select: { id: true, email: true, name: true },
      });

      res.status(200).json({
        success: true,
        message: 'User deactivated successfully.',
        data: user,
      });
    } catch (error) {
      console.error('Delete user error:', error);
      if ((error as { code?: string }).code === 'P2025') {
        res.status(404).json({
          success: false,
          error: 'User not found.',
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to delete user.',
      });
    }
  },
};

export default usersController;
