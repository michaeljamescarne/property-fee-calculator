/**
 * Session Management
 * JWT token helpers and session utilities
 */

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { UserProfile } from "@/types/database";
import type { Session } from "@/types/auth";

// Validate JWT_SECRET is set and not default
const jwtSecretValue = process.env.JWT_SECRET;
if (!jwtSecretValue || jwtSecretValue === "your-secret-key-change-this-in-production") {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "JWT_SECRET must be set to a secure random value in production. Generate with: openssl rand -base64 32"
    );
  }
  console.warn(
    "JWT_SECRET is using default value. Set a secure random value in production with: openssl rand -base64 32"
  );
}

const JWT_SECRET = new TextEncoder().encode(
  jwtSecretValue || "your-secret-key-change-this-in-production"
);

export const COOKIE_NAME = "firb-session";
const SESSION_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds

/**
 * Get the correct cookie domain for the current environment
 * In production, use .propertycosts.com.au to support both www and non-www
 * In local, omit domain (defaults to current host)
 */
function getCookieDomain(): string | undefined {
  if (process.env.NODE_ENV !== "production") {
    return undefined; // Local: omit domain, defaults to current host
  }

  // Production: use .propertycosts.com.au to support both www and non-www
  return ".propertycosts.com.au";
}

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
    .setProtectedHeader({ alg: "HS256" })
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
    console.log("verifySession - Token verified successfully, userId:", payload.userId);

    return {
      user: {
        id: payload.userId as string,
        email: payload.email as string,
        subscription_status: payload.subscriptionStatus as "free" | "trial" | "paid",
      } as UserProfile,
      accessToken: token,
      expiresAt: payload.exp as number,
    };
  } catch (error) {
    console.error(
      "verifySession - Token verification failed:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return null;
  }
}

/**
 * Set session cookie with proper domain handling
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  const domain = getCookieDomain();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
    ...(domain && { domain }), // Only set domain in production
  });
}

/**
 * Get cookie options for use in API routes
 * Returns options object that can be passed to response.cookies.set()
 */
export function getCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  maxAge: number;
  path: string;
  domain?: string;
} {
  const domain = getCookieDomain();
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
    ...(domain && { domain }),
  };
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
