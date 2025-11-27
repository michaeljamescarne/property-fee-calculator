/**
 * Empty State Component
 * Shown when user has no saved calculations
 */

"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, ArrowRight } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  locale: string;
}

export default function EmptyState({ locale }: EmptyStateProps) {
  const t = useTranslations("Dashboard.emptyState");

  return (
    <Card className="border-2 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <Calculator className="h-10 w-10 text-muted-foreground" />
        </div>

        <h3 className="text-2xl font-bold mb-3">{t("title")}</h3>

        <p className="text-muted-foreground max-w-md mb-8">{t("description")}</p>

        <Link href={`/${locale}/firb-calculator`}>
          <Button size="lg">
            <Calculator className="mr-2 h-5 w-5" />
            {t("cta")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
