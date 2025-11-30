/**
 * Investment Analytics Calculator
 * Comprehensive investment analysis for property purchases
 */

import type { InvestmentInputs, InvestmentAnalytics, YearlyProjection } from "@/types/investment";
import type { CostBreakdown } from "./calculations";
import { PropertyType, AustralianState } from "./constants";
import {
  calculateMonthlyRepayment,
  calculateInterestOnlyRepayment,
  calculateLoanSchedule,
  calculateLVR,
} from "./loan-calculator";
import { calculateTaxDeductions, calculateTaxBenefit, calculateCGT } from "./tax-calculator";

/**
 * Generate smart default investment inputs based on property details
 * Uses benchmark data when available, falls back to state defaults
 */
import type { CostMetric } from "@/lib/benchmarks/cost-benchmarks";
import type { MacroMetric } from "@/lib/benchmarks/macro-benchmarks";
import { DEFAULT_COST_BENCHMARKS } from "@/lib/benchmarks/cost-benchmarks";
import { DEFAULT_MACRO_BENCHMARKS } from "@/lib/benchmarks/macro-benchmarks";

export function generateDefaultInputs(
  propertyValue: number,
  state: AustralianState,
  propertyType: PropertyType,
  depositPercent: number,
  existingCosts: CostBreakdown,
  benchmarkData?: {
    grossRentalYield?: number;
    capitalGrowth5yr?: number;
    capitalGrowth10yr?: number;
  } | null,
  costBenchmarks?: Partial<Record<CostMetric, number>>,
  macroBenchmarks?: Partial<Record<MacroMetric, number>>
): InvestmentInputs {
  // Use benchmark data if available, otherwise fall back to state defaults
  const yieldRates: Record<AustralianState, number> = {
    NSW: 0.032, // 3.2%
    VIC: 0.034, // 3.4%
    QLD: 0.045, // 4.5%
    WA: 0.042, // 4.2%
    SA: 0.041, // 4.1%
    TAS: 0.048, // 4.8%
    ACT: 0.038, // 3.8%
    NT: 0.055, // 5.5%
  };

  const grossYield = benchmarkData?.grossRentalYield
    ? benchmarkData.grossRentalYield / 100 // Convert percentage to decimal
    : yieldRates[state] || 0.04;
  const annualRent = propertyValue * grossYield;
  const weeklyRent = Math.round(annualRent / 52);

  // Use benchmark capital growth if available
  const capitalGrowth = benchmarkData?.capitalGrowth5yr
    ? benchmarkData.capitalGrowth5yr / 100 // Convert percentage to decimal
    : 0.06; // Default 6%

  // Loan amount
  const depositAmount = propertyValue * (depositPercent / 100);
  const loanAmount = propertyValue - depositAmount;

  // Use benchmarks if available, otherwise use defaults
  const vacancyRate =
    costBenchmarks?.vacancy_rate_percent ?? DEFAULT_COST_BENCHMARKS.vacancy_rate_percent;
  const rentGrowthRate =
    costBenchmarks?.rent_growth_percent ?? DEFAULT_COST_BENCHMARKS.rent_growth_percent;
  const propertyManagementFee =
    costBenchmarks?.management_fee_percent ?? DEFAULT_COST_BENCHMARKS.management_fee_percent;
  const lettingFee = costBenchmarks?.letting_fee_weeks ?? DEFAULT_COST_BENCHMARKS.letting_fee_weeks;
  const interestRate =
    costBenchmarks?.interest_rate_percent ??
    macroBenchmarks?.default_interest_rate ??
    DEFAULT_COST_BENCHMARKS.interest_rate_percent;
  const marginalTaxRate =
    macroBenchmarks?.default_marginal_tax_rate ??
    DEFAULT_MACRO_BENCHMARKS.default_marginal_tax_rate;
  const sellingCosts =
    costBenchmarks?.selling_costs_percent ?? DEFAULT_COST_BENCHMARKS.selling_costs_percent;
  const cgtWithholdingRate =
    macroBenchmarks?.cgt_withholding ?? DEFAULT_MACRO_BENCHMARKS.cgt_withholding;

  return {
    // Rental
    estimatedWeeklyRent: weeklyRent,
    vacancyRate,
    rentGrowthRate,

    // Management
    propertyManagementFee,
    lettingFee,
    selfManaged: false,

    // Ongoing costs (use existing calculated costs)
    annualMaintenanceCost: existingCosts.ongoingCosts.maintenance,
    annualInsurance: existingCosts.ongoingCosts.insurance,
    annualCouncilRates: existingCosts.ongoingCosts.councilRates,
    annualStrataFees: 0, // User can override

    // Financing
    loanAmount,
    interestRate,
    loanTerm: 30,
    loanType: "principalAndInterest",
    interestOnlyPeriod: 0,

    // Strategy
    holdPeriod: 10,
    capitalGrowthRate: capitalGrowth * 100, // Convert back to percentage for display

    // Tax
    marginalTaxRate,
    currencyExchangeRate: 1,
    homeCurrency: "AUD",

    // Exit
    sellingCosts,
    cgtWithholdingRate,
  };
}

