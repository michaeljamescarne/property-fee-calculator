/**
 * Property Detail Page
 * Display detailed information about a specific property
 */

import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getTranslations } from "next-intl/server";
import { getProperty } from "@/lib/properties/storage";
import PropertyDetailClient from "@/components/properties/PropertyDetailClient";

interface PropertyDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { locale, id } = await params;

  // Check if user is authenticated
  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/calculator`);
  }

  // Fetch property data
  const property = await getProperty(id, session.user.id);

  if (!property) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <PropertyDetailClient property={property} locale={locale} />
      </div>
    </div>
  );
}
