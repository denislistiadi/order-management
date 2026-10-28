import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';

const router = Router();

// Retrieve dashboard analytical summary
router.get('/summary', (req, res, next) => dashboardController.getSummary(req, res, next));

export default router;

