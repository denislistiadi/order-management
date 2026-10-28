/**
 * Authentication module type definitions.
 * Defines payload structures for credential submissions, user models, and session tokens.
 */

/**
 * Authenticated system administrator profile model.
 */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload sent during authentication requests.
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Data payload returned upon successful authentication.
 */
export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
}

/**
 * Data payload returned upon token refresh.
 */
export interface RefreshResponseData {
  accessToken: string;
  refreshToken: string;
}
