"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import type { InvestmentAnalytics } from "@/types/investment";
import { useInvestmentTranslations } from "@/lib/hooks/useInvestmentTranslations";

interface CashFlowAnalysisProps {
  analytics: InvestmentAnalytics;
}

export default function CashFlowAnalysis({ analytics }: CashFlowAnalysisProps) {
  const { t, currency } = useInvestmentTranslations();

  // Prepare chart data
  const cashFlowData = [
    {
      name:
        t("cashFlow.income") === "FIRBCalculator.investmentAnalytics.cashFlow.income"
          ? "Income"
          : t("cashFlow.income"),
      amount: analytics.cashFlow.annual.effectiveIncome,
      fill: "#10B981",
    },
    {
      name:
        t("cashFlow.expenses") === "FIRBCalculator.investmentAnalytics.cashFlow.expenses"
          ? "Expenses"
          : t("cashFlow.expenses"),
      amount: -Math.abs(analytics.cashFlow.annual.totalExpenses),
      fill: "#EF4444",
    },
    {
      name:
        t("cashFlow.netCashFlow") === "FIRBCalculator.investmentAnalytics.cashFlow.netCashFlow"
          ? "Net Cash Flow"
          : t("cashFlow.netCashFlow"),
      amount: analytics.cashFlow.annual.netCashFlow,
      fill: analytics.cashFlow.annual.netCashFlow >= 0 ? "#6366F1" : "#F59E0B",
    },
  ];

  // Expense breakdown data
  const expenseBreakdown = [
    {
      name:
        t("taxAnalysis.deductionItems.loanInterest") ===
        "FIRBCalculator.investmentAnalytics.taxAnalysis.deductionItems.loanInterest"
          ? "Loan Interest"
          : t("taxAnalysis.deductionItems.loanInterest"),
      amount: analytics.cashFlow.annual.loanRepayments,
    },
    {
      name:
        t("taxAnalysis.deductionItems.propertyManagement") ===
        "FIRBCalculator.investmentAnalytics.taxAnalysis.deductionItems.propertyManagement"
          ? "Property Management"
          : t("taxAnalysis.deductionItems.propertyManagement"),
      amount: analytics.cashFlow.annual.propertyManagement,
    },
    {
      name:
        t("taxAnalysis.deductionItems.maintenance") ===
        "FIRBCalculator.investmentAnalytics.taxAnalysis.deductionItems.maintenance"
          ? "Maintenance"
          : t("taxAnalysis.deductionItems.maintenance"),
      amount: analytics.cashFlow.annual.maintenance,
    },
    {
      name:
        t("taxAnalysis.deductionItems.landTax") ===
        "FIRBCalculator.investmentAnalytics.taxAnalysis.deductionItems.landTax"
          ? "Land Tax"
          : t("taxAnalysis.deductionItems.landTax"),
      amount: analytics.cashFlow.annual.landTax,
    },
    {
      name:
        t("taxAnalysis.deductionItems.councilRates") ===
        "FIRBCalculator.investmentAnalytics.taxAnalysis.deductionItems.councilRates"
          ? "Council Rates"
          : t("taxAnalysis.deductionItems.councilRates"),
      amount: analytics.cashFlow.annual.councilRates,
    },
    {
      name:
        t("taxAnalysis.deductionItems.insurance") ===
        "FIRBCalculator.investmentAnalytics.taxAnalysis.deductionItems.insurance"
          ? "Insurance"
          : t("taxAnalysis.deductionItems.insurance"),
      amount: analytics.cashFlow.annual.insurance,
    },
    {
      name:
        t("taxAnalysis.deductionItems.strataFees") ===
        "FIRBCalculator.investmentAnalytics.taxAnalysis.deductionItems.strataFees"
          ? "Strata Fees"
          : t("taxAnalysis.deductionItems.strataFees"),
      amount: analytics.cashFlow.annual.strataFees,
    },
    {
      name:
        t("taxAnalysis.deductionItems.other") ===
        "FIRBCalculator.investmentAnalytics.taxAnalysis.deductionItems.other"
          ? "Other"
          : t("taxAnalysis.deductionItems.other"),
      amount: analytics.cashFlow.annual.otherExpenses,
    },
  ].filter((item) => item.amount > 0);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: { name: string }; fill: string; value: number }>;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-md">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p className="text-sm" style={{ color: payload[0].fill }}>
            {currency(Math.abs(payload[0].value))}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-900">
              {t("cashFlow.annualIncome") ===
              "FIRBCalculator.investmentAnalytics.cashFlow.annualIncome"
                ? "Annual Income"
                : t("cashFlow.annualIncome")}
            </p>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {currency(analytics.cashFlow.annual.rentalIncome)}
          </p>
          <p className="text-xs text-green-600 mt-1">
            Effective: {currency(analytics.cashFlow.annual.effectiveIncome)} (
            {t("cashFlow.effectiveAfterVacancy") ===
            "FIRBCalculator.investmentAnalytics.cashFlow.effectiveAfterVacancy"
              ? "after vacancy"
              : t("cashFlow.effectiveAfterVacancy")}
            )
          </p>
        </div>

        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            <p className="text-sm font-medium text-red-900">
              {t("cashFlow.annualExpenses") ===
              "FIRBCalculator.investmentAnalytics.cashFlow.annualExpenses"
                ? "Annual Expenses"
                : t("cashFlow.annualExpenses")}
            </p>
          </div>
          <p className="text-2xl font-bold text-red-700">
            {currency(analytics.cashFlow.annual.totalExpenses)}
          </p>
          <p className="text-xs text-red-600 mt-1">
            {t("cashFlow.includingLoanRepayments") ===
            "FIRBCalculator.investmentAnalytics.cashFlow.includingLoanRepayments"
              ? "Including loan repayments"
              : t("cashFlow.includingLoanRepayments")}
          </p>
        </div>

        <div
          className={`p-4 rounded border ${
            analytics.cashFlow.annual.afterTaxCashFlow >= 0
              ? "bg-blue-50 border-blue-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign
              className={`h-5 w-5 ${
                analytics.cashFlow.annual.afterTaxCashFlow >= 0 ? "text-blue-600" : "text-amber-600"
              }`}
            />
            <p
              className={`text-sm font-medium ${
                analytics.cashFlow.annual.afterTaxCashFlow >= 0 ? "text-blue-900" : "text-amber-900"
              }`}
            >
              {t("cashFlow.afterTaxCashFlow") ===
              "FIRBCalculator.investmentAnalytics.cashFlow.afterTaxCashFlow"
                ? "After Tax Cash Flow"
                : t("cashFlow.afterTaxCashFlow")}
            </p>
          </div>
          <p
            className={`text-2xl font-bold ${
              analytics.cashFlow.annual.afterTaxCashFlow >= 0 ? "text-blue-700" : "text-amber-700"
            }`}
          >
            {currency(analytics.cashFlow.annual.afterTaxCashFlow)}
          </p>
          <p
            className={`text-xs mt-1 ${
              analytics.cashFlow.annual.afterTaxCashFlow >= 0 ? "text-blue-600" : "text-amber-600"
            }`}
          >
            {currency(analytics.cashFlow.monthly.afterTaxCashFlow)}
            {t("cashFlow.perMonth") === "FIRBCalculator.investmentAnalytics.cashFlow.perMonth"
              ? "/month"
              : t("cashFlow.perMonth")}
          </p>
        </div>
      </div>

      {/* Cash Flow Chart */}
      <div>
        <h4 className="text-sm font-semibold text-foreground/70 mb-4 uppercase tracking-wide">
          {t("cashFlow.chartTitle") === "FIRBCalculator.investmentAnalytics.cashFlow.chartTitle"
            ? "Annual Cash Flow Breakdown"
            : t("cashFlow.chartTitle")}
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {cashFlowData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Breakdown */}
      <div>
        <h4 className="text-sm font-semibold text-foreground/70 mb-4 uppercase tracking-wide">
          {t("cashFlow.expenseBreakdown") ===
          "FIRBCalculator.investmentAnalytics.cashFlow.expenseBreakdown"
            ? "Detailed Expense Breakdown"
            : t("cashFlow.expenseBreakdown")}
        </h4>
        <div className="space-y-3">
          {expenseBreakdown.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 rounded hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-sm font-semibold">{currency(item.amount)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center p-4 rounded-lg bg-red-50 border border-red-200 font-bold">
            <span>
              {t("cashFlow.totalAnnualExpenses") ===
              "FIRBCalculator.investmentAnalytics.cashFlow.totalAnnualExpenses"
                ? "Total Annual Expenses"
                : t("cashFlow.totalAnnualExpenses")}
            </span>
            <span className="text-red-700">
              {currency(analytics.cashFlow.annual.totalExpenses)}
            </span>
          </div>
        </div>
      </div>

      {/* Tax Benefit */}
      {analytics.cashFlow.annual.taxBenefit > 0 && (
        <div className="p-5 bg-green-50 border border-green-200 rounded">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-green-900 mb-1">
                {t("cashFlow.negativeGearingBenefit") ===
                "FIRBCalculator.investmentAnalytics.cashFlow.negativeGearingBenefit"
                  ? "Negative Gearing Benefit"
                  : t("cashFlow.negativeGearingBenefit")}
              </p>
              <p className="text-3xl font-bold text-green-700">
                {currency(analytics.cashFlow.annual.taxBenefit)}
              </p>
              <p className="text-sm text-green-600 mt-2">
                {currency(analytics.taxAnalysis.monthlyTaxSaving)}{" "}
                {t("cashFlow.savedPerMonth") ===
                "FIRBCalculator.investmentAnalytics.cashFlow.savedPerMonth"
                  ? "saved/month"
                  : t("cashFlow.savedPerMonth")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-green-600">
                {t("cashFlow.deductibleExpenses") ===
                "FIRBCalculator.investmentAnalytics.cashFlow.deductibleExpenses"
                  ? "Deductible Expenses"
                  : t("cashFlow.deductibleExpenses")}
              </p>
              <p className="text-lg font-semibold text-green-700">
                {currency(analytics.cashFlow.annual.deductibleExpenses)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Summary */}
      <div className="grid md:grid-cols-2 gap-4 p-5 bg-gray-50 rounded border border-gray-200">
        <div>
          <p className="text-sm text-gray-600 mb-1">
            {t("cashFlow.beforeTax") === "FIRBCalculator.investmentAnalytics.cashFlow.beforeTax"
              ? "Before Tax"
              : t("cashFlow.beforeTax")}{" "}
            <span className="text-xs text-gray-500">(per month)</span>
          </p>
          <p
            className={`text-2xl font-bold ${
              analytics.cashFlow.monthly.netCashFlow >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {currency(analytics.cashFlow.monthly.netCashFlow)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">
            {t("cashFlow.afterTax") === "FIRBCalculator.investmentAnalytics.cashFlow.afterTax"
              ? "After Tax"
              : t("cashFlow.afterTax")}{" "}
            <span className="text-xs text-gray-500">(per month)</span>
          </p>
          <p
            className={`text-2xl font-bold ${
              analytics.cashFlow.monthly.afterTaxCashFlow >= 0 ? "text-green-600" : "text-amber-600"
            }`}
          >
            {currency(analytics.cashFlow.monthly.afterTaxCashFlow)}
          </p>
        </div>
      </div>

      {/* Tax Rate Assumption */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
        <p className="text-blue-900">
          <span className="font-semibold">Tax Rate Assumption:</span>{" "}
          {analytics.taxAnalysis.marginalTaxRate}% marginal tax rate used in calculations.{" "}
          <span className="text-blue-700">
            Actual tax benefits depend on your individual tax situation and total taxable income.
          </span>
        </p>
      </div>
    </div>
  );
}
