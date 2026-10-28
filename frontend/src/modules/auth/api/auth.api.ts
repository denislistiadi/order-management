/**
 * Authentication API module.
 * Communicates with backend authentication endpoints via the centralized Axios client.
 */

import apiClient from '@/core/api/apiClient';
import { ApiResponse } from '@/core/types/api.types';
import { AdminUser, LoginPayload, LoginResponseData, RefreshResponseData } from '../types/auth.types';

/**
 * Authenticates user credentials with the backend API.
 *
 * @param payload - User email and password
 * @returns Standard API response containing access & refresh tokens and user profile
 */
export async function loginApi(payload: LoginPayload): Promise<ApiResponse<LoginResponseData>> {
  const response = await apiClient.post<ApiResponse<LoginResponseData>>('/auth/login', payload);
  return response.data;
}

/**
 * Exchanges a valid refresh token for a new access token.
 *
 * @param refreshToken - Persistent refresh token
 * @returns Standard API response containing new tokens
 */
export async function refreshTokenApi(refreshToken: string): Promise<ApiResponse<RefreshResponseData>> {
  const response = await apiClient.post<ApiResponse<RefreshResponseData>>('/auth/refresh', {
    refreshToken,
  });
  return response.data;
}

/**
 * Retrieves the currently authenticated user's profile.
 *
 * @returns User profile data
 */
export async function getMeApi(): Promise<ApiResponse<AdminUser>> {
  const response = await apiClient.get<ApiResponse<AdminUser>>('/auth/me');
  return response.data;
}

/**
 * Informs the backend of session termination and revokes active tokens.
 *
 * @param refreshToken - Optional refresh token to revoke
 * @returns Success response
 */
export async function logoutApi(refreshToken?: string): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>('/auth/logout', {
    refreshToken,
  });
  return response.data;
}
