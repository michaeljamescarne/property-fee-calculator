/**
 * Comprehensive Authentication Diagnostic Endpoint
 * Helps identify exactly where the auth flow is failing
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session-helpers";
import { createClient } from "@/lib/supabase/server";
import { COOKIE_NAME } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  };

  try {
    // Step 1: Check cookie in request
    const cookieHeader = request.headers.get("cookie");
    diagnostics.step1_cookieHeader = {
      present: !!cookieHeader,
      value: cookieHeader ? cookieHeader.substring(0, 100) + "..." : null,
      hasFirbSession: cookieHeader?.includes(COOKIE_NAME) || false,
    };

    // Step 2: Extract token from cookie
    let token: string | null = null;
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").map((c) => c.trim());
      const sessionCookie = cookies.find((c) => c.startsWith(`${COOKIE_NAME}=`));
      if (sessionCookie) {
        token = sessionCookie.split("=")[1];
        diagnostics.step2_tokenExtraction = {
          success: true,
          tokenLength: token.length,
          tokenPreview: token.substring(0, 30) + "...",
        };
      } else {
        diagnostics.step2_tokenExtraction = {
          success: false,
          reason: "No firb-session cookie found in header",
        };
      }
    } else {
      diagnostics.step2_tokenExtraction = {
        success: false,
        reason: "No cookie header in request",
      };
    }

    // Step 3: Try to get session from request
    if (token) {
      try {
        const session = await getSessionFromRequest(request);
        diagnostics.step3_sessionVerification = {
          success: !!session,
          hasSession: !!session,
          userId: session?.user.id || null,
          userEmail: session?.user.email || null,
        };

        // Step 4: If session exists, check database
        if (session) {
          const supabase = await createClient();
          const { data: profile, error: profileError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          const profileData = profile as { id?: string; email?: string } | null;
          diagnostics.step4_databaseCheck = {
            success: !!profile,
            hasProfile: !!profile,
            error: profileError
              ? {
                  code: profileError.code,
                  message: profileError.message,
                  details: profileError.details,
                }
              : null,
            profileId: profileData?.id || null,
            profileEmail: profileData?.email || null,
          };

          // Step 5: If profile doesn't exist, try to create it
          if (!profile && session.user.email) {
            try {
              const { data: newProfile, error: createError } = await supabase
                .from("user_profiles")
                .insert({
                  id: session.user.id,
                  email: session.user.email,
                  subscription_status: "free",
                  calculations_count: 0,
                } as never)
                .select()
                .single();

              diagnostics.step5_autoCreate = {
                attempted: true,
                success: !!newProfile,
                error: createError
                  ? {
                      code: createError.code,
                      message: createError.message,
                      details: createError.details,
                      hint: createError.hint,
                    }
                  : null,
                createdProfileId: (newProfile as { id?: string })?.id || null,
              };
            } catch (createErr) {
              diagnostics.step5_autoCreate = {
                attempted: true,
                success: false,
                error: createErr instanceof Error ? createErr.message : "Unknown error",
              };
            }
          } else {
            diagnostics.step5_autoCreate = {
              attempted: false,
              reason: profile ? "Profile already exists" : "No email in session",
            };
          }
        } else {
          diagnostics.step4_databaseCheck = {
            skipped: "No session found",
          };
          diagnostics.step5_autoCreate = {
            skipped: "No session found",
          };
        }
      } catch (sessionErr) {
        diagnostics.step3_sessionVerification = {
          success: false,
          error: sessionErr instanceof Error ? sessionErr.message : "Unknown error",
          stack: sessionErr instanceof Error ? sessionErr.stack : undefined,
        };
      }
    } else {
      diagnostics.step3_sessionVerification = {
        skipped: "No token found",
      };
    }

    // Step 6: Check environment variables
    diagnostics.step6_environment = {
      hasJWTSecret: !!process.env.JWT_SECRET,
      jwtSecretLength: process.env.JWT_SECRET?.length || 0,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + "..."
        : null,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    return NextResponse.json({
      success: true,
      diagnostics,
      summary: {
        hasCookie: !!diagnostics.step1_cookieHeader?.present,
        hasToken: !!diagnostics.step2_tokenExtraction?.success,
        hasSession: !!diagnostics.step3_sessionVerification?.hasSession,
        hasProfile: !!diagnostics.step4_databaseCheck?.hasProfile,
        profileCreated: !!diagnostics.step5_autoCreate?.success,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        diagnostics,
      },
      { status: 500 }
    );
  }
}
