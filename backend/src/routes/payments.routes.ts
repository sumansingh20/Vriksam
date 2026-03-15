import { Router, raw } from 'express';
import { authenticate } from '../middleware/auth';
import paymentsController from '../controllers/payments.controller';

const router = Router();

// Stripe webhook - must use raw body parser, no auth
// This route receives raw body for signature verification
router.post('/payments/webhook', raw({ type: 'application/json' }), paymentsController.handleWebhook);

// Invoice routes (authenticated)
router.get('/invoices', authenticate, paymentsController.listInvoices);
router.get('/invoices/:id', authenticate, paymentsController.getInvoice);

// Payment routes (authenticated)
router.post('/payments/create-checkout', authenticate, paymentsController.createCheckout);

export default router;
