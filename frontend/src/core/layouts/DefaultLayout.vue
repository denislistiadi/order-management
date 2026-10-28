<!--
  Main application layout component.
  Provides expandable navigation sidebar, unified top navigation header,
  and dynamic main content router viewport.
-->
<template>
  <v-app class="app-layout">
    <!-- Navigation sidebar drawer -->
    <v-navigation-drawer
      v-model="drawerModel"
      :rail="isRail"
      rail-width="72"
      width="240"
      :temporary="mdAndDown"
      color="#16181D"
      class="border-0 app-sidebar"
    >
      <div class="d-flex flex-column fill-height py-4 px-3">
        <!-- Brand logo and name -->
        <div class="brand-header-row mb-4 px-1 d-flex align-center justify-space-between">
          <div class="d-flex align-center overflow-hidden">
            <div class="brand-logo-box flex-shrink-0">
              <v-icon color="#FFFFFF" size="18">mdi-cube-scan</v-icon>
            </div>
            <div v-if="showFullText" class="brand-text-container text-truncate">
              <div class="brand-title">
                ORDER<span class="text-orange-accent">FLOW</span>
              </div>
              <div class="brand-subtitle">
                Order Management
              </div>
            </div>
          </div>
          <button
            v-if="mdAndDown"
            type="button"
            class="drawer-close-btn flex-shrink-0"
            @click="drawerModel = false"
            title="Tutup Menu"
          >
            <v-icon size="18" color="#9CA3AF">mdi-close</v-icon>
          </button>
        </div>

        <div class="sidebar-divider mb-3" />

        <!-- Navigation routes list -->
        <div class="d-flex flex-column gap-1">
          <router-link to="/" custom v-slot="{ isActive, navigate }">
            <div
              :class="['nav-item-row', { active: isActive, expanded: showFullText }]"
              @click="handleNav(navigate)"
              title="Dashboard"
            >
              <v-icon size="20" class="nav-icon flex-shrink-0">mdi-view-dashboard-outline</v-icon>
              <span v-if="showFullText" class="nav-label">Dashboard</span>
            </div>
          </router-link>

          <router-link to="/products" custom v-slot="{ isActive, navigate }">
            <div
              :class="['nav-item-row', { active: isActive, expanded: showFullText }]"
              @click="handleNav(navigate)"
              title="Katalog Produk"
            >
              <v-icon size="20" class="nav-icon flex-shrink-0">mdi-package-variant-closed</v-icon>
              <span v-if="showFullText" class="nav-label">Produk</span>
            </div>
          </router-link>

          <router-link to="/customers" custom v-slot="{ isActive, navigate }">
            <div
              :class="['nav-item-row', { active: isActive, expanded: showFullText }]"
              @click="handleNav(navigate)"
              title="Buku Pelanggan"
            >
              <v-icon size="20" class="nav-icon flex-shrink-0">mdi-account-group-outline</v-icon>
              <span v-if="showFullText" class="nav-label">Pelanggan</span>
            </div>
          </router-link>

          <router-link to="/orders" custom v-slot="{ isActive, navigate }">
            <div
              :class="['nav-item-row', { active: isActive, expanded: showFullText }]"
              @click="handleNav(navigate)"
              title="Riwayat Order"
            >
              <v-icon size="20" class="nav-icon flex-shrink-0">mdi-receipt-text-clock-outline</v-icon>
              <span v-if="showFullText" class="nav-label">Riwayat Order</span>
            </div>
          </router-link>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- Top navigation header bar -->
    <v-app-bar
      elevation="0"
      color="#FFFFFF"
      height="60"
      class="border-b px-3 px-sm-4 px-md-6 app-top-bar"
    >
      <div class="d-flex align-center justify-space-between w-100 min-w-0">
        <!-- Left: Sidebar expand toggle button and breadcrumbs -->
        <div class="d-flex align-center min-w-0 mr-2">
          <button
            class="header-toggle-btn mr-2 mr-sm-3 flex-shrink-0"
            @click="toggleSidebar"
            :title="isExpanded ? 'Kecilkan Sidebar' : 'Perluas Sidebar'"
          >
            <v-icon size="19" color="#4B5563">
              {{ (mdAndDown ? drawerModel : isExpanded) ? 'mdi-menu-open' : 'mdi-menu' }}
            </v-icon>
          </button>

          <!-- Breadcrumbs and title with explicit spacing -->
          <div class="d-flex align-center text-truncate">
            <span class="header-page-title text-truncate">Dashboard</span>
            <span class="mx-2 text-grey-lighten-1 font-weight-light d-none d-sm-inline">/</span>
            <span class="header-subtitle text-grey-darken-1 d-none d-sm-inline text-truncate">Ringkasan Eksekutif</span>
          </div>
        </div>

        <!-- Right: User profile with logout menu -->
        <div class="d-flex align-center flex-shrink-0">
          <v-menu
            v-model="isUserMenuOpen"
            location="bottom end"
            :close-on-content-click="false"
            transition="scale-transition"
          >
            <template #activator="{ props }">
              <div
                v-bind="props"
                :class="['user-profile-btn', { 'is-active': isUserMenuOpen }]"
              >
                <div class="user-avatar-circle flex-shrink-0">
                  AD
                </div>
                <div class="user-info-text d-none d-md-flex flex-column text-left">
                  <span class="user-name-text">System Administrator</span>
                  <span class="user-role-text">Administrator</span>
                </div>
                <v-icon
                  size="16"
                  color="#6B7280"
                  class="chevron-icon flex-shrink-0"
                  :class="{ 'rotate-180': isUserMenuOpen }"
                >
                  mdi-chevron-down
                </v-icon>
              </div>
            </template>

            <!-- Popup menu card -->
            <v-card width="270" class="profile-popup-card pa-3 border elevation-4 rounded-xl mt-2">
              <div class="profile-header-box pa-3 mb-2 rounded-lg d-flex align-center">
                <v-avatar size="36" color="#1A1C20" class="text-white font-weight-bold flex-shrink-0 mr-3" style="font-size: 0.8125rem;">
                  AD
                </v-avatar>
                <div class="user-meta-column flex-grow-1" style="min-width: 0;">
                  <div class="user-popup-name font-weight-bold text-grey-darken-4 text-truncate">
                    System Administrator
                  </div>
                  <div class="user-popup-email text-grey font-mono text-truncate">
                    admin@example.com
                  </div>
                  <div class="mt-1">
                    <span class="user-role-badge font-weight-bold">
                      Administrator
                    </span>
                  </div>
                </div>
              </div>

              <v-divider class="my-2" />

              <button
                type="button"
                class="sign-out-action-btn w-100 d-flex align-center justify-center py-2 px-3 rounded-lg"
                @click="handleLogout"
              >
                <v-icon size="17" color="#EF4444" class="mr-2">mdi-logout-variant</v-icon>
                <span class="sign-out-text font-weight-bold">Sign Out</span>
              </button>
            </v-card>
          </v-menu>
        </div>
      </div>
    </v-app-bar>

    <!-- Main router viewport -->
    <v-main class="main-content-canvas">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';

