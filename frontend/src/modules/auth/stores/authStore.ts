/**
 * Client authentication state store using Pinia.
 * Manages local user session access & refresh tokens, user credentials, and authentication actions.
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AdminUser, LoginPayload } from '../types/auth.types';
import { loginApi, getMeApi, logoutApi, refreshTokenApi } from '../api/auth.api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'));
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'));

  // Safely restore cached user profile from localStorage if present
  let initialUser: AdminUser | null = null;
  const storedUser = localStorage.getItem('auth_user');
  if (storedUser) {
    try {
      initialUser = JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('auth_user');
    }
  }

  const user = ref<AdminUser | null>(initialUser);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  /**
   * Persists authentication tokens and updates user state.
   */
  function setAuth(accessToken: string, newRefreshToken?: string, newUser?: AdminUser): void {
    token.value = accessToken;
    localStorage.setItem('auth_token', accessToken);

    if (newRefreshToken) {
      refreshToken.value = newRefreshToken;
      localStorage.setItem('refresh_token', newRefreshToken);
    }

    if (newUser) {
      user.value = newUser;
      localStorage.setItem('auth_user', JSON.stringify(newUser));
    }
  }

  /**
   * Clears session tokens and resets user authentication state.
   */
  function clearAuth(): void {
    token.value = null;
    refreshToken.value = null;
    user.value = null;
    error.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
  }

  /**
   * Authenticates user credentials against the backend API.
   * Returns true if login is successful, or false if failed (error stored in state).
   */
  async function login(credentials: LoginPayload): Promise<boolean> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await loginApi(credentials);
      if (response.data) {
        setAuth(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user
        );
        return true;
      }
      return false;
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      const message = apiErr.response?.data?.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.';
      error.value = message;
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Exchanges current refresh token for a newly issued access token.
   */
  async function refreshAccessToken(): Promise<string | null> {
    const currentRefreshToken = refreshToken.value || localStorage.getItem('refresh_token');
    if (!currentRefreshToken) {
      clearAuth();
      return null;
    }

    try {
      const response = await refreshTokenApi(currentRefreshToken);
      if (response.data) {
        setAuth(
          response.data.accessToken,
          response.data.refreshToken
        );
        return response.data.accessToken;
      }
      return null;
    } catch {
      clearAuth();
      return null;
    }
  }

  /**
   * Refreshes the user profile from the backend.
   */
  async function fetchProfile(): Promise<void> {
    if (!token.value) return;

    try {
      const response = await getMeApi();
      if (response.data) {
        user.value = response.data;
        localStorage.setItem('auth_user', JSON.stringify(response.data));
      }
    } catch {
      clearAuth();
    }
  }

  /**
   * Logs out user session on backend and revokes tokens.
   */
  async function logout(): Promise<void> {
    try {
      const currentRefresh = refreshToken.value || localStorage.getItem('refresh_token') || undefined;
      await logoutApi(currentRefresh);
    } catch (err: unknown) {
      console.warn('Gagal memanggil API logout server, melanjutkan pembersihan sesi lokal:', err);
    } finally {
      clearAuth();
    }
  }

  return {
    token,
    refreshToken,
    user,
    isLoading,
    error,
    isAuthenticated,
    setAuth,
    clearAuth,
    login,
    refreshAccessToken,
    fetchProfile,
    logout,
  };
});

export default useAuthStore;
