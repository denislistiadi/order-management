<template>
  <v-snackbar
    v-model="isVisible"
    :timeout="timeout"
    location="top right"
    :class="['app-floating-toast', `toast-${type}`]"
    transition="slide-x-reverse-transition"
  >
    <div class="toast-content">
      <div :class="['toast-icon-wrapper', `icon-${type}`]">
        <v-icon :icon="iconName" size="20" />
      </div>
      <div class="toast-text">
        <div class="toast-title">{{ title }}</div>
        <div class="toast-message">{{ message }}</div>
      </div>
      <v-btn
        icon="mdi-close"
        variant="text"
        size="x-small"
        class="toast-close"
        @click="close"
      />
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useToast } from '@/core/composables/useToast';

const { isVisible, message, type, title, timeout, close } = useToast();

const iconName = computed(() => {
  switch (type.value) {
    case 'error':
      return 'mdi-alert-circle';
    case 'warning':
      return 'mdi-alert';
    case 'info':
      return 'mdi-information';
    default:
      return 'mdi-check-circle';
  }
});
</script>

