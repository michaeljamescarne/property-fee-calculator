/**
 * Properties Empty State Component
 * Shown when user has no properties
 */

"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";

interface PropertiesEmptyStateProps {
  locale: string;
}

export default function PropertiesEmptyState({ locale }: PropertiesEmptyStateProps) {
  const t = useTranslations("Properties");

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">{t("emptyState.title")}</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        {t("emptyState.description")}
      </p>
      <Link href={`/${locale}/properties/new`}>
        <Button size="lg">
          <Plus className="mr-2 h-5 w-5" />
          {t("addProperty")}
        </Button>
      </Link>
    </div>
  );
}
