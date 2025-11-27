/**
 * Magic Code Authentication
 * Generate and validate 6-digit OTP codes
 */

import { createHash } from "crypto";

/**
 * Generate a random 6-digit code
 */
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Hash a code for secure storage
 */
export function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

/**
 * Verify if a code matches its hash
 */
export function verifyCode(code: string, hash: string): boolean {
  return hashCode(code) === hash;
}

/**
 * Calculate expiry time (10 minutes from now)
 */
export function getExpiryTime(): Date {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
}

/**
 * Check if a code is expired
 */
export function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate code format (6 digits)
 */
export function isValidCodeFormat(code: string): boolean {
  return /^\d{6}$/.test(code);
}

/**
 * Rate limiting check
 * Returns time in seconds until next attempt allowed
 */
export function getRateLimitWait(attempts: { timestamp: number }[]): number {
  const now = Date.now();
  const tenMinutesAgo = now - 10 * 60 * 1000;

  // Filter recent attempts (within last 10 minutes)
  const recentAttempts = attempts.filter((a) => a.timestamp > tenMinutesAgo);

  // Max 3 attempts per 10 minutes
  if (recentAttempts.length >= 3) {
    const oldestAttempt = Math.min(...recentAttempts.map((a) => a.timestamp));
    const waitUntil = oldestAttempt + 10 * 60 * 1000;
    return Math.ceil((waitUntil - now) / 1000);
  }

  return 0;
}
