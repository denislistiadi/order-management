<template>
  <v-row class="mb-3 mb-md-5" dense>
    <!-- Card 1: Total Transaksi -->
    <v-col cols="12" sm="6" lg="3">
      <div class="kpi-card pa-4 d-flex flex-column justify-space-between fill-height">
        <template v-if="loading">
          <v-skeleton-loader type="list-item-two-line" />
        </template>
        <template v-else>
          <div>
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="kpi-label">Total Transaksi</span>
              <div class="kpi-icon-box bg-orange-subtle">
                <v-icon color="#FF5B00" size="18">mdi-receipt-text-outline</v-icon>
              </div>
            </div>
            <div class="kpi-value mb-1" data-testid="kpi-total-transactions">
              {{ totalTransactions }}
              <span class="kpi-unit">Transaksi</span>
            </div>
          </div>
          <div class="d-flex align-center kpi-subtext text-grey mt-2">
            <span>Akumulasi transaksi berhasil</span>
          </div>
        </template>
      </div>
    </v-col>

    <!-- Card 2: Total Penjualan (Rp) -->
    <v-col cols="12" sm="6" lg="3">
      <div class="kpi-card pa-4 d-flex flex-column justify-space-between fill-height">
        <template v-if="loading">
          <v-skeleton-loader type="list-item-two-line" />
        </template>
        <template v-else>
          <div>
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="kpi-label">Total Penjualan (Rp)</span>
              <div class="kpi-icon-box bg-emerald-subtle">
                <v-icon color="#10B981" size="18">mdi-cash-multiple</v-icon>
              </div>
            </div>
            <div class="kpi-value-currency mb-1" data-testid="kpi-total-revenue">
              {{ formatCurrency(totalRevenue) }}
            </div>
          </div>
          <div class="d-flex align-center kpi-subtext text-grey mt-2">
            <span>Total omzet penjualan</span>
          </div>
        </template>
      </div>
    </v-col>

    <!-- Card 3: Total Produk -->
    <v-col cols="12" sm="6" lg="3">
      <div class="kpi-card pa-4 d-flex flex-column justify-space-between fill-height">
        <template v-if="loading">
          <v-skeleton-loader type="list-item-two-line" />
        </template>
        <template v-else>
          <div>
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="kpi-label">Total Produk</span>
              <div class="kpi-icon-box bg-blue-subtle">
                <v-icon color="#3B82F6" size="18">mdi-package-variant-closed</v-icon>
              </div>
            </div>
            <div class="kpi-value mb-1" data-testid="kpi-total-products">
              {{ totalProducts }}
              <span class="kpi-unit">Item</span>
            </div>
          </div>
          <div class="d-flex align-center kpi-subtext text-grey mt-2">
            <span>Katalog produk aktif</span>
          </div>
        </template>
      </div>
    </v-col>

    <!-- Card 4: Total Pelanggan -->
    <v-col cols="12" sm="6" lg="3">
      <div class="kpi-card pa-4 d-flex flex-column justify-space-between fill-height">
        <template v-if="loading">
          <v-skeleton-loader type="list-item-two-line" />
        </template>
        <template v-else>
          <div>
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="kpi-label">Total Pelanggan</span>
              <div class="kpi-icon-box bg-purple-subtle">
                <v-icon color="#8B5CF6" size="18">mdi-account-group-outline</v-icon>
              </div>
            </div>
            <div class="kpi-value mb-1" data-testid="kpi-total-customers">
              {{ totalCustomers }}
              <span class="kpi-unit">Pelanggan</span>
            </div>
          </div>
          <div class="d-flex align-center kpi-subtext text-grey mt-2">
            <span>Pelanggan terdaftar</span>
          </div>
        </template>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { formatCurrency } from '@/core/utils/formatters';

interface Props {
  totalTransactions: number;
  totalRevenue: string | number;
  totalProducts: number;
  totalCustomers: number;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false,
});
</script>

