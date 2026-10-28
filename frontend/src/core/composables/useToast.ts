/**
 * Global Toast / Snackbar notification composable.
 * Provides a centralized API for displaying floating notifications
 * across any module without duplicating template markup.
 */

import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title?: string;
  timeout?: number;
}

const isVisible = ref(false);
const message = ref('');
const type = ref<ToastType>('success');
const title = ref('');
const timeout = ref(4000);

export function useToast() {
  function show(msg: string, toastType: ToastType = 'success', options?: ToastOptions) {
    message.value = msg;
    type.value = toastType;
    if (options?.title) {
      title.value = options.title;
    } else {
      switch (toastType) {
        case 'error':
          title.value = 'Gagal Memproses Data';
          break;
        case 'warning':
          title.value = 'Peringatan';
          break;
        case 'info':
          title.value = 'Informasi';
          break;
        default:
          title.value = 'Berhasil';
      }
    }
    timeout.value = options?.timeout ?? 4000;
    isVisible.value = true;
  }

  function success(msg: string, options?: ToastOptions) {
    show(msg, 'success', options);
  }

  function error(msg: string, options?: ToastOptions) {
    show(msg, 'error', options);
  }

  function warning(msg: string, options?: ToastOptions) {
    show(msg, 'warning', options);
  }

  function info(msg: string, options?: ToastOptions) {
    show(msg, 'info', options);
  }

  function close() {
    isVisible.value = false;
  }

  return {
    isVisible,
    message,
    type,
    title,
    timeout,
    show,
    success,
    error,
    warning,
    info,
    close,
  };
}

export default useToast;

