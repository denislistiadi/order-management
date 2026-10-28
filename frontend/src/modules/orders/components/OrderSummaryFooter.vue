<template>
  <div class="order-summary-footer">
    <!-- General Server Error Notice -->
    <div
      v-if="generalError"
      class="order-error-alert"
      data-testid="order-general-error"
    >
      <div class="alert-icon-wrapper">
        <v-icon size="20" color="error">mdi-alert-circle</v-icon>
      </div>
      <div class="alert-content">
        <div class="alert-title">Transaksi Tidak Dapat Diproses</div>
        <div class="alert-message">{{ generalError }}</div>
      </div>
    </div>

    <!-- Summary Box -->
    <div class="order-summary-box">
      <div class="summary-info">
        <div class="summary-label">Total Item Belanja</div>
        <div class="summary-count">{{ totalQuantity }} unit ({{ totalVariations }} variasi produk)</div>
      </div>

      <div class="summary-total">
        <div class="total-label">Total Pembayaran</div>
        <div class="total-amount" data-testid="total-amount-display">{{ formatCurrency(grandTotal) }}</div>
      </div>
    </div>

    <!-- Submit Action Button -->
    <div class="d-flex justify-end mt-4">
      <v-btn
        prepend-icon="mdi-cash-register"
        class="btn-submit-order"
        :loading="isSubmitting"
        :disabled="!isFormValid || isSubmitting"
        data-testid="submit-order-btn"
        @click="emit('submit')"
      >
        Buat Order Penjualan
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '@/core/utils/formatters';

interface Props {
  totalQuantity: number;
  totalVariations: number;
  grandTotal: number;
  generalError?: string | null;
  isSubmitting: boolean;
  isFormValid: boolean;
}

withDefaults(defineProps<Props>(), {
  generalError: null,
});

const emit = defineEmits<{
  (e: 'submit'): void;
}>();
</script>
