/**
 * Tax Calculator
 * Calculates tax deductions, negative gearing benefits, and CGT
 */

import { PropertyType } from "./constants";

export interface TaxDeductions {
  loanInterest: number;
  councilRates: number;
  landTax: number;
  propertyManagement: number;
  maintenance: number;
  insurance: number;
  depreciation: number;
  strataFees: number;
  other: number;
  total: number;
}

export interface CGTCalculation {
  salePrice: number;
  originalPurchasePrice: number;
  purchaseCosts: number;
  improvementCosts: number;
  sellingCosts: number;
  costBase: number;
  capitalGain: number;
  mainResidenceExemption: number; // Amount exempted due to main residence exemption
  taxableCapitalGain: number; // Capital gain after exemptions
  cgtRate: number;
  cgtAmount: number;
  withholdingTax: number;
  netProceedsAfterTax: number;
  assumptions: {
    taxResidency: "australian" | "foreign";
    propertyUsage: "rental" | "primaryResidence" | "vacant";
    mainResidenceExemptionApplied: boolean;
    exemptionAmount: number;
    exemptionExplanation: string;
    cgtDiscountApplied: boolean;
    discountFactor: number;
    discountExplanation: string;
    withholdingTaxApplies: boolean;
    withholdingTaxExplanation: string;
    marginalTaxRate: number;
    holdPeriodYears: number;
  };
}

/**
 * Calculate annual tax deductions for investment property
 * Note: Depreciation is only available for income-producing properties
 */
export function calculateTaxDeductions(
  loanInterest: number,
  councilRates: number,
  landTax: number,
  propertyManagement: number,
  maintenance: number,
  insurance: number,
  strataFees: number,
  propertyValue: number,
  propertyType: PropertyType,
  buildingAge: number = 0, // Years since construction
  isIncomeProducing: boolean = true, // Whether property is used to generate income (rental)
  purchasePrice?: number, // Original purchase price (if different from current value)
  builtAfter1987: boolean = true // Whether building was constructed after Sept 15, 1987
): TaxDeductions {
  // Calculate depreciation (if applicable)
  let depreciation = 0;

  // CRITICAL: Depreciation is ONLY available for income-producing properties
  // Primary residences, vacant properties, and non-rental properties get $0 depreciation
  if (!isIncomeProducing) {
    // Return deductions with $0 depreciation for non-income-producing properties
    const other = 0;
    const total =
      loanInterest +
      councilRates +
      landTax +
      propertyManagement +
      maintenance +
      insurance +
      depreciation +
      strataFees +
      other;

    return {
      loanInterest,
      councilRates,
      landTax,
      propertyManagement,
      maintenance,
      insurance,
      depreciation: 0,
      strataFees,
      other,
      total,
    };
  }

  // Vacant land: No building structure, so no depreciation available
  if (propertyType === "vacantLand") {
    const other = 0;
    const total =
      loanInterest +
      councilRates +
      landTax +
      propertyManagement +
      maintenance +
      insurance +
      depreciation +
      strataFees +
      other;

    return {
      loanInterest,
      councilRates,
      landTax,
      propertyManagement,
      maintenance,
      insurance,
      depreciation: 0,
      strataFees,
      other,
      total,
    };
  }

  // Use purchase price if available, otherwise use current property value
  // Depreciation is based on cost basis (purchase price/construction cost), not current market value
  const costBasis = purchasePrice || propertyValue;
  const buildingCost = costBasis * 0.7; // Approx 70% building, 30% land
  const plantValue = costBasis * 0.1; // Approx 10% fixtures

  // Capital Works (Division 43): 2.5% per year for 40 years
  // Only available for properties built after September 15, 1987
  // Applies to: newDwelling, established (if built after 1987), and commercial properties
  if (
    (propertyType === "newDwelling" ||
      propertyType === "established" ||
      propertyType === "commercial") &&
    builtAfter1987 &&
    buildingAge < 40
  ) {
    depreciation += buildingCost * 0.025;
  }

  // Plant & Equipment (Division 40): Depreciation rates vary
  // For new dwellings: All plant & equipment eligible
  // For established properties: Only NEW plant & equipment (if purchased after May 9, 2017)
  // Simplified calculation: Only apply to new dwellings for now
  if (propertyType === "newDwelling" && buildingAge < 5) {
    // Plant & equipment: 20% diminishing value for first 5 years
    depreciation += plantValue * 0.2 * (1 - buildingAge * 0.2);
  }
  // Note: For established properties, plant & equipment depreciation would require
  // tracking which items are new vs. second-hand, which is beyond this simplified calculation

  const other = 0; // Repairs, pest control, etc.

  const total =
    loanInterest +
    councilRates +
    landTax +
    propertyManagement +
    maintenance +
    insurance +
    depreciation +
    strataFees +
    other;

  return {
    loanInterest,
    councilRates,
    landTax,
    propertyManagement,
    maintenance,
    insurance,
    depreciation,
    strataFees,
    other,
    total,
  };
}

