import { Request, Response } from 'express';
import prisma from '../config/database';
import { parsePagination, buildPaginatedResponse } from '../types';
import { Prisma } from '@prisma/client';

export const inventoryController = {
  /**
   * GET /inventory
   * List all inventory items with pagination and filters
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, skip, sortBy, sortOrder } = parsePagination(req.query);
      const { search, lowStock, speciesId } = req.query;

      const where: Prisma.InventoryWhereInput = {};

      if (search && typeof search === 'string') {
        where.species = {
          OR: [
            { commonName: { contains: search, mode: 'insensitive' } },
            { scientificName: { contains: search, mode: 'insensitive' } },
          ],
        };
      }

      if (lowStock === 'true') {
        // Use raw condition: quantity <= minStock
        where.AND = [
          {
            quantity: { lte: 0 }, // placeholder; overridden below
          },
        ];
        // For low stock alert, we fetch all and filter, or use a raw query approach
        // Simpler approach: fetch with quantity check
        delete where.AND;
      }

      if (speciesId && typeof speciesId === 'string') {
        where.speciesId = speciesId;
      }

      const [items, total] = await Promise.all([
        prisma.inventory.findMany({
          where,
          include: {
            species: {
              select: {
                id: true,
                commonName: true,
                scientificName: true,
                category: true,
                imageUrl: true,
              },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        prisma.inventory.count({ where }),
      ]);

      // Apply low stock filter in-memory (Prisma doesn't support comparing two columns directly)
      let filteredItems = items;
      if (lowStock === 'true') {
        filteredItems = items.filter((item) => item.quantity <= item.minStock);
      }

      res.status(200).json({
        success: true,
        ...buildPaginatedResponse(
          filteredItems,
          lowStock === 'true' ? filteredItems.length : total,
          page,
          limit
        ),
      });
    } catch (error) {
      console.error('List inventory error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch inventory.',
      });
    }
  },

  /**
   * GET /inventory/:id
   * Get a single inventory item
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const item = await prisma.inventory.findUnique({
        where: { id },
        include: {
          species: true,
        },
      });

      if (!item) {
        res.status(404).json({
          success: false,
          error: 'Inventory item not found.',
        });
        return;
      }

      // Check if low stock
      const isLowStock = item.quantity <= item.minStock;

      res.status(200).json({
        success: true,
        data: {
          ...item,
          isLowStock,
        },
      });
    } catch (error) {
      console.error('Get inventory item error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch inventory item.',
      });
    }
  },

  /**
   * POST /inventory
   * Create a new inventory record
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

      // Check if inventory record already exists for this species
      const existing = await prisma.inventory.findFirst({
        where: { speciesId: data.speciesId },
      });
      if (existing) {
        res.status(409).json({
          success: false,
          error: 'Inventory record already exists for this species. Use restock endpoint to add quantity.',
        });
        return;
      }

      const item = await prisma.inventory.create({
        data: {
          speciesId: data.speciesId,
          quantity: data.quantity || 0,
          cost: data.cost || 0,
          supplier: data.supplier || null,
          supplierPhone: data.supplierPhone || null,
          minStock: data.minStock || 5,
          location: data.location || null,
          notes: data.notes || null,
          lastRestocked: data.quantity > 0 ? new Date() : null,
        },
        include: {
          species: { select: { commonName: true, scientificName: true } },
        },
      });

      res.status(201).json({
        success: true,
        message: 'Inventory record created successfully.',
        data: item,
      });
    } catch (error) {
      console.error('Create inventory error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create inventory record.',
      });
    }
  },

  /**
   * PUT /inventory/:id
   * Update an inventory record
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = req.body;

      const updateData: Prisma.InventoryUpdateInput = {};
      if (data.quantity !== undefined) updateData.quantity = data.quantity;
      if (data.cost !== undefined) updateData.cost = data.cost;
      if (data.supplier !== undefined) updateData.supplier = data.supplier;
      if (data.supplierPhone !== undefined) updateData.supplierPhone = data.supplierPhone;
      if (data.minStock !== undefined) updateData.minStock = data.minStock;
      if (data.location !== undefined) updateData.location = data.location;
      if (data.notes !== undefined) updateData.notes = data.notes;

      const item = await prisma.inventory.update({
        where: { id },
        data: updateData,
        include: {
          species: { select: { commonName: true, scientificName: true } },
        },
      });

      res.status(200).json({
        success: true,
        message: 'Inventory updated successfully.',
        data: item,
      });
    } catch (error) {
      console.error('Update inventory error:', error);
      if ((error as { code?: string }).code === 'P2025') {
        res.status(404).json({ success: false, error: 'Inventory item not found.' });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to update inventory.',
      });
    }
  },

  /**
   * DELETE /inventory/:id
   * Delete an inventory record
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      await prisma.inventory.delete({ where: { id } });

      res.status(200).json({
        success: true,
        message: 'Inventory record deleted successfully.',
      });
    } catch (error) {
      console.error('Delete inventory error:', error);
      if ((error as { code?: string }).code === 'P2025') {
        res.status(404).json({ success: false, error: 'Inventory item not found.' });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to delete inventory record.',
      });
    }
  },

  /**
   * POST /inventory/:id/restock
   * Add stock to an inventory item
   */
  async restock(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { quantity, cost, supplier, notes } = req.body;

      if (!quantity || quantity <= 0) {
        res.status(400).json({
          success: false,
          error: 'Quantity must be a positive number.',
        });
        return;
      }

      const currentItem = await prisma.inventory.findUnique({ where: { id } });
      if (!currentItem) {
        res.status(404).json({ success: false, error: 'Inventory item not found.' });
        return;
      }

      const updateData: Prisma.InventoryUpdateInput = {
        quantity: { increment: quantity },
        lastRestocked: new Date(),
      };

      if (cost !== undefined) updateData.cost = cost;
      if (supplier !== undefined) updateData.supplier = supplier;
      if (notes !== undefined) updateData.notes = notes;

      const item = await prisma.inventory.update({
        where: { id },
        data: updateData,
        include: {
          species: { select: { commonName: true, scientificName: true } },
        },
      });

      res.status(200).json({
        success: true,
        message: `Successfully restocked ${quantity} units. New total: ${item.quantity}.`,
        data: item,
      });
    } catch (error) {
      console.error('Restock error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to restock inventory.',
      });
    }
  },
};

export default inventoryController;
