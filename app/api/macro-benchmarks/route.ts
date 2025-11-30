/**
 * Macro Benchmarks API Route (Public)
 * GET endpoint for retrieving global macro benchmarks
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

export interface MacroBenchmark {
  id: string;
  category: MacroCategory;
  metric: MacroMetric;
  value_numeric: number;
  unit: string;
  data_source: string | null;
  refresh_cadence: string | null;
  last_updated: string;
  notes: string | null;
}

// GET - Retrieve macro benchmarks
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") as MacroCategory | null;
    const metric = searchParams.get("metric") as MacroMetric | null;

    let query = supabase
      .from("macro_benchmarks")
      .select("*")
      .eq("is_active", true)
      .order("category", { ascending: true })
      .order("metric", { ascending: true });

    if (category) {
      query = query.eq("category", category);
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
      benchmarks: (data || []) as MacroBenchmark[],
    });
  } catch (error) {
    console.error("Macro benchmarks GET error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch macro benchmarks",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
