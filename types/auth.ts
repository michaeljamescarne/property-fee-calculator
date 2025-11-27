/**
 * Authentication Types
 */

import { UserProfile } from './database';

// Auth state
export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Magic code request/response
export interface SendCodeRequest {
  email: string;
}

export interface SendCodeResponse {
  success: boolean;
  message: string;
  expiresAt?: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}

// Session
export interface Session {
  user: UserProfile;
  accessToken: string;
  expiresAt: number;
}

// Auth errors
export type AuthError =
  | 'INVALID_EMAIL'
  | 'CODE_EXPIRED'
  | 'CODE_INVALID'
  | 'MAX_ATTEMPTS'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'ALREADY_USED';

export interface AuthErrorResponse {
  error: AuthError;
  message: string;
}













