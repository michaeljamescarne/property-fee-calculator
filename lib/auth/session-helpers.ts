/**
 * Session Helpers
 * Additional utilities for reading sessions from requests
 */

import { NextRequest } from "next/server";
import { verifySession, COOKIE_NAME } from "./session";
import type { Session } from "@/types/auth";

/**
 * Get session from request (for API routes)
 * Uses request Cookie header parsing (most reliable in API routes)
 */
export async function getSessionFromRequest(request: NextRequest): Promise<Session | null> {
  if (!request) {
    console.log("getSessionFromRequest - No request provided");
    return null;
  }

  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    console.log("getSessionFromRequest - No cookie header in request");
    return null;
  }

  // Parse cookies from header
  const cookies = parseCookies(cookieHeader);
  const token = cookies[COOKIE_NAME];

  if (!token) {
    console.log("getSessionFromRequest - No firb-session cookie found in request");
    // Log available cookies for debugging (without values)
    const cookieNames = Object.keys(cookies);
    console.log("getSessionFromRequest - Available cookies:", cookieNames.join(", "));
    return null;
  }

  // Validate token format (JWT tokens start with "eyJ")
  if (!token.startsWith("eyJ")) {
    console.error("getSessionFromRequest - Token does not appear to be a valid JWT");
    return null;
  }

  console.log("getSessionFromRequest - Token found, length:", token.length);

  try {
    const session = await verifySession(token);
    if (session) {
      console.log(
        "getSessionFromRequest - Session verified successfully, userId:",
        session.user.id
      );
      return session;
    } else {
      console.log("getSessionFromRequest - Session verification failed (invalid/expired token)");
    }
  } catch (error) {
    console.error("getSessionFromRequest - Verification error:", error);
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
