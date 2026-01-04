/**
 * Property Comparison Page
 * Displays side-by-side comparison of selected properties
 */

import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import PropertyComparison from "@/components/properties/PropertyComparison";
import { getSession } from "@/lib/auth/session";

interface ComparePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ids?: string }>;
}

export default async function ComparePage({ params, searchParams }: ComparePageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const ids = resolvedSearchParams.ids;

  // Check if user is authenticated (same method as properties list page)
  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/calculator`);
  }

  if (!ids) {
    redirect(`/${locale}/properties`);
  }

  const propertyIds = ids.split(",").filter((id) => id.trim().length > 0);

  if (propertyIds.length < 2) {
    redirect(`/${locale}/properties`);
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <PropertyComparison propertyIds={propertyIds} locale={locale} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: ComparePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Properties.comparison" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

