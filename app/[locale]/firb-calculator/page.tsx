/**
 * FIRB Calculator Main Page
 * Progressive disclosure wizard for FIRB calculations
 */

"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import ProgressIndicator, { Step } from "@/components/firb/ProgressIndicator";
import PurchaseTypeStep from "@/components/firb/PurchaseTypeStep";
import CitizenshipStep from "@/components/firb/CitizenshipStep";
import PropertyDetailsStep from "@/components/firb/PropertyDetailsStep";
import FinancialDetailsStep from "@/components/firb/FinancialDetailsStep";
import ReviewStep from "@/components/firb/ReviewStep";
import ResultsPanel from "@/components/firb/ResultsPanel";
import EmailResultsModal from "@/components/firb/EmailResultsModal";
import { CustomAlert } from "@/components/ui/custom-alert";
import { CitizenshipStatus, PropertyType, AustralianState, EntityType } from "@/lib/firb/constants";
import { FIRBCalculatorFormData } from "@/lib/validations/firb";
import { EligibilityResult } from "@/lib/firb/eligibility";
import { CostBreakdown } from "@/lib/firb/calculations";
import type { InvestmentAnalytics, InvestmentInputs } from "@/types/investment";
import {
  captureProjectionChart,
  captureCashFlowChart,
  captureROIComparisonChart,
} from "@/lib/pdf/chartCapture";
import { useAuth } from "@/components/auth/AuthProvider";
import LoginModal from "@/components/auth/LoginModal";
import { parseAddress } from "@/lib/utils/address-parser";
import { generateDefaultInputs } from "@/lib/firb/investment-analytics";
import type { BenchmarkData } from "@/app/api/benchmarks/route";
import {
  generateCalculatorSchema,
  generateCalculatorHowToSchema,
  injectStructuredData,
} from "@/lib/schema/calculator-schema";

