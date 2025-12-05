/**
 * Comparison Table Component
 * Main comparison table wrapper displaying calculations side-by-side
 */

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
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
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["eligibility", "propertyDetails", "upfrontCosts"]));

  const sections: CollapsibleSection[] = [
    {
      id: "eligibility",
      title: t("sections.eligibility"),
      defaultOpen: true,
    },
    {
      id: "propertyDetails",
      title: t("sections.propertyDetails"),
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
      id: "investmentAnalytics",
      title: t("sections.investmentAnalytics"),
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

  return (
    <div className="space-y-4">
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
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Metric</th>
                        {calculations.map((calc, index) => {
                          const summary = getCalculationSummary(calc);
                          return (
                            <th
                              key={calc.id}
                              className="text-center py-3 px-4 font-semibold text-sm text-gray-700 min-w-[200px]"
                            >
                              <div className="font-medium">{summary.name || `Calculation ${index + 1}`}</div>
                              <div className="text-xs text-muted-foreground mt-1">{summary.address}</div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {section.id === "eligibility" && (
                        <>
                          <ComparisonRow
                            label={t("labels.eligibilityStatus")}
                            values={calculations.map((calc) => {
                              const summary = getCalculationSummary(calc);
                              return summary.eligibility;
                            })}
                          />
                          <ComparisonRow
                            label={t("labels.firbRequired")}
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
                            label={t("labels.totalUpfront")}
                            values={calculations.map((calc) => {
                              return formatCurrency(calc.calculation_data.costs.upfrontCosts.total);
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

                      {section.id === "investmentAnalytics" && (
                        <tr>
                          <td colSpan={calculations.length + 1} className="py-8 text-center text-muted-foreground">
                            Investment analytics comparison coming soon
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

