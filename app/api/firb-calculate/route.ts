/**
 * FIRB Calculate API Route
 * Server-side endpoint for eligibility and cost calculations
 */

import { NextRequest, NextResponse } from "next/server";
import { firbCalculatorSchema } from "@/lib/validations/firb";
import { performFullEligibilityCheck } from "@/lib/firb/eligibility";
import { calculateCompleteCostBreakdown, CalculationInput } from "@/lib/firb/calculations";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getCostBenchmarks } from "@/lib/benchmarks/cost-benchmarks";
import { getMacroBenchmarks } from "@/lib/benchmarks/macro-benchmarks";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = firbCalculatorSchema.safeParse(body);

    if (!validation.success) {
      console.error("Validation failed:", validation.error.issues);
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          message: "Please check all required fields are filled correctly",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // For existing properties, assume FIRB approval but still perform eligibility check for display
    // For purchasing, perform full eligibility check
    let eligibility;
    if (data.purchaseType === "existing") {
      // Existing properties: assume FIRB was handled at purchase time, but still show eligibility info
      eligibility = {
        isEligible: true,
        requiresFIRB: false,
        firbApprovalType: "exempt" as const,
        canPurchase: true,
        restrictions: [],
        recommendations: [
          "This is an existing property, FIRB approval is assumed to have been obtained or not required at the time of purchase.",
        ],
        allowedPropertyTypes: [data.propertyType],
      };
    } else {
      // Perform eligibility check for new purchases
      if (!data.citizenshipStatus) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            message: "Citizenship status is required",
            details: [
              {
                path: ["citizenshipStatus"],
                message: "Citizenship status is required for new purchases",
              },
            ],
          },
          { status: 400 }
        );
      }
      eligibility = performFullEligibilityCheck(
        data.citizenshipStatus,
        data.propertyType,
        data.propertyValue,
        data.visaType,
        data.isOrdinarilyResident
      );
    }

    // Calculate costs
    // Fetch cost and macro benchmarks
    const supabase = createServiceRoleClient();
    const costBenchmarks = await getCostBenchmarks(
      data.state,
      data.propertyType,
      [
        "council_rate_percent",
        "insurance_percent",
        "maintenance_percent",
        "vacancy_rate_percent",
        "loan_cost_basis_points",
      ],
      supabase
    );

    const macroBenchmarks = await getMacroBenchmarks(
      ["default_interest_rate", "cgt_withholding", "default_marginal_tax_rate"],
      supabase
    );

    const calculationInput: CalculationInput = {
      citizenshipStatus:
        data.purchaseType === "existing"
          ? "australian" // Default for existing properties (not used for eligibility)
          : data.citizenshipStatus || "australian", // Required for new purchases
      propertyType: data.propertyType,
      propertyValue: data.propertyValue,
      state: data.state,
      isFirstHome: data.isFirstHome || false,
      depositPercent: data.depositPercent || 20,
      entityType: data.entityType || "individual",
      isOrdinarilyResident: data.isOrdinarilyResident ?? true,
      expeditedFIRB: data.expeditedFIRB || false,
      costBenchmarks,
      macroBenchmarks,
    };

    const costs = calculateCompleteCostBreakdown(calculationInput);

    return NextResponse.json({
      success: true,
      eligibility,
      costs,
    });
  } catch (error) {
    console.error("FIRB calculation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Calculation failed",
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
