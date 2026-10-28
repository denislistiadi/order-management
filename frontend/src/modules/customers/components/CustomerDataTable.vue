<template>
  <AppDataTable
    :headers="tableHeaders"
    :items="items"
    :total-items="totalItems"
    :loading="loading"
    :page="page"
    :items-per-page="itemsPerPage"
    :sort-by="sortBy"
    :multi-sort="multiSort"
    search-placeholder="Cari nama pelanggan..."
    loading-text="Memuat data buku pelanggan..."
    no-data-text="Belum ada data pelanggan tersedia"
    @update:options="$emit('update:options', $event)"
    @update:sort-by="$emit('update:sortBy', $event)"
    @search="$emit('search', $event)"
  >
    <template #[`item.customer_name`]="{ item }">
      <div class="table-customer-name font-weight-bold text-grey-darken-4">
        {{ item.customer_name }}
      </div>
    </template>

    <template #[`item.gender`]="{ item }">
      <span :class="['gender-pill', item.gender === 'Pria' ? 'gender-pria' : 'gender-wanita']">
        <v-icon size="14" :icon="item.gender === 'Pria' ? 'mdi-gender-male' : 'mdi-gender-female'" />
        {{ item.gender }}
      </span>
    </template>

    <template #[`item.birth_date`]="{ item }">
      <span class="table-date font-mono text-grey-darken-3 font-weight-medium">
        {{ formatDate(item.birth_date) }}
      </span>
    </template>

    <template #[`item.phone`]="{ item }">
      <span class="table-phone font-mono text-grey-darken-3">
        {{ item.phone || '-' }}
      </span>
    </template>

    <template #[`item.customer_address`]="{ item }">
      <div class="table-address" :title="item.customer_address">
        {{ item.customer_address }}
      </div>
    </template>

    <template #[`item.actions`]="{ item }">
      <div class="action-buttons">
        <v-btn
          icon="mdi-pencil-outline"
          size="small"
          variant="text"
          color="primary"
          data-testid="edit-customer-btn"
          title="Edit Pelanggan"
          @click="$emit('edit', item)"
        />
        <v-btn
          icon="mdi-delete-outline"
          size="small"
          variant="text"
          color="error"
          data-testid="delete-customer-btn"
          title="Hapus Pelanggan"
          @click="$emit('delete', item)"
        />
      </div>
    </template>
  </AppDataTable>
</template>

<script setup lang="ts">
import AppDataTable from '@/core/layouts/components/AppDataTable.vue';
import { Customer } from '../types/customer.types';
import { formatDate } from '@/core/utils/formatters';

interface Props {
  items: Customer[];
  totalItems: number;
  loading: boolean;
  page: number;
  itemsPerPage: number;
  sortBy?: Array<{ key: string; order: 'asc' | 'desc' }>;
  multiSort?: boolean;
}

withDefaults(defineProps<Props>(), {
  multiSort: true,
  sortBy: () => [{ key: 'customer_name', order: 'asc' }],
});

defineEmits<{
  (e: 'update:options', options: { page: number; itemsPerPage: number; sortBy: any[] }): void;
  (e: 'update:sortBy', sortBy: any[]): void;
  (e: 'search', keyword: string): void;
  (e: 'edit', customer: Customer): void;
  (e: 'delete', customer: Customer): void;
}>();

const tableHeaders = [
  { title: 'NAMA PELANGGAN', key: 'customer_name', sortable: true, minWidth: '180px' },
  { title: 'JENIS KELAMIN', key: 'gender', sortable: true, width: '150px' },
  { title: 'TANGGAL LAHIR', key: 'birth_date', sortable: true, width: '160px' },
  { title: 'NOMOR TELEPON', key: 'phone', sortable: false, width: '160px' },
  { title: 'ALAMAT LENGKAP', key: 'customer_address', sortable: false, minWidth: '220px' },
  { title: 'AKSI', key: 'actions', align: 'end' as const, sortable: false, width: '100px' },
];
</script>

