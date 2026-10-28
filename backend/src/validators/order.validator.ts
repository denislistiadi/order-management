/**
 * Validation schemas for Order / Transaction module using Zod.
 * Enforces business requirements:
 * - customer_id must be valid UUID
 * - items must be a non-empty array with positive product_id and quantity >= 1
 * - client cannot send price/subtotal/total_amount (stripped or rejected)
 */

import { z } from 'zod';

export const createOrderItemSchema = z.object({
  product_id: z
    .number({ required_error: 'ID produk wajib diisi' })
    .int('ID produk harus berupa bilangan bulat')
    .positive('ID produk harus berupa angka positif'),
  quantity: z
    .number({ required_error: 'Jumlah barang wajib diisi' })
    .int('Jumlah barang harus berupa bilangan bulat')
    .min(1, 'Jumlah barang minimal 1 unit'),
});

export const createOrderSchema = z.object({
  customer_id: z
    .string({ required_error: 'ID pelanggan wajib diisi' })
    .uuid('Format ID pelanggan tidak valid (harus berupa UUID)'),
  items: z
    .array(createOrderItemSchema, {
      required_error: 'Daftar item belanja wajib diisi',
    })
    .min(1, 'Transaksi minimal harus menyertakan 1 barang'),
});

export const orderIdParamSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: 'ID order harus berupa angka' })
    .int('ID order harus berupa bilangan bulat')
    .positive('ID order harus berupa angka positif'),
});

export const orderListQuerySchema = z.object({
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
  sort: z.string().trim().optional(),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  customer_id: z.string().uuid('Format customer_id harus berupa UUID').optional(),
  from: z.string().trim().optional(),
  to: z.string().trim().optional(),
});

