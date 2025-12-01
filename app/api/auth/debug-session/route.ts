/**
 * Debug Session API Route
 * Returns detailed session debugging information
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session-helpers";
import { COOKIE_NAME, verifySession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const debug: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    };

    // Step 1: Check request headers
    const cookieHeader = request.headers.get("cookie");
    debug.step1_requestHeaders = {
      hasCookieHeader: !!cookieHeader,
      cookieHeaderValue: cookieHeader ? cookieHeader.substring(0, 200) + "..." : null,
      allHeaders: Object.fromEntries(request.headers.entries()),
    };

    // Step 2: Parse cookies manually
    if (cookieHeader) {
      const cookies: Record<string, string> = {};
      cookieHeader.split(";").forEach((cookie) => {
        const [name, ...rest] = cookie.trim().split("=");
        if (name && rest.length > 0) {
          cookies[name] = rest.join("=");
        }
      });
      debug.step2_parsedCookies = {
        cookieNames: Object.keys(cookies),
        hasSessionCookie: COOKIE_NAME in cookies,
        sessionCookieValue: cookies[COOKIE_NAME]
          ? cookies[COOKIE_NAME].substring(0, 50) + "..."
          : null,
        sessionCookieLength: cookies[COOKIE_NAME]?.length || 0,
      };

      // Step 3: Validate token format
      const token = cookies[COOKIE_NAME];
      if (token) {
        debug.step3_tokenValidation = {
          tokenLength: token.length,
          startsWithEyJ: token.startsWith("eyJ"),
          isValidFormat: token.startsWith("eyJ") && token.length > 50,
        };

        // Step 4: Try to verify token
        try {
          const session = await verifySession(token);
          debug.step4_tokenVerification = {
            success: !!session,
            userId: session?.user?.id || null,
            userEmail: session?.user?.email || null,
            expiresAt: session?.expiresAt ? new Date(session.expiresAt * 1000).toISOString() : null,
            isExpired: session?.expiresAt ? session.expiresAt < Date.now() / 1000 : null,
          };
        } catch (verifyError) {
          debug.step4_tokenVerification = {
            success: false,
            error: verifyError instanceof Error ? verifyError.message : "Unknown error",
            errorType: verifyError instanceof Error ? verifyError.constructor.name : "Unknown",
          };
        }
      } else {
        debug.step3_tokenValidation = {
          error: "No token found in cookies",
        };
      }
    } else {
      debug.step2_parsedCookies = {
        error: "No cookie header in request",
      };
    }

    // Step 5: Use getSessionFromRequest helper
    try {
      const session = await getSessionFromRequest(request);
      debug.step5_helperFunction = {
        sessionFound: !!session,
        userId: session?.user?.id || null,
        userEmail: session?.user?.email || null,
      };
    } catch (helperError) {
      debug.step5_helperFunction = {
        error: helperError instanceof Error ? helperError.message : "Unknown error",
      };
    }

    // Step 6: Check user profile in database (if session exists)
    const session = await getSessionFromRequest(request);
    if (session) {
      try {
        const supabase = await createClient();
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        debug.step6_databaseProfile = {
          found: !!profile,
          error: profileError?.message || null,
          profileId: profile?.id || null,
          profileEmail: profile?.email || null,
        };
      } catch (dbError) {
        debug.step6_databaseProfile = {
          error: dbError instanceof Error ? dbError.message : "Unknown error",
        };
      }
    } else {
      debug.step6_databaseProfile = {
        skipped: "No session found",
      };
    }

    // Step 7: Environment checks
    debug.step7_environment = {
      nodeEnv: process.env.NODE_ENV,
      jwtSecretSet: !!process.env.JWT_SECRET,
      jwtSecretIsDefault: process.env.JWT_SECRET === "your-secret-key-change-this-in-production",
      cookieName: COOKIE_NAME,
    };

    return NextResponse.json(debug, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug failed",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
