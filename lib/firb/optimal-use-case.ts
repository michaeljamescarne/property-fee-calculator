/**
 * Optimal Use Case Analysis
 * Compares long-term rental vs short-stay accommodation for property investment
 */

import type { InvestmentInputs } from '@/types/investment';
import type { CostBreakdown } from './calculations';
import { AustralianState, PropertyType } from './constants';

export interface ShortStayRegulation {
  shortStayPermitted: boolean;
  maxDaysPerYear: number | null; // null if unlimited
  licensingRequired: boolean;
  licensingDescription: string | null;
  complianceCostAnnual: number;
  complianceCostOneTime: number;
  zoningRestrictions: string | null;
}

export interface UseCaseComparison {
  longTermRental: {
    annualIncome: number;
    annualExpenses: number;
    netIncome: number;
    managementComplexity: 'low' | 'medium' | 'high';
    regulatoryCompliance: 'low' | 'medium' | 'high';
    riskLevel: 'low' | 'medium' | 'high';
    description: string;
  };
  shortStay: {
    annualIncome: number;
    annualExpenses: number;
    netIncome: number;
    managementComplexity: 'low' | 'medium' | 'high';
    regulatoryCompliance: 'low' | 'medium' | 'high';
    riskLevel: 'low' | 'medium' | 'high';
    description: string;
    regulations: ShortStayRegulation | null;
  };
  recommendation: {
    optimalUse: 'longTerm' | 'shortStay' | 'mixed';
    incomeDifference: number;
    netDifference: number;
    reasoning: string[];
  };
}

/**
 * Calculate long-term rental income and expenses
 */
function calculateLongTermRental(
  investmentInputs: InvestmentInputs,
  propertyValue: number,
  costs: CostBreakdown
): UseCaseComparison['longTermRental'] {
  const annualRent = investmentInputs.estimatedWeeklyRent * 52;
  const effectiveRent = annualRent * (1 - investmentInputs.vacancyRate / 100);
  
  // Expenses
  const managementFee = investmentInputs.selfManaged 
    ? 0 
    : (effectiveRent * investmentInputs.propertyManagementFee) / 100;
  
  const annualExpenses = 
    (costs.ongoingCosts.councilRates || 0) +
    (costs.ongoingCosts.insurance || 0) +
    (costs.ongoingCosts.maintenance || 0) +
    (costs.ongoingCosts.annualLandTax || 0) +
    (costs.ongoingCosts.vacancyFee || 0) +
    (investmentInputs.annualStrataFees || 0) +
    managementFee;

  const netIncome = effectiveRent - annualExpenses;

  return {
    annualIncome: effectiveRent,
    annualExpenses,
    netIncome,
    managementComplexity: investmentInputs.selfManaged ? 'medium' : 'low',
    regulatoryCompliance: 'low',
    riskLevel: 'low',
    description: 'Long-term rental provides stable, predictable income with minimal regulatory requirements.'
  };
}

/**
 * Calculate short-stay income and expenses
 */
