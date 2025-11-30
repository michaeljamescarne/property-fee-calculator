/**
 * FIRB Calculator Constants
 * All fees, rates, and thresholds for FIRB calculations
 * Based on Australian government regulations
 */

// Citizenship Status Types
export type CitizenshipStatus = "australian" | "permanent" | "temporary" | "foreign";
export type PropertyType = "newDwelling" | "established" | "vacantLand" | "commercial";
export type AustralianState = "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "ACT" | "NT";
export type EntityType = "individual" | "company" | "trust";

// FIRB Application Fee Tiers (2025/26) - Updated from ATO Official Source
// Source: Australian Taxation Office - Foreign Investment Fees (1 July 2025 – 30 June 2026)
// Last Verified: October 16, 2025
export const FIRB_FEE_TIERS_NEW_DWELLINGS = [
  { max: 75000, fee: 4500 },
  { max: 1000000, fee: 15100 },
  { max: 2000000, fee: 30300 },
  { max: 3000000, fee: 60600 },
  { max: 4000000, fee: 90900 },
  { max: 5000000, fee: 121200 },
  { max: 6000000, fee: 151500 },
  { max: 7000000, fee: 181800 },
  { max: 8000000, fee: 212100 },
  { max: 9000000, fee: 242400 },
  { max: 10000000, fee: 272700 },
  { max: Infinity, fee: 1205200 }, // For properties over $40M
];

export const FIRB_FEE_TIERS_ESTABLISHED_DWELLINGS = [
  { max: 75000, fee: 13500 },
  { max: 1000000, fee: 45300 },
  { max: 2000000, fee: 90900 },
  { max: 3000000, fee: 181800 },
  { max: 4000000, fee: 272700 },
  { max: 5000000, fee: 363600 },
  { max: 6000000, fee: 454500 },
  { max: 7000000, fee: 545400 },
  { max: 8000000, fee: 636300 },
  { max: 9000000, fee: 727200 },
  { max: 10000000, fee: 818100 },
  { max: Infinity, fee: 3357300 }, // For properties over $40M
];

// Legacy fee tiers (kept for reference and gradual migration)
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
  { max: Infinity, fee: 0 }, // Above $10M: $13,200 per additional million
];

// Calculate FIRB fee based on property value and type (2025/26 rates)
export function calculateFIRBFee(
  propertyValue: number,
  propertyType: PropertyType = "newDwelling"
): number {
  // Use appropriate fee tier based on property type
  const feeTiers =
    propertyType === "established"
      ? FIRB_FEE_TIERS_ESTABLISHED_DWELLINGS
      : FIRB_FEE_TIERS_NEW_DWELLINGS;

  // Find the applicable tier
  const tier = feeTiers.find((t) => propertyValue <= t.max);
  return tier?.fee || 0;
}

// Legacy function (kept for backward compatibility)
export function calculateFIRBFeeLegacy(propertyValue: number): number {
  if (propertyValue <= 10000000) {
    const tier = FIRB_FEE_TIERS.find((t) => propertyValue <= t.max);
    return tier?.fee || 0;
  }
  // For properties over $10M: $132,000 + $13,200 per additional million
  const baseFee = 132000;
  const additionalMillions = Math.ceil((propertyValue - 10000000) / 1000000);
  return baseFee + additionalMillions * 13200;
}

// Expedited FIRB Processing Fee (additional cost for 10-day processing)
export const FIRB_EXPEDITED_FEE_MULTIPLIER = 2; // Double the standard fee

// Foreign Buyer Surcharge Rates by State (as percentage)
export const FOREIGN_SURCHARGE_RATES: Record<AustralianState, number> = {
  NSW: 8.0, // 8% surcharge
  VIC: 8.0, // 8% surcharge
  QLD: 7.0, // 7% surcharge
  SA: 7.0, // 7% surcharge
  WA: 7.0, // 7% surcharge
  TAS: 8.0, // 8% surcharge
  ACT: 4.0, // 4% surcharge (verified October 2025)
  NT: 0.0, // No foreign buyer surcharge
};

// Stamp Duty Rates by State (2025 Verified Rates)
// Last Verified: October 16, 2025
// Sources: Official state revenue office websites
export const STAMP_DUTY_RATES: Record<
  AustralianState,
  { thresholds: { min: number; max: number; rate: number; base: number }[] }
