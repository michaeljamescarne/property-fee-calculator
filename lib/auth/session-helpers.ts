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
        console.log("getSessionFromRequest - Token found in request, length:", token.length);
        try {
          const session = await verifySession(token);
          if (session) {
            console.log("getSessionFromRequest - Session verified successfully");
            return session;
          } else {
            console.log("getSessionFromRequest - Session verification failed (invalid token)");
          }
        } catch (error) {
          console.error("getSessionFromRequest - Verification error:", error);
        }
      } else {
        console.log("getSessionFromRequest - No token in cookies object");
      }
    } else {
      console.log("getSessionFromRequest - No cookie header in request");
    }
  }

  // Fallback to next/headers cookies (for server components)
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) {
      console.log("getSessionFromRequest - Token found via cookies() API");
      return await verifySession(token);
    } else {
      console.log("getSessionFromRequest - No token via cookies() API");
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
