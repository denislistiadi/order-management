<template>
  <tr class="order-item-row" :class="{ 'row-has-error': !!errorMessage || !!productError }">
    <!-- Item Sequence -->
    <td class="text-center font-weight-bold text-grey-darken-1" style="width: 48px;">
      {{ index + 1 }}
    </td>

    <!-- Product Selection -->
    <td style="min-width: 260px;">
      <v-select
        :model-value="modelValue.product_id"
        :items="productSelectItems"
        item-title="title"
        item-value="id"
        placeholder="Pilih produk barang..."
        density="compact"
        variant="outlined"
        hide-details
        :error="!!productError"
        data-testid="item-product-select"
        @update:model-value="onProductChange"
      >
        <template #item="{ props: itemProps, item }">
          <v-list-item v-bind="itemProps" :disabled="item.raw.stock === 0">
            <template #title>
              <div class="d-flex align-center justify-between">
                <span class="font-weight-semibold">{{ item.raw.product_name }}</span>
              </div>
            </template>
            <template #subtitle>
              <div class="d-flex align-center gap-2 mt-1">
                <span class="font-mono text-caption text-grey-darken-2">{{ item.raw.product_code }}</span>
                <span>•</span>
                <span class="font-weight-bold text-caption text-grey-darken-3">{{ formatCurrency(item.raw.price) }}</span>
                <span>•</span>
                <span
                  class="text-caption font-weight-bold"
                  :class="item.raw.stock > 0 ? 'text-emerald-600' : 'text-red-500'"
                >
                  Stok: {{ item.raw.stock }}
                </span>
              </div>
            </template>
          </v-list-item>
        </template>
      </v-select>
    </td>

    <!-- Available Stock Badge -->
    <td class="text-center" style="width: 120px;">
      <template v-if="selectedProduct">
        <v-chip
          size="small"
          :color="selectedProduct.stock > 5 ? 'success' : selectedProduct.stock > 0 ? 'warning' : 'error'"
          variant="tonal"
          class="font-weight-bold"
        >
          {{ selectedProduct.stock }} Unit
        </v-chip>
      </template>
      <span v-else class="text-grey-lighten-1">-</span>
    </td>

    <!-- Unit Price Snapshot -->
    <td class="text-right font-mono font-weight-semibold text-grey-darken-3" style="width: 140px;">
      {{ selectedProduct ? formatCurrency(selectedProduct.price) : '-' }}
    </td>

    <!-- Quantity Input -->
    <td style="width: 130px;">
      <v-text-field
        :model-value="modelValue.quantity"
        type="number"
        min="1"
        density="compact"
        variant="outlined"
        hide-details
        :error="!!errorMessage"
        data-testid="item-quantity-input"
        class="text-center"
        @update:model-value="onQuantityChange"
      />
    </td>

    <!-- Computed Subtotal -->
    <td class="text-right font-mono font-weight-bold text-grey-darken-4" style="width: 160px;">
      {{ formatCurrency(computedSubtotal) }}
    </td>

    <!-- Row Actions -->
    <td class="text-center" style="width: 60px;">
      <v-btn
        icon="mdi-trash-can-outline"
        size="small"
        variant="text"
        color="error"
        :disabled="!canDelete"
        data-testid="item-delete-btn"
        title="Hapus baris barang"
        @click="$emit('delete')"
      />
    </td>
  </tr>

  <!-- Dedicated Error Sub-Row to prevent column squishing and maintain alignment -->
  <tr v-if="errorMessage || productError" class="order-item-error-row">
    <td colspan="7">
      <div class="item-error-banner" data-testid="row-error-text">
        <v-icon size="16" color="error">mdi-alert-circle-outline</v-icon>
        <span class="error-message-text">{{ errorMessage || productError }}</span>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Product } from '@/modules/products/types/product.types';
import { formatCurrency } from '@/core/utils/formatters';

interface ItemValue {
  product_id: number | null;
  quantity: number;
}

const props = defineProps<{
  index: number;
  modelValue: ItemValue;
  products: Product[];
  canDelete: boolean;
  errorMessage?: string | null;
  productError?: string | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: ItemValue): void;
  (e: 'delete'): void;
}>();

const selectedProduct = computed(() => {
  if (!props.modelValue.product_id) return null;
  return props.products.find((p) => p.id === props.modelValue.product_id) || null;
});

const productSelectItems = computed(() => {
  return props.products.map((p) => ({
    id: p.id,
    product_name: p.product_name,
    product_code: p.product_code,
    price: p.price,
    stock: p.stock,
    title: `${p.product_code} - ${p.product_name} (Stok: ${p.stock})`,
  }));
});

const computedSubtotal = computed(() => {
  if (!selectedProduct.value) return 0;
  const priceNum = parseFloat(selectedProduct.value.price) || 0;
  return priceNum * (props.modelValue.quantity || 0);
});

function onProductChange(productId: number | null) {
  emit('update:modelValue', {
    ...props.modelValue,
    product_id: productId,
  });
}

function onQuantityChange(val: string | number) {
  const qty = typeof val === 'number' ? val : parseInt(val, 10);
  emit('update:modelValue', {
    ...props.modelValue,
    quantity: isNaN(qty) ? 0 : qty,
  });
}
</script>