> = {
  NSW: {
    thresholds: [
      { min: 0, max: 17000, rate: 1.25, base: 0 }, // Up to $17,000
      { min: 17000, max: 36000, rate: 1.5, base: 212 }, // $17,001-$36,000
      { min: 36000, max: 97000, rate: 1.75, base: 497 }, // $36,001-$97,000
      { min: 97000, max: 364000, rate: 3.5, base: 1564 }, // $97,001-$364,000
      { min: 364000, max: 1212000, rate: 4.5, base: 10909 }, // $364,001-$1,212,000
      { min: 1212000, max: Infinity, rate: 5.5, base: 49069 }, // Over $1,212,000
    ],
  },
  VIC: {
    thresholds: [
      { min: 0, max: 25000, rate: 1.4, base: 0 }, // $0-$25,000
      { min: 25000, max: 130000, rate: 2.4, base: 350 }, // $25,001-$130,000
      { min: 130000, max: 960000, rate: 6.0, base: 2870 }, // $130,001-$960,000
      { min: 0, max: 2000000, rate: 5.5, base: 0 }, // $960,001-$2,000,000 (flat rate on total value)
      { min: 2000000, max: Infinity, rate: 6.5, base: 110000 }, // Over $2,000,000
    ],
  },
  QLD: {
    thresholds: [
      { min: 0, max: 5000, rate: 0, base: 0 }, // $0-$5,000
      { min: 5000, max: 75000, rate: 1.5, base: 0 }, // $5,001-$75,000
      { min: 75000, max: 540000, rate: 3.5, base: 1050 }, // $75,001-$540,000
      { min: 540000, max: 1000000, rate: 4.5, base: 17325 }, // $540,001-$1,000,000
      { min: 1000000, max: Infinity, rate: 5.75, base: 38025 }, // Over $1,000,000
    ],
  },
  SA: {
    thresholds: [
      { min: 0, max: 12000, rate: 1.0, base: 0 }, // Up to $12,000
      { min: 12000, max: 30000, rate: 2.0, base: 120 }, // $12,001-$30,000
      { min: 30000, max: 50000, rate: 3.0, base: 480 }, // $30,001-$50,000
      { min: 50000, max: 100000, rate: 3.5, base: 1080 }, // $50,001-$100,000
      { min: 100000, max: 200000, rate: 4.0, base: 2830 }, // $100,001-$200,000
      { min: 200000, max: 250000, rate: 4.25, base: 6830 }, // $200,001-$250,000
      { min: 250000, max: 300000, rate: 4.75, base: 8955 }, // $250,001-$300,000
      { min: 300000, max: Infinity, rate: 5.0, base: 11330 }, // Over $300,000
    ],
  },
  WA: {
    thresholds: [
      { min: 0, max: 120000, rate: 1.9, base: 0 }, // $0-$120,000
      { min: 120000, max: 150000, rate: 2.85, base: 2280 }, // $120,001-$150,000
      { min: 150000, max: 360000, rate: 3.8, base: 3135 }, // $150,001-$360,000
      { min: 360000, max: 725000, rate: 4.75, base: 11115 }, // $360,001-$725,000
      { min: 725000, max: Infinity, rate: 5.15, base: 28453 }, // Over $725,000
    ],
  },
  TAS: {
    thresholds: [
      { min: 0, max: 3000, rate: 0, base: 50 }, // $0-$3,000
      { min: 3000, max: 25000, rate: 1.75, base: 50 }, // $3,001-$25,000
      { min: 25000, max: 75000, rate: 2.25, base: 435 }, // $25,001-$75,000
      { min: 75000, max: 200000, rate: 3.5, base: 1560 }, // $75,001-$200,000
      { min: 200000, max: 375000, rate: 4.0, base: 5935 }, // $200,001-$375,000
      { min: 375000, max: 725000, rate: 4.25, base: 12935 }, // $375,001-$725,000
      { min: 725000, max: Infinity, rate: 4.5, base: 27810 }, // Over $725,000
    ],
  },
  ACT: {
    thresholds: [
      { min: 0, max: 200000, rate: 0, base: 20 }, // $0-$200,000
      { min: 200000, max: 300000, rate: 2.2, base: 2400 }, // $200,001-$300,000
      { min: 300000, max: 500000, rate: 3.4, base: 4600 }, // $300,001-$500,000
      { min: 500000, max: 750000, rate: 4.32, base: 11400 }, // $500,001-$750,000
      { min: 750000, max: 1000000, rate: 5.9, base: 22200 }, // $750,001-$1,000,000
      { min: 1000000, max: Infinity, rate: 6.4, base: 36950 }, // Over $1,000,000
    ],
  },
  NT: {
    thresholds: [
      { min: 0, max: 525000, rate: 0, base: 0 }, // $0-$525,000
      { min: 0, max: 3000000, rate: 4.95, base: 0 }, // $525,001-$3,000,000 (approximated as flat rate)
      { min: 3000000, max: 5000000, rate: 5.75, base: 122513 }, // $3,000,001-$5,000,000
      { min: 5000000, max: Infinity, rate: 5.95, base: 237513 }, // Over $5,000,000
    ],
  },
};

