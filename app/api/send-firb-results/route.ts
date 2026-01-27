/**
 * Send FIRB Results API Route
 * Sends calculation results via email using Resend
 */

import { NextRequest, NextResponse } from "next/server";
import { resend, EMAIL_CONFIG } from "@/lib/resend";
import FIRBResultsEmail from "@/emails/FIRBResultsEmail";
import { EligibilityResult } from "@/lib/firb/eligibility";
import { CostBreakdown } from "@/lib/firb/calculations";
import type { FIRBCalculatorFormData } from "@/lib/validations/firb";
import type { InvestmentAnalytics, InvestmentInputs } from "@/types/investment";
import {
  generateDefaultInputs,
  calculateInvestmentAnalytics,
} from "@/lib/firb/investment-analytics";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getCostBenchmarks } from "@/lib/benchmarks/cost-benchmarks";
import { getMacroBenchmarks } from "@/lib/benchmarks/macro-benchmarks";
import type { FIRBCalculationInsert } from "@/types/database";
import { createHash } from "crypto";
import { generateEnhancedPDF } from "@/lib/pdf/generateEnhancedPDF";
import { generateFIRBPDF } from "@/lib/pdf/generateFIRBPDF";
import { getPDFTranslations } from "@/lib/pdf/pdfTranslations";
import { getSessionFromRequest } from "@/lib/auth/session-helpers";

