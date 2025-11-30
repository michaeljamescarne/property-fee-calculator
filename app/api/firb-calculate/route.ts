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
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Perform eligibility check
    const eligibility = performFullEligibilityCheck(
      data.citizenshipStatus,
      data.propertyType,
      data.propertyValue,
      data.visaType,
      data.isOrdinarilyResident
    );

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
      citizenshipStatus: data.citizenshipStatus,
      propertyType: data.propertyType,
      propertyValue: data.propertyValue,
      state: data.state,
      isFirstHome: data.isFirstHome || false,
      depositPercent: data.depositPercent || 20,
      entityType: data.entityType || "individual",
      isOrdinarilyResident: data.isOrdinarilyResident,
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
