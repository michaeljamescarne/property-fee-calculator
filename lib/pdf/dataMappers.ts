/**
 * PDF Data Mappers
 * Transforms application data structures into PDF template format
 */

import type { InvestmentAnalytics } from '@/types/investment';
import type { EligibilityResult } from '@/lib/firb/eligibility';
import type { CostBreakdown } from '@/lib/firb/calculations';
import type { FIRBCalculatorFormData } from '@/lib/validations/firb';

/**
 * PDF Report Data Structure
 * Matches the template's data format exactly
 */
export interface PDFReportData {
  property: {
    address: string;
    type: string;
    purchasePrice: number;
    propertyValue: number;
  };
  eligibility: {
    status: string;
    citizenshipStatus: string;
    visa: string;
    propertyUse: string;
    purchasingEntity: string;
    stateTerritory: string;
  };
  costs: {
    totalInvestment: number;
    purchasePrice: number;
    firbFee: number;
    stampDuty: number;
    foreignBuyerSurcharge: number;
    legalFees: number;
    inspectionFees: number;
    loanEstablishment: number;
    additionalUpfront: number;
  };
  ongoingCosts: {
    councilRates: number;
    insurance: number;
    maintenance: number;
    total: number;
  };
  performance: {
    grossYield: number;
    netYield: number;
    annualizedROI: number;
    annualIncome: number;
    effectiveIncome: number;
    totalExpenses: number;
    monthlyCashFlow: number;
    afterTaxCashFlow: number;
  };
  taxBenefits: {
    annualSaving: number;
    monthlyBenefit: number;
    totalDeductions: number;
    marginalRate: number;
  };
  projection: {
    startingValue: number;
    finalValue: number;
    growthRate: number;
    years: number;
    equity: number;
    equityGain: number;
    totalROI: number;
  };
  cgt: {
    salePrice: number;
    purchasePrice: number;
    purchaseCosts: number;
    sellingCosts: number;
    costBase: number;
    capitalGain: number;
    cgtRate: number;
    cgtPayable: number;
    withholdingTax: number;
    netProceeds: number;
  };
  sensitivity: {
    vacancyImpact: Array<{
      rate: number;
      rent: number;
      cashFlow: number;
      impact: number;
    }>;
    interestImpact: Array<{
      rate: number;
      monthly: number;
      annual: number;
      impact: number;
    }>;
    growthScenarios: Array<{
      scenario: string;
      rate: number;
      finalValue: number;
      totalReturn: number;
      roi: number;
    }>;
  };
  score: {
    overall: number;
    rentalYield: number;
    capitalGrowth: number;
    cashFlow: number;
    taxEfficiency: number;
    riskProfile: number;
    verdict: string;
    strengths: string[];
    weaknesses: string[];
  };
}

/**
 * Maps application data structures to PDF template format
 */
