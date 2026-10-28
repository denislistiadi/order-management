/**
 * Vue Router configuration.
 * Maps top-level and nested routes to lazy-loaded feature module pages.
 * Includes global navigation guards for authentication enforcement.
 */

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/modules/auth/pages/LoginPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/modules/dashboard/pages/DashboardPage.vue'),
        meta: {
          title: 'Dashboard',
          subtitle: 'Ringkasan Eksekutif',
        },
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/modules/products/pages/ProductListPage.vue'),
        meta: {
          title: 'Produk',
          subtitle: 'Katalog Produk & Inventaris',
        },
      },
      {
        path: 'customers',
        name: 'Customers',
        component: () => import('@/modules/customers/pages/CustomerListPage.vue'),
        meta: {
          title: 'Pelanggan',
          subtitle: 'Buku Pelanggan & Alamat',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * Global navigation guard.
 * Protects private internal routes from unauthenticated access
 * and redirects already authenticated users away from the login page.
 */
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('auth_token');
  const isRequiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (isRequiresAuth && !token) {
    // Unauthenticated user trying to access protected route
    next({
      name: 'Login',
      query: to.fullPath !== '/' ? { redirect: to.fullPath } : undefined,
    });
  } else if (to.name === 'Login' && token) {
    // Authenticated user trying to access login page
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
