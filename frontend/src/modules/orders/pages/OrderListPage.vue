<template>
  <div class="orders-page">
    <div class="page-header">
      <div>
        <h1 class="page-title mb-1">Riwayat Transaksi</h1>
        <p class="page-subtitle">
          Kelola, tinjau, dan pantau seluruh transaksi penjualan barang.
        </p>
      </div>

      <div class="header-actions">
        <v-btn
          prepend-icon="mdi-plus"
          class="btn-submit-order"
          to="/orders/create"
          data-testid="go-to-create-order-btn"
        >
          Buat Order Baru
        </v-btn>
      </div>
    </div>

    <!-- Placeholder Card for Fase 6 preparation -->
    <v-card class="placeholder-card">
      <div class="placeholder-icon">
        <v-icon size="64" color="#FF5B00">mdi-receipt-text-clock-outline</v-icon>
      </div>
      <h2 class="placeholder-title">Modul Riwayat Transaksi Penjualan</h2>
      <p class="placeholder-desc">
        Halaman penjelajahan riwayat transaksi, filter rentang tanggal, pencarian nomor invoice,
        dan rincian nota penjualan akan diimplementasikan secara komprehensif pada Fase 6.
      </p>
      <v-btn
        prepend-icon="mdi-cart-plus"
        color="primary"
        variant="elevated"
        to="/orders/create"
        data-testid="create-order-cta-btn"
      >
        Buat Order Sekarang
      </v-btn>
    </v-card>
  </div>
</template>

<script setup lang="ts">
// OrderListPage placeholder for Fase 6
</script>

<style lang="scss" src="../styles/orders.scss" />

