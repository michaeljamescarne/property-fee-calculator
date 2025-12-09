/**
 * Comparison Table Component
 * Main comparison table wrapper displaying calculations side-by-side
 */

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Edit } from "lucide-react";
import ComparisonRow from "./ComparisonRow";
import type { SavedCalculation } from "@/types/database";
import { getCalculationSummary } from "@/lib/calculations/storage";

interface ComparisonTableProps {
  calculations: SavedCalculation[];
  locale: string;
}

interface CollapsibleSection {
  id: string;
  title: string;
  description?: string;
  defaultOpen?: boolean;
}

export default function ComparisonTable({ calculations, locale }: ComparisonTableProps) {
  const t = useTranslations("Compare");
  const router = useRouter();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["propertyDetails", "investmentPerformance", "eligibility", "upfrontCosts"]));

  const sections: CollapsibleSection[] = [
    {
      id: "propertyDetails",
      title: t("sections.propertyDetails"),
      defaultOpen: true,
    },
    {
      id: "investmentPerformance",
      title: t("sections.investmentPerformance"),
      defaultOpen: true,
    },
    {
      id: "eligibility",
      title: t("sections.eligibility"),
      defaultOpen: true,
    },
    {
      id: "upfrontCosts",
      title: t("sections.upfrontCosts"),
      defaultOpen: true,
    },
    {
      id: "ongoingCosts",
      title: t("sections.ongoingCosts"),
    },
    {
      id: "cashFlowAnalysis",
      title: "Cash Flow Analysis",
    },
    {
      id: "projections",
      title: t("sections.projections"),
    },
    {
      id: "sensitivity",
      title: t("sections.sensitivity"),
    },
    {
      id: "taxAnalysis",
      title: t("sections.taxAnalysis"),
    },
  ];

  const toggleSection = (sectionId: string): void => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  const handleEditCalculation = (calculationId: string) => {
    router.push(`/${locale}/calculator?load=${calculationId}&edit=true`);
  };

  const getPropertyTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      newDwelling: "New Dwelling",
      established: "Established",
      vacantLand: "Vacant Land",
      commercial: "Commercial",
    };
    return labels[type] || type;
  };

  const getStateName = (state: string): string => {
    return state;
  };

  // Helper function to find best value index and generate green highlight styles
  const getBestValueStyles = (
    values: string[],
    higherIsBetter: boolean = true
  ): Array<{ textColor?: string; bgColor?: string; fontWeight?: string }> => {
    if (values.length === 0) return [];

    // Parse values to numbers, handling currency, percentages, and dashes
    const numericValues = values.map((val) => {
      if (val === "—" || val === "-" || val === "") return null;
      
      // Remove currency symbols, commas, and parse
      const cleaned = val.replace(/[$,%]/g, "").replace(/,/g, "").trim();
      const num = parseFloat(cleaned);
      return isNaN(num) ? null : num;
    });

    // Filter out null values
    const validValues = numericValues.filter((v): v is number => v !== null);
    if (validValues.length === 0) return [];

    // Find the best value index
    let bestIndex = 0;
    let bestValue = numericValues[0];

    for (let i = 1; i < numericValues.length; i++) {
      const current = numericValues[i];
      if (current === null) continue;

      if (higherIsBetter) {
        if (bestValue === null || current > bestValue) {
          bestValue = current;
          bestIndex = i;
        }
      } else {
        if (bestValue === null || current < bestValue) {
          bestValue = current;
          bestIndex = i;
        }
      }
    }

    // Only highlight if we have at least 2 valid values
    if (validValues.length < 2) {
      return values.map(() => ({}));
    }

    // Generate styles - green for best value
    return values.map((_, index) => {
      if (index === bestIndex && numericValues[index] !== null) {
        return {
          textColor: "text-green-900",
          bgColor: "bg-green-50",
          fontWeight: "font-semibold",
        };
      }
      return {};
    });
  };

  return (
    <div className="space-y-4">
      {/* Persistent sticky header row */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[600px] table-fixed">
            <colgroup>
              <col className="w-[200px]" />
              {calculations.map((calc) => (
                <col key={`col-header-${calc.id}`} className="w-[200px]" />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 bg-white w-[200px]">Property</th>
                {calculations.map((calc, index) => {
                  const summary = getCalculationSummary(calc);
                  return (
                    <th
                      key={calc.id}
                      className="text-center py-3 px-4 font-semibold text-sm text-gray-700 bg-white w-[200px]"
                    >
                      <div className="font-medium">{summary.name || `Calculation ${index + 1}`}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
          </table>
        </div>
      </div>

      {sections.map((section) => {
        const isOpen = openSections.has(section.id);

        return (
          <Card key={section.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">{section.title}</CardTitle>
                {section.description && (
                  <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleSection(section.id)}
                aria-label={isOpen ? "Collapse section" : "Expand section"}
              >
                {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </CardHeader>
            {isOpen && (
              <CardContent>
                <div className="overflow-x-auto -mx-4 px-4">
                  <table className="w-full min-w-[600px] table-fixed">
                    <colgroup>
                      <col className="w-[200px]" />
                      {calculations.map((calc) => (
                        <col key={`col-${section.id}-${calc.id}`} className="w-[200px]" />
                      ))}
                    </colgroup>
                    <tbody>
                      {section.id === "eligibility" && (
                        <>
                          <ComparisonRow
                            label={t("labels.eligibilityStatus")}
                            values={calculations.map((calc) => {
                              const eligibility = calc.calculation_data.eligibility;
                              // Determine status text based on eligibility data
                              const eligibilityAny = eligibility as any;
                              const canPurchase = eligibilityAny.canPurchase ?? eligibility.isEligible;
                              if (!canPurchase || eligibility.firbApprovalType === "notAllowed") {
                                return "Purchase Prohibited";
                              } else if (eligibility.requiresFIRB) {
                                return "FIRB Required";
                              } else {
                                return "Eligible";
                              }
                            })}
                            valueStyles={calculations.map((calc) => {
                              const eligibility = calc.calculation_data.eligibility;
                              // Apply colors based on eligibility status
                              const eligibilityAny = eligibility as any;
                              const canPurchase = eligibilityAny.canPurchase ?? eligibility.isEligible;
                              if (!canPurchase || eligibility.firbApprovalType === "notAllowed") {
                                return { textColor: "text-red-700", fontWeight: "font-semibold" };
                              } else if (eligibility.requiresFIRB) {
                                return { textColor: "text-amber-700", fontWeight: "font-semibold" };
                              } else {
                                return { textColor: "text-green-700", fontWeight: "font-semibold" };
                              }
                            })}
                          />
                          <ComparisonRow
                            label="FIRB Application Required"
                            values={calculations.map((calc) => {
                              const eligibility = calc.calculation_data.eligibility;
                              return eligibility.requiresFIRB ? "Yes" : "No";
                            })}
                          />
                        </>
                      )}

                      {section.id === "propertyDetails" && (
                        <>
                          <ComparisonRow
                            label={t("labels.propertyValue")}
                            values={calculations.map((calc) => {
                              return formatCurrency(calc.calculation_data.propertyValue);
                            })}
                          />
                          <ComparisonRow
                            label={t("labels.propertyType")}
                            values={calculations.map((calc) => {
                              return getPropertyTypeLabel(calc.calculation_data.propertyType);
                            })}
                          />
                          <ComparisonRow
                            label={t("labels.propertyState")}
                            values={calculations.map((calc) => {
                              return getStateName(calc.calculation_data.propertyState);
                            })}
                          />
                          <ComparisonRow
                            label={t("labels.propertyAddress")}
                            values={calculations.map((calc) => {
                              return calc.calculation_data.propertyAddress || "—";
                            })}
                          />
                          <ComparisonRow
                            label="Usage"
                            values={calculations.map((calc) => {
                              // Property usage is stored in analytics or calculation_data
                              // Type assertion needed as propertyUsage may be in analytics inputs
                              const calcData = calc.calculation_data as any;
                              const analytics = calcData.analytics as any;
                              const usage = analytics?.inputs?.propertyUsage || 
                                           (calcData as any).investmentInputs?.propertyUsage || 
                                           (calcData as any).propertyUsage || 
                                           "rental";
                              const usageLabels: Record<string, string> = {
                                rental: "Make available to rent",
                                primaryResidence: "Use as primary residence",
                                vacant: "Neither rent nor be used as primary residence",
                              };
                              return usageLabels[usage] || usage;
                            })}
                          />
                        </>
                      )}

                      {section.id === "investmentPerformance" && (
                        <>
                          {(() => {
                            const grossYieldValues = calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.rentalYield?.gross !== undefined) {
                                return formatPercent(analytics.rentalYield.gross);
                              }
                              return "—";
                            });
                            return (
                              <ComparisonRow
                                label={t("labels.grossRentalYield")}
                                values={grossYieldValues}
                                valueStyles={getBestValueStyles(grossYieldValues, true)}
                              />
                            );
                          })()}
                          {(() => {
                            const netYieldValues = calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.rentalYield?.net !== undefined) {
                                return formatPercent(analytics.rentalYield.net);
                              }
                              return "—";
                            });
                            return (
                              <ComparisonRow
                                label={t("labels.netRentalYield")}
                                values={netYieldValues}
                                valueStyles={getBestValueStyles(netYieldValues, true)}
                              />
                            );
                          })()}
                          {(() => {
                            const roiValues = calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.roi?.annualizedROI !== undefined) {
                                return formatPercent(analytics.roi.annualizedROI);
                              }
                              return "—";
                            });
                            return (
                              <ComparisonRow
                                label={t("labels.annualizedROI")}
                                values={roiValues}
                                valueStyles={getBestValueStyles(roiValues, true)}
                              />
                            );
                          })()}
                          {(() => {
                            const cashFlowValues = calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.cashFlow?.monthly?.afterTaxCashFlow !== undefined) {
                                return formatCurrency(analytics.cashFlow.monthly.afterTaxCashFlow);
                              }
                              return "—";
                            });
                            return (
                              <ComparisonRow
                                label={t("labels.monthlyCashFlow")}
                                values={cashFlowValues}
                                valueStyles={getBestValueStyles(cashFlowValues, true)}
                              />
                            );
                          })()}
                          {(() => {
                            const growthValues = calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.capitalGrowth?.estimatedValueAtEnd !== undefined) {
                                return formatCurrency(analytics.capitalGrowth.estimatedValueAtEnd);
                              }
                              return "—";
                            });
                            return (
                              <ComparisonRow
                                label={`${t("labels.propertyValueGrowth")} (after 10 years)`}
                                values={growthValues}
                                valueStyles={getBestValueStyles(growthValues, true)}
                              />
                            );
                          })()}
                          {(() => {
                            const equityValues = calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              // Show equity gain (difference) instead of total equity at end
                              if (analytics?.loanMetrics?.equityGain !== undefined) {
                                return formatCurrency(analytics.loanMetrics.equityGain);
                              }
                              // Fallback to equityAtEnd if equityGain not available
                              if (analytics?.loanMetrics?.equityAtEnd !== undefined) {
                                return formatCurrency(analytics.loanMetrics.equityAtEnd);
                              }
                              return "—";
                            });
                            return (
                              <ComparisonRow
                                label="Equity Gain (after 10 years)"
                                values={equityValues}
                                valueStyles={getBestValueStyles(equityValues, true)}
                              />
                            );
                          })()}
                        </>
                      )}

                      {section.id === "upfrontCosts" && (
                        <>
                          <ComparisonRow
                            label="Property Price"
                            values={calculations.map((calc) => {
                              return formatCurrency(calc.calculation_data.costs.upfrontCosts.propertyPrice);
                            })}
                          />
                          <ComparisonRow
                            label="FIRB Fee"
                            values={calculations.map((calc) => {
                              return formatCurrency(calc.calculation_data.costs.upfrontCosts.firbFee);
                            })}
                          />
                          <ComparisonRow
                            label="Stamp Duty"
                            values={calculations.map((calc) => {
                              return formatCurrency(calc.calculation_data.costs.upfrontCosts.stampDuty);
                            })}
                          />
                          <ComparisonRow
                            label="Foreign Surcharge"
                            values={calculations.map((calc) => {
                              return formatCurrency(calc.calculation_data.costs.upfrontCosts.foreignSurcharge);
                            })}
                          />
                          <ComparisonRow
                            label="Legal & Conveyancing"
                            values={calculations.map((calc) => {
                              return formatCurrency(calc.calculation_data.costs.upfrontCosts.legalFees);
                            })}
                          />
                          <ComparisonRow
                            label="Inspection Fees"
                            values={calculations.map((calc) => {
                              return formatCurrency(calc.calculation_data.costs.upfrontCosts.inspectionFees);
                            })}
                          />
                          <ComparisonRow
                            label="Loan Costs"
                            values={calculations.map((calc) => {
                              return formatCurrency(calc.calculation_data.costs.upfrontCosts.loanCosts);
                            })}
                          />
                          <ComparisonRow
                            label={t("labels.totalUpfront")}
                            values={calculations.map((calc) => {
                              return formatCurrency(calc.calculation_data.costs.upfrontCosts.total);
                            })}
                          />
                          <ComparisonRow
                            label="Total Investment Cost"
                            values={calculations.map((calc) => {
                              return formatCurrency(calc.calculation_data.costs.totalInvestmentCost);
                            })}
                            highlight
                          />
                        </>
                      )}

                      {section.id === "ongoingCosts" && (
                        <>
                          <ComparisonRow
                            label="Annual Land Tax"
                            values={calculations.map((calc) => {
                              return formatCurrency(calc.calculation_data.costs.ongoingCosts.annualLandTax);
                            })}
                          />
                          <ComparisonRow
                            label="Council Rates"
                            values={calculations.map((calc) => {
                              return formatCurrency(calc.calculation_data.costs.ongoingCosts.councilRates);
                            })}
                          />
                          <ComparisonRow
                            label="Insurance"
                            values={calculations.map((calc) => {
                              return formatCurrency(calc.calculation_data.costs.ongoingCosts.insurance);
                            })}
                          />
                          <ComparisonRow
                            label="Maintenance"
                            values={calculations.map((calc) => {
                              return formatCurrency(calc.calculation_data.costs.ongoingCosts.maintenance);
                            })}
                          />
                          <ComparisonRow
                            label="Vacancy Fee"
                            values={calculations.map((calc) => {
                              return formatCurrency(calc.calculation_data.costs.ongoingCosts.vacancyFee);
                            })}
                          />
                          <ComparisonRow
                            label={t("labels.totalOngoing")}
                            values={calculations.map((calc) => {
                              return formatCurrency(calc.calculation_data.costs.ongoingCosts.total);
                            })}
                            highlight
                          />
                        </>
                      )}

                      {section.id === "cashFlowAnalysis" && (
                        <>
                          <ComparisonRow
                            label="Annual Income"
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.cashFlow?.annual?.effectiveIncome !== undefined) {
                                return formatCurrency(analytics.cashFlow.annual.effectiveIncome);
                              }
                              return "—";
                            })}
                          />
                          <ComparisonRow
                            label="Annual Expenses"
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.cashFlow?.annual?.totalExpenses !== undefined) {
                                return formatCurrency(analytics.cashFlow.annual.totalExpenses);
                              }
                              return "—";
                            })}
                          />
                          <ComparisonRow
                            label="After Tax Cash Flow"
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.cashFlow?.annual?.afterTaxCashFlow !== undefined) {
                                return formatCurrency(analytics.cashFlow.annual.afterTaxCashFlow);
                              }
                              return "—";
                            })}
                          />
                          <ComparisonRow
                            label="Negative Gearing Benefit"
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              const taxBenefit = analytics?.cashFlow?.annual?.taxBenefit ?? analytics?.taxAnalysis?.annualTaxSaving;
                              if (taxBenefit !== undefined) {
                                return formatCurrency(taxBenefit);
                              }
                              return "—";
                            })}
                            highlight
                          />
                        </>
                      )}

                      {section.id === "projections" && (
                        <>
                          <ComparisonRow
                            label={t("labels.year5PropertyValue")}
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.yearByYear && Array.isArray(analytics.yearByYear)) {
                                const year5 = analytics.yearByYear.find((y: any) => y.year === 5);
                                if (year5?.propertyValue !== undefined) {
                                  return formatCurrency(year5.propertyValue);
                                }
                              }
                              return "—";
                            })}
                          />
                          <ComparisonRow
                            label={t("labels.year5Equity")}
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.yearByYear && Array.isArray(analytics.yearByYear)) {
                                const year5 = analytics.yearByYear.find((y: any) => y.year === 5);
                                if (year5?.equity !== undefined) {
                                  return formatCurrency(year5.equity);
                                }
                              }
                              return "—";
                            })}
                          />
                          <ComparisonRow
                            label={t("labels.year5CumulativeCashFlow")}
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.yearByYear && Array.isArray(analytics.yearByYear)) {
                                const year5 = analytics.yearByYear.find((y: any) => y.year === 5);
                                if (year5?.cumulativeCashFlow !== undefined) {
                                  return formatCurrency(year5.cumulativeCashFlow);
                                }
                              }
                              return "—";
                            })}
                          />
                          <ComparisonRow
                            label={t("labels.year10PropertyValue")}
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.yearByYear && Array.isArray(analytics.yearByYear)) {
                                const year10 = analytics.yearByYear.find((y: any) => y.year === 10);
                                if (year10?.propertyValue !== undefined) {
                                  return formatCurrency(year10.propertyValue);
                                }
                              }
                              return "—";
                            })}
                          />
                          <ComparisonRow
                            label={t("labels.year10Equity")}
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.yearByYear && Array.isArray(analytics.yearByYear)) {
                                const year10 = analytics.yearByYear.find((y: any) => y.year === 10);
                                if (year10?.equity !== undefined) {
                                  return formatCurrency(year10.equity);
                                }
                              }
                              return "—";
                            })}
                          />
                          <ComparisonRow
                            label={t("labels.year10CumulativeCashFlow")}
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.yearByYear && Array.isArray(analytics.yearByYear)) {
                                const year10 = analytics.yearByYear.find((y: any) => y.year === 10);
                                if (year10?.cumulativeCashFlow !== undefined) {
                                  return formatCurrency(year10.cumulativeCashFlow);
                                }
                              }
                              return "—";
                            })}
                            highlight
                          />
                        </>
                      )}

                      {section.id === "sensitivity" && (
                        <>
                          <ComparisonRow
                            label={t("labels.interestRateImpact")}
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.sensitivity?.interestRateImpact && Array.isArray(analytics.sensitivity.interestRateImpact) && analytics.sensitivity.interestRateImpact.length > 0) {
                                const base = analytics.sensitivity.interestRateImpact[Math.floor(analytics.sensitivity.interestRateImpact.length / 2)];
                                if (base?.netCashFlow !== undefined) {
                                  return formatCurrency(base.netCashFlow);
                                }
                              }
                              return "—";
                            })}
                          />
                          <ComparisonRow
                            label={t("labels.vacancyRateImpact")}
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.sensitivity?.vacancyImpact && Array.isArray(analytics.sensitivity.vacancyImpact) && analytics.sensitivity.vacancyImpact.length > 0) {
                                const base = analytics.sensitivity.vacancyImpact[Math.floor(analytics.sensitivity.vacancyImpact.length / 2)];
                                if (base?.annualRent !== undefined) {
                                  return formatCurrency(base.annualRent);
                                }
                              }
                              return "—";
                            })}
                          />
                          <ComparisonRow
                            label={t("labels.baseCaseScenario")}
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.roi?.annualizedROI !== undefined) {
                                return `${formatPercent(analytics.roi.annualizedROI)} ROI`;
                              }
                              return "—";
                            })}
                            highlight
                          />
                          <ComparisonRow
                            label={t("labels.worstCaseScenario")}
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.sensitivity?.growthScenarios && Array.isArray(analytics.sensitivity.growthScenarios)) {
                                const conservative = analytics.sensitivity.growthScenarios.find((s: any) => s.label?.toLowerCase().includes("conservative") || s.rate < 4);
                                if (conservative) {
                                  return `${formatPercent(conservative.annualizedROI)} ROI`;
                                }
                              }
                              return "—";
                            })}
                          />
                          <ComparisonRow
                            label={t("labels.bestCaseScenario")}
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.sensitivity?.growthScenarios && Array.isArray(analytics.sensitivity.growthScenarios)) {
                                const optimistic = analytics.sensitivity.growthScenarios.find((s: any) => s.label?.toLowerCase().includes("optimistic") || s.rate > 6);
                                if (optimistic) {
                                  return `${formatPercent(optimistic.annualizedROI)} ROI`;
                                }
                              }
                              return "—";
                            })}
                          />
                        </>
                      )}

                      {section.id === "taxAnalysis" && (
                        <>
                          <ComparisonRow
                            label={t("labels.annualTaxSavings")}
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.taxAnalysis?.annualTaxSaving !== undefined) {
                                return formatCurrency(analytics.taxAnalysis.annualTaxSaving);
                              }
                              return "—";
                            })}
                            highlight
                          />
                          <ComparisonRow
                            label={t("labels.annualDeductions")}
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.taxAnalysis?.annualDeductions?.total !== undefined) {
                                return formatCurrency(analytics.taxAnalysis.annualDeductions.total);
                              }
                              return "—";
                            })}
                          />
                          <ComparisonRow
                            label={t("labels.marginalTaxRate")}
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.taxAnalysis?.marginalTaxRate !== undefined) {
                                return formatPercent(analytics.taxAnalysis.marginalTaxRate);
                              }
                              return "—";
                            })}
                          />
                          <ComparisonRow
                            label={`${t("labels.cgtOnExit")} (sale after 10 years)`}
                            values={calculations.map((calc) => {
                              const analytics = calc.calculation_data.analytics as any;
                              if (analytics?.taxAnalysis?.cgtOnExit?.cgtAmount !== undefined) {
                                return formatCurrency(analytics.taxAnalysis.cgtOnExit.cgtAmount);
                              }
                              return "—";
                            })}
                          />
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      {/* Edit Calculation Buttons Footer */}
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full min-w-[600px] table-fixed">
          <colgroup>
            <col className="w-[200px]" />
            {calculations.map((calc) => (
              <col key={`col-footer-${calc.id}`} className="w-[200px]" />
            ))}
          </colgroup>
          <tbody>
            <tr>
              <td className="py-3 px-4 font-medium text-sm text-gray-700 w-[200px]"></td>
              {calculations.map((calc) => (
                <td key={calc.id} className="py-3 px-4 text-center w-[200px]">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleEditCalculation(calc.id)}
                    className="gap-2 rounded"
                  >
                    <Edit className="h-4 w-4" />
                    {t("editCalculation")}
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

