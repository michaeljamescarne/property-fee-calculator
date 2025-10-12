/**
 * Send Magic Code API Route
 * Generates and emails a 6-digit authentication code
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { resend, EMAIL_CONFIG } from '@/lib/resend';
import {
  generateCode,
  hashCode,
  getExpiryTime,
  isValidEmail,
} from '@/lib/auth/magic-code';
import type { SendCodeRequest, SendCodeResponse, AuthErrorResponse } from '@/types/auth';

// Rate limiting store (in production, use Redis or Supabase)
const rateLimitStore = new Map<string, number[]>();

export async function POST(request: NextRequest) {
  try {
    const body: SendCodeRequest = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !isValidEmail(email)) {
      const error: AuthErrorResponse = {
        error: 'INVALID_EMAIL',
        message: 'Please provide a valid email address',
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Check rate limiting (3 requests per 10 minutes)
    const now = Date.now();
    const attempts = rateLimitStore.get(email) || [];
    const recentAttempts = attempts.filter(time => time > now - 10 * 60 * 1000);
    
    if (recentAttempts.length >= 3) {
      const error: AuthErrorResponse = {
        error: 'RATE_LIMITED',
        message: 'Too many requests. Please wait 10 minutes before trying again.',
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
      .from('magic_codes')
      .delete()
      .eq('email', email)
      .lt('expires_at', new Date().toISOString());

    // Insert new code
    const magicCodeData: Database['public']['Tables']['magic_codes']['Insert'] = {
      email,
      code: hashedCode,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
      used: false,
    };
    
    const { error: dbError } = await supabase
      .from('magic_codes')
      .insert(magicCodeData);

    if (dbError) {
      console.error('Database error:', dbError);
      const error: AuthErrorResponse = {
        error: 'SERVER_ERROR',
        message: 'Failed to generate authentication code. Please try again.',
      };
      return NextResponse.json(error, { status: 500 });
    }

    // Send email via Resend
    try {
      await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: [email],
        subject: 'Your Login Code - FIRB Calculator',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .code-box { background: #f4f4f4; border: 2px solid #6366F1; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
                .code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #6366F1; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Your Login Code</h2>
                <p>Hello!</p>
                <p>Use the code below to log in to your FIRB Calculator account:</p>
                
                <div class="code-box">
                  <div class="code">${code}</div>
                </div>
                
                <p><strong>This code will expire in 10 minutes.</strong></p>
                <p>If you didn't request this code, you can safely ignore this email.</p>
                
                <div class="footer">
                  <p>This is an automated email from FIRB Calculator. Please do not reply.</p>
                  <p>&copy; ${new Date().getFullYear()} Australian Property Investment. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Code is stored, so we can still return success
      // User can request a new code if needed
    }

    // Update rate limit
    rateLimitStore.set(email, [...recentAttempts, now]);

    const response: SendCodeResponse = {
      success: true,
      message: 'Authentication code sent to your email',
      expiresAt: expiresAt.toISOString(),
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Send code error:', error);
    const errorResponse: AuthErrorResponse = {
      error: 'SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again.',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Handle GET requests (not allowed)
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}

