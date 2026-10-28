/**
 * Component interaction tests for Product Catalog (`ProductListPage.vue`).
 * Validates data rendering, dialog opening, search events, and user interactions.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import ProductListPage from '../pages/ProductListPage.vue';
import { ref } from 'vue';

const mockProducts = [
  {
    id: 1,
    product_code: 'PRD-001',
    product_name: 'Logitech MX Master 3S',
    price: '1650000',
    stock: 45,
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

const mockMutateAsync = vi.fn().mockResolvedValue({});

vi.mock('../composables/useProducts', () => ({
  useProductsQuery: () => ({
    data: ref({
      data: mockProducts,
      meta: { page: 1, per_page: 10, total: 2, total_pages: 1 },
    }),
    isLoading: ref(false),
    isFetching: ref(false),
  }),
  useCreateProductMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: ref(false),
  }),
  useUpdateProductMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: ref(false),
  }),
  useDeleteProductMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: ref(false),
  }),
}));

describe('ProductListPage.vue', () => {
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
    vi.restoreAllMocks();
  });

  it('merender judul halaman dan tombol tambah produk dengan tepat', () => {
    const wrapper = mount(ProductListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.text()).toContain('Katalog Produk');
    expect(wrapper.text()).toContain('Tambah Produk');
    expect(wrapper.find('[data-testid="create-product-btn"]').exists()).toBe(true);
  });

  it('menampilkan field pencarian katalog produk', () => {
    const wrapper = mount(ProductListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    const searchInput = wrapper.find('.search-field');
    expect(searchInput.exists()).toBe(true);
  });

  it('membuka dialog form saat tombol Tambah Produk diklik', async () => {
    const wrapper = mount(ProductListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    const createBtn = wrapper.find('[data-testid="create-product-btn"]');
    await createBtn.trigger('click');

    const vm = wrapper.vm as any;
    expect(vm.isFormOpen).toBe(true);
    expect(vm.selectedProduct).toBeNull();
  });

  it('menyiapkan data terpilih saat membuka dialog edit', async () => {
    const wrapper = mount(ProductListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    const targetProduct = mockProducts[0];
    const vm = wrapper.vm as any;
    vm.openEditDialog(targetProduct);

    expect(vm.isFormOpen).toBe(true);
    expect(vm.selectedProduct).toEqual(targetProduct);
  });

  it('menyiapkan dialog konfirmasi saat tombol hapus dipicu', async () => {
    const wrapper = mount(ProductListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    const targetProduct = mockProducts[1];
    const vm = wrapper.vm as any;
    vm.openDeleteDialog(targetProduct);

    expect(vm.isDeleteOpen).toBe(true);
    expect(vm.selectedProduct).toEqual(targetProduct);
  });

  it('mendukung perubahan opsi multi-field sorting', () => {
    const wrapper = mount(ProductListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    const vm = wrapper.vm as any;
    vm.handleOptionsChange({
      page: 1,
      itemsPerPage: 10,
      sortBy: [
        { key: 'stock', order: 'asc' },
        { key: 'price', order: 'desc' },
      ],
    });

    expect(vm.queryParams.sort).toBe('stock:asc,price:desc');
    expect(vm.currentSortBy).toHaveLength(2);
    expect(vm.currentSortBy[0].key).toBe('stock');
    expect(vm.currentSortBy[1].key).toBe('price');
  });
});