/**
 * Determine tax residency status based on citizenship and ordinarily resident status
 */
export function determineTaxResidency(
  citizenshipStatus: "australian" | "permanent" | "temporary" | "foreign",
  isOrdinarilyResident?: boolean
): {
  isAustralianTaxResident: boolean;
  explanation: string;
} {
  // Australian citizens
  if (citizenshipStatus === "australian") {
    if (isOrdinarilyResident === true) {
      return {
        isAustralianTaxResident: true,
        explanation: "Australian citizen ordinarily resident in Australia",
      };
    } else if (isOrdinarilyResident === false) {
      return {
        isAustralianTaxResident: false,
        explanation: "Australian citizen not ordinarily resident (treated as foreign tax resident)",
      };
    } else {
      // Default assumption: if not specified, assume ordinarily resident
      return {
        isAustralianTaxResident: true,
        explanation: "Australian citizen (assumed ordinarily resident)",
      };
    }
  }

  // Permanent residents
  if (citizenshipStatus === "permanent") {
    if (isOrdinarilyResident === false) {
      return {
        isAustralianTaxResident: false,
        explanation: "Permanent resident not ordinarily resident (treated as foreign tax resident)",
      };
    } else {
      // Default assumption: ordinarily resident
      return {
        isAustralianTaxResident: true,
        explanation: "Permanent resident ordinarily resident in Australia",
      };
    }
  }

  // Temporary residents - simplified: treated as foreign tax residents
  // (Complex cases where temporary residents meet residency tests can be enhanced later)
  if (citizenshipStatus === "temporary") {
    return {
      isAustralianTaxResident: false,
      explanation: "Temporary resident (treated as foreign tax resident)",
    };
  }

  // Foreign persons
  return {
    isAustralianTaxResident: false,
    explanation: "Foreign person (treated as foreign tax resident)",
  };
}

/**
 * Calculate tax benefit from negative gearing
 */
export function calculateTaxBenefit(
  totalDeductions: number,
  rentalIncome: number,
  marginalTaxRate: number
): number {
  // Net rental loss (if negative)
  const netRentalLoss = Math.max(0, totalDeductions - rentalIncome);

  // Tax benefit = Loss × Marginal Tax Rate
  return netRentalLoss * (marginalTaxRate / 100);
}

/**
 * Calculate Capital Gains Tax on property sale
 * Note: Foreign residents do NOT get the 50% CGT discount for assets acquired after May 8, 2012
 * Note: Main residence exemption applies to primary residences (Australian residents only)
 */
