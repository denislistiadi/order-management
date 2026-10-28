import apiClient from '@/core/api/apiClient';
import { ApiResponse } from '@/core/types/api.types';
import { DashboardSummaryData } from '../types/dashboard.types';

/**
 * Retrieves aggregated dashboard executive metrics from backend API.
 */
export async function getDashboardSummaryApi(): Promise<ApiResponse<DashboardSummaryData>> {
  const response = await apiClient.get<ApiResponse<DashboardSummaryData>>('/dashboard/summary');
  return response.data;
}

