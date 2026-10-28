/**
 * Centralized Query Key Factory for TanStack Query.
 * Ensures consistent query key definitions across feature modules,
 * enabling type-safe cache queries, refetches, and mutations.
 */
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  products: {
    all: ['products'] as const,
    list: (params?: Record<string, unknown>) => ['products', 'list', params ?? {}] as const,
    detail: (id: number | string) => ['products', 'detail', id] as const,
  },
  customers: {
    all: ['customers'] as const,
    list: (params?: Record<string, unknown>) => ['customers', 'list', params ?? {}] as const,
    detail: (id: string) => ['customers', 'detail', id] as const,
  },
  orders: {
    all: ['orders'] as const,
    list: (params?: Record<string, unknown>) => ['orders', 'list', params ?? {}] as const,
    detail: (id: number | string) => ['orders', 'detail', id] as const,
  },
  dashboard: {
    summary: ['dashboard', 'summary'] as const,
  },
} as const;

export default queryKeys;
