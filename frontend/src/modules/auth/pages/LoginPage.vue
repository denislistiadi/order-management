<!--
  Administrator authentication view component.
  Coordinates modular brand panel and credential login form.
-->
<template>
  <div class="login-wrapper fill-height d-flex align-center justify-center pa-4">
    <div class="login-container d-flex flex-column flex-md-row overflow-hidden">
      <LoginBrandPanel />
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginBrandPanel from '../components/LoginBrandPanel.vue';
import LoginForm from '../components/LoginForm.vue';
</script>

<style scoped lang="scss" src="../styles/login.scss" />
