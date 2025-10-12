/**
 * Send FIRB Results API Route
 * Sends calculation results via email using Resend
 */

import { NextRequest, NextResponse } from 'next/server';
import { resend, EMAIL_CONFIG } from '@/lib/resend';
import FIRBResultsEmail from '@/emails/FIRBResultsEmail';
import { EligibilityResult } from '@/lib/firb/eligibility';
import { CostBreakdown } from '@/lib/firb/calculations';

interface EmailRequest {
  email: string;
  name?: string;
  eligibility: EligibilityResult;
  costs: CostBreakdown;
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json();
    const { email, name, eligibility, costs } = body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate required data
    if (!eligibility || !costs) {
      return NextResponse.json(
        { error: 'Missing calculation data' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured. Please set RESEND_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    // Send email
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [email],
      subject: `Your FIRB Investment Analysis - ${eligibility.canPurchase ? 'Eligible' : 'Review Required'}`,
      react: FIRBResultsEmail({ name, eligibility, costs }),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (not allowed)
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}


