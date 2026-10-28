/**
 * TanStack Query composables for Product domain.
 * Manages server state caching, pagination reactivity, and cache invalidation.
 */

import { computed, Ref } from 'vue';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/vue-query';
import { queryKeys } from '@/core/utils/queryKeys';
import {
  createProductApi,
  deleteProductApi,
  getProductsApi,
  updateProductApi,
} from '../api/products.api';
import { ProductFormData, ProductListParams } from '../types/product.types';

/**
 * Hook to retrieve paginated products with reactive parameters.
 */
export function useProductsQuery(params: Ref<ProductListParams>) {
  return useQuery({
    queryKey: computed(() => queryKeys.products.list(params.value as Record<string, unknown>)),
    queryFn: () => getProductsApi(params.value),
    placeholderData: keepPreviousData,
  });
}

/**
 * Mutation hook to create a new product item and invalidate cache.
 */
export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductFormData) => createProductApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

/**
 * Mutation hook to update an existing product item and invalidate cache.
 */
export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductFormData> }) =>
      updateProductApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

/**
 * Mutation hook to soft-delete a product item and invalidate cache.
 */
export function useDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProductApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

