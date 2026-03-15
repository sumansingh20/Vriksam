// =============================================================================
// VRIKSHAM API - GET /api/analytics
// =============================================================================
// Returns dashboard analytics: total plants, health distribution, revenue,
// maintenance stats. Data scope varies by user role.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import {
  Plant,
  Organization,
  Subscription,
  MaintenanceLog,
  Payment,
  UserRole,
  PlantStatus,
  MaintenanceStatus,
  PaymentStatus,
  SubscriptionStatus,
} from '@/lib/models';
import { getAuthUser } from '@/lib/auth';
import mongoose from 'mongoose';

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

    // Determine scope based on role
    let orgFilter: Record<string, unknown> = {};
    let orgIds: mongoose.Types.ObjectId[] = [];

    if (user.role === UserRole.USER) {
      const orgs = await Organization.find({ userId: user._id }).select('_id');
      orgIds = orgs.map((o) => o._id as mongoose.Types.ObjectId);
      orgFilter = { organizationId: { $in: orgIds } };
    } else if (user.role === UserRole.PARTNER) {
      const orgs = await Organization.find({ partnerId: user._id }).select('_id');
      orgIds = orgs.map((o) => o._id as mongoose.Types.ObjectId);
      orgFilter = { organizationId: { $in: orgIds } };
    }
    // ADMIN: orgFilter stays empty (all data)

    // Run all analytics queries in parallel
    const [
      totalPlants,
      healthDistribution,
      plantsByStatus,
      totalOrganizations,
      activeSubscriptions,
      revenueData,
      maintenanceStats,
      upcomingMaintenance,
      recentPayments,
    ] = await Promise.all([
      // Total plants
      Plant.countDocuments(orgFilter),

      // Health score distribution (aggregation)
      Plant.aggregate([
        ...(orgIds.length > 0 ? [{ $match: { organizationId: { $in: orgIds } } }] : []),
        {
          $bucket: {
            groupBy: '$healthScore',
            boundaries: [0, 30, 50, 70, 90, 101],
            default: 'unknown',
            output: {
              count: { $sum: 1 },
              avgScore: { $avg: '$healthScore' },
            },
          },
        },
      ]),

      // Plants by status
      Plant.aggregate([
        ...(orgIds.length > 0 ? [{ $match: { organizationId: { $in: orgIds } } }] : []),
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // Total organizations
      user.role === UserRole.ADMIN
        ? Organization.countDocuments({})
        : user.role === UserRole.PARTNER
          ? Organization.countDocuments({ partnerId: user._id })
          : Organization.countDocuments({ userId: user._id }),

      // Active subscriptions
      Subscription.countDocuments({
        ...orgFilter,
        status: SubscriptionStatus.ACTIVE,
      }),

      // Revenue (completed payments)
      Payment.aggregate([
        {
          $match: {
            ...(orgIds.length > 0 ? { organizationId: { $in: orgIds } } : {}),
            status: PaymentStatus.COMPLETED,
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),

      // Maintenance stats
      MaintenanceLog.aggregate([
        ...(orgIds.length > 0 ? [{ $match: { organizationId: { $in: orgIds } } }] : []),
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),

      // Upcoming maintenance (next 7 days)
      MaintenanceLog.find({
        ...orgFilter,
        status: MaintenanceStatus.SCHEDULED,
        scheduledDate: {
          $gte: new Date(),
          $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      })
        .populate('plantId', 'plantId name')
        .populate('locationId', 'name')
        .populate('technicianId', 'name')
        .sort({ scheduledDate: 1 })
        .limit(10)
        .lean(),

      // Recent payments
      Payment.find({
        ...(orgIds.length > 0 ? { organizationId: { $in: orgIds } } : {}),
      })
        .populate('organizationId', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    // Format health distribution into labeled ranges
    const healthRanges = [
      { label: 'Critical (0-29)', min: 0 },
      { label: 'Poor (30-49)', min: 30 },
      { label: 'Fair (50-69)', min: 50 },
      { label: 'Good (70-89)', min: 70 },
      { label: 'Excellent (90-100)', min: 90 },
    ];

    const formattedHealthDist = healthRanges.map((range) => {
      const bucket = healthDistribution.find(
        (b: { _id: number | string }) => b._id === range.min,
      );
      return {
        range: range.label,
        count: bucket?.count || 0,
        avgScore: bucket?.avgScore ? Math.round(bucket.avgScore) : 0,
      };
    });

    // Format status distribution
    const statusCounts: Record<string, number> = {};
    plantsByStatus.forEach((s: { _id: string; count: number }) => {
      statusCounts[s._id] = s.count;
    });

    // Format maintenance stats
    const maintenanceCounts: Record<string, number> = {};
    maintenanceStats.forEach((s: { _id: string; count: number }) => {
      maintenanceCounts[s._id] = s.count;
    });

    const revenue = revenueData[0] || { totalRevenue: 0, count: 0 };

    // Compute average health score
    const avgHealthResult = await Plant.aggregate([
      ...(orgIds.length > 0 ? [{ $match: { organizationId: { $in: orgIds } } }] : []),
      { $group: { _id: null, avgHealth: { $avg: '$healthScore' } } },
    ]);
    const averageHealthScore = avgHealthResult[0]?.avgHealth
      ? Math.round(avgHealthResult[0].avgHealth)
      : 0;

    return NextResponse.json(
      {
        success: true,
        data: {
          overview: {
            totalPlants,
            totalOrganizations,
            activeSubscriptions,
            averageHealthScore,
          },
          plants: {
            statusDistribution: statusCounts,
            healthDistribution: formattedHealthDist,
            healthy: statusCounts[PlantStatus.HEALTHY] || 0,
            needsAttention: statusCounts[PlantStatus.NEEDS_ATTENTION] || 0,
            critical: statusCounts[PlantStatus.CRITICAL] || 0,
          },
          revenue: {
            total: revenue.totalRevenue,
            transactionCount: revenue.count,
          },
          maintenance: {
            statusBreakdown: maintenanceCounts,
            scheduled: maintenanceCounts[MaintenanceStatus.SCHEDULED] || 0,
            completed: maintenanceCounts[MaintenanceStatus.COMPLETED] || 0,
            inProgress: maintenanceCounts[MaintenanceStatus.IN_PROGRESS] || 0,
            upcoming: upcomingMaintenance,
          },
          recentPayments,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API] GET /api/analytics error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
