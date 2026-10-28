<!--
  Dashboard overview screen component.
  Displays summary metric cards, daily sales analytics, top product distribution donut chart,
  and low stock critical inventory table.
-->
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

    <!-- 4 Summary metric KPI cards -->
    <v-row class="mb-3 mb-md-5" dense>
      <!-- Card 1: Total Transaksi -->
      <v-col cols="12" sm="6" lg="3">
        <div class="kpi-card pa-4 d-flex flex-column justify-space-between fill-height">
          <div>
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="kpi-label">Total Transaksi</span>
              <div class="kpi-icon-box bg-orange-subtle">
                <v-icon color="#FF5B00" size="18">mdi-receipt-text-outline</v-icon>
              </div>
            </div>
            <div class="kpi-value mb-1">
              {{ totalTransactions }}
              <span class="kpi-unit">Pesanan</span>
            </div>
          </div>
          <div class="d-flex align-center kpi-trend text-success mt-2">
            <v-icon size="13" class="mr-1">mdi-arrow-up-right</v-icon>
            <span>+14.8% dari bulan lalu</span>
          </div>
        </div>
      </v-col>

      <!-- Card 2: Total Penjualan (Rp) -->
      <v-col cols="12" sm="6" lg="3">
        <div class="kpi-card pa-4 d-flex flex-column justify-space-between fill-height">
          <div>
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="kpi-label">Total Penjualan (Rp)</span>
              <div class="kpi-icon-box bg-emerald-subtle">
                <v-icon color="#10B981" size="18">mdi-cash-multiple</v-icon>
              </div>
            </div>
            <div class="kpi-value-currency mb-1">
              {{ formatCurrency(totalRevenue) }}
            </div>
          </div>
          <div class="d-flex align-center kpi-trend text-success mt-2">
            <v-icon size="13" class="mr-1">mdi-arrow-up-right</v-icon>
            <span>+22.4% peningkatan omzet</span>
          </div>
        </div>
      </v-col>

      <!-- Card 3: Total Produk -->
      <v-col cols="12" sm="6" lg="3">
        <div class="kpi-card pa-4 d-flex flex-column justify-space-between fill-height">
          <div>
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="kpi-label">Total Produk</span>
              <div class="kpi-icon-box bg-blue-subtle">
                <v-icon color="#3B82F6" size="18">mdi-package-variant-closed</v-icon>
              </div>
            </div>
            <div class="kpi-value mb-1">
              {{ totalProducts }}
              <span class="kpi-unit">Item</span>
            </div>
          </div>
          <div class="d-flex align-center kpi-subtext text-grey mt-2">
            <span>Katalog produk aktif</span>
          </div>
        </div>
      </v-col>

      <!-- Card 4: Total Pelanggan -->
      <v-col cols="12" sm="6" lg="3">
        <div class="kpi-card pa-4 d-flex flex-column justify-space-between fill-height">
          <div>
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="kpi-label">Total Pelanggan</span>
              <div class="kpi-icon-box bg-purple-subtle">
                <v-icon color="#8B5CF6" size="18">mdi-account-group-outline</v-icon>
              </div>
            </div>
            <div class="kpi-value mb-1">
              {{ totalCustomers }}
              <span class="kpi-unit">Pelanggan</span>
            </div>
          </div>
          <div class="d-flex align-center kpi-subtext text-grey mt-2">
            <span>Terdaftar di database</span>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Mid Section: Daily Transactions Chart and Donut Chart of Top 5 Products -->
    <v-row class="mb-3 mb-md-5" dense>
      <!-- Left: Chart Transaksi Harian -->
      <v-col cols="12" lg="7">
        <div class="section-card pa-4 pa-sm-5 fill-height d-flex flex-column justify-space-between">
          <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-3 mb-md-4">
            <div>
              <h2 class="section-title mb-0-5">
                Transaksi Harian
              </h2>
              <p class="section-subtitle text-grey">
                Akumulasi penjualan dan volume pesanan 7 hari terakhir.
              </p>
            </div>

            <!-- Legend with explicit margins -->
            <div class="d-flex align-center text-caption font-weight-medium">
              <div class="d-flex align-center mr-4">
                <span class="legend-indicator bg-orange mr-1-5" />
                <span class="text-grey-darken-2">Penjualan (Rp)</span>
              </div>
              <div class="d-flex align-center">
                <span class="legend-indicator bg-dark mr-1-5" />
                <span class="text-grey-darken-2">Pesanan</span>
              </div>
            </div>
          </div>

          <!-- Financial chart canvas -->
          <div class="chart-canvas-box pa-2 pa-sm-3">
            <!-- Y-Axis reference lines -->
            <div class="chart-grid-lines d-flex flex-column justify-space-between">
              <div class="grid-line d-flex align-center">
                <span class="grid-label font-mono">Rp 40 Jt</span>
                <div class="grid-rule flex-grow-1" />
              </div>
              <div class="grid-line d-flex align-center">
                <span class="grid-label font-mono">Rp 30 Jt</span>
                <div class="grid-rule flex-grow-1" />
              </div>
              <div class="grid-line d-flex align-center">
                <span class="grid-label font-mono">Rp 20 Jt</span>
                <div class="grid-rule flex-grow-1" />
              </div>
              <div class="grid-line d-flex align-center">
                <span class="grid-label font-mono">Rp 10 Jt</span>
                <div class="grid-rule flex-grow-1" />
              </div>
              <div class="grid-line d-flex align-center">
                <span class="grid-label font-mono">Rp 0</span>
                <div class="grid-rule flex-grow-1" />
              </div>
            </div>

            <!-- Chart columns -->
            <div class="chart-columns-container d-flex align-end justify-space-around">
              <div
                v-for="(day, idx) in dailyTransactions"
                :key="idx"
                class="chart-bar-group d-flex flex-column align-center"
              >
                <!-- Hover card tooltip -->
                <div class="bar-hover-popover mb-2 pa-2 text-center">
                  <div class="tooltip-amount font-weight-bold text-white leading-tight">
                    {{ formatCurrency(day.revenue) }}
                  </div>
                  <div class="tooltip-count text-orange-accent font-weight-semibold">
                    {{ day.count }} Transaksi
                  </div>
                </div>

                <!-- Clean Bar without grey sleeve -->
                <div class="bar-column-wrapper d-flex align-end justify-center">
                  <div
                    class="bar-column-fill"
                    :style="{ height: `${(day.revenue / maxDailyRevenue) * 100}%` }"
                  />
                </div>

                <!-- X-Axis date label -->
                <div class="bar-date-label mt-2">
                  {{ day.label }}
                </div>
                <div class="bar-count-subtext text-grey">
                  {{ day.count }} trx
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-col>

      <!-- Right: Donut Chart 5 Produk Terlaris -->
      <v-col cols="12" lg="5">
        <div class="section-card pa-4 pa-sm-5 fill-height d-flex flex-column justify-space-between">
          <div class="mb-2">
            <div class="d-flex align-center justify-space-between mb-0-5">
              <h2 class="section-title">
                Produk Terlaris
              </h2>
              <v-chip size="x-small" color="#FF5B00" variant="tonal" class="font-weight-bold" style="font-size: 0.6875rem;">
                Top 5
              </v-chip>
            </div>
            <p class="section-subtitle text-grey">
              Distribusi porsi penjualan berdasarkan kuantitas unit terjual.
            </p>
          </div>

          <!-- SVG Donut Chart and Center Metric -->
          <div class="donut-chart-wrapper d-flex align-center justify-center my-2 position-relative">
            <svg viewBox="0 0 160 160" class="donut-svg">
              <!-- Background ring track -->
              <circle
                cx="80"
                cy="80"
                r="58"
                fill="none"
                stroke="#F1F3F5"
                stroke-width="15"
              />

              <!-- Segments for top 5 products with center rotation -->
              <circle
                v-for="segment in donutSegments"
                :key="segment.id"
                cx="80"
                cy="80"
                r="58"
                fill="none"
                :stroke="segment.color"
                stroke-width="15"
                :stroke-dasharray="`${segment.length} ${circumference - segment.length}`"
                :stroke-dashoffset="segment.offset"
                stroke-linecap="round"
                class="donut-segment"
                transform="rotate(-90 80 80)"
              />
            </svg>

            <!-- Center label in donut hole -->
            <div class="donut-center-label text-center">
              <div class="donut-center-value font-weight-bold text-grey-darken-4 leading-tight">
                {{ totalTopSoldUnits }}
              </div>
              <div class="donut-center-subtext text-grey">
                Unit Terjual
              </div>
            </div>
          </div>

          <!-- Legend breakdown list with explicit spacing and responsive truncation -->
          <div class="donut-legend-list d-flex flex-column gap-1-5 mt-1">
            <div
              v-for="item in topProducts"
              :key="item.id"
              class="d-flex align-center justify-space-between py-1 px-2 rounded-lg hover-bg"
            >
              <div class="d-flex align-center overflow-hidden mr-2 flex-grow-1" style="min-width: 0;">
                <span class="legend-dot-sq mr-2 flex-shrink-0" :style="{ backgroundColor: item.color }" />
                <span class="legend-item-name text-grey-darken-3 text-truncate font-weight-medium">
                  {{ item.name }}
                </span>
              </div>
              <div class="d-flex align-center flex-shrink-0">
                <span class="legend-item-qty font-weight-bold text-grey-darken-4 mr-2">
                  {{ item.soldCount }} unit
                </span>
                <span class="pct-badge font-mono font-weight-semibold">
                  {{ item.percentage }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Bottom Section: Full-width Table of Products with Stock < 5 -->
    <div class="section-card pa-4 pa-sm-5">
      <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-4">
        <div>
          <div class="d-flex align-center flex-wrap gap-2">
            <h2 class="section-title">
              Produk dengan Stok Menipis
            </h2>
            <span class="critical-badge font-weight-bold">
              {{ lowStockProducts.length }} Produk Kritis (&lt; 5)
            </span>
          </div>
          <p class="section-subtitle text-grey mt-1">
            Daftar inventaris produk yang menipis dan memerlukan pengadaan ulang.
          </p>
        </div>
      </div>

      <!-- Responsive horizontal scroll table wrapper -->
      <div class="table-responsive-wrapper">
        <v-table class="border rounded-xl custom-data-table" density="comfortable">
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
              v-for="item in lowStockProducts"
              :key="item.id"
              class="table-item-row"
            >
              <!-- Product Code -->
              <td style="width: 130px;">
                <span class="code-badge font-mono">
                  {{ item.code }}
                </span>
              </td>

              <!-- Product Name -->
              <td style="min-width: 200px;">
                <div class="table-product-name font-weight-bold text-grey-darken-4">
                  {{ item.name }}
                </div>
              </td>

              <!-- Unit Price (Right Aligned) -->
              <td class="text-right pr-6" style="width: 170px;">
                <span class="table-price font-weight-bold text-grey-darken-3 font-mono">
                  {{ formatCurrency(item.price) }}
                </span>
              </td>

              <!-- Remaining Stock (Centered Structured Pill) -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatCurrency } from '@/core/utils/formatters';

