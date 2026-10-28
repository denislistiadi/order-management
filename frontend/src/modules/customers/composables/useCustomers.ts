/**
 * TanStack Query composables for Customer domain.
 * Manages server state caching, pagination reactivity, and cache invalidation.
 */

import { computed, Ref } from 'vue';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/vue-query';
import { queryKeys } from '@/core/utils/queryKeys';
import {
  createCustomerApi,
  deleteCustomerApi,
  getCustomersApi,
  updateCustomerApi,
} from '../api/customers.api';
import { CustomerFormData, CustomerListParams } from '../types/customer.types';

/**
 * Hook to retrieve paginated customers with reactive parameters.
 */
export function useCustomersQuery(params: Ref<CustomerListParams>) {
  return useQuery({
    queryKey: computed(() => queryKeys.customers.list(params.value as Record<string, unknown>)),
    queryFn: () => getCustomersApi(params.value),
    placeholderData: keepPreviousData,
  });
}

/**
 * Mutation hook to create a new customer profile and invalidate cache.
 */
export function useCreateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CustomerFormData) => createCustomerApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
}

/**
 * Mutation hook to update an existing customer profile and invalidate cache.
 */
export function useUpdateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerFormData> }) =>
      updateCustomerApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
}

/**
 * Mutation hook to soft-delete a customer profile and invalidate cache.
 */
export function useDeleteCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCustomerApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
}

