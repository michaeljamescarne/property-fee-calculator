/**
 * Session API Route
 * Returns the current user session
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getSessionFromRequest } from "@/lib/auth/session-helpers";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    // Debug logging
    const cookieHeader = request.headers.get("cookie");
    console.log("Session API - Cookie header present:", !!cookieHeader);

    // Extract firb-session cookie from header manually
    let tokenFromHeader: string | null = null;
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").map((c) => c.trim());
      const sessionCookie = cookies.find((c) => c.startsWith("firb-session="));
      if (sessionCookie) {
        tokenFromHeader = sessionCookie.split("=")[1];
        console.log("Session API - Token extracted from header, length:", tokenFromHeader.length);
      }
    }

    // Try getting session from request first (for API routes)
    let session = await getSessionFromRequest(request);

    // Fallback to standard getSession
    if (!session) {
      session = await getSession();
    }

    // If still no session but we have a token, try verifying it directly
    if (!session && tokenFromHeader) {
      console.log("Session API - No session found, trying direct token verification");
      const { verifySession } = await import("@/lib/auth/session");
      session = await verifySession(tokenFromHeader);
      if (session) {
        console.log("Session API - Direct verification succeeded");
      } else {
        console.log("Session API - Direct verification failed (invalid/expired token)");
      }
    }

    console.log("Session API - Session found:", !!session);
    if (session) {
      console.log("Session API - User ID:", session.user.id);
    }

    if (!session) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    // Get full user profile from database
    const supabase = await createClient();
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profileError || !profile) {
      console.error("Session API - Profile fetch error:", profileError);
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    const profileData = profile as { id: string; email: string; [key: string]: unknown };
    console.log("Session API - Returning authenticated user:", profileData.email);
    return NextResponse.json({
      authenticated: true,
      user: profile,
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ error: "Failed to check session" }, { status: 500 });
  }
}
