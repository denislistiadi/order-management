/**
 * Product controller handling HTTP request dispatching, parameter parsing,
 * and unified response formatting for product catalog endpoints.
 */

import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';
import { successResponse } from '../utils/response';
import { AppError } from '../middlewares/errorHandler';

export class ProductController {
  /**
   * Retrieves a paginated list of catalog products.
   */
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await productService.list(req.query);
      res.status(200).json(successResponse(result.data, 'OK', result.meta));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves detail of a single product by ID.
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        const error: AppError = new Error('ID produk tidak valid');
        error.statusCode = 422;
        throw error;
      }

      const product = await productService.getById(id);
      res.status(200).json(successResponse(product, 'Data produk berhasil diambil'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Creates a new product catalog item.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(successResponse(product, 'Produk berhasil ditambahkan'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates an existing product item by ID.
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        const error: AppError = new Error('ID produk tidak valid');
        error.statusCode = 422;
        throw error;
      }

      const updated = await productService.update(id, req.body);
      res.status(200).json(successResponse(updated, 'Produk berhasil diperbarui'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Soft-deletes a product catalog item.
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        const error: AppError = new Error('ID produk tidak valid');
        error.statusCode = 422;
        throw error;
      }

      await productService.softDelete(id);
      res.status(200).json(successResponse(null, 'Produk berhasil dihapus'));
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
export default productController;

