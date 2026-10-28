<!--
  Logout confirmation modal dialog component.
  Provides explicit user confirmation before session termination and token revocation.
-->
<template>
  <v-dialog
    :model-value="modelValue"
    max-width="420"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card class="pa-5 rounded-xl border elevation-6 logout-dialog-card">
      <div class="d-flex align-center gap-3 mb-3">
        <div class="logout-icon-circle d-flex align-center justify-center">
          <v-icon size="24" color="#EF4444">mdi-logout-variant</v-icon>
        </div>
        <div>
          <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4 mb-0">
            Konfirmasi Keluar
          </h3>
          <span class="text-caption text-grey">
            Sesi akun Anda akan diakhiri
          </span>
        </div>
      </div>

      <p class="text-body-2 text-grey-darken-2 my-3" style="line-height: 1.5;">
        Apakah Anda yakin ingin keluar dari sistem <strong>OrderFlow</strong>? Token sesi Anda akan dicabut dan Anda harus memasukkan kredensial kembali untuk masuk.
      </p>

      <div class="d-flex justify-end gap-2 mt-4">
        <v-btn
          id="cancel-logout-btn"
          variant="tonal"
          color="grey-darken-1"
          rounded="lg"
          class="text-caption font-weight-semibold"
          :disabled="loading"
          @click="$emit('update:modelValue', false)"
        >
          Batal
        </v-btn>
        <v-btn
          id="confirm-logout-btn"
          color="#EF4444"
          rounded="lg"
          class="text-caption font-weight-bold text-white px-4"
          elevation="0"
          :loading="loading"
          @click="$emit('confirm')"
        >
          Ya, Keluar
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  loading?: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
}>();
</script>

<style scoped lang="scss">
.logout-dialog-card {
  background-color: #FFFFFF !important;
  border-color: #E5E7EB !important;
}

.logout-icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: #FEF2F2;
  border: 1px solid #FEE2E2;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}
</style>