// Metric KPI states
const totalTransactions = ref(30);
const totalRevenue = ref(184250000);
const totalProducts = ref(20);
const totalCustomers = ref(15);

// Daily transactions dataset (past 7 days)
const dailyTransactions = ref([
  { label: '22 Okt', count: 3, revenue: 16800000 },
  { label: '23 Okt', count: 5, revenue: 28450000 },
  { label: '24 Okt', count: 4, revenue: 21900000 },
  { label: '25 Okt', count: 6, revenue: 34500000 },
  { label: '26 Okt', count: 2, revenue: 14200000 },
  { label: '27 Okt', count: 4, revenue: 29800000 },
  { label: '28 Okt', count: 6, revenue: 38600000 },
]);

const maxDailyRevenue = computed(() => {
  const max = Math.max(...dailyTransactions.value.map((d) => d.revenue));
  return max > 0 ? max : 1;
});

// Top 5 best selling products dataset
const topProducts = ref([
  {
    id: 1,
    code: 'PRD-001',
    name: 'Logitech MX Master 3S Wireless Mouse',
    soldCount: 22,
    color: '#FF5B00',
    percentage: 29,
  },
  {
    id: 2,
    code: 'PRD-002',
    name: 'Keychron K2 Mechanical Keyboard RGB',
    soldCount: 18,
    color: '#1A1C20',
    percentage: 24,
  },
  {
    id: 3,
    code: 'PRD-005',
    name: 'Apple iPad Air M2 11" 128GB WiFi',
    soldCount: 14,
    color: '#3B82F6',
    percentage: 19,
  },
  {
    id: 4,
    code: 'PRD-004',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    soldCount: 12,
    color: '#10B981',
    percentage: 16,
  },
  {
    id: 5,
    code: 'PRD-003',
    name: 'Dell UltraSharp 27" 4K Monitor U2723QE',
    soldCount: 9,
    color: '#8B5CF6',
    percentage: 12,
  },
]);

