/**
 * Test Cookie API Route
 * Diagnostic endpoint to test cookie setting and reading
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const diagnostics: Record<string, unknown> = {};

  // 1. Check if cookie exists in request
  const cookieHeader = request.headers.get("cookie");
  diagnostics.requestCookieHeader = cookieHeader || "NOT PRESENT";
  diagnostics.hasCookieInRequest = !!cookieHeader?.includes("firb-session");

  // 2. Try reading via cookies() API
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("firb-session");
    diagnostics.cookiesApiRead = {
      exists: !!sessionCookie,
      value: sessionCookie ? `${sessionCookie.value.substring(0, 20)}...` : null,
    };
  } catch (error) {
    diagnostics.cookiesApiRead = {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

  // 3. Set a test cookie
  const testValue = `test-${Date.now()}`;
  const response = NextResponse.json({
    message: "Cookie test",
    diagnostics,
    testValue,
  });

  // Method 1: Manual Set-Cookie header
  const setCookieHeader = `test-cookie=${testValue}; Path=/; Max-Age=3600; SameSite=Lax; HttpOnly`;
  response.headers.append("Set-Cookie", setCookieHeader);

  // Method 2: Using cookies API
  response.cookies.set("test-cookie-2", testValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600,
    path: "/",
  });

  // Verify headers
  const allSetCookies = response.headers.getSetCookie();
  diagnostics.setCookieHeaders = allSetCookies;
  diagnostics.setCookieCount = allSetCookies.length;

  return response;
}
