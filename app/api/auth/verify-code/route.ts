/**
 * Verify Magic Code API Route
 * Verifies the 6-digit code and creates a session
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
// Removed unused import
import {
  verifyCode,
  isExpired,
  isValidEmail,
  isValidCodeFormat,
} from '@/lib/auth/magic-code';
import { createSession, setSessionCookie } from '@/lib/auth/session';
import type { MagicCode, UserProfile } from '@/types/database';
import type { VerifyCodeRequest, VerifyCodeResponse, AuthErrorResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: VerifyCodeRequest = await request.json();
    const { email, code } = body;

    // Validate inputs
    if (!email || !isValidEmail(email)) {
      const error: AuthErrorResponse = {
        error: 'INVALID_EMAIL',
        message: 'Please provide a valid email address',
      };
      return NextResponse.json(error, { status: 400 });
    }

    if (!code || !isValidCodeFormat(code)) {
      const error: AuthErrorResponse = {
        error: 'CODE_INVALID',
        message: 'Please provide a valid 6-digit code',
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Get code from database
    const supabase = createServiceRoleClient();
    
    const { data: magicCodes, error: fetchError } = await supabase
      .from('magic_codes')
      .select('*')
      .eq('email', email)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError || !magicCodes || magicCodes.length === 0) {
      const error: AuthErrorResponse = {
        error: 'CODE_INVALID',
        message: 'Invalid or expired code',
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Type assertion for Supabase response
    const magicCode = magicCodes[0] as MagicCode;

    // Check if expired
    if (isExpired(magicCode.expires_at)) {
      const error: AuthErrorResponse = {
        error: 'CODE_EXPIRED',
        message: 'This code has expired. Please request a new one.',
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Check max attempts
    if (magicCode.attempts >= 3) {
      const error: AuthErrorResponse = {
        error: 'MAX_ATTEMPTS',
        message: 'Too many failed attempts. Please request a new code.',
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Verify code
    const isValid = verifyCode(code, magicCode.code);

    if (!isValid) {
      // Increment attempts
      await supabase
        .from('magic_codes')
        .update({ attempts: magicCode.attempts + 1 } as never)
        .eq('id', magicCode.id);

      const error: AuthErrorResponse = {
        error: 'CODE_INVALID',
        message: `Invalid code. ${2 - magicCode.attempts} attempts remaining.`,
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Mark code as used
    await supabase
      .from('magic_codes')
      .update({ used: true } as never)
      .eq('id', magicCode.id);

    // Check if user profile already exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single();

    let userId: string;

    if (existingProfile) {
      // User profile exists, update last login
      const profile = existingProfile as UserProfile;
      userId = profile.id;
      await supabase
        .from('user_profiles')
        .update({ last_login_at: new Date().toISOString() } as never)
        .eq('id', userId);
    } else {
      // Create new user profile directly (bypass Supabase Auth for now)
      const { data: newProfile, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          email,
          subscription_status: 'free',
          calculations_count: 0,
        } as never)
        .select()
        .single();

      if (profileError || !newProfile) {
        console.error('Profile creation error:', profileError);
        const error: AuthErrorResponse = {
          error: 'SERVER_ERROR',
          message: 'Failed to create user account. Please try again.',
        };
        return NextResponse.json(error, { status: 500 });
      }

      userId = newProfile.id;
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) {
      const error: AuthErrorResponse = {
        error: 'SERVER_ERROR',
        message: 'Failed to fetch user profile.',
      };
      return NextResponse.json(error, { status: 500 });
    }

    // Create session
    const token = await createSession(profile);
    await setSessionCookie(token);

    const response: VerifyCodeResponse = {
      success: true,
      message: 'Successfully authenticated',
      user: profile,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Verify code error:', error);
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

