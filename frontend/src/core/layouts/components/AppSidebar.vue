<!--
  Application navigation sidebar drawer component.
  Provides dark charcoal navigation bar with expandable/rail modes and data-driven menu rendering.
-->
<template>
  <v-navigation-drawer
    :model-value="modelValue"
    :rail="isRail"
    rail-width="72"
    width="240"
    :temporary="mdAndDown"
    color="#16181D"
    class="border-0 app-sidebar"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="d-flex flex-column fill-height py-4 px-3">
      <!-- Brand header -->
      <div class="brand-header-row mb-4 px-1 d-flex align-center justify-space-between">
        <div class="d-flex align-center overflow-hidden">
          <div class="brand-logo-box flex-shrink-0">
            <v-icon color="#FFFFFF" size="18">mdi-cube-scan</v-icon>
          </div>
          <div v-if="showFullText" class="brand-text-container text-truncate">
            <div class="brand-title">
              ORDER<span class="text-orange-accent">FLOW</span>
            </div>
            <div class="brand-subtitle">Order Management</div>
          </div>
        </div>
        <button
          v-if="mdAndDown"
          type="button"
          class="drawer-close-btn flex-shrink-0"
          title="Tutup Menu"
          @click="$emit('update:modelValue', false)"
        >
          <v-icon size="18" color="#9CA3AF">mdi-close</v-icon>
        </button>
      </div>

      <div class="sidebar-divider mb-3" />

      <!-- Data-driven navigation routes loop -->
      <div class="d-flex flex-column gap-1">
        <router-link
          v-for="item in NAV_MENU_ITEMS"
          :key="item.name"
          :to="item.to"
          custom
          v-slot="{ isActive, isExactActive, navigate }"
        >
          <div
            :class="['nav-item-row', { active: item.to === '/' ? isExactActive : isActive, expanded: showFullText }]"
            :title="item.title"
            @click="handleNav(navigate)"
          >
            <v-icon size="20" class="nav-icon flex-shrink-0">{{ item.icon }}</v-icon>
            <span v-if="showFullText" class="nav-label">{{ item.label }}</span>
          </div>
        </router-link>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { NAV_MENU_ITEMS } from '../config/navigation';

const props = defineProps<{
  modelValue: boolean;
  expanded: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:expanded', value: boolean): void;
}>();

const { mdAndDown } = useDisplay();

const isRail = computed(() => !mdAndDown.value && !props.expanded);
const showFullText = computed(() => mdAndDown.value || props.expanded);

function handleNav(navigate: () => void): void {
  navigate();
  if (mdAndDown.value) {
    emit('update:modelValue', false);
  }
}
</script>

<style scoped lang="scss" src="../styles/sidebar.scss" />
