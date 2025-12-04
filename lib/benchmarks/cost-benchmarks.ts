/**
 * Cost Benchmarks Helper Functions
 * Fetches cost benchmarks from the database with fallbacks
 */

import type { AustralianState, PropertyClassification } from "@/lib/firb/constants";
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
  metric: CostMetric,
  propertyClassification?: PropertyClassification,
  bedrooms?: number | null
): Promise<number | null> {
  try {
    const params = new URLSearchParams({
      state,
      property_type: propertyType,
      metric,
    });

    if (propertyClassification) {
      params.append("property_classification", propertyClassification);
    }
    if (bedrooms !== null && bedrooms !== undefined) {
      params.append("bedrooms", bedrooms.toString());
    }

    const response = await fetch(`/api/cost-benchmarks?${params.toString()}`);
    const data = await response.json();

    if (data.success && data.benchmarks && data.benchmarks.length > 0) {
      // Prefer specific benchmark (with classification/bedrooms) over general ones
      const specificBenchmark = data.benchmarks.find(
        (b: { property_classification: string | null; bedrooms: number | null }) =>
          (propertyClassification ? b.property_classification === propertyClassification : b.property_classification === null) &&
          (bedrooms !== null && bedrooms !== undefined ? b.bedrooms === bedrooms : b.bedrooms === null)
      );
      if (specificBenchmark) {
        return specificBenchmark.value_numeric;
      }
      // Fallback to first available benchmark
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
 * Tries specific benchmark first, then falls back to general benchmark
 */
export async function getCostBenchmark(
  state: AustralianState,
  propertyType: PropertyType,
  metric: CostMetric,
  supabase: SupabaseClient,
  propertyClassification?: PropertyClassification,
  bedrooms?: number | null
): Promise<number | null> {
  try {
    // First, try to get specific benchmark (with classification and bedrooms)
    if (propertyClassification && bedrooms !== null && bedrooms !== undefined) {
      const { data: specificData, error: specificError } = await supabase
        .from("cost_benchmarks")
        .select("value_numeric")
        .eq("state", state)
        .eq("property_type", propertyType)
        .eq("metric", metric)
        .eq("property_classification", propertyClassification)
        .eq("bedrooms", bedrooms)
        .eq("is_active", true)
        .maybeSingle();

      if (!specificError && specificData) {
        return (specificData as { value_numeric: number }).value_numeric;
      }
    }

    // Fallback to general benchmark (without classification/bedrooms)
    const { data, error } = await supabase
      .from("cost_benchmarks")
      .select("value_numeric")
      .eq("state", state)
      .eq("property_type", propertyType)
      .eq("metric", metric)
      .is("property_classification", null)
      .is("bedrooms", null)
      .eq("is_active", true)
      .maybeSingle();

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
  supabase?: SupabaseClient,
  propertyClassification?: PropertyClassification,
  bedrooms?: number | null
): Promise<number> {
  let value: number | null = null;

  if (supabase) {
    // Server-side
    value = await getCostBenchmark(state, propertyType, metric, supabase, propertyClassification, bedrooms);
  } else {
    // Client-side
    value = await fetchCostBenchmark(state, propertyType, metric, propertyClassification, bedrooms);
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
 * Tries specific benchmarks first, then falls back to general benchmarks
 */
export async function getCostBenchmarks(
  state: AustralianState,
  propertyType: PropertyType,
  metrics: CostMetric[],
  supabase: SupabaseClient,
  propertyClassification?: PropertyClassification,
  bedrooms?: number | null
): Promise<Partial<Record<CostMetric, number>>> {
  const results: Partial<Record<CostMetric, number>> = {};

  try {
    // First, try to get specific benchmarks (with classification and bedrooms)
    let query = supabase
      .from("cost_benchmarks")
      .select("metric, value_numeric, property_classification, bedrooms")
      .eq("state", state)
      .eq("property_type", propertyType)
      .in("metric", metrics)
      .eq("is_active", true);

    if (propertyClassification && bedrooms !== null && bedrooms !== undefined) {
      // Try specific first
      query = query.eq("property_classification", propertyClassification).eq("bedrooms", bedrooms);
    } else {
      // Fallback to general (NULL classification and bedrooms)
      query = query.is("property_classification", null).is("bedrooms", null);
    }

    let { data, error } = await query;

    // If no specific benchmarks found and we were looking for specific ones, try general
    if ((error || !data || data.length === 0) && propertyClassification && bedrooms !== null && bedrooms !== undefined) {
      const fallbackQuery = supabase
        .from("cost_benchmarks")
        .select("metric, value_numeric")
        .eq("state", state)
        .eq("property_type", propertyType)
        .in("metric", metrics)
        .is("property_classification", null)
        .is("bedrooms", null)
        .eq("is_active", true);

      const fallbackResult = await fallbackQuery;
      data = fallbackResult.data;
      error = fallbackResult.error;
    }

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
