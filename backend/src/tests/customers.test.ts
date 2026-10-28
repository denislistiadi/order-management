/**
 * Integration test suite for Customer Directory Module (Task 4.1).
 * Tests CRUD flows, Zod validation, UUID parameters, multi-column sorting,
 * search, and soft deletion.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import { prisma } from '../lib/prisma';

describe('Customers API (/api/customers)', () => {
  let authToken = '';
  let createdCustomerId: string;
  const testCustomerName = 'TEST-CUST Budi Santoso';

  beforeAll(async () => {
    // 1. Authenticate to obtain Bearer token for protected customer endpoints
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'password123',
    });

    expect(loginRes.status).toBe(200);
    authToken = loginRes.body.data.accessToken;

    // 2. Clean up any existing test records
    await prisma.customer.deleteMany({
      where: {
        customerName: {
          contains: 'TEST-CUST',
        },
      },
    });
  });

  afterAll(async () => {
    // Clean up test records created during test execution
    await prisma.customer.deleteMany({
      where: {
        customerName: {
          contains: 'TEST-CUST',
        },
      },
    });
  });

  describe('POST /api/customers', () => {
    it('harus berhasil membuat pelanggan baru dengan data valid (201)', async () => {
      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customer_name: testCustomerName,
          customer_address: 'Jl. Sudirman No. 123, Jakarta Selatan',
          gender: 'Pria',
          birth_date: '1992-05-15',
          phone: '081234567890',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.customer_name).toBe(testCustomerName);
      expect(response.body.data.customer_address).toBe('Jl. Sudirman No. 123, Jakarta Selatan');
      expect(response.body.data.gender).toBe('Pria');
      expect(response.body.data.birth_date).toBe('1992-05-15');
      expect(response.body.data.phone).toBe('081234567890');
      expect(response.body.data.deleted_at).toBeNull();

      createdCustomerId = response.body.data.id;
    });

    it('harus menolak pembuatan pelanggan jika field wajib kosong (422)', async () => {
      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveProperty('customer_name');
      expect(response.body.errors).toHaveProperty('customer_address');
      expect(response.body.errors).toHaveProperty('gender');
      expect(response.body.errors).toHaveProperty('birth_date');
    });

    it('harus menolak pembuatan pelanggan jika gender bukan Pria/Wanita (422)', async () => {
      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customer_name: 'TEST-CUST Invalid Gender',
          customer_address: 'Jl. Random No. 1',
          gender: 'Alien',
          birth_date: '1995-01-01',
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveProperty('gender');
    });

    it('harus menolak pembuatan pelanggan jika tanggal lahir di masa depan (422)', async () => {
      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customer_name: 'TEST-CUST Future Baby',
          customer_address: 'Jl. Waktu No. 99',
          gender: 'Wanita',
          birth_date: '2099-01-01',
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveProperty('birth_date');
    });

    it('harus menolak pembuatan pelanggan jika format telepon tidak valid (422)', async () => {
      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customer_name: 'TEST-CUST Invalid Phone',
          customer_address: 'Jl. Telepon No. 1',
          gender: 'Pria',
          birth_date: '1990-01-01',
          phone: 'BukanNomorTelepon#@!',
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveProperty('phone');
    });

    it('harus menolak request tanpa token otentikasi (401)', async () => {
      const response = await request(app).post('/api/customers').send({
        customer_name: 'Unauthorized',
        customer_address: 'No Address',
        gender: 'Pria',
        birth_date: '1990-01-01',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/customers', () => {
    it('harus mengembalikan daftar pelanggan dengan pagination metadata (200)', async () => {
      const response = await request(app)
        .get('/api/customers?page=1&per_page=5')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
      expect(response.body.meta).toHaveProperty('page', 1);
      expect(response.body.meta).toHaveProperty('per_page', 5);
      expect(response.body.meta).toHaveProperty('total');
      expect(response.body.meta).toHaveProperty('total_pages');
    });

    it('harus dapat melakukan pencarian case-insensitive berdasarkan nama pelanggan', async () => {
      const response = await request(app)
        .get(`/api/customers?search=budi%20santoso`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      const match = response.body.data.every((c: any) =>
        c.customer_name.toLowerCase().includes('budi santoso')
      );
      expect(match).toBe(true);
    });

    it('harus mendukung multi-field sorting (misal: nama lalu tanggal lahir)', async () => {
      const response = await request(app)
        .get('/api/customers?sort=customer_name:asc,birth_date:desc&per_page=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('harus menolak request tanpa token otentikasi (401)', async () => {
      const response = await request(app).get('/api/customers');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/customers/:id', () => {
    it('harus mengembalikan detail pelanggan berdasarkan ID UUID (200)', async () => {
      const response = await request(app)
        .get(`/api/customers/${createdCustomerId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(createdCustomerId);
      expect(response.body.data.customer_name).toBe(testCustomerName);
    });

    it('harus mengembalikan 404 jika ID UUID tidak terdaftar di database', async () => {
      const nonExistentUuid = '99999999-9999-4999-a999-999999999999';
      const response = await request(app)
        .get(`/api/customers/${nonExistentUuid}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('harus mengembalikan 422 jika format ID bukan UUID', async () => {
      const response = await request(app)
        .get('/api/customers/not-a-valid-uuid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/customers/:id', () => {
    it('harus berhasil memperbarui data profil pelanggan (200)', async () => {
      const response = await request(app)
        .put(`/api/customers/${createdCustomerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customer_name: 'TEST-CUST Budi Santoso Updated',
          customer_address: 'Jl. Thamrin No. 99, Jakarta Pusat',
          phone: '081999888777',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.customer_name).toBe('TEST-CUST Budi Santoso Updated');
      expect(response.body.data.customer_address).toBe('Jl. Thamrin No. 99, Jakarta Pusat');
      expect(response.body.data.phone).toBe('081999888777');
    });

    it('harus mengembalikan 404 jika memperbarui pelanggan yang tidak ada', async () => {
      const nonExistentUuid = '88888888-8888-4888-a888-888888888888';
      const response = await request(app)
        .put(`/api/customers/${nonExistentUuid}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customer_name: 'Ghost Customer',
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('harus mengembalikan 422 jika format ID bukan UUID saat update', async () => {
      const response = await request(app)
        .put('/api/customers/12345')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customer_name: 'Ghost Customer',
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/customers/:id (Soft Delete)', () => {
    it('harus berhasil melakukan soft delete pelanggan (200)', async () => {
      const response = await request(app)
        .delete(`/api/customers/${createdCustomerId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verifikasi langsung ke database bahwa deleted_at telah terisi
      const dbCustomer = await prisma.customer.findUnique({
        where: { id: createdCustomerId },
      });
      expect(dbCustomer).not.toBeNull();
      expect(dbCustomer?.deletedAt).not.toBeNull();
    });

    it('pelanggan yang telah di-soft-delete tidak boleh muncul di daftar pelanggan aktif', async () => {
      const response = await request(app)
        .get(`/api/customers?search=${encodeURIComponent('TEST-CUST Budi Santoso Updated')}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      const exists = response.body.data.some((c: any) => c.id === createdCustomerId);
      expect(exists).toBe(false);
    });

    it('harus mengembalikan 404 saat mencoba mengambil detail pelanggan yang sudah di-soft-delete', async () => {
      const response = await request(app)
        .get(`/api/customers/${createdCustomerId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('harus mengembalikan 404 saat mencoba menghapus pelanggan yang sudah di-soft-delete', async () => {
      const response = await request(app)
        .delete(`/api/customers/${createdCustomerId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});

