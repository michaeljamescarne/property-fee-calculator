/**
 * Calculation Storage Helpers
 * Functions for saving and loading calculations
 */

import type { CalculationData, SavedCalculation } from "@/types/database";
import type { EligibilityResult } from "@/lib/firb/eligibility";

/**
 * Extract summary data from calculation for list display
 */
export function getCalculationSummary(calculation: SavedCalculation) {
  const { calculation_data, property_address, property_value, eligibility_status } = calculation;

  return {
    id: calculation.id,
    name: calculation.calculation_name || property_address || "Unnamed Calculation",
    address: property_address || "No address provided",
    value: property_value || calculation_data.propertyValue,
    eligibility:
      eligibility_status ||
      (calculation_data.eligibility.isEligible ? "Eligible" : "Review Required"),
    isFirstHome: calculation_data.isFirstHome,
    propertyType: calculation_data.propertyType,
    propertyState: calculation_data.propertyState,
    isFavorite: calculation.is_favorite,
    createdAt: calculation.created_at,
    updatedAt: calculation.updated_at,
  };
}

/**
 * Format calculation data for storage
 */
export function prepareCalculationForStorage(
  calculationData: CalculationData,
  userId: string,
  name?: string
) {
  // Handle eligibility status - check both isEligible and canPurchase
  let eligibilityStatus = "Review Required";
  if (calculationData.eligibility) {
    const eligibility = calculationData.eligibility as EligibilityResult;
    if (eligibility.canPurchase && !eligibility.requiresFIRB) {
      eligibilityStatus = "Eligible";
    } else if (eligibility.canPurchase && eligibility.requiresFIRB) {
      eligibilityStatus = "Review Required";
    } else {
      eligibilityStatus = "Not Eligible";
    }
  }

  return {
    user_id: userId,
    calculation_data: calculationData,
    property_address: calculationData.propertyAddress || null,
    property_value: calculationData.propertyValue,
    eligibility_status: eligibilityStatus,
    calculation_name: name || null,
    is_favorite: false,
  };
}

/**
 * Sort calculations by different criteria
 */
export type SortOption = "date-desc" | "date-asc" | "value-desc" | "value-asc" | "name";

export function sortCalculations(
  calculations: SavedCalculation[],
  sortBy: SortOption = "date-desc"
): SavedCalculation[] {
  const sorted = [...calculations];

  switch (sortBy) {
    case "date-desc":
      return sorted.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case "date-asc":
      return sorted.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    case "value-desc":
      return sorted.sort((a, b) => (b.property_value || 0) - (a.property_value || 0));
    case "value-asc":
      return sorted.sort((a, b) => (a.property_value || 0) - (b.property_value || 0));
    case "name":
      return sorted.sort((a, b) => {
        const nameA = a.calculation_name || a.property_address || "";
        const nameB = b.calculation_name || b.property_address || "";
        return nameA.localeCompare(nameB);
      });
    default:
      return sorted;
  }
}

/**
 * Filter calculations by different criteria
 */
export interface CalculationFilters {
  search?: string;
  eligibility?: "all" | "eligible" | "review-required";
  propertyType?: string;
  state?: string;
  favorites?: boolean;
}

export function filterCalculations(
  calculations: SavedCalculation[],
  filters: CalculationFilters
): SavedCalculation[] {
  let filtered = [...calculations];

  // Search by name or address
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter((calc) => {
      const name = (calc.calculation_name || "").toLowerCase();
      const address = (calc.property_address || "").toLowerCase();
      return name.includes(searchLower) || address.includes(searchLower);
    });
  }

  // Filter by eligibility
  if (filters.eligibility && filters.eligibility !== "all") {
    filtered = filtered.filter((calc) => {
      const isEligible = calc.eligibility_status === "Eligible";
      return filters.eligibility === "eligible" ? isEligible : !isEligible;
    });
  }

  // Filter by property type
  if (filters.propertyType) {
    filtered = filtered.filter(
      (calc) => calc.calculation_data.propertyType === filters.propertyType
    );
  }

  // Filter by state
  if (filters.state) {
    filtered = filtered.filter((calc) => calc.calculation_data.propertyState === filters.state);
  }

  // Filter favorites
  if (filters.favorites) {
    filtered = filtered.filter((calc) => calc.is_favorite);
  }

  return filtered;
}
