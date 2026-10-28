<template>
  <div class="section-card pa-4 pa-sm-5">
    <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-4">
      <div>
        <div class="d-flex align-center flex-wrap gap-2">
          <h2 class="section-title">
            Produk dengan Stok Menipis
          </h2>
          <span class="critical-badge font-weight-bold" data-testid="low-stock-count-badge">
            {{ items.length }} Produk Kritis (&lt; 5)
          </span>
        </div>
        <p class="section-subtitle text-grey mt-1">
          Daftar inventaris produk yang menipis dan memerlukan pengadaan ulang.
        </p>
      </div>
    </div>

    <!-- Empty state when no low stock -->
    <template v-if="items.length === 0">
      <div class="d-flex flex-column align-center justify-center py-8 text-center bg-grey-lighten-5 rounded-lg border">
        <v-icon size="40" color="success" class="mb-2">mdi-check-circle-outline</v-icon>
        <div class="text-subtitle-2 font-weight-semibold text-grey-darken-3">Inventaris Aman</div>
        <span class="text-caption text-grey">Seluruh stok barang saat ini mencukupi dan berada di atas batas kritis.</span>
      </div>
    </template>

    <!-- Responsive horizontal scroll table wrapper -->
    <div v-else class="table-responsive-wrapper">
      <v-table class="border rounded-xl custom-data-table" density="comfortable" data-testid="low-stock-table">
        <thead>
          <tr class="table-header-row">
            <th class="text-left table-th" style="width: 130px;">KODE</th>
            <th class="text-left table-th" style="min-width: 200px;">NAMA PRODUK</th>
            <th class="text-right pr-6 table-th" style="width: 170px;">HARGA SATUAN</th>
            <th class="text-center table-th" style="width: 150px;">SISA STOK</th>
            <th class="text-left table-th" style="width: 210px;">STATUS</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            class="table-item-row"
          >
            <!-- Product Code -->
            <td style="width: 130px;">
              <span class="code-badge font-mono">
                {{ item.product_code }}
              </span>
            </td>

            <!-- Product Name -->
            <td style="min-width: 200px;">
              <div class="table-product-name font-weight-bold text-grey-darken-4">
                {{ item.product_name }}
              </div>
            </td>

            <!-- Unit Price -->
            <td class="text-right pr-6" style="width: 170px;">
              <span class="table-price font-weight-bold text-grey-darken-3 font-mono">
                {{ formatCurrency(item.price) }}
              </span>
            </td>

            <!-- Remaining Stock -->
            <td class="text-center" style="width: 150px;">
              <span class="stock-pill">
                {{ item.stock }} Unit Tersisa
              </span>
            </td>

            <!-- Status Indicator -->
            <td style="width: 210px;">
              <div class="d-flex align-center">
                <v-icon size="16" color="#EF4444" class="mr-1-5">mdi-alert-circle</v-icon>
                <span class="status-warning-text font-weight-semibold">
                  Stok Kritis - Perlu Restock
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LowStockProductItem } from '../types/dashboard.types';
import { formatCurrency } from '@/core/utils/formatters';

interface Props {
  items: LowStockProductItem[];
}

defineProps<Props>();
</script>

