/**
 * Simple Admin Check API
 * Quick endpoint to check admin status without complex diagnostics
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session-helpers";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({
        loggedIn: false,
        message: "Not logged in",
      });
    }

    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("id, email, role")
      .eq("id", session.user.id)
      .single();

    if (error) {
      return NextResponse.json({
        loggedIn: true,
        hasProfile: false,
        error: error.message,
        userId: session.user.id,
        userEmail: session.user.email,
      });
    }

    const profileData = profile as { id: string; email: string; role: string | null } | null;
    const role = profileData?.role || "not set";
    const isAdmin = role === "admin";

    return NextResponse.json({
      loggedIn: true,
      hasProfile: true,
      userId: session.user.id,
      userEmail: session.user.email,
      role,
      isAdmin,
      message: isAdmin ? "You are an admin" : `Role is "${role}", not admin`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Check failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
