/**
 * Convert Calculation to Property API Route
 * Convert a saved calculation to a property record
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session-helpers";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { convertCalculationToProperty, isCalculationConverted } from "@/lib/properties/conversion";
import { createProperty } from "@/lib/properties/storage";
import type { SavedCalculation } from "@/types/database";

// POST: Convert a calculation to a property
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: calculationId } = await params;
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the calculation
    const supabase = createServiceRoleClient();
    const { data: calculation, error: calcError } = await supabase
      .from("saved_calculations")
      .select("*")
      .eq("id", calculationId)
      .eq("user_id", session.user.id)
      .single();

    if (calcError || !calculation) {
      return NextResponse.json({ error: "Calculation not found" }, { status: 404 });
    }

    // Check if already converted
    const alreadyConverted = await isCalculationConverted(calculationId, session.user.id);
    if (alreadyConverted) {
      return NextResponse.json(
        {
          success: false,
          error: "Calculation has already been converted to a property",
        },
        { status: 400 }
      );
    }

    // Get property name from request body if provided
    const body = await request.json().catch(() => ({}));
    const propertyName = body.propertyName || undefined;

    // Convert calculation to property
    const propertyData = convertCalculationToProperty(
      calculation as SavedCalculation,
      session.user.id,
      propertyName
    );

    // Create the property
    const property = await createProperty(propertyData);

    return NextResponse.json({
      success: true,
      property,
    });
  } catch (error) {
    console.error("Convert calculation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to convert calculation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


