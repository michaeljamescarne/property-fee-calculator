/**
 * Results Panel Component
 * Displays eligibility verdict and cost breakdown
 */

"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import InvestmentComparison from "./InvestmentComparison";
import SensitivityAnalysis from "./SensitivityAnalysis";
import TaxAnalysis from "./TaxAnalysis";
import InvestmentScore from "./InvestmentScore";
import OptimalUseCaseSection from "./OptimalUseCaseSection";
import SaveCalculationButton from "./SaveCalculationButton";
import LoginModal from "@/components/auth/LoginModal";
import EligibilityResultCard from "./EligibilityResultCard";
import PrintableReport from "./PrintableReport";
import BenchmarkComparison from "./BenchmarkComparison";
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
}

interface CollapsibleSection {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
  defaultOpen?: boolean;
}

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

  // Investment Analytics State
  const investmentInputs = useMemo(
    () => generateDefaultInputs(propertyValue, state, propertyType, depositPercent, costs),
    [propertyValue, state, propertyType, depositPercent, costs]
  );
  const [openSections, setOpenSections] = useState<string[]>([
    "eligibility",
    "costs",
    "assumptions",
  ]);

  // Short-stay regulations state
  const [shortStayRegulations, setShortStayRegulations] = useState<ShortStayRegulation | null>(
    null
  );
  const [isLoadingRegulations, setIsLoadingRegulations] = useState(false);

  // Benchmark data state
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [isLoadingBenchmarks, setIsLoadingBenchmarks] = useState(false);
  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((sectionId) => sectionId !== id) : [...prev, id]
    );
  };
  const isSectionOpen = (id: string) => openSections.includes(id);

  // Calculate investment analytics
  const investmentAnalytics = useMemo(
    () => calculateInvestmentAnalytics(investmentInputs, propertyValue, state, propertyType, costs),
    [investmentInputs, propertyValue, state, propertyType, costs]
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

  const renderCostBreakdown = () => (
    <>
      <div className="p-6 mb-6 rounded bg-blue-600 text-white">
        <p className="text-sm text-white/90">{t("costs.totalInvestment")}</p>
        <p className="text-4xl font-bold mt-2">{formatCurrency(costs.totalInvestmentCost)}</p>
        <p className="text-sm text-white/75 mt-2">
          {t("costs.propertyPrice")}: {formatCurrency(costs.upfrontCosts.propertyPrice)}
        </p>
        <p className="text-sm text-white/75">
          {t("costs.upfrontCosts")}: {formatCurrency(costs.upfrontCosts.total)}
        </p>
      </div>

      <Accordion type="multiple" className="w-full">
        {costs.breakdown.map((section, index) => (
          <AccordionItem key={index} value={`section-${index}`}>
            <AccordionTrigger className="text-base font-semibold">
              {section.category}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(item.amount)}</p>
                    </div>
                  </div>
                ))}
                {section.items.length > 1 && (
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 font-semibold text-gray-900">
                    <span>{t("costs.subtotal")}</span>
                    <span>
                      {formatCurrency(section.items.reduce((sum, item) => sum + item.amount, 0))}
                    </span>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-6 p-4 rounded bg-gray-50 border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-900">{t("costs.annualOngoing")}</p>
            <p className="text-sm text-gray-600">{t("costs.annualOngoingNote")}</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(costs.ongoingCosts.total)}
          </p>
        </div>
      </div>
    </>
  );

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
            {t("results.analysisParams.cta") === "FIRBCalculator.results.analysisParams.cta"
              ? "Adjust inputs in wizard"
              : t("results.analysisParams.cta")}
          </Button>
          <p className="text-sm text-gray-600">
            {t("results.analysisParams.note") === "FIRBCalculator.results.analysisParams.note"
              ? "You will return to the Financial step to edit rent, rates, and growth assumptions."
              : t("results.analysisParams.note")}
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
        content: <EligibilityResultCard eligibility={eligibility} formData={formData} />,
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
        id: "assumptions",
        title:
          tAnalytics("inputs.title") === "FIRBCalculator.results.investmentAnalytics.inputs.title"
            ? "Investment Assumptions"
            : tAnalytics("inputs.title"),
        description:
          t("results.analysisParams.description") ===
          "FIRBCalculator.results.analysisParams.description"
            ? "These inputs were captured during the wizard. Update them to refine your analysis."
            : t("results.analysisParams.description"),
        content: renderAssumptionsSummary(),
        defaultOpen: true,
      },
      {
        id: "benchmark",
        title:
          t("results.benchmarkComparison.title") ===
          "FIRBCalculator.results.benchmarkComparison.title"
            ? "Market Benchmark Comparison"
            : t("results.benchmarkComparison.title"),
        description: t("results.benchmarkComparison.description", { level: state }),
        content: (
          <BenchmarkComparison
            benchmarkData={benchmarkData}
            investmentInputs={investmentInputs}
            investmentAnalytics={investmentAnalytics}
            propertyValue={propertyValue}
            state={state}
          />
        ),
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
        id: "comparison",
        title:
          tAnalytics("comparison.title", { years: projectionYears }) ===
          "FIRBCalculator.results.investmentAnalytics.comparison.title"
            ? "Asset Comparison"
            : tAnalytics("comparison.title", { years: projectionYears }),
        description: tAnalytics("comparison.description", { years: projectionYears }),
        content: <InvestmentComparison analytics={investmentAnalytics} />,
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
      {
        id: "score",
        title:
          tAnalytics("score.title") === "FIRBCalculator.results.investmentAnalytics.score.title"
            ? "Investment Score"
            : tAnalytics("score.title"),
        description: tAnalytics("score.description"),
        content: <InvestmentScore analytics={investmentAnalytics} />,
      },
    ];

    if (optimalUseCase) {
      sections.push({
        id: "optimal",
        title:
          t("results.optimalUseCase.title") === "FIRBCalculator.results.optimalUseCase.title"
            ? "Optimal Use Case Analysis"
            : t("results.optimalUseCase.title"),
        description: t("results.optimalUseCase.description"),
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
      <Button onClick={handlePrint} variant="default" size="lg" className="gap-2 rounded">
        <Download className="h-5 w-5" />
        {t("actions.downloadPDF")}
      </Button>

      <SaveCalculationButton
        calculationData={calculationData}
        onLoginClick={() => setShowLoginModal(true)}
        className="sm:flex-shrink-0"
      />

      <Button onClick={onEmailResults} variant="outline" size="lg" className="gap-2 rounded">
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

      <InvestmentSummary analytics={investmentAnalytics} />

      <div className="space-y-6">
        {collapsibleSections.map((section) => {
          const open = isSectionOpen(section.id);
          const expandLabel =
            t("results.sections.expand") === "FIRBCalculator.results.sections.expand"
              ? "Expand section"
              : t("results.sections.expand");
          const collapseLabel =
            t("results.sections.collapse") === "FIRBCalculator.results.sections.collapse"
              ? "Collapse section"
              : t("results.sections.collapse");

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
