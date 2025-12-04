/**
 * Admin Cost Benchmarks API Route (Single)
 * Update and delete operations for individual cost benchmarks
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { CostBenchmarkInput } from "../route";

// PUT - Update cost benchmark
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body: Partial<CostBenchmarkInput> = await request.json();
    const supabase = createServiceRoleClient();

    // Build update object (only include provided fields)
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.state !== undefined) updateData.state = body.state;
    if (body.property_type !== undefined) updateData.property_type = body.property_type;
    if (body.property_classification !== undefined) updateData.property_classification = body.property_classification ?? null;
    if (body.bedrooms !== undefined) updateData.bedrooms = body.bedrooms ?? null;
    if (body.metric !== undefined) updateData.metric = body.metric;
    if (body.value_numeric !== undefined) updateData.value_numeric = body.value_numeric;
    if (body.unit !== undefined) updateData.unit = body.unit;
    if (body.data_source !== undefined) updateData.data_source = body.data_source || null;
    if (body.notes !== undefined) updateData.notes = body.notes || null;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;
    if (body.data_source || body.value_numeric !== undefined) {
      updateData.last_updated = new Date().toISOString().split("T")[0];
    }

    const { data, error } = await supabase
      .from("cost_benchmarks")
      .update(updateData as never)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);

      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Cost benchmark not found" }, { status: 404 });
      }

      return NextResponse.json(
        { error: "Failed to update cost benchmark", details: error.message },
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

    console.error("Admin cost benchmarks PUT error:", error);
    return NextResponse.json(
      {
        error: "Failed to update cost benchmark",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete cost benchmark
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const supabase = createServiceRoleClient();

    const { error } = await supabase.from("cost_benchmarks").delete().eq("id", id);

    if (error) {
      console.error("Database error:", error);

      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Cost benchmark not found" }, { status: 404 });
      }

      return NextResponse.json(
        { error: "Failed to delete cost benchmark", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cost benchmark deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 });
    }

    console.error("Admin cost benchmarks DELETE error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete cost benchmark",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
