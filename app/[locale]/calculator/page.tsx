/**
 * FIRB Calculator Main Page
 * Progressive disclosure wizard for FIRB calculations
 */

"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
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
import { CitizenshipStatus, PropertyType, AustralianState, EntityType } from "@/lib/firb/constants";
import { FIRBCalculatorFormData } from "@/lib/validations/firb";
import { EligibilityResult } from "@/lib/firb/eligibility";
import { CostBreakdown } from "@/lib/firb/calculations";
import { generateFIRBPDF } from "@/lib/pdf/generateFIRBPDF";
import { generateEnhancedPDF } from "@/lib/pdf/generateEnhancedPDF";
import type { InvestmentAnalytics, InvestmentInputs } from "@/types/investment";
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

  // Wizard state - always start at purchaseType for new calculations
  const [currentStep, setCurrentStep] = useState<Step>("purchaseType");
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

  // Loading state for saved calculations
  const [isLoadingSavedCalculation, setIsLoadingSavedCalculation] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const loadedCalculationIdRef = useRef<string | null>(null);
  const loadingAttemptRef = useRef<string | null>(null); // Track current loading attempt to prevent loops
  const [editingCalculationId, setEditingCalculationId] = useState<string | null>(null);
  const isEditingRef = useRef<boolean>(false);
  const shouldNavigateToReviewRef = useRef<boolean>(false);

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

  const heroTitle = isResults
    ? t("results.heroTitle") === "FIRBCalculator.results.heroTitle"
      ? "Investment Analysis"
      : t("results.heroTitle")
    : t("title");

  const heroSubtitle = isResults
    ? propertySubtitle ||
      (t("results.heroSubtitleFallback") === "FIRBCalculator.results.heroSubtitleFallback"
        ? "Review your investment assumptions, risks, and next steps."
        : t("results.heroSubtitleFallback"))
    : t("description");

  // Get URL search parameters
  const searchParams = useSearchParams();

  // CRITICAL: Force purchaseType step if it's not set - runs on every render
  useEffect(() => {
    // If purchaseType is not set, FORCE currentStep to be purchaseType (unless loading saved calc or on results)
    if (!isLoadingSavedCalculation && !formData.purchaseType && currentStep !== "results") {
      if (currentStep !== "purchaseType") {
        setCurrentStep("purchaseType");
        setCompletedSteps([]);
      }
    }
  }, [formData.purchaseType, currentStep, isLoadingSavedCalculation]);

  // CRITICAL: Immediately navigate to review when edit=true is detected in URL
  useEffect(() => {
    const isEdit = searchParams.get("edit") === "true";
    const loadId = searchParams.get("load");
    
    if (isEdit && loadId) {
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
      
      // Keep flags active - will be cleared after load completes
    } else if (!isEdit) {
      // If edit=false or not present, clear the flags
      isEditingRef.current = false;
      shouldNavigateToReviewRef.current = false;
    }
  }, [searchParams, currentStep]);

  // CRITICAL: Force purchaseType step if it's not set - runs on every render
  useEffect(() => {
    const isEdit = searchParams.get("edit") === "true";
    
    // Don't interfere if we're currently editing a saved calculation or navigating to review
    // Also check URL param to be extra safe
    if (isEditingRef.current || shouldNavigateToReviewRef.current || isEdit) return;
    
    // If purchaseType is not set, FORCE currentStep to be purchaseType (unless loading saved calc, on results, or on review)
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
    const attemptKey = loadId ? `${loadId}-${isEdit}` : null;
    
    // Don't load if: no ID, already loading, or there's an error (prevents retry loops)
    if (!loadId) {
      // If no load ID, reset all refs to allow loading a different calculation later
      loadedCalculationIdRef.current = null;
      loadingAttemptRef.current = null;
      return;
    }
    
    // Don't retry if already loading this exact calculation in edit/view mode
    if (isLoadingSavedCalculation || loadingAttemptRef.current === attemptKey) {
      return;
    }
    
    // Don't retry if there's an error for this exact calculation
    if (loadError && loadedCalculationIdRef.current === loadId) {
      return;
    }
    
    // Determine if we need to reload:
    const isDifferentCalculation = loadId !== loadedCalculationIdRef.current;
    const needsReloadForView = !isEdit && (!eligibility || !costs);
    // For edit mode, only reload if it's a different calculation
    const needsReloadForEdit = isEdit && isDifferentCalculation;
    
    if (isDifferentCalculation || needsReloadForEdit || needsReloadForView) {
      loadingAttemptRef.current = attemptKey; // Mark that we're attempting to load this
      loadSavedCalculation(loadId, isEdit);
      loadedCalculationIdRef.current = loadId;
    }
  }, [searchParams, isLoadingSavedCalculation, loadError, eligibility, costs]);

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
    console.log("[loadSavedCalculation] Starting load for:", calculationId, "isEdit:", isEdit);
    setIsLoadingSavedCalculation(true);
    setLoadError(null); // Clear any previous errors
    const attemptKey = `${calculationId}-${isEdit}`;
    loadingAttemptRef.current = attemptKey; // Mark that we're attempting to load this

    try {
      let response: Response;
      try {
        response = await fetch(`/api/calculations/${calculationId}`);
      } catch (fetchError) {
        // Handle network errors (failed to fetch)
        console.error("Network error loading saved calculation:", fetchError);
        setLoadError("Failed to connect to server. Please check your internet connection and try again.");
        // Reset state and navigate away from edit mode
        loadedCalculationIdRef.current = null;
        isEditingRef.current = false;
        shouldNavigateToReviewRef.current = false;
        setCurrentStep("purchaseType");
        setCompletedSteps([]);
        setEditingCalculationId(null);
        // Clear the loading attempt ref to allow retry only if URL params are re-added
        loadingAttemptRef.current = null;
        // Remove the load/edit params from URL to prevent retry loops
        const url = new URL(window.location.href);
        url.searchParams.delete("load");
        url.searchParams.delete("edit");
        window.history.replaceState({}, "", url.toString());
        console.log("[loadSavedCalculation] Error handled, clearing loading state");
        setIsLoadingSavedCalculation(false); // Explicitly clear loading state
        return;
      }

      if (!response.ok) {
        let errorMessage = "";
        // Handle 404 specifically
        if (response.status === 404) {
          errorMessage = "This calculation could not be found. It may have been deleted or you don't have permission to access it.";
        } else if (response.status === 401) {
          // Handle 401 (unauthorized)
          errorMessage = "You need to be logged in to access this calculation. Please sign in and try again.";
        } else {
          errorMessage = `Failed to load calculation: ${response.status} ${response.statusText}`;
        }
        
        setLoadError(errorMessage);
        // Reset state and navigate away from edit mode
        loadedCalculationIdRef.current = null;
        isEditingRef.current = false;
        shouldNavigateToReviewRef.current = false;
        setCurrentStep("purchaseType");
        setCompletedSteps([]);
        setEditingCalculationId(null);
        // Clear the loading attempt ref to allow retry only if URL params are re-added
        loadingAttemptRef.current = null;
        // Remove the load/edit params from URL to prevent retry loops
        const url = new URL(window.location.href);
        url.searchParams.delete("load");
        url.searchParams.delete("edit");
        window.history.replaceState({}, "", url.toString());
        console.log("[loadSavedCalculation] Error handled, clearing loading state");
        setIsLoadingSavedCalculation(false); // Explicitly clear loading state
        return;
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Error parsing response JSON:", jsonError);
        throw new Error("Invalid response from server");
      }

      if (data.success && data.calculation) {
        const calculation = data.calculation;
        const calculationData = calculation.calculation_data;

        // For editing, set editing ID and ensure flags are set
        if (isEdit) {
          setEditingCalculationId(calculation.id);
          // Ensure flags are still set
          isEditingRef.current = true;
          shouldNavigateToReviewRef.current = true;
          // Clear eligibility/costs
          setEligibility(null);
          setCosts(null);
        }

        // Pre-fill form data
        setFormData({
          purchaseType: calculationData.purchaseType || "purchasing",
          purchaseDate: calculationData.purchaseDate,
          citizenshipStatus: calculationData.citizenshipStatus,
          visaType: calculationData.visaType,
          isOrdinarilyResident: calculationData.isOrdinarilyResident,
          propertyType: calculationData.propertyType,
          propertyValue: calculationData.propertyValue,
          state: calculationData.propertyState,
          propertyAddress: calculationData.propertyAddress,
          isFirstHome: calculationData.isFirstHome,
          depositPercent: calculationData.depositPercent,
          entityType: calculationData.entityType,
          expeditedFIRB: false,
        });

        // Load investment inputs if they exist
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
          setInvestmentInputs({});
        }

        // Set step AFTER all data is loaded
        if (isEdit) {
          // For editing, navigate to review step
          setCompletedSteps(["citizenship", "property", "financial"]);
          if (currentStep !== "review") {
            setCurrentStep("review");
          }
        } else {
          // For viewing, set results and navigate to results step
          setEligibility(calculationData.eligibility);
          setCosts(calculationData.costs);
          setCompletedSteps(["citizenship", "property", "financial", "review"]);
          setCurrentStep("results");
          // Set editingCalculationId when viewing so we know this is a saved calculation
          setEditingCalculationId(calculation.id);
        }
        // Successfully loaded - keep the attempt ref so we don't reload unnecessarily
        loadingAttemptRef.current = `${calculationId}-${isEdit}`;
      } else {
        // If data.success is false or calculation is missing, show error
        setLoadError("Invalid response from server. The calculation data may be corrupted.");
        loadedCalculationIdRef.current = null;
        isEditingRef.current = false;
        shouldNavigateToReviewRef.current = false;
        setCurrentStep("purchaseType");
        setCompletedSteps([]);
        setEditingCalculationId(null);
        const url = new URL(window.location.href);
        url.searchParams.delete("load");
        url.searchParams.delete("edit");
        window.history.replaceState({}, "", url.toString());
        loadingAttemptRef.current = null; // Clear attempt ref
      }
    } catch (error) {
      console.error("Error loading saved calculation:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setLoadError(`Failed to load calculation: ${errorMessage}. Please try again or start a new calculation.`);
      
      // Reset state on error to allow user to continue
      loadedCalculationIdRef.current = null;
      isEditingRef.current = false;
      shouldNavigateToReviewRef.current = false;
      setCurrentStep("purchaseType");
      setCompletedSteps([]);
      setEditingCalculationId(null);
      
      // Remove the load/edit params from URL to prevent retry loops
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("load");
        url.searchParams.delete("edit");
        window.history.replaceState({}, "", url.toString());
        loadingAttemptRef.current = null; // Clear attempt ref on error
      } catch (urlError) {
        // Ignore URL errors - we're already handling the main error
        console.error("Error updating URL:", urlError);
      }
    } finally {
      // Always clear loading state, even if there were early returns
      console.log("[loadSavedCalculation] Finally block - clearing loading state");
      setIsLoadingSavedCalculation(false);
      // Note: loadingAttemptRef is cleared in error handlers and URL param removal
      // For successful loads, we keep it set to prevent unnecessary reloads
    }
  };

  // Prepare PDF translations (memoized for performance)
  const pdfTranslations = useMemo(
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
      // Financial step is optional but we should have at least weekly rent if it's a rental
      const isRental =
        !investmentInputs.propertyUsage || investmentInputs.propertyUsage === "rental";

      if (isRental) {
        if (!investmentInputs.estimatedWeeklyRent || investmentInputs.estimatedWeeklyRent <= 0) {
          errors.estimatedWeeklyRent = true;
        }
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
          } else if (firstErrorKey === "purchaseDate") {
            elementId = "purchase-date";
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

  // Handle edit from review
  const handleEdit = (step: "purchaseType" | "citizenship" | "property" | "financial") => {
    setCurrentStep(step);
  };

  // Handle calculate
  const handleCalculate = async () => {
    setIsCalculating(true);

    try {
      const response = await fetch("/api/firb-calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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

      setEligibility(data.eligibility);
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
    if (!eligibility || !costs) return;

    try {
      // Use enhanced PDF if analytics are provided, otherwise basic PDF
      const pdfBlob = analytics
        ? await generateEnhancedPDF(
            formData,
            eligibility,
            costs,
            analytics,
            locale,
            pdfTranslations
          )
        : generateFIRBPDF(formData, eligibility, costs);

      const url = URL.createObjectURL(pdfBlob);
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
      alert("Failed to generate PDF. Please try again.");
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
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 leading-tight">
                {heroTitle}
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {heroSubtitle}
              </p>
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

              {/* Error Alert - Show if there was an error loading calculation */}
              {loadError && !isLoadingSavedCalculation && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-red-800">Failed to Load Calculation</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{loadError}</p>
                      </div>
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setLoadError(null);
                            setCurrentStep("purchaseType");
                          }}
                          className="text-sm font-medium text-red-800 hover:text-red-900 underline"
                        >
                          Start a new calculation
                        </button>
                      </div>
                    </div>
                    <div className="ml-auto pl-3">
                      <button
                        type="button"
                        onClick={() => setLoadError(null)}
                        className="inline-flex text-red-400 hover:text-red-500"
                      >
                        <span className="sr-only">Dismiss</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
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
                      costBenchmarks={costBenchmarks}
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

            {/* Purpose Statement - At bottom of page */}
            {!isResults && (
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
      </main>
    </>
  );
}
