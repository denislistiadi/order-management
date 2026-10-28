/**
 * Type definitions and DTO contracts for Order / Transaction module.
 */

import { PaginationMeta } from './index';

export interface CreateOrderItemInput {
  product_id: number;
  quantity: number;
}

export interface CreateOrderInput {
  customer_id: string;
  items: CreateOrderItemInput[];
}

export interface OrderItemResponse {
  id: number;
  product_id: number;
  product_name: string;
  product_code: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export interface OrderResponse {
  id: number;
  order_number: string;
  customer_id: string;
  customer_name: string;
  created_by: string;
  order_date: string;
  total_amount: string;
  items: OrderItemResponse[];
}

export interface OrderListParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  customer_id?: string;
  from?: string;
  to?: string;
}

export interface OrderListResponse {
  data: OrderResponse[];
  meta: PaginationMeta;
}

