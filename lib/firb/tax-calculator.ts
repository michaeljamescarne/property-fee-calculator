/**
 * Tax Calculator
 * Calculates tax deductions, negative gearing benefits, and CGT
 */

import { PropertyType } from './constants';

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
  cgtRate: number;
  cgtAmount: number;
  withholdingTax: number;
  netProceedsAfterTax: number;
}

/**
 * Calculate annual tax deductions for investment property
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
  buildingAge: number = 0 // Years since construction
): TaxDeductions {
  // Calculate depreciation (if applicable)
  let depreciation = 0;
  
  // Building depreciation: 2.5% per year for 40 years (if built after 1985)
  // Plant & equipment: Various rates (average ~20%)
  if (propertyType === 'newDwelling') {
    const buildingValue = propertyValue * 0.7; // Approx 70% building, 30% land
    const plantValue = propertyValue * 0.1; // Approx 10% fixtures
    
    // Building: 2.5% for up to 40 years
    if (buildingAge < 40) {
      depreciation += buildingValue * 0.025;
    }
    
    // Plant & equipment: 20% diminishing for 5 years
    if (buildingAge < 5) {
      depreciation += plantValue * 0.20 * (1 - buildingAge * 0.2);
    }
  }
  
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
 * Note: Foreign residents do NOT get the 50% CGT discount
 */
export function calculateCGT(
  salePrice: number,
  originalPurchasePrice: number,
  purchaseCosts: number, // Stamp duty, legal, FIRB fees, etc.
  sellingCosts: number, // Agent, legal, marketing
  isForeignResident: boolean = true,
  marginalTaxRate: number = 37 // Foreign resident rate
): CGTCalculation {
  // Cost base = Purchase price + purchase costs + improvements + selling costs
  const costBase = originalPurchasePrice + purchaseCosts + sellingCosts;
  
  // Capital gain
  const capitalGain = Math.max(0, salePrice - costBase);
  
  // CGT calculation
  // Foreign residents: No 50% discount (full marginal rate)
  // Australian residents: 50% discount if held > 12 months
  const discountFactor = isForeignResident ? 1.0 : 0.5;
  const cgtAmount = capitalGain * discountFactor * (marginalTaxRate / 100);
  
  // Withholding tax (12.5% for properties > $750k, 10% for < $750k)
  const withholdingRate = salePrice >= 750000 ? 0.125 : 0.10;
  const withholdingTax = salePrice * withholdingRate;
  
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
    cgtRate: marginalTaxRate * discountFactor,
    cgtAmount,
    withholdingTax,
    netProceedsAfterTax,
  };
}

/**
 * Calculate after-tax cash flow
 */
export function calculateAfterTaxCashFlow(
  netCashFlow: number,
  taxBenefit: number
): number {
  // If positive cash flow, tax reduces it
  // If negative cash flow, tax benefit improves it
  return netCashFlow + taxBenefit;
}

/**
 * Estimate depreciation deductions
 * Note: This is a simplified estimate. Actual depreciation requires a quantity surveyor report
 */
export function estimateDepreciation(
  propertyValue: number,
  propertyType: PropertyType,
  buildingAge: number = 0
): number {
  if (propertyType !== 'newDwelling' || buildingAge > 40) {
    return 0;
  }
  
  const buildingValue = propertyValue * 0.7;
  const plantValue = propertyValue * 0.1;
  
  let total = 0;
  
  // Building: 2.5% per year (40-year write-off)
  if (buildingAge < 40) {
    total += buildingValue * 0.025;
  }
  
  // Plant & equipment: 20% diminishing value
  if (buildingAge < 5) {
    total += plantValue * 0.20 * Math.max(0, 1 - buildingAge * 0.2);
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














