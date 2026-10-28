<template>
  <div class="orders-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title mb-1">Buat Order Baru</h1>
        <p class="page-subtitle">
          Pilih pelanggan dan kelola keranjang barang transaksi penjualan secara real-time.
        </p>
      </div>

      <div class="header-actions">
        <v-btn
          prepend-icon="mdi-history"
          variant="outlined"
          color="grey-darken-2"
          to="/orders"
          data-testid="back-to-orders-btn"
        >
          Riwayat Order
        </v-btn>
      </div>
    </div>

    <!-- Customer Selection Card -->
    <OrderCustomerCard
      v-model="selectedCustomerId"
      :customers="customersList"
      :loading="isLoadingCustomers"
      :error-message="customerError"
      @clear-errors="clearErrors"
    />

    <!-- Products Cart and Order Summary Card -->
    <v-card class="order-card">
      <OrderItemsTable
        :items="orderItems"
        :products="productsList"
        :field-errors="fieldErrors"
        @add-item="addItem"
        @remove-item="removeItem"
        @update-item="updateItem"
      />

      <OrderSummaryFooter
        :total-quantity="totalQuantity"
        :total-variations="orderItems.length"
        :grand-total="grandTotal"
        :general-error="generalError"
        :is-submitting="isSubmitting"
        :is-form-valid="isFormValid"
        @submit="handleSubmitOrder"
      />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import OrderCustomerCard from '../components/OrderCustomerCard.vue';
import OrderItemsTable from '../components/OrderItemsTable.vue';
import OrderSummaryFooter from '../components/OrderSummaryFooter.vue';
import { useOrderCreateForm } from '../composables/useOrderCreateForm';

const {
  customersList,
  productsList,
  isLoadingCustomers,
  selectedCustomerId,
  orderItems,
  fieldErrors,
  generalError,
  customerError,
  getItemError,
  getProductError,
  clearErrors,
  addItem,
  removeItem,
  updateItem,
  totalQuantity,
  grandTotal,
  isFormValid,
  isSubmitting,
  handleSubmitOrder,
} = useOrderCreateForm();

defineExpose({
  getItemError,
  getProductError,
});
</script>

<style lang="scss" src="../styles/orders.scss" />
