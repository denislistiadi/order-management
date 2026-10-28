/**
 * API Response Formatting Utilities.
 * Helper functions to construct normalized JSON response payloads conforming to the architecture standards.
 */

import { ApiResponse, PaginationMeta } from '../types';

/**
 * Builds a standardized success response object.
 *
 * @param data Optional response payload data
 * @param message Human-readable success message
 * @param meta Optional pagination metadata
 */
export function successResponse<T>(
  data?: T,
  message = 'OK',
  meta?: PaginationMeta
): ApiResponse<T> {
  const response: ApiResponse<T> = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  if (meta !== undefined) {
    response.meta = meta;
  }

  return response;
}

/**
 * Builds a standardized error response object.
 *
 * @param message Error description message
 * @param errors Optional field-specific or dot-notation validation error messages
 */
export function errorResponse(
  message: string,
  errors?: Record<string, string[]>
): ApiResponse<never> {
  const response: ApiResponse<never> = {
    success: false,
    message,
  };

  if (errors !== undefined) {
    response.errors = errors;
  }

  return response;
}

/**
 * Calculates pagination metadata for collection responses.
 *
 * @param page Current 1-based page number
 * @param perPage Number of records per page
 * @param total Total number of matched records
 */
export function createPaginationMeta(
  page: number,
  perPage: number,
  total: number
): PaginationMeta {
  return {
    page,
    per_page: perPage,
    total,
    total_pages: Math.ceil(total / perPage) || 1,
  };
}
