/**
 * Authentication service handling business logic for admin credentials verification,
 * JWT access & refresh token issuance, token rotation, and profile retrieval.
 */

import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { LoginInput } from '../validators/auth.validator';
import { LoginResponseData, RefreshResponseData, UserProfileResponse } from '../types/auth.types';
import { AppError } from '../middlewares/errorHandler';
import { tokenBlacklist } from '../utils/tokenBlacklist';

export class AuthService {
  /**
   * Authenticates administrator credentials and returns access & refresh tokens.
   *
   * @param input - Login credentials (email and plaintext password)
   * @returns JWT access token, refresh token, and sanitized user profile
   */
  async login(input: LoginInput): Promise<LoginResponseData> {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      const error: AppError = new Error('Email atau kata sandi salah');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      const error: AppError = new Error('Email atau kata sandi salah');
      error.statusCode = 401;
      throw error;
    }

    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const refreshToken = signRefreshToken({ id: user.id });

    const userProfile: UserProfileResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return {
      accessToken,
      refreshToken,
      user: userProfile,
    };
  }

  /**
   * Refreshes expired access tokens using a valid, non-blacklisted refresh token.
   *
   * @param refreshTokenStr - Incoming refresh token
   * @returns Newly signed access and refresh tokens
   */
  async refresh(refreshTokenStr: string): Promise<RefreshResponseData> {
    if (tokenBlacklist.has(refreshTokenStr)) {
      const error: AppError = new Error('Refresh token telah dicabut / tidak valid');
      error.statusCode = 401;
      throw error;
    }

    let payload: { id: string };
    try {
      payload = verifyRefreshToken(refreshTokenStr);
    } catch (_err) {
      const error: AppError = new Error('Sesi kedaluwarsa atau refresh token tidak valid');
      error.statusCode = 401;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      const error: AppError = new Error('Pengguna tidak ditemukan');
      error.statusCode = 401;
      throw error;
    }

    // Blacklist old refresh token to prevent replay
    tokenBlacklist.add(refreshTokenStr);

    const newAccessToken = signAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const newRefreshToken = signRefreshToken({ id: user.id });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Retrieves profile details for the authenticated user ID.
   *
   * @param userId - UUID of the logged-in user
   * @returns User profile details without password hash
   */
  async getProfile(userId: string): Promise<UserProfileResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error: AppError = new Error('Pengguna tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  /**
   * Revokes access and refresh tokens by adding them to the blacklist.
   */
  async logout(accessToken?: string, refreshToken?: string): Promise<void> {
    if (accessToken) {
      tokenBlacklist.add(accessToken);
    }
    if (refreshToken) {
      tokenBlacklist.add(refreshToken);
    }
  }
}

export const authService = new AuthService();
export default authService;
