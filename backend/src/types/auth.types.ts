/**
 * Authentication type definitions and Express Request extensions.
 */

export interface AuthUserPayload {
  id: string;
  name: string;
  email: string;
}

export interface RefreshTokenPayload {
  id: string;
  type: 'refresh';
}

export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: UserProfileResponse;
}

export interface RefreshResponseData {
  accessToken: string;
  refreshToken: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}
