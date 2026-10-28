/**
 * Authentication request validation schemas using Zod.
 */

import { z } from 'zod';

/**
 * Validation schema for user authentication / login request payload.
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email wajib diisi' })
    .trim()
    .min(1, 'Email tidak boleh kosong')
    .email('Format email tidak valid'),
  password: z
    .string({ required_error: 'Kata sandi wajib diisi' })
    .min(1, 'Kata sandi tidak boleh kosong'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Validation schema for refresh token request payload.
 */
export const refreshTokenSchema = z.object({
  refreshToken: z
    .string({ required_error: 'Refresh token wajib diisi' })
    .min(1, 'Refresh token tidak boleh kosong'),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
