import { Request, Response } from 'express';
import analyticsService from '../services/analytics.service';

export const analyticsController = {
  /**
   * GET /analytics/overview
   * Get dashboard overview statistics
   */
  async getOverview(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await analyticsService.getOverviewStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Analytics overview error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch overview analytics.',
      });
    }
  },

  /**
   * GET /analytics/plants
   * Get plant health metrics and distribution
   */
  async getPlantMetrics(_req: Request, res: Response): Promise<void> {
    try {
      const metrics = await analyticsService.getPlantMetrics();

      res.status(200).json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      console.error('Plant analytics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch plant analytics.',
      });
    }
  },

  /**
   * GET /analytics/revenue
   * Get revenue analytics and breakdown
   */
  async getRevenue(req: Request, res: Response): Promise<void> {
    try {
      const period = (req.query.period as 'monthly' | 'quarterly' | 'yearly') || 'monthly';
      const metrics = await analyticsService.getRevenueMetrics(period);

      res.status(200).json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      console.error('Revenue analytics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch revenue analytics.',
      });
    }
  },

  /**
   * GET /analytics/maintenance
   * Get maintenance efficiency metrics
   */
  async getMaintenance(_req: Request, res: Response): Promise<void> {
    try {
      const metrics = await analyticsService.getMaintenanceMetrics();

      res.status(200).json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      console.error('Maintenance analytics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch maintenance analytics.',
      });
    }
  },

  /**
   * GET /analytics/esg
   * Get ESG (Environmental, Social, Governance) metrics
   */
  async getESG(_req: Request, res: Response): Promise<void> {
    try {
      const metrics = await analyticsService.getESGMetrics();

      res.status(200).json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      console.error('ESG analytics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch ESG analytics.',
      });
    }
  },

  /**
   * GET /analytics/teams
   * Get team performance analytics
   */
  async getTeams(_req: Request, res: Response): Promise<void> {
    try {
      const metrics = await analyticsService.getTeamPerformance();

      res.status(200).json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      console.error('Team analytics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch team analytics.',
      });
    }
  },
};

export default analyticsController;
