/**
 * Public Results Page
 * Displays shared calculation results by slug
 */

import { notFound } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import ResultsPanel from "@/components/firb/ResultsPanel";
import type { EligibilityResult } from "@/lib/firb/eligibility";
import type { CostBreakdown } from "@/lib/firb/calculations";
import type { FIRBCalculatorFormData } from "@/lib/validations/firb";
import { PropertyType, AustralianState } from "@/lib/firb/constants";
import type { FIRBCalculation } from "@/types/database";
import PublicResultsWrapper from "./PublicResultsWrapper";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ResultsPage({ params }: PageProps) {
  const { locale, slug } = await params;

  // Check if database is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Supabase not configured - cannot load calculation");
    notFound();
  }

  try {
    const supabase = createServiceRoleClient();

    // Query the firb_calculations table using the share_url_slug
    const { data: calculation, error } = await supabase
      .from("firb_calculations")
      .select("*")
      .eq("share_url_slug", slug)
      .is("deleted_at", null)
      .single();

    if (error || !calculation) {
      console.error("Error loading calculation:", error);
      notFound();
    }

    // Type the calculation result
    const typedCalculation = calculation as FIRBCalculation;

    // Parse the stored data
    const eligibility = typedCalculation.eligibility_result as EligibilityResult;
    const costs = typedCalculation.cost_breakdown as CostBreakdown;

    // Build formData from stored calculation
    const formData: FIRBCalculatorFormData = {
      purchaseType: "purchasing", // Default since old calculations might not have this
      purchaseDate: undefined, // Not stored in database, only needed for existing properties
      citizenshipStatus: typedCalculation.citizenship_status,
      visaType: typedCalculation.visa_type || undefined,
      isOrdinarilyResident: typedCalculation.is_ordinarily_resident ?? undefined,
      propertyType: typedCalculation.property_type,
      propertyValue: Number(typedCalculation.property_value),
      state: typedCalculation.property_state,
      propertyAddress: typedCalculation.property_address || undefined,
      isFirstHome: typedCalculation.is_first_home,
      depositPercent: typedCalculation.deposit_percent
        ? Number(typedCalculation.deposit_percent)
        : 20,
      entityType: typedCalculation.entity_type,
      propertyClassification: typedCalculation.property_classification || undefined,
      bedrooms: typedCalculation.bedrooms ?? undefined,
      expeditedFIRB: false, // Default value since it's not stored in database
    };

    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 leading-tight">
            Investment Analysis
          </h1>
          {formData.propertyAddress && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {formData.propertyAddress}
            </p>
          )}
        </div>

        <PublicResultsWrapper
          eligibility={eligibility}
          costs={costs}
          propertyValue={formData.propertyValue}
          propertyType={formData.propertyType}
          state={formData.state}
          depositPercent={formData.depositPercent || 20}
          formData={formData}
          locale={locale}
        />
      </div>
    );
  } catch (error) {
    console.error("Error in ResultsPage:", error);
    notFound();
  }
}
