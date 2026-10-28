/**
 * Shared API response types and contract definitions.
 * Synchronized with backend JSON envelope standards.
 */

/**
 * Pagination metadata included with paginated collections.
 */
export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

/**
 * Standard envelope for successful API responses.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: Record<string, string[]>;
}

/**
 * Standard envelope for error responses returned by the backend.
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
