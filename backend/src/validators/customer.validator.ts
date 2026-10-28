/**
 * Validation schemas for Customer endpoints using Zod.
 * Enforces business requirements: customer_name (1-150 chars),
 * customer_address (1-255 chars), gender ('Pria' | 'Wanita'),
 * birth_date (valid past date), phone (optional <= 20 chars),
 * and UUID format for resource path IDs.
 */

import { z } from 'zod';

export const createCustomerSchema = z.object({
  customer_name: z
    .string({ required_error: 'Nama pelanggan wajib diisi' })
    .trim()
    .min(1, 'Nama pelanggan tidak boleh kosong')
    .max(150, 'Nama pelanggan maksimal 150 karakter'),
  customer_address: z
    .string({ required_error: 'Alamat pelanggan wajib diisi' })
    .trim()
    .min(1, 'Alamat pelanggan tidak boleh kosong')
    .max(255, 'Alamat pelanggan maksimal 255 karakter'),
  gender: z.enum(['Pria', 'Wanita'], {
    errorMap: () => ({ message: 'Gender harus bernilai Pria atau Wanita' }),
  }),
  birth_date: z.coerce
    .date({
      invalid_type_error: 'Format tanggal lahir tidak valid',
      required_error: 'Tanggal lahir wajib diisi',
    })
    .refine((date) => !isNaN(date.getTime()), {
      message: 'Tanggal lahir tidak valid',
    })
    .refine((date) => date < new Date(), {
      message: 'Tanggal lahir harus berada di masa lampau',
    }),
  phone: z
    .string()
    .trim()
    .max(20, 'Nomor telepon maksimal 20 karakter')
    .regex(/^[0-9+()\- ]*$/, 'Format nomor telepon tidak valid')
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
});

export const updateCustomerSchema = z
  .object({
    customer_name: z
      .string()
      .trim()
      .min(1, 'Nama pelanggan tidak boleh kosong')
      .max(150, 'Nama pelanggan maksimal 150 karakter')
      .optional(),
    customer_address: z
      .string()
      .trim()
      .min(1, 'Alamat pelanggan tidak boleh kosong')
      .max(255, 'Alamat pelanggan maksimal 255 karakter')
      .optional(),
    gender: z
      .enum(['Pria', 'Wanita'], {
        errorMap: () => ({ message: 'Gender harus bernilai Pria atau Wanita' }),
      })
      .optional(),
    birth_date: z.coerce
      .date({ invalid_type_error: 'Format tanggal lahir tidak valid' })
      .refine((date) => !isNaN(date.getTime()), {
        message: 'Tanggal lahir tidak valid',
      })
      .refine((date) => date < new Date(), {
        message: 'Tanggal lahir harus berada di masa lampau',
      })
      .optional(),
    phone: z
      .string()
      .trim()
      .max(20, 'Nomor telepon maksimal 20 karakter')
      .regex(/^[0-9+()\- ]*$/, 'Format nomor telepon tidak valid')
      .optional()
      .nullable()
      .transform((val) => (val === '' ? null : val)),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Setidaknya satu field harus diisi untuk memperbarui data pelanggan',
  });

export const customerIdParamSchema = z.object({
  id: z.string().uuid('Format ID pelanggan tidak valid (harus berupa UUID)'),
});

export const customerListQuerySchema = z.object({
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
  sort: z.string().trim().optional().default('customer_name'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
});

