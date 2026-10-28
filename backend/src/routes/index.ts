/**
 * Root API Router.
 * Aggregates all feature-level route handlers under the /api namespace.
 */

import { Router } from 'express';
import healthRoutes from './health.routes';
import authRouter from './auth.routes';
import productRouter from './product.routes';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRouter);
router.use('/products', authenticateToken, productRouter);

export default router;
