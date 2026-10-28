/**
 * Integration test suite for Dashboard Analytical Summary API (`/api/dashboard/summary`).
 * Validates revenue aggregation, KPI metrics, top-selling product distribution,
 * low stock inventory alerts, and JWT authentication security.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

describe('Dashboard API (/api/dashboard/summary)', () => {
  let authToken = '';
  let testCustomerId = '';
  let testProductIdLowStock = 0;
  let testProductIdTop = 0;

  beforeAll(async () => {
    // Authenticate to obtain admin Bearer token
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'password123',
    });

    expect(loginRes.status).toBe(200);
    authToken = loginRes.body.data.accessToken;

    // Clean up test records
    await prisma.orderItem.deleteMany({
      where: {
        product: {
          productCode: { in: ['PRD-DASH-LOW', 'PRD-DASH-TOP'] },
        },
      },
    });

    await prisma.order.deleteMany({
      where: {
        customer: { customerName: 'TEST-DASH Pelanggan' },
      },
    });

    await prisma.customer.deleteMany({
      where: { customerName: 'TEST-DASH Pelanggan' },
    });

    await prisma.product.deleteMany({
      where: { productCode: { in: ['PRD-DASH-LOW', 'PRD-DASH-TOP'] } },
    });

    // Seed test customer
    const customer = await prisma.customer.create({
      data: {
        customerName: 'TEST-DASH Pelanggan',
        customerAddress: 'Jl. Uji Dashboard No. 99',
        gender: 'Pria',
        birthDate: new Date('1992-05-15'),
        phone: '081299988877',
      },
    });
    testCustomerId = customer.id;

    // Seed test product with low stock (< 5)
    const productLow = await prisma.product.create({
      data: {
        productCode: 'PRD-DASH-LOW',
        productName: 'Barang Stok Menipis Test',
        price: new Prisma.Decimal(150000),
        stock: 2,
      },
    });
    testProductIdLowStock = productLow.id;

    // Seed test product for top selling
    const productTop = await prisma.product.create({
      data: {
        productCode: 'PRD-DASH-TOP',
        productName: 'Barang Laris Manis Test',
        price: new Prisma.Decimal(250000),
        stock: 50,
      },
    });
    testProductIdTop = productTop.id;

    // Create a transaction to verify aggregation
    await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        customer_id: testCustomerId,
        items: [
          { product_id: testProductIdTop, quantity: 5 },
        ],
      });
  });

  afterAll(async () => {
    // Clean up test records
    await prisma.orderItem.deleteMany({
      where: {
        product: {
          productCode: { in: ['PRD-DASH-LOW', 'PRD-DASH-TOP'] },
        },
      },
    });

    await prisma.order.deleteMany({
      where: {
        customer: { customerName: 'TEST-DASH Pelanggan' },
      },
    });

    await prisma.customer.deleteMany({
      where: { customerName: 'TEST-DASH Pelanggan' },
    });

    await prisma.product.deleteMany({
      where: { productCode: { in: ['PRD-DASH-LOW', 'PRD-DASH-TOP'] } },
    });
  });

  describe('GET /api/dashboard/summary', () => {
    it('harus menolak akses tanpa token otentikasi (401)', async () => {
      const response = await request(app).get('/api/dashboard/summary');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('harus berhasil mengembalikan metrik ringkasan eksekutif dengan data lengkap (200)', async () => {
      const response = await request(app)
        .get('/api/dashboard/summary')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();

      const summary = response.body.data;

      // Verify KPI metric counts
      expect(typeof summary.total_transactions).toBe('number');
      expect(summary.total_transactions).toBeGreaterThan(0);

      expect(typeof summary.total_revenue).toBe('string');
      expect(parseFloat(summary.total_revenue)).toBeGreaterThan(0);

      expect(typeof summary.total_products).toBe('number');
      expect(summary.total_products).toBeGreaterThan(0);

      expect(typeof summary.total_customers).toBe('number');
      expect(summary.total_customers).toBeGreaterThan(0);

      // Verify top 5 products structure and percentage
      expect(Array.isArray(summary.top_products)).toBe(true);
      expect(summary.top_products.length).toBeLessThanOrEqual(5);

      if (summary.top_products.length > 0) {
        const topItem = summary.top_products[0];
        expect(topItem).toHaveProperty('id');
        expect(topItem).toHaveProperty('product_code');
        expect(topItem).toHaveProperty('product_name');
        expect(topItem).toHaveProperty('sold_quantity');
        expect(topItem).toHaveProperty('total_revenue');
        expect(topItem).toHaveProperty('percentage');
        expect(typeof topItem.percentage).toBe('number');
      }

      // Verify low stock products (< 5)
      expect(Array.isArray(summary.low_stock_products)).toBe(true);
      summary.low_stock_products.forEach((prod: any) => {
        expect(prod.stock).toBeLessThan(5);
        expect(prod).toHaveProperty('product_code');
        expect(prod).toHaveProperty('price');
      });

      const foundLowStock = summary.low_stock_products.find(
        (p: any) => p.product_code === 'PRD-DASH-LOW'
      );
      expect(foundLowStock).toBeDefined();
      expect(foundLowStock.id).toBe(testProductIdLowStock);
      expect(foundLowStock.stock).toBe(2);

      // Verify daily sales 7-day trend
      expect(Array.isArray(summary.daily_sales)).toBe(true);
      expect(summary.daily_sales.length).toBe(7);
      summary.daily_sales.forEach((d: any) => {
        expect(d).toHaveProperty('date');
        expect(d).toHaveProperty('label');
        expect(d).toHaveProperty('revenue');
        expect(typeof d.revenue).toBe('number');
      });
    });
  });
});
