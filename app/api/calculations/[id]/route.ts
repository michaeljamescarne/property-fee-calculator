/**
 * Individual Calculation API Route
 * Get, update, or delete a specific calculation
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session-helpers";
import { createServiceRoleClient } from "@/lib/supabase/server";

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

// PATCH: Update a calculation
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
