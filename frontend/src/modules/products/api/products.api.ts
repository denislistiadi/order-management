/**
 * Product API module.
 * Communicates with backend product endpoints via preconfigured Axios client.
 */

import apiClient from '@/core/api/apiClient';
import { ApiResponse } from '@/core/types/api.types';
import { Product, ProductFormData, ProductListParams } from '../types/product.types';

/**
 * Fetches a paginated list of catalog products.
 */
export async function getProductsApi(params?: ProductListParams): Promise<ApiResponse<Product[]>> {
  const response = await apiClient.get<ApiResponse<Product[]>>('/products', {
    params,
  });
  return response.data;
}

/**
 * Retrieves a single product by its unique integer identifier.
 */
export async function getProductByIdApi(id: number): Promise<ApiResponse<Product>> {
  const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
  return response.data;
}

/**
 * Creates a new product catalog item.
 */
export async function createProductApi(data: ProductFormData): Promise<ApiResponse<Product>> {
  const response = await apiClient.post<ApiResponse<Product>>('/products', data);
  return response.data;
}

/**
 * Updates an existing product catalog item.
 */
export async function updateProductApi(
  id: number,
  data: Partial<ProductFormData>
): Promise<ApiResponse<Product>> {
  const response = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, data);
  return response.data;
}

/**
 * Performs soft delete on a product item.
 */
export async function deleteProductApi(id: number): Promise<ApiResponse<null>> {
  const response = await apiClient.delete<ApiResponse<null>>(`/products/${id}`);
  return response.data;
}

