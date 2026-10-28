<!--
  Customer delete confirmation modal dialog.
  Proportional icon box, tight typography, and friendly wording.
-->
<template>
  <v-dialog
    :model-value="modelValue"
    max-width="400"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card class="pa-5 rounded-xl border elevation-6 delete-dialog-card">
      <!-- Header with Icon Circle -->
      <div class="d-flex align-center gap-3 mb-3">
        <div class="delete-icon-circle d-flex align-center justify-center">
          <v-icon size="22" color="#EF4444">mdi-account-remove-outline</v-icon>
        </div>
        <div class="d-flex flex-column justify-center">
          <h3 class="dialog-title-text">
            Hapus Pelanggan
          </h3>
          <span class="dialog-subtitle-text">
            Konfirmasi tindakan
          </span>
        </div>
      </div>

      <!-- Clear direct wording -->
      <p class="text-body-2 text-grey-darken-2 my-3" style="line-height: 1.5;">
        Apakah Anda yakin ingin menghapus data pelanggan <strong>{{ customer?.customer_name }}</strong>?
      </p>

      <!-- Actions Buttons -->
      <div class="d-flex justify-end gap-2 mt-4">
        <v-btn
          variant="tonal"
          color="grey-darken-1"
          rounded="lg"
          class="text-caption font-weight-semibold"
          :disabled="deleting"
          @click="$emit('update:modelValue', false)"
        >
          Batal
        </v-btn>
        <v-btn
          color="#EF4444"
          rounded="lg"
          class="text-caption font-weight-bold text-white px-4"
          elevation="0"
          :loading="deleting"
          @click="$emit('confirm')"
        >
          Hapus
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { Customer } from '../types/customer.types';

interface Props {
  modelValue: boolean;
  customer?: Customer | null;
  deleting?: boolean;
}

defineProps<Props>();
defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
}>();
</script>

<style scoped lang="scss">
.delete-dialog-card {
  background-color: #ffffff !important;
  border-color: #e5e7eb !important;
}

.delete-icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  flex-shrink: 0;
}

.dialog-title-text {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.25;
  margin: 0;
}

.dialog-subtitle-text {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.3;
}
</style>