export function calculateCGT(
  salePrice: number,
  originalPurchasePrice: number,
  purchaseCosts: number, // Stamp duty, legal, FIRB fees, etc.
  sellingCosts: number, // Agent, legal, marketing
  isAustralianTaxResident: boolean,
  marginalTaxRate: number,
  assetAcquisitionDate?: string, // ISO date string - to check May 8, 2012 cutoff
  holdPeriodYears: number = 1, // Years the asset was held
  cgtWithholdingRate: number = 0.125, // From macro benchmarks (default 12.5%)
  propertyUsage?: "rental" | "primaryResidence" | "vacant", // How property is used
  wasMainResidence?: boolean, // Whether property was ever main residence
  yearsAsMainResidence?: number, // Years property was main residence
  yearsRentedAfterMainResidence?: number // Years rented after being main residence (for 6-year rule)
): CGTCalculation {
  // Cost base = Purchase price + purchase costs + improvements + selling costs
  const costBase = originalPurchasePrice + purchaseCosts + sellingCosts;

  // Capital gain
  const capitalGain = Math.max(0, salePrice - costBase);

  // MAIN RESIDENCE EXEMPTION CALCULATION
  let mainResidenceExemption = 0;
  let exemptionExplanation = "";
  let mainResidenceExemptionApplied = false;

  // Check if foreign resident at sale (foreign residents not eligible for main residence exemption as of June 30, 2020)
  const isForeignResidentAtSale = !isAustralianTaxResident;

  // Scenario 1: Primary Residence (Current Use)
  if (propertyUsage === "primaryResidence" && !isForeignResidentAtSale) {
    // Full exemption for main residence (Australian residents only)
    mainResidenceExemption = capitalGain;
    mainResidenceExemptionApplied = true;
    exemptionExplanation =
      "Full main residence exemption applies (property is your main residence)";
  } else if (propertyUsage === "primaryResidence" && isForeignResidentAtSale) {
    // Foreign residents not eligible for main residence exemption
    exemptionExplanation =
      "Main residence exemption not available (foreign resident at time of sale, as of June 30, 2020)";
  }

  // Scenario 2: 6-Year Rule (Rented After Being Main Residence)
  if (
    propertyUsage === "rental" &&
    wasMainResidence &&
    yearsRentedAfterMainResidence !== undefined &&
    yearsRentedAfterMainResidence <= 6 &&
    !isForeignResidentAtSale
  ) {
    // Full exemption under 6-year rule
    mainResidenceExemption = capitalGain;
    mainResidenceExemptionApplied = true;
    exemptionExplanation = `Full main residence exemption applies (6-year rule: rented for ${yearsRentedAfterMainResidence} years after being main residence, within 6-year limit)`;
  } else if (
    propertyUsage === "rental" &&
    wasMainResidence &&
    yearsRentedAfterMainResidence !== undefined &&
    yearsRentedAfterMainResidence > 6 &&
    !isForeignResidentAtSale &&
    yearsAsMainResidence !== undefined
  ) {
    // Partial exemption: Only first 6 years of rental period exempt
    const exemptRentalPeriod = 6; // First 6 years of rental exempt
    const totalOwnershipPeriod = yearsAsMainResidence + yearsRentedAfterMainResidence;
    const exemptProportion = (yearsAsMainResidence + exemptRentalPeriod) / totalOwnershipPeriod;
    mainResidenceExemption = capitalGain * exemptProportion;
    mainResidenceExemptionApplied = true;
    exemptionExplanation = `Partial main residence exemption applies (6-year rule: ${(exemptProportion * 100).toFixed(0)}% exempt - ${yearsAsMainResidence} years as main residence + 6 years rental exemption, ${yearsRentedAfterMainResidence - 6} years beyond 6-year limit are taxable)`;
  }

  // Scenario 3: Partial Exemption (Mixed Use - Main Residence Then Rental, not covered by 6-year rule)
  // This handles cases where property was main residence then rental, but 6-year rule doesn't apply
  // (e.g., rental period not specified, or other scenarios)
  if (
    propertyUsage === "rental" &&
    yearsAsMainResidence !== undefined &&
    yearsAsMainResidence > 0 &&
    holdPeriodYears > yearsAsMainResidence &&
    wasMainResidence && // Property was main residence for part of period
    !isForeignResidentAtSale &&
    yearsRentedAfterMainResidence === undefined && // Not covered by 6-year rule scenarios above
    !mainResidenceExemptionApplied // Haven't already applied exemption
  ) {
    // Property was main residence for part of ownership, then became rental
    const exemptProportion = yearsAsMainResidence / holdPeriodYears;
    mainResidenceExemption = capitalGain * exemptProportion;
    mainResidenceExemptionApplied = true;
    exemptionExplanation = `Partial main residence exemption applies (${(exemptProportion * 100).toFixed(0)}% of ownership period was main residence, ${((1 - exemptProportion) * 100).toFixed(0)}% was rental)`;
  }

  // Scenario 4: Vacant Property or Rental (Never Main Residence)
  if (
    (propertyUsage === "vacant" || (propertyUsage === "rental" && !wasMainResidence)) &&
    !mainResidenceExemptionApplied
  ) {
    exemptionExplanation =
      propertyUsage === "vacant"
        ? "No main residence exemption (property is vacant, not used as main residence)"
        : "No main residence exemption (property is rental investment, never used as main residence)";
  }

  // Calculate taxable capital gain (after exemptions)
  const taxableCapitalGain = Math.max(0, capitalGain - mainResidenceExemption);

  // CGT discount eligibility
  let discountFactor = 1.0; // No discount by default
  let discountExplanation = "";
  let cgtDiscountApplied = false;

  if (isAustralianTaxResident && holdPeriodYears >= 1) {
    discountFactor = 0.5; // 50% discount
    cgtDiscountApplied = true;
    discountExplanation = "50% CGT discount applies (Australian tax resident, held >12 months)";
  } else if (!isAustralianTaxResident && assetAcquisitionDate) {
    const acquisitionDate = new Date(assetAcquisitionDate);
    const cutoffDate = new Date("2012-05-08");
    if (acquisitionDate < cutoffDate && holdPeriodYears >= 1) {
      discountFactor = 0.5; // Legacy discount for pre-2012 assets
      cgtDiscountApplied = true;
      discountExplanation =
        "50% CGT discount applies (legacy rule: asset acquired before May 8, 2012, held >12 months)";
    } else if (holdPeriodYears < 1) {
      discountExplanation =
        "No CGT discount (foreign tax resident, held <12 months, asset acquired after May 8, 2012)";
    } else {
      discountExplanation =
        "No CGT discount (foreign tax resident, asset acquired after May 8, 2012)";
    }
  } else if (!isAustralianTaxResident) {
    if (holdPeriodYears < 1) {
      discountExplanation = "No CGT discount (foreign tax resident, held <12 months)";
    } else {
      discountExplanation = "No CGT discount (foreign tax resident)";
    }
  } else if (isAustralianTaxResident && holdPeriodYears < 1) {
    discountExplanation = "No CGT discount (held <12 months, discount requires 12+ months)";
  }

  // Calculate CGT amount (only on taxable portion, after exemptions)
  const cgtAmount = taxableCapitalGain * discountFactor * (marginalTaxRate / 100);

  // Withholding tax only applies to foreign residents selling property >= $750k
  const withholdingTaxApplies = !isAustralianTaxResident && salePrice >= 750000;
  const withholdingTax = withholdingTaxApplies ? salePrice * cgtWithholdingRate : 0;

  let withholdingTaxExplanation = "";
  if (withholdingTaxApplies) {
    withholdingTaxExplanation = `Withholding tax applies (foreign tax resident, sale price ≥ $750,000). ${(cgtWithholdingRate * 100).toFixed(1)}% of sale price will be withheld by the buyer.`;
  } else if (!isAustralianTaxResident && salePrice < 750000) {
    withholdingTaxExplanation = "Withholding tax does not apply (sale price < $750,000)";
  } else if (isAustralianTaxResident) {
    withholdingTaxExplanation = "Withholding tax does not apply (Australian tax resident)";
  }

  // Net proceeds
  const netProceedsAfterTax = salePrice - sellingCosts - cgtAmount;

  return {
    salePrice,
    originalPurchasePrice,
    purchaseCosts,
    improvementCosts: 0, // Can be added later
    sellingCosts,
    costBase,
    capitalGain,
    mainResidenceExemption,
    taxableCapitalGain,
    cgtRate: marginalTaxRate * discountFactor,
    cgtAmount,
    withholdingTax,
    netProceedsAfterTax,
    assumptions: {
      taxResidency: isAustralianTaxResident ? "australian" : "foreign",
      propertyUsage: propertyUsage || "rental",
      mainResidenceExemptionApplied,
      exemptionAmount: mainResidenceExemption,
      exemptionExplanation,
      cgtDiscountApplied,
      discountFactor,
      discountExplanation,
      withholdingTaxApplies,
      withholdingTaxExplanation,
      marginalTaxRate,
      holdPeriodYears,
    },
  };
}

