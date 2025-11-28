"use client";

import { TrendingUp, Percent, Wallet, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomAlert } from "@/components/ui/custom-alert";
import MetricCard from "./MetricCard";
import type { InvestmentAnalytics } from "@/types/investment";
import type { CostBreakdown } from "@/lib/firb/calculations";
import type { EligibilityResult } from "@/lib/firb/eligibility";
import { useInvestmentTranslations } from "@/lib/hooks/useInvestmentTranslations";
import { useTranslations } from "next-intl";

interface InvestmentSummaryProps {
  analytics: InvestmentAnalytics;
  costs?: CostBreakdown;
  eligibility?: EligibilityResult;
}

export default function InvestmentSummary({
  analytics,
  costs,
  eligibility,
}: InvestmentSummaryProps) {
  const { t, currency, percent } = useInvestmentTranslations();
  const tCosts = useTranslations("FIRBCalculator.results.costs");
  const tEligibility = useTranslations("FIRBCalculator.results.eligibility");
  const tResults = useTranslations("FIRBCalculator.results");

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

  const getROITrend = (
    roi: number,
    asxAverage: number = 7.2
  ): "good" | "neutral" | "warning" | "poor" => {
    // Compare against ASX average (7.2%)
    if (roi >= asxAverage * 1.1) return "good"; // 10% above ASX average
    if (roi >= asxAverage * 0.95) return "neutral"; // Within 5% of ASX average
    if (roi >= asxAverage * 0.8) return "warning"; // 20% below ASX average
    return "poor"; // More than 20% below ASX average
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getFIRBStatus = () => {
    if (!eligibility) return null;
    if (!eligibility.canPurchase) {
      return {
        text:
          tEligibility("approval.prohibited") ===
          "FIRBCalculator.results.eligibility.approval.prohibited"
            ? "FIRB Not Allowed"
            : tEligibility("approval.prohibited"),
        variant: "default" as const,
        className: "bg-red-500 text-white",
        cardBg: "bg-red-50",
        cardBorder: "border-red-200",
        textColor: "text-red-900",
        valueColor: "text-red-600",
        description:
          tEligibility("approval.prohibitedDesc") ===
          "FIRBCalculator.results.eligibility.approval.prohibitedDesc"
            ? "This purchase is not permitted"
            : tEligibility("approval.prohibitedDesc"),
      };
    }
    if (eligibility.requiresFIRB) {
      return {
        text:
          tEligibility("approval.required") ===
          "FIRBCalculator.results.eligibility.approval.required"
            ? "FIRB Required"
            : tEligibility("approval.required"),
        variant: "default" as const,
        className: "bg-amber-500 text-white",
        cardBg: "bg-amber-50",
        cardBorder: "border-amber-200",
        textColor: "text-amber-900",
        valueColor: "text-amber-600",
        description:
          tEligibility("approval.requiredDesc") ===
          "FIRBCalculator.results.eligibility.approval.requiredDesc"
            ? "FIRB approval is required before purchase"
            : tEligibility("approval.requiredDesc"),
      };
    }
    return {
      text:
        tEligibility("approval.notRequired") ===
        "FIRBCalculator.results.eligibility.approval.notRequired"
          ? "FIRB Not Required"
          : tEligibility("approval.notRequired"),
      variant: "default" as const,
      className: "bg-green-500 text-white",
      cardBg: "bg-green-50",
      cardBorder: "border-green-200",
      textColor: "text-green-900",
      valueColor: "text-green-600",
      description:
        tEligibility("approval.notRequiredDesc") ===
        "FIRBCalculator.results.eligibility.approval.notRequiredDesc"
          ? "You can proceed without FIRB approval"
          : tEligibility("approval.notRequiredDesc"),
    };
  };

  const firbStatus = getFIRBStatus();

  return (
    <Card className="border border-gray-200 shadow-sm rounded bg-white">
      <CardHeader>
        <CardTitle className="text-3xl font-semibold text-gray-900">
          {t("summary.title") === "FIRBCalculator.investmentAnalytics.summary.title"
            ? "Investment Performance Summary"
            : t("summary.title")}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {t("summary.description") === "FIRBCalculator.investmentAnalytics.summary.description"
            ? "Key metrics at a glance based on your investment assumptions"
            : t("summary.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Additional Summary Cards */}
        {(costs || firbStatus) && (
          <div className="grid md:grid-cols-3 gap-4">
            {costs && (
              <>
                <div className="p-6 bg-gray-50 border border-gray-200 rounded">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {tCosts("totalInvestment") || "Total Investment Cost"}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(costs.totalInvestmentCost)}
                  </p>
                  <div className="text-sm text-gray-600 mt-2 space-y-1">
                    <p>
                      {tCosts("propertyPrice") || "Property Price"}:{" "}
                      {formatCurrency(costs.upfrontCosts.propertyPrice)}
                    </p>
                    <p>
                      {tCosts("upfrontCosts") || "Upfront Costs"}:{" "}
                      {formatCurrency(costs.upfrontCosts.total)}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border border-gray-200 rounded">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {tCosts("annualOngoing") || "Annual Ongoing Costs"}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(costs.ongoingCosts.total)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {tCosts("annualOngoingNote") || "These costs recur every year"}
                  </p>
                </div>
              </>
            )}

            {firbStatus && (
              <div className={`p-6 ${firbStatus.cardBg} border ${firbStatus.cardBorder} rounded`}>
                <p className="text-sm font-medium text-gray-900 mb-1">FIRB Status</p>
                <div className="mt-2">
                  <Badge
                    variant={firbStatus.variant}
                    className={`text-base px-3 py-1.5 rounded-full ${firbStatus.className}`}
                  >
                    {firbStatus.text}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-3">{firbStatus.description}</p>
              </div>
            )}
          </div>
        )}

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
            trend={getROITrend(analytics.roi.annualizedROI, 7.2)}
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
          <div className="p-4 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm font-medium text-gray-700 mb-1 break-words">
              {t("summary.propertyValueGrowth") ===
              "FIRBCalculator.investmentAnalytics.summary.propertyValueGrowth"
                ? "Property Value Growth"
                : t("summary.propertyValueGrowth")}
            </p>
            <p className="text-2xl font-bold text-blue-700">
              {currency(analytics.capitalGrowth.estimatedValueAtEnd)}
            </p>
            <p className="text-xs text-gray-600 mt-1 break-words">
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

          <div className="p-4 bg-green-50 rounded border border-green-200">
            <p className="text-sm font-medium text-gray-700 mb-1 break-words">
              {t("summary.yourEquity") === "FIRBCalculator.investmentAnalytics.summary.yourEquity"
                ? "Your Equity"
                : t("summary.yourEquity")}
            </p>
            <p className="text-2xl font-bold text-green-700">
              {currency(analytics.loanMetrics.equityAtEnd)}
            </p>
            <p className="text-xs text-gray-600 mt-1 break-words">
              {t("summary.afterYears") === "FIRBCalculator.investmentAnalytics.summary.afterYears"
                ? "After"
                : t("summary.afterYears")}{" "}
              {analytics.yearByYear.length}{" "}
              {t("summary.years") === "FIRBCalculator.investmentAnalytics.summary.years"
                ? "years"
                : t("summary.years")}
              <br />
              {t("summary.equityGain") === "FIRBCalculator.investmentAnalytics.summary.equityGain"
                ? "Equity gain"
                : t("summary.equityGain")}
              : {currency(analytics.loanMetrics.equityGain)}
            </p>
          </div>

          <div className="p-4 bg-amber-50 rounded border border-amber-200">
            <p className="text-sm font-medium text-gray-700 mb-1 break-words">
              {t("summary.taxSavings") === "FIRBCalculator.investmentAnalytics.summary.taxSavings"
                ? "Tax Savings"
                : t("summary.taxSavings")}
            </p>
            <p className="text-2xl font-bold text-amber-700">
              {currency(analytics.taxAnalysis.annualTaxSaving)}
            </p>
            <p className="text-xs text-gray-600 mt-1 break-words">
              Annual{" "}
              {t("summary.fromNegativeGearing") ===
              "FIRBCalculator.investmentAnalytics.summary.fromNegativeGearing"
                ? "From negative gearing"
                : t("summary.fromNegativeGearing")}
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <CustomAlert
          variant="default"
          icon={<Info className="h-4 w-4" />}
          title={tResults("disclaimer.title")}
        >
          <p className="text-sm">{tResults("disclaimer.content")}</p>
        </CustomAlert>
      </CardContent>
    </Card>
  );
}
