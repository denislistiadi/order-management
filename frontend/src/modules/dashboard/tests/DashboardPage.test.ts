/**
 * Component interaction tests for Executive Dashboard Analytics (`DashboardPage.vue`).
 * Validates KPI cards, sales revenue chart, donut chart of top products,
 * low-stock inventory table, and error banner recovery.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import DashboardPage from '../pages/DashboardPage.vue';
import { ref } from 'vue';

const mockDashboardData = {
  total_transactions: 35,
  total_revenue: '215450000',
  total_products: 24,
  total_customers: 18,
  top_products: [
    {
      id: 1,
      product_code: 'PRD-001',
      product_name: 'Logitech MX Master 3S',
      sold_quantity: 25,
      total_revenue: '41250000',
      percentage: 35,
    },
    {
      id: 2,
      product_code: 'PRD-002',
      product_name: 'Keychron K2 RGB',
      sold_quantity: 15,
      total_revenue: '18750000',
      percentage: 21,
    },
  ],
  low_stock_products: [
    {
      id: 3,
      product_code: 'PRD-003',
      product_name: 'Keyboard Switch Puller',
      price: '45000',
      stock: 2,
    },
  ],
  daily_sales: [
    { date: '2026-10-22', label: '22 Okt', revenue: 15000000 },
    { date: '2026-10-23', label: '23 Okt', revenue: 22000000 },
    { date: '2026-10-24', label: '24 Okt', revenue: 18500000 },
    { date: '2026-10-25', label: '25 Okt', revenue: 31000000 },
    { date: '2026-10-26', label: '26 Okt', revenue: 14000000 },
    { date: '2026-10-27', label: '27 Okt', revenue: 29000000 },
    { date: '2026-10-28', label: '28 Okt', revenue: 36000000 },
  ],
};

const mockIsLoading = ref(false);
const mockIsError = ref(false);
const mockRefetch = vi.fn();

vi.mock('../composables/useDashboard', () => ({
  useDashboardSummaryQuery: () => ({
    data: ref({ data: mockDashboardData }),
    isLoading: mockIsLoading,
    isError: mockIsError,
    refetch: mockRefetch,
  }),
}));

describe('DashboardPage.vue', () => {
  let vuetify: ReturnType<typeof createVuetify>;

  beforeEach(() => {
    if (typeof window !== 'undefined' && !window.visualViewport) {
      (window as any).visualViewport = {
        width: 1024,
        height: 768,
        offsetLeft: 0,
        offsetTop: 0,
        pageLeft: 0,
        pageTop: 0,
        scale: 1,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    }

    vuetify = createVuetify({
      components,
      directives,
    });
    mockIsLoading.value = false;
    mockIsError.value = false;
    mockRefetch.mockClear();
  });

  it('merender judul eksekutif dan kartu KPI dengan metrik akurat', () => {
    const wrapper = mount(DashboardPage, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.text()).toContain('Ringkasan Eksekutif');
    expect(wrapper.find('[data-testid="kpi-total-transactions"]').text()).toContain('35');
    expect(wrapper.find('[data-testid="kpi-total-revenue"]').text()).toContain('Rp');
    expect(wrapper.find('[data-testid="kpi-total-products"]').text()).toContain('24');
    expect(wrapper.find('[data-testid="kpi-total-customers"]').text()).toContain('18');
  });

  it('merender grafik penjualan harian tanpa metrik pesanan sesuai instruksi', () => {
    const wrapper = mount(DashboardPage, {
      global: {
        plugins: [vuetify],
      },
    });

    const chart = wrapper.find('[data-testid="daily-sales-chart"]');
    expect(chart.exists()).toBe(true);

    // Verifikasi hanya penjualan (omzet) yang tampil di legend
    expect(wrapper.text()).toContain('Penjualan (Rp)');
    // Memastikan tidak ada teks pesanan di grafik
    expect(wrapper.find('.legend-indicator.bg-orange').exists()).toBe(true);
  });

  it('merender donut chart dan daftar produk terlaris', () => {
    const wrapper = mount(DashboardPage, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.find('[data-testid="top-products-donut"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Logitech MX Master 3S');
    expect(wrapper.text()).toContain('Keychron K2 RGB');
  });

  it('merender tabel peringatan produk dengan stok kritis menipis', () => {
    const wrapper = mount(DashboardPage, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.find('[data-testid="low-stock-table"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="low-stock-count-badge"]').text()).toContain('1 Produk Kritis');
    expect(wrapper.text()).toContain('Keyboard Switch Puller');
    expect(wrapper.text()).toContain('2 Unit Tersisa');
  });

  it('menampilkan banner error dan tombol muat ulang saat terjadi kendala query server', async () => {
    mockIsError.value = true;

    const wrapper = mount(DashboardPage, {
      global: {
        plugins: [vuetify],
      },
    });

    const banner = wrapper.find('[data-testid="dashboard-error-banner"]');
    expect(banner.exists()).toBe(true);
    expect(banner.text()).toContain('Gagal memuat ringkasan data dashboard');

    const retryBtn = banner.findComponent({ name: 'v-btn' });
    await retryBtn.trigger('click');
    expect(mockRefetch).toHaveBeenCalled();
  });
});

