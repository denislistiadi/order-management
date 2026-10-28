/**
 * Customer module type definitions.
 * Synchronized with backend API response contracts.
 */

export type GenderType = 'Pria' | 'Wanita';

/**
 * Customer item entity returned by the backend API.
 */
export interface Customer {
  id: string;
  customer_name: string;
  customer_address: string;
  gender: GenderType;
  birth_date: string;
  phone: string | null;
  deleted_at: string | null;
}

/**
 * Query criteria for listing customers with server-side pagination, search, and sorting.
 */
export interface CustomerListParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Form values for creating or updating a customer profile.
 */
export interface CustomerFormData {
  customer_name: string;
  customer_address: string;
  gender: GenderType;
  birth_date: string;
  phone?: string;
}

