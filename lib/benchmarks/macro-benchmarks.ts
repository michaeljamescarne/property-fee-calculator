/**
 * Macro Benchmarks Helper Functions
 * Fetches macro benchmarks from the database with fallbacks
 */

import type { createServiceRoleClient } from "@/lib/supabase/server";

type SupabaseClient = ReturnType<typeof createServiceRoleClient>;

export type MacroMetric =
  | "asx_total_return"
  | "term_deposit_rate"
  | "bond_rate"
  | "savings_rate"
  | "cgt_withholding"
  | "default_marginal_tax_rate"
  | "default_interest_rate"
  | "inflation_rate";

/**
 * Fetch macro benchmark from API (client-side)
 */
export async function fetchMacroBenchmark(metric: MacroMetric): Promise<number | null> {
  try {
    const params = new URLSearchParams({ metric });
    const response = await fetch(`/api/macro-benchmarks?${params.toString()}`);
    const data = await response.json();

    if (data.success && data.benchmarks && data.benchmarks.length > 0) {
      return data.benchmarks[0].value_numeric;
    }

    return null;
  } catch (error) {
    console.error(`Failed to fetch macro benchmark for ${metric}:`, error);
    return null;
  }
}

/**
 * Fetch macro benchmark from database (server-side)
 */
export async function getMacroBenchmark(
  metric: MacroMetric,
  supabase: SupabaseClient
): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from("macro_benchmarks")
      .select("value_numeric")
      .eq("metric", metric)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return null;
    }

    return (data as { value_numeric: number }).value_numeric;
  } catch (error) {
    console.error(`Failed to fetch macro benchmark for ${metric}:`, error);
    return null;
  }
}

/**
 * Get macro benchmark with fallback to default value
 */
export async function getMacroBenchmarkWithFallback(
  metric: MacroMetric,
  defaultValue: number,
  supabase?: SupabaseClient
): Promise<number> {
  let value: number | null = null;

  if (supabase) {
    // Server-side
    value = await getMacroBenchmark(metric, supabase);
  } else {
    // Client-side
    value = await fetchMacroBenchmark(metric);
  }

  return value ?? defaultValue;
}

/**
 * Default fallback values for macro benchmarks
 * These match the current hardcoded values
 */
export const DEFAULT_MACRO_BENCHMARKS: Record<MacroMetric, number> = {
  asx_total_return: 7.2, // 7.2%
  term_deposit_rate: 4.0, // 4%
  bond_rate: 4.5, // 4.5%
  savings_rate: 4.5, // 4.5%
  cgt_withholding: 12.5, // 12.5%
  default_marginal_tax_rate: 37.0, // 37%
  default_interest_rate: 6.5, // 6.5%
  inflation_rate: 3.0, // 3%
};

/**
 * Get multiple macro benchmarks at once (server-side)
 */
export async function getMacroBenchmarks(
  metrics: MacroMetric[],
  supabase: SupabaseClient
): Promise<Partial<Record<MacroMetric, number>>> {
  const results: Partial<Record<MacroMetric, number>> = {};

  try {
    const { data, error } = await supabase
      .from("macro_benchmarks")
      .select("metric, value_numeric")
      .in("metric", metrics)
      .eq("is_active", true);

    if (error || !data) {
      // Return defaults for all
      metrics.forEach((metric) => {
        results[metric] = DEFAULT_MACRO_BENCHMARKS[metric];
      });
      return results as Partial<Record<MacroMetric, number>>;
    }

    // Map results
    const benchmarkMap = new Map(
      data.map((b: { metric: MacroMetric; value_numeric: number }) => [b.metric, b.value_numeric])
    );

    // Fill in values, using defaults for missing ones
    for (const metric of metrics) {
      const value = benchmarkMap.get(metric);
      if (typeof value === "number") {
        results[metric] = value;
      } else {
        results[metric] = DEFAULT_MACRO_BENCHMARKS[metric];
      }
    }

    return results;
  } catch (error) {
    console.error("Failed to fetch macro benchmarks:", error);
    // Return defaults
    metrics.forEach((metric) => {
      results[metric] = DEFAULT_MACRO_BENCHMARKS[metric];
    });
    return results;
  }
}
