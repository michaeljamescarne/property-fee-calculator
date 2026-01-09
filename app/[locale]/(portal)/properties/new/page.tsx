/**
 * Create Property Page
 * Page for creating a new property
 */

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getTranslations } from "next-intl/server";
import CreatePropertyForm from "@/components/properties/CreatePropertyForm";

interface CreatePropertyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CreatePropertyPage({ params }: CreatePropertyPageProps) {
  const { locale } = await params;
  const t = await getTranslations("Properties");

  // Check if user is authenticated
  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/calculator`);
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">{t("createProperty.title")}</h1>
          <p className="text-lg text-muted-foreground">{t("createProperty.description")}</p>
        </div>

        {/* Form */}
        <CreatePropertyForm locale={locale} />
      </div>
    </div>
  );
}
