// =============================================================================
// VRIKSHAM API - /api/plants/[id]
// =============================================================================
// GET    - Get a single plant by ID with populated references
// PUT    - Update a plant (auth required)
// DELETE - Delete a plant (ADMIN only)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Plant, UserRole } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';
import mongoose from 'mongoose';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ---------------------------------------------------------------------------
// GET /api/plants/[id] - Get single plant
// ---------------------------------------------------------------------------
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid plant ID format' },
        { status: 400 },
      );
    }

    const plant = await Plant.findById(id)
      .populate('species')
      .populate('locationId')
      .populate('organizationId', 'name type email phone address contactPerson');

    if (!plant) {
      return NextResponse.json(
        { success: false, message: 'Plant not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: plant },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API] GET /api/plants/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// PUT /api/plants/[id] - Update plant
// ---------------------------------------------------------------------------
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid plant ID format' },
        { status: 400 },
      );
    }

    const body = await req.json();

    // Prevent changing immutable fields
    delete body._id;
    delete body.plantId;
    delete body.createdAt;

    const plant = await Plant.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true },
    )
      .populate('species', 'commonName scientificName category')
      .populate('locationId', 'name type')
      .populate('organizationId', 'name type');

    if (!plant) {
      return NextResponse.json(
        { success: false, message: 'Plant not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: plant },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API] PUT /api/plants/[id] error:', error);

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

// ---------------------------------------------------------------------------
// DELETE /api/plants/[id] - Delete plant (ADMIN only)
// ---------------------------------------------------------------------------
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 },
      );
    }

    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions. ADMIN role required.' },
        { status: 403 },
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid plant ID format' },
        { status: 400 },
      );
    }

    const plant = await Plant.findByIdAndDelete(id);

    if (!plant) {
      return NextResponse.json(
        { success: false, message: 'Plant not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: 'Plant deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API] DELETE /api/plants/[id] error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
