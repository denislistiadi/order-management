<template>
  <div class="order-history-table-container">
    <!-- Integrated Filter Toolbar inside the card header -->
    <div class="table-toolbar">
      <v-row dense align="center">
        <!-- Search Input -->
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="searchKeyword"
            placeholder="Cari no. invoice atau pelanggan..."
            prepend-inner-icon="mdi-magnify"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            class="search-field"
            data-testid="order-search-input"
            @update:model-value="onSearchInput"
          />
        </v-col>

        <!-- Customer Select -->
        <v-col cols="12" sm="6" md="3">
          <v-select
            :model-value="customerId"
            :items="customerItems"
            item-title="title"
            item-value="id"
            placeholder="Semua Pelanggan"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            class="order-customer-select"
            data-testid="order-customer-filter"
            @update:model-value="$emit('update:customerId', $event || '')"
          />
        </v-col>

        <!-- Date Range Input -->
        <v-col cols="12" sm="6" md="3">
          <v-date-input
            :model-value="dateRange"
            placeholder="Rentang Tanggal"
            multiple="range"
            color="primary"
            active-color="primary"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            prepend-icon=""
            append-inner-icon="mdi-calendar-range"
            class="order-daterange-input"
            data-testid="order-date-range-filter"
            @update:model-value="$emit('update:dateRange', $event)"
          />
        </v-col>

        <!-- Reset Button -->
        <v-col cols="12" sm="6" md="2" class="d-flex justify-sm-end">
          <v-btn
            variant="tonal"
            color="grey-darken-1"
            prepend-icon="mdi-filter-remove-outline"
            class="text-caption font-weight-semibold w-100 w-sm-auto"
            data-testid="order-reset-filter-btn"
            @click="onReset"
          >
            Reset Filter
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <!-- Data Table (Using AppDataTable with showSearch=false) -->
    <AppDataTable
      :headers="tableHeaders"
      :items="items"
      :total-items="totalItems"
      :loading="loading"
      :page="page"
      :items-per-page="itemsPerPage"
      :sort-by="sortBy"
      :multi-sort="false"
      :show-search="false"
      loading-text="Memuat data riwayat transaksi..."
      no-data-text="Belum ada riwayat transaksi tersedia"
      data-testid="orders-history-table"
      @update:options="$emit('update:options', $event)"
      @update:sort-by="$emit('update:sortBy', $event)"
    >
      <template #[`item.order_number`]="{ item }">
        <span class="code-badge font-mono font-weight-bold">
          {{ item.order_number }}
        </span>
      </template>

      <template #[`item.order_date`]="{ item }">
        <span class="table-date font-mono text-grey-darken-3 font-weight-medium">
          {{ formatDate(item.order_date) }}
        </span>
      </template>

      <template #[`item.customer_name`]="{ item }">
        <div class="table-customer-name font-weight-semibold text-grey-darken-4">
          {{ item.customer_name }}
        </div>
      </template>

      <template #[`item.items_count`]="{ item }">
        <v-chip size="x-small" variant="tonal" color="primary" class="font-weight-bold">
          {{ item.items?.length || 0 }} Item
        </v-chip>
      </template>

      <template #[`item.total_amount`]="{ item }">
        <span class="table-price font-weight-bold text-grey-darken-4 font-mono">
          {{ formatCurrency(item.total_amount) }}
        </span>
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="action-buttons">
          <v-btn
            icon="mdi-eye-outline"
            size="small"
            variant="text"
            color="primary"
            data-testid="view-order-detail-btn"
            title="Lihat Rincian Transaksi"
            @click="$emit('viewDetail', item)"
          />
        </div>
      </template>
    </AppDataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import AppDataTable from '@/core/layouts/components/AppDataTable.vue';
import { Order } from '../types/order.types';
import { Customer } from '@/modules/customers/types/customer.types';
import { formatCurrency, formatDate } from '@/core/utils/formatters';

interface Props {
  items: Order[];
  totalItems: number;
  loading: boolean;
  page: number;
  itemsPerPage?: number;
  sortBy?: Array<{ key: string; order: 'asc' | 'desc' }>;
  search?: string;
  customerId?: string;
  dateRange?: any;
  customers?: Customer[];
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 10,
  sortBy: () => [{ key: 'order_date', order: 'desc' }],
  search: '',
  customerId: '',
  dateRange: null,
  customers: () => [],
});

const emit = defineEmits<{
  (e: 'update:options', options: { page: number; itemsPerPage: number; sortBy: any[] }): void;
  (e: 'update:sortBy', sortBy: any[]): void;
  (e: 'search', keyword: string): void;
  (e: 'update:customerId', customerId: string): void;
  (e: 'update:dateRange', dateRange: any): void;
  (e: 'reset'): void;
  (e: 'viewDetail', order: Order): void;
}>();

const tableHeaders = [
  { title: 'NO. INVOICE', key: 'order_number', sortable: false, width: '190px' },
  { title: 'TANGGAL TRANSAKSI', key: 'order_date', sortable: true, width: '180px' },
  { title: 'NAMA PELANGGAN', key: 'customer_name', sortable: false, minWidth: '190px' },
  { title: 'VARIASI ITEM', key: 'items_count', align: 'center' as const, sortable: false, width: '130px' },
  { title: 'TOTAL BELANJA', key: 'total_amount', align: 'end' as const, sortable: false, width: '180px' },
  { title: 'AKSI', key: 'actions', align: 'end' as const, sortable: false, width: '90px' },
];

const customerItems = computed(() => {
  return [
    { id: '', title: 'Semua Pelanggan' },
    ...props.customers.map((c) => ({
      id: c.id,
      title: c.customer_name,
    })),
  ];
});

const searchKeyword = ref(props.search || '');
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(
  () => props.search,
  (newVal) => {
    if (newVal !== searchKeyword.value) {
      searchKeyword.value = newVal || '';
    }
  }
);

function onSearchInput(val: string | null) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('search', val?.trim() || '');
  }, 300);
}

function onReset() {
  searchKeyword.value = '';
  emit('reset');
}
</script>