const totalTopSoldUnits = computed(() => {
  return topProducts.value.reduce((acc, p) => acc + p.soldCount, 0);
});

// Radius 58 -> Circumference = 2 * PI * 58 ~= 364.42
const circumference = 2 * Math.PI * 58;

// Computed segments for donut chart
const donutSegments = computed(() => {
  let accumulatedOffset = 0;
  return topProducts.value.map((product) => {
    const fraction = totalTopSoldUnits.value > 0 ? product.soldCount / totalTopSoldUnits.value : 0;
    const length = fraction * circumference;
    const segment = {
      id: product.id,
      color: product.color,
      length,
      offset: -accumulatedOffset,
    };
    accumulatedOffset += length;
    return segment;
  });
});

// Critical stock products (stock < 5)
const lowStockProducts = ref([
  {
    id: 1,
    code: 'PRD-019',
    name: 'CalDigit TS4 Thunderbolt 4 Dock',
    price: 6890000,
    stock: 2,
  },
  {
    id: 2,
    code: 'PRD-013',
    name: 'Shure MV7 USB Podcast Microphone',
    price: 3950000,
    stock: 3,
  },
  {
    id: 3,
    code: 'PRD-012',
    name: 'Elgato Stream Deck MK.2 15 Keys',
    price: 2450000,
    stock: 4,
  },
]);
</script>

