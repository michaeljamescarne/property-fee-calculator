/**
 * FIRB Calculator Constants
 * All fees, rates, and thresholds for FIRB calculations
 * Based on Australian government regulations
 */

// Citizenship Status Types
export type CitizenshipStatus = 'australian' | 'permanent' | 'temporary' | 'foreign';
export type PropertyType = 'newDwelling' | 'established' | 'vacantLand' | 'commercial';
export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'ACT' | 'NT';
export type EntityType = 'individual' | 'company' | 'trust';

// FIRB Application Fee Tiers (2024/25)
export const FIRB_FEE_TIERS = [
  { max: 1000000, fee: 13200 },
  { max: 2000000, fee: 26400 },
  { max: 3000000, fee: 39600 },
  { max: 4000000, fee: 52800 },
  { max: 5000000, fee: 66000 },
  { max: 6000000, fee: 79200 },
  { max: 7000000, fee: 92400 },
  { max: 8000000, fee: 105600 },
  { max: 9000000, fee: 118800 },
  { max: 10000000, fee: 132000 },
  { max: Infinity, fee: 0 } // Above $10M: $13,200 per additional million
];

// Calculate FIRB fee for properties over $10M
export function calculateFIRBFee(propertyValue: number): number {
  if (propertyValue <= 10000000) {
    const tier = FIRB_FEE_TIERS.find(t => propertyValue <= t.max);
    return tier?.fee || 0;
  }
  // For properties over $10M: $132,000 + $13,200 per additional million
  const baseFee = 132000;
  const additionalMillions = Math.ceil((propertyValue - 10000000) / 1000000);
  return baseFee + (additionalMillions * 13200);
}

// Expedited FIRB Processing Fee (additional cost for 10-day processing)
export const FIRB_EXPEDITED_FEE_MULTIPLIER = 2; // Double the standard fee

// Foreign Buyer Surcharge Rates by State (as percentage)
export const FOREIGN_SURCHARGE_RATES: Record<AustralianState, number> = {
  NSW: 8.0,  // 8% surcharge
  VIC: 8.0,  // 8% surcharge
  QLD: 7.0,  // 7% surcharge
  SA: 7.0,   // 7% surcharge
  WA: 7.0,   // 7% surcharge
  TAS: 8.0,  // 8% surcharge
  ACT: 0.0,  // No foreign buyer surcharge
  NT: 0.0    // No foreign buyer surcharge
};

// Stamp Duty Rates by State (simplified - actual calculations are complex)
// These are approximate rates for residential property
export const STAMP_DUTY_RATES: Record<AustralianState, { thresholds: { max: number; rate: number; base: number }[] }> = {
  NSW: {
    thresholds: [
      { max: 16000, rate: 1.25, base: 0 },
      { max: 35000, rate: 1.5, base: 200 },
      { max: 93000, rate: 1.75, base: 485 },
      { max: 351000, rate: 3.5, base: 1500 },
      { max: 1088000, rate: 4.5, base: 10530 },
      { max: Infinity, rate: 5.5, base: 43665 }
    ]
  },
  VIC: {
    thresholds: [
      { max: 25000, rate: 1.4, base: 0 },
      { max: 130000, rate: 2.4, base: 350 },
      { max: 960000, rate: 6.0, base: 2870 },
      { max: Infinity, rate: 5.5, base: 52670 }
    ]
  },
  QLD: {
    thresholds: [
      { max: 5000, rate: 0, base: 0 },
      { max: 75000, rate: 1.5, base: 0 },
      { max: 540000, rate: 3.5, base: 1050 },
      { max: 1000000, rate: 4.5, base: 17325 },
      { max: Infinity, rate: 5.75, base: 38025 }
    ]
  },
  SA: {
    thresholds: [
      { max: 12000, rate: 1.0, base: 0 },
      { max: 30000, rate: 2.0, base: 120 },
      { max: 50000, rate: 3.0, base: 480 },
      { max: 100000, rate: 3.5, base: 1080 },
      { max: 200000, rate: 4.0, base: 2830 },
      { max: 250000, rate: 4.25, base: 6830 },
      { max: 300000, rate: 4.75, base: 8955 },
      { max: 500000, rate: 5.0, base: 11330 },
      { max: Infinity, rate: 5.5, base: 21330 }
    ]
  },
  WA: {
    thresholds: [
      { max: 120000, rate: 1.9, base: 0 },
      { max: 150000, rate: 2.85, base: 2280 },
      { max: 360000, rate: 3.8, base: 3135 },
      { max: 725000, rate: 4.75, base: 11115 },
      { max: Infinity, rate: 5.15, base: 28453 }
    ]
  },
  TAS: {
    thresholds: [
      { max: 3000, rate: 1.75, base: 0 },
      { max: 25000, rate: 2.25, base: 52.50 },
      { max: 75000, rate: 3.5, base: 547.50 },
      { max: 200000, rate: 4.0, base: 2297.50 },
      { max: 375000, rate: 4.25, base: 7297.50 },
      { max: 725000, rate: 4.5, base: 14734.75 },
      { max: Infinity, rate: 4.5, base: 30484.75 }
    ]
  },
  ACT: {
    thresholds: [
      { max: 200000, rate: 0, base: 0 }, // First $200k exempt
      { max: 300000, rate: 2.2, base: 0 },
      { max: 500000, rate: 3.4, base: 2200 },
      { max: 750000, rate: 4.32, base: 9000 },
      { max: 1000000, rate: 5.9, base: 19800 },
      { max: 1455000, rate: 6.4, base: 34550 },
      { max: Infinity, rate: 4.54, base: 63670 }
    ]
  },
  NT: {
    thresholds: [
      { max: 525000, rate: 0, base: 0 }, // Up to $525k: no duty
      { max: 3000000, rate: 4.95, base: 0 },
      { max: 5000000, rate: 5.75, base: 122513 },
      { max: Infinity, rate: 5.95, base: 237513 }
    ]
  }
};

