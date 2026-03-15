// =============================================================================
// VRIKSHAM API - /api/marketplace/cart
// =============================================================================
// POST - Cart operations (add, remove, update quantity)
//        Optional authentication: logged-in users can have a persisted cart
//        in the future. For now, validates the request and returns success.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PlantSpecies } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';
import mongoose from 'mongoose';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CartAction = 'add' | 'remove' | 'update';

interface CartRequestBody {
  action: CartAction;
  plantId: string;
  quantity?: number;
}

const VALID_ACTIONS: CartAction[] = ['add', 'remove', 'update'];

// ---------------------------------------------------------------------------
// POST /api/marketplace/cart - Cart operations
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Optional auth — logged-in users could get a persisted cart in the future
    const user = await getAuthUser(req);

    // Parse and validate request body
    let body: CartRequestBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    const { action, plantId, quantity } = body;

    // Validate action
    if (!action || !VALID_ACTIONS.includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid action. Must be one of: ${VALID_ACTIONS.join(', ')}`,
        },
        { status: 400 },
      );
    }

    // Validate plantId
    if (!plantId) {
      return NextResponse.json(
        { success: false, message: 'plantId is required' },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(plantId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid plantId format' },
        { status: 400 },
      );
    }

    // Validate quantity for add/update actions
    if (action === 'add' || action === 'update') {
      const qty = quantity ?? 1;
      if (!Number.isInteger(qty) || qty < 1) {
        return NextResponse.json(
          { success: false, message: 'Quantity must be a positive integer' },
          { status: 400 },
        );
      }
    }

    // Verify the plant species exists and is active
    const species = await PlantSpecies.findOne({
      _id: plantId,
      isActive: true,
    })
      .select('_id commonName')
      .lean();

    if (!species) {
      return NextResponse.json(
        { success: false, message: 'Plant not found or is no longer available' },
        { status: 404 },
      );
    }

    // For now, return success with the validated data.
    // Future: persist cart to a Cart collection keyed by user._id or session.
    return NextResponse.json(
      {
        success: true,
        message: `Cart ${action} successful`,
        data: {
          action,
          plantId,
          quantity: action === 'remove' ? undefined : (quantity ?? 1),
          authenticated: !!user,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API] POST /api/marketplace/cart error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
