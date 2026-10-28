/**
 * Product domain type definitions.
 * Defines payload structures, query filters, and response contracts for product catalog management.
 */

import { PaginationMeta } from './index';

/**
 * Standard Product data transfer object returned in API responses.
 * Uses snake_case to conform with the specification in technical assessment documentation.
 */
export interface ProductResponse {
  id: number;
  product_code: string;
  product_name: string;
  stock: number;
  price: string;
  deleted_at: Date | string | null;
}

/**
 * Payload required to register a new product catalog item.
 * If product_code is omitted, the system will auto-generate a unique sequential code.
 */
export interface CreateProductInput {
  product_code?: string;
  product_name: string;
  price: number;
  stock?: number;
}

/**
 * Payload allowed when modifying an existing product item.
 */
export interface UpdateProductInput {
  product_code?: string;
  product_name?: string;
  price?: number;
  stock?: number;
}

/**
 * Query criteria for listing, filtering, and sorting product collections.
 */
export interface ProductListParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Paginated list response wrapper for products.
 */
export interface ProductListResult {
  data: ProductResponse[];
  meta: PaginationMeta;
}
