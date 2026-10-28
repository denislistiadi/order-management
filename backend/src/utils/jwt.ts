/**
 * JSON Web Token (JWT) utility functions.
 * Handles signing and cryptographic verification of access and refresh tokens.
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthUserPayload, RefreshTokenPayload } from '../types/auth.types';

/**
 * Generates an encrypted JWT access token for authenticated users.
 *
 * @param payload - Minimal user claims embedded in token
 * @returns Signed JWT access token string
 */
export function signAccessToken(payload: AuthUserPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}

/**
 * Decodes and cryptographically verifies an incoming JWT access token.
 *
 * @param token - Bearer access token received from client header
 * @returns Decoded user authentication payload
 * @throws JsonWebTokenError or TokenExpiredError if verification fails
 */
export function verifyAccessToken(token: string): AuthUserPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  return decoded as AuthUserPayload;
}

/**
 * Generates an encrypted JWT refresh token.
 *
 * @param payload - User identifier
 * @returns Signed JWT refresh token string
 */
export function signRefreshToken(payload: { id: string }): string {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign({ id: payload.id, type: 'refresh' }, env.JWT_REFRESH_SECRET, options);
}

/**
 * Decodes and cryptographically verifies an incoming JWT refresh token.
 *
 * @param token - Refresh token received from client
 * @returns Decoded refresh token payload
 * @throws JsonWebTokenError or TokenExpiredError if verification fails
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
  return decoded as RefreshTokenPayload;
}
