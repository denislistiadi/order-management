/**
 * Frontend application entry point.
 * Initializes the Vue instance, mounts Pinia store, TanStack Vue Query client,
 * Vuetify design system, and Vue Router.
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';
import vuetify from '@/core/plugins/vuetify';
import router from '@/core/plugins/router';
import { queryClient } from '@/core/api/queryClient';

const app = createApp(App);

app.use(createPinia());
app.use(VueQueryPlugin, { queryClient });
app.use(vuetify);
app.use(router);

app.mount('#app');
