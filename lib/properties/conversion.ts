/**
 * Property Conversion Helpers
 * Convert saved calculations to property records
 */

import type { SavedCalculation, PropertyInsert } from "@/types/database";
import { getProperty } from "./storage";

/**
 * Convert a saved calculation to a property
 */
export function convertCalculationToProperty(
  calculation: SavedCalculation,
  userId: string,
  propertyName?: string
): PropertyInsert {
  const calculationData = calculation.calculation_data;

  // Extract property details from calculation
  const property: PropertyInsert = {
    user_id: userId,
    property_name:
      propertyName || calculation.calculation_name || calculation.property_address || null,
    property_address: calculation.property_address || calculationData.propertyAddress || "",
    property_state: calculationData.propertyState,
    property_type: calculationData.propertyType,
    property_classification: calculationData.propertyClassification || null,
    bedrooms: calculationData.bedrooms || null,
    purchase_date: calculationData.purchaseDate || new Date().toISOString().split("T")[0],
    purchase_price: calculationData.propertyValue,
    purchase_costs:
      calculationData.costs.upfrontCosts.total - calculationData.costs.upfrontCosts.propertyPrice,
    deposit_amount: calculationData.depositPercent
      ? calculationData.propertyValue * (calculationData.depositPercent / 100)
      : null,
    loan_amount: calculationData.depositPercent
      ? calculationData.propertyValue * (1 - calculationData.depositPercent / 100)
      : null,
    current_value: calculationData.propertyValue, // Initial value is purchase price
    current_loan_balance: calculationData.depositPercent
      ? calculationData.propertyValue * (1 - calculationData.depositPercent / 100)
      : null,
    interest_rate: null, // Not in calculation data
    loan_term_years: null, // Not in calculation data
    loan_type: null, // Not in calculation data
    is_rental: false, // Default, user can update
    weekly_rent: null,
    property_management_fee_percent: null,
    status: "active",
    sold_date: null,
    sale_price: null,
    sale_costs: null,
    source_calculation_id: calculation.id,
    notes: `Converted from calculation: ${calculation.calculation_name || "Unnamed calculation"}`,
  };

  // If calculation has investment analytics with rental info, use it
  if (calculationData.analytics && typeof calculationData.analytics === "object") {
    const analytics = calculationData.analytics as any;
    if (analytics.rentalYield?.weeklyRent) {
      property.weekly_rent = analytics.rentalYield.weeklyRent;
      property.is_rental = true;
    }
  }

  return property;
}

/**
 * Check if a calculation has already been converted to a property
 */
export async function isCalculationConverted(
  calculationId: string,
  userId: string
): Promise<boolean> {
  const supabase = await import("@/lib/supabase/server").then((m) => m.createServiceRoleClient());

  const { data, error } = await supabase
    .from("properties")
    .select("id")
    .eq("source_calculation_id", calculationId)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error("Error checking if calculation is converted:", error);
    return false;
  }

  return data !== null;
}


