"use client";

import { TrendingUp, Percent, Wallet } from "lucide-react";
import MetricCard from "./MetricCard";
import type { InvestmentAnalytics } from "@/types/investment";
import { useInvestmentTranslations } from "@/lib/hooks/useInvestmentTranslations";

interface InvestmentSummaryProps {
  analytics: InvestmentAnalytics;
}

export default function InvestmentSummary({ analytics }: InvestmentSummaryProps) {
  const { t, currency, percent } = useInvestmentTranslations();

  // Safety checks for missing analytics data
  if (!analytics || !analytics.rentalYield || !analytics.cashFlow || !analytics.roi) {
    return (
      <div className="p-8 border border-gray-200 rounded bg-gray-50">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Investment Performance Summary</h3>
        <p className="text-gray-600">
          Investment performance data is not available. This section requires investment analytics
          to be enabled.
        </p>
      </div>
    );
  }

  const getYieldTrend = (
    yieldValue: number,
    benchmark: number
  ): "good" | "neutral" | "warning" | "poor" => {
    if (yieldValue >= benchmark * 1.2) return "good";
    if (yieldValue >= benchmark * 0.9) return "neutral";
    if (yieldValue >= benchmark * 0.7) return "warning";
    return "poor";
  };

  const getCashFlowTrend = (cashFlow: number): "good" | "neutral" | "warning" | "poor" => {
    if (cashFlow >= 0) return "good";
    if (cashFlow >= -10000) return "neutral";
    if (cashFlow >= -25000) return "warning";
    return "poor";
  };

  const getROITrend = (roi: number): "good" | "neutral" | "warning" | "poor" => {
    if (roi >= 8) return "good";
    if (roi >= 6) return "neutral";
    if (roi >= 4) return "warning";
    return "poor";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl font-semibold mb-2 text-gray-900">
          {t("summary.title") === "FIRBCalculator.investmentAnalytics.summary.title"
            ? "Investment Performance Summary"
            : t("summary.title")}
        </h3>
        <p className="text-gray-600">
          {t("summary.description") === "FIRBCalculator.investmentAnalytics.summary.description"
            ? "Key metrics at a glance based on your investment assumptions"
            : t("summary.description")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Rental Yield */}
        <MetricCard
          icon={<Percent className="h-5 w-5" />}
          title={
            t("summary.grossYield") === "FIRBCalculator.investmentAnalytics.summary.grossYield"
              ? "Gross Rental Yield"
              : t("summary.grossYield")
          }
          value={percent(analytics.rentalYield.gross)}
          subtitle={`${currency(analytics.rentalYield.annualRent)} ${t("inputs.rental.perYear") === "FIRBCalculator.investmentAnalytics.inputs.rental.perYear" ? " per year" : t("inputs.rental.perYear")}`}
          trend={getYieldTrend(analytics.rentalYield.gross, analytics.rentalYield.benchmark)}
          benchmark={analytics.rentalYield.comparison}
          tooltip="Annual rental income divided by property value"
        />

        {/* Net Rental Yield */}
        <MetricCard
          icon={<Percent className="h-5 w-5" />}
          title={
            t("summary.netYield") === "FIRBCalculator.investmentAnalytics.summary.netYield"
              ? "Net Rental Yield"
              : t("summary.netYield")
          }
          value={percent(analytics.rentalYield.net)}
          subtitle={
            t("summary.afterExpenses") ===
            "FIRBCalculator.investmentAnalytics.summary.afterExpenses"
              ? "After expenses"
              : t("summary.afterExpenses")
          }
          trend={getYieldTrend(analytics.rentalYield.net, analytics.rentalYield.benchmark * 0.6)}
          benchmark={`Net of ${currency(analytics.cashFlow.annual.totalExpenses)} expenses`}
          tooltip="Net rental income after expenses divided by total investment"
        />

        {/* Annualized ROI */}
        <MetricCard
          icon={<TrendingUp className="h-5 w-5" />}
          title={
            t("summary.annualizedROI") ===
            "FIRBCalculator.investmentAnalytics.summary.annualizedROI"
              ? "Annualized ROI"
              : t("summary.annualizedROI")
          }
          value={percent(analytics.roi.annualizedROI)}
          subtitle={`${currency(analytics.roi.totalReturn)} ${
            t("summary.totalReturn") === "FIRBCalculator.investmentAnalytics.summary.totalReturn"
              ? "total return"
              : t("summary.totalReturn")
          }`}
          trend={getROITrend(analytics.roi.annualizedROI)}
          benchmark={
            analytics.roi.annualizedROI > 7.2
              ? "Beats ASX average (7.2%)"
              : "Below ASX average (7.2%)"
          }
          tooltip="Total return divided by years held"
        />

        {/* Monthly Cash Flow */}
        <MetricCard
          icon={<Wallet className="h-5 w-5" />}
          title={
            t("summary.monthlyCashFlow") ===
            "FIRBCalculator.investmentAnalytics.summary.monthlyCashFlow"
              ? "Monthly Cash Flow"
              : t("summary.monthlyCashFlow")
          }
          value={currency(analytics.cashFlow.monthly.afterTaxCashFlow)}
          subtitle={
            analytics.cashFlow.monthly.afterTaxCashFlow < 0
              ? t("summary.negativelyGeared") ===
                "FIRBCalculator.investmentAnalytics.summary.negativelyGeared"
                ? "Negatively geared"
                : t("summary.negativelyGeared")
              : t("summary.positivelyGeared") ===
                  "FIRBCalculator.investmentAnalytics.summary.positivelyGeared"
                ? "Positively geared"
                : t("summary.positivelyGeared")
          }
          trend={getCashFlowTrend(analytics.cashFlow.annual.afterTaxCashFlow)}
          benchmark={
            analytics.cashFlow.annual.taxBenefit > 0
              ? `${t("summary.taxBenefit") === "FIRBCalculator.investmentAnalytics.summary.taxBenefit" ? "Tax benefit" : t("summary.taxBenefit")}: ${currency(analytics.cashFlow.annual.taxBenefit / 12)}/mo`
              : undefined
          }
          tooltip="Monthly rental income minus all expenses and loan repayments"
        />
      </div>

      {/* Additional Highlight Metrics */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20">
          <p className="text-sm font-medium text-foreground/70 mb-1 break-words">
            {t("summary.propertyValueGrowth") ===
            "FIRBCalculator.investmentAnalytics.summary.propertyValueGrowth"
              ? "Property Value Growth"
              : t("summary.propertyValueGrowth")}
          </p>
          <p className="text-2xl font-bold text-primary">
            {currency(analytics.capitalGrowth.estimatedValueAtEnd)}
          </p>
          <p className="text-xs text-muted-foreground mt-1 break-words">
            {t("summary.afterYears") === "FIRBCalculator.investmentAnalytics.summary.afterYears"
              ? "After"
              : t("summary.afterYears")}{" "}
            {analytics.yearByYear.length}{" "}
            {t("summary.years") === "FIRBCalculator.investmentAnalytics.summary.years"
              ? "years"
              : t("summary.years")}{" "}
            (+{percent(analytics.capitalGrowth.totalPercentageGain)})
          </p>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <p className="text-sm font-medium text-foreground/70 mb-1 break-words">
            {t("summary.yourEquity") === "FIRBCalculator.investmentAnalytics.summary.yourEquity"
              ? "Your Equity"
              : t("summary.yourEquity")}
          </p>
          <p className="text-2xl font-bold text-green-700">
            {currency(analytics.loanMetrics.equityAtEnd)}
          </p>
          <p className="text-xs text-muted-foreground mt-1 break-words">
            {t("summary.equityGain") === "FIRBCalculator.investmentAnalytics.summary.equityGain"
              ? "Equity gain"
              : t("summary.equityGain")}
            : {currency(analytics.loanMetrics.equityGain)}
          </p>
        </div>

        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <p className="text-sm font-medium text-foreground/70 mb-1 break-words">
            {t("summary.taxSavings") === "FIRBCalculator.investmentAnalytics.summary.taxSavings"
              ? "Tax Savings"
              : t("summary.taxSavings")}
          </p>
          <p className="text-2xl font-bold text-amber-700">
            {currency(analytics.taxAnalysis.annualTaxSaving)}
          </p>
          <p className="text-xs text-muted-foreground mt-1 break-words">
            {t("summary.fromNegativeGearing") ===
            "FIRBCalculator.investmentAnalytics.summary.fromNegativeGearing"
              ? "From negative gearing"
              : t("summary.fromNegativeGearing")}
          </p>
        </div>
      </div>
    </div>
  );
}
