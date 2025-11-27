"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award, CheckCircle, AlertTriangle, XCircle, TrendingUp, Users } from "lucide-react";
import type { InvestmentAnalytics } from "@/types/investment";
import { useInvestmentTranslations } from "@/lib/hooks/useInvestmentTranslations";

interface InvestmentScoreProps {
  analytics: InvestmentAnalytics;
}

// Simple circular progress component
function ScoreGauge({ score, label }: { score: number; label: string }) {
  const percentage = (score / 10) * 100;

  const getColor = () => {
    if (score >= 8) return "#10B981"; // Green
    if (score >= 6.5) return "#6366F1"; // Blue
    if (score >= 5) return "#F59E0B"; // Amber
    return "#EF4444"; // Red
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 mb-2">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="48" cy="48" r="40" fill="none" stroke="#E5E7EB" strokeWidth="8" />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke={getColor()}
            strokeWidth="8"
            strokeDasharray={`${percentage * 2.51} 251`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold" style={{ color: getColor() }}>
            {score.toFixed(1)}
          </span>
        </div>
      </div>
      <p className="text-xs text-center font-medium text-gray-600">{label}</p>
    </div>
  );
}

export default function InvestmentScore({ analytics }: InvestmentScoreProps) {
  const { t, verdict: getTranslatedVerdict } = useInvestmentTranslations();

  // Safety checks for missing analytics data
  if (!analytics || !analytics.score || !analytics.recommendation) {
    return (
      <div className="p-8 border border-gray-200 rounded bg-gray-50">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          Investment Score & Recommendation
        </h3>
        <p className="text-gray-600">
          Investment scoring data is not available. This section requires investment analytics to be
          enabled.
        </p>
      </div>
    );
  }

  const getVerdictColor = () => {
    switch (analytics.recommendation.verdict) {
      case "Excellent":
        return "bg-green-600";
      case "Good":
        return "bg-blue-600";
      case "Moderate":
        return "bg-amber-500";
      case "Poor":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const getVerdictIcon = () => {
    switch (analytics.recommendation.verdict) {
      case "Excellent":
      case "Good":
        return <CheckCircle className="h-8 w-8" />;
      case "Moderate":
        return <AlertTriangle className="h-8 w-8" />;
      default:
        return <XCircle className="h-8 w-8" />;
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm rounded bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
          <Award className="h-5 w-5 text-blue-600" />
          {t("score.title") === "FIRBCalculator.investmentAnalytics.score.title"
            ? "Investment Score"
            : t("score.title")}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {t("score.description") === "FIRBCalculator.investmentAnalytics.score.description"
            ? "Comprehensive analysis of your investment opportunity"
            : t("score.description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Overall Verdict Banner */}
        <div className={`p-6 ${getVerdictColor()} text-white rounded`}>
          <div className="flex items-center gap-4 mb-4">
            {getVerdictIcon()}
            <div>
              <p className="text-sm font-medium opacity-90 uppercase tracking-wide">
                {t("score.overallVerdict") ===
                "FIRBCalculator.investmentAnalytics.score.overallVerdict"
                  ? "Overall Verdict"
                  : t("score.overallVerdict")}
              </p>
              <p className="text-3xl font-bold">
                {getTranslatedVerdict(analytics.score.overall)}{" "}
                {t("score.investment") === "FIRBCalculator.investmentAnalytics.score.investment"
                  ? "Investment"
                  : t("score.investment")}
              </p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-5xl font-bold">{analytics.score.overall.toFixed(1)}</p>
            <p className="text-lg opacity-90">/ 10</p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-5">
            {t("score.scoreBreakdown") === "FIRBCalculator.investmentAnalytics.score.scoreBreakdown"
              ? "Score Breakdown"
              : t("score.scoreBreakdown")}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <ScoreGauge
              score={analytics.score.rentalYield}
              label={
                t("score.dimensions.rentalYield") ===
                "FIRBCalculator.investmentAnalytics.score.dimensions.rentalYield"
                  ? "Rental Yield"
                  : t("score.dimensions.rentalYield")
              }
            />
            <ScoreGauge
              score={analytics.score.capitalGrowth}
              label={
                t("score.dimensions.capitalGrowth") ===
                "FIRBCalculator.investmentAnalytics.score.dimensions.capitalGrowth"
                  ? "Capital Growth"
                  : t("score.dimensions.capitalGrowth")
              }
            />
            <ScoreGauge
              score={analytics.score.cashFlow}
              label={
                t("score.dimensions.cashFlow") ===
                "FIRBCalculator.investmentAnalytics.score.dimensions.cashFlow"
                  ? "Cash Flow"
                  : t("score.dimensions.cashFlow")
              }
            />
            <ScoreGauge
              score={analytics.score.taxEfficiency}
              label={
                t("score.dimensions.taxEfficiency") ===
                "FIRBCalculator.investmentAnalytics.score.dimensions.taxEfficiency"
                  ? "Tax Efficiency"
                  : t("score.dimensions.taxEfficiency")
              }
            />
            <ScoreGauge
              score={analytics.score.riskProfile}
              label={
                t("score.dimensions.riskProfile") ===
                "FIRBCalculator.investmentAnalytics.score.dimensions.riskProfile"
                  ? "Risk Profile"
                  : t("score.dimensions.riskProfile")
              }
            />
          </div>
        </div>

        {/* Recommendation Description */}
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {analytics.recommendation.description}
          </p>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Strengths */}
          {analytics.recommendation.strengths.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {t("score.strengths") === "FIRBCalculator.investmentAnalytics.score.strengths"
                  ? "Strengths"
                  : t("score.strengths")}
              </h4>
              <ul className="space-y-2">
                {analytics.recommendation.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span className="text-gray-600">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {analytics.recommendation.weaknesses.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                {t("score.weaknesses") === "FIRBCalculator.investmentAnalytics.score.weaknesses"
                  ? "Weaknesses"
                  : t("score.weaknesses")}
              </h4>
              <ul className="space-y-2">
                {analytics.recommendation.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-red-600 font-bold mt-0.5">✗</span>
                    <span className="text-gray-600">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Suitable For */}
        {analytics.recommendation.suitableFor.length > 0 && (
          <div className="p-5 bg-blue-50 border border-blue-200 rounded">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              {t("score.suitableFor") === "FIRBCalculator.investmentAnalytics.score.suitableFor"
                ? "Suitable For"
                : t("score.suitableFor")}
            </h4>
            <ul className="space-y-2">
              {analytics.recommendation.suitableFor.map((profile, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span className="text-gray-600">{profile}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risks to Consider */}
        {analytics.recommendation.risksToConsider.length > 0 && (
          <div className="p-5 bg-amber-50 border border-amber-200 rounded">
            <h4 className="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              {t("score.risksToConsider") ===
              "FIRBCalculator.investmentAnalytics.score.risksToConsider"
                ? "Risks to Consider"
                : t("score.risksToConsider")}
            </h4>
            <ul className="space-y-2">
              {analytics.recommendation.risksToConsider.map((risk, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-amber-600 font-bold mt-0.5">⚠</span>
                  <span className="text-amber-800">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Takeaways */}
        {analytics.recommendation.keyTakeaways.length > 0 && (
          <div className="p-5 bg-gray-50 border border-gray-200 rounded">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              {t("score.keyTakeaways") === "FIRBCalculator.investmentAnalytics.score.keyTakeaways"
                ? "Key Takeaways"
                : t("score.keyTakeaways")}
            </h4>
            <ul className="space-y-2">
              {analytics.recommendation.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-blue-600 font-bold mt-0.5">→</span>
                  <span className="text-gray-600 font-medium">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
