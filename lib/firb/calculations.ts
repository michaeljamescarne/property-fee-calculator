/**
 * FIRB Cost Calculations
 * Calculates all fees, duties, and costs for property purchases
 * Ported from calculations (1).js
 */

import {
  CitizenshipStatus,
  PropertyType,
  AustralianState,
  EntityType,
  calculateFIRBFee,
  calculateStampDuty,
  calculateLandTax,
  FOREIGN_SURCHARGE_RATES,
  FIRB_EXPEDITED_FEE_MULTIPLIER
} from './constants';

export interface CostBreakdown {
  upfrontCosts: {
    propertyPrice: number;
    firbFee: number;
    stampDuty: number;
    foreignSurcharge: number;
    legalFees: number;
    inspectionFees: number;
    loanCosts: number;
    total: number;
  };
  ongoingCosts: {
    annualLandTax: number;
    councilRates: number;
    insurance: number;
    maintenance: number;
    vacancyFee: number;
    total: number;
  };
  totalInvestmentCost: number;
  breakdown: {
    category: string;
    items: { name: string; amount: number; description?: string }[];
  }[];
}

export interface CalculationInput {
  citizenshipStatus: CitizenshipStatus;
  propertyType: PropertyType;
  propertyValue: number;
  state: AustralianState;
  isFirstHome: boolean;
  depositPercent: number;
  entityType: EntityType;
  isOrdinarilyResident?: boolean;
  expeditedFIRB?: boolean;
}

/**
 * Calculate FIRB application fees
 */
export function calculateFIRBFees(
  propertyValue: number,
  citizenshipStatus: CitizenshipStatus,
  isOrdinarilyResident?: boolean,
  expedited: boolean = false
): number {
  // Check if FIRB is required
  const requiresFIRB = 
    citizenshipStatus === 'temporary' || 
    citizenshipStatus === 'foreign' ||
    (citizenshipStatus === 'australian' && isOrdinarilyResident === false);

  if (!requiresFIRB) {
    return 0;
  }

  const baseFee = calculateFIRBFee(propertyValue);
  return expedited ? baseFee * FIRB_EXPEDITED_FEE_MULTIPLIER : baseFee;
}

/**
 * Calculate state stamp duty
 */
export function calculateStateDuties(
  propertyValue: number,
  state: AustralianState,
  isFirstHome: boolean
): number {
  return calculateStampDuty(propertyValue, state, isFirstHome);
}

/**
 * Calculate foreign buyer surcharge
 */
export function calculateForeignSurcharge(
  propertyValue: number,
  state: AustralianState,
  citizenshipStatus: CitizenshipStatus,
  isOrdinarilyResident?: boolean
): number {
  // Foreign surcharge applies to temporary residents and foreign persons
  const isForeignBuyer = 
    citizenshipStatus === 'temporary' ||
    citizenshipStatus === 'foreign' ||
    (citizenshipStatus === 'australian' && isOrdinarilyResident === false);

  if (!isForeignBuyer) {
    return 0;
  }

  const surchargeRate = FOREIGN_SURCHARGE_RATES[state];
  return (propertyValue * surchargeRate) / 100;
}

/**
 * Calculate annual land tax
 */
export function calculateAnnualLandTax(
  landValue: number,
  state: AustralianState,
  citizenshipStatus: CitizenshipStatus,
  isOrdinarilyResident?: boolean
): number {
  const isForeignOwner = 
    citizenshipStatus === 'foreign' ||
    (citizenshipStatus === 'australian' && isOrdinarilyResident === false);

  return calculateLandTax(landValue, state, isForeignOwner);
}

/**
 * Estimate legal and conveyancing fees
 */
export function estimateLegalFees(propertyValue: number, state: AustralianState): number {
  // Typical legal fees range from $1,500 to $3,000+ depending on complexity
  const baseFee = 1500;
  const percentageFee = propertyValue * 0.001; // 0.1% of property value
  return Math.min(baseFee + percentageFee, 5000); // Cap at $5,000
}

/**
 * Estimate inspection fees
 */
