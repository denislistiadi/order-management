/**
 * TanStack Query Client Configuration.
 * Establishes global query caching policies, garbage collection intervals,
 * and selective retry behavior for network requests.
 */

import { QueryClient } from '@tanstack/vue-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Do not retry on client authentication or not found errors
        if (error?.response?.status === 401 || error?.response?.status === 404) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 5, // Keep cached query results fresh for five minutes
      gcTime: 1000 * 60 * 15,    // Retain unused queries in garbage collection cache for fifteen minutes
    },
    mutations: {
      retry: 0, // Disable automatic mutation retries to prevent unintended duplicate submissions
    },
  },
});

export default queryClient;
