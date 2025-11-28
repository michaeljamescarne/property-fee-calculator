/**
 * Financial Details Step Component
 * Collects financial information for investment analysis
 */

"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  Home,
  Calculator,
  Sparkles,
  Loader2,
  TrendingDown,
  TrendingUp as TrendingUpIcon,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { InvestmentInputs } from "@/types/investment";
import type { BenchmarkData } from "@/app/api/benchmarks/route";

interface FinancialDetailsStepProps {
  investmentInputs: Partial<InvestmentInputs>;
  onInvestmentInputsChange: (updates: Partial<InvestmentInputs>) => void;
  propertyValue: number;
  depositPercent: number;
  benchmarkData?: BenchmarkData | null;
  isLoadingBenchmarks?: boolean;
  errors?: Record<string, boolean>;
}

export default function FinancialDetailsStep({
  investmentInputs,
  onInvestmentInputsChange,
  propertyValue,
  depositPercent,
  benchmarkData,
  isLoadingBenchmarks = false,
  errors = {},
}: FinancialDetailsStepProps) {
  const t = useTranslations("FIRBCalculator.financialDetails");

  // Calculate loan amount (use custom values if set, otherwise calculate from propertyValue and depositPercent)
  const calculatedDepositAmount = propertyValue * (depositPercent / 100);
  const loanAmount = investmentInputs.loanAmount ?? propertyValue - calculatedDepositAmount;

  // Default values - ensure we use the actual input value, not a fallback
  // Use the input value if it exists (even if 0), otherwise calculate default
  const weeklyRent =
    investmentInputs.estimatedWeeklyRent !== undefined &&
    investmentInputs.estimatedWeeklyRent !== null
      ? investmentInputs.estimatedWeeklyRent
      : Math.round((propertyValue * 0.04) / 52);
  const capitalGrowthRate = investmentInputs.capitalGrowthRate || 6;
  const interestRate = investmentInputs.interestRate || 6.5;
  const councilRates = investmentInputs.annualMaintenanceCost || 0; // This will be updated to use council rates

  return (
    <Card className="border border-gray-200 shadow-sm rounded bg-white">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-semibold flex items-center gap-2 text-gray-900">
          <Calculator className="h-6 w-6 text-blue-600" />
          {t("title") || "Financial Details"}
        </CardTitle>
        <CardDescription className="text-base mt-2 text-gray-600">
          {t("description") || "Enter financial details for investment analysis"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rental Income */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-gray-600" />
            <Label className="text-base font-semibold text-gray-900">
              {t("rental.title") || "Rental Income"}
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weekly-rent" className="text-sm text-gray-900">
              {t("rental.weeklyRent") || "Estimated Weekly Rent"}{" "}
              <span className="text-red-600">*</span>
            </Label>
            {errors.estimatedWeeklyRent && (
              <div className="flex items-center gap-2 p-3 rounded bg-red-50 border border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600">Please enter a valid weekly rent amount</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">$</span>
              <Input
                id="weekly-rent"
                type="number"
                value={weeklyRent || ""}
                onChange={(e) => {
                  const value = e.target.value === "" ? undefined : Number(e.target.value);
                  onInvestmentInputsChange({
                    estimatedWeeklyRent: value !== undefined && !isNaN(value) ? value : undefined,
                  });
                }}
                className={`flex-1 rounded ${errors.estimatedWeeklyRent ? "border-red-500 focus:ring-red-500" : ""}`}
                placeholder="e.g., 500"
              />
              <span className="text-sm text-gray-600 whitespace-nowrap">
                (${(weeklyRent * 52).toLocaleString("en-AU")} per year)
              </span>
            </div>

            {/* Benchmark Suggestion for Rental Yield */}
            {isLoadingBenchmarks && (
              <div className="flex items-center gap-2 p-3 rounded bg-gray-50 border border-gray-200">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                <span className="text-sm text-gray-600">
                  {t("rental.benchmark.loading") || "Loading benchmark data..."}
                </span>
              </div>
            )}

            {!isLoadingBenchmarks &&
              benchmarkData?.grossRentalYield !== undefined &&
              benchmarkData.grossRentalYield !== null && (
                <div className="p-3 rounded bg-blue-600/10 border-2 border-blue-600/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">
                        {benchmarkData.level === "suburb"
                          ? t("rental.benchmark.suburb") || "Suburb"
                          : t("rental.benchmark.state") || "State"}{" "}
                        {t("rental.benchmark.available") || "Benchmark Available"}
                      </span>
                    </div>
                    {Math.round((propertyValue * (benchmarkData.grossRentalYield / 100)) / 52) ===
                      weeklyRent && (
                      <Badge variant="default" className="text-xs">
                        {t("rental.benchmark.using") || "Using benchmark"}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-2 rounded bg-background border">
                      <p className="text-xs text-gray-600 mb-1">
                        {t("rental.benchmark.marketBenchmark") || "Market Benchmark"}
                      </p>
                      <p className="font-semibold text-sm">
                        ${Math.round((propertyValue * (benchmarkData.grossRentalYield / 100)) / 52)}
                        /week
                      </p>
                      <p className="text-xs text-gray-600">
                        ({benchmarkData.grossRentalYield.toFixed(2)}%{" "}
                        {t("rental.benchmark.yield") || "yield"})
                      </p>
                    </div>

                    <div className="p-2 rounded bg-background border">
                      <p className="text-xs text-gray-600 mb-1">
                        {t("rental.benchmark.yourInput") || "Your Input"}
                      </p>
                      <p className="font-semibold text-sm">${weeklyRent}/week</p>
                      <p className="text-xs text-gray-600">
                        ({(((weeklyRent * 52) / propertyValue) * 100).toFixed(2)}%{" "}
                        {t("rental.benchmark.yield") || "yield"})
                      </p>
                    </div>
                  </div>

                  {Math.round((propertyValue * (benchmarkData.grossRentalYield / 100)) / 52) !==
                    weeklyRent && (
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full mt-2"
                      onClick={() => {
                        const benchmarkWeeklyRent = Math.round(
                          (propertyValue * (benchmarkData.grossRentalYield! / 100)) / 52
                        );
                        onInvestmentInputsChange({ estimatedWeeklyRent: benchmarkWeeklyRent });
                      }}
                    >
                      <Sparkles className="h-3 w-3 mr-2" />
                      {t("rental.benchmark.useBenchmark") || "Use Market Benchmark"}
                    </Button>
                  )}
                </div>
              )}

            {!isLoadingBenchmarks &&
              (!benchmarkData ||
                benchmarkData?.grossRentalYield === undefined ||
                benchmarkData?.grossRentalYield === null) && (
                <div className="p-2 rounded bg-gray-50/30 border border-gray-200">
                  <p className="text-xs text-gray-600">
                    {t("rental.benchmark.noData") ||
                      "No benchmark data available for this location. Enter your estimated weekly rent above."}
                  </p>
                </div>
              )}
            <p className="text-xs text-gray-600">
              {t("rental.help") ||
                "Based on similar properties in the area. You can adjust this later."}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-900">
              {t("rental.vacancyRate") || "Vacancy Rate"}: {investmentInputs.vacancyRate || 5}%
            </Label>
            <Slider
              value={[investmentInputs.vacancyRate || 5]}
              onValueChange={(value) => onInvestmentInputsChange({ vacancyRate: value[0] })}
              min={0}
              max={20}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-gray-600">
              {t("rental.vacancyHelp") ||
                "Typical: 3-5% for good locations, 7-10% for high-risk areas"}
            </p>
          </div>
        </div>

        {/* Capital Growth */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gray-600" />
            <Label className="text-base font-semibold text-gray-900">
              {t("growth.title") || "Capital Growth Projections"}
            </Label>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-gray-900">
              {t("growth.rate") || "Expected Annual Capital Growth"}: {capitalGrowthRate}%
            </Label>
            <Slider
              value={[capitalGrowthRate]}
              onValueChange={(value) => onInvestmentInputsChange({ capitalGrowthRate: value[0] })}
              min={0}
              max={15}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>{t("growth.conservative") || "Conservative (4%)"}</span>
              <span>{t("growth.moderate") || "Moderate (6%)"}</span>
              <span>{t("growth.optimistic") || "Optimistic (8%)"}</span>
            </div>

            {/* Benchmark Suggestion for Capital Growth */}
            {isLoadingBenchmarks && (
              <div className="flex items-center gap-2 p-3 rounded bg-gray-50/50 border border-gray-200">
                <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                <span className="text-sm text-gray-600">
                  {t("growth.benchmark.loading") || "Loading benchmark data..."}
                </span>
              </div>
            )}

            {!isLoadingBenchmarks &&
              benchmarkData?.capitalGrowth5yr !== undefined &&
              benchmarkData.capitalGrowth5yr !== null && (
                <div className="p-3 rounded bg-blue-600/10 border-2 border-blue-600/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">
                        {benchmarkData.level === "suburb"
                          ? t("growth.benchmark.suburb") || "Suburb"
                          : t("growth.benchmark.state") || "State"}{" "}
                        {t("growth.benchmark.available") || "Benchmark Available"}
                      </span>
                    </div>
                    {Math.abs(benchmarkData.capitalGrowth5yr - capitalGrowthRate) < 0.1 && (
                      <Badge variant="default" className="text-xs">
                        {t("growth.benchmark.using") || "Using benchmark"}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-2 rounded bg-background border">
                      <p className="text-xs text-gray-600 mb-1">
                        {t("growth.benchmark.marketBenchmark") || "Market Benchmark"}
                      </p>
                      <p className="font-semibold text-sm">
                        {benchmarkData.capitalGrowth5yr}%{" "}
                        {t("growth.benchmark.perYear") || "per year"}
                      </p>
                      <p className="text-xs text-gray-600">
                        ({t("growth.benchmark.fiveYearAverage") || "5-year average"})
                      </p>
                    </div>

                    <div className="p-2 rounded bg-background border">
                      <p className="text-xs text-gray-600 mb-1">
                        {t("growth.benchmark.yourInput") || "Your Input"}
                      </p>
                      <p className="font-semibold text-sm">
                        {capitalGrowthRate}% {t("growth.benchmark.perYear") || "per year"}
                      </p>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        {capitalGrowthRate > benchmarkData.capitalGrowth5yr ? (
                          <>
                            <TrendingUpIcon className="h-3 w-3 text-green-600" />
                            {t("growth.benchmark.aboveBenchmark") || "Above benchmark"}
                          </>
                        ) : capitalGrowthRate < benchmarkData.capitalGrowth5yr ? (
                          <>
                            <TrendingDown className="h-3 w-3 text-orange-600" />
                            {t("growth.benchmark.belowBenchmark") || "Below benchmark"}
                          </>
                        ) : (
                          t("growth.benchmark.matchesBenchmark") || "Matches benchmark"
                        )}
                      </p>
                    </div>
                  </div>

                  {Math.abs(benchmarkData.capitalGrowth5yr - capitalGrowthRate) >= 0.1 && (
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full mt-2"
                      onClick={() => {
                        onInvestmentInputsChange({
                          capitalGrowthRate: benchmarkData.capitalGrowth5yr!,
                        });
                      }}
                    >
                      <Sparkles className="h-3 w-3 mr-2" />
                      {t("growth.benchmark.useBenchmark") || "Use Market Benchmark"}
                    </Button>
                  )}
                </div>
              )}

            {!isLoadingBenchmarks &&
              (!benchmarkData ||
                benchmarkData?.capitalGrowth5yr === undefined ||
                benchmarkData?.capitalGrowth5yr === null) && (
                <div className="p-2 rounded bg-gray-50/30 border border-gray-200">
                  <p className="text-xs text-gray-600">
                    {t("growth.benchmark.noData") ||
                      "No benchmark data available for this location. Adjust the slider above based on your expectations."}
                  </p>
                </div>
              )}
            <p className="text-xs text-gray-600">
              {t("growth.help") ||
                "Historical average: 6% per year. Adjust based on your expectations."}
            </p>
          </div>
        </div>

        {/* Loan Details */}
        {loanAmount > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-600" />
              <Label className="text-base font-semibold text-gray-900">
                {t("loan.title") || "Loan Details"}
              </Label>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="loan-amount" className="text-sm text-gray-900">
                  {t("loan.amount") || "Loan Amount"}
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-medium">$</span>
                  <Input
                    id="loan-amount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) =>
                      onInvestmentInputsChange({
                        loanAmount: Number(e.target.value) || 0,
                      })
                    }
                    className="flex-1 rounded"
                    placeholder="e.g., 1600000"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="deposit-amount" className="text-sm text-gray-900">
                  {t("loan.deposit") || "Deposit"}
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-medium">$</span>
                  <Input
                    id="deposit-amount"
                    type="number"
                    value={calculatedDepositAmount}
                    onChange={(e) => {
                      // Calculate loan amount based on new deposit
                      const newDeposit = Number(e.target.value) || 0;
                      const newLoan = propertyValue - newDeposit;
                      onInvestmentInputsChange({
                        loanAmount: newLoan,
                      });
                    }}
                    className="flex-1 rounded"
                    placeholder="e.g., 400000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-900">
                  {t("loan.interestRate") || "Interest Rate"}: {interestRate}%
                </Label>
                <Slider
                  value={[interestRate]}
                  onValueChange={(value) => onInvestmentInputsChange({ interestRate: value[0] })}
                  min={3}
                  max={12}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-gray-600">
                  {t("loan.interestHelp") || "Current market rates: 5.5-7.5%"}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-900">
                  {t("loan.term") || "Loan Term"}: {investmentInputs.loanTerm || 30} years
                </Label>
                <Slider
                  value={[investmentInputs.loanTerm || 30]}
                  onValueChange={(value) => onInvestmentInputsChange({ loanTerm: value[0] })}
                  min={15}
                  max={30}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="flex items-center space-x-2 p-3 rounded border bg-white">
                <Checkbox
                  id="interest-only"
                  checked={investmentInputs.loanType === "interestOnly"}
                  onCheckedChange={(checked) =>
                    onInvestmentInputsChange({
                      loanType: checked ? "interestOnly" : "principalAndInterest",
                    })
                  }
                />
                <label
                  htmlFor="interest-only"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {t("loan.interestOnly") || "Interest-only loan (for first 5 years)"}
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Council Rates */}
        <div className="space-y-2">
          <Label htmlFor="council-rates" className="text-base font-semibold text-gray-900">
            {t("councilRates") || "Annual Council Rates (Optional)"}
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">$</span>
            <Input
              id="council-rates"
              type="number"
              value={councilRates}
              onChange={(e) =>
                onInvestmentInputsChange({
                  annualMaintenanceCost: Number(e.target.value) || 0,
                })
              }
              className="flex-1"
              placeholder="e.g., 2000"
            />
          </div>
          <p className="text-xs text-gray-600">
            {t("councilRatesHelp") ||
              "Typical: $1,500-$3,000 per year. Leave blank to use estimate."}
          </p>
        </div>

        {/* Property Management */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-3 rounded border bg-white">
            <Checkbox
              id="self-managed"
              checked={investmentInputs.selfManaged || false}
              onCheckedChange={(checked) =>
                onInvestmentInputsChange({
                  selfManaged: checked as boolean,
                })
              }
            />
            <label
              htmlFor="self-managed"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              {t("selfManaged") || "I will self-manage this property (no management fees)"}
            </label>
          </div>

          {!investmentInputs.selfManaged && (
            <div className="space-y-2">
              <Label className="text-sm text-gray-900">
                {t("managementFee") || "Property Management Fee"}:{" "}
                {investmentInputs.propertyManagementFee || 8}%
              </Label>
              <Slider
                value={[investmentInputs.propertyManagementFee || 8]}
                onValueChange={(value) =>
                  onInvestmentInputsChange({ propertyManagementFee: value[0] })
                }
                min={5}
                max={12}
                step={0.5}
                className="w-full"
              />
              <p className="text-xs text-gray-600">
                {t("managementFeeHelp") || "Typical: 7-9% of rental income"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