export default function FIRBCalculatorPage() {
  const t = useTranslations("FIRBCalculator");
  const tPdf = useTranslations("FIRBCalculator.pdf");
  const locale = useLocale();
  const router = useRouter();

  // Wizard state - always start at purchaseType for new calculations
  const [currentStep, setCurrentStep] = useState<Step>("purchaseType");

  // Debug: Log every step change
  useEffect(() => {
    console.log("🔷 STEP CHANGED TO:", currentStep);
  }, [currentStep]);
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);

  const isResults = currentStep === "results";

  // Form data
  const [formData, setFormData] = useState<Partial<FIRBCalculatorFormData>>({
    purchaseType: undefined,
    purchaseDate: undefined,
    citizenshipStatus: "" as CitizenshipStatus,
    propertyType: "" as PropertyType,
    propertyValue: 0,
    state: "" as AustralianState,
    isFirstHome: false,
    depositPercent: 20,
    entityType: "individual" as EntityType,
    isOrdinarilyResident: true,
    expeditedFIRB: false,
    propertyClassification: null,
    bedrooms: null,
  });

  // Investment inputs state
  const [investmentInputs, setInvestmentInputs] = useState<Partial<InvestmentInputs>>({});

  // Benchmark data state
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData | null>(null);
  const [isLoadingBenchmarks, setIsLoadingBenchmarks] = useState(false);
  const [costBenchmarks, setCostBenchmarks] = useState<Partial<Record<string, number>> | null>(
    null
  );
  const [macroBenchmarks, setMacroBenchmarks] = useState<Partial<Record<string, number>> | null>(
    null
  );

  // Results state
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [costs, setCosts] = useState<CostBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Email modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Authentication and PDF state
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalTitle, setLoginModalTitle] = useState<string | undefined>();
  const [loginModalMessage, setLoginModalMessage] = useState<string | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const pendingPDFAnalyticsRef = useRef<InvestmentAnalytics | undefined>(undefined);

  // Loading state for saved calculations
  const [isLoadingSavedCalculation, setIsLoadingSavedCalculation] = useState(false);
  const loadedCalculationIdRef = useRef<string | null>(null);
  const [editingCalculationId, setEditingCalculationId] = useState<string | null>(null);
  const isEditingRef = useRef<boolean>(false);
  const shouldNavigateToReviewRef = useRef<boolean>(false);
  const editModeInitializedRef = useRef<boolean>(false); // Track if edit mode has been initialized
  const [savedCalculationName, setSavedCalculationName] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  // Format helpers
  const formatCurrencyValue = (value?: number | null) => {
    if (!value) return null;
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const propertySubtitle = useMemo(() => {
    if (!isResults) return null;
    if (formData.propertyAddress && formData.propertyAddress.trim().length > 0) {
      return formData.propertyAddress.trim();
    }

    const segments: string[] = [];
    const propertyValueLabel = formatCurrencyValue(formData.propertyValue);
    if (propertyValueLabel) segments.push(propertyValueLabel);
    if (formData.state) segments.push(formData.state);
    if (formData.propertyType) segments.push(formData.propertyType);

    return segments.length > 0 ? segments.join(" • ") : null;
  }, [
    isResults,
    formData.propertyAddress,
    formData.propertyValue,
    formData.state,
    formData.propertyType,
  ]);

  const heroTitle =
    savedCalculationName ||
    (isResults
      ? t("results.heroTitle") === "FIRBCalculator.results.heroTitle"
        ? "Investment Analysis"
        : t("results.heroTitle")
      : t("title"));

  const heroSubtitle = isResults
    ? propertySubtitle ||
      (t("results.heroSubtitleFallback") === "FIRBCalculator.results.heroSubtitleFallback"
        ? "Review your investment assumptions, risks, and next steps."
        : t("results.heroSubtitleFallback"))
    : t("description");

  // Get URL search parameters
  const searchParams = useSearchParams();

  // CRITICAL: Immediately navigate to review when edit=true is detected in URL
  // This runs ONLY ONCE when edit mode is first detected, not on every step change
  useEffect(() => {
    const isEdit = searchParams.get("edit") === "true";
    const loadId = searchParams.get("load");

    // Only initialize edit mode ONCE when first detected
    if (isEdit && loadId && !editModeInitializedRef.current) {
      console.log("useEffect: Initializing edit mode", { currentStep, isEdit, loadId });
      editModeInitializedRef.current = true;

      // Set flags immediately to prevent any interference
      isEditingRef.current = true;
      shouldNavigateToReviewRef.current = true;

      // Clear eligibility/costs immediately to prevent ResultsPanel from rendering
      setEligibility(null);
      setCosts(null);

      // Navigate to review step immediately
      if (currentStep !== "review") {
        setCurrentStep("review");
      }
    } else if (!isEdit) {
      // Reset when edit mode is cleared
      editModeInitializedRef.current = false;
      isEditingRef.current = false;
      shouldNavigateToReviewRef.current = false;
    }
    // NOTE: We intentionally do NOT check currentStep or respond to step changes
    // This prevents interference when user clicks Edit buttons
  }, [searchParams]); // Only run when searchParams change, NOT when currentStep changes

  // CRITICAL: Force purchaseType step if it's not set - runs on every render
  useEffect(() => {
    const isEdit = searchParams.get("edit") === "true";

    // Don't interfere if we're currently editing a saved calculation or navigating to review
    // Also check URL param to be extra safe
    // IMPORTANT: Don't interfere if user is on any form step (they clicked Edit)
    const formSteps: Step[] = ["purchaseType", "citizenship", "property", "financial"];
    if (
      isEditingRef.current ||
      shouldNavigateToReviewRef.current ||
      isEdit ||
      formSteps.includes(currentStep)
    )
      return;

    // If purchaseType is not set, FORCE currentStep to be purchaseType (unless loading saved calc, on results, or on review)
    // Note: We exclude "review" because when editing, we navigate directly to review step
    if (
      !isLoadingSavedCalculation &&
      !formData.purchaseType &&
      currentStep !== "results" &&
      currentStep !== "review"
    ) {
      if (currentStep !== "purchaseType") {
        setCurrentStep("purchaseType");
        setCompletedSteps([]);
      }
    }
  }, [formData.purchaseType, currentStep, isLoadingSavedCalculation, searchParams]);

  // Load saved calculation if load parameter is present
  useEffect(() => {
    const loadId = searchParams.get("load");
    const isEdit = searchParams.get("edit") === "true";

    if (!loadId || isLoadingSavedCalculation) return;

    // Determine if we need to reload:
    // 1. Always reload if it's a different calculation ID
    // 2. Always reload if edit=true (even for same calculation - needed for edit mode)
    // 3. For view mode, only reload if eligibility/costs not already loaded (checked inside)
    const isDifferentCalculation = loadId !== loadedCalculationIdRef.current;
    const needsReloadForEdit = isEdit; // If editing, always reload to get fresh data

    // For view mode, check if we need to load (only if data not already loaded)
    // Use a ref to check current values without adding to dependencies
    const needsReloadForView = !isEdit && (!eligibility || !costs);

    if (isDifferentCalculation || needsReloadForEdit || needsReloadForView) {
      loadSavedCalculation(loadId, isEdit);
      loadedCalculationIdRef.current = loadId;
    }
  }, [searchParams, isLoadingSavedCalculation]);

  // Fetch benchmarks when property details are available
  useEffect(() => {
    const fetchBenchmarks = async () => {
      if (!formData.state || !formData.propertyValue) return;

      setIsLoadingBenchmarks(true);
      try {
        // Parse address to get suburb/postcode if available
        const parsedAddress = formData.propertyAddress
          ? parseAddress(formData.propertyAddress)
          : {};

        // Build query params
        const params = new URLSearchParams({ state: formData.state });
        if (parsedAddress.suburb) {
          params.append("suburb", parsedAddress.suburb);
        }
        if (parsedAddress.postcode) {
          params.append("postcode", parsedAddress.postcode);
        }

        const response = await fetch(`/api/benchmarks?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.benchmark) {
            setBenchmarkData(data.benchmark);
          } else {
            setBenchmarkData(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch benchmarks:", error);
        setBenchmarkData(null);
      } finally {
        setIsLoadingBenchmarks(false);
      }
    };

    fetchBenchmarks();
  }, [formData.state, formData.propertyAddress]);

  // Fetch cost and macro benchmarks when property details are available
  useEffect(() => {
    if (formData.state && formData.propertyType) {
      const fetchCostBenchmarks = async () => {
        try {
          const params = new URLSearchParams();
          if (formData.state) params.append("state", formData.state);
          if (formData.propertyType) params.append("property_type", formData.propertyType);
          // Add property classification and bedrooms if available (for established properties)
          if (formData.propertyClassification) {
            params.append("property_classification", formData.propertyClassification);
          }
          if (formData.bedrooms !== null && formData.bedrooms !== undefined) {
            params.append("bedrooms", formData.bedrooms.toString());
          }
          const response = await fetch(`/api/cost-benchmarks?${params.toString()}`);
          const data = await response.json();
          if (data.success && data.benchmarks) {
            const benchmarksMap: Partial<Record<string, number>> = {};
            data.benchmarks.forEach((b: { metric: string; value_numeric: number }) => {
              benchmarksMap[b.metric] = b.value_numeric;
            });
            setCostBenchmarks(benchmarksMap);
          }
        } catch (error) {
          console.error("Failed to fetch cost benchmarks:", error);
        }
      };

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

      fetchCostBenchmarks();
      fetchMacroBenchmarks();
    }
  }, [formData.state, formData.propertyType, formData.propertyClassification, formData.bedrooms]);

  // Initialize investment inputs when property details are available
  useEffect(() => {
    if (
      formData.propertyValue &&
      formData.state &&
      formData.propertyType &&
      costs &&
      Object.keys(investmentInputs).length === 0
    ) {
      // Use generateDefaultInputs with benchmark data if available
      const defaultInputs = generateDefaultInputs(
        formData.propertyValue,
        formData.state,
        formData.propertyType,
        formData.depositPercent || 20,
        costs,
        benchmarkData
          ? {
              grossRentalYield: benchmarkData.grossRentalYield,
              capitalGrowth5yr: benchmarkData.capitalGrowth5yr,
              capitalGrowth10yr: benchmarkData.capitalGrowth10yr,
            }
          : null,
        costBenchmarks || undefined,
        macroBenchmarks || undefined
      );

      setInvestmentInputs(defaultInputs);
    }
  }, [
    formData.propertyValue,
    formData.state,
    formData.propertyType,
    formData.depositPercent,
    costs,
    benchmarkData,
    costBenchmarks,
    macroBenchmarks,
  ]);

  // Function to load saved calculation
  const loadSavedCalculation = async (calculationId: string, isEdit: boolean = false) => {
    setIsLoadingSavedCalculation(true);
    setLoadError(null); // Clear any previous errors

    try {
      const response = await fetch(`/api/calculations/${calculationId}`);

      if (!response.ok) {
        // Handle 404 specifically
        if (response.status === 404) {
          setLoadError(
            "This calculation could not be found. It may have been deleted or you don't have permission to access it."
          );
        } else {
          setLoadError(
            "Failed to load the calculation. Please try again or start a new calculation."
          );
        }
        // Reset ref so it doesn't try to reload
        loadedCalculationIdRef.current = null;
        // Clear edit flags
        isEditingRef.current = false;
        shouldNavigateToReviewRef.current = false;
        // Reset to initial state
        setCurrentStep("purchaseType");
        setCompletedSteps([]);
        setEditingCalculationId(null);
        setSavedCalculationName(null);
        // Remove the load/edit params from URL to prevent retry loops
        const url = new URL(window.location.href);
        url.searchParams.delete("load");
        url.searchParams.delete("edit");
        window.history.replaceState({}, "", url.toString());
        return;
      }

      const data = await response.json();

      if (data.success && data.calculation) {
        setLoadError(null); // Clear error on success
        const calculation = data.calculation;
        const calculationData = calculation.calculation_data;

        // Set saved calculation name if it exists (always set, even if null to clear previous name)
        setSavedCalculationName(calculation.calculation_name || null);

        // For editing, set editing ID and ensure flags are set
        // Note: Eligibility/costs and step should already be cleared/set by the useEffect above
        if (isEdit) {
          setEditingCalculationId(calculation.id);
          // Ensure flags are still set (they should be from the useEffect, but be defensive)
          isEditingRef.current = true;
          shouldNavigateToReviewRef.current = true;
          // Remove edit param from URL after successful load to allow step navigation
          // Use router.replace to properly update searchParams
          const url = new URL(window.location.href);
          url.searchParams.delete("edit");
          router.replace(url.pathname + (url.search ? url.search : ""), { scroll: false });
          // Clear eligibility/costs again just in case (defensive)
          setEligibility(null);
          setCosts(null);
        }

        // Pre-fill form data
        // For established properties, ensure propertyClassification is set (default to "house" if missing)
        // This handles backward compatibility with older saved calculations that may not have this field
        const propertyClassification =
          calculationData.propertyClassification ??
          (calculationData.propertyType === "established" ? "house" : null);

        // For established properties, ensure bedrooms is set (default to 3 if missing)
        // This handles backward compatibility with older saved calculations that may not have this field
        const bedrooms =
          calculationData.bedrooms !== undefined && calculationData.bedrooms !== null
            ? calculationData.bedrooms
            : calculationData.propertyType === "established"
              ? 3
              : null;

        setFormData({
          purchaseType: calculationData.purchaseType || "purchasing", // Default to purchasing for backward compatibility
          purchaseDate: calculationData.purchaseDate,
          citizenshipStatus: calculationData.citizenshipStatus,
          visaType: calculationData.visaType,
          isOrdinarilyResident: calculationData.isOrdinarilyResident,
          propertyType: calculationData.propertyType,
          propertyValue: calculationData.propertyValue,
          state: calculationData.propertyState, // Map propertyState to state
          propertyAddress: calculationData.propertyAddress,
          isFirstHome: calculationData.isFirstHome,
          depositPercent: calculationData.depositPercent,
          entityType: calculationData.entityType,
          expeditedFIRB: false, // Default value since it's not saved
          propertyClassification,
          bedrooms,
        });

        // Load investment inputs if they exist (stored as individual fields in calculationData)
        // Note: Some fields might be undefined, which is fine - they'll use defaults
        const hasInvestmentInputs =
          calculationData.weeklyRent !== undefined ||
          calculationData.loanAmount !== undefined ||
          calculationData.interestRate !== undefined;

        if (hasInvestmentInputs) {
          setInvestmentInputs({
            estimatedWeeklyRent: calculationData.weeklyRent,
            propertyManagementFee: calculationData.managementFee,
            loanAmount: calculationData.loanAmount,
            interestRate: calculationData.interestRate,
            loanTerm: calculationData.loanTerm,
            capitalGrowthRate: calculationData.annualGrowthRate,
            marginalTaxRate: calculationData.marginalTaxRate,
          });
        } else {
          // Clear investment inputs if none were saved
          setInvestmentInputs({});
        }

        // Set step AFTER all data is loaded
        if (isEdit) {
          // For editing, ensure we're on review step (should already be set by useEffect above)
          setCompletedSteps(["citizenship", "property", "financial"]);
          // Ensure step is review (defensive - should already be set)
          if (currentStep !== "review") {
            setCurrentStep("review");
          }

          // Keep flags active for a period to prevent interference from other useEffects
          // Will be cleared when edit mode ends (URL changes)
        } else {
          // For viewing, set results and navigate to results step
          setEligibility(calculationData.eligibility);
          setCosts(calculationData.costs);
          setCompletedSteps(["citizenship", "property", "financial", "review"]);
          setCurrentStep("results");
          // Set editingCalculationId when viewing so we know this is a saved calculation
          setEditingCalculationId(calculation.id);
        }
      } else {
        // Invalid response data
        setLoadError("The calculation data is invalid. Please start a new calculation.");
        loadedCalculationIdRef.current = null;
        isEditingRef.current = false;
        shouldNavigateToReviewRef.current = false;
        setCurrentStep("purchaseType");
        setCompletedSteps([]);
        setEditingCalculationId(null);
        setSavedCalculationName(null);
        // Remove the load/edit params from URL
        const url = new URL(window.location.href);
        url.searchParams.delete("load");
        url.searchParams.delete("edit");
        window.history.replaceState({}, "", url.toString());
      }
    } catch (error) {
      console.error("Error loading saved calculation:", error);
      setLoadError("An unexpected error occurred. Please try again or start a new calculation.");
      // Reset state
      loadedCalculationIdRef.current = null;
      isEditingRef.current = false;
      shouldNavigateToReviewRef.current = false;
      setCurrentStep("purchaseType");
      setCompletedSteps([]);
      setEditingCalculationId(null);
      setSavedCalculationName(null);
      // Remove the load/edit params from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("load");
      url.searchParams.delete("edit");
      window.history.replaceState({}, "", url.toString());
    } finally {
      setIsLoadingSavedCalculation(false);
    }
  };

  // Prepare PDF translations (memoized for performance)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _pdfTranslations = useMemo(
    () => ({
      title: tPdf("title"),
      subtitle: tPdf("subtitle"),
      generatedOn: tPdf("generatedOn"),
      page: tPdf("page"),
      sections: {
        executiveSummary: tPdf("sections.executiveSummary"),
        propertyDetails: tPdf("sections.propertyDetails"),
        keyMetrics: tPdf("sections.keyMetrics"),
        firbRequirements: tPdf("sections.firbRequirements"),
        eligibilityStatus: tPdf("sections.eligibilityStatus"),
        propertyType: tPdf("sections.propertyType"),
        costBreakdown: tPdf("sections.costBreakdown"),
        investmentPerformance: tPdf("sections.investmentPerformance"),
        rentalYield: tPdf("sections.rentalYield"),
        cashFlow: tPdf("sections.cashFlow"),
        projections: tPdf("sections.projections"),
        equityGrowth: tPdf("sections.equityGrowth"),
        breakEven: tPdf("sections.breakEven"),
        comparison: tPdf("sections.comparison"),
        assetComparison: tPdf("sections.assetComparison"),
        sensitivity: tPdf("sections.sensitivity"),
        riskScenarios: tPdf("sections.riskScenarios"),
        taxAnalysis: tPdf("sections.taxAnalysis"),
        deductions: tPdf("sections.deductions"),
        cgtProjection: tPdf("sections.cgtProjection"),
        recommendations: tPdf("sections.recommendations"),
        overallScore: tPdf("sections.overallScore"),
        recommendation: tPdf("sections.recommendation"),
      },
      labels: {
        address: tPdf("labels.address"),
        state: tPdf("labels.state"),
        value: tPdf("labels.value"),
        deposit: tPdf("labels.deposit"),
        citizenshipStatus: tPdf("labels.citizenshipStatus"),
        entityType: tPdf("labels.entityType"),
        eligible: tPdf("labels.eligible"),
        notEligible: tPdf("labels.notEligible"),
        firbRequired: tPdf("labels.firbRequired"),
        noFirbRequired: tPdf("labels.noFirbRequired"),
        firbFee: tPdf("labels.firbFee"),
        stampDuty: tPdf("labels.stampDuty"),
        foreignSurcharge: tPdf("labels.foreignSurcharge"),
        legalFees: tPdf("labels.legalFees"),
        totalUpfront: tPdf("labels.totalUpfront"),
        annualLandTax: tPdf("labels.annualLandTax"),
        grossYield: tPdf("labels.grossYield"),
        netYield: tPdf("labels.netYield"),
        annualizedROI: tPdf("labels.annualizedROI"),
        monthlyCashFlow: tPdf("labels.monthlyCashFlow"),
        annualIncome: tPdf("labels.annualIncome"),
        annualExpenses: tPdf("labels.annualExpenses"),
        afterTaxCashFlow: tPdf("labels.afterTaxCashFlow"),
        taxBenefit: tPdf("labels.taxBenefit"),
        propertyValue: tPdf("labels.propertyValue"),
        equity: tPdf("labels.equity"),
        loanBalance: tPdf("labels.loanBalance"),
        year: tPdf("labels.year"),
        cumulativeReturn: tPdf("labels.cumulativeReturn"),
        breakEvenYear: tPdf("labels.breakEvenYear"),
        cashRequired: tPdf("labels.cashRequired"),
        investmentType: tPdf("labels.investmentType"),
        annualReturn: tPdf("labels.annualReturn"),
        yearReturn: tPdf("labels.yearReturn", { years: 10 }),
        riskLevel: tPdf("labels.riskLevel"),
        vacancyImpact: tPdf("labels.vacancyImpact"),
        interestImpact: tPdf("labels.interestImpact"),
        growthScenarios: tPdf("labels.growthScenarios"),
        conservative: tPdf("labels.conservative"),
        moderate: tPdf("labels.moderate"),
        optimistic: tPdf("labels.optimistic"),
        deductibleExpenses: tPdf("labels.deductibleExpenses"),
        loanInterest: tPdf("labels.loanInterest"),
        propertyManagement: tPdf("labels.propertyManagement"),
        maintenance: tPdf("labels.maintenance"),
        landTax: tPdf("labels.landTax"),
        councilRates: tPdf("labels.councilRates"),
        insurance: tPdf("labels.insurance"),
        strataFees: tPdf("labels.strataFees"),
        depreciation: tPdf("labels.depreciation"),
        other: tPdf("labels.other"),
        totalDeductions: tPdf("labels.totalDeductions"),
        salePrice: tPdf("labels.salePrice"),
        costBase: tPdf("labels.costBase"),
        capitalGain: tPdf("labels.capitalGain"),
        cgtPayable: tPdf("labels.cgtPayable"),
        withholdingTax: tPdf("labels.withholdingTax"),
        netProceeds: tPdf("labels.netProceeds"),
        overallVerdict: tPdf("labels.overallVerdict"),
        scoreBreakdown: tPdf("labels.scoreBreakdown"),
        rentalYieldScore: tPdf("labels.rentalYieldScore"),
        capitalGrowthScore: tPdf("labels.capitalGrowthScore"),
        cashFlowScore: tPdf("labels.cashFlowScore"),
        taxEfficiencyScore: tPdf("labels.taxEfficiencyScore"),
        riskProfileScore: tPdf("labels.riskProfileScore"),
        strengths: tPdf("labels.strengths"),
        weaknesses: tPdf("labels.weaknesses"),
        keyTakeaways: tPdf("labels.keyTakeaways"),
      },
      notes: {
        estimatesOnly: tPdf("notes.estimatesOnly"),
        professionalAdvice: tPdf("notes.professionalAdvice"),
        regulationsChange: tPdf("notes.regulationsChange"),
        assumptionsBased: tPdf("notes.assumptionsBased"),
        pastPerformance: tPdf("notes.pastPerformance"),
      },
    }),
    [tPdf]
  );

  // Update form data
  const updateFormData = (updates: Partial<FIRBCalculatorFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear validation errors for updated fields
    const updatedKeys = Object.keys(updates);
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      updatedKeys.forEach((key) => {
        delete newErrors[key];
      });
      return newErrors;
    });
  };

  // Get validation errors for current step
  const getValidationErrors = (step: Step): Record<string, boolean> => {
    const errors: Record<string, boolean> = {};

    if (step === "purchaseType") {
      if (!formData.purchaseType) {
        errors.purchaseType = true;
      }
    }

    if (step === "citizenship") {
      if (!formData.citizenshipStatus) {
        errors.citizenshipStatus = true;
      }
      if (formData.citizenshipStatus === "temporary" && !formData.visaType) {
        errors.visaType = true;
      }
    }

    if (step === "property") {
      if (!formData.propertyType) {
        errors.propertyType = true;
      }
      if (!formData.propertyValue || formData.propertyValue <= 0) {
        errors.propertyValue = true;
      }
      if (!formData.state) {
        errors.state = true;
      }
      // For existing properties, purchase date is required
      if (formData.purchaseType === "existing" && !formData.purchaseDate) {
        errors.purchaseDate = true;
      }
    }

    if (step === "financial") {
      // Financial step is optional but we should have at least weekly rent
      if (!investmentInputs.estimatedWeeklyRent || investmentInputs.estimatedWeeklyRent <= 0) {
        errors.estimatedWeeklyRent = true;
      }
    }

    return errors;
  };

  // Handle next button
  const handleNext = (e?: React.MouseEvent) => {
    // Prevent any default form submission behavior
    if (e) {
      e.preventDefault();
    }

    // CRITICAL: Block navigation if purchaseType is not set (unless we're on purchaseType step)
    if (!formData.purchaseType && currentStep !== "purchaseType") {
      console.log("🔴 BLOCKED navigation - purchaseType not set, resetting to purchaseType");
      setCurrentStep("purchaseType");
      setValidationErrors({ purchaseType: true });
      return;
    }

    const errors = getValidationErrors(currentStep);

    if (Object.keys(errors).length > 0) {
      // Set validation errors and prevent navigation
      setValidationErrors(errors);

      // Scroll to first error field after a brief delay to ensure DOM is updated
      setTimeout(() => {
        const firstErrorKey = Object.keys(errors)[0];
        let elementId = "";

        // Map error keys to element IDs
        if (currentStep === "purchaseType") {
          if (firstErrorKey === "purchaseType") {
            elementId = "purchase-type-section";
          }
        } else if (currentStep === "citizenship") {
          if (firstErrorKey === "citizenshipStatus") {
            elementId = "citizenship-status-section";
          } else if (firstErrorKey === "visaType") {
            elementId = "visa-type";
          }
        } else if (currentStep === "property") {
          if (firstErrorKey === "propertyType") {
            elementId = "property-type-section";
          } else if (firstErrorKey === "propertyValue") {
            elementId = "property-value";
          } else if (firstErrorKey === "state") {
            elementId = "state";
          }
        } else if (currentStep === "financial") {
          if (firstErrorKey === "estimatedWeeklyRent") {
            elementId = "weekly-rent";
          }
        }

        if (elementId) {
          const element = document.getElementById(elementId);
          if (element) {
            // Scroll to the element with offset for sticky header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - 100; // 100px offset for header

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });

            // Try to focus the first input/select in the section if possible
            const focusableElement = element.querySelector(
              'input, select, button, [tabindex]:not([tabindex="-1"])'
            ) as HTMLElement;
            if (focusableElement) {
              setTimeout(() => focusableElement.focus(), 300);
            }
          }
        }
      }, 150);

      return;
    }

    // Clear validation errors for current step
    setValidationErrors({});

    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    // Move to next step
    if (currentStep === "purchaseType") {
      setCurrentStep("citizenship");
    } else if (currentStep === "citizenship") {
      setCurrentStep("property");
    } else if (currentStep === "property") {
      setCurrentStep("financial");
    } else if (currentStep === "financial") {
      setCurrentStep("review");
    }
  };

  // Handle back button
  const handleBack = () => {
    // CRITICAL: If purchaseType is not set, always go back to purchaseType
    if (!formData.purchaseType) {
      setCurrentStep("purchaseType");
      return;
    }

    if (currentStep === "property") {
      setCurrentStep("citizenship");
    } else if (currentStep === "citizenship") {
      setCurrentStep("purchaseType");
    } else if (currentStep === "financial") {
      setCurrentStep("property");
    } else if (currentStep === "review") {
      setCurrentStep("financial");
    } else if (currentStep === "results") {
      setCurrentStep("review");
    }
  };

  // Handle edit from review - VERSION 2024-12-19-FIX-2
  const handleEdit = useCallback(
    (step: "purchaseType" | "citizenship" | "property" | "financial") => {
      console.log("=== HANDLEEDIT CALLED VERSION FIX 2 ===", step, currentStep);
      // Clear ALL flags immediately
      isEditingRef.current = false;
      shouldNavigateToReviewRef.current = false;
      editModeInitializedRef.current = false;
      // Remove edit param from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("edit");
      router.replace(url.pathname + (url.search ? url.search : ""), { scroll: false });
      // Set step - useEffect won't interfere because editModeInitializedRef is false
      console.log("=== SETTING STEP TO ===", step);
      setCurrentStep(step);
    },
    [currentStep, router]
  );

  // Handle calculate
  const handleCalculate = async () => {
    setIsCalculating(true);

    try {
      // For existing properties, set eligibility automatically
      if (formData.purchaseType === "existing") {
        const existingEligibility: EligibilityResult = {
          isEligible: true,
          requiresFIRB: false,
          firbApprovalType: "exempt",
          canPurchase: true,
          restrictions: [],
          recommendations: [],
          allowedPropertyTypes: [formData.propertyType!],
        };
        setEligibility(existingEligibility);
      }

      // Ensure required fields are set for established properties
      // This handles edge cases where formData might be missing these fields
      const submitData = { ...formData };
      if (submitData.propertyType === "established") {
        // Ensure propertyClassification is set (default to "house" if missing)
        if (!submitData.propertyClassification) {
          submitData.propertyClassification = "house";
        }
        // Ensure bedrooms is set (default to 3 if missing or null)
        if (submitData.bedrooms === null || submitData.bedrooms === undefined) {
          submitData.bedrooms = 3;
        }
      }

      const response = await fetch("/api/firb-calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Calculation error response:", errorData);

        // Build detailed error message
        let errorMessage = errorData.message || errorData.error || "Validation failed";
        if (errorData.details && Array.isArray(errorData.details)) {
          const validationErrors = errorData.details
            .map((detail: { path?: string[]; message?: string }) => {
              const path = detail.path?.join(".") || detail.path?.[0] || "field";
              return `${path}: ${detail.message || "Invalid value"}`;
            })
            .join("\n");
          errorMessage = `${errorMessage}\n\n${validationErrors}`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Calculation failed");
      }

      // Only set eligibility if not already set for existing properties
      if (formData.purchaseType !== "existing") {
        setEligibility(data.eligibility);
      }
      setCosts(data.costs);

      // Mark review as completed and move to results
      if (!completedSteps.includes("review")) {
        setCompletedSteps((prev) => [...prev, "review"]);
      }
      setCurrentStep("results");
    } catch (error) {
      console.error("Calculation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to calculate. Please try again.";
      alert(errorMessage);
    } finally {
      setIsCalculating(false);
    }
  };

  // Handle download PDF
  const handleDownloadPDF = async (analytics?: InvestmentAnalytics) => {
    console.log("═══════════════════════════════════════════");
    console.log("🔵🔵🔵 handleDownloadPDF CALLED 🔵🔵🔵");
    console.log("═══════════════════════════════════════════");
    console.log("🔵 Analytics parameter:", {
      hasAnalytics: !!analytics,
      analyticsType: typeof analytics,
      analyticsValue: analytics,
      analyticsKeys: analytics ? Object.keys(analytics) : [],
      hasYearByYear: !!analytics?.yearByYear,
    });
    console.log("🔵 isAuthenticated:", isAuthenticated);
    console.log("🔵 eligibility:", !!eligibility);
    console.log("🔵 costs:", !!costs);

    // 1. Check authentication
    if (!isAuthenticated) {
      // Store analytics for retry after login
      pendingPDFAnalyticsRef.current = analytics;
      setLoginModalTitle("Create Account to Download PDF");
      setLoginModalMessage(
        "Download PDF reports requires a free account. Create one now to access your reports."
      );
      setShowLoginModal(true);
      return;
    }

    // Clear any pending analytics since we're authenticated
    pendingPDFAnalyticsRef.current = undefined;

    console.log("🔵 After auth check - eligibility:", !!eligibility, "costs:", !!costs);
    if (!eligibility || !costs) {
      console.warn("🔵 EARLY RETURN: Missing eligibility or costs");
      return;
    }

    try {
      console.log("🔵 Entering try block, setting isGeneratingPDF to true");
      setIsGeneratingPDF(true);
      console.log("🔵 About to start chart capture section");

      // 2. Capture charts if analytics exist
      console.log("═══════════════════════════════════════════");
      console.log("🔵 About to check analytics for chart capture");
      console.log("═══════════════════════════════════════════");
      console.log("🔵 Analytics check:", {
        hasAnalytics: !!analytics,
        analyticsType: typeof analytics,
        analyticsValue: analytics,
        analyticsIsNull: analytics === null,
        analyticsIsUndefined: analytics === undefined,
        analyticsTruthy: !!analytics,
      });

      let chartImages: {
        projectionChart: string | null;
        cashFlowChart: string | null;
        roiComparisonChart: string | null;
      } = {
        projectionChart: null,
        cashFlowChart: null,
        roiComparisonChart: null,
      };

      console.log("🔵 About to check: if (analytics) {");
      if (analytics) {
        console.log("═══════════════════════════════════════════");
        console.log("✅✅✅ ANALYTICS EXISTS! STARTING CHART CAPTURE ✅✅✅");
        console.log("═══════════════════════════════════════════");
        console.log("📊 Starting chart capture for PDF generation...");
        console.log("   Analytics provided:", !!analytics);
        console.log("   Checking if charts exist in DOM...");

        // First, check if charts exist BEFORE trying to open sections
        const initialCheck = {
          projection: !!document.getElementById("projection-chart-container"),
          cashFlow: !!document.getElementById("cash-flow-chart-container"),
          roiComparison: !!document.getElementById("roi-comparison-chart-container"),
        };
        console.log("   Initial chart check (before opening sections):", initialCheck);

        // Ensure chart sections are open before capture
        // Strategy: Check if chart containers exist, if not, try to open sections
        const chartContainers = [
          { id: "cash-flow-chart-container", section: "cashFlow" },
          { id: "projection-chart-container", section: "projections" },
          { id: "roi-comparison-chart-container", section: "comparison" },
        ];

        for (const { id, section } of chartContainers) {
          const element = document.getElementById(id);
          if (!element) {
            console.log(`   Chart "${id}" not visible, attempting to open section "${section}"`);

            // Find all buttons that might toggle sections
            const allButtons = Array.from(
              document.querySelectorAll("button[aria-expanded]")
            ) as HTMLElement[];
            for (const button of allButtons) {
              const isClosed = button.getAttribute("aria-expanded") === "false";
              if (isClosed) {
                // Click and wait to see if our chart appears
                button.click();
                await new Promise((resolve) => setTimeout(resolve, 500));

                // Check if chart now exists
                if (document.getElementById(id)) {
                  console.log(`   ✅ Opened section containing "${id}"`);
                  break;
                }
              }
            }
          } else {
            console.log(`   ✅ Chart "${id}" already visible`);
          }
        }

        // Wait for charts to render after opening sections
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Increased wait time for chart rendering

        // Verify chart elements exist and are visible before capture
        const projectionEl = document.getElementById("projection-chart-container");
        const cashFlowEl = document.getElementById("cash-flow-chart-container");
        const roiEl = document.getElementById("roi-comparison-chart-container");

        const projectionExists = !!projectionEl;
        const cashFlowExists = !!cashFlowEl;
        const roiExists = !!roiEl;

        // Check if elements have actual content (SVG or canvas)
        const projectionHasContent = projectionEl?.querySelector("svg, canvas") !== null;
        const cashFlowHasContent = cashFlowEl?.querySelector("svg, canvas") !== null;
        const roiHasContent = roiEl?.querySelector("svg, canvas") !== null;

        console.log("🔍 Chart element verification:", {
          projection: { exists: projectionExists, hasContent: projectionHasContent },
          cashFlow: { exists: cashFlowExists, hasContent: cashFlowHasContent },
          roiComparison: { exists: roiExists, hasContent: roiHasContent },
        });

        if (!projectionExists || !cashFlowExists || !roiExists) {
          console.warn("⚠️ Some chart containers are missing. Charts may not be captured.");
        }

        if (!projectionHasContent || !cashFlowHasContent || !roiHasContent) {
          console.warn(
            "⚠️ Some chart containers exist but have no content. Charts may not render properly."
          );
        }

        // Capture all charts sequentially to avoid race conditions
        console.log("   ===== CAPTURING PROJECTION CHART =====");
        const projectionElement = document.getElementById("projection-chart-container");
        console.log("   Projection element exists:", !!projectionElement);
        if (projectionElement) {
          console.log("   Projection element dimensions:", {
            width: projectionElement.offsetWidth,
            height: projectionElement.offsetHeight,
            hasSVG: !!projectionElement.querySelector("svg"),
            hasCanvas: !!projectionElement.querySelector("canvas"),
          });
        }

        let projection = await captureProjectionChart().catch((err) => {
          console.error("   ❌ Failed to capture projection chart:", err);
          console.error("   Error details:", err instanceof Error ? err.message : String(err));
          return null;
        });

        console.log("   Projection capture result:", {
          success: !!projection,
          length: projection?.length || 0,
          preview: projection?.substring(0, 50) || "null",
        });

        // If capture failed, wait and retry once
        if (!projection) {
          console.log("   ⚠️ Projection chart capture failed, waiting and retrying...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          projection = await captureProjectionChart().catch((err) => {
            console.error("   ❌ Retry also failed:", err);
            return null;
          });
          console.log("   Retry result:", {
            success: !!projection,
            length: projection?.length || 0,
          });
        }

        console.log("   ===== CAPTURING CASH FLOW CHART =====");
        const cashFlowElement = document.getElementById("cash-flow-chart-container");
        console.log("   Cash flow element exists:", !!cashFlowElement);
        if (cashFlowElement) {
          console.log("   Cash flow element dimensions:", {
            width: cashFlowElement.offsetWidth,
            height: cashFlowElement.offsetHeight,
            hasSVG: !!cashFlowElement.querySelector("svg"),
            hasCanvas: !!cashFlowElement.querySelector("canvas"),
          });
        }

        let cashFlow = await captureCashFlowChart().catch((err) => {
          console.error("   ❌ Failed to capture cash flow chart:", err);
          console.error("   Error details:", err instanceof Error ? err.message : String(err));
          return null;
        });

        console.log("   Cash flow capture result:", {
          success: !!cashFlow,
          length: cashFlow?.length || 0,
          preview: cashFlow?.substring(0, 50) || "null",
        });

        // If capture failed, wait and retry once
        if (!cashFlow) {
          console.log("   ⚠️ Cash flow chart capture failed, waiting and retrying...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          cashFlow = await captureCashFlowChart().catch((err) => {
            console.error("   ❌ Retry also failed:", err);
            return null;
          });
          console.log("   Retry result:", { success: !!cashFlow, length: cashFlow?.length || 0 });
        }

        console.log("   ===== CAPTURING ROI COMPARISON CHART =====");
        const roiElement = document.getElementById("roi-comparison-chart-container");
        console.log("   ROI comparison element exists:", !!roiElement);
        if (roiElement) {
          console.log("   ROI comparison element dimensions:", {
            width: roiElement.offsetWidth,
            height: roiElement.offsetHeight,
            hasSVG: !!roiElement.querySelector("svg"),
            hasCanvas: !!roiElement.querySelector("canvas"),
          });
        }

        let roi = await captureROIComparisonChart().catch((err) => {
          console.error("   ❌ Failed to capture ROI chart:", err);
          console.error("   Error details:", err instanceof Error ? err.message : String(err));
          return null;
        });

        console.log("   ROI comparison capture result:", {
          success: !!roi,
          length: roi?.length || 0,
          preview: roi?.substring(0, 50) || "null",
        });

        // If capture failed, wait and retry once
        if (!roi) {
          console.log("   ⚠️ ROI comparison chart capture failed, waiting and retrying...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          roi = await captureROIComparisonChart().catch((err) => {
            console.error("   ❌ Retry also failed:", err);
            return null;
          });
          console.log("   Retry result:", { success: !!roi, length: roi?.length || 0 });
        }

        chartImages = {
          projectionChart: projection,
          cashFlowChart: cashFlow,
          roiComparisonChart: roi,
        };

        console.log("📊 Chart capture complete:", {
          projection: {
            captured: !!projection,
            length: projection?.length || 0,
            isValid: projection?.startsWith("data:image/png") || false,
          },
          cashFlow: {
            captured: !!cashFlow,
            length: cashFlow?.length || 0,
            isValid: cashFlow?.startsWith("data:image/png") || false,
          },
          roiComparison: {
            captured: !!roi,
            length: roi?.length || 0,
            isValid: roi?.startsWith("data:image/png") || false,
          },
        });

        // Validate chart images
        const validCharts = [projection, cashFlow, roi].filter(
          (img) => img && img.startsWith("data:image/png")
        );
        if (validCharts.length === 0) {
          console.error("❌ CRITICAL: No valid chart images captured!");
          console.error("   This means charts will NOT appear in the PDF.");
          console.error("   Possible causes:");
          console.error("   - Chart elements not found in DOM");
          console.error("   - html2canvas failed to capture");
          console.error("   - Charts not rendered yet");
          console.warn("⚠️ PDF will be generated without charts.");
        } else {
          console.log(`✅ Successfully captured ${validCharts.length}/3 charts`);
          if (validCharts.length < 3) {
            console.warn(
              `⚠️ Only ${validCharts.length}/3 charts captured. Some charts will be missing from PDF.`
            );
          }
        }
      } else {
        console.warn("⚠️ Analytics is null/undefined - skipping chart capture");
        console.warn("   This means charts will NOT be included in PDF");
        console.warn("   Analytics value:", analytics);
        console.warn("   Analytics type:", typeof analytics);
        console.warn("   Analytics === null:", analytics === null);
        console.warn("   Analytics === undefined:", analytics === undefined);
      }

      // 3. Call server API to generate PDF
      console.log("🔵 FINAL CHECK before API call:", {
        analyticsExists: !!analytics,
        analyticsValue: analytics,
        chartImagesInitialized: !!chartImages,
        chartImagesValues: chartImages,
      });
      console.log("🔵 About to send PDF generation request with:", {
        hasFormData: !!formData,
        hasEligibility: !!eligibility,
        hasCosts: !!costs,
        hasAnalytics: !!analytics,
        hasChartImages: !!chartImages,
        chartImagesDetail: {
          projection: !!chartImages.projectionChart,
          cashFlow: !!chartImages.cashFlowChart,
          roiComparison: !!chartImages.roiComparisonChart,
        },
      });
      const response = await fetch("/api/pdf/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include auth cookies
        body: JSON.stringify({
          formData,
          eligibility,
          costs,
          analytics: analytics || undefined,
          chartImages,
          locale,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setShowLoginModal(true);
          setLoginModalTitle("Please Log In");
          setLoginModalMessage("Your session has expired. Please log in again to download PDFs.");
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to generate PDF");
      }

      // 4. Download PDF blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = analytics
        ? `FIRB-Investment-Analysis-${locale}-${timestamp}.pdf`
        : `FIRB-Analysis-${timestamp}.pdf`;
      link.href = url;
      link.download = filename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert(error instanceof Error ? error.message : "Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Handle email results
  const handleEmailResults = () => {
    setIsEmailModalOpen(true);
  };

  // Handle edit calculation from results
  const handleEditCalculation = () => {
    setCurrentStep("review");
  };

  const handleEditInvestmentInputs = () => {
    setCurrentStep("financial");
  };

  // Handle start again - reset everything
  const handleStartAgain = () => {
    // Reset all form data
    setFormData({
      purchaseType: undefined,
      purchaseDate: undefined,
      citizenshipStatus: undefined,
      visaType: undefined,
      isOrdinarilyResident: undefined,
      propertyType: undefined,
      propertyValue: undefined,
      state: undefined,
      propertyAddress: "",
      isFirstHome: false,
      depositPercent: 20,
      entityType: "individual",
    });

    // Reset steps
    setCurrentStep("purchaseType");
    setCompletedSteps([]);

    // Clear results
    setEligibility(null);
    setCosts(null);

    // Reset loaded calculation ref and editing ID
    loadedCalculationIdRef.current = null;
    setEditingCalculationId(null);
    setSavedCalculationName(null);
    setLoadError(null); // Clear any load errors
    isEditingRef.current = false;
    shouldNavigateToReviewRef.current = false;
  };

  // Generate structured data schemas
  const calculatorSchema = generateCalculatorSchema({
    locale,
    title: t("title"),
    description: t("description"),
  });
  const howToSchema = generateCalculatorHowToSchema(locale);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={injectStructuredData(calculatorSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={injectStructuredData(howToSchema)}
      />
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Error Alert - show if there was an error loading calculation */}
            {loadError && (
              <div className="mb-6">
                <CustomAlert variant="destructive" title="Unable to Load Calculation">
                  <div className="flex items-start justify-between">
                    <p className="flex-1">{loadError}</p>
                    <button
                      onClick={() => setLoadError(null)}
                      className="ml-4 text-red-600 hover:text-red-800"
                      aria-label="Dismiss error"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </CustomAlert>
              </div>
            )}

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-gray-900">{heroTitle}</h1>
              <p className="text-lg text-muted-foreground">{heroSubtitle}</p>
            </div>

            {/* Progress Indicator */}
            {!isResults && (
              <ProgressIndicator
                currentStep={currentStep}
                completedSteps={completedSteps}
                purchaseType={formData.purchaseType as "purchasing" | "existing" | undefined}
              />
            )}

            {/* Step Content */}
            <div className="mt-8">
              {/* Loading Saved Calculation */}
              {isLoadingSavedCalculation && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-lg text-gray-600">Loading saved calculation...</p>
                  </div>
                </div>
              )}

              {/* Purchase Type Step - Show when currentStep is purchaseType */}
              {!isLoadingSavedCalculation && currentStep === "purchaseType" && (
                <div className="space-y-6">
                  <PurchaseTypeStep
                    purchaseType={formData.purchaseType || ""}
                    onPurchaseTypeChange={(type) => {
                      updateFormData({ purchaseType: type });
                      // Ensure we stay on purchaseType step after selection
                      if (currentStep !== "purchaseType") {
                        setCurrentStep("purchaseType");
                      }
                    }}
                    errors={validationErrors}
                  />

                  {/* Navigation - No back button on first step */}
                  <div className="flex justify-end">
                    <Button size="lg" onClick={handleNext} className="gap-2">
                      {t("next")}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Citizenship Step - Show for both purchasing and existing */}
              {!isLoadingSavedCalculation &&
                currentStep === "citizenship" &&
                formData.purchaseType && (
                  <div className="space-y-6">
                    <CitizenshipStep
                      citizenshipStatus={formData.citizenshipStatus || ""}
                      visaType={formData.visaType}
                      isOrdinarilyResident={formData.isOrdinarilyResident}
                      onCitizenshipStatusChange={(status) =>
                        updateFormData({ citizenshipStatus: status })
                      }
                      onVisaTypeChange={(type) => updateFormData({ visaType: type })}
                      onOrdinarilyResidentChange={(isResident) =>
                        updateFormData({ isOrdinarilyResident: isResident })
                      }
                      errors={validationErrors}
                    />

                    {/* Navigation */}
                    <div className="flex justify-between">
                      <Button size="lg" variant="outline" onClick={handleBack} className="gap-2">
                        <ArrowLeft className="h-5 w-5" />
                        {t("back")}
                      </Button>
                      <Button size="lg" onClick={handleNext} className="gap-2">
                        {t("next")}
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}

              {/* Property Details Step - Show after citizenship step */}
              {!isLoadingSavedCalculation &&
                currentStep === "property" &&
                formData.purchaseType &&
                formData.citizenshipStatus && (
                  <div className="space-y-6">
                    <PropertyDetailsStep
                      propertyType={formData.propertyType || ""}
                      propertyValue={formData.propertyValue || 0}
                      state={formData.state || ""}
                      propertyAddress={formData.propertyAddress}
                      isFirstHome={formData.isFirstHome || false}
                      depositPercent={formData.depositPercent || 20}
                      entityType={formData.entityType || "individual"}
                      purchaseType={formData.purchaseType}
                      purchaseDate={formData.purchaseDate}
                      propertyClassification={formData.propertyClassification ?? null}
                      bedrooms={formData.bedrooms ?? null}
                      onPropertyTypeChange={(type) => {
                        updateFormData({ propertyType: type });
                        // Clear classification and bedrooms when property type changes away from established
                        if (type !== "established") {
                          updateFormData({ propertyClassification: null, bedrooms: null });
                        }
                      }}
                      onPropertyValueChange={(value) => updateFormData({ propertyValue: value })}
                      onStateChange={(state) => updateFormData({ state })}
                      onPropertyAddressChange={(address) =>
                        updateFormData({ propertyAddress: address })
                      }
                      onFirstHomeChange={(isFirstHome) => updateFormData({ isFirstHome })}
                      onDepositPercentChange={(percent) =>
                        updateFormData({ depositPercent: percent })
                      }
                      onEntityTypeChange={(type) => updateFormData({ entityType: type })}
                      onPurchaseDateChange={(date) => updateFormData({ purchaseDate: date })}
                      onPropertyClassificationChange={(classification) =>
                        updateFormData({ propertyClassification: classification })
                      }
                      onBedroomsChange={(bedrooms) => updateFormData({ bedrooms })}
                      errors={validationErrors}
                    />

                    {/* Navigation */}
                    <div className="flex justify-between">
                      <Button size="lg" variant="outline" onClick={handleBack} className="gap-2">
                        <ArrowLeft className="h-5 w-5" />
                        {t("back")}
                      </Button>
                      <Button size="lg" onClick={handleNext} className="gap-2">
                        {t("next")}
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}

              {/* Financial Details Step */}
              {!isLoadingSavedCalculation &&
                currentStep === "financial" &&
                formData.propertyValue &&
                formData.state &&
                formData.propertyType && (
                  <div className="space-y-6">
                    <FinancialDetailsStep
                      investmentInputs={investmentInputs}
                      onInvestmentInputsChange={(updates) => {
                        setInvestmentInputs((prev) => {
                          const newInputs = { ...prev, ...updates };
                          // Ensure we're creating a new object reference to trigger re-renders
                          return newInputs;
                        });
                        // Clear validation errors for updated fields
                        const updatedKeys = Object.keys(updates);
                        setValidationErrors((prev) => {
                          const newErrors = { ...prev };
                          updatedKeys.forEach((key) => {
                            delete newErrors[key];
                          });
                          return newErrors;
                        });
                      }}
                      propertyValue={formData.propertyValue}
                      depositPercent={formData.depositPercent || 20}
                      benchmarkData={benchmarkData}
                      isLoadingBenchmarks={isLoadingBenchmarks}
                      errors={validationErrors}
                    />

                    {/* Navigation */}
                    <div className="flex justify-between">
                      <Button size="lg" variant="outline" onClick={handleBack} className="gap-2">
                        <ArrowLeft className="h-5 w-5" />
                        {t("back")}
                      </Button>
                      <Button size="lg" onClick={handleNext} className="gap-2">
                        {t("next")}
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}

              {/* Review Step */}
              {!isLoadingSavedCalculation && currentStep === "review" && (
                <div className="space-y-6">
                  <ReviewStep
                    formData={formData}
                    investmentInputs={investmentInputs}
                    onEdit={handleEdit}
                    onCalculate={handleCalculate}
                    isCalculating={isCalculating}
                  />

                  {/* Navigation */}
                  <div className="flex justify-start">
                    <Button size="lg" variant="outline" onClick={handleBack} className="gap-2">
                      <ArrowLeft className="h-5 w-5" />
                      {t("back")}
                    </Button>
                  </div>
                </div>
              )}

              {/* Results Step */}
              {!isLoadingSavedCalculation &&
                currentStep === "results" &&
                !isEditingRef.current &&
                eligibility &&
                costs &&
                formData.propertyValue &&
                formData.propertyType &&
                formData.state && (
                  <ResultsPanel
                    eligibility={eligibility}
                    costs={costs}
                    onDownloadPDF={handleDownloadPDF}
                    onEmailResults={handleEmailResults}
                    onEditCalculation={handleEditCalculation}
                    onEditInvestmentInputs={handleEditInvestmentInputs}
                    onStartAgain={handleStartAgain}
                    propertyValue={formData.propertyValue}
                    propertyType={formData.propertyType}
                    state={formData.state}
                    depositPercent={formData.depositPercent || 20}
                    formData={formData as FIRBCalculatorFormData}
                    investmentInputs={investmentInputs}
                    editingCalculationId={editingCalculationId}
                    onSaveSuccess={(name, calculationId) => {
                      setSavedCalculationName(name);
                      // Update editingCalculationId if this was a new save
                      if (!editingCalculationId) {
                        setEditingCalculationId(calculationId);
                      }
                    }}
                  />
                )}
            </div>

            {/* Email Modal */}
            {eligibility && costs && (
              <EmailResultsModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                eligibility={eligibility}
                costs={costs}
                formData={formData as FIRBCalculatorFormData}
                locale={locale}
              />
            )}

            {/* Login Modal for PDF Downloads */}
            <LoginModal
              isOpen={showLoginModal}
              onClose={() => {
                setShowLoginModal(false);
                setLoginModalTitle(undefined);
                setLoginModalMessage(undefined);
              }}
              title={loginModalTitle}
              message={loginModalMessage}
              preventRedirect={true}
              onSuccess={async () => {
                // Retry PDF download after successful login with stored analytics
                await handleDownloadPDF(pendingPDFAnalyticsRef.current);
              }}
            />

            {/* Purpose Statement - At bottom of page */}
            {(currentStep === "purchaseType" ||
              currentStep === "citizenship" ||
              currentStep === "property" ||
              currentStep === "financial") && (
              <div className="mt-16 p-6 bg-blue-50 border border-blue-200 rounded">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {locale === "zh" ? "什么是计算器？" : "What is the Calculator?"}
                </h2>
                <p className="text-gray-600 mb-3">
                  {locale === "zh"
                    ? "计算器是一个工具，帮助投资者计算在澳大利亚购买房产所需的所有费用。这包括FIRB申请费、印花税、土地税附加费、律师费和其他相关成本。"
                    : "The Calculator is a tool that helps investors calculate all costs required to purchase property in Australia. This includes FIRB application fees, stamp duty, land tax surcharge, legal fees, and other related costs."}
                </p>
                <p className="text-gray-600 mb-3">
                  {locale === "zh"
                    ? "我们的计算器会根据您的公民身份、房产类型、所在州和房产价值，为您提供详细的费用明细和投资分析。"
                    : "Our calculator provides detailed cost breakdowns and investment analysis based on your citizenship status, property type, state, and property value."}
                </p>
                <p className="text-sm text-gray-600">
                  {locale === "zh" ? (
                    <>
                      需要了解术语定义？查看我们的{" "}
                      <Link
                        href={`/${locale}/faq`}
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        常见问题页面
                      </Link>
                      ，其中包含完整的术语表。
                    </>
                  ) : (
                    <>
                      Need help with terminology? Check our{" "}
                      <Link
                        href={`/${locale}/faq`}
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                      >
                        FAQ page
                      </Link>
                      , which includes a complete glossary of terms.
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
