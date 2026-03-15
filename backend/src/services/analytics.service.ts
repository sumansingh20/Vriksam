import prisma from '../config/database';

export const analyticsService = {
  /**
   * Get overview statistics for the admin dashboard
   */
  async getOverviewStats(): Promise<{
    totalClients: number;
    activeClients: number;
    totalPlants: number;
    healthyPlants: number;
    criticalPlants: number;
    totalTechnicians: number;
    activeTechnicians: number;
    pendingVisits: number;
    completedVisitsThisMonth: number;
    monthlyRevenue: number;
    pendingInvoices: number;
  }> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalClients,
      activeClients,
      totalPlants,
      healthyPlants,
      criticalPlants,
      totalTechnicians,
      activeTechnicians,
      pendingVisits,
      completedVisitsThisMonth,
      monthlyRevenueResult,
      pendingInvoices,
    ] = await Promise.all([
      prisma.client.count(),
      prisma.client.count({ where: { status: 'ACTIVE' } }),
      prisma.plant.count({ where: { isActive: true } }),
      prisma.plant.count({ where: { isActive: true, status: 'HEALTHY' } }),
      prisma.plant.count({ where: { isActive: true, status: 'CRITICAL' } }),
      prisma.technician.count(),
      prisma.technician.count({ where: { isAvailable: true } }),
      prisma.serviceVisit.count({ where: { status: 'SCHEDULED' } }),
      prisma.serviceVisit.count({
        where: {
          status: 'COMPLETED',
          completedDate: { gte: startOfMonth },
        },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'SUCCESS',
          paidAt: { gte: startOfMonth },
        },
      }),
      prisma.invoice.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      totalClients,
      activeClients,
      totalPlants,
      healthyPlants,
      criticalPlants,
      totalTechnicians,
      activeTechnicians,
      pendingVisits,
      completedVisitsThisMonth,
      monthlyRevenue: monthlyRevenueResult._sum.amount || 0,
      pendingInvoices,
    };
  },

  /**
   * Get plant health metrics and distribution
   */
  async getPlantMetrics(): Promise<{
    statusDistribution: Record<string, number>;
    speciesDistribution: Array<{ species: string; count: number }>;
    averageHealthScore: number;
    survivalRate: number;
    plantsByLocation: Array<{ location: string; count: number }>;
    recentHealthTrend: Array<{ date: string; avgScore: number }>;
  }> {
    // Status distribution
    const statusGroups = await prisma.plant.groupBy({
      by: ['status'],
      _count: { id: true },
      where: { isActive: true },
    });

    const statusDistribution: Record<string, number> = {};
    statusGroups.forEach((g) => {
      statusDistribution[g.status] = g._count.id;
    });

    // Species distribution (top 10)
    const speciesGroupsRaw = await prisma.plant.groupBy({
      by: ['speciesId'],
      _count: { id: true },
      where: { isActive: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    const speciesIds = speciesGroupsRaw.map((g) => g.speciesId);
    const speciesNames = await prisma.plantSpecies.findMany({
      where: { id: { in: speciesIds } },
      select: { id: true, commonName: true },
    });
    const speciesMap = new Map(speciesNames.map((s) => [s.id, s.commonName]));

    const speciesDistribution = speciesGroupsRaw.map((g) => ({
      species: speciesMap.get(g.speciesId) || 'Unknown',
      count: g._count.id,
    }));

    // Average health score from recent logs
    const avgHealthResult = await prisma.plantHealthLog.aggregate({
      _avg: { healthScore: true },
      where: {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    });

    // Survival rate: active plants / total plants ever
    const totalPlantsEver = await prisma.plant.count();
    const activePlants = await prisma.plant.count({ where: { isActive: true } });
    const survivalRate = totalPlantsEver > 0 ? (activePlants / totalPlantsEver) * 100 : 100;

    // Plants by location (top 10)
    const locationGroupsRaw = await prisma.plant.groupBy({
      by: ['locationId'],
      _count: { id: true },
      where: { isActive: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    const locationIds = locationGroupsRaw.map((g) => g.locationId);
    const locationNames = await prisma.location.findMany({
      where: { id: { in: locationIds } },
      select: { id: true, name: true },
    });
    const locationMap = new Map(locationNames.map((l) => [l.id, l.name]));

    const plantsByLocation = locationGroupsRaw.map((g) => ({
      location: locationMap.get(g.locationId) || 'Unknown',
      count: g._count.id,
    }));

    // Recent health trend (daily average for last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const healthLogs = await prisma.plantHealthLog.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { healthScore: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const dailyScores = new Map<string, { total: number; count: number }>();
    healthLogs.forEach((log) => {
      const dateKey = log.createdAt.toISOString().split('T')[0];
      const entry = dailyScores.get(dateKey) || { total: 0, count: 0 };
      entry.total += log.healthScore;
      entry.count += 1;
      dailyScores.set(dateKey, entry);
    });

    const recentHealthTrend = Array.from(dailyScores.entries()).map(([date, data]) => ({
      date,
      avgScore: Math.round((data.total / data.count) * 10) / 10,
    }));

    return {
      statusDistribution,
      speciesDistribution,
      averageHealthScore: Math.round((avgHealthResult._avg.healthScore || 0) * 10) / 10,
      survivalRate: Math.round(survivalRate * 10) / 10,
      plantsByLocation,
      recentHealthTrend,
    };
  },

  /**
   * Get revenue analytics and breakdown
   */
  async getRevenueMetrics(period: 'monthly' | 'quarterly' | 'yearly' = 'monthly'): Promise<{
    totalRevenue: number;
    periodRevenue: number;
    revenueGrowth: number;
    revenueTrend: Array<{ period: string; revenue: number }>;
    revenueByPlan: Array<{ plan: string; revenue: number }>;
    outstandingAmount: number;
    collectionRate: number;
  }> {
    const now = new Date();
    let periodStart: Date;
    let previousPeriodStart: Date;

    switch (period) {
      case 'quarterly':
        periodStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        previousPeriodStart = new Date(periodStart);
        previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 3);
        break;
      case 'yearly':
        periodStart = new Date(now.getFullYear(), 0, 1);
        previousPeriodStart = new Date(now.getFullYear() - 1, 0, 1);
        break;
      default: // monthly
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    }

    const [totalRevenueResult, periodRevenueResult, previousPeriodRevenueResult, outstandingResult] =
      await Promise.all([
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: 'SUCCESS' },
        }),
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            status: 'SUCCESS',
            paidAt: { gte: periodStart },
          },
        }),
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            status: 'SUCCESS',
            paidAt: { gte: previousPeriodStart, lt: periodStart },
          },
        }),
        prisma.invoice.aggregate({
          _sum: { total: true },
          where: { status: { in: ['PENDING', 'OVERDUE'] } },
        }),
      ]);

    const totalRevenue = totalRevenueResult._sum.amount || 0;
    const periodRevenue = periodRevenueResult._sum.amount || 0;
    const previousPeriodRevenue = previousPeriodRevenueResult._sum.amount || 0;
    const revenueGrowth =
      previousPeriodRevenue > 0
        ? ((periodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
        : 0;

    // Revenue by plan
    const invoicesWithPlans = await prisma.invoice.findMany({
      where: {
        status: 'PAID',
        subscription: { isNot: null },
      },
      select: {
        total: true,
        subscription: {
          select: {
            plan: { select: { name: true } },
          },
        },
      },
    });

    const planRevenueMap = new Map<string, number>();
    invoicesWithPlans.forEach((inv) => {
      const planName = inv.subscription?.plan?.name || 'Other';
      planRevenueMap.set(planName, (planRevenueMap.get(planName) || 0) + inv.total);
    });

    const revenueByPlan = Array.from(planRevenueMap.entries())
      .map(([plan, revenue]) => ({ plan, revenue }))
      .sort((a, b) => b.revenue - a.revenue);

    // Revenue trend (last 12 months)
    const revenueTrend: Array<{ period: string; revenue: number }> = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthResult = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'SUCCESS',
          paidAt: { gte: monthStart, lt: monthEnd },
        },
      });
      revenueTrend.push({
        period: monthStart.toISOString().substring(0, 7),
        revenue: monthResult._sum.amount || 0,
      });
    }

    // Collection rate
    const totalInvoiced = await prisma.invoice.aggregate({
      _sum: { total: true },
    });
    const totalPaid = await prisma.invoice.aggregate({
      _sum: { total: true },
      where: { status: 'PAID' },
    });
    const collectionRate =
      (totalInvoiced._sum.total || 0) > 0
        ? ((totalPaid._sum.total || 0) / (totalInvoiced._sum.total || 1)) * 100
        : 100;

    return {
      totalRevenue,
      periodRevenue,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      revenueTrend,
      revenueByPlan,
      outstandingAmount: outstandingResult._sum.total || 0,
      collectionRate: Math.round(collectionRate * 10) / 10,
    };
  },

  /**
   * Get maintenance efficiency metrics
   */
  async getMaintenanceMetrics(): Promise<{
    totalVisitsThisMonth: number;
    completionRate: number;
    averageDuration: number;
    averageRating: number;
    visitsByType: Record<string, number>;
    visitsByStatus: Record<string, number>;
    topTechnicians: Array<{ name: string; visits: number; rating: number }>;
    missedVisitRate: number;
  }> {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [
      totalVisitsThisMonth,
      completedThisMonth,
      missedThisMonth,
      avgDurationResult,
      avgRatingResult,
    ] = await Promise.all([
      prisma.serviceVisit.count({
        where: { scheduledDate: { gte: startOfMonth } },
      }),
      prisma.serviceVisit.count({
        where: {
          status: 'COMPLETED',
          completedDate: { gte: startOfMonth },
        },
      }),
      prisma.serviceVisit.count({
        where: {
          status: 'MISSED',
          scheduledDate: { gte: startOfMonth },
        },
      }),
      prisma.serviceVisit.aggregate({
        _avg: { durationMinutes: true },
        where: { status: 'COMPLETED' },
      }),
      prisma.serviceVisit.aggregate({
        _avg: { rating: true },
        where: { rating: { not: null } },
      }),
    ]);

    const completionRate = totalVisitsThisMonth > 0
      ? (completedThisMonth / totalVisitsThisMonth) * 100
      : 100;

    const missedVisitRate = totalVisitsThisMonth > 0
      ? (missedThisMonth / totalVisitsThisMonth) * 100
      : 0;

    // Visits by type
    const typeGroups = await prisma.serviceVisit.groupBy({
      by: ['type'],
      _count: { id: true },
    });
    const visitsByType: Record<string, number> = {};
    typeGroups.forEach((g) => { visitsByType[g.type] = g._count.id; });

    // Visits by status
    const statusGroups = await prisma.serviceVisit.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    const visitsByStatus: Record<string, number> = {};
    statusGroups.forEach((g) => { visitsByStatus[g.status] = g._count.id; });

    // Top technicians
    const topTechs = await prisma.technician.findMany({
      orderBy: { totalVisits: 'desc' },
      take: 10,
      select: {
        rating: true,
        totalVisits: true,
        user: { select: { name: true } },
      },
    });

    const topTechnicians = topTechs.map((t) => ({
      name: t.user.name,
      visits: t.totalVisits,
      rating: t.rating,
    }));

    return {
      totalVisitsThisMonth,
      completionRate: Math.round(completionRate * 10) / 10,
      averageDuration: Math.round(avgDurationResult._avg.durationMinutes || 0),
      averageRating: Math.round((avgRatingResult._avg.rating || 0) * 10) / 10,
      visitsByType,
      visitsByStatus,
      topTechnicians,
      missedVisitRate: Math.round(missedVisitRate * 10) / 10,
    };
  },

  /**
   * Calculate ESG (Environmental, Social, Governance) metrics
   * Based on plant species data (CO2 absorption, O2 production, air purifying scores)
   */
  async getESGMetrics(): Promise<{
    totalCO2Absorbed: number;
    totalO2Produced: number;
    averageAirPurifyingScore: number;
    greenScore: number;
    totalActivePlants: number;
    speciesWithHighAirPurifying: number;
    carbonOffsetEquivalent: number;
    environmentalImpactSummary: string;
  }> {
    const activePlants = await prisma.plant.findMany({
      where: { isActive: true },
      select: {
        species: {
          select: {
            co2AbsorptionRate: true,
            oxygenProductionRate: true,
            airPurifyingScore: true,
          },
        },
      },
    });

    let totalCO2 = 0;
    let totalO2 = 0;
    let totalAirScore = 0;
    let highPurifying = 0;

    activePlants.forEach((p) => {
      totalCO2 += p.species.co2AbsorptionRate;
      totalO2 += p.species.oxygenProductionRate;
      totalAirScore += p.species.airPurifyingScore;
      if (p.species.airPurifyingScore >= 7) {
        highPurifying++;
      }
    });

    const totalActivePlants = activePlants.length;
    const avgAirScore = totalActivePlants > 0 ? totalAirScore / totalActivePlants : 0;

    // Green score calculation (0-100)
    // Based on: plant count, diversity, air purifying effectiveness, survival rate
    const totalSpecies = await prisma.plant.groupBy({
      by: ['speciesId'],
      where: { isActive: true },
    });

    const diversityScore = Math.min(totalSpecies.length * 5, 25); // Max 25 points
    const countScore = Math.min(totalActivePlants * 0.5, 25); // Max 25 points
    const airPurifyScore = Math.min(avgAirScore * 2.5, 25); // Max 25 points
    const highPurifyRatio = totalActivePlants > 0 ? (highPurifying / totalActivePlants) * 25 : 0;

    const greenScore = Math.round(diversityScore + countScore + airPurifyScore + highPurifyRatio);

    // Carbon offset: 1 tree absorbs ~22kg CO2/year on average
    // Our co2AbsorptionRate is in grams/day, multiply by 365 for yearly, convert to kg
    const yearlyAbsorptionKg = (totalCO2 * 365) / 1000;
    const carbonOffsetEquivalent = Math.round(yearlyAbsorptionKg / 22); // Equivalent trees

    const environmentalImpactSummary = `Your green infrastructure of ${totalActivePlants} plants absorbs approximately ${Math.round(yearlyAbsorptionKg)} kg of CO2 per year, produces ${Math.round((totalO2 * 365) / 1000)} kg of oxygen, and has a green score of ${greenScore}/100. This is equivalent to the environmental impact of ${carbonOffsetEquivalent} mature trees.`;

    return {
      totalCO2Absorbed: Math.round(totalCO2 * 100) / 100,
      totalO2Produced: Math.round(totalO2 * 100) / 100,
      averageAirPurifyingScore: Math.round(avgAirScore * 10) / 10,
      greenScore: Math.min(greenScore, 100),
      totalActivePlants,
      speciesWithHighAirPurifying: highPurifying,
      carbonOffsetEquivalent,
      environmentalImpactSummary,
    };
  },

  /**
   * Get team performance analytics
   */
  async getTeamPerformance(): Promise<{
    teams: Array<{
      name: string;
      zone: string | null;
      memberCount: number;
      totalVisits: number;
      completionRate: number;
      averageRating: number;
      leadName: string | null;
    }>;
  }> {
    const teams = await prisma.team.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        zone: true,
        memberCount: true,
        lead: {
          select: {
            id: true,
            user: { select: { name: true } },
          },
        },
        members: {
          select: {
            id: true,
            rating: true,
            totalVisits: true,
          },
        },
      },
    });

    const teamPerformance = await Promise.all(
      teams.map(async (team) => {
        const memberIds = team.members.map((m) => m.id);

        const [totalVisits, completedVisits] = await Promise.all([
          prisma.serviceVisit.count({
            where: { technicianId: { in: memberIds } },
          }),
          prisma.serviceVisit.count({
            where: {
              technicianId: { in: memberIds },
              status: 'COMPLETED',
            },
          }),
        ]);

        const avgRating =
          team.members.length > 0
            ? team.members.reduce((sum, m) => sum + m.rating, 0) / team.members.length
            : 0;

        return {
          name: team.name,
          zone: team.zone,
          memberCount: team.memberCount,
          totalVisits,
          completionRate: totalVisits > 0 ? Math.round((completedVisits / totalVisits) * 1000) / 10 : 100,
          averageRating: Math.round(avgRating * 10) / 10,
          leadName: team.lead?.user?.name || null,
        };
      })
    );

    return { teams: teamPerformance };
  },
};

export default analyticsService;