function calculateShortStay(
  investmentInputs: InvestmentInputs,
  propertyValue: number,
  costs: CostBreakdown,
  regulations: ShortStayRegulation | null,
  occupancyRate: number = 0.65 // Default 65% occupancy for short-stay
): UseCaseComparison['shortStay'] {
  // Estimate daily rate (typically 1.5-2x weekly rent / 7)
  const dailyRate = (investmentInputs.estimatedWeeklyRent / 7) * 1.75;
  
  // Calculate available days (consider regulations)
  const maxDays = regulations?.maxDaysPerYear || 365;
  const availableDays = Math.min(365, maxDays);
  const bookedDays = availableDays * occupancyRate;
  
  const annualIncome = dailyRate * bookedDays;
  
  // Short-stay specific expenses
  const platformFees = annualIncome * 0.15; // ~15% for Airbnb/Booking.com
  const cleaningCosts = bookedDays * 50; // $50 per booking (average)
  const managementFee = investmentInputs.selfManaged 
    ? 0 
    : (annualIncome * 0.20); // 20% for short-stay management
  
  // Compliance costs
  const complianceCosts = regulations 
    ? (regulations.complianceCostAnnual + (regulations.complianceCostOneTime / 10)) // Amortize one-time over 10 years
    : 0;
  
  const annualExpenses = 
    (costs.ongoingCosts.councilRates || 0) +
    ((costs.ongoingCosts.insurance || 0) * 1.2) + // 20% higher insurance for short-stay
    ((costs.ongoingCosts.maintenance || 0) * 1.5) + // 50% higher maintenance
    (costs.ongoingCosts.annualLandTax || 0) +
    (costs.ongoingCosts.vacancyFee || 0) +
    (investmentInputs.annualStrataFees || 0) +
    platformFees +
    cleaningCosts +
    managementFee +
    complianceCosts;

  const netIncome = annualIncome - annualExpenses;

  // Determine complexity and risk based on regulations
  let managementComplexity: 'low' | 'medium' | 'high' = 'medium';
  let regulatoryCompliance: 'low' | 'medium' | 'high' = 'medium';
  let riskLevel: 'low' | 'medium' | 'high' = 'medium';

  if (regulations) {
    if (!regulations.shortStayPermitted) {
      regulatoryCompliance = 'high';
      riskLevel = 'high';
    } else if (regulations.licensingRequired || regulations.maxDaysPerYear !== null) {
      regulatoryCompliance = 'high';
      riskLevel = 'medium';
    }
    
    if (regulations.licensingRequired) {
      managementComplexity = 'high';
    }
  }

  let description = 'Short-stay accommodation can provide higher income potential but requires more active management.';
  if (regulations && !regulations.shortStayPermitted) {
    description = 'Short-stay accommodation is not permitted in this area. Long-term rental is the only option.';
  } else if (regulations && regulations.maxDaysPerYear !== null) {
    description = `Short-stay is permitted for up to ${regulations.maxDaysPerYear} days per year. Additional compliance requirements apply.`;
  }

  return {
    annualIncome,
    annualExpenses,
    netIncome,
    managementComplexity,
    regulatoryCompliance,
    riskLevel,
    description,
    regulations
  };
}

/**
 * Compare long-term rental vs short-stay and determine optimal use case
 */
export function calculateOptimalUseCase(
  investmentInputs: InvestmentInputs,
  propertyValue: number,
  state: AustralianState,
  propertyType: PropertyType,
  costs: CostBreakdown,
  regulations: ShortStayRegulation | null
): UseCaseComparison {
  const longTerm = calculateLongTermRental(investmentInputs, propertyValue, costs);
  const shortStay = calculateShortStay(investmentInputs, propertyValue, costs, regulations);

  const incomeDifference = shortStay.annualIncome - longTerm.annualIncome;
  const netDifference = shortStay.netIncome - longTerm.netIncome;

  // Determine optimal use case
  let optimalUse: 'longTerm' | 'shortStay' | 'mixed' = 'longTerm';
  const reasoning: string[] = [];

  if (regulations && !regulations.shortStayPermitted) {
    optimalUse = 'longTerm';
    reasoning.push('Short-stay accommodation is not permitted in this area.');
  } else if (shortStay.netIncome > longTerm.netIncome * 1.2) {
    // Short-stay is 20%+ better
    optimalUse = 'shortStay';
    reasoning.push(`Short-stay provides ${Math.round((netDifference / longTerm.netIncome) * 100)}% higher net income.`);
  } else if (shortStay.netIncome > longTerm.netIncome) {
    // Short-stay is better but not significantly
    optimalUse = 'mixed';
    reasoning.push('Short-stay provides higher income but requires more management.');
    reasoning.push('Consider a mixed strategy: short-stay during peak seasons, long-term otherwise.');
  } else {
    optimalUse = 'longTerm';
    reasoning.push('Long-term rental provides more stable, predictable returns.');
    if (shortStay.regulatoryCompliance === 'high') {
      reasoning.push('Short-stay has high regulatory compliance requirements in this area.');
    }
  }

  // Add risk considerations
  if (shortStay.riskLevel === 'high') {
    reasoning.push('Short-stay carries higher regulatory and operational risks.');
  }

  return {
    longTermRental: longTerm,
    shortStay,
    recommendation: {
      optimalUse,
      incomeDifference,
      netDifference,
      reasoning
    }
  };
}

/**
 * Get default occupancy rate for short-stay based on location
 */
export function getDefaultOccupancyRate(state: AustralianState): number {
  // Higher occupancy in tourist areas
  const occupancyRates: Record<AustralianState, number> = {
    NSW: 0.70, // Sydney, tourist areas
    VIC: 0.68, // Melbourne
    QLD: 0.75, // Gold Coast, Cairns (high tourism)
    WA: 0.65,
    SA: 0.60,
    TAS: 0.70, // Hobart, tourist areas
    ACT: 0.55,
    NT: 0.70, // Darwin, tourist areas
  };
  
  return occupancyRates[state] || 0.65;
}

