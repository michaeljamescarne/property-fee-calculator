/**
 * Test Cookie API Route
 * Diagnostic endpoint to verify cookie can be set and read
 */

import { NextRequest, NextResponse } from "next/server";
import { getCookieOptions, COOKIE_NAME, createSession, verifySession } from "@/lib/auth/session";
import { getSessionFromRequest } from "@/lib/auth/session-helpers";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const diagnostics: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    };

    // Test 1: Check cookie options
    const cookieOptions = getCookieOptions();
    diagnostics.cookieOptions = {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: cookieOptions.maxAge,
      domain: cookieOptions.domain || "not set (defaults to current host)",
    };

    // Test 2: Check if cookie exists in request
    const cookieHeader = request.headers.get("cookie");
    const requestCookiesInfo: Record<string, unknown> = {
      hasCookieHeader: !!cookieHeader,
      cookieHeaderLength: cookieHeader?.length || 0,
    };

    if (cookieHeader) {
      const cookies = cookieHeader.split(";").map((c) => c.trim());
      const sessionCookie = cookies.find((c) => c.startsWith(`${COOKIE_NAME}=`));
      requestCookiesInfo.sessionCookieFound = !!sessionCookie;
      if (sessionCookie) {
        const token = sessionCookie.split("=")[1];
        requestCookiesInfo.tokenLength = token?.length || 0;
        requestCookiesInfo.tokenStartsWithEyJ = token?.startsWith("eyJ") || false;
      }
    }
    diagnostics.requestCookies = requestCookiesInfo;

    // Test 3: Try to get session from request
    const session = await getSessionFromRequest(request);
    diagnostics.sessionCheck = {
      sessionFound: !!session,
      userId: session?.user?.id || null,
      userEmail: session?.user?.email || null,
    };

    // Test 4: Test cookie setting (create a test token)
    try {
      // Get a test user profile (or create one if needed)
      const supabase = createServiceRoleClient();
      const { data: testProfile } = await supabase
        .from("user_profiles")
        .select("*")
        .limit(1)
        .single();

      if (testProfile) {
        const testToken = await createSession(testProfile);
        const testVerification = await verifySession(testToken);
        diagnostics.tokenCreation = {
          success: !!testToken,
          tokenLength: testToken?.length || 0,
          verificationSuccess: !!testVerification,
          verifiedUserId: testVerification?.user?.id || null,
        };
      } else {
        diagnostics.tokenCreation = {
          success: false,
          message: "No test user profile found",
        };
      }
    } catch (tokenError) {
      diagnostics.tokenCreation = {
        success: false,
        error: tokenError instanceof Error ? tokenError.message : "Unknown error",
      };
    }

    // Test 5: JWT_SECRET validation
    const jwtSecretSet = !!process.env.JWT_SECRET;
    const jwtSecretIsDefault =
      process.env.JWT_SECRET === "your-secret-key-change-this-in-production";
    diagnostics.jwtSecret = {
      isSet: jwtSecretSet,
      isDefault: jwtSecretIsDefault,
      isSecure: jwtSecretSet && !jwtSecretIsDefault,
    };

    return NextResponse.json(diagnostics, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Test failed",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
