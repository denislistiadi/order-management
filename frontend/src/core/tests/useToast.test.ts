import { describe, it, expect, beforeEach } from 'vitest';
import { useToast } from '../composables/useToast';

describe('useToast composable', () => {
  beforeEach(() => {
    const toast = useToast();
    toast.close();
  });

  it('menampilkan notifikasi sukses secara default', () => {
    const toast = useToast();
    toast.success('Operasi berhasil');

    expect(toast.isVisible.value).toBe(true);
    expect(toast.message.value).toBe('Operasi berhasil');
    expect(toast.type.value).toBe('success');
    expect(toast.title.value).toBe('Berhasil');
  });

  it('menampilkan notifikasi error dengan judul yang tepat', () => {
    const toast = useToast();
    toast.error('Kode produk sudah digunakan');

    expect(toast.isVisible.value).toBe(true);
    expect(toast.message.value).toBe('Kode produk sudah digunakan');
    expect(toast.type.value).toBe('error');
    expect(toast.title.value).toBe('Gagal Memproses Data');
  });

  it('dapat menutup notifikasi melalui method close', () => {
    const toast = useToast();
    toast.show('Pesan test', 'info');
    expect(toast.isVisible.value).toBe(true);

    toast.close();
    expect(toast.isVisible.value).toBe(false);
  });
});

