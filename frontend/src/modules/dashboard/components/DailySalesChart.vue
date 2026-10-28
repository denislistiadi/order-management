<template>
  <div class="section-card pa-4 pa-sm-5 fill-height d-flex flex-column justify-space-between">
    <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-3 mb-md-4">
      <div>
        <h2 class="section-title mb-0-5">
          Penjualan Harian
        </h2>
        <p class="section-subtitle text-grey">
          Tren omzet penjualan toko 7 hari terakhir.
        </p>
      </div>

      <!-- Legend: Only Sales Revenue (Pesanan removed as instructed) -->
      <div class="d-flex align-center text-caption font-weight-medium">
        <div class="d-flex align-center">
          <span class="legend-indicator bg-orange mr-1-5" />
          <span class="text-grey-darken-2 font-weight-semibold">Penjualan (Rp)</span>
        </div>
      </div>
    </div>

    <!-- Financial chart canvas -->
    <div class="chart-canvas-box pa-3 pa-sm-4 pt-6">
      <!-- Main Plot Area where grid and bars share the exact same coordinate space -->
      <div class="chart-plot-area">
        <!-- Y-Axis reference lines spanning top to bottom (Rp Max to Rp 0) -->
        <div class="chart-grid-lines">
          <div class="grid-line">
            <span class="grid-label font-mono">{{ formatAxisLabel(maxDailyRevenue) }}</span>
            <div class="grid-rule" />
          </div>
          <div class="grid-line">
            <span class="grid-label font-mono">{{ formatAxisLabel(maxDailyRevenue * 0.75) }}</span>
            <div class="grid-rule" />
          </div>
          <div class="grid-line">
            <span class="grid-label font-mono">{{ formatAxisLabel(maxDailyRevenue * 0.5) }}</span>
            <div class="grid-rule" />
          </div>
          <div class="grid-line">
            <span class="grid-label font-mono">{{ formatAxisLabel(maxDailyRevenue * 0.25) }}</span>
            <div class="grid-rule" />
          </div>
          <div class="grid-line grid-line-zero">
            <span class="grid-label font-mono text-grey-darken-2 font-weight-bold">Rp 0</span>
            <div class="grid-rule grid-rule-zero" />
          </div>
        </div>

        <!-- Bars Layer: Rooted directly on the Rp 0 baseline rule -->
        <div class="chart-bars-layer" data-testid="daily-sales-chart">
          <div
            v-for="(day, idx) in items"
            :key="idx"
            class="chart-bar-slot"
          >
            <!-- Hover card tooltip -->
            <div class="bar-hover-popover pa-2 text-center">
              <div class="tooltip-amount font-weight-bold text-white leading-tight">
                {{ formatCurrency(day.revenue) }}
              </div>
              <div class="tooltip-date text-caption text-grey-lighten-2 mt-0-5">
                {{ day.label }}
              </div>
            </div>

            <!-- Bar column anchored to baseline -->
            <div
              class="bar-column-fill"
              :style="{
                height: `${maxDailyRevenue > 0 ? (day.revenue / maxDailyRevenue) * 100 : 0}%`,
                minHeight: day.revenue > 0 ? '4px' : '0px'
              }"
            />
          </div>
        </div>
      </div>

      <!-- X-Axis Date Labels placed strictly below the Rp 0 baseline -->
      <div class="chart-x-axis">
        <div
          v-for="(day, idx) in items"
          :key="idx"
          class="bar-date-label"
        >
          {{ day.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DailySalesItem } from '../types/dashboard.types';
import { formatCurrency } from '@/core/utils/formatters';

interface Props {
  items: DailySalesItem[];
}

const props = defineProps<Props>();

const maxDailyRevenue = computed(() => {
  if (!props.items || props.items.length === 0) return 1000000;
  const max = Math.max(...props.items.map((d) => d.revenue));
  return max > 0 ? max : 1000000;
});

function formatAxisLabel(val: number): string {
  if (val >= 1000000000) {
    return `Rp ${(val / 1000000000).toFixed(1)} M`;
  }
  if (val >= 1000000) {
    return `Rp ${(val / 1000000).toFixed(0)} Jt`;
  }
  if (val >= 1000) {
    return `Rp ${(val / 1000).toFixed(0)} Rb`;
  }
  return 'Rp 0';
}
</script>
