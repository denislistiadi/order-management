import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { successResponse } from '../utils/response';

export class DashboardController {
  /**
   * Returns aggregated executive summary data for the dashboard.
   */
  async getSummary(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await dashboardService.getSummary();
      res.status(200).json(successResponse(summary, 'Data ringkasan dashboard berhasil diambil'));
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