export function estimateInspectionFees(propertyType: PropertyType): number {
  if (propertyType === 'newDwelling') {
    return 500; // Lower for new properties (may not need full inspection)
  } else if (propertyType === 'established') {
    return 800; // Building and pest inspection
  } else if (propertyType === 'vacantLand') {
    return 300; // Soil and environmental testing
  }
  return 500;
}

/**
 * Estimate loan establishment costs
 */
export function estimateLoanCosts(loanAmount: number): number {
  // Typical loan costs: application fee + valuation + mortgage insurance (if < 20% deposit)
  const applicationFee = 600;
  const valuationFee = 300;
  const lendersFees = loanAmount * 0.001; // 0.1% of loan amount
  
  return applicationFee + valuationFee + lendersFees;
}

/**
 * Estimate annual council rates
 */
export function estimateCouncilRates(propertyValue: number, state: AustralianState): number {
  // Council rates vary significantly by location, this is a rough estimate
  // Typically 0.2% - 0.5% of property value annually
  const ratePercentage = 0.003; // 0.3% average
  return propertyValue * ratePercentage;
}

/**
 * Estimate annual property insurance
 */
export function estimateInsurance(propertyValue: number, propertyType: PropertyType): number {
  if (propertyType === 'vacantLand') {
    return 200; // Minimal insurance for vacant land
  }
  
  // Typical building and contents insurance
  const baseInsurance = 1200;
  const valueComponent = propertyValue * 0.002; // 0.2% of value
  return Math.min(baseInsurance + valueComponent, 3000); // Cap at $3,000
}

/**
 * Estimate annual maintenance costs
 */
export function estimateMaintenance(propertyValue: number, propertyType: PropertyType): number {
  if (propertyType === 'vacantLand') {
    return 500; // Lawn mowing, maintenance
  }
  
  if (propertyType === 'newDwelling') {
    return propertyValue * 0.01; // 1% for new properties
  }
  
  return propertyValue * 0.015; // 1.5% for established properties
}

/**
 * Calculate annual vacancy fee (for foreign owners)
 */
export function calculateVacancyFee(
  propertyValue: number,
  citizenshipStatus: CitizenshipStatus
): number {
  // Vacancy fee only applies to foreign persons who don't occupy or rent the property
  // This is a simplified calculation - actual fees vary
  if (citizenshipStatus !== 'foreign') {
    return 0;
  }

  // Vacancy fee is typically a percentage of property value
  // This is indicative only - actual calculation is complex
  return 0; // Set to 0 by default as it's conditional on occupancy
}

/**
 * Calculate total upfront costs
 */
export function calculateTotalUpfrontCosts(input: CalculationInput): CostBreakdown['upfrontCosts'] {
  const {
    propertyValue,
    citizenshipStatus,
    state,
    isFirstHome,
    depositPercent,
    isOrdinarilyResident,
    expeditedFIRB,
    propertyType
  } = input;

  const loanAmount = propertyValue * (1 - depositPercent / 100);

  const firbFee = calculateFIRBFees(propertyValue, citizenshipStatus, isOrdinarilyResident, expeditedFIRB);
  const stampDuty = calculateStateDuties(propertyValue, state, isFirstHome);
  const foreignSurcharge = calculateForeignSurcharge(propertyValue, state, citizenshipStatus, isOrdinarilyResident);
  const legalFees = estimateLegalFees(propertyValue, state);
  const inspectionFees = estimateInspectionFees(propertyType);
  const loanCosts = depositPercent < 100 ? estimateLoanCosts(loanAmount) : 0;

  const total = firbFee + stampDuty + foreignSurcharge + legalFees + inspectionFees + loanCosts;

  return {
    propertyPrice: propertyValue,
    firbFee,
    stampDuty,
    foreignSurcharge,
    legalFees,
    inspectionFees,
    loanCosts,
    total
  };
}

/**
 * Calculate ongoing annual costs
 */
