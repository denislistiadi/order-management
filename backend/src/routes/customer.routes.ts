/**
 * Customer directory route definitions.
 * Configures parameter validation, body validation, and delegates to CustomerController.
 */

import { Router } from 'express';
import { customerController } from '../controllers/customer.controller';
import { validate } from '../middlewares/validate';
import {
  createCustomerSchema,
  customerIdParamSchema,
  customerListQuerySchema,
  updateCustomerSchema,
} from '../validators/customer.validator';

export const customerRouter = Router();

// GET /api/customers - List customers with pagination, search, and sorting
customerRouter.get('/', validate(customerListQuerySchema, 'query'), (req, res, next) => {
  customerController.list(req, res, next);
});

// GET /api/customers/:id - Get customer detail by UUID
customerRouter.get('/:id', validate(customerIdParamSchema, 'params'), (req, res, next) => {
  customerController.getById(req, res, next);
});

// POST /api/customers - Create new customer
customerRouter.post('/', validate(createCustomerSchema, 'body'), (req, res, next) => {
  customerController.create(req, res, next);
});

// PUT /api/customers/:id - Update existing customer by UUID
customerRouter.put(
  '/:id',
  validate(customerIdParamSchema, 'params'),
  validate(updateCustomerSchema, 'body'),
  (req, res, next) => {
    customerController.update(req, res, next);
  }
);

// DELETE /api/customers/:id - Soft delete customer by UUID
customerRouter.delete('/:id', validate(customerIdParamSchema, 'params'), (req, res, next) => {
  customerController.softDelete(req, res, next);
});

export default customerRouter;

