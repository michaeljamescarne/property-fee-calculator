/**
 * Compare Page
 * Page for comparing up to 3 calculations side-by-side
 */

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getTranslations } from "next-intl/server";
import ComparisonView from "@/components/portal/ComparisonView";

interface ComparePageProps {
  params: Promise<{ locale: string }>;
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { locale } = await params;
  const t = await getTranslations("Compare");

  // Check if user is authenticated
  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/calculator`);
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t("title")}</h1>
          <p className="text-lg text-muted-foreground">{t("description")}</p>
        </div>

        <ComparisonView locale={locale} />
      </div>
    </div>
  );
}

