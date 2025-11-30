/**
 * Cost Benchmarks API Route (Public)
 * GET endpoint for retrieving cost benchmarks by state, property type, and metric
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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

export interface CostBenchmark {
  id: string;
  state: AustralianState;
  property_type: PropertyType;
  metric: CostMetric;
  value_numeric: number;
  unit: string;
  data_source: string | null;
  last_updated: string;
  notes: string | null;
}

// GET - Retrieve cost benchmarks
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get("state") as AustralianState | null;
    const propertyType = searchParams.get("property_type") as PropertyType | null;
    const metric = searchParams.get("metric") as CostMetric | null;

    let query = supabase
      .from("cost_benchmarks")
      .select("*")
      .eq("is_active", true)
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
      benchmarks: (data || []) as CostBenchmark[],
    });
  } catch (error) {
    console.error("Cost benchmarks GET error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch cost benchmarks",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
