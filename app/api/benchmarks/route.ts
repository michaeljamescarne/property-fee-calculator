/**
 * Benchmarks API Route
 * Looks up benchmark data (rental yield, capital growth) by state/suburb/postcode
 * Uses Next.js 16 caching APIs for improved performance
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { AustralianState } from "@/lib/firb/constants";

// Cache tags for revalidation
export const CACHE_TAGS = {
  benchmarks: "benchmarks",
  benchmarkState: (state: string) => `benchmarks-${state}`,
  benchmarkSuburb: (suburb: string) => `benchmarks-suburb-${suburb}`,
} as const;

// Revalidate every 6 hours (benchmark data changes infrequently)
export const revalidate = 21600; // 6 hours in seconds

export interface BenchmarkData {
  state: AustralianState;
  suburb?: string;
  postcode?: string;
  grossRentalYield?: number;
  netRentalYield?: number;
  medianWeeklyRent?: number;
  capitalGrowth5yr?: number;
  capitalGrowth10yr?: number;
  medianPropertyValue?: number;
  level: "suburb" | "state" | "national";
  dataSource?: string;
  lastUpdated?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get("state") as AustralianState | null;
    const postcode = searchParams.get("postcode");
    const suburb = searchParams.get("suburb");

    if (!state) {
      return NextResponse.json({ error: "State is required" }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Try to find most specific match first
    let query = supabase
      .from("benchmark_data")
      .select("*")
      .eq("state", state)
      .eq("is_active", true)
      .order("updated_at", { ascending: false });

    // Prioritize specific matches
    if (suburb) {
      query = query.ilike("suburb_name", `%${suburb}%`);
    }
    if (postcode) {
      query = query.eq("postcode", postcode);
    }

    const { data, error } = await query.limit(1);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to query benchmarks" }, { status: 500 });
    }

    // If specific match found, return it
    if (data && data.length > 0) {
      const response = NextResponse.json({
        success: true,
        benchmark: formatBenchmark(data[0], suburb ? "suburb" : "state"),
      });

      // Set cache tags
      const tags = [
        CACHE_TAGS.benchmarks,
        CACHE_TAGS.benchmarkState(state),
      ];
      if (suburb) {
        tags.push(CACHE_TAGS.benchmarkSuburb(suburb));
      }
      response.headers.set("Cache-Tag", tags.join(","));

      return response;
    }

    // Fallback: Try state-level benchmark (suburb_name is NULL)
    const { data: stateData, error: stateError } = await supabase
      .from("benchmark_data")
      .select("*")
      .eq("state", state)
      .eq("is_active", true)
      .is("suburb_name", null)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (stateError) {
      console.error("State query error:", stateError);
    }

    if (stateData && stateData.length > 0) {
      const response = NextResponse.json({
        success: true,
        benchmark: formatBenchmark(stateData[0], "state"),
      });

      // Set cache tags for state-level benchmark
      response.headers.set(
        "Cache-Tag",
        `${CACHE_TAGS.benchmarks},${CACHE_TAGS.benchmarkState(state)}`
      );

      return response;
    }

    // No benchmark found - return null (calculator will use defaults)
    const response = NextResponse.json({
      success: true,
      benchmark: null,
    });

    // Cache the "not found" response for a shorter time
    response.headers.set("Cache-Tag", `${CACHE_TAGS.benchmarks},${CACHE_TAGS.benchmarkState(state)}`);

    return response;
  } catch (error) {
    console.error("Benchmarks lookup error:", error);
    return NextResponse.json(
      {
        error: "Failed to lookup benchmarks",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Format benchmark from database to BenchmarkData type
 */
function formatBenchmark(
  dbBenchmark: Record<string, unknown>,
  level: "suburb" | "state" | "national"
): BenchmarkData {
  return {
    state: dbBenchmark.state as AustralianState,
    suburb: dbBenchmark.suburb_name as string | undefined,
    postcode: dbBenchmark.postcode as string | undefined,
    grossRentalYield: dbBenchmark.gross_rental_yield as number | undefined,
    netRentalYield: dbBenchmark.net_rental_yield as number | undefined,
    medianWeeklyRent: dbBenchmark.median_weekly_rent as number | undefined,
    capitalGrowth5yr: dbBenchmark.capital_growth_5yr as number | undefined,
    capitalGrowth10yr: dbBenchmark.capital_growth_10yr as number | undefined,
    medianPropertyValue: dbBenchmark.median_property_value as number | undefined,
    level,
    dataSource: dbBenchmark.data_source as string | undefined,
    lastUpdated: dbBenchmark.last_updated as string | undefined,
  };
}
