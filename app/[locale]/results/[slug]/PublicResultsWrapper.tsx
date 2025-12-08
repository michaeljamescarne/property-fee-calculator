/**
 * Client Component Wrapper for Public Results
 * Handles client-side interactions for the public results page
 */

"use client";

import { useRouter } from "next/navigation";
import ResultsPanel from "@/components/firb/ResultsPanel";
import type { EligibilityResult } from "@/lib/firb/eligibility";
import type { CostBreakdown } from "@/lib/firb/calculations";
import type { FIRBCalculatorFormData } from "@/lib/validations/firb";
import { PropertyType, AustralianState } from "@/lib/firb/constants";

interface PublicResultsWrapperProps {
  eligibility: EligibilityResult;
  costs: CostBreakdown;
  propertyValue: number;
  propertyType: PropertyType;
  state: AustralianState;
  depositPercent: number;
  formData: FIRBCalculatorFormData;
  locale: string;
}

export default function PublicResultsWrapper({
  eligibility,
  costs,
  propertyValue,
  propertyType,
  state,
  depositPercent,
  formData,
  locale,
}: PublicResultsWrapperProps) {
  const router = useRouter();

  return (
    <ResultsPanel
      eligibility={eligibility}
      costs={costs}
      onDownloadPDF={() => {
        // PDF download not available on public results page
      }}
      onEmailResults={() => {
        // Email not available on public results page
      }}
      onEditCalculation={() => {
        // Edit not available on public results page
      }}
      onEditInvestmentInputs={() => {
        // Edit not available on public results page
      }}
      onStartAgain={() => {
        // Start again redirects to calculator
        router.push(`/${locale}/firb-calculator`);
      }}
      propertyValue={propertyValue}
      propertyType={propertyType}
      state={state}
      depositPercent={depositPercent}
      formData={formData}
      investmentInputs={{}}
    />
  );
}
