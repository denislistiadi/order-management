/**
 * Validation schemas for Product endpoints using Zod.
 * Enforces business requirements: product_code required & max 20 chars,
 * product_name required & max 150 chars, price > 0, stock >= 0.
 */

import { z } from 'zod';

export const createProductSchema = z.object({
  product_code: z
    .string()
    .trim()
    .min(1, 'Kode produk tidak boleh kosong')
    .max(20, 'Kode produk maksimal 20 karakter')
    .optional(),
  product_name: z
    .string({ required_error: 'Nama produk wajib diisi' })
    .trim()
    .min(1, 'Nama produk tidak boleh kosong')
    .max(150, 'Nama produk maksimal 150 karakter'),
  price: z.coerce
    .number({ invalid_type_error: 'Harga harus berupa angka' })
    .positive('Harga produk harus lebih dari 0'),
  stock: z.coerce
    .number({ invalid_type_error: 'Stok harus berupa angka' })
    .int('Stok harus berupa bilangan bulat')
    .min(0, 'Stok produk minimal 0')
    .default(0),
});

export const updateProductSchema = z
  .object({
    product_code: z
      .string()
      .trim()
      .min(1, 'Kode produk tidak boleh kosong')
      .max(20, 'Kode produk maksimal 20 karakter')
      .optional(),
    product_name: z
      .string()
      .trim()
      .min(1, 'Nama produk tidak boleh kosong')
      .max(150, 'Nama produk maksimal 150 karakter')
      .optional(),
    price: z.coerce
      .number({ invalid_type_error: 'Harga harus berupa angka' })
      .positive('Harga produk harus lebih dari 0')
      .optional(),
    stock: z.coerce
      .number({ invalid_type_error: 'Stok harus berupa angka' })
      .int('Stok harus berupa bilangan bulat')
      .min(0, 'Stok produk minimal 0')
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Setidaknya satu field harus diisi untuk memperbarui data produk',
  });

export const productListQuerySchema = z.object({
  page: z.coerce
    .number()
    .int('Halaman harus berupa bilangan bulat')
    .min(1, 'Nomor halaman minimal 1')
    .default(1),
  per_page: z.coerce
    .number()
    .int('Jumlah data per halaman harus berupa bilangan bulat')
    .min(1, 'Data per halaman minimal 1')
    .max(100, 'Data per halaman maksimal 100')
    .default(10),
  search: z.string().trim().optional(),
  sort: z.string().trim().optional().default('product_name'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
});
