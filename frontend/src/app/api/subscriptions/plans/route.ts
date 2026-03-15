// =============================================================================
// VRIKSHAM API - GET /api/subscriptions/plans
// =============================================================================
// Returns all active subscription plans. Public route (no auth required).
// =============================================================================

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { SubscriptionPlan } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();

    const plans = await SubscriptionPlan.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: plans,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API] GET /api/subscriptions/plans error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
