/**
 * Admin Cost Benchmarks API Route
 * CRUD operations for cost benchmarks (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { AustralianState } from "@/lib/firb/constants";

export type CostMetric =
  | "council_rate_percent"
  | "insurance_percent"
  | "maintenance_percent"
  | "vacancy_rate_percent"
  | "management_fee_percent"
  | "letting_fee_weeks"
  | "rent_growth_percent"
  | "interest_rate_percent"
  | "selling_costs_percent"
  | "loan_cost_basis_points"
  | "strata_fee_percent";

export type PropertyType = "newDwelling" | "established" | "vacantLand" | "commercial";

export type CostUnit =
  | "percent"
  | "percent_of_value"
  | "weeks"
  | "currency"
  | "basis_points"
  | "percentage_points";

export interface CostBenchmarkInput {
  state: AustralianState;
  property_type: PropertyType;
  metric: CostMetric;
  value_numeric: number;
  unit?: CostUnit;
  data_source?: string | null;
  notes?: string | null;
  is_active?: boolean;
}

// GET - List all cost benchmarks
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const supabase = createServiceRoleClient();
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get("state") as AustralianState | null;
    const propertyType = searchParams.get("property_type") as PropertyType | null;
    const metric = searchParams.get("metric") as CostMetric | null;
    const activeOnly = searchParams.get("activeOnly") === "true";

    let query = supabase
      .from("cost_benchmarks")
      .select("*")
      .order("state", { ascending: true })
      .order("property_type", { ascending: true })
      .order("metric", { ascending: true });

    if (state) {
      query = query.eq("state", state);
    }

    if (propertyType) {
      query = query.eq("property_type", propertyType);
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
            error: "Cost benchmarks table not found",
            message: "Please run database migrations: 20250118_create_cost_benchmarks.sql",
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: "Failed to fetch cost benchmarks", details: error.message },
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

    console.error("Admin cost benchmarks GET error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch cost benchmarks",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - Create new cost benchmark
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body: CostBenchmarkInput = await request.json();
    const supabase = createServiceRoleClient();

    // Validate required fields
    if (!body.state || !body.property_type || !body.metric || body.value_numeric === undefined) {
      return NextResponse.json(
        { error: "State, property_type, metric, and value_numeric are required" },
        { status: 400 }
      );
    }

    // Insert benchmark (upsert to handle duplicates)
    const { data, error } = await supabase
      .from("cost_benchmarks")
      .upsert(
        {
          state: body.state,
          property_type: body.property_type,
          metric: body.metric,
          value_numeric: body.value_numeric,
          unit: body.unit || "percent",
          data_source: body.data_source || null,
          notes: body.notes || null,
          is_active: body.is_active !== undefined ? body.is_active : true,
          last_updated: new Date().toISOString().split("T")[0],
        } as never,
        {
          onConflict: "state,property_type,metric",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create cost benchmark", details: error.message },
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

    console.error("Admin cost benchmarks POST error:", error);
    return NextResponse.json(
      {
        error: "Failed to create cost benchmark",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
