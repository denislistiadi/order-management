/**
 * Global API response contract definitions.
 * Enforces unified JSON payload formatting across all HTTP endpoints.
 */

/**
 * Pagination metadata included with collection responses.
 */
export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

/**
 * Unified API response structure for both successful operations and errors.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: Record<string, string[]>;
}
