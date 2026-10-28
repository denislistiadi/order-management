/**
 * JWT Authentication middleware.
 * Verifies Bearer tokens in incoming HTTP authorization headers to protect private endpoints.
 * Checks token revocation status against the token blacklist.
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { errorResponse } from '../utils/response';
import { tokenBlacklist } from '../utils/tokenBlacklist';

/**
 * Express middleware to authenticate JSON Web Tokens.
 * Populates `req.user` with decoded token claims if valid.
 */
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json(
      errorResponse('Akses ditolak: Token autentikasi tidak ditemukan')
    );
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json(
      errorResponse('Akses ditolak: Format token autentikasi tidak valid')
    );
    return;
  }

  // Immediately reject revoked / blacklisted tokens
  if (tokenBlacklist.has(token)) {
    res.status(401).json(
      errorResponse('Sesi telah diakhiri: Token telah dicabut')
    );
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (_error) {
    res.status(401).json(
      errorResponse('Sesi kedaluwarsa atau token tidak valid')
    );
  }
}

export default authenticateToken;
