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
    // Use getSessionFromRequest (reads from request Cookie header)
    const session = await getSessionFromRequest(request);

    if (!session) {
      console.log("Session API - No session found");
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    console.log("Session API - Session found, userId:", session.user.id);

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
