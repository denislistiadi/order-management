/**
 * Order routes definition.
 */

import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { validate } from '../middlewares/validate';
import {
  createOrderSchema,
  orderIdParamSchema,
  orderListQuerySchema,
} from '../validators/order.validator';

export const orderRouter = Router();

// GET /api/orders - List orders with pagination and filtering
orderRouter.get('/', validate(orderListQuerySchema, 'query'), (req, res, next) => {
  orderController.list(req, res, next);
});

// GET /api/orders/:id - Get order detail by numeric ID
orderRouter.get('/:id', validate(orderIdParamSchema, 'params'), (req, res, next) => {
  orderController.getById(req, res, next);
});

// POST /api/orders - Create a new sales transaction atomically
orderRouter.post('/', validate(createOrderSchema, 'body'), (req, res, next) => {
  orderController.create(req, res, next);
});

export default orderRouter;

