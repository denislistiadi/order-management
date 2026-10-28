/**
 * Health check router.
 * Provides endpoint for liveness and uptime probes.
 */

import { Router, Request, Response } from 'express';
import { successResponse } from '../utils/response';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json(successResponse({ status: 'healthy', uptime: process.uptime() }, 'OK'));
});

export default router;
