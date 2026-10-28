/**
 * Client authentication state store.
 * Manages local user session tokens, login status, and user credentials.
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AdminUser } from '../types/auth.types';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'));
  const user = ref<AdminUser | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  /**
   * Persists authentication token and updates user state.
   */
  function setAuth(newToken: string, newUser?: AdminUser): void {
    token.value = newToken;
    localStorage.setItem('auth_token', newToken);
    if (newUser) {
      user.value = newUser;
    }
  }

  /**
   * Clears session token and resets user authentication state.
   */
  function clearAuth(): void {
    token.value = null;
    user.value = null;
    localStorage.removeItem('auth_token');
  }

  return {
    token,
    user,
    isAuthenticated,
    setAuth,
    clearAuth,
  };
});

export default useAuthStore;
