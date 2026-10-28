/**
 * Customer controller handling HTTP request dispatching, parameter validation,
 * and unified response formatting for customer directory endpoints.
 */

import { Request, Response, NextFunction } from 'express';
import { customerService } from '../services/customer.service';
import { successResponse } from '../utils/response';

export class CustomerController {
  /**
   * Retrieves a paginated list of customers.
   */
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await customerService.list(req.query);
      res.status(200).json(successResponse(result.data, 'Daftar pelanggan berhasil diambil', result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves detail of a single customer by UUID.
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const customer = await customerService.getById(id);
      res.status(200).json(successResponse(customer, 'Detail pelanggan berhasil diambil'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Registers a new customer profile.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const customer = await customerService.create(req.body);
      res.status(201).json(successResponse(customer, 'Pelanggan berhasil ditambahkan'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates an existing customer profile.
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const customer = await customerService.update(id, req.body);
      res.status(200).json(successResponse(customer, 'Data pelanggan berhasil diperbarui'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Soft deletes a customer profile.
   */
  async softDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await customerService.softDelete(id);
      res.status(200).json(successResponse(null, 'Pelanggan berhasil dihapus'));
    } catch (error) {
      next(error);
    }
  }
}

export const customerController = new CustomerController();
