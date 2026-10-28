/**
 * API client module for Order / Transaction domain.
 */

import apiClient from '@/core/api/apiClient';
import { ApiResponse } from '@/core/types/api.types';
import { CreateOrderPayload, Order, OrderListParams } from '../types/order.types';

/**
 * Creates a new sales transaction atomically.
 */
export async function createOrderApi(data: CreateOrderPayload): Promise<ApiResponse<Order>> {
  const response = await apiClient.post<ApiResponse<Order>>('/orders', data);
  return response.data;
}

/**
 * Retrieves a paginated list of sales transactions.
 */
export async function getOrdersApi(params?: OrderListParams): Promise<ApiResponse<Order[]>> {
  const cleanParams: Record<string, unknown> = {};
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== '' && val !== null && val !== undefined) {
        cleanParams[key] = val;
      }
    });
  }
  const response = await apiClient.get<ApiResponse<Order[]>>('/orders', {
    params: cleanParams,
  });
  return response.data;
}

/**
 * Retrieves detailed transaction information by ID.
 */
export async function getOrderByIdApi(id: number): Promise<ApiResponse<Order>> {
  const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
  return response.data;
}