const router = useRouter();
const { mdAndDown } = useDisplay();

// Sidebar state
const drawerModel = ref(true);
const isExpanded = ref(true);

// Responsive drawer computed states
const isRail = computed(() => !mdAndDown.value && !isExpanded.value);
const showFullText = computed(() => mdAndDown.value || isExpanded.value);

// User popup menu state
const isUserMenuOpen = ref(false);

// Toggle sidebar expansion or mobile flyout
function toggleSidebar(): void {
  if (mdAndDown.value) {
    drawerModel.value = !drawerModel.value;
  } else {
    isExpanded.value = !isExpanded.value;
  }
}

// Navigate and close drawer on mobile screens
function handleNav(navigate: () => void): void {
  navigate();
  if (mdAndDown.value) {
    drawerModel.value = false;
  }
}

// Perform sign out and navigate to login
function handleLogout(): void {
  isUserMenuOpen.value = false;
  localStorage.removeItem('auth_token');
  router.push('/login');
}
</script>

<style scoped lang="scss">
.app-layout {
  background-color: #F8F9FA;
  min-height: 100vh;
}

.app-sidebar {
  background-color: #16181D !important;
  user-select: none;
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 1px solid rgba(255, 255, 255, 0.06) !important;
}

.brand-header-row {
  display: flex;
  align-items: center;
  height: 40px;
  user-select: none;
  overflow: hidden;
}

