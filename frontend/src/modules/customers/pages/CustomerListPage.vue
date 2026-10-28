<template>
  <div class="customers-page">
    <div class="page-header">
      <div>
        <h1 class="page-title mb-1">Buku Pelanggan</h1>
        <p class="page-subtitle">
          Kelola profil pelanggan, buku alamat, dan informasi kontak secara terpusat.
        </p>
      </div>

      <v-btn
        prepend-icon="mdi-plus"
        class="btn-create-customer"
        data-testid="create-customer-btn"
        @click="openCreateDialog"
      >
        Tambah Pelanggan
      </v-btn>
    </div>

    <v-card class="customers-card">
      <CustomerDataTable
        :items="customersList"
        :total-items="totalCustomers"
        :loading="isTableLoading"
        :page="queryParams.page || 1"
        :items-per-page="queryParams.per_page || 10"
        :sort-by="currentSortBy"
        multi-sort
        @update:options="handleOptionsChange"
        @update:sort-by="currentSortBy = $event"
        @search="handleSearch"
        @edit="openEditDialog"
        @delete="openDeleteDialog"
      />
    </v-card>

    <CustomerFormDialog
      v-model="isFormOpen"
      :customer="selectedCustomer"
      :submitting="isCreating || isUpdating"
      :server-error="formError"
      @submit="handleFormSubmit"
      @clear-error="formError = null"
    />

    <CustomerDeleteDialog
      v-model="isDeleteOpen"
      :customer="selectedCustomer"
      :deleting="isDeleting"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CustomerDataTable from '../components/CustomerDataTable.vue';
import CustomerFormDialog from '../components/CustomerFormDialog.vue';
import CustomerDeleteDialog from '../components/CustomerDeleteDialog.vue';
import {
  useCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from '../composables/useCustomers';
import { Customer, CustomerFormData, CustomerListParams } from '../types/customer.types';
import { extractApiError } from '@/core/utils/queryErrors';
import { useToast } from '@/core/composables/useToast';

const toast = useToast();

const queryParams = ref<CustomerListParams>({
  page: 1,
  per_page: 10,
  search: '',
  sort: 'customer_name',
  order: 'asc',
});

const { data: apiResponse, isLoading, isFetching } = useCustomersQuery(queryParams);
const isTableLoading = computed(() => isLoading.value || isFetching.value);
const { mutateAsync: createCustomer, isPending: isCreating } = useCreateCustomerMutation();
const { mutateAsync: updateCustomer, isPending: isUpdating } = useUpdateCustomerMutation();
const { mutateAsync: deleteCustomer, isPending: isDeleting } = useDeleteCustomerMutation();

const customersList = computed(() => apiResponse.value?.data || []);
const totalCustomers = computed(() => apiResponse.value?.meta?.total || 0);

const isFormOpen = ref(false);
const isDeleteOpen = ref(false);
const selectedCustomer = ref<Customer | null>(null);
const formError = ref<string | null>(null);
const currentSortBy = ref<Array<{ key: string; order: 'asc' | 'desc' }>>([
  { key: 'customer_name', order: 'asc' },
]);

function openCreateDialog() {
  selectedCustomer.value = null;
  formError.value = null;
  isFormOpen.value = true;
}

function openEditDialog(customer: Customer) {
  selectedCustomer.value = customer;
  formError.value = null;
  isFormOpen.value = true;
}

function openDeleteDialog(customer: Customer) {
  selectedCustomer.value = customer;
  isDeleteOpen.value = true;
}

function handleOptionsChange(opts: { page: number; itemsPerPage: number; sortBy: any[] }) {
  queryParams.value.page = opts.page;
  queryParams.value.per_page = opts.itemsPerPage;

  if (opts.sortBy && opts.sortBy.length > 0) {
    currentSortBy.value = opts.sortBy;
    queryParams.value.sort = opts.sortBy.map((s) => `${s.key}:${s.order}`).join(',');
  } else {
    currentSortBy.value = [];
    queryParams.value.sort = 'customer_name';
    queryParams.value.order = 'asc';
  }
}

function handleSearch(keyword: string) {
  queryParams.value.search = keyword;
  queryParams.value.page = 1;
}

async function handleFormSubmit(data: CustomerFormData) {
  formError.value = null;
  try {
    if (selectedCustomer.value) {
      await updateCustomer({ id: selectedCustomer.value.id, data });
      toast.success('Data pelanggan berhasil diperbarui');
    } else {
      await createCustomer(data);
      toast.success('Pelanggan baru berhasil ditambahkan');
    }
    isFormOpen.value = false;
  } catch (err) {
    const extracted = extractApiError(err);
    formError.value = extracted.message;
    toast.error(extracted.message);
  }
}

async function handleDeleteConfirm() {
  if (!selectedCustomer.value) return;
  try {
    await deleteCustomer(selectedCustomer.value.id);
    toast.success('Data pelanggan berhasil dihapus');
    isDeleteOpen.value = false;
  } catch (err) {
    const extracted = extractApiError(err);
    toast.error(extracted.message);
  }
}
</script>

<style lang="scss" src="../styles/customers.scss" />

