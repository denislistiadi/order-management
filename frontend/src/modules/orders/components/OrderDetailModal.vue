<template>
  <v-dialog
    :model-value="modelValue"
    max-width="640"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card v-if="order" class="pa-5 rounded-xl border order-detail-modal" data-testid="order-detail-modal">
      <!-- Modal Header -->
      <div class="d-flex align-center justify-space-between mb-4 pb-3 border-b">
        <div>
          <div class="text-caption text-grey font-weight-medium">Rincian Transaksi Penjualan</div>
          <h2 class="text-h6 font-weight-bold font-mono text-grey-darken-4 mt-0-5" data-testid="modal-order-number">
            {{ order.order_number }}
          </h2>
        </div>
        <v-chip color="success" variant="tonal" size="small" class="font-weight-bold">
          Selesai
        </v-chip>
      </div>

      <!-- Transaction & Customer Info Grid -->
      <v-row dense class="mb-4">
        <v-col cols="12" sm="6">
          <div class="pa-3 bg-grey-lighten-4 rounded-lg">
            <span class="text-caption text-grey-darken-1 font-weight-semibold uppercase">Informasi Pelanggan</span>
            <div class="text-body-2 font-weight-bold text-grey-darken-4 mt-1">{{ order.customer_name }}</div>
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <div class="pa-3 bg-grey-lighten-4 rounded-lg">
            <span class="text-caption text-grey-darken-1 font-weight-semibold uppercase">Waktu Transaksi</span>
            <div class="text-body-2 font-weight-bold text-grey-darken-4 font-mono mt-1">
              {{ formatDate(order.order_date) }}
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Items Table -->
      <div class="table-responsive-wrapper mb-4">
        <v-table density="compact" class="border rounded-lg">
          <thead>
            <tr class="bg-grey-lighten-4">
              <th class="text-center font-weight-bold text-caption text-grey-darken-2" style="width: 40px;">#</th>
              <th class="font-weight-bold text-caption text-grey-darken-2">PRODUK BARANG</th>
              <th class="text-center font-weight-bold text-caption text-grey-darken-2" style="width: 70px;">QTY</th>
              <th class="text-right font-weight-bold text-caption text-grey-darken-2" style="width: 140px;">HARGA SATUAN</th>
              <th class="text-right font-weight-bold text-caption text-grey-darken-2" style="width: 140px;">SUBTOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in order.items" :key="item.id || idx">
              <td class="text-center font-weight-semibold text-caption text-grey-darken-1">{{ idx + 1 }}</td>
              <td>
                <div class="font-weight-semibold text-body-2">{{ item.product_name }}</div>
                <div class="text-caption text-grey font-mono">{{ item.product_code }}</div>
              </td>
              <td class="text-center font-weight-bold">{{ item.quantity }}</td>
              <td class="text-right font-mono">{{ formatCurrency(item.unit_price) }}</td>
              <td class="text-right font-mono font-weight-bold">{{ formatCurrency(item.subtotal) }}</td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <!-- Total Summary Bar -->
      <div class="d-flex align-center justify-space-between pa-4 bg-orange-subtle rounded-lg mb-4">
        <span class="text-subtitle-2 font-weight-bold text-grey-darken-3">Total Pembayaran</span>
        <span class="text-h6 font-weight-bold text-primary font-mono" data-testid="modal-total-amount">
          {{ formatCurrency(order.total_amount) }}
        </span>
      </div>

      <!-- Modal Actions -->
      <div class="d-flex justify-end">
        <v-btn
          variant="tonal"
          color="grey-darken-2"
          data-testid="modal-close-btn"
          @click="emit('update:modelValue', false)"
        >
          Tutup
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { Order } from '../types/order.types';
import { formatCurrency, formatDate } from '@/core/utils/formatters';

interface Props {
  modelValue: boolean;
  order: Order | null;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<style scoped lang="scss">
.order-detail-modal {
  background-color: #ffffff;
}

.bg-orange-subtle {
  background-color: #fff7ed;
  border: 1px solid #fed7aa;
}
</style>

