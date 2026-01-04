/**
 * Property Performance Calculations
 * Calculate performance metrics for properties based on transactions and current state
 */

import type { Property, PropertyTransaction } from "@/types/database";
import { getPropertyTransactions } from "./transactions";

export interface PropertyPerformanceMetrics {
  rentalYield: {
    gross: number;
    net: number;
    effective: number;
  };
  cashFlow: {
    annual: number;
    monthly: number;
    cumulative: number;
    breakdown: {
      income: number;
      expenses: number;
      loanRepayments: number;
    };
  };
  roi: {
    total: number;
    annualized: number;
    cashOnCash: number;
  };
  capitalGrowth: {
    total: number;
    annualRate: number;
    percentageGain: number;
  };
  equity: {
    current: number;
    gain: number;
    lvr: number;
  };
}

/**
 * Calculate performance metrics for a property
 */
export async function calculatePropertyPerformance(
  property: Property
): Promise<PropertyPerformanceMetrics> {
  // Get all transactions for the property
  const transactions = await getPropertyTransactions(property.id);

  // Calculate dates
  const purchaseDate = new Date(property.purchase_date);
  const currentDate = new Date();
  const yearsOwned =
    (currentDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

  // Get current property value (use current_value or fall back to purchase_price)
  const currentValue = property.current_value || property.purchase_price;
  const purchasePrice = property.purchase_price;

  // Calculate rental yield (if rental property)
  const rentalYield = calculateRentalYield(property, currentValue);

  // Calculate cash flow
  const cashFlow = calculateCashFlow(property, transactions, yearsOwned);

  // Calculate ROI
  const roi = calculateROI(property, transactions, currentValue, yearsOwned);

  // Calculate capital growth
  const capitalGrowth = calculateCapitalGrowth(property, currentValue, yearsOwned);

  // Calculate equity
  const equity = calculateEquity(property, currentValue);

  return {
    rentalYield,
    cashFlow,
    roi,
    capitalGrowth,
    equity,
  };
}

/**
 * Calculate rental yield metrics
 */
function calculateRentalYield(
  property: Property,
  currentValue: number
): {
  gross: number;
  net: number;
  effective: number;
} {
  if (!property.is_rental || !property.weekly_rent) {
    return { gross: 0, net: 0, effective: 0 };
  }

  const annualRent = property.weekly_rent * 52;
  const grossYield = (annualRent / currentValue) * 100;

  // Net yield (after management fees)
  const managementFee = property.property_management_fee_percent
    ? annualRent * (property.property_management_fee_percent / 100)
    : 0;
  const netRent = annualRent - managementFee;
  const netYield = (netRent / currentValue) * 100;

  // Effective yield (assuming 5% vacancy - could be calculated from transactions)
  const effectiveRent = annualRent * 0.95;
  const effectiveYield = (effectiveRent / currentValue) * 100;

  return {
    gross: grossYield,
    net: netYield,
    effective: effectiveYield,
  };
}

/**
 * Calculate cash flow metrics
 */
function calculateCashFlow(
  property: Property,
  transactions: PropertyTransaction[],
  yearsOwned: number
): {
  annual: number;
  monthly: number;
  cumulative: number;
  breakdown: {
    income: number;
    expenses: number;
    loanRepayments: number;
  };
} {
  // Filter transactions for the last year (or all if owned less than a year)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const recentTransactions = transactions.filter(
    (tx) => new Date(tx.transaction_date) >= oneYearAgo
  );

  // Calculate income
  const income = recentTransactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Calculate expenses (excluding loan repayments)
  const expenses = recentTransactions
    .filter((tx) => tx.type === "expense" && tx.category !== "loan_repayment")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Calculate loan repayments
  const loanRepayments = recentTransactions
    .filter((tx) => tx.category === "loan_repayment" || tx.category === "loan_interest")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Annual cash flow
  const annualCashFlow = income - expenses - loanRepayments;

  // Monthly cash flow
  const monthlyCashFlow = annualCashFlow / 12;

  // Cumulative cash flow (from all transactions)
  const cumulativeCashFlow = transactions.reduce((sum, tx) => {
    if (tx.type === "income") return sum + tx.amount;
    if (tx.type === "expense" || tx.type === "capital") return sum - tx.amount;
    return sum;
  }, 0);

  return {
    annual: annualCashFlow,
    monthly: monthlyCashFlow,
    cumulative: cumulativeCashFlow,
    breakdown: {
      income,
      expenses,
      loanRepayments,
    },
  };
}

/**
 * Calculate ROI metrics
 */
function calculateROI(
  property: Property,
  transactions: PropertyTransaction[],
  currentValue: number,
  yearsOwned: number
): {
  total: number;
  annualized: number;
  cashOnCash: number;
} {
  // Total investment (purchase price + purchase costs + improvements)
  const improvements = transactions
    .filter((tx) => tx.is_capital_improvement || tx.category === "improvement")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalInvestment = property.purchase_price + property.purchase_costs + improvements;

  // Total income from all transactions
  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Total expenses (excluding improvements which are part of cost base)
  const totalExpenses = transactions
    .filter(
      (tx) => tx.type === "expense" && !tx.is_capital_improvement && tx.category !== "improvement"
    )
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Capital gain
  const capitalGain =
    currentValue - property.purchase_price - property.purchase_costs - improvements;

  // Total return
  const totalReturn = totalIncome - totalExpenses + capitalGain;

  // Total ROI
  const totalROI = (totalReturn / totalInvestment) * 100;

  // Annualized ROI
  const annualizedROI = yearsOwned > 0 ? totalROI / yearsOwned : 0;

  // Cash-on-cash return (annual net income / initial cash investment)
  const initialCashInvestment = property.deposit_amount || property.purchase_price * 0.2; // Assume 20% if no deposit
  const annualNetIncome = totalIncome - totalExpenses;
  const cashOnCash = (annualNetIncome / initialCashInvestment / Math.max(yearsOwned, 1)) * 100;

  return {
    total: totalROI,
    annualized: annualizedROI,
    cashOnCash,
  };
}

/**
 * Calculate capital growth metrics
 */
function calculateCapitalGrowth(
  property: Property,
  currentValue: number,
  yearsOwned: number
): {
  total: number;
  annualRate: number;
  percentageGain: number;
} {
  const purchasePrice = property.purchase_price;
  const totalAppreciation = currentValue - purchasePrice;
  const percentageGain = (totalAppreciation / purchasePrice) * 100;

  // Annual growth rate (compound annual growth rate)
  const annualRate =
    yearsOwned > 0 ? (Math.pow(currentValue / purchasePrice, 1 / yearsOwned) - 1) * 100 : 0;

  return {
    total: totalAppreciation,
    annualRate,
    percentageGain,
  };
}

/**
 * Calculate equity metrics
 */
function calculateEquity(
  property: Property,
  currentValue: number
): {
  current: number;
  gain: number;
  lvr: number;
} {
  const currentLoanBalance = property.current_loan_balance || 0;
  const currentEquity = currentValue - currentLoanBalance;

  // Initial equity (purchase price - loan amount)
  const initialLoanAmount = property.loan_amount || 0;
  const initialEquity = property.purchase_price - initialLoanAmount;
  const equityGain = currentEquity - initialEquity;

  // Loan-to-value ratio
  const lvr = currentValue > 0 ? (currentLoanBalance / currentValue) * 100 : 0;

  return {
    current: currentEquity,
    gain: equityGain,
    lvr,
  };
}