/**
 * Calculate comprehensive investment analytics
 */
export function calculateInvestmentAnalytics(
  inputs: InvestmentInputs,
  propertyValue: number,
  state: AustralianState,
  propertyType: PropertyType,
  existingCosts: CostBreakdown,
  macroBenchmarks?: Partial<Record<MacroMetric, number>>
): InvestmentAnalytics {
  // 1. RENTAL YIELD CALCULATIONS
  const annualRent = inputs.estimatedWeeklyRent * 52;
  const vacancyCost = annualRent * (inputs.vacancyRate / 100);
  const effectiveRent = annualRent - vacancyCost;

  const grossYield = (annualRent / propertyValue) * 100;

  // Calculate net yield: (effective rent - all expenses) / total investment cost
  // Note: We calculate expenses here before they're fully computed, so we use a simplified version
  // The full expenses calculation happens later, but for net yield we need a reasonable estimate
  const propertyManagementCost = inputs.selfManaged
    ? 0
    : effectiveRent * (inputs.propertyManagementFee / 100);
  const estimatedOtherExpenses =
    (inputs.annualCouncilRates ?? existingCosts.ongoingCosts.councilRates) +
    (inputs.annualInsurance ?? existingCosts.ongoingCosts.insurance) +
    (inputs.annualMaintenanceCost ?? existingCosts.ongoingCosts.maintenance) +
    existingCosts.ongoingCosts.annualLandTax +
    (inputs.annualStrataFees ?? 0);

  const netYield =
    ((effectiveRent - propertyManagementCost - estimatedOtherExpenses) /
      existingCosts.totalInvestmentCost) *
    100;

  const benchmarks: Record<AustralianState, number> = {
    NSW: 3.2,
    VIC: 3.4,
    QLD: 4.5,
    WA: 4.2,
    SA: 4.1,
    TAS: 4.8,
    ACT: 3.8,
    NT: 5.5,
  };

  const benchmark = benchmarks[state] || 4.0;
  const comparison =
    grossYield > benchmark
      ? `Above ${state} average (${benchmark}%)`
      : `Below ${state} average (${benchmark}%)`;

  // 2. LOAN CALCULATIONS
  const loanRepayment =
    inputs.loanType === "interestOnly" && inputs.interestOnlyPeriod >= inputs.holdPeriod
      ? calculateInterestOnlyRepayment(inputs.loanAmount, inputs.interestRate)
      : calculateMonthlyRepayment(inputs.loanAmount, inputs.interestRate, inputs.loanTerm);

  const annualLoanRepayment = loanRepayment * 12;
  const loanSchedule = calculateLoanSchedule(
    inputs.loanAmount,
    inputs.interestRate,
    inputs.loanTerm,
    inputs.loanType,
    inputs.interestOnlyPeriod,
    inputs.holdPeriod
  );

  const loanBalanceAtEnd = loanSchedule[inputs.holdPeriod - 1]?.balance || inputs.loanAmount;
  const totalInterestPaid = loanSchedule.reduce((sum, year) => sum + year.interestPaid, 0);
  const totalPrincipalPaid = inputs.loanAmount - loanBalanceAtEnd;

  const lvr = calculateLVR(inputs.loanAmount, propertyValue);

  // 3. CASH FLOW CALCULATIONS (Year 1)
  // Reuse propertyManagementCost calculated above for net yield
  const lettingCost = inputs.selfManaged ? 0 : inputs.estimatedWeeklyRent * inputs.lettingFee;

  const annualExpenses = {
    loanRepayments: annualLoanRepayment,
    propertyManagement: propertyManagementCost,
    lettingFee: lettingCost,
    councilRates: inputs.annualCouncilRates ?? existingCosts.ongoingCosts.councilRates,
    insurance: inputs.annualInsurance ?? existingCosts.ongoingCosts.insurance,
    maintenance: inputs.annualMaintenanceCost ?? existingCosts.ongoingCosts.maintenance,
    landTax: existingCosts.ongoingCosts.annualLandTax,
    strataFees: inputs.annualStrataFees ?? 0,
    vacancyFee: existingCosts.ongoingCosts.vacancyFee,
  };

  const totalExpenses =
    annualExpenses.loanRepayments +
    annualExpenses.propertyManagement +
    annualExpenses.lettingFee +
    annualExpenses.councilRates +
    annualExpenses.insurance +
    annualExpenses.maintenance +
    annualExpenses.landTax +
    annualExpenses.strataFees +
    annualExpenses.vacancyFee;

  const netCashFlow = effectiveRent - totalExpenses;

  // 4. TAX DEDUCTIONS & BENEFITS
  const firstYearInterest =
    loanSchedule[0]?.interestPaid || (inputs.loanAmount * inputs.interestRate) / 100;

  // Determine building age for depreciation calculations
  // New dwellings are 0 years old, established properties default to 10 years if not specified
  const buildingAge =
    inputs.buildingAge ??
    (propertyType === "newDwelling" ? 0 : propertyType === "established" ? 10 : 0);

  const deductions = calculateTaxDeductions(
    firstYearInterest,
    annualExpenses.councilRates,
    annualExpenses.landTax,
    annualExpenses.propertyManagement + annualExpenses.lettingFee,
    annualExpenses.maintenance,
    annualExpenses.insurance,
    annualExpenses.strataFees,
    propertyValue,
    propertyType,
    buildingAge
  );

  const taxBenefit = calculateTaxBenefit(deductions.total, effectiveRent, inputs.marginalTaxRate);
  const afterTaxCashFlow = netCashFlow + taxBenefit;

  // 5. CAPITAL GROWTH & ROI
  const futureValue =
    propertyValue * Math.pow(1 + inputs.capitalGrowthRate / 100, inputs.holdPeriod);
  const totalAppreciation = futureValue - propertyValue;

  const deposit = propertyValue - inputs.loanAmount;
  const totalCashInvested = existingCosts.totalInvestmentCost;

  // Calculate year-by-year projections
  const yearByYear: YearlyProjection[] = [];
  let cumulativeCashFlow = 0;

  for (let year = 1; year <= inputs.holdPeriod; year++) {
    const yearPropertyValue = propertyValue * Math.pow(1 + inputs.capitalGrowthRate / 100, year);
    const yearLoanBalance = loanSchedule[year - 1]?.balance || inputs.loanAmount;
    const yearEquity = yearPropertyValue - yearLoanBalance;

    // Rent grows annually
    const yearRentalIncome = annualRent * Math.pow(1 + inputs.rentGrowthRate / 100, year - 1);
    const yearEffectiveRent = yearRentalIncome * (1 - inputs.vacancyRate / 100);

    // Expenses (some grow with inflation, some are fixed)
    const yearExpenses = totalExpenses * Math.pow(1.025, year - 1); // 2.5% inflation
    const yearLoanRepayment = annualLoanRepayment; // Fixed

    const yearNetCashFlow = yearEffectiveRent - yearExpenses;
    const yearTaxBenefit = calculateTaxBenefit(
      deductions.total * Math.pow(1.025, year - 1),
      yearEffectiveRent,
      inputs.marginalTaxRate
    );
    const yearAfterTaxCashFlow = yearNetCashFlow + yearTaxBenefit;

    cumulativeCashFlow += yearAfterTaxCashFlow;

    const cumulativeReturn = yearEquity - totalCashInvested + cumulativeCashFlow;

    yearByYear.push({
      year,
      propertyValue: yearPropertyValue,
      loanBalance: yearLoanBalance,
      equity: yearEquity,
      rentalIncome: yearEffectiveRent,
      expenses: yearExpenses,
      loanRepayment: yearLoanRepayment,
      netCashFlow: yearNetCashFlow,
      taxBenefit: yearTaxBenefit,
      afterTaxCashFlow: yearAfterTaxCashFlow,
      cumulativeCashFlow,
      cumulativeReturn,
    });
  }

  const finalEquity = futureValue - loanBalanceAtEnd;
  const totalReturn =
    finalEquity - deposit + yearByYear.reduce((sum, y) => sum + y.afterTaxCashFlow, 0);
  const totalROI = (totalReturn / totalCashInvested) * 100;
  const annualizedROI = totalROI / inputs.holdPeriod;
  const cashOnCashReturn = (afterTaxCashFlow / totalCashInvested) * 100;

  // 6. INVESTMENT COMPARISONS
  const comparisonAmount = totalCashInvested; // Same initial investment

  // Use macro benchmarks if available, otherwise use defaults
  const asxRate =
    (macroBenchmarks?.asx_total_return ?? DEFAULT_MACRO_BENCHMARKS.asx_total_return) / 100;
  const termDepositRate =
    (macroBenchmarks?.term_deposit_rate ?? DEFAULT_MACRO_BENCHMARKS.term_deposit_rate) / 100;
  const bondRate = (macroBenchmarks?.bond_rate ?? DEFAULT_MACRO_BENCHMARKS.bond_rate) / 100;
  const savingsRate =
    (macroBenchmarks?.savings_rate ?? DEFAULT_MACRO_BENCHMARKS.savings_rate) / 100;

  const asxReturn = comparisonAmount * Math.pow(1 + asxRate, inputs.holdPeriod) - comparisonAmount;
  const termDepositReturn =
    comparisonAmount * Math.pow(1 + termDepositRate, inputs.holdPeriod) - comparisonAmount;
  const bondReturn =
    comparisonAmount * Math.pow(1 + bondRate, inputs.holdPeriod) - comparisonAmount;
  const savingsReturn =
    comparisonAmount * Math.pow(1 + savingsRate, inputs.holdPeriod) - comparisonAmount;

  // 7. SENSITIVITY ANALYSIS
  const vacancyScenarios = [0, 5, 10, 15].map((rate) => {
    const adjustedRent = annualRent * (1 - rate / 100);
    const adjustedCashFlow = adjustedRent - totalExpenses + taxBenefit;
    return {
      rate,
      annualRent: adjustedRent,
      netCashFlow: adjustedCashFlow,
      impact: adjustedCashFlow - afterTaxCashFlow,
    };
  });

  const interestRateScenarios = [5.5, 6.5, 7.5, 8.5].map((rate) => {
    const monthlyPayment = calculateMonthlyRepayment(inputs.loanAmount, rate, inputs.loanTerm);
    const annualCost = monthlyPayment * 12;
    const adjustedCashFlow =
      effectiveRent - (totalExpenses - annualLoanRepayment + annualCost) + taxBenefit;
    return {
      rate,
      monthlyRepayment: monthlyPayment,
      annualCost,
      netCashFlow: adjustedCashFlow,
      impact: adjustedCashFlow - afterTaxCashFlow,
    };
  });

  const growthScenarios = [
    { rate: 4, label: "Conservative" },
    { rate: 6, label: "Moderate" },
    { rate: 8, label: "Optimistic" },
  ].map((scenario) => {
    const endValue = propertyValue * Math.pow(1 + scenario.rate / 100, inputs.holdPeriod);
    const endLoanBalance = loanBalanceAtEnd;
    const endEquity = endValue - endLoanBalance;
    const scenarioReturn = endEquity - deposit;
    const scenarioROI = (scenarioReturn / totalCashInvested / inputs.holdPeriod) * 100;

    return {
      rate: scenario.rate,
      label: scenario.label,
      valueAtEnd: endValue,
      totalReturn: scenarioReturn,
      annualizedROI: scenarioROI,
    };
  });

  // 8. CGT ON EXIT
  const salePrice = futureValue;
  const sellingCostsAmount = salePrice * (inputs.sellingCosts / 100);
  const cgt = calculateCGT(
    salePrice,
    propertyValue,
    existingCosts.upfrontCosts.total,
    sellingCostsAmount,
    true,
    inputs.marginalTaxRate
  );

  // 9. INVESTMENT SCORE
  const scores = {
    rentalYield: Math.min(10, Math.max(0, (grossYield / 5) * 10)), // 5% = perfect score
    capitalGrowth: Math.min(10, Math.max(0, (inputs.capitalGrowthRate / 7) * 10)), // 7% = perfect
    cashFlow: Math.min(10, Math.max(0, 5 + (afterTaxCashFlow / totalCashInvested) * 50)), // Positive = good
    taxEfficiency: Math.min(10, Math.max(0, (taxBenefit / Math.abs(netCashFlow)) * 10)),
    riskProfile: 7, // Default medium-high (property is generally stable)
  };

  const overall =
    (scores.rentalYield +
      scores.capitalGrowth +
      scores.cashFlow +
      scores.taxEfficiency +
      scores.riskProfile) /
    5;

  // 10. RECOMMENDATION
  let verdict: "Excellent" | "Good" | "Moderate" | "Poor" | "Not Recommended";
  if (overall >= 8) verdict = "Excellent";
  else if (overall >= 7) verdict = "Good";
  else if (overall >= 5.5) verdict = "Moderate";
  else if (overall >= 4) verdict = "Poor";
  else verdict = "Not Recommended";

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (grossYield > benchmark) strengths.push(`Strong rental yield (${grossYield.toFixed(1)}%)`);
  else weaknesses.push(`Below average rental yield (${grossYield.toFixed(1)}%)`);

  if (inputs.capitalGrowthRate >= 6) strengths.push("Good capital growth potential");
  else if (inputs.capitalGrowthRate < 4) weaknesses.push("Limited capital growth potential");

  if (afterTaxCashFlow >= 0) strengths.push("Positive cash flow after tax");
  else weaknesses.push(`Negative cash flow ($${Math.abs(afterTaxCashFlow).toLocaleString()}/year)`);

  if (taxBenefit > 5000)
    strengths.push(`Significant tax benefits ($${Math.round(taxBenefit).toLocaleString()}/year)`);

  if (totalROI > 60)
    strengths.push(`Strong ${inputs.holdPeriod}-year return (${totalROI.toFixed(1)}% ROI)`);

  const suitableFor: string[] = [];
  if (afterTaxCashFlow < 0) {
    suitableFor.push("Investors with stable income to cover negative cash flow");
    suitableFor.push("High income earners benefiting from negative gearing");
  }
  if (inputs.holdPeriod >= 10) {
    suitableFor.push("Long-term wealth building (10+ years)");
  }
  if (grossYield > 4) {
    suitableFor.push("Investors seeking rental income");
  }
  if (inputs.capitalGrowthRate >= 6) {
    suitableFor.push("Capital growth focused investors");
  }

  const risksToConsider: string[] = [];
  if (inputs.vacancyRate >= 10) risksToConsider.push("High vacancy risk");
  if (lvr > 80) risksToConsider.push("High leverage (LVR > 80%)");
  if (afterTaxCashFlow < -20000) risksToConsider.push("Significant ongoing cash requirement");
  risksToConsider.push("Foreign buyer costs reduce returns");
  risksToConsider.push("Currency exchange risk");
  risksToConsider.push("Market downturn risk");

  // Find break-even points
  let yearsToPositiveCashFlow = null;
  let yearsToCumulativeBreakEven = null;

  for (let i = 0; i < yearByYear.length; i++) {
    if (yearsToPositiveCashFlow === null && yearByYear[i].afterTaxCashFlow >= 0) {
      yearsToPositiveCashFlow = yearByYear[i].year;
    }
    if (yearsToCumulativeBreakEven === null && yearByYear[i].cumulativeReturn >= 0) {
      yearsToCumulativeBreakEven = yearByYear[i].year;
    }
  }

  const totalCashRequired = yearByYear
    .filter((y) => y.afterTaxCashFlow < 0)
    .reduce((sum, y) => sum + Math.abs(y.afterTaxCashFlow), 0);

  // BUILD FINAL ANALYTICS OBJECT
  return {
    rentalYield: {
      gross: grossYield,
      net: netYield,
      weeklyRent: inputs.estimatedWeeklyRent,
      annualRent,
      effectiveRent,
      comparison,
      benchmark,
    },

    cashFlow: {
      annual: {
        rentalIncome: annualRent,
        vacancyCost,
        effectiveIncome: effectiveRent,
        loanRepayments: annualLoanRepayment,
        propertyManagement: propertyManagementCost + lettingCost,
        councilRates: annualExpenses.councilRates,
        insurance: annualExpenses.insurance,
        maintenance: annualExpenses.maintenance,
        landTax: annualExpenses.landTax,
        strataFees: annualExpenses.strataFees,
        otherExpenses: annualExpenses.vacancyFee,
        totalExpenses,
        netCashFlow,
        deductibleExpenses: deductions.total,
        taxBenefit,
        afterTaxCashFlow,
      },
      monthly: {
        netCashFlow: netCashFlow / 12,
        afterTaxCashFlow: afterTaxCashFlow / 12,
      },
    },

    roi: {
      totalROI,
      annualizedROI,
      cashOnCashReturn,
      totalReturn,
    },

    capitalGrowth: {
      initialValue: propertyValue,
      estimatedValueAtEnd: futureValue,
      totalAppreciation,
      annualGrowthRate: inputs.capitalGrowthRate,
      totalPercentageGain: (totalAppreciation / propertyValue) * 100,
    },

    loanMetrics: {
      lvr,
      initialLoanAmount: inputs.loanAmount,
      monthlyRepayment: loanRepayment,
      annualRepayment: annualLoanRepayment,
      totalInterestPaid,
      totalPrincipalPaid,
      loanBalanceAtEnd,
      equityAtStart: deposit,
      equityAtEnd: finalEquity,
      equityGain: finalEquity - deposit,
    },

    yearByYear,

    comparisons: {
      propertyInvestment: {
        totalReturn,
        annualizedReturn: annualizedROI,
      },
      asxStocks: {
        totalReturn: asxReturn,
        annualizedReturn: 7.2,
        rate: 7.2,
      },
      termDeposit: {
        totalReturn: termDepositReturn,
        annualizedReturn: 4.0,
        rate: 4.0,
      },
      governmentBonds: {
        totalReturn: bondReturn,
        annualizedReturn: 4.5,
        rate: 4.5,
      },
      highInterestSavings: {
        totalReturn: savingsReturn,
        annualizedReturn: 4.5,
        rate: 4.5,
      },
    },

    sensitivity: {
      vacancyImpact: vacancyScenarios,
      interestRateImpact: interestRateScenarios,
      growthScenarios,
    },

    taxAnalysis: {
      annualDeductions: deductions,
      annualTaxSaving: taxBenefit,
      monthlyTaxSaving: taxBenefit / 12,
      cgtOnExit: cgt,
    },

    score: {
      overall,
      rentalYield: scores.rentalYield,
      capitalGrowth: scores.capitalGrowth,
      cashFlow: scores.cashFlow,
      taxEfficiency: scores.taxEfficiency,
      riskProfile: scores.riskProfile,
    },

    recommendation: {
      verdict,
      rating: overall,
      description: generateRecommendationText(
        verdict,
        grossYield,
        afterTaxCashFlow,
        totalROI,
        inputs.holdPeriod
      ),
      strengths,
      weaknesses,
      suitableFor,
      risksToConsider,
      keyTakeaways: generateKeyTakeaways(grossYield, netCashFlow, totalROI, inputs.holdPeriod),
    },

    breakEven: {
      yearsToPositiveCashFlow,
      yearsToCumulativeBreakEven,
      totalCashRequired,
    },
  };
}

