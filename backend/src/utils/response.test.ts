/**
 * Unit tests for API response utilities.
 * Validates serialization of success envelopes, pagination calculation, and dot-notation error maps.
 */

import { describe, it, expect } from 'vitest';
import { successResponse, errorResponse, createPaginationMeta } from './response';

describe('Response Helpers', () => {
  it('should format a successful response without pagination', () => {
    const res = successResponse({ id: 1, name: 'Admin' }, 'Success');
    expect(res).toEqual({
      success: true,
      message: 'Success',
      data: { id: 1, name: 'Admin' },
    });
  });

  it('should format a successful response with pagination meta', () => {
    const meta = createPaginationMeta(1, 10, 25);
    const res = successResponse(['item1', 'item2'], 'OK', meta);
    expect(res.meta).toEqual({
      page: 1,
      per_page: 10,
      total: 25,
      total_pages: 3,
    });
  });

  it('should format an error response with dot-notation errors', () => {
    const res = errorResponse('Insufficient stock', {
      'items.0.quantity': ['Requested quantity exceeds available stock'],
    });
    expect(res).toEqual({
      success: false,
      message: 'Insufficient stock',
      errors: {
        'items.0.quantity': ['Requested quantity exceeds available stock'],
      },
    });
  });
});
