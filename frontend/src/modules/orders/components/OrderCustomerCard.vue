<template>
  <v-card class="order-card">
    <div class="card-section-title">
      <v-icon size="18" color="primary">mdi-account-outline</v-icon>
      <span>Informasi Pelanggan</span>
    </div>

    <v-row dense>
      <v-col cols="12" md="6">
        <v-select
          :model-value="modelValue"
          :items="customerSelectItems"
          item-title="title"
          item-value="id"
          label="Pilih Pelanggan *"
          placeholder="Pilih nama pelanggan..."
          density="comfortable"
          variant="outlined"
          :loading="loading"
          :error-messages="errorMessage"
          data-testid="customer-select"
          @update:model-value="handleCustomerSelect"
        >
          <template #item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps">
              <template #title>
                <span class="font-weight-semibold">{{ item.raw.customer_name }}</span>
              </template>
              <template #subtitle>
                <span class="text-caption text-grey">{{ item.raw.customer_address }}</span>
              </template>
            </v-list-item>
          </template>

          <template #no-data>
            <div class="pa-3 text-caption text-grey text-center">
              Belum ada pelanggan terdaftar. Silakan tambahkan melalui menu Pelanggan.
            </div>
          </template>
        </v-select>
      </v-col>

      <v-col cols="12" md="6">
        <div v-if="selectedCustomer" class="d-flex flex-column pa-3 bg-grey-lighten-4 rounded-lg">
          <span class="text-caption text-grey-darken-1 font-weight-semibold uppercase">Detail Alamat Pengiriman</span>
          <span class="text-body-2 font-weight-medium text-grey-darken-3">{{ selectedCustomer.customer_address }}</span>
          <span class="text-caption text-grey-darken-2 mt-1 font-mono">Telepon: {{ selectedCustomer.phone || '-' }}</span>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Customer } from '@/modules/customers/types/customer.types';

interface Props {
  modelValue: string | null;
  customers: Customer[];
  loading?: boolean;
  errorMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  errorMessage: undefined,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void;
  (e: 'clearErrors'): void;
}>();

const customerSelectItems = computed(() => {
  return props.customers.map((c) => ({
    id: c.id,
    customer_name: c.customer_name,
    customer_address: c.customer_address,
    phone: c.phone,
    title: `${c.customer_name} - ${c.customer_address}`,
  }));
});

const selectedCustomer = computed(() => {
  return props.customers.find((c) => c.id === props.modelValue) || null;
});

function handleCustomerSelect(value: string | null) {
  emit('update:modelValue', value);
  emit('clearErrors');
}
</script>

