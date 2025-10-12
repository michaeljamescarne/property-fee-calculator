/**
 * Session Management
 * JWT token helpers and session utilities
 */

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { UserProfile } from '@/types/database';
import type { Session } from '@/types/auth';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

const COOKIE_NAME = 'firb-session';
const SESSION_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds

/**
 * Create a JWT token for a user
 */
export async function createSession(user: UserProfile): Promise<string> {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION;
  
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    subscriptionStatus: user.subscription_status,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresAt)
    .setIssuedAt()
    .sign(JWT_SECRET);
  
  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifySession(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    return {
      user: {
        id: payload.userId as string,
        email: payload.email as string,
        subscription_status: payload.subscriptionStatus as any,
      } as UserProfile,
      accessToken: token,
      expiresAt: payload.exp as number,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Set session cookie
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  });
}

/**
 * Get session from cookie
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  
  if (!token) {
    return null;
  }
  
  return verifySession(token);
}

/**
 * Clear session cookie
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Refresh session (extend expiry)
 */
export async function refreshSession(user: UserProfile): Promise<void> {
  const token = await createSession(user);
  await setSessionCookie(token);
}

