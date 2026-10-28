/**
 * Customer domain type definitions.
 * Defines payload structures, query filters, and response contracts for customer directory management.
 */

import { Gender } from '@prisma/client';
import { PaginationMeta } from './index';

/**
 * Standard Customer data transfer object returned in API responses.
 * Uses snake_case to conform with the specification in technical assessment documentation.
 */
export interface CustomerResponse {
  id: string;
  customer_name: string;
  customer_address: string;
  gender: Gender | 'Pria' | 'Wanita';
  birth_date: string;
  phone: string | null;
  deleted_at: Date | string | null;
}

/**
 * Payload required to register a new customer profile.
 */
export interface CreateCustomerInput {
  customer_name: string;
  customer_address: string;
  gender: Gender | 'Pria' | 'Wanita';
  birth_date: string | Date;
  phone?: string | null;
}

/**
 * Payload allowed when updating an existing customer profile.
 */
export interface UpdateCustomerInput {
  customer_name?: string;
  customer_address?: string;
  gender?: Gender | 'Pria' | 'Wanita';
  birth_date?: string | Date;
  phone?: string | null;
}

/**
 * Query criteria for listing, filtering, and sorting customer records.
 */
export interface CustomerListParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Paginated response structure containing customer list and metadata.
 */
export interface CustomerListResponse {
  data: CustomerResponse[];
  meta: PaginationMeta;
}

