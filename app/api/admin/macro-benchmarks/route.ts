/**
 * Admin Macro Benchmarks API Route
 * CRUD operations for macro benchmarks (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type MacroCategory = "investment" | "tax" | "financing";
export type MacroMetric =
  | "asx_total_return"
  | "term_deposit_rate"
  | "bond_rate"
  | "savings_rate"
  | "cgt_withholding"
  | "default_marginal_tax_rate"
  | "default_interest_rate"
  | "inflation_rate";

export type MacroUnit = "percent" | "percentage_points" | "basis_points";

export interface MacroBenchmarkInput {
  category: MacroCategory;
  metric: MacroMetric;
  value_numeric: number;
  unit?: MacroUnit;
  data_source?: string | null;
  refresh_cadence?: string | null;
  notes?: string | null;
  is_active?: boolean;
}

// GET - List all macro benchmarks
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const supabase = createServiceRoleClient();
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") as MacroCategory | null;
    const metric = searchParams.get("metric") as MacroMetric | null;
    const activeOnly = searchParams.get("activeOnly") === "true";

    let query = supabase
      .from("macro_benchmarks")
      .select("*")
      .order("category", { ascending: true })
      .order("metric", { ascending: true });

    if (category) {
      query = query.eq("category", category);
    }

    if (metric) {
      query = query.eq("metric", metric);
    }

    if (activeOnly) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      // Check if table doesn't exist
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return NextResponse.json(
          {
            error: "Macro benchmarks table not found",
            message: "Please run database migrations: 20250118_create_macro_benchmarks.sql",
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: "Failed to fetch macro benchmarks", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      benchmarks: data || [],
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("redirect")) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 });
    }

    console.error("Admin macro benchmarks GET error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch macro benchmarks",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - Create new macro benchmark
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body: MacroBenchmarkInput = await request.json();
    const supabase = createServiceRoleClient();

    // Validate required fields
    if (!body.category || !body.metric || body.value_numeric === undefined) {
      return NextResponse.json(
        { error: "Category, metric, and value_numeric are required" },
        { status: 400 }
      );
    }

    // Insert benchmark (upsert to handle duplicates)
    const { data, error } = await supabase
      .from("macro_benchmarks")
      .upsert(
        {
          category: body.category,
          metric: body.metric,
          value_numeric: body.value_numeric,
          unit: body.unit || "percent",
          data_source: body.data_source || null,
          refresh_cadence: body.refresh_cadence || null,
          notes: body.notes || null,
          is_active: body.is_active !== undefined ? body.is_active : true,
          last_updated: new Date().toISOString().split("T")[0],
        } as never,
        {
          onConflict: "metric",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create macro benchmark", details: error.message },
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

    console.error("Admin macro benchmarks POST error:", error);
    return NextResponse.json(
      {
        error: "Failed to create macro benchmark",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
