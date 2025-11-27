/**
 * Short-Stay Regulations API Route
 * Looks up short-stay regulations based on property address/state
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { ShortStayRegulation } from "@/lib/firb/optimal-use-case";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const state = searchParams.get("state");
    const postcode = searchParams.get("postcode");
    const council = searchParams.get("council");
    const suburb = searchParams.get("suburb");

    if (!state) {
      return NextResponse.json({ error: "State is required" }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Validate service role key exists
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("SUPABASE_SERVICE_ROLE_KEY not set, returning null regulations");
      return NextResponse.json({
        success: true,
        regulation: null,
      });
    }

    // Build query - start with state, then narrow down
    let query = supabase
      .from("short_stay_regulations")
      .select("*")
      .eq("state", state)
      .eq("is_active", true);

    // If we have council name, prioritize exact match
    if (council) {
      query = query.ilike("council_name", `%${council}%`);
    }

    // If we have suburb, try to match
    if (suburb) {
      query = query.ilike("suburb_name", `%${suburb}%`);
    }

    // If we have postcode, try to match postcode range
    if (postcode) {
      // Try exact match first, then prefix match
      query = query.or(`postcode_range.eq.${postcode},postcode_range.ilike.${postcode}%`);
    }

    // Order and limit
    query = query.order("effective_date", { ascending: false }).limit(1);

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to query regulations" }, { status: 500 });
    }

    // If no specific match, return state-level default (if exists)
    if (!data || data.length === 0) {
      // Try to get a state-level default (council_name is null or empty)
      const { data: defaultData, error: defaultError } = await supabase
        .from("short_stay_regulations")
        .select("*")
        .eq("state", state)
        .eq("is_active", true)
        .is("council_name", null)
        .order("effective_date", { ascending: false })
        .limit(1);

      if (defaultError) {
        console.error("Default query error:", defaultError);
      }

      if (defaultData && defaultData.length > 0) {
        return NextResponse.json({
          success: true,
          regulation: formatRegulation(defaultData[0]),
        });
      }

      // No regulations found - return null (short-stay may be permitted by default)
      return NextResponse.json({
        success: true,
        regulation: null,
      });
    }

    return NextResponse.json({
      success: true,
      regulation: formatRegulation(data[0]),
    });
  } catch (error) {
    console.error("Short-stay regulations lookup error:", error);
    return NextResponse.json(
      {
        error: "Failed to lookup regulations",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Format regulation from database to ShortStayRegulation type
 */
function formatRegulation(dbRegulation: Record<string, unknown>): ShortStayRegulation {
  return {
    shortStayPermitted: dbRegulation.short_stay_permitted as boolean,
    maxDaysPerYear: (dbRegulation.max_days_per_year as number) ?? null,
    licensingRequired: dbRegulation.licensing_required as boolean,
    licensingDescription: (dbRegulation.licensing_description as string) ?? null,
    complianceCostAnnual: (dbRegulation.compliance_cost_annual as number) || 0,
    complianceCostOneTime: (dbRegulation.compliance_cost_one_time as number) || 0,
    zoningRestrictions: (dbRegulation.zoning_restrictions as string) ?? null,
  };
}
