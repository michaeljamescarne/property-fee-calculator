/**
 * Property Value History API Route
 * List and create value history entries for a property
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session-helpers";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getProperty } from "@/lib/properties/storage";
import { propertyValueHistoryCreateSchema } from "@/lib/validations/properties";
import type { PropertyValueHistory } from "@/types/database";

// GET: List value history for a property
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: propertyId } = await params;
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify property belongs to user
    const property = await getProperty(propertyId, session.user.id);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("property_value_history")
      .select("*")
      .eq("property_id", propertyId)
      .order("valuation_date", { ascending: false });

    if (error) {
      console.error("Error fetching value history:", error);
      return NextResponse.json({ error: "Failed to fetch value history" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      values: (data || []) as PropertyValueHistory[],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error("List value history error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST: Create a new value history entry
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: propertyId } = await params;
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify property belongs to user
    const property = await getProperty(propertyId, session.user.id);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const body = await request.json();

    // Validate request body
    const validation = propertyValueHistoryCreateSchema.safeParse({
      ...body,
      property_id: propertyId,
    });

    if (!validation.success) {
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

    const valueData = validation.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { property_id, ...insertData } = valueData;

    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("property_value_history")
      .insert(insertData as any)
      .select()
      .single();

    if (error) {
      console.error("Error creating value history:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create value history",
          message: error.message,
        },
        { status: 500 }
      );
    }

    // Optionally update the property's current_value
    // Note: This will be properly typed when PropertyUpdate is used in Phase 2
    if (body.updateCurrentValue) {
      const { error: updateError } = await supabase
        .from("properties")
        .update({ current_value: valueData.value } as any)
        .eq("id", propertyId)
        .eq("user_id", session.user.id);

      if (updateError) {
        console.error("Error updating property current_value:", updateError);
      }
    }

    return NextResponse.json({
      success: true,
      value: data as PropertyValueHistory,
    });
  } catch (error) {
    console.error("Create value history error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create value history",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
