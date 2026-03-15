// =============================================================================
// VRIKSHAM API - /api/plants
// =============================================================================
// GET  - List plants with pagination and filters
// POST - Create a new plant (auth required, PARTNER or ADMIN only)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Plant, Organization, UserRole } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';

// ---------------------------------------------------------------------------
// GET /api/plants - List plants with pagination & filters
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    // Build filter
    const filter: Record<string, unknown> = {};

    const status = searchParams.get('status');
    if (status) filter.status = status;

    const locationId = searchParams.get('locationId');
    if (locationId) filter.locationId = locationId;

    const organizationId = searchParams.get('organizationId');
    if (organizationId) filter.organizationId = organizationId;

    const search = searchParams.get('search');
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { plantId: { $regex: search, $options: 'i' } },
      ];
    }

    // Optional: scope by role if auth is provided
    const user = await getAuthUser(req);
    if (user) {
      if (user.role === UserRole.USER) {
        // USER sees only plants in their organization(s)
        const orgs = await Organization.find({ userId: user._id }).select('_id');
        const orgIds = orgs.map((o: { _id: unknown }) => o._id);
        if (orgIds.length > 0) {
          filter.organizationId = { $in: orgIds };
        }
      } else if (user.role === UserRole.PARTNER) {
        // PARTNER sees plants in orgs they manage
        const orgs = await Organization.find({ partnerId: user._id }).select('_id');
        const orgIds = orgs.map((o: { _id: unknown }) => o._id);
        if (orgIds.length > 0 && !organizationId) {
          filter.organizationId = { $in: orgIds };
        }
      }
      // ADMIN sees all
    }

    const [plants, total] = await Promise.all([
      Plant.find(filter)
        .populate('species', 'commonName scientificName category imageUrl')
        .populate('locationId', 'name type floor')
        .populate('organizationId', 'name type')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Plant.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: plants,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + plants.length < total,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API] GET /api/plants error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/plants - Create a new plant
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 },
      );
    }

    // Only PARTNER or ADMIN can create plants
    if (![UserRole.PARTNER, UserRole.ADMIN].includes(user.role as UserRole)) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions. PARTNER or ADMIN role required.' },
        { status: 403 },
      );
    }

    const body = await req.json();
    const {
      name,
      species,
      locationId,
      organizationId,
      healthScore,
      status,
      growthStage,
      placement,
      installedDate,
      notes,
    } = body;

    // Validate required fields
    if (!name || !species || !locationId || !organizationId) {
      return NextResponse.json(
        { success: false, message: 'name, species, locationId, and organizationId are required' },
        { status: 400 },
      );
    }

    const plant = await Plant.create({
      name,
      species,
      locationId,
      organizationId,
      healthScore: healthScore ?? 85,
      status: status || 'HEALTHY',
      growthStage: growthStage || 'MATURE',
      placement: placement || 'FLOOR',
      installedDate: installedDate ? new Date(installedDate) : new Date(),
      notes,
    });

    // Populate references for the response
    const populatedPlant = await Plant.findById(plant._id)
      .populate('species', 'commonName scientificName category')
      .populate('locationId', 'name type')
      .populate('organizationId', 'name type');

    return NextResponse.json(
      {
        success: true,
        data: populatedPlant,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[API] POST /api/plants error:', error);

    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
