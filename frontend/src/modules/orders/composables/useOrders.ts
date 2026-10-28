/**
 * TanStack Query composables for Order / Transaction domain.
 * Manages reactive query hooks and cache invalidation across orders and products.
 */

import { computed, Ref } from 'vue';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/vue-query';
import { queryKeys } from '@/core/utils/queryKeys';
import { createOrderApi, getOrderByIdApi, getOrdersApi } from '../api/orders.api';
import { CreateOrderPayload, OrderListParams } from '../types/order.types';

/**
 * Hook to retrieve paginated order history with reactive parameters.
 */
export function useOrdersQuery(params: Ref<OrderListParams>) {
  return useQuery({
    queryKey: computed(() => queryKeys.orders.list(params.value as Record<string, unknown>)),
    queryFn: () => getOrdersApi(params.value),
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to retrieve single order transaction detail by ID.
 */
export function useOrderDetailQuery(id: Ref<number | null>) {
  return useQuery({
    queryKey: computed(() => queryKeys.orders.detail(id.value ?? 0)),
    queryFn: () => getOrderByIdApi(id.value!),
    enabled: computed(() => !!id.value && id.value > 0),
  });
}

/**
 * Mutation hook to create a new order atomically.
 * Invalidates both orders and products query caches to synchronize updated stock levels.
 */
export function useCreateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderPayload) => createOrderApi(data),
    onSuccess: () => {
      // Invalidate order list
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      // Invalidate product catalog because stock was decremented
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