<style scoped lang="scss">
.dashboard-page {
  background-color: #F8F9FA;
}

.page-title {
  font-size: 1.1875rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.01em;
}

.page-subtitle {
  font-size: 0.8125rem;
  line-height: 1.4;
}

.mr-1-5 {
  margin-right: 6px;
}

.kpi-card {
  background-color: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  }
}

.kpi-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6B7280;
}

.kpi-value {
  font-size: 1.45rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.01em;
}

.kpi-value-currency {
  font-size: 1.35rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.01em;
}

.kpi-unit {
  font-size: 0.8125rem;
  font-weight: 400;
  color: #9CA3AF;
  margin-left: 2px;
}

.kpi-trend {
  font-size: 0.6875rem;
}

.kpi-subtext {
  font-size: 0.6875rem;
}

.kpi-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.bg-orange-subtle {
    background-color: rgba(255, 91, 0, 0.08);
  }

  &.bg-emerald-subtle {
    background-color: rgba(16, 185, 129, 0.08);
  }

  &.bg-blue-subtle {
    background-color: rgba(59, 130, 246, 0.08);
  }

  &.bg-purple-subtle {
    background-color: rgba(139, 92, 246, 0.08);
  }
}

.section-card {
  background-color: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.section-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
}

.section-subtitle {
  font-size: 0.75rem;
}

.legend-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;

  &.bg-orange {
    background-color: #FF5B00;
  }

  &.bg-dark {
    background-color: #1A1C20;
  }
}

.chart-canvas-box {
  position: relative;
  background-color: #FAFAFB;
  border: 1px solid #F3F4F6;
  border-radius: 10px;
  min-height: 250px;
}

.chart-grid-lines {
  position: absolute;
  top: 14px;
  bottom: 48px;
  left: 12px;
  right: 12px;
  pointer-events: none;
}

.grid-line {
  height: 1px;
}

.grid-label {
  width: 58px;
  font-size: 0.6875rem;
  color: #9CA3AF;
  flex-shrink: 0;
}

.grid-rule {
  height: 1px;
  background-color: #ECEEF2;
}

.chart-columns-container {
  height: 200px;
  margin-left: 60px;
  position: relative;
  z-index: 2;
}

