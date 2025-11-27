"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { BarChart3, TrendingUp } from "lucide-react";
import type { InvestmentAnalytics } from "@/types/investment";
import { useInvestmentTranslations } from "@/lib/hooks/useInvestmentTranslations";

interface InvestmentComparisonProps {
  analytics: InvestmentAnalytics;
}

export default function InvestmentComparison({ analytics }: InvestmentComparisonProps) {
  const { t, currency } = useInvestmentTranslations();

  const holdPeriod = analytics.yearByYear.length;

  // Prepare comparison data with translations
  const comparisonData = [
    {
      name:
        t("comparison.investmentTypes.property") ===
        "FIRBCalculator.investmentAnalytics.comparison.investmentTypes.property"
          ? "Property Investment"
          : t("comparison.investmentTypes.property"),
      return: analytics.comparisons.propertyInvestment.totalReturn,
      rate: analytics.comparisons.propertyInvestment.annualizedReturn,
      fill: "#6366F1",
      risk:
        t("comparison.riskLevels.medium") ===
        "FIRBCalculator.investmentAnalytics.comparison.riskLevels.medium"
          ? "Medium"
          : t("comparison.riskLevels.medium"),
    },
    {
      name:
        t("comparison.investmentTypes.stocks") ===
        "FIRBCalculator.investmentAnalytics.comparison.investmentTypes.stocks"
          ? "Stocks (ASX)"
          : t("comparison.investmentTypes.stocks"),
      return: analytics.comparisons.asxStocks.totalReturn,
      rate: analytics.comparisons.asxStocks.annualizedReturn,
      fill: "#8B5CF6",
      risk:
        t("comparison.riskLevels.high") ===
        "FIRBCalculator.investmentAnalytics.comparison.riskLevels.high"
          ? "High"
          : t("comparison.riskLevels.high"),
    },
    {
      name:
        t("comparison.investmentTypes.bonds") ===
        "FIRBCalculator.investmentAnalytics.comparison.investmentTypes.bonds"
          ? "Government Bonds"
          : t("comparison.investmentTypes.bonds"),
      return: analytics.comparisons.governmentBonds.totalReturn,
      rate: analytics.comparisons.governmentBonds.annualizedReturn,
      fill: "#3B82F6",
      risk:
        t("comparison.riskLevels.low") ===
        "FIRBCalculator.investmentAnalytics.comparison.riskLevels.low"
          ? "Low"
          : t("comparison.riskLevels.low"),
    },
    {
      name:
        t("comparison.investmentTypes.termDeposit") ===
        "FIRBCalculator.investmentAnalytics.comparison.investmentTypes.termDeposit"
          ? "Term Deposit"
          : t("comparison.investmentTypes.termDeposit"),
      return: analytics.comparisons.termDeposit.totalReturn,
      rate: analytics.comparisons.termDeposit.annualizedReturn,
      fill: "#06B6D4",
      risk:
        t("comparison.riskLevels.veryLow") ===
        "FIRBCalculator.investmentAnalytics.comparison.riskLevels.veryLow"
          ? "Very Low"
          : t("comparison.riskLevels.veryLow"),
    },
    {
      name:
        t("comparison.investmentTypes.savings") ===
        "FIRBCalculator.investmentAnalytics.comparison.investmentTypes.savings"
          ? "High Interest Savings"
          : t("comparison.investmentTypes.savings"),
      return: analytics.comparisons.highInterestSavings.totalReturn,
      rate: analytics.comparisons.highInterestSavings.annualizedReturn,
      fill: "#14B8A6",
      risk:
        t("comparison.riskLevels.veryLow") ===
        "FIRBCalculator.investmentAnalytics.comparison.riskLevels.veryLow"
          ? "Very Low"
          : t("comparison.riskLevels.veryLow"),
    },
  ].sort((a, b) => b.return - a.return);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: { name: string; return: number; rate: number; risk: string } }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-border rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{data.name}</p>
          <p className="text-sm text-green-600">
            <span className="font-medium">
              {t("comparison.yearReturn") ===
              "FIRBCalculator.investmentAnalytics.comparison.yearReturn"
                ? `${holdPeriod}-Year Return`
                : t("comparison.yearReturn", { years: holdPeriod })}
              :
            </span>{" "}
            {currency(data.return)}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">
              {t("comparison.annualRate") ===
              "FIRBCalculator.investmentAnalytics.comparison.annualRate"
                ? "Annual Rate"
                : t("comparison.annualRate")}
              :
            </span>{" "}
            {data.rate.toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">
              {t("comparison.riskLevel") ===
              "FIRBCalculator.investmentAnalytics.comparison.riskLevel"
                ? "Risk Level"
                : t("comparison.riskLevel")}
              :
            </span>{" "}
            {data.risk}
          </p>
        </div>
      );
    }
    return null;
  };

  // Find the winner
  const bestInvestment = comparisonData[0];
  const isPropertyBest = bestInvestment.name === t("comparison.investmentTypes.property");

  return (
    <Card className="border border-gray-200 shadow-sm rounded bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          {t("comparison.title") === "FIRBCalculator.investmentAnalytics.comparison.title"
            ? "Investment Comparison"
            : t("comparison.title")}
        </CardTitle>
        <CardDescription>{t("comparison.description", { years: holdPeriod })}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Winner Highlight */}
        {isPropertyBest ? (
          <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h4 className="font-bold text-green-900">
                {t("comparison.propertyLeads") ===
                "FIRBCalculator.investmentAnalytics.comparison.propertyLeads"
                  ? "Property Investment Leads!"
                  : t("comparison.propertyLeads")}
              </h4>
            </div>
            <p className="text-sm text-green-700">
              {t("comparison.propertyLeadsDesc", {
                return: currency(bestInvestment.return),
                years: holdPeriod,
                rate: bestInvestment.rate.toFixed(1),
              })}
            </p>
          </div>
        ) : (
          <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-6 w-6 text-amber-600" />
              <h4 className="font-bold text-amber-900">
                {t("comparison.comparisonResults") ===
                "FIRBCalculator.investmentAnalytics.comparison.comparisonResults"
                  ? "Comparison Results"
                  : t("comparison.comparisonResults")}
              </h4>
            </div>
            <p className="text-sm text-amber-700">
              {t("comparison.comparisonDesc", {
                best: bestInvestment.name,
                return: currency(bestInvestment.return),
                years: holdPeriod,
                propertyReturn: currency(analytics.comparisons.propertyInvestment.totalReturn),
              })}
            </p>
          </div>
        )}

        {/* Comparison Chart */}
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={comparisonData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
            <XAxis
              type="number"
              stroke="#6B7280"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#6B7280"
              width={110}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="return" radius={[0, 8, 8, 0]}>
              {comparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Detailed Comparison Table */}
        <div>
          <h4 className="text-sm font-semibold text-foreground/70 mb-3 uppercase tracking-wide">
            {t("comparison.detailedComparison") ===
            "FIRBCalculator.investmentAnalytics.comparison.detailedComparison"
              ? "Detailed Comparison"
              : t("comparison.detailedComparison")}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border/40">
                <tr>
                  <th className="text-left p-3 font-semibold">
                    {t("comparison.chartTitle") ===
                    "FIRBCalculator.investmentAnalytics.comparison.chartTitle"
                      ? "Investment Type"
                      : t("comparison.chartTitle")}
                  </th>
                  <th className="text-right p-3 font-semibold">
                    {t("comparison.annualRate") ===
                    "FIRBCalculator.investmentAnalytics.comparison.annualRate"
                      ? "Annual Rate"
                      : t("comparison.annualRate")}
                  </th>
                  <th className="text-right p-3 font-semibold">
                    {t("comparison.yearReturn", { years: holdPeriod })}
                  </th>
                  <th className="text-center p-3 font-semibold">
                    {t("comparison.riskLevel") ===
                    "FIRBCalculator.investmentAnalytics.comparison.riskLevel"
                      ? "Risk Level"
                      : t("comparison.riskLevel")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {comparisonData.map((item, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-muted/30 transition-colors ${
                      item.name === t("comparison.investmentTypes.property") ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="p-3 font-medium">
                      {item.name}
                      {item.name ===
                        (t("comparison.investmentTypes.property") ===
                        "FIRBCalculator.investmentAnalytics.comparison.investmentTypes.property"
                          ? "Property Investment"
                          : t("comparison.investmentTypes.property")) && (
                        <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                          {t("comparison.yourInvestment") ===
                          "FIRBCalculator.investmentAnalytics.comparison.yourInvestment"
                            ? "Your Investment"
                            : t("comparison.yourInvestment")}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">{item.rate.toFixed(1)}%</td>
                    <td className="p-3 text-right font-semibold" style={{ color: item.fill }}>
                      {currency(item.return)}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          item.risk === "Very Low"
                            ? "bg-green-100 text-green-700"
                            : item.risk ===
                                (t("comparison.riskLevels.low") ===
                                "FIRBCalculator.investmentAnalytics.comparison.riskLevels.low"
                                  ? "Low"
                                  : t("comparison.riskLevels.low"))
                              ? "bg-blue-100 text-blue-700"
                              : item.risk ===
                                  (t("comparison.riskLevels.medium") ===
                                  "FIRBCalculator.investmentAnalytics.comparison.riskLevels.medium"
                                    ? "Medium"
                                    : t("comparison.riskLevels.medium"))
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assumptions Note */}
        <div className="p-4 bg-muted/50 rounded-lg border border-border/40 text-sm text-muted-foreground">
          <p>
            {t("comparison.assumptions", {
              growth: analytics.capitalGrowth.annualGrowthRate.toFixed(1),
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
