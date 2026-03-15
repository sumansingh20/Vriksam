// =============================================================================
// VRIKSHAM API - /api/subscriptions
// =============================================================================
// GET  - List subscriptions (scoped by role)
// POST - Create a new subscription
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Subscription, Organization, UserRole } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';

// ---------------------------------------------------------------------------
// GET /api/subscriptions - List subscriptions
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    // Scope based on role
    if (user.role === UserRole.USER) {
      // Get user's organizations
      const orgs = await Organization.find({ userId: user._id }).select('_id');
      const orgIds = orgs.map((o: { _id: unknown }) => o._id);
      filter.organizationId = { $in: orgIds };
    } else if (user.role === UserRole.PARTNER) {
      // Get partner's client organizations
      const orgs = await Organization.find({ partnerId: user._id }).select('_id');
      const orgIds = orgs.map((o: { _id: unknown }) => o._id);
      filter.organizationId = { $in: orgIds };
    }
    // ADMIN sees all

    const status = searchParams.get('status');
    if (status) filter.status = status;

    const organizationId = searchParams.get('organizationId');
    if (organizationId) filter.organizationId = organizationId;

    const [subscriptions, total] = await Promise.all([
      Subscription.find(filter)
        .populate('organizationId', 'name type')
        .populate('planId', 'name tier price features')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Subscription.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: subscriptions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + subscriptions.length < total,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API] GET /api/subscriptions error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/subscriptions - Create a subscription
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

    const body = await req.json();
    const {
      organizationId,
      planId,
      billingCycle,
      startDate,
      endDate,
      nextBillingDate,
      amount,
      currency,
      autoRenew,
    } = body;

    // Validate required fields
    if (!organizationId || !planId || !billingCycle || !startDate || !nextBillingDate || amount === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: 'organizationId, planId, billingCycle, startDate, nextBillingDate, and amount are required',
        },
        { status: 400 },
      );
    }

    const subscription = await Subscription.create({
      organizationId,
      planId,
      billingCycle,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      nextBillingDate: new Date(nextBillingDate),
      amount,
      currency: currency || 'INR',
      autoRenew: autoRenew !== undefined ? autoRenew : true,
    });

    const populatedSub = await Subscription.findById(subscription._id)
      .populate('organizationId', 'name type')
      .populate('planId', 'name tier price features');

    return NextResponse.json(
      { success: true, data: populatedSub },
      { status: 201 },
    );
  } catch (error) {
    console.error('[API] POST /api/subscriptions error:', error);

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
