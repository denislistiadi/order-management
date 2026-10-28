/**
 * Type definitions and DTO contracts for Order / Transaction module on Frontend.
 */

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_code: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id: string;
  customer_name: string;
  created_by: string;
  order_date: string;
  total_amount: string;
  items: OrderItem[];
}

export interface OrderItemInput {
  product_id: number | null;
  quantity: number;
}

export interface CreateOrderPayload {
  customer_id: string;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
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

