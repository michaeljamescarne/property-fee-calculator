"use client";

import { Calculator, Receipt, TrendingDown, DollarSign } from "lucide-react";
import type { InvestmentAnalytics } from "@/types/investment";
import { useInvestmentTranslations } from "@/lib/hooks/useInvestmentTranslations";

interface TaxAnalysisProps {
  analytics: InvestmentAnalytics;
}

export default function TaxAnalysis({ analytics }: TaxAnalysisProps) {
  const { t, currency } = useInvestmentTranslations();

  // Safety checks for missing analytics data
  if (!analytics || !analytics.taxAnalysis) {
    return (
      <div className="p-8 border rounded-lg bg-muted/30">
        <h3 className="text-lg font-semibold mb-4">Tax Analysis & Benefits</h3>
        <p className="text-muted-foreground">
          Tax analysis data is not available. This section requires investment analytics to be
          enabled.
        </p>
      </div>
    );
  }

  const deductions = analytics.taxAnalysis.annualDeductions;
  const cgt = analytics.taxAnalysis.cgtOnExit;

  // Deduction items (filter out zero values) with translations and descriptions
  const deductionItems = [
    {
      name:
        t("taxAnalysis.deductionItems.loanInterest") ===
        "FIRBCalculator.investmentAnalytics.taxAnalysis.deductionItems.loanInterest"
          ? "Loan Interest"
          : t("taxAnalysis.deductionItems.loanInterest"),
      amount: deductions.loanInterest,
      description: "Annual interest on investment property loan",
      icon: <Receipt className="h-4 w-4" />,
    },
    {
      name:
        t("taxAnalysis.deductionItems.propertyManagement") ===
        "FIRBCalculator.investmentAnalytics.taxAnalysis.deductionItems.propertyManagement"
          ? "Property Management"
          : t("taxAnalysis.deductionItems.propertyManagement"),
      amount: deductions.propertyManagement,
      description: "Property management fees",
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      name:
        t("taxAnalysis.deductionItems.maintenance") ===
        "FIRBCalculator.investmentAnalytics.taxAnalysis.deductionItems.maintenance"
          ? "Maintenance"
          : t("taxAnalysis.deductionItems.maintenance"),
      amount: deductions.maintenance,
      description: "Estimated annual maintenance and repairs",
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      name:
        t("taxAnalysis.deductionItems.landTax") ===
        "FIRBCalculator.investmentAnalytics.taxAnalysis.deductionItems.landTax"
          ? "Land Tax"
          : t("taxAnalysis.deductionItems.landTax"),
      amount: deductions.landTax,
      description: "Annual state land tax",
      icon: <Receipt className="h-4 w-4" />,
    },
    {
      name:
        t("taxAnalysis.deductionItems.councilRates") ===
        "FIRBCalculator.investmentAnalytics.taxAnalysis.deductionItems.councilRates"
          ? "Council Rates"
          : t("taxAnalysis.deductionItems.councilRates"),
      amount: deductions.councilRates,
      description: "Annual local council rates",
      icon: <Receipt className="h-4 w-4" />,
    },
    {
      name:
        t("taxAnalysis.deductionItems.insurance") ===
        "FIRBCalculator.investmentAnalytics.taxAnalysis.deductionItems.insurance"
          ? "Insurance"
          : t("taxAnalysis.deductionItems.insurance"),
      amount: deductions.insurance,
      description: "Building and contents insurance",
      icon: <Receipt className="h-4 w-4" />,
    },
    {
      name:
        t("taxAnalysis.deductionItems.strataFees") ===
        "FIRBCalculator.investmentAnalytics.taxAnalysis.deductionItems.strataFees"
          ? "Strata Fees"
          : t("taxAnalysis.deductionItems.strataFees"),
      amount: deductions.strataFees,
      description: "Strata or body corporate fees",
      icon: <Receipt className="h-4 w-4" />,
    },
    {
      name:
        t("taxAnalysis.deductionItems.depreciation") ===
        "FIRBCalculator.investmentAnalytics.taxAnalysis.deductionItems.depreciation"
          ? "Depreciation"
          : t("taxAnalysis.deductionItems.depreciation"),
      amount: deductions.depreciation,
      description: "Capital works and plant equipment depreciation",
      icon: <TrendingDown className="h-4 w-4" />,
    },
    {
      name:
        t("taxAnalysis.deductionItems.other") ===
        "FIRBCalculator.investmentAnalytics.taxAnalysis.deductionItems.other"
          ? "Other"
          : t("taxAnalysis.deductionItems.other"),
      amount: deductions.other,
      description: "Other annual expenses",
      icon: <DollarSign className="h-4 w-4" />,
    },
  ].filter((item) => item.amount > 0);

  return (
    <div className="space-y-8">
      {/* Tax Benefit Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm font-medium text-green-900 mb-1">
            {t("taxAnalysis.annualTaxSaving") ===
            "FIRBCalculator.investmentAnalytics.taxAnalysis.annualTaxSaving"
              ? "Annual Tax Saving"
              : t("taxAnalysis.annualTaxSaving")}
          </p>
          <p className="text-3xl font-bold text-green-700">
            {currency(analytics.taxAnalysis.annualTaxSaving)}
          </p>
          <p className="text-sm text-green-600 mt-2">
            {currency(analytics.taxAnalysis.monthlyTaxSaving)}/month{" "}
            {t("taxAnalysis.fromNegativeGearing") ===
            "FIRBCalculator.investmentAnalytics.taxAnalysis.fromNegativeGearing"
              ? "from negative gearing"
              : t("taxAnalysis.fromNegativeGearing")}
          </p>
          <p className="text-xs text-green-700 mt-2 font-medium">
            Assumed tax rate: {analytics.taxAnalysis.marginalTaxRate}%
          </p>
        </div>

        <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm font-medium text-blue-900 mb-1">
            {t("taxAnalysis.totalDeductions") ===
            "FIRBCalculator.investmentAnalytics.taxAnalysis.totalDeductions"
              ? "Total Deductions"
              : t("taxAnalysis.totalDeductions")}
          </p>
          <p className="text-3xl font-bold text-blue-700">{currency(deductions.total)}</p>
          <p className="text-sm text-blue-600 mt-2">
            {t("taxAnalysis.deductionsDesc") ===
            "FIRBCalculator.investmentAnalytics.taxAnalysis.deductionsDesc"
              ? "Tax-deductible expenses for the year"
              : t("taxAnalysis.deductionsDesc")}
          </p>
        </div>
      </div>

      {/* Deductions Breakdown */}
      <div>
        <h4 className="text-sm font-semibold text-foreground/70 mb-4 uppercase tracking-wide">
          {t("taxAnalysis.breakdownTitle") ===
          "FIRBCalculator.investmentAnalytics.taxAnalysis.breakdownTitle"
            ? "Deductions Breakdown"
            : t("taxAnalysis.breakdownTitle")}
        </h4>
        <div className="space-y-2">
          {deductionItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/20"
            >
              <div className="flex items-center gap-3">
                <div className="text-primary">{item.icon}</div>
                <span className="text-sm font-medium">
                  {item.description ? (
                    <>
                      {item.name}: <span className="text-muted-foreground">{item.description}</span>
                    </>
                  ) : (
                    item.name
                  )}
                </span>
              </div>
              <span className="text-sm font-semibold">{currency(item.amount)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center p-4 rounded-xl bg-blue-50 border border-blue-200 font-bold mt-2">
            <span className="text-blue-900">
              {t("taxAnalysis.totalDeductions") ===
              "FIRBCalculator.investmentAnalytics.taxAnalysis.totalDeductions"
                ? "Total Deductions"
                : t("taxAnalysis.totalDeductions")}
            </span>
            <span className="text-blue-700 text-lg">{currency(deductions.total)}</span>
          </div>
        </div>
      </div>

      {/* Negative Gearing Explained */}
      <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl">
        <h4 className="font-semibold text-foreground mb-3">
          {t("taxAnalysis.negativeGearing.title") ===
          "FIRBCalculator.investmentAnalytics.taxAnalysis.negativeGearing.title"
            ? "Negative Gearing Analysis"
            : t("taxAnalysis.negativeGearing.title")}
        </h4>
        <div className="space-y-3 text-sm">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <p className="text-muted-foreground mb-1">
                {t("taxAnalysis.negativeGearing.rentalIncome") ===
                "FIRBCalculator.investmentAnalytics.taxAnalysis.negativeGearing.rentalIncome"
                  ? "Rental Income"
                  : t("taxAnalysis.negativeGearing.rentalIncome")}
                :
              </p>
              <p className="font-semibold">{currency(analytics.cashFlow.annual.effectiveIncome)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">
                {t("taxAnalysis.negativeGearing.deductibleExpenses") ===
                "FIRBCalculator.investmentAnalytics.taxAnalysis.negativeGearing.deductibleExpenses"
                  ? "Deductible Expenses"
                  : t("taxAnalysis.negativeGearing.deductibleExpenses")}
                :
              </p>
              <p className="font-semibold">{currency(deductions.total)}</p>
            </div>
          </div>
          <div className="pt-3 border-t border-border/40">
            <p className="text-muted-foreground mb-1">
              {t("taxAnalysis.negativeGearing.netRentalLoss") ===
              "FIRBCalculator.investmentAnalytics.taxAnalysis.negativeGearing.netRentalLoss"
                ? "Net Rental Loss"
                : t("taxAnalysis.negativeGearing.netRentalLoss")}
              :
            </p>
            <p className="font-semibold text-red-600">
              {currency(Math.max(0, deductions.total - analytics.cashFlow.annual.effectiveIncome))}
            </p>
          </div>
          <div className="pt-3 border-t border-border/40">
            <p className="text-muted-foreground mb-1">
              {t("taxAnalysis.negativeGearing.taxBenefit") ===
              "FIRBCalculator.investmentAnalytics.taxAnalysis.negativeGearing.taxBenefit"
                ? "Tax Benefit"
                : t("taxAnalysis.negativeGearing.taxBenefit")}
              :
            </p>
            <p className="font-semibold text-green-600 text-lg">
              {currency(analytics.taxAnalysis.annualTaxSaving)}
            </p>
          </div>
        </div>
      </div>

      {/* CGT on Exit */}
      <div>
        <h4 className="text-sm font-semibold text-foreground/70 mb-4 uppercase tracking-wide">
          {t("taxAnalysis.cgtTitle") === "FIRBCalculator.investmentAnalytics.taxAnalysis.cgtTitle"
            ? "Capital Gains Tax (CGT) on Exit"
            : t("taxAnalysis.cgtTitle")}
        </h4>
        <div className="p-5 bg-muted/30 border border-border/40 rounded-xl">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("taxAnalysis.cgtItems.salePrice", { year: analytics.yearByYear.length }) ===
                `FIRBCalculator.investmentAnalytics.taxAnalysis.cgtItems.salePrice`
                  ? `Sale Price (after ${analytics.yearByYear.length} years)`
                  : t("taxAnalysis.cgtItems.salePrice", { year: analytics.yearByYear.length })}
                :
              </span>
              <span className="font-semibold">{currency(cgt.salePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("taxAnalysis.cgtItems.originalPrice") ===
                "FIRBCalculator.investmentAnalytics.taxAnalysis.cgtItems.originalPrice"
                  ? "Original Purchase Price"
                  : t("taxAnalysis.cgtItems.originalPrice")}
                :
              </span>
              <span className="font-semibold">{currency(cgt.originalPurchasePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("taxAnalysis.cgtItems.purchaseCosts") ===
                "FIRBCalculator.investmentAnalytics.taxAnalysis.cgtItems.purchaseCosts"
                  ? "Purchase Costs"
                  : t("taxAnalysis.cgtItems.purchaseCosts")}
                :
              </span>
              <span className="font-semibold">{currency(cgt.purchaseCosts)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("taxAnalysis.cgtItems.sellingCosts") ===
                "FIRBCalculator.investmentAnalytics.taxAnalysis.cgtItems.sellingCosts"
                  ? "Selling Costs"
                  : t("taxAnalysis.cgtItems.sellingCosts")}
                :
              </span>
              <span className="font-semibold">{currency(cgt.sellingCosts)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-border/40">
              <span className="text-muted-foreground">
                {t("taxAnalysis.cgtItems.costBase") ===
                "FIRBCalculator.investmentAnalytics.taxAnalysis.cgtItems.costBase"
                  ? "Cost Base"
                  : t("taxAnalysis.cgtItems.costBase")}
                :
              </span>
              <span className="font-semibold">{currency(cgt.costBase)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-border/40">
              <span className="font-medium">
                {t("taxAnalysis.cgtItems.capitalGain") ===
                "FIRBCalculator.investmentAnalytics.taxAnalysis.cgtItems.capitalGain"
                  ? "Capital Gain"
                  : t("taxAnalysis.cgtItems.capitalGain")}
                :
              </span>
              <span className="font-bold text-lg">{currency(cgt.capitalGain)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t("taxAnalysis.cgtItems.cgtRate") ===
                "FIRBCalculator.investmentAnalytics.taxAnalysis.cgtItems.cgtRate"
                  ? "CGT Rate"
                  : t("taxAnalysis.cgtItems.cgtRate")}
                :
              </span>
              <span className="font-semibold">{cgt.cgtRate}%</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span className="font-medium">
                {t("taxAnalysis.cgtItems.cgtPayable") ===
                "FIRBCalculator.investmentAnalytics.taxAnalysis.cgtItems.cgtPayable"
                  ? "CGT Payable"
                  : t("taxAnalysis.cgtItems.cgtPayable")}
                :
              </span>
              <span className="font-bold text-lg">{currency(cgt.cgtAmount)}</span>
            </div>
            <div className="flex justify-between text-amber-600">
              <span className="font-medium">
                {t("taxAnalysis.cgtItems.withholdingTax") ===
                "FIRBCalculator.investmentAnalytics.taxAnalysis.cgtItems.withholdingTax"
                  ? "Withholding Tax"
                  : t("taxAnalysis.cgtItems.withholdingTax")}
                :
              </span>
              <span className="font-semibold">{currency(cgt.withholdingTax)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t-2 border-border/60">
              <span className="font-bold text-foreground">
                {t("taxAnalysis.cgtItems.netProceeds") ===
                "FIRBCalculator.investmentAnalytics.taxAnalysis.cgtItems.netProceeds"
                  ? "Net Proceeds After Tax"
                  : t("taxAnalysis.cgtItems.netProceeds")}
                :
              </span>
              <span className="font-bold text-green-700 text-xl">
                {currency(cgt.netProceedsAfterTax)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Planning Note */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
        <p className="text-blue-900">
          {t("taxAnalysis.taxPlanningTip") ===
          "FIRBCalculator.investmentAnalytics.taxAnalysis.taxPlanningTip"
            ? "Tax planning tip: Consider speaking with a qualified tax advisor to optimize your investment structure and maximize tax benefits. Tax laws and rates can change, affecting your calculations."
            : t("taxAnalysis.taxPlanningTip")}
        </p>
      </div>
    </div>
  );
}
