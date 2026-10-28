/**
 * Unit test suite for Pinia Authentication Store (`useAuthStore`).
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../stores/authStore';
import * as authApi from '../api/auth.api';

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('menginisialisasi state dengan nilai default / kosong', () => {
    const store = useAuthStore();
    expect(store.token).toBeNull();
    expect(store.refreshToken).toBeNull();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('menyimpan access token, refresh token, dan profil user saat setAuth dipanggil', () => {
    const store = useAuthStore();
    const mockUser = {
      id: 'uuid-123',
      name: 'Admin Test',
      email: 'admin@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.setAuth('mock-access-token', 'mock-refresh-token', mockUser);

    expect(store.token).toBe('mock-access-token');
    expect(store.refreshToken).toBe('mock-refresh-token');
    expect(store.user).toEqual(mockUser);
    expect(store.isAuthenticated).toBe(true);
    expect(localStorage.getItem('auth_token')).toBe('mock-access-token');
    expect(localStorage.getItem('refresh_token')).toBe('mock-refresh-token');
    expect(localStorage.getItem('auth_user')).toContain('Admin Test');
  });

  it('membersihkan seluruh sesi saat clearAuth dipanggil', () => {
    const store = useAuthStore();
    store.setAuth('mock-access-token', 'mock-refresh-token');
    expect(store.isAuthenticated).toBe(true);

    store.clearAuth();

    expect(store.token).toBeNull();
    expect(store.refreshToken).toBeNull();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
  });

  it('berhasil melakukan login melalui API dan memperbarui access & refresh token', async () => {
    const store = useAuthStore();
    const mockUserData = {
      id: 'uuid-admin',
      name: 'System Administrator',
      email: 'admin@example.com',
      createdAt: '2026-10-28T00:00:00.000Z',
      updatedAt: '2026-10-28T00:00:00.000Z',
    };

    vi.spyOn(authApi, 'loginApi').mockResolvedValueOnce({
      success: true,
      message: 'Login berhasil',
      data: {
        accessToken: 'sample-access-token',
        refreshToken: 'sample-refresh-token',
        user: mockUserData,
      },
    });

    await store.login({
      email: 'admin@example.com',
      password: 'password123',
    });

    expect(store.token).toBe('sample-access-token');
    expect(store.refreshToken).toBe('sample-refresh-token');
    expect(store.user?.email).toBe('admin@example.com');
    expect(store.isAuthenticated).toBe(true);
    expect(store.error).toBeNull();
  });

  it('menangkap error dan mengisi state error saat login gagal', async () => {
    const store = useAuthStore();

    vi.spyOn(authApi, 'loginApi').mockRejectedValueOnce({
      response: {
        data: {
          success: false,
          message: 'Email atau kata sandi salah',
        },
      },
    });

    const result = await store.login({
      email: 'wrong@example.com',
      password: 'wrongpassword',
    });

    expect(result).toBe(false);
    expect(store.isAuthenticated).toBe(false);
    expect(store.error).toBe('Email atau kata sandi salah');
    expect(store.isLoading).toBe(false);
  });
});
