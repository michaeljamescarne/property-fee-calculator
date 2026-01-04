/**
 * Individual Property Value History API Route
 * Delete a specific value history entry
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session-helpers";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getProperty } from "@/lib/properties/storage";

// DELETE: Delete a value history entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; valueId: string }> }
) {
  try {
    const { id: propertyId, valueId } = await params;
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify property belongs to user
    const property = await getProperty(propertyId, session.user.id);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Verify value entry belongs to property
    const supabase = createServiceRoleClient();
    const { data: valueEntry, error: fetchError } = await supabase
      .from("property_value_history")
      .select("id")
      .eq("id", valueId)
      .eq("property_id", propertyId)
      .single();

    if (fetchError || !valueEntry) {
      return NextResponse.json({ error: "Value history entry not found" }, { status: 404 });
    }

    // Delete the entry
    const { error } = await supabase
      .from("property_value_history")
      .delete()
      .eq("id", valueId)
      .eq("property_id", propertyId);

    if (error) {
      console.error("Error deleting value history:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete value history",
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Value history entry deleted successfully",
    });
  } catch (error) {
    console.error("Delete value history error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete value history",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
