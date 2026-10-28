/**
 * Product catalog route definitions.
 * Handles validation middleware and delegates to ProductController.
 */

import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { validate } from '../middlewares/validate';
import {
  createProductSchema,
  productListQuerySchema,
  updateProductSchema,
} from '../validators/product.validator';

export const productRouter = Router();

// GET /api/products — List products with pagination, search, and sorting
productRouter.get('/', validate(productListQuerySchema, 'query'), (req, res, next) => {
  productController.list(req, res, next);
});

// GET /api/products/:id — Get product detail by ID
productRouter.get('/:id', (req, res, next) => {
  productController.getById(req, res, next);
});

// POST /api/products — Create new product
productRouter.post('/', validate(createProductSchema, 'body'), (req, res, next) => {
  productController.create(req, res, next);
});

// PUT /api/products/:id — Update existing product
productRouter.put('/:id', validate(updateProductSchema, 'body'), (req, res, next) => {
  productController.update(req, res, next);
});

// DELETE /api/products/:id — Soft delete product
productRouter.delete('/:id', (req, res, next) => {
  productController.delete(req, res, next);
});

export default productRouter;

