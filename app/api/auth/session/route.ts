/**
 * Session API Route
 * Returns the current user session
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getSessionFromRequest } from "@/lib/auth/session-helpers";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

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
    // Use service role client to bypass RLS (RLS uses auth.uid() which doesn't work with custom JWT)
    const supabase = createServiceRoleClient();
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profileError || !profile) {
      console.error("Session API - Profile fetch error:", profileError);
      console.error("Session API - User ID from session:", session.user.id);
      console.error("Session API - User email from session:", session.user.email);

      // If profile doesn't exist, try to create it
      // Use service role client to bypass RLS (since RLS uses auth.uid() which doesn't work with custom JWT)
      if (profileError?.code === "PGRST116" || !profile) {
        console.log("Session API - Profile not found, attempting to create...");
        const serviceRoleClient = createServiceRoleClient();
        const { data: newProfile, error: createError } = await serviceRoleClient
          .from("user_profiles")
          .insert({
            id: session.user.id,
            email: session.user.email,
            subscription_status: "free",
            calculations_count: 0,
          } as never)
          .select()
          .single();

        if (createError || !newProfile) {
          console.error("Session API - Failed to create profile:", createError);
          return NextResponse.json({
            authenticated: false,
            user: null,
            error: "Profile not found and could not be created",
          });
        }

        console.log("Session API - Profile created successfully");
        const profileData = newProfile as { id: string; email: string; [key: string]: unknown };
        return NextResponse.json({
          authenticated: true,
          user: newProfile,
        });
      }

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