export function mapAnalyticsToPDFData(
  formData: Partial<FIRBCalculatorFormData>,
  eligibility: EligibilityResult,
  costs: CostBreakdown,
  analytics: InvestmentAnalytics
): PDFReportData {
  // Extract property details
  const propertyAddress = formData.propertyAddress || 'Property Address Not Provided';
  const propertyValue = formData.propertyValue || 0;
  const propertyType = formData.propertyType || 'newDwelling';
  const state = formData.state || 'NSW';
  const citizenshipStatus = formData.citizenshipStatus || 'foreign';
  const visaType = formData.visaType || 'N/A';
  const entityType = formData.entityType || 'individual';

  // Map property type to readable string
  const propertyTypeMap: Record<string, string> = {
    newDwelling: 'New Dwelling',
    established: 'Established Dwelling',
    vacantLand: 'Vacant Land',
    commercial: 'Commercial Property'
  };

  // Map citizenship status to readable string
  const citizenshipMap: Record<string, string> = {
    australian: 'Australian Citizen',
    permanent: 'Permanent Resident',
    temporary: 'Temporary Resident',
    foreign: 'Foreign Person'
  };

  // Map entity type to readable string
  const entityMap: Record<string, string> = {
    individual: 'Individual',
    company: 'Company',
    trust: 'Trust'
  };

  // Calculate additional upfront costs
  const additionalUpfront = 
    costs.upfrontCosts.firbFee +
    costs.upfrontCosts.stampDuty +
    costs.upfrontCosts.foreignSurcharge +
    costs.upfrontCosts.legalFees +
    costs.upfrontCosts.inspectionFees +
    costs.upfrontCosts.loanCosts;

  // Calculate tax benefits from analytics
  const annualTaxSaving = analytics.taxAnalysis?.annualTaxSaving || 0;
  const monthlyTaxBenefit = analytics.taxAnalysis?.monthlyTaxSaving || 0;
  const totalDeductions = analytics.taxAnalysis?.annualDeductions?.total || 0;

  // Get projection data (use last year for final values)
  const lastYear = analytics.yearByYear[analytics.yearByYear.length - 1];
  const finalValue = lastYear?.propertyValue || analytics.capitalGrowth.estimatedValueAtEnd;
  const finalEquity = lastYear?.equity || analytics.loanMetrics.equityAtEnd;

  // Calculate sensitivity scenarios
  const baseCashFlow = analytics.cashFlow.annual.afterTaxCashFlow;
  const baseRent = analytics.cashFlow.annual.effectiveIncome;
  
  const vacancyImpact = [0, 5, 10, 15].map(rate => {
    const adjustedRent = analytics.rentalYield.annualRent * (1 - rate / 100);
    const rentDiff = adjustedRent - baseRent;
    const adjustedCashFlow = baseCashFlow + rentDiff;
    
    return {
      rate,
      rent: adjustedRent,
      cashFlow: adjustedCashFlow,
      impact: adjustedCashFlow - baseCashFlow
    };
  });

  // Interest rate sensitivity (current rate from loan metrics)
  const currentRate = 6.5; // Default assumption
  const loanAmount = analytics.loanMetrics.initialLoanAmount;
  const interestImpact = [5.5, 6.5, 7.5, 8.5].map(rate => {
    const annualCost = loanAmount * (rate / 100);
    const monthlyCost = annualCost / 12;
    const impact = annualCost - (loanAmount * (currentRate / 100));
    
    return {
      rate,
      monthly: monthlyCost,
      annual: annualCost,
      impact
    };
  });

  // Growth scenarios
  const growthScenarios = analytics.sensitivity.growthScenarios.map(scenario => ({
    scenario: scenario.label,
    rate: scenario.rate,
    finalValue: scenario.valueAtEnd,
    totalReturn: scenario.totalReturn,
    roi: scenario.annualizedROI
  }));

  // Map verdict
  const verdictMap: Record<string, string> = {
    'Excellent': 'Excellent Investment',
    'Good': 'Good Investment',
    'Moderate': 'Moderate Investment',
    'Poor': 'Poor Investment',
    'Not Recommended': 'Not Recommended'
  };

  return {
    property: {
      address: propertyAddress,
      type: propertyTypeMap[propertyType] || propertyType,
      purchasePrice: propertyValue,
      propertyValue: propertyValue
    },
    eligibility: {
      status: eligibility.isEligible ? 'Eligible' : 'Not Eligible',
      citizenshipStatus: citizenshipMap[citizenshipStatus] || citizenshipStatus,
      visa: visaType,
      propertyUse: formData.isFirstHome ? 'Primary Residence' : 'Investment Property',
      purchasingEntity: entityMap[entityType] || entityType,
      stateTerritory: state
    },
    costs: {
      totalInvestment: costs.totalInvestmentCost,
      purchasePrice: costs.upfrontCosts.propertyPrice,
      firbFee: costs.upfrontCosts.firbFee,
      stampDuty: costs.upfrontCosts.stampDuty,
      foreignBuyerSurcharge: costs.upfrontCosts.foreignSurcharge,
      legalFees: costs.upfrontCosts.legalFees,
      inspectionFees: costs.upfrontCosts.inspectionFees,
      loanEstablishment: costs.upfrontCosts.loanCosts,
      additionalUpfront: additionalUpfront
    },
    ongoingCosts: {
      councilRates: costs.ongoingCosts.councilRates,
      insurance: costs.ongoingCosts.insurance,
      maintenance: costs.ongoingCosts.maintenance,
      total: costs.ongoingCosts.total
    },
    performance: {
      grossYield: analytics.rentalYield.gross,
      netYield: analytics.rentalYield.net,
      annualizedROI: analytics.roi.annualizedROI,
      annualIncome: analytics.cashFlow.annual.rentalIncome,
      effectiveIncome: analytics.cashFlow.annual.effectiveIncome,
      totalExpenses: analytics.cashFlow.annual.totalExpenses,
      monthlyCashFlow: analytics.cashFlow.monthly.netCashFlow,
      afterTaxCashFlow: analytics.cashFlow.annual.afterTaxCashFlow
    },
    taxBenefits: {
      annualSaving: annualTaxSaving,
      monthlyBenefit: monthlyTaxBenefit,
      totalDeductions: totalDeductions,
      marginalRate: 37 // Default, should come from analytics inputs
    },
    projection: {
      startingValue: analytics.capitalGrowth.initialValue,
      finalValue: finalValue,
      growthRate: analytics.capitalGrowth.annualGrowthRate,
      years: analytics.yearByYear.length,
      equity: finalEquity,
      equityGain: analytics.loanMetrics.equityGain,
      totalROI: analytics.roi.totalROI
    },
    cgt: {
      salePrice: analytics.taxAnalysis.cgtOnExit.salePrice,
      purchasePrice: analytics.taxAnalysis.cgtOnExit.originalPurchasePrice,
      purchaseCosts: analytics.taxAnalysis.cgtOnExit.purchaseCosts,
      sellingCosts: analytics.taxAnalysis.cgtOnExit.sellingCosts,
      costBase: analytics.taxAnalysis.cgtOnExit.costBase,
      capitalGain: analytics.taxAnalysis.cgtOnExit.capitalGain,
      cgtRate: analytics.taxAnalysis.cgtOnExit.cgtRate,
      cgtPayable: analytics.taxAnalysis.cgtOnExit.cgtAmount,
      withholdingTax: analytics.taxAnalysis.cgtOnExit.withholdingTax,
      netProceeds: analytics.taxAnalysis.cgtOnExit.netProceedsAfterTax
    },
    sensitivity: {
      vacancyImpact,
      interestImpact,
      growthScenarios
    },
    score: {
      overall: analytics.score.overall,
      rentalYield: analytics.score.rentalYield,
      capitalGrowth: analytics.score.capitalGrowth,
      cashFlow: analytics.score.cashFlow,
      taxEfficiency: analytics.score.taxEfficiency,
      riskProfile: analytics.score.riskProfile,
      verdict: verdictMap[analytics.recommendation.verdict] || analytics.recommendation.verdict,
      strengths: analytics.recommendation.strengths,
      weaknesses: analytics.recommendation.weaknesses
    }
  };
}

