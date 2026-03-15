import { Router } from 'express';

import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import clientsRoutes from './clients.routes';
import plantsRoutes from './plants.routes';
import subscriptionsRoutes from './subscriptions.routes';
import techniciansRoutes from './technicians.routes';
import maintenanceRoutes from './maintenance.routes';
import paymentsRoutes from './payments.routes';
import analyticsRoutes from './analytics.routes';
import inventoryRoutes from './inventory.routes';
import aiRoutes from './ai.routes';
import notificationsRoutes from './notifications.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vriksham API is running.',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Mount sub-routers under /api/v1
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/clients', clientsRoutes);
router.use('/plants', plantsRoutes);
router.use('/subscriptions', subscriptionsRoutes);
router.use('/technicians', techniciansRoutes);
router.use('/service-visits', maintenanceRoutes);

// Payments routes handle both /invoices and /payments paths
// They are mounted at the root of the API prefix since they manage multiple sub-paths
router.use('/', paymentsRoutes);

router.use('/analytics', analyticsRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/ai', aiRoutes);
router.use('/notifications', notificationsRoutes);

export default router;