export function calculateOngoingCosts(input: CalculationInput): CostBreakdown['ongoingCosts'] {
  const {
    propertyValue,
    citizenshipStatus,
    state,
    propertyType,
    isOrdinarilyResident
  } = input;

  // Estimate land value as 30% of property value
  const landValue = propertyValue * 0.3;

  const annualLandTax = calculateAnnualLandTax(landValue, state, citizenshipStatus, isOrdinarilyResident);
  const councilRates = estimateCouncilRates(propertyValue, state);
  const insurance = estimateInsurance(propertyValue, propertyType);
  const maintenance = estimateMaintenance(propertyValue, propertyType);
  const vacancyFee = calculateVacancyFee(propertyValue, citizenshipStatus);

  const total = annualLandTax + councilRates + insurance + maintenance + vacancyFee;

  return {
    annualLandTax,
    councilRates,
    insurance,
    maintenance,
    vacancyFee,
    total
  };
}

/**
 * Calculate complete cost breakdown
 */
export function calculateCompleteCostBreakdown(input: CalculationInput): CostBreakdown {
  const upfrontCosts = calculateTotalUpfrontCosts(input);
  const ongoingCosts = calculateOngoingCosts(input);

  const totalInvestmentCost = upfrontCosts.propertyPrice + upfrontCosts.total;

  // Create detailed breakdown for display
  const breakdown = [
    {
      category: 'Purchase Price',
      items: [
        { 
          name: 'Property Purchase Price', 
          amount: upfrontCosts.propertyPrice,
          description: 'The agreed purchase price of the property'
        }
      ]
    },
    {
      category: 'Government Fees & Taxes',
      items: [
        ...(upfrontCosts.firbFee > 0 ? [{
          name: 'FIRB Application Fee',
          amount: upfrontCosts.firbFee,
          description: input.expeditedFIRB ? 'Expedited processing (10 days)' : 'Standard processing (30 days)'
        }] : []),
        {
          name: 'Stamp Duty',
          amount: upfrontCosts.stampDuty,
          description: `${input.state} stamp duty${input.isFirstHome ? ' (first home buyer concession applied)' : ''}`
        },
        ...(upfrontCosts.foreignSurcharge > 0 ? [{
          name: 'Foreign Buyer Surcharge',
          amount: upfrontCosts.foreignSurcharge,
          description: `${FOREIGN_SURCHARGE_RATES[input.state]}% surcharge in ${input.state}`
        }] : [])
      ]
    },
    {
      category: 'Professional Fees',
      items: [
        {
          name: 'Legal & Conveyancing',
          amount: upfrontCosts.legalFees,
          description: 'Solicitor or conveyancer fees'
        },
        {
          name: 'Inspection Fees',
          amount: upfrontCosts.inspectionFees,
          description: 'Building, pest, or land inspections'
        }
      ]
    },
    ...(upfrontCosts.loanCosts > 0 ? [{
      category: 'Loan Costs',
      items: [
        {
          name: 'Loan Establishment',
          amount: upfrontCosts.loanCosts,
          description: 'Application, valuation, and lender fees'
        }
      ]
    }] : []),
    {
      category: 'Annual Ongoing Costs',
      items: [
        ...(ongoingCosts.annualLandTax > 0 ? [{
          name: 'Land Tax',
          amount: ongoingCosts.annualLandTax,
          description: 'Annual state land tax'
        }] : []),
        {
          name: 'Council Rates',
          amount: ongoingCosts.councilRates,
          description: 'Annual local council rates'
        },
        {
          name: 'Insurance',
          amount: ongoingCosts.insurance,
          description: 'Building and contents insurance'
        },
        {
          name: 'Maintenance',
          amount: ongoingCosts.maintenance,
          description: 'Estimated annual maintenance and repairs'
        },
        ...(ongoingCosts.vacancyFee > 0 ? [{
          name: 'Vacancy Fee',
          amount: ongoingCosts.vacancyFee,
          description: 'Annual fee if property is vacant (foreign owners)'
        }] : [])
      ]
    }
  ];

  return {
    upfrontCosts,
    ongoingCosts,
    totalInvestmentCost,
    breakdown
  };
}