/**
 * Calculate after-tax cash flow
 */
export function calculateAfterTaxCashFlow(netCashFlow: number, taxBenefit: number): number {
  // If positive cash flow, tax reduces it
  // If negative cash flow, tax benefit improves it
  return netCashFlow + taxBenefit;
}

/**
 * Estimate depreciation deductions
 * Note: This is a simplified estimate. Actual depreciation requires a quantity surveyor report
 * Depreciation is only available for income-producing properties
 */
export function estimateDepreciation(
  propertyValue: number,
  propertyType: PropertyType,
  buildingAge: number = 0,
  isIncomeProducing: boolean = true,
  builtAfter1987: boolean = true,
  purchasePrice?: number
): number {
  // Depreciation is ONLY available for income-producing properties
  if (!isIncomeProducing) {
    return 0;
  }

  // Vacant land has no building structure
  if (propertyType === "vacantLand") {
    return 0;
  }

  // Use purchase price if available, otherwise use current property value
  const costBasis = purchasePrice || propertyValue;
  const buildingValue = costBasis * 0.7;
  const plantValue = costBasis * 0.1;

  let total = 0;

  // Capital Works (Division 43): 2.5% per year for 40 years
  // Only available for properties built after September 15, 1987
  if (
    (propertyType === "newDwelling" ||
      propertyType === "established" ||
      propertyType === "commercial") &&
    builtAfter1987 &&
    buildingAge < 40
  ) {
    total += buildingValue * 0.025;
  }

  // Plant & equipment: 20% diminishing value (only for new dwellings)
  if (propertyType === "newDwelling" && buildingAge < 5) {
    total += plantValue * 0.2 * Math.max(0, 1 - buildingAge * 0.2);
  }

  return total;
}

/**
 * Calculate effective tax rate considering deductions
 */
export function calculateEffectiveTaxRate(
  grossIncome: number,
  deductions: number,
  marginalTaxRate: number
): number {
  if (grossIncome === 0) return 0;

  const taxableIncome = Math.max(0, grossIncome - deductions);
  const taxPaid = taxableIncome * (marginalTaxRate / 100);

  return (taxPaid / grossIncome) * 100;
}
