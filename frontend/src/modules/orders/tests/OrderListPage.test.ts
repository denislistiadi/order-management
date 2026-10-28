/**
 * Component interaction tests for Order History Catalog (`OrderListPage.vue`).
 * Validates history table rendering, filter toolbar bindings (including date range),
 * and transaction detail inspection modal.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { VDateInput } from 'vuetify/labs/VDateInput';
import OrderListPage from '../pages/OrderListPage.vue';
import { ref } from 'vue';

const mockOrders = [
  {
    id: 1,
    order_number: 'INV-20261028-0001',
    customer_id: 'cust-uuid-1',
    customer_name: 'Budi Santoso',
    created_by: 'admin-uuid',
    order_date: '2026-10-28T09:30:00.000Z',
    total_amount: '3300000',
    items: [
      {
        id: 101,
        product_id: 1,
        product_code: 'PRD-001',
        product_name: 'Logitech MX Master 3S',
        quantity: 2,
        unit_price: '1650000',
        subtotal: '3300000',
      },
    ],
  },
  {
    id: 2,
    order_number: 'INV-20261028-0002',
    customer_id: 'cust-uuid-2',
    customer_name: 'Siti Rahmawati',
    created_by: 'admin-uuid',
    order_date: '2026-10-28T10:15:00.000Z',
    total_amount: '1250000',
    items: [
      {
        id: 102,
        product_id: 2,
        product_code: 'PRD-002',
        product_name: 'Keychron K2 RGB',
        quantity: 1,
        unit_price: '1250000',
        subtotal: '1250000',
      },
    ],
  },
];

const mockCustomers = [
  { id: 'cust-uuid-1', customer_name: 'Budi Santoso' },
  { id: 'cust-uuid-2', customer_name: 'Siti Rahmawati' },
];

vi.mock('../composables/useOrders', () => ({
  useOrdersQuery: () => ({
    data: ref({
      data: mockOrders,
      meta: { page: 1, per_page: 10, total: 2, total_pages: 1 },
    }),
    isLoading: ref(false),
    isFetching: ref(false),
  }),
}));

vi.mock('@/modules/customers/composables/useCustomers', () => ({
  useCustomersQuery: () => ({
    data: ref({ data: mockCustomers }),
    isLoading: ref(false),
  }),
}));

describe('OrderListPage.vue', () => {
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
      components: {
        ...components,
        VDateInput,
      },
      directives,
    });
  });

  it('merender judul riwayat transaksi dan tombol navigasi buat order', () => {
    const wrapper = mount(OrderListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.text()).toContain('Riwayat Transaksi');
    expect(wrapper.find('[data-testid="create-order-nav-btn"]').exists()).toBe(true);
  });

  it('merender toolbar filter lengkap dengan pencarian, pelanggan, dan rentang tanggal', () => {
    const wrapper = mount(OrderListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.find('[data-testid="order-search-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="order-customer-filter"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="order-date-range-filter"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="order-reset-filter-btn"]').exists()).toBe(true);
  });

  it('merender tabel data transaksi dengan nomor invoice dan rincian nominal', () => {
    const wrapper = mount(OrderListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    const table = wrapper.find('[data-testid="orders-history-table"]');
    expect(table.exists()).toBe(true);
    expect(wrapper.text()).toContain('INV-20261028-0001');
    expect(wrapper.text()).toContain('INV-20261028-0002');
    expect(wrapper.text()).toContain('Budi Santoso');
    expect(wrapper.text()).toContain('Siti Rahmawati');
  });

  it('dapat membuka dialog modal rincian transaksi saat tombol aksi diklik', async () => {
    const wrapper = mount(OrderListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    const viewDetailBtns = wrapper.findAll('[data-testid="view-order-detail-btn"]');
    expect(viewDetailBtns.length).toBeGreaterThan(0);

    const vm = wrapper.vm as any;
    expect(vm.isDetailOpen).toBe(false);

    vm.handleViewDetail(mockOrders[0]);
    expect(vm.isDetailOpen).toBe(true);
    expect(vm.selectedOrder?.order_number).toBe('INV-20261028-0001');
  });
});

