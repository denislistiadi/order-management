<!--
  Main application shell layout orchestrator.
  Coordinates modular sidebar, top navigation bar, viewport canvas, and session dialogs.
-->
<template>
  <v-app class="app-layout">
    <!-- Modular Navigation Drawer -->
    <AppSidebar
      v-model="drawerModel"
      :expanded="isExpanded"
      @update:expanded="isExpanded = $event"
    />

    <!-- Modular Top Navigation Bar -->
    <AppHeader
      :expanded="isExpanded"
      :drawer="drawerModel"
      @toggle-sidebar="toggleSidebar"
      @open-logout="showLogoutDialog = true"
    />

    <!-- Main router viewport canvas -->
    <v-main class="main-content-canvas">
      <router-view />
    </v-main>

    <!-- Modular Logout Confirmation Modal Dialog -->
    <LogoutConfirmDialog
      v-model="showLogoutDialog"
      :loading="isLoggingOut"
      @confirm="handleConfirmLogout"
    />
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import AppSidebar from './components/AppSidebar.vue';
import AppHeader from './components/AppHeader.vue';
import LogoutConfirmDialog from './components/LogoutConfirmDialog.vue';

const router = useRouter();
const { mdAndDown } = useDisplay();
const authStore = useAuthStore();

// Sidebar state
const drawerModel = ref(true);
const isExpanded = ref(true);

// Logout dialog states
const showLogoutDialog = ref(false);
const isLoggingOut = ref(false);

// Toggle sidebar expansion or mobile flyout
function toggleSidebar(): void {
  if (mdAndDown.value) {
    drawerModel.value = !drawerModel.value;
  } else {
    isExpanded.value = !isExpanded.value;
  }
}

// Execute logout with server token revocation and redirect
async function handleConfirmLogout(): Promise<void> {
  isLoggingOut.value = true;
  try {
    await authStore.logout();
  } finally {
    isLoggingOut.value = false;
    showLogoutDialog.value = false;
    router.push('/login');
  }
}
</script>

<style scoped lang="scss">
.app-layout {
  background-color: #F8F9FA;
  min-height: 100vh;
}

.main-content-canvas {
  background-color: #F8F9FA;
  min-height: calc(100vh - 60px);
}
</style>
