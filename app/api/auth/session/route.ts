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
    // Try getting session from request first (for API routes)
    let session = await getSessionFromRequest(request);

    // Fallback to standard getSession
    if (!session) {
      session = await getSession();
    }

    // Debug logging
    const cookieHeader = request.headers.get("cookie");
    console.log("Session API - Cookie header present:", !!cookieHeader);
    console.log("Session API - Cookie header value:", cookieHeader?.substring(0, 50));
    console.log("Session API - Session found:", !!session);

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

    console.log("Session API - Returning authenticated user:", profile.email);
    return NextResponse.json({
      authenticated: true,
      user: profile,
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ error: "Failed to check session" }, { status: 500 });
  }
}
