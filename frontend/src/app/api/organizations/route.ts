// =============================================================================
// VRIKSHAM API - /api/organizations
// =============================================================================
// GET  - List organizations (filtered by role)
// POST - Create organization (PARTNER or ADMIN only)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Organization, UserRole } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';

// ---------------------------------------------------------------------------
// GET /api/organizations - List organizations
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

    // Build filter based on user role
    const filter: Record<string, unknown> = {};

    if (user.role === UserRole.PARTNER) {
      // PARTNER sees only their client organizations
      filter.partnerId = user._id;
    } else if (user.role === UserRole.USER) {
      // USER sees only their own organization(s)
      filter.userId = user._id;
    }
    // ADMIN sees all organizations

    const status = searchParams.get('status');
    if (status) filter.status = status;

    const type = searchParams.get('type');
    if (type) filter.type = type;

    const search = searchParams.get('search');
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const [organizations, total] = await Promise.all([
      Organization.find(filter)
        .populate('userId', 'name email')
        .populate('partnerId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Organization.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: organizations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + organizations.length < total,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API] GET /api/organizations error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/organizations - Create an organization
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

    if (![UserRole.PARTNER, UserRole.ADMIN].includes(user.role as UserRole)) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions. PARTNER or ADMIN role required.' },
        { status: 403 },
      );
    }

    const body = await req.json();
    const {
      name,
      type,
      email,
      phone,
      address,
      contactPerson,
      gstNumber,
      panNumber,
      contractStartDate,
      contractEndDate,
      notes,
      userId,
    } = body;

    // Validate required fields
    if (!name || !type || !email || !address || !contactPerson) {
      return NextResponse.json(
        { success: false, message: 'name, type, email, address, and contactPerson are required' },
        { status: 400 },
      );
    }

    const organization = await Organization.create({
      name,
      type,
      email,
      phone,
      address,
      contactPerson,
      gstNumber,
      panNumber,
      contractStartDate: contractStartDate ? new Date(contractStartDate) : undefined,
      contractEndDate: contractEndDate ? new Date(contractEndDate) : undefined,
      notes,
      userId: userId || user._id,
      partnerId: user.role === UserRole.PARTNER ? user._id : body.partnerId,
    });

    const populatedOrg = await Organization.findById(organization._id)
      .populate('userId', 'name email')
      .populate('partnerId', 'name email');

    return NextResponse.json(
      { success: true, data: populatedOrg },
      { status: 201 },
    );
  } catch (error) {
    console.error('[API] POST /api/organizations error:', error);

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
