<!--
  Interactive administrator credentials submission form.
  Handles user input, validation enforcement, error presentation, and session establishment.
-->
<template>
  <div class="form-panel pa-5 pa-sm-8 pa-md-10 bg-white d-flex flex-column justify-center">
    <div class="mb-6">
      <h3 class="text-h5 font-weight-bold text-grey-darken-4 mb-1">
        Masuk ke Portal
      </h3>
      <p class="text-caption text-grey">
        Gunakan kredensial administrator Anda untuk melanjutkan.
      </p>
    </div>

    <!-- Error Feedback Alert -->
    <v-alert
      v-if="authStore.error"
      type="error"
      variant="tonal"
      density="comfortable"
      rounded="lg"
      closable
      class="mb-4 text-caption font-weight-medium"
      @click:close="authStore.error = null"
    >
      {{ authStore.error }}
    </v-alert>

    <v-form ref="formRef" :disabled="authStore.isLoading" @submit.prevent="handleLogin" class="d-flex flex-column gap-3">
      <div>
        <label class="text-caption font-weight-bold text-grey-darken-3 d-block mb-1">
          Email Administrator
        </label>
        <v-text-field
          id="email-input"
          v-model="email"
          :rules="emailRules"
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
        </div>
        <v-text-field
          id="password-input"
          v-model="password"
          :rules="passwordRules"
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
        id="login-submit-btn"
        type="submit"
        color="#FF5B00"
        size="large"
        block
        rounded="lg"
        elevation="0"
        class="mt-3 font-weight-bold text-white submit-btn"
        :loading="authStore.isLoading"
        :disabled="authStore.isLoading"
      >
        Masuk ke Dashboard
        <v-icon end size="18">mdi-arrow-right</v-icon>
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Form component ref
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null);

// Form state
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(true);

// Validation rules
const emailRules = [
  (v: string) => !!v || 'Email wajib diisi',
  (v: string) => /.+@.+\..+/.test(v) || 'Format email tidak valid',
];

const passwordRules = [
  (v: string) => !!v || 'Kata sandi wajib diisi',
];

/**
 * Validates form and initiates authentication request.
 */
async function handleLogin(): Promise<void> {
  if (formRef.value) {
    const { valid } = await formRef.value.validate();
    if (!valid) return;
  } else if (!email.value || !password.value) {
    return;
  }

  const isSuccess = await authStore.login({
    email: email.value.trim(),
    password: password.value,
  });

  if (isSuccess) {
    const redirectPath = (route.query.redirect as string) || '/';
    await router.push(redirectPath);
  }
}
</script>

<style scoped lang="scss" src="../styles/login.scss" />
