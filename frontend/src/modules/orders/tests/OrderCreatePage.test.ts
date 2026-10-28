/**
 * Component interaction tests for Order Creation Page (`OrderCreatePage.vue`).
 * Validates dynamic cart lines, calculations, submission, and dot-notation error binding.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { AxiosError, AxiosHeaders } from 'axios';
import OrderCreatePage from '../pages/OrderCreatePage.vue';
import { ref } from 'vue';

const mockCustomers = [
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    customer_name: 'Budi Santoso',
    customer_address: 'Jl. Merdeka No. 10',
    gender: 'Pria',
    phone: '081234567890',
  },
];

const mockProducts = [
  {
    id: 1,
    product_code: 'PRD-001',
    product_name: 'Logitech MX Master 3S',
    price: '1650000',
    stock: 10,
    deleted_at: null,
  },
  {
    id: 2,
    product_code: 'PRD-002',
    product_name: 'Keychron K2 RGB',
    price: '1250000',
    stock: 5,
    deleted_at: null,
  },
];

const mockMutateAsync = vi.fn().mockResolvedValue({
  data: {
    id: 1,
    order_number: 'INV-20261028-0001',
  },
});

vi.mock('@/modules/customers/composables/useCustomers', () => ({
  useCustomersQuery: () => ({
    data: ref({ data: mockCustomers }),
    isLoading: ref(false),
  }),
}));

vi.mock('@/modules/products/composables/useProducts', () => ({
  useProductsQuery: () => ({
    data: ref({ data: mockProducts }),
    isLoading: ref(false),
  }),
}));

vi.mock('../composables/useOrders', () => ({
  useCreateOrderMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: ref(false),
  }),
}));

const mockPush = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('OrderCreatePage.vue', () => {
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
    mockMutateAsync.mockClear();
    mockPush.mockClear();
    vi.restoreAllMocks();
  });

  it('merender judul halaman dan komponen form kasir dengan tepat', () => {
    const wrapper = mount(OrderCreatePage, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.text()).toContain('Buat Order Baru');
    expect(wrapper.text()).toContain('Informasi Pelanggan');
    expect(wrapper.text()).toContain('Daftar Barang Belanja');
    expect(wrapper.find('[data-testid="customer-select"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="submit-order-btn"]').exists()).toBe(true);
  });

  it('memiliki minimal 1 baris item belanja saat pertama kali dibuka', () => {
    const wrapper = mount(OrderCreatePage, {
      global: {
        plugins: [vuetify],
      },
    });

    const vm = wrapper.vm as any;
    expect(vm.orderItems.length).toBe(1);
    expect(vm.orderItems[0].quantity).toBe(1);
  });

  it('dapat menambah baris item belanja baru saat tombol Tambah Baris Barang diklik', async () => {
    const wrapper = mount(OrderCreatePage, {
      global: {
        plugins: [vuetify],
      },
    });

    const addBtn = wrapper.find('[data-testid="add-item-btn"]');
    await addBtn.trigger('click');

    const vm = wrapper.vm as any;
    expect(vm.orderItems.length).toBe(2);
  });

  it('dapat menghapus baris item belanja jika terdapat lebih dari 1 baris', async () => {
    const wrapper = mount(OrderCreatePage, {
      global: {
        plugins: [vuetify],
      },
    });

    const vm = wrapper.vm as any;
    vm.addItem();
    expect(vm.orderItems.length).toBe(2);

    vm.removeItem(0);
    expect(vm.orderItems.length).toBe(1);

    // Tidak boleh menghapus jika hanya tersisa 1 baris
    vm.removeItem(0);
    expect(vm.orderItems.length).toBe(1);
  });

  it('menghitung total pembayaran secara real-time berdasarkan item yang dipilih', async () => {
    const wrapper = mount(OrderCreatePage, {
      global: {
        plugins: [vuetify],
      },
    });

    const vm = wrapper.vm as any;
    // Set customer
    vm.selectedCustomerId = mockCustomers[0].id;
    // Item 1: 2 unit Logitech MX Master 3S (2 x 1.650.000 = 3.300.000)
    vm.orderItems[0] = { product_id: 1, quantity: 2 };

    // Item 2: 1 unit Keychron K2 RGB (1 x 1.250.000 = 1.250.000)
    vm.addItem();
    vm.orderItems[1] = { product_id: 2, quantity: 1 };

    // Total = 4.550.000
    expect(vm.grandTotal).toBe(4550000);
    expect(vm.totalQuantity).toBe(3);
  });

  it('memproses pengiriman payload order saat tombol submit diklik', async () => {
    const wrapper = mount(OrderCreatePage, {
      global: {
        plugins: [vuetify],
      },
    });

    const vm = wrapper.vm as any;
    vm.selectedCustomerId = mockCustomers[0].id;
    vm.orderItems = [{ product_id: 1, quantity: 2 }];

    await vm.handleSubmitOrder();

    expect(mockMutateAsync).toHaveBeenCalledWith({
      customer_id: mockCustomers[0].id,
      items: [{ product_id: 1, quantity: 2 }],
    });
    expect(mockPush).toHaveBeenCalledWith('/orders');
  });

  it('mengikat pesan error dot-notation dari server ke baris item yang spesifik', async () => {
    const stockErrorResponse = new AxiosError(
      'Request failed with status code 422',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 422,
        statusText: 'Unprocessable Entity',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: {
          success: false,
          message: 'Stok tidak mencukupi',
          errors: {
            'items.0.quantity': ['Stok Logitech MX Master 3S tersisa 1, diminta 5'],
          },
        },
      } as any
    );

    mockMutateAsync.mockRejectedValueOnce(stockErrorResponse);

    const wrapper = mount(OrderCreatePage, {
      global: {
        plugins: [vuetify],
      },
    });

    const vm = wrapper.vm as any;
    vm.selectedCustomerId = mockCustomers[0].id;
    vm.orderItems = [{ product_id: 1, quantity: 5 }];

    await vm.handleSubmitOrder();

    expect(vm.getItemError(0)).toBe('Stok Logitech MX Master 3S tersisa 1, diminta 5');
    expect(vm.generalError).toBe('Stok tidak mencukupi');
  });
});
