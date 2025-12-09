/**
 * Admin Macro Benchmarks API Route (Single)
 * Update and delete operations for individual macro benchmarks
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { MacroBenchmarkInput } from "../route";

// PUT - Update macro benchmark
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body: Partial<MacroBenchmarkInput> = await request.json();
    const supabase = createServiceRoleClient();

    // Build update object (only include provided fields)
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.category !== undefined) updateData.category = body.category;
    if (body.metric !== undefined) updateData.metric = body.metric;
    if (body.value_numeric !== undefined) updateData.value_numeric = body.value_numeric;
    if (body.unit !== undefined) updateData.unit = body.unit;
    if (body.data_source !== undefined) updateData.data_source = body.data_source || null;
    if (body.refresh_cadence !== undefined)
      updateData.refresh_cadence = body.refresh_cadence || null;
    if (body.notes !== undefined) updateData.notes = body.notes || null;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;
    if (body.data_source || body.value_numeric !== undefined) {
      updateData.last_updated = new Date().toISOString().split("T")[0];
    }

    const { data, error } = await supabase
      .from("macro_benchmarks")
      .update(updateData as never)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);

      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Macro benchmark not found" }, { status: 404 });
      }

      return NextResponse.json(
        { error: "Failed to update macro benchmark", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      benchmark: data,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 });
    }

    console.error("Admin macro benchmarks PUT error:", error);
    return NextResponse.json(
      {
        error: "Failed to update macro benchmark",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete macro benchmark
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const supabase = createServiceRoleClient();

    const { error } = await supabase.from("macro_benchmarks").delete().eq("id", id);

    if (error) {
      console.error("Database error:", error);

      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Macro benchmark not found" }, { status: 404 });
      }

      return NextResponse.json(
        { error: "Failed to delete macro benchmark", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Macro benchmark deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 });
    }

    console.error("Admin macro benchmarks DELETE error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete macro benchmark",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}



