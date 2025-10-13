/**
 * Send FIRB Results API Route
 * Sends calculation results via email using Resend
 */

import { NextRequest, NextResponse } from 'next/server';
import { resend, EMAIL_CONFIG } from '@/lib/resend';
import FIRBResultsEmail from '@/emails/FIRBResultsEmail';
import { EligibilityResult } from '@/lib/firb/eligibility';
import { CostBreakdown } from '@/lib/firb/calculations';
import type { FIRBCalculatorFormData } from '@/lib/validations/firb';
import type { InvestmentAnalytics, InvestmentInputs } from '@/types/investment';
import type { PDFTranslations } from '@/lib/pdf/pdfTranslations';
import { generateEnhancedPDF } from '@/lib/pdf/generateEnhancedPDF';
import { generateDefaultInputs, calculateInvestmentAnalytics } from '@/lib/firb/investment-analytics';
import { blobToBase64 } from '@/lib/pdf/pdfHelpers';

interface EmailRequest {
  email: string;
  name?: string;
  eligibility: EligibilityResult;
  costs: CostBreakdown;
  formData: FIRBCalculatorFormData;
  locale: string;
  pdfTranslations: PDFTranslations;
}

export async function POST(request: NextRequest) {
  try {
    console.log('Email API: Starting request processing');
    const body: EmailRequest = await request.json();
    console.log('Email API: Request body parsed successfully');
    console.log('Email API: Body keys:', Object.keys(body));
    const { email, name, eligibility, costs, formData, locale, pdfTranslations } = body;
    console.log('Email API: Destructured variables successfully');

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate required data
    if (!eligibility || !costs || !formData) {
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

    // Generate full investment analytics (always include in emailed PDFs per user request)
    console.log('Email API: Generating investment inputs');
    console.log('Email API: costs object:', JSON.stringify(costs, null, 2));
    
    let investmentInputs: InvestmentInputs;
    let analytics: InvestmentAnalytics;
    
    try {
      investmentInputs = generateDefaultInputs(
        formData.propertyValue!,
        formData.state!,
        formData.propertyType!,
        formData.depositPercent || 20,
        costs
      );
      console.log('Email API: Investment inputs generated successfully');
      console.log('Email API: Calculating investment analytics');
      analytics = calculateInvestmentAnalytics(
        investmentInputs,
        formData.propertyValue!,
        formData.state!,
        formData.propertyType!,
        costs
      );
      console.log('Email API: Investment analytics calculated successfully');
    } catch (analyticsError) {
      console.error('Email API: Analytics generation failed:', analyticsError);
      // Continue without analytics for now to isolate the issue
      analytics = {} as InvestmentAnalytics;
    }

    // Generate PDF with full analytics
    let pdfBase64: string | undefined;
    try {
      console.log('Email API: Generating PDF');
      const pdfBlob = generateEnhancedPDF(
        formData,
        eligibility,
        costs,
        analytics,
        locale || 'en',
        pdfTranslations
      );
      console.log('Email API: PDF generated successfully');

      // Convert PDF blob to base64 for attachment
      console.log('Email API: Converting PDF to base64');
      pdfBase64 = await blobToBase64(pdfBlob);
      console.log('Email API: PDF converted to base64 successfully');
    } catch (pdfError) {
      console.error('Email API: PDF generation failed:', pdfError);
      // Continue without PDF attachment
      pdfBase64 = undefined;
    }

    // Send email with PDF attachment (if available)
    console.log('Email API: Sending email with attachment');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emailOptions: any = {
      from: EMAIL_CONFIG.from,
      to: [email],
      subject: `Your FIRB Investment Analysis - ${eligibility.canPurchase ? 'Eligible' : 'Review Required'}`,
      react: FIRBResultsEmail({ name, eligibility, costs }),
    };

    // Add PDF attachment if generation was successful
    if (pdfBase64) {
      console.log('Email API: Adding PDF attachment to email');
      emailOptions.attachments = [
        {
          filename: `FIRB-Investment-Analysis-${new Date().toISOString().split('T')[0]}.pdf`,
          content: pdfBase64,
        },
      ];
    } else {
      console.log('Email API: No PDF attachment (generation failed)');
    }

    const { data, error } = await resend.emails.send(emailOptions);

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
    console.error('Email API error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
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


