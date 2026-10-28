<!--
  Root Application Component.
  Provides the top-level viewport for routed layout views and pages.
-->
<template>
  <router-view />
  <AppToast />
</template>

<script setup lang="ts">
import AppToast from '@/core/layouts/components/AppToast.vue';
</script>
