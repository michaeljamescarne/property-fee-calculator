/**
 * Properties List Page
 * Display all user properties with filters and summary stats
 */

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getTranslations } from "next-intl/server";
import PropertiesClient from "@/components/properties/PropertiesClient";

interface PropertiesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PropertiesPage({ params }: PropertiesPageProps) {
  const { locale } = await params;
  const t = await getTranslations("Properties");

  // Check if user is authenticated
  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/calculator`);
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t("title")}</h1>
            <p className="text-lg text-muted-foreground">{t("description")}</p>
          </div>
        </div>

        {/* Properties List (client component) */}
        <PropertiesClient locale={locale} />
      </div>
    </div>
  );
}


