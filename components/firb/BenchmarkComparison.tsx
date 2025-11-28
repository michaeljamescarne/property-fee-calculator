/**
 * Benchmark Comparison Component
 * Shows how user's inputs compare to market benchmarks
 */

"use client";

import { useTranslations } from "next-intl";
import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BenchmarkData } from "@/app/api/benchmarks/route";
import type { InvestmentInputs, InvestmentAnalytics } from "@/types/investment";

interface BenchmarkComparisonProps {
  benchmarkData: BenchmarkData | null;
  investmentInputs: InvestmentInputs;
  investmentAnalytics: InvestmentAnalytics;
  propertyValue: number;
  state: string;
}

export default function BenchmarkComparison({
  benchmarkData,
  investmentInputs,
  investmentAnalytics,
  propertyValue,
  state,
}: BenchmarkComparisonProps) {
  const t = useTranslations("FIRBCalculator.results.benchmarkComparison");

  // If no benchmark data, show a message
  if (!benchmarkData) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-600 mb-2">
          {t("noData") || "Benchmark data is not available for this location."}
        </p>
        <p className="text-sm text-gray-500">
          {t("noDataDescription") ||
            "We couldn't find market benchmark data for this state. The calculator will use default values."}
        </p>
      </div>
    );
  }

  // Calculate user's gross rental yield
  const userGrossYield = investmentAnalytics.rentalYield.gross;
  const benchmarkGrossYield = benchmarkData.grossRentalYield || 0;

  // Calculate user's capital growth rate
  const userCapitalGrowth = investmentInputs.capitalGrowthRate;
  const benchmarkCapitalGrowth = benchmarkData.capitalGrowth5yr || 0;

  // Calculate user's weekly rent
  const userWeeklyRent = investmentInputs.estimatedWeeklyRent;
  const benchmarkWeeklyRent = benchmarkData.medianWeeklyRent
    ? benchmarkData.medianWeeklyRent
    : Math.round((propertyValue * (benchmarkGrossYield / 100)) / 52);

  // Helper to determine comparison status
  const getComparisonStatus = (
    userValue: number,
    benchmarkValue: number,
    higherIsBetter: boolean = true
  ) => {
    if (!benchmarkValue) return null;

    const difference = userValue - benchmarkValue;
    const percentDifference = (difference / benchmarkValue) * 100;

    if (Math.abs(percentDifference) < 5) {
      return {
        status: "similar",
        icon: Minus,
        color: "text-muted-foreground",
        label: "Similar to benchmark",
      };
    }

    if (higherIsBetter) {
      if (difference > 0) {
        return {
          status: "above",
          icon: TrendingUp,
          color: "text-green-600",
          label: `${percentDifference.toFixed(1)}% above benchmark`,
        };
      } else {
        return {
          status: "below",
          icon: TrendingDown,
          color: "text-orange-600",
          label: `${Math.abs(percentDifference).toFixed(1)}% below benchmark`,
        };
      }
    } else {
      if (difference < 0) {
        return {
          status: "above",
          icon: TrendingUp,
          color: "text-green-600",
          label: `${Math.abs(percentDifference).toFixed(1)}% below benchmark`,
        };
      } else {
        return {
          status: "below",
          icon: TrendingDown,
          color: "text-orange-600",
          label: `${percentDifference.toFixed(1)}% above benchmark`,
        };
      }
    }
  };

  const yieldComparison = getComparisonStatus(userGrossYield, benchmarkGrossYield, true);
  const growthComparison = getComparisonStatus(userCapitalGrowth, benchmarkCapitalGrowth, true);
  const rentComparison = getComparisonStatus(userWeeklyRent, benchmarkWeeklyRent, true);

  return (
    <div className="space-y-6">
      {/* Rental Yield Comparison */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{t("rentalYield.title") || "Gross Rental Yield"}</h4>
          {yieldComparison && (
            <Badge variant={yieldComparison.status === "above" ? "default" : "secondary"}>
              {yieldComparison.label}
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">{t("yourInput") || "Your Input"}</p>
            <p className="text-2xl font-bold">{userGrossYield.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              ${userWeeklyRent.toLocaleString("en-AU")}/week
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-primary/5">
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {t("benchmark") || "Market Benchmark"}
            </p>
            <p className="text-2xl font-bold text-primary">{benchmarkGrossYield.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              ${benchmarkWeeklyRent.toLocaleString("en-AU")}/week
            </p>
          </div>
        </div>
        {yieldComparison && (
          <div className={`flex items-center gap-2 text-sm ${yieldComparison.color}`}>
            <yieldComparison.icon className="h-4 w-4" />
            <span>
              {yieldComparison.status === "above"
                ? t("rentalYield.above") || "Your rental yield is above the market benchmark"
                : yieldComparison.status === "below"
                  ? t("rentalYield.below") || "Your rental yield is below the market benchmark"
                  : t("rentalYield.similar") ||
                    "Your rental yield is similar to the market benchmark"}
            </span>
          </div>
        )}
      </div>

      {/* Capital Growth Comparison */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{t("capitalGrowth.title") || "Capital Growth Rate"}</h4>
          {growthComparison && (
            <Badge variant={growthComparison.status === "above" ? "default" : "secondary"}>
              {growthComparison.label}
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">{t("yourInput") || "Your Input"}</p>
            <p className="text-2xl font-bold">{userCapitalGrowth.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("capitalGrowth.perYear") || "per year"}
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-primary/5">
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {t("benchmark") || "Market Benchmark"}
            </p>
            <p className="text-2xl font-bold text-primary">{benchmarkCapitalGrowth.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("capitalGrowth.perYear") || "per year"} (5-year average)
            </p>
          </div>
        </div>
        {growthComparison && (
          <div className={`flex items-center gap-2 text-sm ${growthComparison.color}`}>
            <growthComparison.icon className="h-4 w-4" />
            <span>
              {growthComparison.status === "above"
                ? t("capitalGrowth.above") ||
                  "Your capital growth expectation is above the market benchmark"
                : growthComparison.status === "below"
                  ? t("capitalGrowth.below") ||
                    "Your capital growth expectation is below the market benchmark"
                  : t("capitalGrowth.similar") ||
                    "Your capital growth expectation is similar to the market benchmark"}
            </span>
          </div>
        )}
      </div>

      {/* Benchmark Source Info */}
      {benchmarkData.dataSource && (
        <div className="pt-4 border-t text-xs text-muted-foreground">
          <p>
            <strong>{t("dataSource") || "Data Source"}:</strong> {benchmarkData.dataSource}
          </p>
          {benchmarkData.lastUpdated && (
            <p className="mt-1">
              <strong>{t("lastUpdated") || "Last Updated"}:</strong>{" "}
              {new Date(benchmarkData.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
