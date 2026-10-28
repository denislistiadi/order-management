/**
 * Product module type definitions.
 * Synchronized with backend API response contracts.
 */

/**
 * Product item entity returned by the backend API.
 */
export interface Product {
  id: number;
  product_code: string;
  product_name: string;
  stock: number;
  price: string;
  deleted_at: string | null;
}

/**
 * Query criteria for listing products with server-side pagination, search, and sorting.
 */
export interface ProductListParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Form values for creating or updating a product item.
 */
export interface ProductFormData {
  product_code?: string;
  product_name: string;
  price: number;
  stock: number;
}

