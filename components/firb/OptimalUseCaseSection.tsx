/**
 * Optimal Use Case Section Component
 * Displays comparison between long-term rental and short-stay accommodation
 */

"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Home,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Info,
} from "lucide-react";
import type { UseCaseComparison } from "@/lib/firb/optimal-use-case";

interface OptimalUseCaseSectionProps {
  comparison: UseCaseComparison;
  propertyValue: number;
}

export default function OptimalUseCaseSection({
  comparison,
  propertyValue,
}: OptimalUseCaseSectionProps) {
  const t = useTranslations("FIRBCalculator.results.optimalUseCase");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const getComplexityBadge = (complexity: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      low: "default",
      medium: "secondary",
      high: "destructive",
    };
    return variants[complexity] || "secondary";
  };

  const getRiskBadge = (risk: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      low: "default",
      medium: "secondary",
      high: "destructive",
    };
    return variants[risk] || "secondary";
  };

  return (
    <div className="space-y-6">
      {/* Recommendation Alert */}
      <Alert
        className={
          comparison.recommendation.optimalUse === "longTerm"
            ? "bg-blue-50 border-blue-200"
            : comparison.recommendation.optimalUse === "shortStay"
              ? "bg-green-50 border-green-200"
              : "bg-amber-50 border-amber-200"
        }
      >
        <Info className="h-5 w-5" />
        <AlertDescription className="font-medium">
          <strong>{t("recommendation") || "Recommendation"}:</strong>{" "}
          {comparison.recommendation.optimalUse === "longTerm"
            ? t("recommendLongTerm") || "Long-term rental is recommended for this property."
            : comparison.recommendation.optimalUse === "shortStay"
              ? t("recommendShortStay") ||
                "Short-stay accommodation is recommended for this property."
              : t("recommendMixed") || "A mixed strategy may be optimal for this property."}
        </AlertDescription>
      </Alert>

      {/* Comparison Table */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Long-Term Rental */}
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              {t("longTerm.title") || "Long-Term Rental"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("longTerm.annualIncome") || "Annual Income"}:
                </span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(comparison.longTermRental.annualIncome)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("longTerm.annualExpenses") || "Annual Expenses"}:
                </span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(comparison.longTermRental.annualExpenses)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">{t("longTerm.netIncome") || "Net Income"}:</span>
                <span className="font-bold text-lg">
                  {formatCurrency(comparison.longTermRental.netIncome)}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {t("longTerm.management") || "Management Complexity"}:
                </span>
                <Badge variant={getComplexityBadge(comparison.longTermRental.managementComplexity)}>
                  {comparison.longTermRental.managementComplexity}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {t("longTerm.compliance") || "Regulatory Compliance"}:
                </span>
                <Badge variant={getComplexityBadge(comparison.longTermRental.regulatoryCompliance)}>
                  {comparison.longTermRental.regulatoryCompliance}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {t("longTerm.risk") || "Risk Level"}:
                </span>
                <Badge variant={getRiskBadge(comparison.longTermRental.riskLevel)}>
                  {comparison.longTermRental.riskLevel}
                </Badge>
              </div>
            </div>

            <p className="text-xs text-muted-foreground pt-2 border-t">
              {comparison.longTermRental.description}
            </p>
          </CardContent>
        </Card>

        {/* Short-Stay Accommodation */}
        <Card
          className={`border-2 ${
            comparison.shortStay.regulations && !comparison.shortStay.regulations.shortStayPermitted
              ? "border-red-200"
              : "border-purple-200"
          }`}
        >
          <CardHeader
            className={
              comparison.shortStay.regulations &&
              !comparison.shortStay.regulations.shortStayPermitted
                ? "bg-red-50"
                : "bg-purple-50"
            }
          >
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              {t("shortStay.title") || "Short-Stay Accommodation"}
              {comparison.shortStay.regulations &&
                !comparison.shortStay.regulations.shortStayPermitted && (
                  <Badge variant="destructive" className="ml-auto">
                    {t("shortStay.notPermitted") || "Not Permitted"}
                  </Badge>
                )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {comparison.shortStay.regulations &&
            !comparison.shortStay.regulations.shortStayPermitted ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {t("shortStay.prohibited") ||
                    "Short-stay accommodation is not permitted in this area."}
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("shortStay.annualIncome") || "Annual Income"}:
                    </span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(comparison.shortStay.annualIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("shortStay.annualExpenses") || "Annual Expenses"}:
                    </span>
                    <span className="font-semibold text-red-600">
                      {formatCurrency(comparison.shortStay.annualExpenses)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">
                      {t("shortStay.netIncome") || "Net Income"}:
                    </span>
                    <span className="font-bold text-lg">
                      {formatCurrency(comparison.shortStay.netIncome)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t("shortStay.management") || "Management Complexity"}:
                    </span>
                    <Badge variant={getComplexityBadge(comparison.shortStay.managementComplexity)}>
                      {comparison.shortStay.managementComplexity}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t("shortStay.compliance") || "Regulatory Compliance"}:
                    </span>
                    <Badge variant={getComplexityBadge(comparison.shortStay.regulatoryCompliance)}>
                      {comparison.shortStay.regulatoryCompliance}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t("shortStay.risk") || "Risk Level"}:
                    </span>
                    <Badge variant={getRiskBadge(comparison.shortStay.riskLevel)}>
                      {comparison.shortStay.riskLevel}
                    </Badge>
                  </div>
                </div>

                {/* Regulations Info */}
                {comparison.shortStay.regulations && (
                  <div className="pt-2 border-t space-y-2">
                    {comparison.shortStay.regulations.maxDaysPerYear !== null && (
                      <div className="text-xs text-muted-foreground">
                        <strong>{t("shortStay.maxDays") || "Max Days/Year"}:</strong>{" "}
                        {comparison.shortStay.regulations.maxDaysPerYear}
                      </div>
                    )}
                    {comparison.shortStay.regulations.licensingRequired && (
                      <div className="text-xs text-amber-600">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                        <strong>{t("shortStay.licensingRequired") || "Licensing Required"}</strong>
                      </div>
                    )}
                    {comparison.shortStay.regulations.complianceCostAnnual > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <strong>
                          {t("shortStay.complianceCost") || "Annual Compliance Cost"}:
                        </strong>{" "}
                        {formatCurrency(comparison.shortStay.regulations.complianceCostAnnual)}
                      </div>
                    )}
                  </div>
                )}

                <p className="text-xs text-muted-foreground pt-2 border-t">
                  {comparison.shortStay.description}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comparison Summary */}
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          {t("comparison.title") || "Income Comparison"}
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {t("comparison.incomeDifference") || "Income Difference"}
            </p>
            <p
              className={`text-2xl font-bold ${
                comparison.recommendation.incomeDifference >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(comparison.recommendation.incomeDifference)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatPercent(
                (comparison.recommendation.incomeDifference /
                  comparison.longTermRental.annualIncome) *
                  100
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {t("comparison.netDifference") || "Net Difference"}
            </p>
            <p
              className={`text-2xl font-bold ${
                comparison.recommendation.netDifference >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(comparison.recommendation.netDifference)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatPercent(
                (comparison.recommendation.netDifference / comparison.longTermRental.netIncome) *
                  100
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t("comparison.yield") || "Net Yield"}</p>
            <p className="text-2xl font-bold">
              {formatPercent(
                ((comparison.recommendation.optimalUse === "longTerm"
                  ? comparison.longTermRental.netIncome
                  : comparison.shortStay.netIncome) /
                  propertyValue) *
                  100
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Reasoning */}
      {comparison.recommendation.reasoning.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("reasoning.title") || "Analysis Reasoning"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {comparison.recommendation.reasoning.map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{reason}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
