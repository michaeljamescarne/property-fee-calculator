/**
 * Verify Magic Code API Route
 * Verifies the 6-digit code and creates a session
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
// Removed unused import
import { verifyCode, isExpired, isValidEmail, isValidCodeFormat } from "@/lib/auth/magic-code";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import type { MagicCode, UserProfile } from "@/types/database";
import type { VerifyCodeRequest, VerifyCodeResponse, AuthErrorResponse } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    const body: VerifyCodeRequest = await request.json();
    const { email, code } = body;

    // Validate inputs
    if (!email || !isValidEmail(email)) {
      const error: AuthErrorResponse = {
        error: "INVALID_EMAIL",
        message: "Please provide a valid email address",
      };
      return NextResponse.json(error, { status: 400 });
    }

    if (!code || !isValidCodeFormat(code)) {
      const error: AuthErrorResponse = {
        error: "CODE_INVALID",
        message: "Please provide a valid 6-digit code",
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Get code from database
    const supabase = createServiceRoleClient();

    const { data: magicCodes, error: fetchError } = await supabase
      .from("magic_codes")
      .select("*")
      .eq("email", email)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError || !magicCodes || magicCodes.length === 0) {
      const error: AuthErrorResponse = {
        error: "CODE_INVALID",
        message: "Invalid or expired code",
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Type assertion for Supabase response
    const magicCode = magicCodes[0] as MagicCode;

    // Check if expired
    if (isExpired(magicCode.expires_at)) {
      const error: AuthErrorResponse = {
        error: "CODE_EXPIRED",
        message: "This code has expired. Please request a new one.",
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Check max attempts
    if (magicCode.attempts >= 3) {
      const error: AuthErrorResponse = {
        error: "MAX_ATTEMPTS",
        message: "Too many failed attempts. Please request a new code.",
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Verify code
    const isValid = verifyCode(code, magicCode.code);

    if (!isValid) {
      // Increment attempts
      await supabase
        .from("magic_codes")
        .update({ attempts: magicCode.attempts + 1 } as never)
        .eq("id", magicCode.id);

      const error: AuthErrorResponse = {
        error: "CODE_INVALID",
        message: `Invalid code. ${2 - magicCode.attempts} attempts remaining.`,
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Mark code as used
    await supabase
      .from("magic_codes")
      .update({ used: true } as never)
      .eq("id", magicCode.id);

    // Check if user profile already exists - ALWAYS query by email to get the correct profile
    // Use maybeSingle() to handle case where no profile exists, and order by created_at desc
    // to get the most recent profile if duplicates exist
    const { data: existingProfileData, error: profileLookupError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false }) // Get most recent if duplicates exist
      .limit(1)
      .maybeSingle();

    if (profileLookupError) {
      console.error("Verify code - Profile lookup error:", {
        error: profileLookupError,
        email: email,
      });
      const error: AuthErrorResponse = {
        error: "SERVER_ERROR",
        message: "Failed to look up user account. Please try again.",
      };
      return NextResponse.json(error, { status: 500 });
    }

    let profile: UserProfile;

    if (existingProfileData) {
      // User profile exists - use the EXACT profile from database
      profile = existingProfileData as UserProfile;

      console.log("Verify code - Found existing profile from database:", {
        userId: profile.id,
        email: profile.email,
        role: (profile as { role?: string | null }).role,
        created_at: (profile as { created_at?: string }).created_at,
      });

      // Update last login using the ID from the database profile
      await supabase
        .from("user_profiles")
        .update({ last_login_at: new Date().toISOString() } as never)
        .eq("id", profile.id);
    } else {
      // Create new user profile directly (bypass Supabase Auth for now)
      const { data: newProfile, error: profileError } = await supabase
        .from("user_profiles")
        .insert({
          email,
          subscription_status: "free",
          calculations_count: 0,
        } as never)
        .select()
        .single();

      if (profileError || !newProfile) {
        console.error("Verify code - Profile creation error:", profileError);
        const error: AuthErrorResponse = {
          error: "SERVER_ERROR",
          message: "Failed to create user account. Please try again.",
        };
        return NextResponse.json(error, { status: 500 });
      }

      profile = newProfile as UserProfile;

      console.log("Verify code - Created new profile:", {
        userId: profile.id,
        email: profile.email,
      });
    }

    // Verify we have the profile with the correct ID from database
    if (!profile || !profile.id) {
      console.error("Verify code - Profile or profile.id is missing:", {
        hasProfile: !!profile,
        hasId: !!profile?.id,
      });
      const error: AuthErrorResponse = {
        error: "SERVER_ERROR",
        message: "Failed to get user profile.",
      };
      return NextResponse.json(error, { status: 500 });
    }

    // Create session with the EXACT profile from database (ensures correct user ID)
    // This profile.id is the source of truth from the database
    const token = await createSession(profile);
    console.log("Verify code - Session token created with database profile:", {
      tokenLength: token.length,
      userId: profile.id, // This is the ID from the database
      email: profile.email,
      profileId: profile.id,
      role: (profile as { role?: string | null }).role,
    });

    // Import cookie options helper
    const { getCookieOptions, COOKIE_NAME } = await import("@/lib/auth/session");

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Successfully authenticated",
      user: profile,
    } as VerifyCodeResponse);

    // Set cookie using Next.js cookies API with proper options
    const cookieOptions = getCookieOptions();
    response.cookies.set(COOKIE_NAME, token, cookieOptions);

    // Verify cookie was set
    const setCookieHeader = response.headers.get("set-cookie");
    console.log("Verify code - Cookie set:", setCookieHeader ? "SUCCESS" : "FAILED");
    if (setCookieHeader) {
      console.log("Verify code - Cookie domain:", cookieOptions.domain || "default (current host)");
      console.log("Verify code - Cookie secure:", cookieOptions.secure);
    }

    return response;
  } catch (error) {
    console.error("Verify code error:", error);
    const errorResponse: AuthErrorResponse = {
      error: "SERVER_ERROR",
      message: "An unexpected error occurred. Please try again.",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Handle GET requests (not allowed)
export async function GET() {
  return NextResponse.json({ error: "Method not allowed. Use POST." }, { status: 405 });
}
