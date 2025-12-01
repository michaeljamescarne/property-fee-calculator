/**
 * Logout API Route
 * Clears the user session
 */

import { NextResponse } from "next/server";
import { clearSession, COOKIE_NAME, getCookieOptions } from "@/lib/auth/session";

export async function POST() {
  try {
    // Clear session using cookies() API (for server components)
    await clearSession();

    // Also clear cookie via response (for API routes)
    const response = NextResponse.json({
      success: true,
      message: "Successfully logged out",
    });

    const cookieOptions = getCookieOptions();
    // Delete cookie by setting maxAge to 0
    response.cookies.set(COOKIE_NAME, "", {
      ...cookieOptions,
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}

// Handle GET requests (not allowed)
export async function GET() {
  return NextResponse.json({ error: "Method not allowed. Use POST." }, { status: 405 });
}
