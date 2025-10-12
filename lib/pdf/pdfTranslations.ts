/**
 * PDF Translation Helper
 * Loads translations for PDF generation
 */

// This would normally be loaded from next-intl, but since PDF generation
// happens client-side, we'll load the translations directly

export interface PDFTranslations {
  title: string;
  subtitle: string;
  generatedOn: string;
  page: string;
  disclaimer: string;
  sections: {
    executiveSummary: string;
    propertyDetails: string;
    keyMetrics: string;
    firbRequirements: string;
    eligibilityStatus: string;
    propertyType: string;
    costBreakdown: string;
    investmentPerformance: string;
    rentalYield: string;
    cashFlow: string;
    projections: string;
    equityGrowth: string;
    breakEven: string;
    comparison: string;
    assetComparison: string;
    sensitivity: string;
    riskScenarios: string;
    taxAnalysis: string;
    deductions: string;
    cgtProjection: string;
    recommendations: string;
    overallScore: string;
    recommendation: string;
  };
  labels: {
    address: string;
    state: string;
    value: string;
    deposit: string;
    citizenshipStatus: string;
    entityType: string;
    eligible: string;
    notEligible: string;
    firbRequired: string;
    noFirbRequired: string;
    firbFee: string;
    stampDuty: string;
    foreignSurcharge: string;
    legalFees: string;
    totalUpfront: string;
    annualLandTax: string;
    grossYield: string;
    netYield: string;
    annualizedROI: string;
    monthlyCashFlow: string;
    annualIncome: string;
    annualExpenses: string;
    afterTaxCashFlow: string;
    taxBenefit: string;
    propertyValue: string;
    equity: string;
    loanBalance: string;
    year: string;
    cumulativeReturn: string;
    breakEvenYear: string;
    cashRequired: string;
    investmentType: string;
    annualReturn: string;
    yearReturn: string;
    riskLevel: string;
    vacancyImpact: string;
    interestImpact: string;
    growthScenarios: string;
    conservative: string;
    moderate: string;
    optimistic: string;
    deductibleExpenses: string;
    loanInterest: string;
    propertyManagement: string;
    maintenance: string;
    landTax: string;
    councilRates: string;
    insurance: string;
    strataFees: string;
    depreciation: string;
    other: string;
    totalDeductions: string;
    salePrice: string;
    costBase: string;
    capitalGain: string;
    cgtPayable: string;
    withholdingTax: string;
    netProceeds: string;
    overallVerdict: string;
    scoreBreakdown: string;
    rentalYieldScore: string;
    capitalGrowthScore: string;
    cashFlowScore: string;
    taxEfficiencyScore: string;
    riskProfileScore: string;
    strengths: string;
    weaknesses: string;
    keyTakeaways: string;
  };
  notes: {
    estimatesOnly: string;
    professionalAdvice: string;
    regulationsChange: string;
    assumptionsBased: string;
    pastPerformance: string;
  };
}

/**
 * Load PDF translations for a given locale
 * This loads from the messages JSON files
 */
export async function loadPDFTranslations(locale: string): Promise<PDFTranslations> {
  const messages = await import(`@/messages/${locale}.json`);
  return messages.default.FIRBCalculator.pdf as PDFTranslations;
}

/**
 * Get translations synchronously (for client-side use)
 * Requires translations to be passed from parent component
 */
export function getPDFTranslations(allTranslations: Record<string, unknown>): PDFTranslations {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (allTranslations as any).FIRBCalculator.pdf as PDFTranslations;
}


