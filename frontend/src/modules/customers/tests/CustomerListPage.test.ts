/**
 * Component interaction tests for Customer Catalog (`CustomerListPage.vue`).
 * Validates data rendering, dialog opening, search events, and user interactions.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { VDateInput } from 'vuetify/labs/VDateInput';
import CustomerListPage from '../pages/CustomerListPage.vue';
import { ref } from 'vue';

const mockCustomers = [
  {
    id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    customer_name: 'Budi Santoso',
    customer_address: 'Jl. Merdeka No. 10, Gambir, Jakarta Pusat',
    gender: 'Pria' as const,
    birth_date: '1990-05-15T00:00:00.000Z',
    phone: '081234567890',
    deleted_at: null,
  },
  {
    id: '1e4a3d6f-7c8b-4a1e-9f2d-3c4b5a6d7e8f',
    customer_name: 'Siti Rahmawati',
    customer_address: 'Jl. Gatot Subroto No. 45, Bandung',
    gender: 'Wanita' as const,
    birth_date: '1995-10-20T00:00:00.000Z',
    phone: '085678901234',
    deleted_at: null,
  },
];

const mockMutateAsync = vi.fn().mockResolvedValue({});

vi.mock('../composables/useCustomers', () => ({
  useCustomersQuery: () => ({
    data: ref({
      data: mockCustomers,
      meta: { page: 1, per_page: 10, total: 2, total_pages: 1 },
    }),
    isLoading: ref(false),
    isFetching: ref(false),
  }),
  useCreateCustomerMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: ref(false),
  }),
  useUpdateCustomerMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: ref(false),
  }),
  useDeleteCustomerMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: ref(false),
  }),
}));

describe('CustomerListPage.vue', () => {
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
    mockMutateAsync.mockClear();
    vi.restoreAllMocks();
  });

  it('merender judul halaman dan tombol tambah pelanggan dengan tepat', () => {
    const wrapper = mount(CustomerListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    expect(wrapper.text()).toContain('Buku Pelanggan');
    expect(wrapper.text()).toContain('Tambah Pelanggan');
    expect(wrapper.find('[data-testid="create-customer-btn"]').exists()).toBe(true);
  });

  it('menampilkan field pencarian buku pelanggan', () => {
    const wrapper = mount(CustomerListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    const searchInput = wrapper.find('.search-field');
    expect(searchInput.exists()).toBe(true);
  });

  it('membuka dialog form saat tombol Tambah Pelanggan diklik', async () => {
    const wrapper = mount(CustomerListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    const createBtn = wrapper.find('[data-testid="create-customer-btn"]');
    await createBtn.trigger('click');

    const vm = wrapper.vm as any;
    expect(vm.isFormOpen).toBe(true);
    expect(vm.selectedCustomer).toBeNull();
  });

  it('menyiapkan data terpilih saat membuka dialog edit pelanggan', async () => {
    const wrapper = mount(CustomerListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    const targetCustomer = mockCustomers[0];
    const vm = wrapper.vm as any;
    vm.openEditDialog(targetCustomer);

    expect(vm.isFormOpen).toBe(true);
    expect(vm.selectedCustomer).toEqual(targetCustomer);
  });

  it('menyiapkan dialog konfirmasi saat tombol hapus dipicu', async () => {
    const wrapper = mount(CustomerListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    const targetCustomer = mockCustomers[1];
    const vm = wrapper.vm as any;
    vm.openDeleteDialog(targetCustomer);

    expect(vm.isDeleteOpen).toBe(true);
    expect(vm.selectedCustomer).toEqual(targetCustomer);
  });

  it('memproses penambahan pelanggan baru melalui submit handler', async () => {
    const wrapper = mount(CustomerListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    const vm = wrapper.vm as any;
    vm.openCreateDialog();

    const newCustomerData = {
      customer_name: 'Ahmad Fauzi',
      customer_address: 'Jl. Pemuda No. 12, Surabaya',
      gender: 'Pria' as const,
      birth_date: '1992-08-10',
      phone: '081399887766',
    };

    await vm.handleFormSubmit(newCustomerData);

    expect(mockMutateAsync).toHaveBeenCalledWith(newCustomerData);
    expect(vm.isFormOpen).toBe(false);
  });

  it('memproses pembaruan data pelanggan saat submit dalam mode edit', async () => {
    const wrapper = mount(CustomerListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    const vm = wrapper.vm as any;
    const targetCustomer = mockCustomers[0];
    vm.openEditDialog(targetCustomer);

    const updateData = {
      customer_name: 'Budi Santoso Updated',
      customer_address: 'Jl. Merdeka No. 10B, Gambir, Jakarta Pusat',
      gender: 'Pria' as const,
      birth_date: '1990-05-15',
      phone: '081234567890',
    };

    await vm.handleFormSubmit(updateData);

    expect(mockMutateAsync).toHaveBeenCalledWith({
      id: targetCustomer.id,
      data: updateData,
    });
    expect(vm.isFormOpen).toBe(false);
  });

  it('memproses konfirmasi penghapusan pelanggan dengan memanggil delete mutation', async () => {
    const wrapper = mount(CustomerListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    const vm = wrapper.vm as any;
    const targetCustomer = mockCustomers[1];
    vm.openDeleteDialog(targetCustomer);

    await vm.handleDeleteConfirm();

    expect(mockMutateAsync).toHaveBeenCalledWith(targetCustomer.id);
    expect(vm.isDeleteOpen).toBe(false);
  });

  it('mengubah query multi-sort saat event sort diperbarui dari tabel', async () => {
    const wrapper = mount(CustomerListPage, {
      global: {
        plugins: [vuetify],
      },
    });

    const vm = wrapper.vm as any;
    vm.handleOptionsChange({
      page: 2,
      itemsPerPage: 20,
      sortBy: [
        { key: 'customer_name', order: 'desc' },
        { key: 'birth_date', order: 'asc' },
      ],
    });

    expect(vm.queryParams.page).toBe(2);
    expect(vm.queryParams.per_page).toBe(20);
    expect(vm.queryParams.sort).toBe('customer_name:desc,birth_date:asc');
  });
});

