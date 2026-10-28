<!--
  Top application navigation bar component.
  Provides breadcrumbs, sidebar toggler, and delegates user menu to UserProfileMenu.
-->
<template>
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
          :title="expanded ? 'Kecilkan Sidebar' : 'Perluas Sidebar'"
          @click="$emit('toggle-sidebar')"
        >
          <v-icon size="19" color="#4B5563">
            {{ (mdAndDown ? drawer : expanded) ? 'mdi-menu-open' : 'mdi-menu' }}
          </v-icon>
        </button>

        <!-- Breadcrumbs and title -->
        <div class="d-flex align-center text-truncate">
          <span class="header-page-title text-truncate">{{ pageTitle }}</span>
          <span class="mx-2 text-grey-lighten-1 font-weight-light d-none d-sm-inline">/</span>
          <span class="header-subtitle text-grey-darken-1 d-none d-sm-inline text-truncate">
            {{ pageSubtitle }}
          </span>
        </div>
      </div>

      <!-- Right: User profile menu component -->
      <div class="d-flex align-center flex-shrink-0">
        <UserProfileMenu @open-logout="$emit('open-logout')" />
      </div>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import UserProfileMenu from './UserProfileMenu.vue';

defineProps<{
  expanded: boolean;
  drawer: boolean;
}>();

defineEmits<{
  (e: 'toggle-sidebar'): void;
  (e: 'open-logout'): void;
}>();

const route = useRoute();
const { mdAndDown } = useDisplay();

const pageTitle = computed(() => (route.meta?.title as string) || String(route.name || 'Dashboard'));
const pageSubtitle = computed(() => (route.meta?.subtitle as string) || 'Order Management');
</script>

<style scoped lang="scss" src="../styles/header.scss" />
