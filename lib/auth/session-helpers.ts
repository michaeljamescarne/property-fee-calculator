/**
 * Session Helpers
 * Additional utilities for reading sessions from requests
 */

import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { verifySession, COOKIE_NAME } from "./session";
import type { Session } from "@/types/auth";

/**
 * Get session from request (for API routes)
 * Tries both request cookies and next/headers cookies
 */
export async function getSessionFromRequest(request?: NextRequest): Promise<Session | null> {
  // Try reading from request cookies first (for API routes)
  if (request) {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const cookies = parseCookies(cookieHeader);
      const token = cookies[COOKIE_NAME];
      if (token) {
        const session = await verifySession(token);
        if (session) {
          return session;
        }
      }
    }
  }

  // Fallback to next/headers cookies (for server components)
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) {
      return await verifySession(token);
    }
  } catch (error) {
    console.error("Error reading cookies from next/headers:", error);
  }

  return null;
}

/**
 * Parse cookie header string into object
 */
function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieHeader.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    if (name && rest.length > 0) {
      cookies[name] = rest.join("=");
    }
  });
  return cookies;
}
