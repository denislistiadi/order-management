/**
 * Order controller handling HTTP requests for transaction creation, listing, and inspection.
 */

import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';
import { successResponse } from '../utils/response';

export class OrderController {
  /**
   * Creates a new sales transaction.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.user as { id: string }).id;
      const result = await orderService.create(req.body, userId);
      res.status(201).json(successResponse(result, 'Transaksi order berhasil dibuat'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves a paginated list of sales transactions.
   */
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await orderService.list(req.query);
      res
        .status(200)
        .json(
          successResponse(
            result.data,
            'Daftar riwayat transaksi berhasil diambil',
            result.meta
          )
        );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves detail of an order by numeric ID.
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const result = await orderService.getById(id);
      res.status(200).json(successResponse(result, 'Detail transaksi berhasil diambil'));
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();

