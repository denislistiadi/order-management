/**
 * Integration test suite for Authentication Module (Task 2.1 & Task 2.2).
 * Tests login flows, credential validation, JWT access & refresh tokens,
 * token rotation, blacklist revocation, and session logout.
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../index';

describe('Authentication API (/api/auth)', () => {
  let authToken = '';
  let refreshToken = '';

  describe('POST /api/auth/login', () => {
    it('harus berhasil login dengan kredensial admin yang valid dan mengembalikan access serta refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login berhasil');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.accessToken).toBeTypeOf('string');
      expect(response.body.data.refreshToken).toBeTypeOf('string');
      expect(response.body.data.token).toBeUndefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe('admin@example.com');
      expect(response.body.data.user.name).toBe('System Administrator');
      expect(response.body.data.user.password).toBeUndefined(); // Memastikan password hash tidak bocor

      authToken = response.body.data.accessToken;
      refreshToken = response.body.data.refreshToken;
    });

    it('harus menolak login dengan password salah (401)', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Email atau kata sandi salah/i);
    });

    it('harus menolak login dengan email yang tidak terdaftar (401)', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unregistered@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Email atau kata sandi salah/i);
    });

    it('harus mengembalikan error 422 jika format email tidak valid', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email-format',
          password: 'password123',
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors['email']).toBeDefined();
    });

    it('harus mengembalikan error 422 jika payload kosong', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('harus berhasil memperbarui access token menggunakan refresh token yang valid', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeTypeOf('string');
      expect(response.body.data.refreshToken).toBeTypeOf('string');

      // Update tokens dengan token baru hasil rotasi
      authToken = response.body.data.accessToken;
      refreshToken = response.body.data.refreshToken;
    });

    it('harus menolak refresh token yang tidak valid atau palsu (401)', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-fake-refresh-token' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/refresh token tidak valid/i);
    });

    it('harus mengembalikan error 422 jika refresh token tidak dikirimkan', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({});

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/auth/me', () => {
    it('harus berhasil mengambil profil jika menyertakan Bearer token valid', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe('admin@example.com');
      expect(response.body.data.name).toBe('System Administrator');
    });

    it('harus menolak akses jika tidak menyertakan Authorization header (401)', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Token autentikasi tidak ditemukan/i);
    });

    it('harus menolak akses jika token tidak valid / rusak (401)', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token-string-xyz');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Sesi kedaluwarsa atau token tidak valid/i);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('harus berhasil logout dan mencabut token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toMatch(/Logout berhasil/i);
    });

    it('harus menolak request berikutnya yang menggunakan token yang sudah di-blacklist (401)', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Token telah dicabut/i);
    });

    it('harus menolak logout jika tidak memiliki token valid (401)', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Swagger Documentation (/api-docs)', () => {
    it('harus dapat mengakses rute Swagger API documentation', async () => {
      const response = await request(app).get('/api-docs/');
      expect([200, 301, 302]).toContain(response.status);
    });
  });
});
