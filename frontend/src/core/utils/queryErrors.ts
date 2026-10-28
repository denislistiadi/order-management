/**
 * API Error Parsing Utility.
 * Normalizes HTTP failure payloads and extracts indexed dot-notation validation errors
 * conforming to the structure: { success: false, message: string, errors: Record<string, string[]> }.
 */

import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types/api.types';

export interface ExtractedError {
  message: string;
  fieldErrors: Record<string, string[]>;
  statusCode?: number;
}

/**
 * Extracts human-readable error messages and field-level validation errors from API exceptions.
 *
 * @param error Caught exception or rejection value
 * @returns Normalized error descriptor with message and mapped field errors
 */
export function extractApiError(error: unknown): ExtractedError {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as ApiErrorResponse;
    return {
      message: data.message || 'An error occurred while processing the request',
      fieldErrors: data.errors || {},
      statusCode: error.response.status,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      fieldErrors: {},
    };
  }

  return {
    message: 'An unexpected system error occurred',
    fieldErrors: {},
  };
}

export default extractApiError;
