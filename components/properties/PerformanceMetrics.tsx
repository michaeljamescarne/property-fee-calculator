/**
 * Performance Metrics Component
 * Display property performance metrics and analytics
 */

"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, DollarSign, Percent, Home } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import type { PropertyPerformanceMetrics } from "@/lib/properties/performance";

interface PerformanceMetricsProps {
  propertyId: string;
  locale: string;
}

export default function PerformanceMetrics({ propertyId, locale }: PerformanceMetricsProps) {
  const t = useTranslations("Properties.detail.performance");
  const [metrics, setMetrics] = useState<PropertyPerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/properties/${propertyId}/performance`);
        if (!response.ok) {
          throw new Error("Failed to fetch performance metrics");
        }
        const data = await response.json();
        setMetrics(data.metrics);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [propertyId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Rental Yield */}
      {metrics.rentalYield.gross > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              {t("rentalYield.title")}
            </CardTitle>
            <CardDescription>{t("rentalYield.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("rentalYield.gross")}</p>
                <p className="text-2xl font-bold">{formatPercent(metrics.rentalYield.gross, locale)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("rentalYield.net")}</p>
                <p className="text-2xl font-bold">{formatPercent(metrics.rentalYield.net, locale)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("rentalYield.effective")}</p>
                <p className="text-2xl font-bold">
                  {formatPercent(metrics.rentalYield.effective, locale)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cash Flow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t("cashFlow.title")}
          </CardTitle>
          <CardDescription>{t("cashFlow.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t("cashFlow.annual")}</p>
              <p
                className={`text-2xl font-bold ${
                  metrics.cashFlow.annual >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {metrics.cashFlow.annual >= 0 ? "+" : ""}
                {formatCurrency(metrics.cashFlow.annual, locale)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t("cashFlow.monthly")}</p>
              <p
                className={`text-2xl font-bold ${
                  metrics.cashFlow.monthly >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {metrics.cashFlow.monthly >= 0 ? "+" : ""}
                {formatCurrency(metrics.cashFlow.monthly, locale)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t("cashFlow.cumulative")}</p>
              <p
                className={`text-2xl font-bold ${
                  metrics.cashFlow.cumulative >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {metrics.cashFlow.cumulative >= 0 ? "+" : ""}
                {formatCurrency(metrics.cashFlow.cumulative, locale)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t("cashFlow.breakdown.income")}</p>
              <p className="text-lg font-semibold text-green-600">
                +{formatCurrency(metrics.cashFlow.breakdown.income, locale)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t("cashFlow.breakdown.expenses")}
              </p>
              <p className="text-lg font-semibold text-red-600">
                -{formatCurrency(metrics.cashFlow.breakdown.expenses, locale)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t("cashFlow.breakdown.loanRepayments")}
              </p>
              <p className="text-lg font-semibold text-red-600">
                -{formatCurrency(metrics.cashFlow.breakdown.loanRepayments, locale)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROI */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t("roi.title")}
          </CardTitle>
          <CardDescription>{t("roi.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t("roi.total")}</p>
              <p className="text-2xl font-bold">{formatPercent(metrics.roi.total, locale)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t("roi.annualized")}</p>
              <p className="text-2xl font-bold">{formatPercent(metrics.roi.annualized, locale)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t("roi.cashOnCash")}</p>
              <p className="text-2xl font-bold">{formatPercent(metrics.roi.cashOnCash, locale)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capital Growth */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t("capitalGrowth.title")}
          </CardTitle>
          <CardDescription>{t("capitalGrowth.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t("capitalGrowth.total")}</p>
              <p className="text-2xl font-bold text-green-600">
                +{formatCurrency(metrics.capitalGrowth.total, locale)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t("capitalGrowth.annualRate")}</p>
              <p className="text-2xl font-bold">{formatPercent(metrics.capitalGrowth.annualRate, locale)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t("capitalGrowth.percentageGain")}
              </p>
              <p className="text-2xl font-bold text-green-600">
                +{formatPercent(metrics.capitalGrowth.percentageGain, locale)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            {t("equity.title")}
          </CardTitle>
          <CardDescription>{t("equity.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t("equity.current")}</p>
              <p className="text-2xl font-bold">{formatCurrency(metrics.equity.current, locale)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t("equity.gain")}</p>
              <p className="text-2xl font-bold text-green-600">
                +{formatCurrency(metrics.equity.gain, locale)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t("equity.lvr")}</p>
              <p className="text-2xl font-bold">{formatPercent(metrics.equity.lvr, locale)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

