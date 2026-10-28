<!--
  User profile dropdown menu component.
  Displays administrator avatar, user identity, and session logout trigger button.
-->
<template>
  <v-menu
    v-model="isOpen"
    location="bottom end"
    :close-on-content-click="false"
    transition="scale-transition"
  >
    <template #activator="{ props }">
      <div
        v-bind="props"
        :class="['user-profile-btn', { 'is-active': isOpen }]"
      >
        <div class="user-avatar-circle flex-shrink-0">
          {{ userInitials }}
        </div>
        <div class="user-info-text d-none d-md-flex flex-column text-left">
          <span class="user-name-text">{{ userName }}</span>
          <span class="user-role-text">Administrator</span>
        </div>
        <v-icon
          size="16"
          color="#6B7280"
          class="chevron-icon flex-shrink-0"
          :class="{ 'rotate-180': isOpen }"
        >
          mdi-chevron-down
        </v-icon>
      </div>
    </template>

    <v-card width="270" class="profile-popup-card pa-3 border elevation-4 rounded-xl mt-2">
      <div class="profile-header-box pa-3 mb-2 rounded-lg d-flex align-center">
        <v-avatar size="36" color="#1A1C20" class="text-white font-weight-bold flex-shrink-0 mr-3" style="font-size: 0.8125rem;">
          {{ userInitials }}
        </v-avatar>
        <div class="user-meta-column flex-grow-1" style="min-width: 0;">
          <div class="user-popup-name font-weight-bold text-grey-darken-4 text-truncate">
            {{ userName }}
          </div>
          <div class="user-popup-email text-grey font-mono text-truncate">
            {{ userEmail }}
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
        id="sign-out-menu-btn"
        class="sign-out-action-btn w-100 d-flex align-center justify-center py-2 px-3 rounded-lg"
        @click="handleSignOutClick"
      >
        <v-icon size="17" color="#EF4444" class="mr-2">mdi-logout-variant</v-icon>
        <span class="sign-out-text font-weight-bold">Sign Out</span>
      </button>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/modules/auth/stores/authStore';

const emit = defineEmits<{
  (e: 'open-logout'): void;
}>();

const authStore = useAuthStore();
const isOpen = ref(false);

const userName = computed(() => authStore.user?.name || 'System Administrator');
const userEmail = computed(() => authStore.user?.email || 'admin@example.com');
const userInitials = computed(() => (authStore.user?.name || 'AD').substring(0, 2).toUpperCase());

function handleSignOutClick(): void {
  isOpen.value = false;
  emit('open-logout');
}
</script>

<style scoped lang="scss" src="../styles/user-profile-menu.scss" />
