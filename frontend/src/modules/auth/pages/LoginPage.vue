<!--
  Administrator authentication view component.
  Provides credentials authentication form with demo presets and validation feedback.
-->
<template>
  <div class="login-wrapper fill-height d-flex align-center justify-center pa-4">
    <div class="login-container d-flex flex-column flex-md-row overflow-hidden">
      <!-- Left brand panel -->
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

      <!-- Right form panel -->
      <div class="form-panel pa-5 pa-sm-8 pa-md-10 bg-white d-flex flex-column justify-center">
        <div class="mb-6">
          <h3 class="text-h5 font-weight-bold text-grey-darken-4 mb-1">
            Masuk ke Portal
          </h3>
          <p class="text-caption text-grey">
            Gunakan kredensial administrator Anda untuk melanjutkan.
          </p>
        </div>

        <v-form @submit.prevent="handleLogin" class="d-flex flex-column gap-3">
          <div>
            <label class="text-caption font-weight-bold text-grey-darken-3 d-block mb-1">
              Email Administrator
            </label>
            <v-text-field
              v-model="email"
              placeholder="admin@example.com"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              density="comfortable"
              color="#FF5B00"
              hide-details="auto"
              required
            />
          </div>

          <div>
            <div class="d-flex justify-space-between align-center mb-1">
              <label class="text-caption font-weight-bold text-grey-darken-3">
                Kata Sandi
              </label>
              <a href="#" class="text-caption text-orange-accent text-decoration-none font-weight-semibold">
                Lupa sandi?
              </a>
            </div>
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              density="comfortable"
              color="#FF5B00"
              hide-details="auto"
              required
            />
          </div>

          <div class="d-flex align-center justify-space-between mt-1">
            <v-checkbox
              v-model="rememberMe"
              label="Ingat sesi saya"
              color="#FF5B00"
              density="compact"
              hide-details
              class="text-caption"
            />
          </div>

          <v-btn
            type="submit"
            color="#FF5B00"
            size="large"
            block
            rounded="lg"
            elevation="0"
            class="mt-3 font-weight-bold text-white submit-btn"
            :loading="isLoading"
          >
            Masuk ke Dashboard
            <v-icon end size="18">mdi-arrow-right</v-icon>
          </v-btn>
        </v-form>

        <!-- Demo credentials box with auto-fill action -->
        <div class="demo-box mt-6 pa-3 d-flex align-center justify-space-between">
          <div class="d-flex align-center gap-2">
            <v-icon size="18" color="#FF5B00">mdi-shield-key-outline</v-icon>
            <div>
              <div class="text-caption font-weight-bold text-grey-darken-3">
                Akun Demo Seeder
              </div>
              <div class="text-caption text-grey font-mono" style="font-size: 0.72rem;">
                admin@example.com / password123
              </div>
            </div>
          </div>

          <button
            type="button"
            class="fill-demo-btn text-caption px-2 py-1 font-weight-semibold"
            @click="fillDemoCredentials"
          >
            Gunakan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form state
const email = ref('admin@example.com');
const password = ref('password123');
const showPassword = ref(false);
const rememberMe = ref(true);
const isLoading = ref(false);

// Populate default administrator credentials
function fillDemoCredentials(): void {
  email.value = 'admin@example.com';
  password.value = 'password123';
}

// Perform login and navigate to dashboard
function handleLogin(): void {
  isLoading.value = true;
  setTimeout(() => {
    localStorage.setItem('auth_token', 'demo-token');
    isLoading.value = false;
    router.push('/');
  }, 400);
}
</script>

<style scoped lang="scss">
.login-wrapper {
  background: radial-gradient(circle at 10% 20%, rgba(255, 91, 0, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(26, 28, 32, 0.04) 0%, transparent 40%),
              #F8F9FA;
  min-height: 100vh;
}

.login-container {
  width: 100%;
  max-width: 920px;
  background-color: #FFFFFF;
  border-radius: 24px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.02);
}

@media (max-width: 600px) {
  .login-wrapper {
    padding: 12px !important;
  }

  .login-container {
    border-radius: 18px;
  }
}

.brand-panel {
  background: linear-gradient(145deg, #1A1C20 0%, #111215 100%);
  flex: 1.1;
  position: relative;
}

.brand-badge {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: rgba(255, 91, 0, 0.12);
  border: 1px solid rgba(255, 91, 0, 0.25);
}

.text-orange-accent {
  color: #FF5B00 !important;
}

.feature-icon-box {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background-color: rgba(255, 91, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.form-panel {
  flex: 1.2;
}

.submit-btn {
  height: 48px !important;
  letter-spacing: 0.2px;
  box-shadow: 0 4px 16px rgba(255, 91, 0, 0.3) !important;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 6px 22px rgba(255, 91, 0, 0.45) !important;
    transform: translateY(-1px);
  }
}

.demo-box {
  background-color: #F8F9FA;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
}

.fill-demo-btn {
  background-color: #FFFFFF;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: #FF5B00;
    border-color: #FF5B00;
    color: #FFFFFF;
  }
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.leading-tight {
  line-height: 1.25;
}
</style>
