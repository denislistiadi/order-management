<!--
  Login brand panel component.
  Displays application identity, key value propositions, and copyright metadata.
-->
<template>
  <div class="brand-panel pa-5 pa-sm-6 pa-md-10 d-flex flex-column justify-space-between text-white">
    <div>
      <!-- Brand logo and name -->
      <div class="d-flex align-center gap-3 mb-3 mb-md-8">
        <div class="brand-badge d-flex align-center justify-center">
          <v-icon color="#FF5B00" size="26">mdi-cube-scan</v-icon>
        </div>
        <div>
          <div class="text-h6 font-weight-bold tracking-wide">
            ORDER<span class="text-orange-accent">FLOW</span>
          </div>
          <div class="text-caption text-grey-lighten-1" style="font-size: 0.72rem;">
            Order Management System
          </div>
        </div>
      </div>

      <!-- Headline and description (desktop only) -->
      <div class="d-none d-md-block">
        <h2 class="text-h5 font-weight-bold mb-3 leading-tight">
          Kelola Transaksi &amp; Stok dengan Cepat dan Akurat.
        </h2>
        <p class="text-caption text-grey-lighten-1 mb-8" style="line-height: 1.6;">
          Platform manajemen pesanan terpusat untuk memproses pesanan, memantau level inventaris, dan performa penjualan.
        </p>

        <div class="feature-list d-flex flex-column gap-4">
          <div class="d-flex align-center gap-3">
            <div class="feature-icon-box">
              <v-icon size="16" color="#FF5B00">mdi-lightning-bolt</v-icon>
            </div>
            <div class="text-caption font-weight-medium">
              Pencatatan Transaksi Atomik &amp; Real-time
            </div>
          </div>

          <div class="d-flex align-center gap-3">
            <div class="feature-icon-box">
              <v-icon size="16" color="#FF5B00">mdi-package-variant-closed-check</v-icon>
            </div>
            <div class="text-caption font-weight-medium">
              Peringatan Stok Inventaris Kritis Otomatis
            </div>
          </div>

          <div class="d-flex align-center gap-3">
            <div class="feature-icon-box">
              <v-icon size="16" color="#FF5B00">mdi-chart-areaspline</v-icon>
            </div>
            <div class="text-caption font-weight-medium">
              Analisis Omzet &amp; Peringkat Produk Terlaris
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-caption text-grey mt-4 mt-md-8 d-none d-md-block" style="font-size: 0.72rem;">
      &copy; 2026 Order Management System. Hak cipta dilindungi.
    </div>
  </div>
</template>

<style scoped lang="scss" src="../styles/login.scss" />
