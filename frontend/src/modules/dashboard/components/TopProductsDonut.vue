<template>
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

    <template v-if="items.length === 0">
      <div class="d-flex flex-column align-center justify-center py-8 text-center">
        <v-icon size="40" color="grey-lighten-2" class="mb-2">mdi-chart-donut</v-icon>
        <span class="text-caption text-grey">Belum ada riwayat penjualan produk.</span>
      </div>
    </template>

    <template v-else>
      <!-- SVG Donut Chart and Center Metric -->
      <div class="donut-chart-wrapper d-flex align-center justify-center my-2 position-relative" data-testid="top-products-donut">
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

          <!-- Segments for top 5 products -->
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
            {{ totalSoldUnits }}
          </div>
          <div class="donut-center-subtext text-grey">
            Unit Terjual
          </div>
        </div>
      </div>

      <!-- Legend breakdown list -->
      <div class="donut-legend-list d-flex flex-column gap-1-5 mt-1">
        <div
          v-for="item in styledItems"
          :key="item.id"
          class="d-flex align-center justify-space-between py-1 px-2 rounded-lg hover-bg"
        >
          <div class="d-flex align-center overflow-hidden mr-2 flex-grow-1" style="min-width: 0;">
            <span class="legend-dot-sq mr-2 flex-shrink-0" :style="{ backgroundColor: item.color }" />
            <span class="legend-item-name text-grey-darken-3 text-truncate font-weight-medium">
              {{ item.product_name }}
            </span>
          </div>
          <div class="d-flex align-center flex-shrink-0">
            <span class="legend-item-qty font-weight-bold text-grey-darken-4 mr-2">
              {{ item.sold_quantity }} unit
            </span>
            <span class="pct-badge font-mono font-weight-semibold">
              {{ item.percentage }}%
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TopProductItem } from '../types/dashboard.types';

interface Props {
  items: TopProductItem[];
}

const props = defineProps<Props>();

const palette = ['#FF5B00', '#1A1C20', '#3B82F6', '#10B981', '#8B5CF6'];

const styledItems = computed(() => {
  return props.items.map((item, index) => ({
    ...item,
    color: palette[index % palette.length],
  }));
});

const totalSoldUnits = computed(() => {
  return props.items.reduce((sum, item) => sum + item.sold_quantity, 0);
});

// Radius 58 -> Circumference = 2 * PI * 58 ~= 364.42
const circumference = 2 * Math.PI * 58;

const donutSegments = computed(() => {
  let accumulatedOffset = 0;
  return styledItems.value.map((product) => {
    const fraction = totalSoldUnits.value > 0 ? product.sold_quantity / totalSoldUnits.value : 0;
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
</script>

