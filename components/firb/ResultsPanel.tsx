/**
 * Results Panel Component
 * Displays eligibility verdict and cost breakdown
 */

"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useReactToPrint } from "react-to-print";
import { trackConversion } from "@/components/analytics/GoogleAnalytics";
import { trackMetaEvent } from "@/components/analytics/MetaPixel";
import { initializeUTMTracking, getUTMParamsForAnalytics } from "@/lib/utils/utm-tracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomAlert } from "@/components/ui/custom-alert";
import { Download, Mail, Edit, Info, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { EligibilityResult } from "@/lib/firb/eligibility";
import { CostBreakdown } from "@/lib/firb/calculations";
import { PropertyType, AustralianState } from "@/lib/firb/constants";
import {
  generateDefaultInputs,
  calculateInvestmentAnalytics,
} from "@/lib/firb/investment-analytics";
import type { InvestmentInputs, InvestmentAnalytics } from "@/types/investment";
import type { FIRBCalculatorFormData } from "@/lib/validations/firb";
import type { CalculationData } from "@/types/database";
import InvestmentSummary from "./InvestmentSummary";
import CashFlowAnalysis from "./CashFlowAnalysis";
import ProjectionChart from "./ProjectionChart";
import SensitivityAnalysis from "./SensitivityAnalysis";
import TaxAnalysis from "./TaxAnalysis";
import OptimalUseCaseSection from "./OptimalUseCaseSection";
import SaveCalculationButton from "./SaveCalculationButton";
import LoginModal from "@/components/auth/LoginModal";
import EligibilityResultCard from "./EligibilityResultCard";
import PrintableReport from "./PrintableReport";
import { calculateOptimalUseCase, getDefaultOccupancyRate } from "@/lib/firb/optimal-use-case";
import type { ShortStayRegulation } from "@/lib/firb/optimal-use-case";
import type { BenchmarkData } from "@/app/api/benchmarks/route";

interface ResultsPanelProps {
  eligibility: EligibilityResult;
  costs: CostBreakdown;
  onDownloadPDF: (analytics?: InvestmentAnalytics) => void;
  onEmailResults: () => void;
  onEditCalculation: () => void;
  onEditInvestmentInputs: () => void;
  onStartAgain: () => void;
  propertyValue: number;
  propertyType: PropertyType;
  state: AustralianState;
  depositPercent: number;
  formData: FIRBCalculatorFormData;
  investmentInputs: Partial<InvestmentInputs>;
}

interface CollapsibleSection {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
  defaultOpen?: boolean;
}

const PDF_DOWNLOAD_ENABLED = false; // Temporarily disable PDF downloads (UI button hidden)

export default function ResultsPanel({
  eligibility,
  costs,
  onDownloadPDF,
  onEmailResults,
  onEditCalculation,
  onEditInvestmentInputs,
  onStartAgain,
  propertyValue,
  propertyType,
  state,
  depositPercent,
  formData,
  investmentInputs: propInvestmentInputs,
}: ResultsPanelProps) {
  const t = useTranslations("FIRBCalculator.results");
  const tAnalytics = useTranslations("FIRBCalculator.results.investmentAnalytics");

  // Auth state
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Print ref for browser-based PDF generation
  const printRef = useRef<HTMLDivElement>(null);

  // Setup print handler
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `FIRB-Investment-Analysis-${new Date().toISOString().split("T")[0]}`,
  });

  // Track calculator completion on mount
  useEffect(() => {
    // Initialize UTM tracking
    initializeUTMTracking();

    // Track calculator completion
    trackConversion.calculatorCompleted(propertyValue, state);
    trackMetaEvent.calculatorCompleted(propertyValue);

    // Get UTM params for additional context
    const utmParams = getUTMParamsForAnalytics();
    if (Object.keys(utmParams).length > 0) {
      // Additional tracking with UTM context can be added here
      console.log("UTM params:", utmParams);
    }
  }, []); // Only run once on mount

  // Investment Analytics State - use provided inputs or generate defaults if not provided
  const investmentInputs = useMemo(() => {
    // If we have actual inputs from the wizard, use them (merge with defaults for any missing values)
    if (propInvestmentInputs && Object.keys(propInvestmentInputs).length > 0) {
      const defaults = generateDefaultInputs(
        propertyValue,
        state,
        propertyType,
        depositPercent,
        costs
      );
      return { ...defaults, ...propInvestmentInputs };
    }
    // Otherwise generate defaults
    return generateDefaultInputs(propertyValue, state, propertyType, depositPercent, costs);
  }, [propInvestmentInputs, propertyValue, state, propertyType, depositPercent, costs]);
  const [openSections, setOpenSections] = useState<string[]>(["eligibility", "costs"]);

  // Short-stay regulations state
  const [shortStayRegulations, setShortStayRegulations] = useState<ShortStayRegulation | null>(
    null
  );
  const [isLoadingRegulations, setIsLoadingRegulations] = useState(false);

  // Benchmark data state
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [isLoadingBenchmarks, setIsLoadingBenchmarks] = useState(false);
  const [macroBenchmarks, setMacroBenchmarks] = useState<Partial<Record<string, number>> | null>(
    null
  );
  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((sectionId) => sectionId !== id) : [...prev, id]
    );
  };
  const isSectionOpen = (id: string) => openSections.includes(id);

  // Fetch macro benchmarks for investment comparisons
  useEffect(() => {
    const fetchMacroBenchmarks = async () => {
      try {
        const response = await fetch("/api/macro-benchmarks");
        const data = await response.json();
        if (data.success && data.benchmarks) {
          const benchmarksMap: Partial<Record<string, number>> = {};
          data.benchmarks.forEach((b: { metric: string; value_numeric: number }) => {
            benchmarksMap[b.metric] = b.value_numeric;
          });
          setMacroBenchmarks(benchmarksMap);
        }
      } catch (error) {
        console.error("Failed to fetch macro benchmarks:", error);
      }
    };

    fetchMacroBenchmarks();
  }, []);

  // Calculate investment analytics
  const investmentAnalytics = useMemo(
    () =>
      calculateInvestmentAnalytics(
        investmentInputs,
        propertyValue,
        state,
        propertyType,
        costs,
        macroBenchmarks || undefined,
        formData.purchaseDate
      ),
    [
      investmentInputs,
      propertyValue,
      state,
      propertyType,
      costs,
      macroBenchmarks,
      formData.purchaseDate,
    ]
  );

  // Calculate optimal use case
  const optimalUseCase = useMemo(() => {
    if (!investmentInputs.estimatedWeeklyRent) return null;
    return calculateOptimalUseCase(
      investmentInputs,
      propertyValue,
      state,
      propertyType,
      costs,
      shortStayRegulations
    );
  }, [investmentInputs, propertyValue, state, propertyType, costs, shortStayRegulations]);

  // Fetch short-stay regulations on mount
  useEffect(() => {
    const fetchRegulations = async () => {
      setIsLoadingRegulations(true);
      try {
        const params = new URLSearchParams({
          state: state,
        });

        // Add address details if available
        if (formData.propertyAddress) {
          // Try to extract postcode from address
          const postcodeMatch = formData.propertyAddress.match(/\b\d{4}\b/);
          if (postcodeMatch) {
            params.append("postcode", postcodeMatch[0]);
          }
        }

        const response = await fetch(`/api/short-stay-regulations?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.regulation) {
            setShortStayRegulations(data.regulation);
          }
        }
      } catch (error) {
        console.error("Failed to fetch short-stay regulations:", error);
      } finally {
        setIsLoadingRegulations(false);
      }
    };

    fetchRegulations();
  }, [state, formData.propertyAddress]);

  // Fetch benchmark data on mount
  useEffect(() => {
    const fetchBenchmarks = async () => {
      setIsLoadingBenchmarks(true);
      try {
        const params = new URLSearchParams({
          state: state,
        });

        // Add address details if available
        if (formData.propertyAddress) {
          // Try to extract postcode from address
          const postcodeMatch = formData.propertyAddress.match(/\b\d{4}\b/);
          if (postcodeMatch) {
            params.append("postcode", postcodeMatch[0]);
          }
          // Try to extract suburb from address (first part before comma or state)
          const addressParts = formData.propertyAddress.split(",");
          if (addressParts.length > 0) {
            const suburb = addressParts[0].trim();
            if (suburb) {
              params.append("suburb", suburb);
            }
          }
        }

        const response = await fetch(`/api/benchmarks?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.benchmark) {
            setBenchmarkData(data.benchmark);
          }
        }
      } catch (error) {
        console.error("Failed to fetch benchmark data:", error);
      } finally {
        setIsLoadingBenchmarks(false);
      }
    };

    fetchBenchmarks();
  }, [state, formData.propertyAddress]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value?: number | null) => {
    if (value === undefined || value === null) return null;
    return `${value}%`;
  };

  // Prepare calculation data for saving
  const calculationData: CalculationData = {
    citizenshipStatus: formData.citizenshipStatus!,
    visaType: formData.visaType,
    isOrdinarilyResident: formData.isOrdinarilyResident,
    propertyType: formData.propertyType!,
    propertyValue: formData.propertyValue!,
    propertyState: formData.state!,
    propertyAddress: formData.propertyAddress,
    isFirstHome: formData.isFirstHome!,
    depositPercent: formData.depositPercent!,
    entityType: formData.entityType!,
    eligibility: eligibility,
    costs: costs,
  };

  const renderCostBreakdown = () => {
    // Separate upfront and ongoing cost sections
    const upfrontSections = costs.breakdown.filter(
      (section) => section.category !== "Annual Ongoing Costs"
    );
    const ongoingSection = costs.breakdown.find(
      (section) => section.category === "Annual Ongoing Costs"
    );

    // Calculate total upfront costs
    const totalUpfrontCosts = costs.upfrontCosts.total;

    return (
      <>
        {/* Summary Cards at Top */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm font-medium text-green-900 mb-1">{t("costs.totalInvestment")}</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(costs.totalInvestmentCost)}
            </p>
            <p className="text-sm text-green-600 mt-2">
              {t("costs.propertyPrice")}: {formatCurrency(costs.upfrontCosts.propertyPrice)} +{" "}
              {t("costs.upfrontCosts")}: {formatCurrency(costs.upfrontCosts.total)}
            </p>
          </div>

          <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm font-medium text-blue-900 mb-1">{t("costs.annualOngoing")}</p>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(costs.ongoingCosts.total)}
            </p>
            <p className="text-sm text-blue-600 mt-2">{t("costs.annualOngoingNote")}</p>
          </div>
        </div>

        {/* Upfront Costs Breakdown */}
        {upfrontSections.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-foreground/70 mb-4 uppercase tracking-wide">
              {t("costs.upfrontCosts") || "Upfront Costs"}
            </h4>
            <div className="space-y-2">
              {upfrontSections.map((section, index) =>
                section.items.map((item, itemIndex) => (
                  <div
                    key={`${index}-${itemIndex}`}
                    className="flex justify-between items-center p-3 rounded hover:bg-muted/50 transition-colors border border-border/20"
                  >
                    <span className="text-sm font-medium">
                      {item.description ? (
                        <>
                          {item.name}:{" "}
                          <span className="text-muted-foreground">{item.description}</span>
                        </>
                      ) : (
                        item.name
                      )}
                    </span>
                    <span className="text-sm font-semibold">{formatCurrency(item.amount)}</span>
                  </div>
                ))
              )}
              <div className="flex justify-between items-center p-4 rounded-xl bg-green-50 border border-green-200 font-bold mt-2">
                <span className="text-green-900">{t("costs.upfrontCosts") || "Upfront Costs"}</span>
                <span className="text-green-600 text-lg">{formatCurrency(totalUpfrontCosts)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Annual Ongoing Costs Breakdown */}
        {ongoingSection && ongoingSection.items.length > 0 && (
          <div className="mt-8">
            <h4 className="text-sm font-semibold text-foreground/70 mb-4 uppercase tracking-wide">
              {t("costs.annualOngoing")}
            </h4>
            <div className="space-y-2">
              {ongoingSection.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex justify-between items-center p-3 rounded hover:bg-muted/50 transition-colors border border-border/20"
                >
                  <span className="text-sm font-medium">
                    {item.description ? (
                      <>
                        {item.name}:{" "}
                        <span className="text-muted-foreground">{item.description}</span>
                      </>
                    ) : (
                      item.name
                    )}
                  </span>
                  <span className="text-sm font-semibold">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center p-4 rounded-xl bg-blue-50 border border-blue-200 font-bold mt-2">
                <span className="text-blue-900">{t("costs.annualOngoing")}</span>
                <span className="text-blue-600 text-lg">
                  {formatCurrency(costs.ongoingCosts.total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderAssumptionsSummary = () => {
    const summaryItems = [
      {
        label:
          tAnalytics("inputs.rental.weeklyRent") ===
          "FIRBCalculator.results.investmentAnalytics.inputs.rental.weeklyRent"
            ? "Estimated Weekly Rent"
            : tAnalytics("inputs.rental.weeklyRent"),
        value: investmentInputs.estimatedWeeklyRent
          ? `$${investmentInputs.estimatedWeeklyRent.toLocaleString("en-AU")} / week`
          : "—",
      },
      {
        label:
          tAnalytics("inputs.rental.vacancyRate") ===
          "FIRBCalculator.results.investmentAnalytics.inputs.rental.vacancyRate"
            ? "Vacancy Rate"
            : tAnalytics("inputs.rental.vacancyRate"),
        value: formatPercent(investmentInputs.vacancyRate) || "—",
      },
      {
        label:
          tAnalytics("inputs.rental.rentGrowth") ===
          "FIRBCalculator.results.investmentAnalytics.inputs.rental.rentGrowth"
            ? "Annual Rent Growth"
            : tAnalytics("inputs.rental.rentGrowth"),
        value: formatPercent(investmentInputs.rentGrowthRate) || "—",
      },
      {
        label:
          tAnalytics("inputs.financing.interestRate") ===
          "FIRBCalculator.results.investmentAnalytics.inputs.financing.interestRate"
            ? "Interest Rate"
            : tAnalytics("inputs.financing.interestRate"),
        value: formatPercent(investmentInputs.interestRate) || "—",
      },
    ];

    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          {summaryItems.map((item) => (
            <div key={item.label} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">{item.label}</p>
              <p className="text-xl font-semibold text-gray-900 mt-1">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <Button
            variant="outline"
            size="lg"
            className="rounded font-semibold"
            onClick={onEditInvestmentInputs}
          >
            {t("analysisParams.cta") === "FIRBCalculator.results.analysisParams.cta"
              ? "Adjust inputs in wizard"
              : t("analysisParams.cta")}
          </Button>
          <p className="text-sm text-gray-600">
            {t("analysisParams.note") === "FIRBCalculator.results.analysisParams.note"
              ? "You will return to the Financial step to edit rent, rates, and growth assumptions."
              : t("analysisParams.note")}
          </p>
        </div>
      </div>
    );
  };

  const collapsibleSections = useMemo<CollapsibleSection[]>(() => {
    const projectionYears = 10;
    const sections: CollapsibleSection[] = [
      {
        id: "eligibility",
        title: t("eligibility.header"),
        description: t("eligibility.summary.description"),
        content: (
          <EligibilityResultCard eligibility={eligibility} formData={formData} costs={costs} />
        ),
        defaultOpen: true,
      },
      {
        id: "costs",
        title: t("costs.title"),
        description: t("costs.description"),
        content: renderCostBreakdown(),
        defaultOpen: true,
      },
      {
        id: "cashFlow",
        title:
          tAnalytics("cashFlow.title") ===
          "FIRBCalculator.results.investmentAnalytics.cashFlow.title"
            ? "Cash Flow Analysis"
            : tAnalytics("cashFlow.title"),
        description: tAnalytics("cashFlow.description"),
        content: <CashFlowAnalysis analytics={investmentAnalytics} />,
      },
      {
        id: "projections",
        title:
          tAnalytics("projections.title", { years: projectionYears }) ===
          "FIRBCalculator.results.investmentAnalytics.projections.title"
            ? "Investment Projections"
            : tAnalytics("projections.title", { years: projectionYears }),
        description: tAnalytics("projections.description"),
        content: <ProjectionChart analytics={investmentAnalytics} />,
      },
      {
        id: "sensitivity",
        title:
          tAnalytics("sensitivity.title") ===
          "FIRBCalculator.results.investmentAnalytics.sensitivity.title"
            ? "Sensitivity Analysis"
            : tAnalytics("sensitivity.title"),
        description: tAnalytics("sensitivity.description"),
        content: <SensitivityAnalysis analytics={investmentAnalytics} />,
      },
      {
        id: "tax",
        title:
          tAnalytics("taxAnalysis.title") ===
          "FIRBCalculator.results.investmentAnalytics.taxAnalysis.title"
            ? "Tax Analysis"
            : tAnalytics("taxAnalysis.title"),
        description: tAnalytics("taxAnalysis.description"),
        content: <TaxAnalysis analytics={investmentAnalytics} />,
      },
    ];

    if (optimalUseCase) {
      sections.push({
        id: "optimal",
        title:
          t("optimalUseCase.title") === "FIRBCalculator.results.optimalUseCase.title"
            ? "Optimal Use Case Analysis"
            : t("optimalUseCase.title"),
        description: t("optimalUseCase.description"),
        content: (
          <OptimalUseCaseSection comparison={optimalUseCase} propertyValue={propertyValue} />
        ),
      });
    }

    return sections;
  }, [
    benchmarkData,
    costs,
    eligibility,
    formData,
    investmentAnalytics,
    investmentInputs,
    optimalUseCase,
    propertyValue,
    state,
    t,
    tAnalytics,
  ]);

  useEffect(() => {
    const defaults = collapsibleSections
      .filter((section) => section.defaultOpen)
      .map((section) => section.id);
    setOpenSections((prev) => Array.from(new Set([...defaults, ...prev])));
  }, [collapsibleSections]);

  const renderActionCluster = () => (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
      {/* Temporarily disabled: re-enable when PDF downloads are available again */}
      {PDF_DOWNLOAD_ENABLED && (
        <Button onClick={handlePrint} variant="default" size="lg" className="gap-2 rounded">
          <Download className="h-5 w-5" />
          {t("actions.downloadPDF")}
        </Button>
      )}

      <SaveCalculationButton
        calculationData={calculationData}
        onLoginClick={() => setShowLoginModal(true)}
        className="sm:flex-shrink-0"
      />

      <Button
        onClick={() => {
          trackConversion.emailSent();
          trackMetaEvent.lead({
            content_name: "Email Results",
            content_category: "Engagement",
          });
          onEmailResults();
        }}
        variant="outline"
        size="lg"
        className="gap-2 rounded"
      >
        <Mail className="h-5 w-5" />
        {t("actions.emailResults")}
      </Button>
      <Button onClick={onEditCalculation} variant="outline" size="lg" className="gap-2 rounded">
        <Edit className="h-5 w-5" />
        {t("actions.editCalculation")}
      </Button>
      <Button onClick={onStartAgain} variant="outline" size="lg" className="gap-2 rounded">
        <RotateCcw className="h-5 w-5" />
        {t("actions.startAgain")}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderActionCluster()}

      <InvestmentSummary analytics={investmentAnalytics} costs={costs} eligibility={eligibility} />

      <div className="space-y-6">
        {collapsibleSections.map((section) => {
          const open = isSectionOpen(section.id);
          const expandLabel =
            t("sections.expand") === "FIRBCalculator.results.sections.expand"
              ? "Expand section"
              : t("sections.expand");
          const collapseLabel =
            t("sections.collapse") === "FIRBCalculator.results.sections.collapse"
              ? "Collapse section"
              : t("sections.collapse");

          return (
            <Card key={section.id} className="border border-gray-200 shadow-sm rounded bg-white">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-semibold text-gray-900">
                    {section.title}
                  </CardTitle>
                  {section.description && (
                    <CardDescription className="text-gray-600 mt-2">
                      {section.description}
                    </CardDescription>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-gray-200"
                  onClick={() => toggleSection(section.id)}
                  aria-label={open ? collapseLabel : expandLabel}
                >
                  {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </CardHeader>
              {open && <CardContent className="pt-0 space-y-6">{section.content}</CardContent>}
            </Card>
          );
        })}
      </div>

      {renderActionCluster()}

      <CustomAlert
        variant="default"
        icon={<Info className="h-4 w-4" />}
        title={t("disclaimer.title")}
      >
        <p className="text-sm">{t("disclaimer.content")}</p>
      </CustomAlert>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      <div ref={printRef}>
        <PrintableReport
          eligibility={eligibility}
          costs={costs}
          formData={formData}
          analytics={investmentAnalytics}
        />
      </div>
    </div>
  );
}
