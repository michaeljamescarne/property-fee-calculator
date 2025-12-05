// Investment Analytics Type Definitions

export interface InvestmentInputs {
  // Usage
  propertyUsage?: "rental" | "primaryResidence" | "vacant";

  // Rental Information
  estimatedWeeklyRent: number;
  vacancyRate: number; // %
  rentGrowthRate: number; // % per annum

  // Property Management
  propertyManagementFee: number; // % of rent
  lettingFee: number; // Weeks of rent
  selfManaged: boolean;

  // Ongoing Costs (overrides/supplements existing)
  annualMaintenanceCost?: number; // Optional override
  annualInsurance?: number; // Optional override
  annualCouncilRates?: number; // Optional override for council rates
  annualStrataFees?: number; // Optional override

  // Property Details
  buildingAge?: number; // Age of building in years (for depreciation calculations)

  // Financing
  loanAmount: number;
  interestRate: number; // % per annum
  loanTerm: number; // Years
  loanType: "principalAndInterest" | "interestOnly";
  interestOnlyPeriod: number; // Years (for IO loans)

  // Investment Strategy
  holdPeriod: number; // Years
  capitalGrowthRate: number; // % per annum

  // Tax & Currency
  marginalTaxRate: number; // %
  currencyExchangeRate: number; // AUD to home currency
  homeCurrency: string; // 'AUD', 'USD', 'CNY', etc.

  // Exit Strategy
  sellingCosts: number; // % of sale price
  cgtWithholdingRate: number; // %
}

export interface YearlyProjection {
  year: number;
  propertyValue: number;
  loanBalance: number;
  equity: number;
  rentalIncome: number;
  expenses: number;
  loanRepayment: number;
  netCashFlow: number;
  taxBenefit: number;
  afterTaxCashFlow: number;
  cumulativeCashFlow: number;
  cumulativeReturn: number;
}

export interface InvestmentAnalytics {
  // Rental Yields
  rentalYield: {
    gross: number;
    net: number;
    weeklyRent: number;
    annualRent: number;
    effectiveRent: number; // After vacancy
    comparison: string;
    benchmark: number;
  };

  // Cash Flow
  cashFlow: {
    annual: {
      rentalIncome: number;
      vacancyCost: number;
      effectiveIncome: number;
      loanRepayments: number;
      propertyManagement: number;
      councilRates: number;
      insurance: number;
      maintenance: number;
      landTax: number;
      strataFees: number;
      otherExpenses: number;
      totalExpenses: number;
      netCashFlow: number;
      deductibleExpenses: number;
      taxBenefit: number;
      afterTaxCashFlow: number;
    };
    monthly: {
      netCashFlow: number;
      afterTaxCashFlow: number;
    };
  };

  // ROI Metrics
  roi: {
    totalROI: number; // Over hold period
    annualizedROI: number;
    cashOnCashReturn: number;
    totalReturn: number; // Dollar amount
  };

  // Capital Growth
  capitalGrowth: {
    initialValue: number;
    estimatedValueAtEnd: number;
    totalAppreciation: number;
    annualGrowthRate: number;
    totalPercentageGain: number;
  };

  // Loan Metrics
  loanMetrics: {
    lvr: number;
    initialLoanAmount: number;
    monthlyRepayment: number;
    annualRepayment: number;
    totalInterestPaid: number;
    totalPrincipalPaid: number;
    loanBalanceAtEnd: number;
    equityAtStart: number;
    equityAtEnd: number;
    equityGain: number;
  };

  // Year-by-Year Projections
  yearByYear: YearlyProjection[];

  // Investment Comparisons
  comparisons: {
    propertyInvestment: {
      totalReturn: number;
      annualizedReturn: number;
    };
    asxStocks: {
      totalReturn: number;
      annualizedReturn: number;
      rate: number;
    };
    termDeposit: {
      totalReturn: number;
      annualizedReturn: number;
      rate: number;
    };
    governmentBonds: {
      totalReturn: number;
      annualizedReturn: number;
      rate: number;
    };
    highInterestSavings: {
      totalReturn: number;
      annualizedReturn: number;
      rate: number;
    };
  };

  // Sensitivity Analysis
  sensitivity: {
    vacancyImpact: Array<{
      rate: number;
      annualRent: number;
      netCashFlow: number;
      impact: number;
    }>;
    interestRateImpact: Array<{
      rate: number;
      monthlyRepayment: number;
      annualCost: number;
      netCashFlow: number;
      impact: number;
    }>;
    growthScenarios: Array<{
      rate: number;
      label: string;
      valueAtEnd: number;
      totalReturn: number;
      annualizedROI: number;
    }>;
  };

  // Tax Analysis
  taxAnalysis: {
    annualDeductions: {
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
    };
    annualTaxSaving: number;
    monthlyTaxSaving: number;
    marginalTaxRate: number; // % - Assumed tax rate used in calculations
    cgtOnExit: {
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
    };
  };

  // Investment Score
  score: {
    overall: number; // 0-10
    rentalYield: number; // 0-10
    capitalGrowth: number; // 0-10
    cashFlow: number; // 0-10
    taxEfficiency: number; // 0-10
    riskProfile: number; // 0-10
  };

  // Recommendation
  recommendation: {
    verdict: "Excellent" | "Good" | "Moderate" | "Poor" | "Not Recommended";
    rating: number; // Same as overall score
    description: string;
    strengths: string[];
    weaknesses: string[];
    suitableFor: string[];
    risksToConsider: string[];
    keyTakeaways: string[];
  };

  // Break-even Analysis
  breakEven: {
    yearsToPositiveCashFlow: number | null;
    yearsToCumulativeBreakEven: number | null;
    totalCashRequired: number; // Cumulative negative cash flow
  };
}

export interface ComparisonBenchmarks {
  asxReturn: number; // 7-8%
  termDepositRate: number; // 4-4.5%
  bondRate: number; // 4-4.5%
  savingsRate: number; // 4.5-5%
}

export interface MarketBenchmarks {
  [state: string]: {
    grossYield: number;
    capitalGrowth: number;
    medianPrice: number;
  };
}
