<template>
  <div class="order-items-section">
    <div class="card-section-title">
      <v-icon size="18" color="primary">mdi-cart-outline</v-icon>
      <span>Daftar Barang Belanja</span>
    </div>

    <!-- Items Table -->
    <div class="items-table-wrapper mb-4">
      <table class="order-items-table">
        <thead>
          <tr>
            <th class="text-center">#</th>
            <th>Produk Barang</th>
            <th class="text-center">Stok</th>
            <th class="text-right">Harga Satuan</th>
            <th class="text-center">Qty</th>
            <th class="text-right">Subtotal</th>
            <th class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <OrderItemRow
            v-for="(item, index) in items"
            :key="index"
            :index="index"
            :model-value="item"
            :products="products"
            :can-delete="items.length > 1"
            :error-message="getItemError(index)"
            :product-error="getProductError(index)"
            @update:model-value="emit('updateItem', index, $event)"
            @delete="emit('removeItem', index)"
          />
        </tbody>
      </table>
    </div>

    <!-- Add Row Button -->
    <div class="d-flex justify-start mb-6">
      <v-btn
        prepend-icon="mdi-plus"
        variant="tonal"
        class="btn-add-item"
        data-testid="add-item-btn"
        @click="emit('addItem')"
      >
        Tambah Baris Barang
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import OrderItemRow from './OrderItemRow.vue';
import type { Product } from '@/modules/products/types/product.types';
import type { OrderItemFormState } from '../composables/useOrderCreateForm';

interface Props {
  items: OrderItemFormState[];
  products: Product[];
  fieldErrors: Record<string, string[]>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'addItem'): void;
  (e: 'removeItem', index: number): void;
  (e: 'updateItem', index: number, value: OrderItemFormState): void;
}>();

function getItemError(index: number): string | null {
  const errs = props.fieldErrors[`items.${index}.quantity`];
  return errs && errs.length > 0 ? errs[0] : null;
}

function getProductError(index: number): string | null {
  const errs = props.fieldErrors[`items.${index}.product_id`];
  return errs && errs.length > 0 ? errs[0] : null;
}
</script>

