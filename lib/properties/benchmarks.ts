/**
 * Property Benchmark Comparison
 * Compare property performance against market benchmarks
 */

import type { Property } from "@/types/database";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { PropertyPerformanceMetrics } from "./performance";
import type { BenchmarkData } from "@/app/api/benchmarks/route";

export interface BenchmarkComparison {
  rentalYield: {
    property: number;
    benchmark: number | null;
    difference: number;
    status: "above" | "below" | "at" | "no-benchmark";
  };
  capitalGrowth: {
    property: number;
    benchmark5yr: number | null;
    benchmark10yr: number | null;
    status: "above" | "below" | "at" | "no-benchmark";
  };
  costs: {
    category: string;
    property: number;
    benchmark: number | null;
    difference: number;
    status: "above" | "below" | "at" | "no-benchmark";
  }[];
}

/**
 * Get benchmark comparison for a property
 */
export async function getPropertyBenchmarkComparison(
  property: Property,
  performance: PropertyPerformanceMetrics
): Promise<BenchmarkComparison> {
  const supabase = createServiceRoleClient();

  // Get benchmark data for the property's state
  let benchmarkData: BenchmarkData | null = null;
  try {
    const { data, error } = await supabase
      .from("benchmark_data")
      .select("*")
      .eq("state", property.property_state)
      .eq("is_active", true)
      .is("suburb_name", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      const row = data as any;
      benchmarkData = {
        state: row.state,
        suburb: row.suburb_name || undefined,
        postcode: row.postcode || undefined,
        grossRentalYield: row.gross_rental_yield || undefined,
        netRentalYield: row.net_rental_yield || undefined,
        capitalGrowth5yr: row.capital_growth_5yr || undefined,
        capitalGrowth10yr: row.capital_growth_10yr || undefined,
        medianPropertyValue: row.median_property_value || undefined,
        level: "state",
        dataSource: row.data_source || undefined,
        lastUpdated: row.last_updated || undefined,
      };
    }
  } catch (error) {
    console.error("Error fetching benchmark data:", error);
  }

  // Compare rental yield
  const propertyYield = property.is_rental ? performance.rentalYield.gross : 0;
  const benchmarkYield = benchmarkData?.grossRentalYield || null;
  const yieldDifference = benchmarkYield !== null ? propertyYield - benchmarkYield : 0;
  const yieldStatus =
    benchmarkYield === null
      ? "no-benchmark"
      : Math.abs(yieldDifference) < 0.1
        ? "at"
        : yieldDifference > 0
          ? "above"
          : "below";

  // Compare capital growth
  const propertyGrowth = performance.capitalGrowth.annualRate;
  const benchmarkGrowth5yr = benchmarkData?.capitalGrowth5yr || null;
  const benchmarkGrowth10yr = benchmarkData?.capitalGrowth10yr || null;
  const avgBenchmarkGrowth =
    benchmarkGrowth5yr !== null && benchmarkGrowth10yr !== null
      ? (benchmarkGrowth5yr + benchmarkGrowth10yr) / 2
      : benchmarkGrowth5yr || benchmarkGrowth10yr || null;
  const growthDifference = avgBenchmarkGrowth !== null ? propertyGrowth - avgBenchmarkGrowth : 0;
  const growthStatus =
    avgBenchmarkGrowth === null
      ? "no-benchmark"
      : Math.abs(growthDifference) < 0.5
        ? "at"
        : growthDifference > 0
          ? "above"
          : "below";

  // Cost comparisons would require fetching cost benchmarks
  // For now, return empty array - can be extended later
  const costs: BenchmarkComparison["costs"] = [];

  return {
    rentalYield: {
      property: propertyYield,
      benchmark: benchmarkYield,
      difference: yieldDifference,
      status: yieldStatus,
    },
    capitalGrowth: {
      property: propertyGrowth,
      benchmark5yr: benchmarkGrowth5yr,
      benchmark10yr: benchmarkGrowth10yr,
      status: growthStatus,
    },
    costs,
  };
}