// Calculate stamp duty for a property
export function calculateStampDuty(
  propertyValue: number,
  state: AustralianState,
  isFirstHome: boolean = false
): number {
  const stateDuty = STAMP_DUTY_RATES[state];

  // Find the applicable threshold
  const threshold = stateDuty.thresholds.find((t) => propertyValue <= t.max);
  if (!threshold) return 0;

  const amountOverMin = Math.max(0, propertyValue - threshold.min);
  const dutyAmount = threshold.base + amountOverMin * (threshold.rate / 100);

  // First home buyer concessions (simplified - varies by state)
  if (isFirstHome && propertyValue <= 600000) {
    // Most states offer concessions for first home buyers under $600k
    return Math.max(0, dutyAmount * 0.5); // 50% reduction (simplified)
  }

  return dutyAmount;
}

// Land Tax Thresholds and Rates by State (annual ongoing cost)
// Land Tax Rates (2025 Verified)
// Source: Official state revenue offices, last verified October 16, 2025
// Note: Rates are progressive and vary by land value - these are base rates
export const LAND_TAX_RATES: Record<
  AustralianState,
  { threshold: number; rate: number; isForeignRate?: number }
> = {
  NSW: {
    threshold: 1075000, // $1,075,000 threshold confirmed
    rate: 1.6, // Base rate confirmed
    isForeignRate: 5.0, // Increased from 4% to 5% effective January 1, 2025
  },
  VIC: {
    threshold: 300000, // $300,000 threshold confirmed
    rate: 0.2, // Base rate confirmed (progressive up to 2.55%)
    isForeignRate: 2.0, // Absentee owner surcharge confirmed
  },
  QLD: {
    threshold: 600000, // $600,000 threshold confirmed
    rate: 1.7, // Base rate confirmed (progressive up to 2.75%)
    isForeignRate: 2.0, // Foreign owner surcharge confirmed
  },
  SA: {
    threshold: 482000, // Updated from $450,000 to $482,000
    rate: 0.5, // Base rate confirmed (progressive up to 2.4%)
    isForeignRate: 0.5, // No specific foreign surcharge in SA
  },
  WA: {
    threshold: 300000, // $300,000 threshold confirmed
    rate: 0.4, // Base rate confirmed (progressive up to 2.67%)
    isForeignRate: 0.4, // No specific foreign surcharge in WA
  },
  TAS: {
    threshold: 50000, // Updated from $25,000 to $50,000
    rate: 0.55, // Base rate confirmed (progressive up to 1.5%)
    isForeignRate: 1.5, // Foreign owner surcharge confirmed
  },
  ACT: {
    threshold: 0,
    rate: 0,
    isForeignRate: 0,
  }, // ACT uses different system - applies to all investment properties
  NT: {
    threshold: 0,
    rate: 0,
    isForeignRate: 0,
  }, // NT has no land tax as of 2025
};

// Calculate annual land tax
// Note: This is a simplified calculation using base rates. Many states use progressive tiers
// where the rate increases with land value. This function uses a flat rate above the threshold,
// which may underestimate tax for high-value properties. For accurate calculations, consider
// implementing full progressive tier structures per state.
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
  { value: "485", label: "Temporary Graduate (485)" },
  { value: "457", label: "Temporary Work Skilled (457/482)" },
  { value: "500", label: "Student Visa (500)" },
  { value: "820", label: "Partner Visa (820)" },
  { value: "489", label: "Skilled Regional (489)" },
  { value: "other", label: "Other Temporary Visa" },
];

// Property Eligibility Rules
export const PROPERTY_ELIGIBILITY = {
  australian: {
    canBuy: ["newDwelling", "established", "vacantLand", "commercial"],
    requiresFIRB: false,
    restrictions: [],
  },
  permanent: {
    canBuy: ["newDwelling", "established", "vacantLand", "commercial"],
    requiresFIRB: false,
    restrictions: [],
  },
  temporary: {
    canBuy: ["newDwelling"],
    requiresFIRB: true,
    restrictions: [],
  },
  foreign: {
    canBuy: ["newDwelling", "vacantLand"],
    requiresFIRB: true,
    restrictions: [],
  },
};

