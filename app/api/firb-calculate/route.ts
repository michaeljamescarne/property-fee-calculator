/**
 * FIRB Calculate API Route
 * Server-side endpoint for eligibility and cost calculations
 */

import { NextRequest, NextResponse } from "next/server";
import { firbCalculatorSchema } from "@/lib/validations/firb";
import { performFullEligibilityCheck } from "@/lib/firb/eligibility";
import { calculateCompleteCostBreakdown, CalculationInput } from "@/lib/firb/calculations";

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
