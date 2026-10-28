/**
 * Navigation sidebar route items configuration.
 */

export interface NavMenuItem {
  name: string;
  label: string;
  to: string;
  icon: string;
  title: string;
}

export const NAV_MENU_ITEMS: readonly NavMenuItem[] = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    to: '/',
    icon: 'mdi-view-dashboard-outline',
    title: 'Dashboard',
  },
  {
    name: 'products',
    label: 'Produk',
    to: '/products',
    icon: 'mdi-package-variant-closed',
    title: 'Katalog Produk',
  },
  {
    name: 'customers',
    label: 'Pelanggan',
    to: '/customers',
    icon: 'mdi-account-group-outline',
    title: 'Buku Pelanggan',
  },
  {
    name: 'orders',
    label: 'Riwayat Order',
    to: '/orders',
    icon: 'mdi-receipt-text-clock-outline',
    title: 'Riwayat Order',
  },
] as const;
