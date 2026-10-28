/**
 * Authentication route declarations.
 * Defines public login, refresh token, and protected session management routes.
 */

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { loginSchema, refreshTokenSchema } from '../validators/auth.validator';
import { authenticateToken } from '../middlewares/authMiddleware';

export const authRouter = Router();

// Public authentication endpoints
authRouter.post('/login', validate(loginSchema), (req, res, next) => {
  authController.login(req, res, next);
});

authRouter.post('/refresh', validate(refreshTokenSchema), (req, res, next) => {
  authController.refresh(req, res, next);
});

// Protected session endpoints
authRouter.post('/logout', authenticateToken, (req, res, next) => {
  authController.logout(req, res, next);
});

authRouter.get('/me', authenticateToken, (req, res, next) => {
  authController.getMe(req, res, next);
});

export default authRouter;