.chart-bar-group {
  flex: 1;
  height: 100%;
  position: relative;
  cursor: pointer;

  &:hover {
    .bar-hover-popover {
      opacity: 1;
      visibility: visible;
      transform: translateY(-3px);
    }

    .bar-column-fill {
      background: linear-gradient(180deg, #FF7A29 0%, #FF5B00 100%);
      box-shadow: 0 2px 8px rgba(255, 91, 0, 0.35);
    }
  }
}

.bar-hover-popover {
  position: absolute;
  top: -8px;
  background-color: #1A1C20;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: all 0.15s ease;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
}

.tooltip-amount {
  font-size: 0.75rem;
}

.tooltip-count {
  font-size: 0.625rem;
}

.bar-column-wrapper {
  width: 26px;
  height: 130px;
  display: flex;
  align-items: flex-end;
}

.bar-column-fill {
  width: 100%;
  background: linear-gradient(180deg, #FF6A14 0%, #FF5B00 100%);
  border-radius: 6px 6px 0 0;
  transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.bar-date-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #374151;
}

.bar-count-subtext {
  font-size: 0.625rem;
}

/* Donut Chart */
.donut-chart-wrapper {
  width: 156px;
  height: 156px;
  margin: 0 auto;
}

.donut-svg {
  width: 100%;
  height: 100%;
}

.donut-segment {
  transition: stroke-width 0.15s ease, opacity 0.15s ease;

  &:hover {
    stroke-width: 18;
    opacity: 0.9;
  }
}

.donut-center-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.donut-center-value {
  font-size: 1.25rem;
  letter-spacing: -0.01em;
}

.donut-center-subtext {
  font-size: 0.625rem;
}

.legend-dot-sq {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  display: inline-block;
  flex-shrink: 0;
}

.legend-item-name {
  font-size: 0.75rem;
}

.legend-item-qty {
  font-size: 0.75rem;
}

.pct-badge {
  background-color: #F3F4F6;
  color: #4B5563;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.6875rem;
}

.hover-bg {
  transition: background-color 0.12s ease;

  &:hover {
    background-color: #F8F9FA;
  }
}

/* Critical badge in header */
.critical-badge {
  background-color: #FEE2E2;
  border: 1px solid #FECACA;
  color: #DC2626;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 0.72rem;
  display: inline-block;
}

/* Data table */
.custom-data-table {
  background-color: #FFFFFF !important;

  .table-header-row {
    background-color: #F9FAFB;
  }

  .table-th {
    font-size: 0.72rem !important;
    font-weight: 600 !important;
    color: #4B5563 !important;
    letter-spacing: 0.04em !important;
    padding-top: 12px !important;
    padding-bottom: 12px !important;
    border-bottom: 1px solid #E5E7EB !important;
  }

  .table-item-row {
    transition: background-color 0.12s ease;

    &:hover {
      background-color: #FBFBFC;
    }

    td {
      border-bottom: 1px solid #F3F4F6 !important;
      padding-top: 13px !important;
      padding-bottom: 13px !important;
      vertical-align: middle;
    }
  }
}

.code-badge {
  background-color: #F3F4F6;
  border: 1px solid #E5E7EB;
  color: #1F2937;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.table-product-name {
  font-size: 0.8125rem;
}

.table-price {
  font-size: 0.8125rem;
}

.status-warning-text {
  font-size: 0.75rem;
  color: #DC2626;
}

.stock-pill {
  background-color: #FEF2F2;
  border: 1px solid #FECACA;
  color: #DC2626;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
  display: inline-block;
}

.text-orange-accent {
  color: #FF5B00 !important;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.leading-tight {
  line-height: 1.25;
}

/* Responsive table wrapper */
.table-responsive-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 12px;

  .custom-data-table {
    min-width: 760px;
  }
}

/* Mobile responsive enhancements (< 600px) */
@media (max-width: 600px) {
  .page-title {
    font-size: 1.0625rem;
  }

  .page-subtitle {
    font-size: 0.75rem;
  }

  .kpi-card {
    padding: 12px 14px !important;
  }

  .kpi-value {
    font-size: 1.3rem !important;
  }

  .kpi-value-currency {
    font-size: 1.1875rem !important;
  }

  .section-card {
    padding: 14px !important;
    border-radius: 12px !important;
  }

  .section-title {
    font-size: 0.875rem;
  }

  /* Daily chart on mobile */
  .chart-canvas-box {
    padding: 8px 6px !important;
    min-height: 210px;
  }

  .chart-grid-lines {
    left: 4px;
    right: 4px;
    top: 10px;
    bottom: 42px;
  }

  .grid-label {
    width: 44px;
    font-size: 0.625rem;
  }

  .chart-columns-container {
    height: 165px;
    margin-left: 44px;
  }

  .bar-column-wrapper {
    width: 18px;
    height: 100px;
  }

  .bar-date-label {
    font-size: 0.625rem;
  }

  .bar-count-subtext {
    font-size: 0.5625rem;
  }

  /* Donut chart on mobile */
  .donut-chart-wrapper {
    width: 136px;
    height: 136px;
  }

  .donut-center-value {
    font-size: 1.125rem;
  }

  .legend-item-name {
    font-size: 0.6875rem;
  }

  .legend-item-qty {
    font-size: 0.6875rem;
  }

  .pct-badge {
    font-size: 0.625rem;
    padding: 1px 4px;
  }
}

/* Tablet responsive enhancements (601px - 960px) */
@media (min-width: 601px) and (max-width: 960px) {
  .kpi-card {
    padding: 14px !important;
  }

  .section-card {
    padding: 18px !important;
  }

  .chart-columns-container {
    margin-left: 52px;
  }
}
</style>
