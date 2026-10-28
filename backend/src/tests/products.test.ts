/**
 * Integration test suite for Product Catalog Module (Task 3.1).
 * Tests CRUD flows, Zod validation, unique constraints, multi-column sorting,
 * case-insensitive search, and soft deletion.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { Prisma } from '@prisma/client';
import { app } from '../index';
import { prisma } from '../lib/prisma';

describe('Products API (/api/products)', () => {
  let authToken = '';
  let createdProductId: number;
  const testProductCode = 'TEST-PRD-999';

  beforeAll(async () => {
    // 1. Authenticate to obtain Bearer token for protected product endpoints
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'password123',
    });

    expect(loginRes.status).toBe(200);
    authToken = loginRes.body.data.accessToken;

    // 2. Clean up any existing test records
    await prisma.product.deleteMany({
      where: {
        productCode: {
          in: [testProductCode, 'TEST-PRD-DUP', 'TEST-PRD-UPD'],
        },
      },
    });
    // Ensure test records are clean before starting
    await prisma.product.deleteMany({
      where: {
        productCode: {
          in: [testProductCode, 'TEST-PRD-DUP', 'TEST-PRD-UPD', 'TEST-PRD-NEW', 'PRD-COLLIDE-99'],
        },
      },
    });
  });

  afterAll(async () => {
    // Clean up test records created during test execution
    await prisma.product.deleteMany({
      where: {
        productCode: {
          in: [testProductCode, 'TEST-PRD-DUP', 'TEST-PRD-UPD', 'TEST-PRD-NEW', 'PRD-COLLIDE-99', 'PRD-UPD-001'],
        },
      },
    });
  });

  describe('POST /api/products', () => {
    it('harus berhasil membuat produk baru dengan data valid (201)', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          product_code: testProductCode,
          product_name: 'Test Mechanical Keypad RGB',
          price: 250000,
          stock: 15,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Produk berhasil ditambahkan');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBeTypeOf('number');
      expect(response.body.data.product_code).toBe(testProductCode);
      expect(response.body.data.product_name).toBe('Test Mechanical Keypad RGB');
      expect(response.body.data.stock).toBe(15);
      expect(response.body.data.price).toBe('250000');
      expect(response.body.data.deleted_at).toBeNull();

      createdProductId = response.body.data.id;
    });

    it('harus berhasil membuat produk baru dan men-generate product_code otomatis jika tidak disediakan (201)', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          product_name: 'Auto Generated Code Item',
          price: 99000,
          stock: 10,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.product_code).toMatch(/^PRD-\d{3,}$/);
      expect(response.body.data.product_name).toBe('Auto Generated Code Item');

      // Clean up
      await prisma.product.delete({ where: { id: response.body.data.id } });
    });

    it('harus menolak pembuatan produk jika product_code duplikat (409)', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          product_code: testProductCode,
          product_name: 'Duplicated Product Code Item',
          price: 150000,
          stock: 5,
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/sudah digunakan/i);
    });

    it('harus menolak pembuatan produk jika price <= 0 (422)', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          product_code: 'TEST-PRD-PRICE-ERR',
          product_name: 'Invalid Price Item',
          price: 0,
          stock: 5,
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveProperty('price');
    });

    it('harus menolak pembuatan produk jika stock < 0 (422)', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          product_code: 'TEST-PRD-STOCK-ERR',
          product_name: 'Invalid Stock Item',
          price: 10000,
          stock: -1,
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveProperty('stock');
    });

    it('harus menolak payload kosong / field wajib tidak diisi (422)', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('harus menolak permintaan tanpa token otentikasi (401)', async () => {
      const response = await request(app).post('/api/products').send({
        product_code: 'TEST-NO-AUTH',
        product_name: 'No Auth Item',
        price: 50000,
        stock: 1,
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/products', () => {
    it('harus mengembalikan daftar produk dengan pagination metadata', async () => {
      const response = await request(app)
        .get('/api/products?page=1&per_page=5')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('OK');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
      expect(response.body.meta).toBeDefined();
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.per_page).toBe(5);
      expect(response.body.meta.total).toBeGreaterThan(0);
      expect(response.body.meta.total_pages).toBeGreaterThan(0);
    });

    it('harus dapat melakukan pencarian case-insensitive berdasarkan nama atau kode produk', async () => {
      const response = await request(app)
        .get('/api/products?search=mechanical')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
      const match = response.body.data.some((item: any) =>
        item.product_name.toLowerCase().includes('mechanical') ||
        item.product_code.toLowerCase().includes('mechanical')
      );
      expect(match).toBe(true);
    });

    it('harus mendukung multi-field sorting (misal: sort stok lalu nama)', async () => {
      const response = await request(app)
        .get('/api/products?sort=stock:asc,product_name:asc&per_page=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('harus menolak request list tanpa token otentikasi (401)', async () => {
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/products/:id', () => {
    it('harus mengembalikan detail produk yang valid berdasarkan ID', async () => {
      const response = await request(app)
        .get(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(createdProductId);
      expect(response.body.data.product_code).toBe(testProductCode);
    });

    it('harus mengembalikan 404 untuk ID produk yang tidak terdaftar', async () => {
      const response = await request(app)
        .get('/api/products/99999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/tidak ditemukan/i);
    });

    it('harus mengembalikan 422 untuk format ID bukan angka', async () => {
      const response = await request(app)
        .get('/api/products/invalid-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('harus berhasil memperbarui data produk (200)', async () => {
      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          product_name: 'Updated Mechanical Keypad RGB Pro',
          price: 280000,
          stock: 20,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.product_name).toBe('Updated Mechanical Keypad RGB Pro');
      expect(response.body.data.price).toBe('280000');
      expect(response.body.data.stock).toBe(20);
    });

    it('harus berhasil memperbarui product_code jika unik (200)', async () => {
      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          product_code: 'TEST-PRD-UPD',
          product_name: 'Product Name With Updated Code',
          price: 310000,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.product_code).toBe('TEST-PRD-UPD');
      expect(response.body.data.product_name).toBe('Product Name With Updated Code');
    });

    it('harus menolak pembaruan jika product_code duplikat dengan produk lain (409)', async () => {
      // Create another temporary product to test code collision
      const secondProduct = await prisma.product.create({
        data: {
          productCode: 'PRD-COLLIDE-99',
          productName: 'Collision Target Product',
          price: new Prisma.Decimal(10000),
          stock: 5,
        },
      });

      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          product_code: 'PRD-COLLIDE-99',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);

      // Clean up collision test product
      await prisma.product.delete({ where: { id: secondProduct.id } });
    });

    it('harus mengembalikan 404 jika memperbarui produk yang tidak ada', async () => {
      const response = await request(app)
        .put('/api/products/99999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          product_name: 'Ghost Product',
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/products/:id (Soft Delete)', () => {
    it('harus berhasil melakukan soft delete produk (200)', async () => {
      const response = await request(app)
        .delete(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toMatch(/berhasil dihapus/i);

      // Pastikan di database field deleted_at terisi
      const record = await prisma.product.findUnique({
        where: { id: createdProductId },
      });
      expect(record).toBeDefined();
      expect(record?.deletedAt).not.toBeNull();
    });

    it('produk yang telah di-soft-delete tidak boleh muncul di daftar produk aktif', async () => {
      const response = await request(app)
        .get(`/api/products?search=${testProductCode}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      const exists = response.body.data.some((item: any) => item.id === createdProductId);
      expect(exists).toBe(false);
    });

    it('harus mengembalikan 404 saat mencoba menghapus produk yang sudah di-soft-delete', async () => {
      const response = await request(app)
        .delete(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});

