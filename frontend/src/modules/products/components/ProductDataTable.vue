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
    search-placeholder="Cari nama atau kode produk..."
    loading-text="Memuat data katalog produk..."
    no-data-text="Belum ada data produk tersedia"
    @update:options="$emit('update:options', $event)"
    @update:sort-by="$emit('update:sortBy', $event)"
    @search="$emit('search', $event)"
  >
    <template #[`item.product_code`]="{ item }">
      <span class="code-badge font-mono">{{ item.product_code }}</span>
    </template>

    <template #[`item.product_name`]="{ item }">
      <div class="table-product-name font-weight-bold text-grey-darken-4">
        {{ item.product_name }}
      </div>
    </template>

    <template #[`item.price`]="{ item }">
      <span class="table-price font-weight-bold text-grey-darken-3 font-mono">
        {{ formatCurrency(item.price) }}
      </span>
    </template>

    <template #[`item.stock`]="{ item }">
      <span :class="['stock-pill', getStockPillClass(item.stock)]">
        {{ item.stock }} Unit Tersisa
      </span>
    </template>

    <template #[`item.inventory_status`]="{ item }">
      <div class="d-flex align-center">
        <v-icon size="16" :color="getStatusColor(item.stock)" class="mr-1-5">
          {{ getStatusIcon(item.stock) }}
        </v-icon>
        <span :class="['font-weight-semibold', getStatusClass(item.stock)]">
          {{ getStatusLabel(item.stock) }}
        </span>
      </div>
    </template>

    <template #[`item.actions`]="{ item }">
      <div class="action-buttons">
        <v-btn
          icon="mdi-pencil-outline"
          size="small"
          variant="text"
          color="primary"
          data-testid="edit-product-btn"
          title="Edit Produk"
          @click="$emit('edit', item)"
        />
        <v-btn
          icon="mdi-delete-outline"
          size="small"
          variant="text"
          color="error"
          data-testid="delete-product-btn"
          title="Hapus Produk"
          @click="$emit('delete', item)"
        />
      </div>
    </template>
  </AppDataTable>
</template>

<script setup lang="ts">
import AppDataTable from '@/core/layouts/components/AppDataTable.vue';
import { Product } from '../types/product.types';
import { formatCurrency } from '@/core/utils/formatters';

interface Props {
  items: Product[];
  totalItems: number;
  loading: boolean;
  page: number;
  itemsPerPage: number;
  sortBy?: Array<{ key: string; order: 'asc' | 'desc' }>;
  multiSort?: boolean;
}

withDefaults(defineProps<Props>(), {
  multiSort: true,
  sortBy: () => [{ key: 'product_name', order: 'asc' }],
});

defineEmits<{
  (e: 'update:options', options: { page: number; itemsPerPage: number; sortBy: any[] }): void;
  (e: 'update:sortBy', sortBy: any[]): void;
  (e: 'search', keyword: string): void;
  (e: 'edit', product: Product): void;
  (e: 'delete', product: Product): void;
}>();

const tableHeaders = [
  { title: 'KODE', key: 'product_code', sortable: true, width: '130px' },
  { title: 'NAMA PRODUK', key: 'product_name', sortable: true, minWidth: '200px' },
  { title: 'HARGA SATUAN', key: 'price', align: 'end' as const, sortable: true, width: '170px' },
  { title: 'SISA STOK', key: 'stock', align: 'center' as const, sortable: true, width: '150px' },
  { title: 'STATUS', key: 'inventory_status', align: 'start' as const, sortable: false, width: '210px' },
  { title: 'AKSI', key: 'actions', align: 'end' as const, sortable: false, width: '100px' },
];

function getStockPillClass(stock: number): string {
  if (stock === 0) return 'stock-pill-empty';
  if (stock < 5) return 'stock-pill-critical';
  if (stock < 10) return 'stock-pill-warning';
  return 'stock-pill-normal';
}

function getStatusIcon(stock: number): string {
  if (stock === 0) return 'mdi-close-circle';
  if (stock < 5) return 'mdi-alert-circle';
  if (stock < 10) return 'mdi-alert';
  return 'mdi-check-circle';
}

function getStatusColor(stock: number): string {
  if (stock === 0) return '#DC2626';
  if (stock < 5) return '#EF4444';
  if (stock < 10) return '#F59E0B';
  return '#10B981';
}

function getStatusClass(stock: number): string {
  if (stock === 0) return 'status-text-empty';
  if (stock < 5) return 'status-warning-text';
  if (stock < 10) return 'status-text-warning';
  return 'status-text-safe';
}

function getStatusLabel(stock: number): string {
  if (stock === 0) return 'Stok Habis';
  if (stock < 5) return 'Stok Kritis - Perlu Restock';
  if (stock < 10) return 'Stok Menipis';
  return 'Stok Aman';
}
</script>