.brand-logo-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: #FF5B00;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  box-shadow: 0 2px 6px rgba(255, 91, 0, 0.3);
}

.brand-text-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.brand-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 0.6875rem;
  font-weight: 500;
  color: #9CA3AF;
  letter-spacing: 0.01em;
  line-height: 1.2;
  margin-top: 2px;
}

.drawer-close-btn {
  background: transparent;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
}

.text-orange-accent {
  color: #FF5B00 !important;
}

.nav-section-title {
  font-size: 0.65rem;
  font-weight: 700;
  color: #6B7280;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sidebar-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.06);
  width: 100%;
}

.nav-item-row {
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  color: #9CA3AF;
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0 10px;
  user-select: none;

  .nav-icon {
    color: #9CA3AF;
    transition: color 0.15s ease;
  }

  .nav-label {
    font-size: 0.84rem;
    font-weight: 500;
    margin-left: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover:not(.active) {
    color: #FFFFFF;
    background-color: rgba(255, 255, 255, 0.06);

    .nav-icon {
      color: #FFFFFF;
    }
  }

  &.active {
    background: linear-gradient(135deg, #FF6A14 0%, #FF5B00 100%);
    color: #FFFFFF;
    box-shadow: 0 3px 10px rgba(255, 91, 0, 0.35);

    .nav-icon {
      color: #FFFFFF;
    }

    .nav-label {
      font-weight: 600;
      color: #FFFFFF;
    }
  }

  &:not(.expanded) {
    justify-content: center;
    padding: 0;

    .nav-icon {
      margin: 0;
    }
  }
}

.sidebar-footer-pill {
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
}

.online-indicator {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #10B981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.footer-status-text {
  font-size: 0.6875rem;
  color: #9CA3AF;
  font-weight: 500;
}

.footer-version-text {
  font-size: 0.65rem;
  color: #6B7280;
}

.header-toggle-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background-color: #F9FAFB;
  border: 1px solid #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: #F3F4F6;
    border-color: #D1D5DB;
  }
}

.header-page-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
}

.header-subtitle {
  font-size: 0.8125rem;
  font-weight: 500;
}

.user-profile-btn {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 9999px;
  padding: 4px 12px 4px 5px;
  height: 40px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;

  &:hover,
  &.is-active {
    background-color: #F9FAFB;
    border-color: #D1D5DB;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
  }
}

.user-avatar-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #1A1C20;
  color: #FFFFFF;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 9px;
}

.user-info-text {
  margin-right: 8px;
  line-height: 1.2;
}

.user-name-text {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
}

.user-role-text {
  font-size: 0.6875rem;
  font-weight: 500;
  color: #6B7280;
  white-space: nowrap;
}

.chevron-icon {
  transition: transform 0.2s ease;

  &.rotate-180 {
    transform: rotate(180deg);
  }
}

.profile-popup-card {
  background-color: #FFFFFF !important;
  border-color: #E5E7EB !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
}

.profile-header-box {
  background-color: #F8F9FA;
  border: 1px solid #EDF0F2;
}

.user-popup-name {
  font-size: 0.84rem;
  line-height: 1.25;
}

.user-popup-email {
  font-size: 0.7rem;
  line-height: 1.3;
}

.user-role-badge {
  background-color: rgba(255, 91, 0, 0.1);
  color: #FF5B00;
  border-radius: 4px;
  font-size: 0.65rem;
  padding: 1px 6px;
  display: inline-block;
  letter-spacing: 0.02em;
}

.sign-out-action-btn {
  background-color: #FEF2F2;
  border: 1px solid #FEE2E2;
  color: #EF4444;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: #FEE2E2;
    border-color: #FECACA;
    color: #DC2626;
    transform: translateY(-1px);
  }

  .sign-out-text {
    font-size: 0.78rem;
    color: #EF4444;
  }
}

.main-content-canvas {
  background-color: #F8F9FA;
  min-height: calc(100vh - 60px);
}

.leading-tight {
  line-height: 1.25;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
</style>
