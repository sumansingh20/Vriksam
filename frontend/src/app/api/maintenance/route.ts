// =============================================================================
// VRIKSHAM API - /api/maintenance
// =============================================================================
// GET  - List maintenance logs with filters
// POST - Schedule a new maintenance visit
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { MaintenanceLog, Organization, UserRole } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';

// ---------------------------------------------------------------------------
// GET /api/maintenance - List maintenance logs
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

    // Scope by role
    if (user.role === UserRole.USER) {
      const orgs = await Organization.find({ userId: user._id }).select('_id');
      const orgIds = orgs.map((o: { _id: unknown }) => o._id);
      filter.organizationId = { $in: orgIds };
    } else if (user.role === UserRole.PARTNER) {
      const orgs = await Organization.find({ partnerId: user._id }).select('_id');
      const orgIds = orgs.map((o: { _id: unknown }) => o._id);
      filter.organizationId = { $in: orgIds };
    }
    // ADMIN sees all

    // Optional filters
    const status = searchParams.get('status');
    if (status) filter.status = status;

    const type = searchParams.get('type');
    if (type) filter.type = type;

    const organizationId = searchParams.get('organizationId');
    if (organizationId) filter.organizationId = organizationId;

    const plantId = searchParams.get('plantId');
    if (plantId) filter.plantId = plantId;

    const technicianId = searchParams.get('technicianId');
    if (technicianId) filter.technicianId = technicianId;

    // Date range filter
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    if (dateFrom || dateTo) {
      filter.scheduledDate = {};
      if (dateFrom) (filter.scheduledDate as Record<string, unknown>).$gte = new Date(dateFrom);
      if (dateTo) (filter.scheduledDate as Record<string, unknown>).$lte = new Date(dateTo);
    }

    const [logs, total] = await Promise.all([
      MaintenanceLog.find(filter)
        .populate('plantId', 'plantId name status healthScore')
        .populate('locationId', 'name type')
        .populate('organizationId', 'name')
        .populate('technicianId', 'name email phone')
        .sort({ scheduledDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      MaintenanceLog.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + logs.length < total,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API] GET /api/maintenance error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/maintenance - Schedule a new maintenance visit
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
      plantId,
      locationId,
      organizationId,
      technicianId,
      type,
      scheduledDate,
      tasks,
      notes,
    } = body;

    // Validate required fields
    if (!plantId || !locationId || !organizationId || !technicianId || !type || !scheduledDate) {
      return NextResponse.json(
        {
          success: false,
          message: 'plantId, locationId, organizationId, technicianId, type, and scheduledDate are required',
        },
        { status: 400 },
      );
    }

    const maintenanceLog = await MaintenanceLog.create({
      plantId,
      locationId,
      organizationId,
      technicianId,
      partnerId: user.role === UserRole.PARTNER ? user._id : body.partnerId,
      type,
      status: 'SCHEDULED',
      scheduledDate: new Date(scheduledDate),
      tasks: tasks || [],
      notes,
    });

    const populatedLog = await MaintenanceLog.findById(maintenanceLog._id)
      .populate('plantId', 'plantId name status')
      .populate('locationId', 'name type')
      .populate('organizationId', 'name')
      .populate('technicianId', 'name email');

    return NextResponse.json(
      { success: true, data: populatedLog },
      { status: 201 },
    );
  } catch (error) {
    console.error('[API] POST /api/maintenance error:', error);

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
