<template>
  <div class="dashboard-page pa-3 pa-sm-4 pa-md-6 fill-height overflow-y-auto">
    <!-- Top page header -->
    <div class="mb-4 mb-md-5">
      <h1 class="page-title mb-1">
        Ringkasan Eksekutif
      </h1>
      <p class="page-subtitle text-grey">
        Pantau performa penjualan, volume transaksi, dan level inventaris toko secara real-time.
      </p>
    </div>

    <!-- Error State Banner -->
    <div v-if="isError" class="pa-4 mb-4 rounded-xl border bg-red-lighten-5 d-flex align-center justify-space-between" data-testid="dashboard-error-banner">
      <div class="d-flex align-center gap-2">
        <v-icon color="error">mdi-alert-circle-outline</v-icon>
        <span class="text-caption font-weight-medium text-red-darken-3">
          Gagal memuat ringkasan data dashboard. Silakan periksa koneksi server Anda.
        </span>
      </div>
      <v-btn size="small" variant="tonal" color="error" @click="() => refetch()">
        Muat Ulang
      </v-btn>
    </div>

    <!-- 4 Summary metric KPI cards -->
    <DashboardKpiCards
      :total-transactions="summaryData.total_transactions"
      :total-revenue="summaryData.total_revenue"
      :total-products="summaryData.total_products"
      :total-customers="summaryData.total_customers"
      :loading="isLoading"
    />

    <!-- Mid Section: Daily Sales Revenue Chart and Donut Chart of Top 5 Products -->
    <v-row class="mb-3 mb-md-5" dense>
      <!-- Left: Chart Penjualan Harian (Sales Revenue Only) -->
      <v-col cols="12" lg="7">
        <DailySalesChart :items="summaryData.daily_sales" />
      </v-col>

      <!-- Right: Donut Chart 5 Produk Terlaris -->
      <v-col cols="12" lg="5">
        <TopProductsDonut :items="summaryData.top_products" />
      </v-col>
    </v-row>

    <!-- Bottom Section: Full-width Table of Products with Stock < 5 -->
    <LowStockTable :items="summaryData.low_stock_products" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DashboardKpiCards from '../components/DashboardKpiCards.vue';
import DailySalesChart from '../components/DailySalesChart.vue';
import TopProductsDonut from '../components/TopProductsDonut.vue';
import LowStockTable from '../components/LowStockTable.vue';
import { useDashboardSummaryQuery } from '../composables/useDashboard';
import { DashboardSummaryData } from '../types/dashboard.types';

const { data: apiResponse, isLoading, isError, refetch } = useDashboardSummaryQuery();

const defaultSummary: DashboardSummaryData = {
  total_transactions: 0,
  total_revenue: '0',
  total_products: 0,
  total_customers: 0,
  top_products: [],
  low_stock_products: [],
  daily_sales: [],
};

const summaryData = computed<DashboardSummaryData>(() => {
  return apiResponse.value?.data || defaultSummary;
});
</script>

<style lang="scss" src="../styles/dashboard.scss" />