interface EmailRequest {
  email: string;
  name?: string;
  eligibility: EligibilityResult;
  costs: CostBreakdown;
  formData: FIRBCalculatorFormData;
  locale: string;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication (PDFs require auth)
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required to email PDF reports." },
        { status: 401 }
      );
    }

    console.log("Email API: Starting request processing");
    const body: EmailRequest = await request.json();
    console.log("Email API: Request body parsed successfully");
    console.log("Email API: Body keys:", Object.keys(body));
    const { email, name, eligibility, costs, formData, locale } = body;
    console.log("Email API: Destructured variables successfully");

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Validate required data
    if (!eligibility || !costs || !formData) {
      return NextResponse.json({ error: "Missing calculation data" }, { status: 400 });
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        {
          error: "Email service is not configured. Please set RESEND_API_KEY environment variable.",
        },
        { status: 500 }
      );
    }

    // Generate full investment analytics for email
    console.log("Email API: Generating investment inputs");
    console.log("Email API: costs object:", JSON.stringify(costs, null, 2));

    // Fetch cost and macro benchmarks (only if database is configured)
    let costBenchmarks: Partial<Record<string, number>> = {};
    let macroBenchmarks: Partial<Record<string, number>> = {};

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createServiceRoleClient();
        costBenchmarks = await getCostBenchmarks(
          formData.state!,
          formData.propertyType!,
          [
            "council_rate_percent",
            "insurance_percent",
            "maintenance_percent",
            "vacancy_rate_percent",
            "management_fee_percent",
            "letting_fee_weeks",
            "rent_growth_percent",
            "interest_rate_percent",
            "selling_costs_percent",
          ],
          supabase
        );

        macroBenchmarks = await getMacroBenchmarks(
          [
            "asx_total_return",
            "term_deposit_rate",
            "bond_rate",
            "savings_rate",
            "cgt_withholding",
            "default_marginal_tax_rate",
            "default_interest_rate",
          ],
          supabase
        );
      } catch (benchmarkError) {
        console.warn("Email API: Failed to fetch benchmarks, using defaults:", benchmarkError);
        // Continue with empty benchmarks - will use defaults
      }
    }

    let investmentInputs: InvestmentInputs;
    let analytics: InvestmentAnalytics;

    try {
      investmentInputs = generateDefaultInputs(
        formData.propertyValue!,
        formData.state!,
        formData.propertyType!,
        formData.depositPercent || 20,
        costs,
        null, // benchmarkData (market benchmarks)
        costBenchmarks,
        macroBenchmarks
      );
      console.log("Email API: Investment inputs generated successfully");
      console.log("Email API: Calculating investment analytics");
      analytics = calculateInvestmentAnalytics(
        investmentInputs,
        formData.propertyValue!,
        formData.state!,
        formData.propertyType!,
        costs,
        macroBenchmarks
      );
      console.log("Email API: Investment analytics calculated successfully");
    } catch (analyticsError) {
      console.error("Email API: Analytics generation failed:", analyticsError);
      // Continue without analytics - email will show basic info
      analytics = {} as InvestmentAnalytics;
    }

    // Generate shareable URL
    let shareUrl: string;
    try {
      console.log("Email API: Generating shareable URL");

      // Check if database is configured
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const supabase = createServiceRoleClient();
          const calculationData = {
            citizenship_status: formData.citizenshipStatus!,
            visa_type: formData.visaType || null,
            is_ordinarily_resident: formData.isOrdinarilyResident ?? null,
            property_type: formData.propertyType!,
            property_value: formData.propertyValue!,
            property_state: formData.state!,
            property_address: formData.propertyAddress || null,
            is_first_home: formData.isFirstHome || false,
            deposit_percent: formData.depositPercent || null,
            entity_type: formData.entityType || "individual",
            property_classification: formData.propertyClassification || null,
            bedrooms: formData.bedrooms ?? null,
            eligibility_result: eligibility as any,
            cost_breakdown: costs as any,
            user_email: email,
            locale: locale || "en",
            // share_url_slug will be auto-generated by the database
          } as FIRBCalculationInsert;

          const { data: savedCalculation, error: saveError } = await supabase
            .from("firb_calculations")
            .insert(calculationData as never)
            .select("share_url_slug")
            .single();

          if (!saveError && savedCalculation && "share_url_slug" in savedCalculation) {
            const slug = (savedCalculation as { share_url_slug: string }).share_url_slug;
            shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://propertycosts.com.au"}/${locale || "en"}/results/${slug}`;
            console.log("Email API: Shareable URL generated from database:", shareUrl);
          } else {
            throw new Error("Failed to save to database");
          }
        } catch (dbError) {
          console.warn("Email API: Database save failed, using hash-based URL:", dbError);
          // Fallback to hash-based URL
          const hash = createHash("md5")
            .update(JSON.stringify({ formData, eligibility, costs }))
            .digest("hex")
            .substring(0, 8);
          shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://propertycosts.com.au"}/${locale || "en"}/results/${hash}`;
        }
      } else {
        // No database configured - use hash-based URL
        const hash = createHash("md5")
          .update(JSON.stringify({ formData, eligibility, costs }))
          .digest("hex")
          .substring(0, 8);
        shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://propertycosts.com.au"}/${locale || "en"}/results/${hash}`;
        console.log("Email API: Using hash-based shareable URL:", shareUrl);
      }
    } catch (urlError) {
      console.error("Email API: Shareable URL generation failed:", urlError);
      // Fallback to a basic URL
      shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://propertycosts.com.au"}/calculator`;
    }

    // 2. Generate PDF attachment
    let pdfAttachment: { filename: string; content: Buffer } | null = null;

    try {
      console.log("Email API: Generating PDF attachment");
      const translations = getPDFTranslations(locale || "en");

      // Generate PDF - charts will be null in email context (client-side only)
      const pdfBlob = analytics && Object.keys(analytics).length > 0
        ? await generateEnhancedPDF(
            formData,
            eligibility,
            costs,
            analytics,
            locale || "en",
            translations,
            "premium",
            null // Charts not available in email context (generated client-side)
          )
        : generateFIRBPDF(formData, eligibility, costs);

      // Convert blob to buffer for email attachment
      const pdfArrayBuffer = await pdfBlob.arrayBuffer();
      const pdfBuffer = Buffer.from(pdfArrayBuffer);

      pdfAttachment = {
        filename: `FIRB-Investment-Analysis-${Date.now()}.pdf`,
        content: pdfBuffer,
      };
      console.log("Email API: PDF attachment generated successfully");
    } catch (pdfError) {
      console.warn(
        "Email API: Failed to generate PDF for email, sending email without attachment:",
        pdfError
      );
      // Continue without PDF - email still sends with shareable link
    }

    // 3. Send email with PDF attachment
    console.log("Email API: Sending email");
    const emailOptions = {
      from: EMAIL_CONFIG.from,
      to: [email],
      subject: `Your FIRB Investment Analysis - ${eligibility.canPurchase ? "Eligible" : "Review Required"}`,
      react: FIRBResultsEmail({
        name,
        eligibility,
        costs,
        formData,
        analytics,
        shareUrl,
      }),
      attachments: pdfAttachment ? [pdfAttachment] : undefined,
    };

    const { data, error } = await resend.emails.send(emailOptions);

    if (error) {
      console.error("Resend error:", error);

      // Provide more specific error messages for Resend validation errors
      let errorMessage = "Failed to send email";

      const errorDetails = error as {
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

      return NextResponse.json({ error: errorMessage, details: error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    console.error(
      "Email API error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    return NextResponse.json(
      {
        error: "Failed to send email",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (not allowed)
export async function GET() {
  return NextResponse.json({ error: "Method not allowed. Use POST." }, { status: 405 });
}
