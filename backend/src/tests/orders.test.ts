/**
 * Integration test suite for Order / Transaction Module (Task 5.1).
 * Tests atomic transaction execution, stock deduction, rollback on shortfall,
 * dot-notation error format, database price snapshotting, and endpoints.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

describe('Orders API (/api/orders)', () => {
  let authToken = '';
  let testCustomerId = '';
  let testProduct1Id = 0;
  let testProduct2Id = 0;
  const initialStock1 = 20;
  const initialStock2 = 5;
  const product1Price = 50000;
  const product2Price = 120000;

  beforeAll(async () => {
    // Authenticate to obtain Bearer token
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'password123',
    });

    expect(loginRes.status).toBe(200);
    authToken = loginRes.body.data.accessToken;

    // Clean up any previous test orders, customers, products
    await prisma.orderItem.deleteMany({
      where: {
        product: {
          productCode: { in: ['PRD-TEST-ORD1', 'PRD-TEST-ORD2'] },
        },
      },
    });

    await prisma.order.deleteMany({
      where: {
        orderNumber: { contains: 'INV-' },
        customer: { customerName: 'TEST-ORDER Budi Pelanggan' },
      },
    });

    await prisma.customer.deleteMany({
      where: { customerName: 'TEST-ORDER Budi Pelanggan' },
    });

    await prisma.product.deleteMany({
      where: { productCode: { in: ['PRD-TEST-ORD1', 'PRD-TEST-ORD2'] } },
    });

    // Seed test customer
    const customer = await prisma.customer.create({
      data: {
        customerName: 'TEST-ORDER Budi Pelanggan',
        customerAddress: 'Jl. Uji Transaksi No. 123',
        gender: 'Pria',
        birthDate: new Date('1990-01-01'),
        phone: '081234567899',
      },
    });
    testCustomerId = customer.id;

    // Seed test products
    const product1 = await prisma.product.create({
      data: {
        productCode: 'PRD-TEST-ORD1',
        productName: 'Keyboard Mekanikal Gaming Test',
        price: new Prisma.Decimal(product1Price),
        stock: initialStock1,
      },
    });
    testProduct1Id = product1.id;

    const product2 = await prisma.product.create({
      data: {
        productCode: 'PRD-TEST-ORD2',
        productName: 'Mouse Nirkabel Test',
        price: new Prisma.Decimal(product2Price),
        stock: initialStock2,
      },
    });
    testProduct2Id = product2.id;
  });

  afterAll(async () => {
    // Clean up created records
    await prisma.orderItem.deleteMany({
      where: {
        product: {
          productCode: { in: ['PRD-TEST-ORD1', 'PRD-TEST-ORD2'] },
        },
      },
    });

    await prisma.order.deleteMany({
      where: {
        customer: { customerName: 'TEST-ORDER Budi Pelanggan' },
      },
    });

    await prisma.customer.deleteMany({
      where: { customerName: 'TEST-ORDER Budi Pelanggan' },
    });

    await prisma.product.deleteMany({
      where: { productCode: { in: ['PRD-TEST-ORD1', 'PRD-TEST-ORD2'] } },
    });
  });

  describe('POST /api/orders (Atomic Order Creation & Stock Validation)', () => {
    it('harus berhasil membuat order dengan data valid, mengurangi stok, dan menghitung total harga (201)', async () => {
      const orderQuantity1 = 2;
      const orderQuantity2 = 1;
      const expectedTotal = product1Price * orderQuantity1 + product2Price * orderQuantity2;

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customer_id: testCustomerId,
          items: [
            { product_id: testProduct1Id, quantity: orderQuantity1 },
            { product_id: testProduct2Id, quantity: orderQuantity2 },
          ],
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();

      const order = response.body.data;
      expect(order.order_number).toMatch(/^INV-\d{8}-\d{4}$/);
      expect(order.customer_id).toBe(testCustomerId);
      expect(order.customer_name).toBe('TEST-ORDER Budi Pelanggan');
      expect(parseFloat(order.total_amount)).toBe(expectedTotal);
      expect(order.items.length).toBe(2);

      // Verify stock was reduced in database
      const p1 = await prisma.product.findUnique({ where: { id: testProduct1Id } });
      const p2 = await prisma.product.findUnique({ where: { id: testProduct2Id } });
      expect(p1?.stock).toBe(initialStock1 - orderQuantity1);
      expect(p2?.stock).toBe(initialStock2 - orderQuantity2);
    });

    it('harus menolak transaksi dan ROLLBACK penuh jika stok salah satu item tidak mencukupi (422)', async () => {
      // Current stock: p1 has 18, p2 has 4
      const p1Before = await prisma.product.findUnique({ where: { id: testProduct1Id } });
      const p2Before = await prisma.product.findUnique({ where: { id: testProduct2Id } });
      expect(p1Before?.stock).toBe(18);
      expect(p2Before?.stock).toBe(4);

      // Request: p1 = 2 (cukup), p2 = 10 (KURANG, stok hanya 4)
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customer_id: testCustomerId,
          items: [
            { product_id: testProduct1Id, quantity: 2 },
            { product_id: testProduct2Id, quantity: 10 },
          ],
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Stok tidak mencukupi');
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors['items.1.quantity']).toBeDefined();
      expect(response.body.errors['items.1.quantity'][0]).toContain('tersisa 4, diminta 10');

      // CRITICAL ASSERTION: Stok TIDAK boleh berkurang sama sekali (Rollback verifikasi)
      const p1After = await prisma.product.findUnique({ where: { id: testProduct1Id } });
      const p2After = await prisma.product.findUnique({ where: { id: testProduct2Id } });
      expect(p1After?.stock).toBe(18);
      expect(p2After?.stock).toBe(4);
    });

    it('harus menolak pembuatan order jika customer_id bukan UUID valid (422)', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customer_id: 'invalid-not-uuid',
          items: [{ product_id: testProduct1Id, quantity: 1 }],
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.errors['customer_id']).toBeDefined();
    });

    it('harus menolak pembuatan order jika pelanggan tidak terdaftar di database (404)', async () => {
      const fakeUuid = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customer_id: fakeUuid,
          items: [{ product_id: testProduct1Id, quantity: 1 }],
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Pelanggan tidak ditemukan');
    });

    it('harus menolak order jika daftar items kosong (422)', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customer_id: testCustomerId,
          items: [],
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.errors['items']).toBeDefined();
    });

    it('harus menolak order jika quantity bernilai 0 atau negatif (422)', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customer_id: testCustomerId,
          items: [{ product_id: testProduct1Id, quantity: 0 }],
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.errors['items.0.quantity']).toBeDefined();
    });

    it('harus menolak order jika product_id tidak ditemukan (422)', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customer_id: testCustomerId,
          items: [{ product_id: 9999999, quantity: 1 }],
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.errors['items.0.product_id']).toBeDefined();
    });

    it('harus mengambil harga snapshot dari DB meskipun client mengirimkan harga palsu (Integritas Harga)', async () => {
      // Client tries to spoof price to Rp 1.000 instead of DB price Rp 50.000
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customer_id: testCustomerId,
          items: [
            {
              product_id: testProduct1Id,
              quantity: 1,
              price: 1000,
              unit_price: 1000,
              subtotal: 1000,
            },
          ],
        });

      expect(response.status).toBe(201);
      const order = response.body.data;
      // Server must enforce real price from database: Rp 50.000
      expect(parseFloat(order.items[0].unit_price)).toBe(product1Price);
      expect(parseFloat(order.total_amount)).toBe(product1Price);
    });

    it('harus menolak order jika tanpa token otentikasi (401)', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          customer_id: testCustomerId,
          items: [{ product_id: testProduct1Id, quantity: 1 }],
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/orders (Listing & Filtering)', () => {
    it('harus mengembalikan daftar riwayat transaksi dengan metadata pagination (200)', async () => {
      const response = await request(app)
        .get('/api/orders?page=1&per_page=5')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta).toHaveProperty('page', 1);
      expect(response.body.meta).toHaveProperty('per_page', 5);
      expect(response.body.meta).toHaveProperty('total');
    });

    it('harus mendukung filter berdasarkan customer_id', async () => {
      const response = await request(app)
        .get(`/api/orders?customer_id=${testCustomerId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      response.body.data.forEach((ord: any) => {
        expect(ord.customer_id).toBe(testCustomerId);
      });
    });

    it('harus menolak request list tanpa token otentikasi (401)', async () => {
      const response = await request(app).get('/api/orders');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/orders/:id (Order Detail Inspection)', () => {
    it('harus mengembalikan detail order yang valid berdasarkan ID numerik (200)', async () => {
      // Fetch list to get created order id
      const listRes = await request(app)
        .get(`/api/orders?customer_id=${testCustomerId}`)
        .set('Authorization', `Bearer ${authToken}`);

      const targetOrder = listRes.body.data[0];
      expect(targetOrder).toBeDefined();

      const response = await request(app)
        .get(`/api/orders/${targetOrder.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(targetOrder.id);
      expect(response.body.data.order_number).toBe(targetOrder.order_number);
      expect(Array.isArray(response.body.data.items)).toBe(true);
    });

    it('harus mengembalikan 404 untuk ID order yang tidak ada di database', async () => {
      const response = await request(app)
        .get('/api/orders/9999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('harus mengembalikan 422 untuk format ID bukan angka', async () => {
      const response = await request(app)
        .get('/api/orders/abc')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });
  });
});