function generateRecommendationText(
  verdict: string,
  grossYield: number,
  afterTaxCashFlow: number,
  totalROI: number,
  holdPeriod: number
): string {
  const gearing = afterTaxCashFlow < 0 ? "negatively geared" : "positively geared";

  return `This is a **${verdict.toUpperCase()}** investment opportunity. The property is ${gearing} with a ${grossYield.toFixed(1)}% gross rental yield. Over ${holdPeriod} years, the projected total ROI is ${totalROI.toFixed(1)}%. ${
    verdict === "Excellent" || verdict === "Good"
      ? "This investment shows strong potential for wealth building with balanced risk-return profile."
      : verdict === "Moderate"
        ? "This investment has moderate potential. Consider your risk tolerance and cash flow capacity carefully."
        : "This investment may not meet typical return expectations. Review all assumptions and consider alternatives."
  }`;
}

function generateKeyTakeaways(
  grossYield: number,
  netCashFlow: number,
  totalROI: number,
  holdPeriod: number
): string[] {
  const takeaways: string[] = [];

  takeaways.push(
    `Rental yield of ${grossYield.toFixed(1)}% ${grossYield > 4 ? "(above average)" : "(below average)"}`
  );

  if (netCashFlow < 0) {
    takeaways.push(
      `Requires ${Math.abs(Math.round(netCashFlow / 12)).toLocaleString()}/month cash contribution`
    );
  } else {
    takeaways.push(
      `Generates ${Math.round(netCashFlow / 12).toLocaleString()}/month positive cash flow`
    );
  }

  takeaways.push(`Projected ${holdPeriod}-year ROI of ${totalROI.toFixed(1)}%`);
  takeaways.push(`Foreign buyer costs significantly impact returns`);
  takeaways.push(`Long-term capital growth is key to success`);

  return takeaways;
}
