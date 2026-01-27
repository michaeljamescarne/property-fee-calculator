/**
 * PDF Generation API Route
 * Requires authentication
 * Generates PDF with embedded chart images
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session-helpers";
import { generateEnhancedPDF } from "@/lib/pdf/generateEnhancedPDF";
import { generateFIRBPDF } from "@/lib/pdf/generateFIRBPDF";
import type { FIRBCalculatorFormData } from "@/lib/validations/firb";
import type { EligibilityResult } from "@/lib/firb/eligibility";
import type { CostBreakdown } from "@/lib/firb/calculations";
import type { InvestmentAnalytics } from "@/types/investment";
import { getPDFTranslations } from "@/lib/pdf/pdfTranslations";

interface PDFGenerateRequest {
  formData: Partial<FIRBCalculatorFormData>;
  eligibility: EligibilityResult;
  costs: CostBreakdown;
  analytics?: InvestmentAnalytics;
  chartImages?: {
    projectionChart: string | null;
    cashFlowChart: string | null;
    roiComparisonChart: string | null;
  };
  locale: string;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to download PDFs." },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body: PDFGenerateRequest = await request.json();
    const { formData, eligibility, costs, analytics, chartImages, locale = "en" } = body;

    // Log what we received for debugging
    console.log("📄 PDF Generation Request:", {
      hasAnalytics: !!analytics,
      hasChartImages: !!chartImages,
      chartImagesDetail: chartImages ? {
        projection: {
          exists: !!chartImages.projectionChart,
          length: chartImages.projectionChart?.length || 0,
          isValid: chartImages.projectionChart?.startsWith("data:image/") || false,
          preview: chartImages.projectionChart?.substring(0, 50) || "N/A",
        },
        cashFlow: {
          exists: !!chartImages.cashFlowChart,
          length: chartImages.cashFlowChart?.length || 0,
          isValid: chartImages.cashFlowChart?.startsWith("data:image/") || false,
          preview: chartImages.cashFlowChart?.substring(0, 50) || "N/A",
        },
        roiComparison: {
          exists: !!chartImages.roiComparisonChart,
          length: chartImages.roiComparisonChart?.length || 0,
          isValid: chartImages.roiComparisonChart?.startsWith("data:image/") || false,
          preview: chartImages.roiComparisonChart?.substring(0, 50) || "N/A",
        },
      } : null,
      locale,
    });

    // 3. Validate required data
    if (!formData || !eligibility || !costs) {
      return NextResponse.json(
        { error: "Missing required calculation data" },
        { status: 400 }
      );
    }

    // 4. Get PDF translations
    const translations = getPDFTranslations(locale);

    // 5. Generate PDF
    let pdfBlob: Blob;
    if (analytics) {
      // Enhanced PDF with analytics (charts are optional)
      // If chart capture failed, chartImages will be null/undefined, but PDF should still generate
      pdfBlob = await generateEnhancedPDF(
        formData,
        eligibility,
        costs,
        analytics,
        locale,
        translations,
        "premium", // Content tier - can be upgraded based on user subscription
        chartImages || {
          projectionChart: null,
          cashFlowChart: null,
          roiComparisonChart: null,
        } // Pass chart images (or null if capture failed)
      );
    } else {
      // Basic PDF without analytics
      pdfBlob = generateFIRBPDF(formData, eligibility, costs);
    }

    // 6. Return PDF as response
    return new NextResponse(pdfBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="FIRB-Analysis-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
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