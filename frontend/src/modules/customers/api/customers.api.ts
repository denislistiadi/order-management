/**
 * Customer API module.
 * Communicates with backend customer endpoints via preconfigured Axios client.
 */

import apiClient from '@/core/api/apiClient';
import { ApiResponse } from '@/core/types/api.types';
import { Customer, CustomerFormData, CustomerListParams } from '../types/customer.types';

/**
 * Fetches a paginated list of customers.
 */
export async function getCustomersApi(params?: CustomerListParams): Promise<ApiResponse<Customer[]>> {
  const response = await apiClient.get<ApiResponse<Customer[]>>('/customers', {
    params,
  });
  return response.data;
}

/**
 * Retrieves a single customer by UUID.
 */
export async function getCustomerByIdApi(id: string): Promise<ApiResponse<Customer>> {
  const response = await apiClient.get<ApiResponse<Customer>>(`/customers/${id}`);
  return response.data;
}

/**
 * Registers a new customer profile.
 */
export async function createCustomerApi(data: CustomerFormData): Promise<ApiResponse<Customer>> {
  const response = await apiClient.post<ApiResponse<Customer>>('/customers', data);
  return response.data;
}

/**
 * Updates an existing customer profile.
 */
export async function updateCustomerApi(
  id: string,
  data: Partial<CustomerFormData>
): Promise<ApiResponse<Customer>> {
  const response = await apiClient.put<ApiResponse<Customer>>(`/customers/${id}`, data);
  return response.data;
}

/**
 * Performs soft delete on a customer profile.
 */
export async function deleteCustomerApi(id: string): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(`/customers/${id}`);
  return response.data;
}

