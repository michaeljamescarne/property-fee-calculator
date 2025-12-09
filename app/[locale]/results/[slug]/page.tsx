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

    // Parse the stored data
    const eligibility = calculation.eligibility_result as EligibilityResult;
    const costs = calculation.cost_breakdown as CostBreakdown;

    // Build formData from stored calculation
    const formData: FIRBCalculatorFormData = {
      purchaseType: "purchasing", // Default since old calculations might not have this
      citizenshipStatus: calculation.citizenship_status,
      visaType: calculation.visa_type || undefined,
      isOrdinarilyResident: calculation.is_ordinarily_resident ?? undefined,
      propertyType: calculation.property_type,
      propertyValue: Number(calculation.property_value),
      state: calculation.property_state,
      propertyAddress: calculation.property_address || undefined,
      isFirstHome: calculation.is_first_home,
      depositPercent: calculation.deposit_percent ? Number(calculation.deposit_percent) : 20,
      entityType: calculation.entity_type,
      propertyClassification: calculation.property_classification || undefined,
      bedrooms: calculation.bedrooms ?? undefined,
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
