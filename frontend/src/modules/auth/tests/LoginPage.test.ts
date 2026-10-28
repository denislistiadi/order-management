/**
 * Component interaction test suite for LoginPage (`LoginPage.vue`).
 * Validates form rendering, email/password validation rules, and submission handlers.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import LoginPage from '../pages/LoginPage.vue';
import { useAuthStore } from '../stores/authStore';

const mockPush = vi.fn();

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => ({ query: {} }),
}));

describe('LoginPage.vue', () => {
  let vuetify: ReturnType<typeof createVuetify>;

  beforeEach(() => {
    setActivePinia(createPinia());
    vuetify = createVuetify({
      components,
      directives,
    });
    mockPush.mockClear();
    vi.restoreAllMocks();
  });

  it('merender form login dengan judul dan field yang lengkap', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.text()).toContain('Masuk ke Portal');
    expect(wrapper.text()).toContain('Email Administrator');
    expect(wrapper.text()).toContain('Kata Sandi');
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('#login-submit-btn').exists()).toBe(true);
  });

  it('tidak menampilkan box demo preset (production-ready)', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.text()).not.toContain('Akun Demo Seeder');
    expect(wrapper.find('.demo-box').exists()).toBe(false);
  });

  it('menampilkan banner error saat authStore.error terisi', async () => {
    const authStore = useAuthStore();
    authStore.error = 'Email atau kata sandi tidak valid';

    const wrapper = mount(LoginPage, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.text()).toContain('Email atau kata sandi tidak valid');
  });

  it('memanggil authStore.login dan melakukan redirect saat submit valid', async () => {
    const authStore = useAuthStore();
    const loginSpy = vi.spyOn(authStore, 'login').mockResolvedValueOnce(true);

    const wrapper = mount(LoginPage, {
      global: {
        plugins: [vuetify],
      },
    });

    const emailInput = wrapper.find('input[type="text"]');
    const passwordInput = wrapper.find('input[type="password"]');

    await emailInput.setValue('admin@example.com');
    await passwordInput.setValue('password123');

    const form = wrapper.find('form');
    await form.trigger('submit');
    await flushPromises();

    expect(loginSpy).toHaveBeenCalledWith({
      email: 'admin@example.com',
      password: 'password123',
    });
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
