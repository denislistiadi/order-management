/**
 * Authentication controller handling HTTP request dispatching for auth endpoints.
 */

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { successResponse } from '../utils/response';

export class AuthController {
  /**
   * Handles user login and session token issuance.
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(successResponse(result, 'Login berhasil'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refreshes expired access token using a valid refresh token.
   */
  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refresh(refreshToken);
      res.status(200).json(successResponse(result, 'Token berhasil diperbarui'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves profile of currently authenticated user.
   */
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await authService.getProfile(userId);
      res.status(200).json(successResponse(profile, 'Profil pengguna berhasil diambil'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Invalidates current user session and revokes access/refresh tokens.
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
      const refreshToken = req.body?.refreshToken;

      await authService.logout(accessToken, refreshToken);
      res.status(200).json(successResponse(null, 'Logout berhasil'));
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
export default authController;
