/**
 * Cost Benchmarks Helper Functions
 * Fetches cost benchmarks from the database with fallbacks
 */

import type { AustralianState } from "@/lib/firb/constants";
import type { PropertyType } from "@/lib/firb/constants";
import type { createServiceRoleClient } from "@/lib/supabase/server";

type SupabaseClient = ReturnType<typeof createServiceRoleClient>;

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

/**
 * Fetch cost benchmark from API (client-side)
 */
export async function fetchCostBenchmark(
  state: AustralianState,
  propertyType: PropertyType,
  metric: CostMetric
): Promise<number | null> {
  try {
    const params = new URLSearchParams({
      state,
      property_type: propertyType,
      metric,
    });

    const response = await fetch(`/api/cost-benchmarks?${params.toString()}`);
    const data = await response.json();

    if (data.success && data.benchmarks && data.benchmarks.length > 0) {
      return data.benchmarks[0].value_numeric;
    }

    return null;
  } catch (error) {
    console.error(`Failed to fetch cost benchmark for ${metric}:`, error);
    return null;
  }
}

/**
 * Fetch cost benchmark from database (server-side)
 */
export async function getCostBenchmark(
  state: AustralianState,
  propertyType: PropertyType,
  metric: CostMetric,
  supabase: SupabaseClient
): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from("cost_benchmarks")
      .select("value_numeric")
      .eq("state", state)
      .eq("property_type", propertyType)
      .eq("metric", metric)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return null;
    }

    return (data as { value_numeric: number }).value_numeric;
  } catch (error) {
    console.error(`Failed to fetch cost benchmark for ${metric}:`, error);
    return null;
  }
}

/**
 * Get cost benchmark with fallback to default value
 */
export async function getCostBenchmarkWithFallback(
  state: AustralianState,
  propertyType: PropertyType,
  metric: CostMetric,
  defaultValue: number,
  supabase?: SupabaseClient
): Promise<number> {
  let value: number | null = null;

  if (supabase) {
    // Server-side
    value = await getCostBenchmark(state, propertyType, metric, supabase);
  } else {
    // Client-side
    value = await fetchCostBenchmark(state, propertyType, metric);
  }

  return value ?? defaultValue;
}

/**
 * Default fallback values for cost benchmarks
 * These match the current hardcoded values as fallbacks
 */
export const DEFAULT_COST_BENCHMARKS: Record<CostMetric, number> = {
  council_rate_percent: 0.3, // 0.3% of property value
  insurance_percent: 0.2, // 0.2% of property value
  maintenance_percent: 1.0, // 1% for new, 1.5% for established (will be handled in function)
  vacancy_rate_percent: 5.0, // 5%
  management_fee_percent: 8.0, // 8%
  letting_fee_weeks: 2.0, // 2 weeks
  rent_growth_percent: 3.0, // 3% per annum
  interest_rate_percent: 6.5, // 6.5%
  selling_costs_percent: 4.0, // 4%
  loan_cost_basis_points: 10.0, // 10 bps = 0.1%
  strata_fee_percent: 0.0, // Varies, default 0
};

/**
 * Get multiple cost benchmarks at once (server-side)
 */
export async function getCostBenchmarks(
  state: AustralianState,
  propertyType: PropertyType,
  metrics: CostMetric[],
  supabase: SupabaseClient
): Promise<Partial<Record<CostMetric, number>>> {
  const results: Partial<Record<CostMetric, number>> = {};

  try {
    const { data, error } = await supabase
      .from("cost_benchmarks")
      .select("metric, value_numeric")
      .eq("state", state)
      .eq("property_type", propertyType)
      .in("metric", metrics)
      .eq("is_active", true);

    if (error || !data) {
      // Return defaults for all
      metrics.forEach((metric) => {
        results[metric] = DEFAULT_COST_BENCHMARKS[metric];
      });
      return results as Partial<Record<CostMetric, number>>;
    }

    // Map results
    const benchmarkMap = new Map(
      data.map((b: { metric: CostMetric; value_numeric: number }) => [b.metric, b.value_numeric])
    );

    // Fill in values, using defaults for missing ones
    for (const metric of metrics) {
      const value = benchmarkMap.get(metric);
      if (typeof value === "number") {
        results[metric] = value;
      } else {
        results[metric] = DEFAULT_COST_BENCHMARKS[metric];
      }
    }

    return results;
  } catch (error) {
    console.error("Failed to fetch cost benchmarks:", error);
    // Return defaults
    metrics.forEach((metric) => {
      results[metric] = DEFAULT_COST_BENCHMARKS[metric];
    });
    return results;
  }
}
