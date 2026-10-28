import { useQuery } from '@tanstack/vue-query';
import { queryKeys } from '@/core/utils/queryKeys';
import { getDashboardSummaryApi } from '../api/dashboard.api';

/**
 * TanStack Query composable for dashboard analytics.
 * Fetches and caches executive dashboard summary metrics.
 */
export function useDashboardSummaryQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard.summary,
    queryFn: () => getDashboardSummaryApi(),
    staleTime: 1000 * 60, // 1 minute fresh cache
  });
}

