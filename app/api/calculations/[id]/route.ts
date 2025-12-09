/**
 * Individual Calculation API Route
 * Get, update, or delete a specific calculation
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session-helpers";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { prepareCalculationForStorage } from "@/lib/calculations/storage";
import type { CalculationData } from "@/types/database";

// GET: Fetch a specific calculation
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("saved_calculations")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Calculation not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      calculation: data,
    });
  } catch (error) {
    console.error("Get calculation error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

// PUT: Update full calculation data
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { calculationData, name } = body;

    // Validate calculation data
    if (!calculationData || !calculationData.eligibility || !calculationData.costs) {
      return NextResponse.json(
        {
          error: "Invalid calculation data",
          details: "Missing required fields: eligibility or costs",
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (
      !calculationData.propertyValue ||
      !calculationData.propertyType ||
      !calculationData.propertyState
    ) {
      return NextResponse.json(
        {
          error: "Invalid calculation data",
          details: "Missing required property fields",
        },
        { status: 400 }
      );
    }

    // Verify the calculation belongs to the user
    const supabase = createServiceRoleClient();
    const { data: existingCalc, error: checkError } = await supabase
      .from("saved_calculations")
      .select("id, user_id")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single();

    if (checkError || !existingCalc) {
      return NextResponse.json({ error: "Calculation not found" }, { status: 404 });
    }

    // Prepare data for storage
    let dataToUpdate;
    try {
      dataToUpdate = prepareCalculationForStorage(calculationData, session.user.id, name);
      // Remove fields that shouldn't be updated
      delete (dataToUpdate as any).user_id;
    } catch (prepError) {
      console.error("Error preparing calculation for storage:", prepError);
      return NextResponse.json(
        {
          error: "Failed to prepare calculation data",
          details: prepError instanceof Error ? prepError.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    // Update the calculation
    const { data, error } = await supabase
      .from("saved_calculations")
      .update(dataToUpdate as never)
      .eq("id", id)
      .eq("user_id", session.user.id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json(
        {
          error: "Failed to update calculation",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      calculation: data,
    });
  } catch (error) {
    console.error("Update calculation error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

// PATCH: Update a calculation (partial updates for name/favorite)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    // Allow updating specific fields
    if (body.calculation_name !== undefined) updates.calculation_name = body.calculation_name;
    if (body.is_favorite !== undefined) updates.is_favorite = body.is_favorite;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("saved_calculations")
      .update(updates as never)
      .eq("id", id)
      .eq("user_id", session.user.id)
      .select()
      .single();

    if (error || !data) {
      console.error("Update error:", error);
      return NextResponse.json({ error: "Failed to update calculation" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      calculation: data,
    });
  } catch (error) {
    console.error("Update calculation error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}

// DELETE: Delete a calculation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("saved_calculations")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json({ error: "Failed to delete calculation" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Calculation deleted successfully",
    });
  } catch (error) {
    console.error("Delete calculation error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
