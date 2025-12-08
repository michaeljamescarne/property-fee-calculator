/**
 * Send Magic Code API Route
 * Generates and emails a 6-digit authentication code
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { resend, EMAIL_CONFIG } from "@/lib/resend";
import { generateCode, hashCode, getExpiryTime, isValidEmail } from "@/lib/auth/magic-code";
import MagicCodeEmail from "@/emails/MagicCodeEmail";
import type { SendCodeRequest, SendCodeResponse, AuthErrorResponse } from "@/types/auth";
import type { Database } from "@/types/database";

// Rate limiting store (in production, use Redis or Supabase)
const rateLimitStore = new Map<string, number[]>();

export async function POST(request: NextRequest) {
  try {
    const body: SendCodeRequest = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !isValidEmail(email)) {
      const error: AuthErrorResponse = {
        error: "INVALID_EMAIL",
        message: "Please provide a valid email address",
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Check rate limiting (3 requests per 10 minutes)
    const now = Date.now();
    const attempts = rateLimitStore.get(email) || [];
    const recentAttempts = attempts.filter((time) => time > now - 10 * 60 * 1000);

    if (recentAttempts.length >= 3) {
      const error: AuthErrorResponse = {
        error: "RATE_LIMITED",
        message: "Too many requests. Please wait 10 minutes before trying again.",
      };
      return NextResponse.json(error, { status: 429 });
    }

    // Generate code
    const code = generateCode();
    const hashedCode = hashCode(code);
    const expiresAt = getExpiryTime();

    // Store in database
    const supabase = createServiceRoleClient();

    // Clean up old codes for this email
    await supabase
      .from("magic_codes")
      .delete()
      .eq("email", email)
      .lt("expires_at", new Date().toISOString());

    // Insert new code
    type MagicCodeInsert = Database["public"]["Tables"]["magic_codes"]["Insert"];
    const magicCodeData: MagicCodeInsert = {
      email,
      code: hashedCode,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
      used: false,
    };

    const { error: dbError } = await supabase.from("magic_codes").insert(magicCodeData as never);

    if (dbError) {
      console.error("Database error:", dbError);
      const error: AuthErrorResponse = {
        error: "SERVER_ERROR",
        message: "Failed to generate authentication code. Please try again.",
      };
      return NextResponse.json(error, { status: 500 });
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "placeholder") {
      console.error("RESEND_API_KEY is not configured");
      const error: AuthErrorResponse = {
        error: "SERVER_ERROR",
        message: "Email service is not configured. Please contact support.",
      };
      return NextResponse.json(error, { status: 500 });
    }

    // Send email via Resend
    try {
      const { data, error: emailError } = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: [email],
        subject: "Your Login Code - Property Costs",
        react: MagicCodeEmail({ code }),
      });

      // Check if email was actually sent
      if (emailError) {
        console.error("Resend API error:", emailError);

        // Provide more specific error messages for common Resend errors
        let errorMessage = "Failed to send email. Please try again or contact support.";

        // Check for Resend validation errors (403 status with specific messages)
        const errorDetails = emailError as {
          statusCode?: number;
          name?: string;
          message?: string;
        };

        if (errorDetails.statusCode === 403 || errorDetails.name === "validation_error") {
          if (
            errorDetails.message?.includes("testing emails") ||
            errorDetails.message?.includes("only send testing emails")
          ) {
            errorMessage =
              "Email service is in test mode. Please verify your domain in Resend to send emails to all recipients.";
            console.error(
              "Resend domain verification required. Current from address:",
              EMAIL_CONFIG.from
            );
          } else if (
            errorDetails.message?.includes("verify a domain") ||
            errorDetails.message?.includes("change the `from` address")
          ) {
            errorMessage = "Email service requires domain verification. Please contact support.";
            console.error(
              "Resend domain verification required. Set RESEND_FROM_EMAIL environment variable with verified domain."
            );
          }
        }

        // Log full error details for debugging
        console.error("Resend error details:", {
          statusCode: errorDetails.statusCode,
          name: errorDetails.name,
          message: errorDetails.message,
          from: EMAIL_CONFIG.from,
        });

        const error: AuthErrorResponse = {
          error: "SERVER_ERROR",
          message: errorMessage,
        };
        return NextResponse.json(error, { status: 500 });
      }

      if (!data || !data.id) {
        console.error("Resend API returned no data or message ID");
        const error: AuthErrorResponse = {
          error: "SERVER_ERROR",
          message: "Failed to send email. Please try again or contact support.",
        };
        return NextResponse.json(error, { status: 500 });
      }

      console.log("Magic code email sent successfully to:", email, "Message ID:", data.id);
    } catch (emailError) {
      console.error("Email sending exception:", emailError);
      const error: AuthErrorResponse = {
        error: "SERVER_ERROR",
        message: "Failed to send email. Please try again or contact support.",
      };
      return NextResponse.json(error, { status: 500 });
    }

    // Update rate limit
    rateLimitStore.set(email, [...recentAttempts, now]);

    const response: SendCodeResponse = {
      success: true,
      message: "Authentication code sent to your email",
      expiresAt: expiresAt.toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Send code error:", error);
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
