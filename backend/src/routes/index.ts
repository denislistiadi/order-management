/**
 * Root API Router.
 * Aggregates all feature-level route handlers under the /api namespace.
 */

import { Router } from 'express';
import healthRoutes from './health.routes';
import authRouter from './auth.routes';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRouter);

export default router;