// Calculate stamp duty for a property
export function calculateStampDuty(propertyValue: number, state: AustralianState, isFirstHome: boolean = false): number {
  const stateDuty = STAMP_DUTY_RATES[state];
  
  // Find the applicable threshold
  const threshold = stateDuty.thresholds.find(t => propertyValue <= t.max);
  if (!threshold) return 0;
  
  // Calculate duty
  const dutyAmount = threshold.base + ((propertyValue - (threshold.max === Infinity ? 0 : 0)) * (threshold.rate / 100));
  
  // First home buyer concessions (simplified - varies by state)
  if (isFirstHome && propertyValue <= 600000) {
    // Most states offer concessions for first home buyers under $600k
    return Math.max(0, dutyAmount * 0.5); // 50% reduction (simplified)
  }
  
  return dutyAmount;
}

// Land Tax Thresholds and Rates by State (annual ongoing cost)
export const LAND_TAX_RATES: Record<AustralianState, { threshold: number; rate: number; isForeignRate?: number }> = {
  NSW: { threshold: 1075000, rate: 1.6, isForeignRate: 2.0 },
  VIC: { threshold: 300000, rate: 0.2, isForeignRate: 2.0 },
  QLD: { threshold: 600000, rate: 1.7, isForeignRate: 2.0 },
  SA: { threshold: 450000, rate: 0.5, isForeignRate: 0.5 },
  WA: { threshold: 300000, rate: 0.4, isForeignRate: 0.4 },
  TAS: { threshold: 25000, rate: 0.55, isForeignRate: 1.5 },
  ACT: { threshold: 0, rate: 0, isForeignRate: 0 }, // ACT uses different system
  NT: { threshold: 0, rate: 0, isForeignRate: 0 }  // NT has no land tax
};

// Calculate annual land tax
export function calculateLandTax(
  landValue: number,
  state: AustralianState,
  isForeignOwner: boolean = false
): number {
  const taxConfig = LAND_TAX_RATES[state];
  
  if (landValue <= taxConfig.threshold) {
    return 0; // Below threshold
  }
  
  const taxableValue = landValue - taxConfig.threshold;
  const rate = isForeignOwner && taxConfig.isForeignRate ? taxConfig.isForeignRate : taxConfig.rate;
  
  return (taxableValue * rate) / 100;
}

// Common Visa Types for Temporary Residents
export const TEMPORARY_VISA_TYPES = [
  { value: '485', label: 'Temporary Graduate (485)' },
  { value: '457', label: 'Temporary Work Skilled (457/482)' },
  { value: '500', label: 'Student Visa (500)' },
  { value: '820', label: 'Partner Visa (820)' },
  { value: '489', label: 'Skilled Regional (489)' },
  { value: 'other', label: 'Other Temporary Visa' }
];

// Property Eligibility Rules
export const PROPERTY_ELIGIBILITY = {
  australian: {
    canBuy: ['newDwelling', 'established', 'vacantLand', 'commercial'],
    requiresFIRB: false,
    restrictions: []
  },
  permanent: {
    canBuy: ['newDwelling', 'established', 'vacantLand', 'commercial'],
    requiresFIRB: false,
    restrictions: []
  },
  temporary: {
    canBuy: ['newDwelling'],
    requiresFIRB: true,
    restrictions: []
  },
  foreign: {
    canBuy: ['newDwelling', 'vacantLand'],
    requiresFIRB: true,
    restrictions: []
  }
};

// FIRB Processing Times
export const FIRB_PROCESSING_TIMES = {
  standard: '30 days',
  expedited: '10 days',
  complex: '90+ days'
};

// Annual Vacancy Fee (for foreign owners)
export const ANNUAL_VACANCY_FEE_RATE = 0; // Varies by state and property value

