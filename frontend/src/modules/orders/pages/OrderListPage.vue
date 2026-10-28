<template>
  <div class="orders-page">
    <!-- Page Header (Unified design matching Product & Customer modules) -->
    <div class="page-header">
      <div>
        <h1 class="page-title mb-1">Riwayat Transaksi</h1>
        <p class="page-subtitle">
          Telusuri rekam jejak pesanan penjualan, periksa rincian faktur, dan pantau histori belanja pelanggan.
        </p>
      </div>

      <v-btn
        prepend-icon="mdi-plus"
        class="btn-create-order"
        to="/orders/create"
        data-testid="create-order-nav-btn"
      >
        Buat Order Baru
      </v-btn>
    </div>

    <!-- Unified Data Table Card -->
    <v-card class="orders-card">
      <OrderHistoryTable
        :items="ordersList"
        :total-items="totalOrders"
        :loading="isTableLoading"
        :page="queryParams.page || 1"
        :items-per-page="queryParams.per_page || 10"
        :sort-by="currentSortBy"
        :search="queryParams.search || ''"
        :customer-id="queryParams.customer_id || ''"
        :date-range="dateRangeValue"
        :customers="customersList"
        @update:options="handleOptionsChange"
        @update:sort-by="currentSortBy = $event"
        @search="handleSearch"
        @update:customer-id="handleCustomerFilter"
        @update:date-range="handleDateRangeFilter"
        @reset="handleResetFilters"
        @view-detail="handleViewDetail"
      />
    </v-card>

    <!-- Detail Order Modal Dialog -->
    <OrderDetailModal
      v-model="isDetailOpen"
      :order="selectedOrder"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import OrderHistoryTable from '../components/OrderHistoryTable.vue';
import OrderDetailModal from '../components/OrderDetailModal.vue';
import { useOrdersQuery } from '../composables/useOrders';
import { useCustomersQuery } from '@/modules/customers/composables/useCustomers';
import { Order, OrderListParams } from '../types/order.types';

// Query parameters
const queryParams = ref<OrderListParams>({
  page: 1,
  per_page: 10,
  search: '',
  customer_id: '',
  from: '',
  to: '',
  sort: 'order_date',
  order: 'desc',
});

const currentSortBy = ref<Array<{ key: string; order: 'asc' | 'desc' }>>([
  { key: 'order_date', order: 'desc' },
]);

const dateRangeValue = ref<any>(null);

// Customers list query for filter dropdown
const customerQueryParams = ref({ per_page: 100 });
const { data: customersData } = useCustomersQuery(customerQueryParams);
const customersList = computed(() => customersData.value?.data || []);

// Orders dataset query
const {
  data: ordersData,
  isLoading: isLoadingOrders,
  isFetching: isFetchingOrders,
} = useOrdersQuery(queryParams);

const isTableLoading = computed(() => isLoadingOrders.value || isFetchingOrders.value);
const ordersList = computed(() => ordersData.value?.data || []);
const totalOrders = computed(() => ordersData.value?.meta?.total || 0);

// Detail modal state
const isDetailOpen = ref(false);
const selectedOrder = ref<Order | null>(null);

function handleViewDetail(order: Order) {
  selectedOrder.value = order;
  isDetailOpen.value = true;
}

function handleOptionsChange(opts: { page: number; itemsPerPage: number; sortBy: any[] }) {
  queryParams.value.page = opts.page;
  queryParams.value.per_page = opts.itemsPerPage;

  if (opts.sortBy && opts.sortBy.length > 0) {
    currentSortBy.value = opts.sortBy;
    queryParams.value.sort = opts.sortBy[0].key;
    queryParams.value.order = opts.sortBy[0].order;
  } else {
    currentSortBy.value = [{ key: 'order_date', order: 'desc' }];
    queryParams.value.sort = 'order_date';
    queryParams.value.order = 'desc';
  }
}

function handleSearch(keyword: string) {
  queryParams.value.search = keyword;
  queryParams.value.page = 1;
}

function handleCustomerFilter(customerId: string) {
  queryParams.value.customer_id = customerId;
  queryParams.value.page = 1;
}

function handleDateRangeFilter(val: any) {
  dateRangeValue.value = val;
  if (Array.isArray(val) && val.length > 0) {
    const start = val[0];
    const end = val[val.length - 1];

    if (start instanceof Date && !isNaN(start.getTime())) {
      const yyyy = start.getFullYear();
      const mm = String(start.getMonth() + 1).padStart(2, '0');
      const dd = String(start.getDate()).padStart(2, '0');
      queryParams.value.from = `${yyyy}-${mm}-${dd}`;
    }

    if (end instanceof Date && !isNaN(end.getTime())) {
      const yyyy = end.getFullYear();
      const mm = String(end.getMonth() + 1).padStart(2, '0');
      const dd = String(end.getDate()).padStart(2, '0');
      queryParams.value.to = `${yyyy}-${mm}-${dd}`;
    }
  } else {
    queryParams.value.from = '';
    queryParams.value.to = '';
  }
  queryParams.value.page = 1;
}

function handleResetFilters() {
  dateRangeValue.value = null;
  queryParams.value.customer_id = '';
  queryParams.value.from = '';
  queryParams.value.to = '';
  queryParams.value.search = '';
  queryParams.value.page = 1;
}
</script>

<style lang="scss" src="../styles/orders.scss" />
