/**
 * Ambient type declarations.
 * Provides TypeScript definitions for Vite client assets and Vue Single File Components.
 */

/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