// FIRB Processing Times
export const FIRB_PROCESSING_TIMES = {
  standard: "30 days",
  expedited: "10 days",
  complex: "90+ days",
};

// Annual Vacancy Fee (for foreign owners)
export const ANNUAL_VACANCY_FEE_RATE = 0; // Varies by state and property value

// Temporary Ban on Established Dwellings (April 1, 2025 - March 31, 2027)
// Source: FIRB Residential Land Guidance Note (Version 6, March 14, 2025)
// Last Verified: October 16, 2025
export const TEMPORARY_BAN = {
  startDate: new Date("2025-04-01"),
  endDate: new Date("2027-03-31"),
  affectedPropertyTypes: ["established"] as PropertyType[],
  affectedCitizenshipStatuses: ["temporary", "foreign"] as CitizenshipStatus[],
  description:
    "Temporary ban on foreign persons (including temporary residents) purchasing established dwellings",
  exceptions: [
    "Redevelopment projects resulting in at least 20 additional dwellings",
    "Commercial-scale housing (retirement villages, aged care facilities, student accommodation)",
    "Existing build-to-rent developments",
    "Housing for workers from Pacific island countries and Timor-Leste under specific schemes",
  ],
};

/**
 * Check if the temporary ban on established dwellings is currently active
 */
export function isTemporaryBanActive(checkDate: Date = new Date()): boolean {
  return checkDate >= TEMPORARY_BAN.startDate && checkDate <= TEMPORARY_BAN.endDate;
}

/**
 * Check if a property purchase is affected by the temporary ban
 */
export function isAffectedByTemporaryBan(
  propertyType: PropertyType,
  citizenshipStatus: CitizenshipStatus,
  checkDate: Date = new Date()
): boolean {
  if (!isTemporaryBanActive(checkDate)) {
    return false;
  }

  const isAffectedProperty = TEMPORARY_BAN.affectedPropertyTypes.includes(propertyType);
  const isAffectedCitizenship =
    TEMPORARY_BAN.affectedCitizenshipStatuses.includes(citizenshipStatus);

  return isAffectedProperty && isAffectedCitizenship;
}

// Penalty Information (2025 Verified)
// Source: Foreign Acquisitions and Takeovers Act 1975, Treasury announcements
// Last Verified: October 16, 2025
// Note: Penalties doubled effective January 1, 2023

export const PENALTY_UNIT_VALUE_2025 = 222; // Current penalty unit value (as of July 1, 2025)

export const FIRB_PENALTIES = {
  // Civil Penalties (in penalty units)
  civil: {
    individuals: {
      maxPenaltyUnits: 30000, // Up to 30,000 penalty units
      maxAmount: 30000 * PENALTY_UNIT_VALUE_2025, // $6,660,000
      description: "Failure to advertise dwellings, unauthorized acquisitions",
    },
    corporations: {
      maxPenaltyUnits: 300000, // Up to 300,000 penalty units
      maxAmount: 300000 * PENALTY_UNIT_VALUE_2025, // $66,600,000
      description: "Failure to advertise dwellings, unauthorized acquisitions",
    },
  },

  // Criminal Penalties
  criminal: {
    maxImprisonment: 10, // Up to 10 years imprisonment
    description: "Serious breaches of foreign investment laws",
  },

  // Unauthorized Acquisition Penalties
  unauthorizedAcquisition: {
    calculation:
      "Greater of: double capital gain, 50% acquisition consideration, or 50% market value",
    description: "For foreign persons acquiring property without FIRB approval",
  },

  // Vacancy Fee Non-Compliance
  vacancyFeeNonCompliance: {
    maxPenalty: 500 * PENALTY_UNIT_VALUE_2025, // $111,000
    description: "Failure to comply with notice or vacancy fee return requirements",
  },

  // Forced Divestment
  forcedDivestment: {
    description: "Foreign persons may be forced to sell property, often at a loss",
    note: "No guarantee of recovering all costs",
  },
};

// Vacancy Fee Information (2025 Verified)
// Source: ATO Foreign Investment Guidelines
// Last Verified: October 16, 2025
export const VACANCY_FEE_INFO = {
  // Vacancy fees doubled as of April 9, 2024
  doubledAsOf: new Date("2024-04-09"),
  calculation: "Based on foreign investment application fee paid at acquisition",
  requirement:
    "Property must be occupied or genuinely available for rent for minimum 183 days per year",
  returnDeadline: "Within 30 days from end of each vacancy year",
  penaltyForLateReturn: "Imposition of vacancy fee itself",
};
