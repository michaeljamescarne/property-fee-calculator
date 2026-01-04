/**
 * Edit Property Page
 * Form to edit an existing property
 */

import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getTranslations } from "next-intl/server";
import { getProperty } from "@/lib/properties/storage";
import EditPropertyForm from "@/components/properties/EditPropertyForm";

interface EditPropertyPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { locale, id } = await params;
  const t = await getTranslations("Properties");

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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">{t("editProperty.title")}</h1>
          <p className="text-lg text-muted-foreground">{t("editProperty.description")}</p>
        </div>

        {/* Form */}
        <EditPropertyForm property={property} locale={locale} />
      </div>
    </div>
  );
}
