// =============================================================================
// VRIKSHAM API - /api/notifications
// =============================================================================
// GET   - List notifications for the current user
// PATCH - Mark notification(s) as read
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Notification } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';
import mongoose from 'mongoose';

// ---------------------------------------------------------------------------
// GET /api/notifications - List current user's notifications
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

    const filter: Record<string, unknown> = { userId: user._id };

    // Optional filters
    const isRead = searchParams.get('isRead');
    if (isRead !== null && isRead !== undefined && isRead !== '') {
      filter.isRead = isRead === 'true';
    }

    const type = searchParams.get('type');
    if (type) filter.type = type;

    const priority = searchParams.get('priority');
    if (priority) filter.priority = priority;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ userId: user._id, isRead: false }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: notifications,
        unreadCount,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + notifications.length < total,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API] GET /api/notifications error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/notifications - Mark notification(s) as read
// ---------------------------------------------------------------------------
export async function PATCH(req: NextRequest) {
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
    const { notificationIds, markAllRead } = body;

    if (markAllRead) {
      // Mark all of the user's unread notifications as read
      const result = await Notification.updateMany(
        { userId: user._id, isRead: false },
        { $set: { isRead: true, readAt: new Date() } },
      );

      return NextResponse.json(
        {
          success: true,
          message: `Marked ${result.modifiedCount} notifications as read`,
          modifiedCount: result.modifiedCount,
        },
        { status: 200 },
      );
    }

    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'notificationIds array or markAllRead flag is required' },
        { status: 400 },
      );
    }

    // Validate all IDs
    const validIds = notificationIds.filter((id: string) => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid notification IDs provided' },
        { status: 400 },
      );
    }

    // Mark specific notifications as read (only if they belong to the current user)
    const result = await Notification.updateMany(
      {
        _id: { $in: validIds },
        userId: user._id,
      },
      { $set: { isRead: true, readAt: new Date() } },
    );

    return NextResponse.json(
      {
        success: true,
        message: `Marked ${result.modifiedCount} notifications as read`,
        modifiedCount: result.modifiedCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API] PATCH /api/notifications error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
