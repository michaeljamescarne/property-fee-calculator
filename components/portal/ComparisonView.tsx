/**
 * Comparison View Component
 * Main component for displaying comparison of selected calculations
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import CalculationSelector from "./CalculationSelector";
import ComparisonTable from "./ComparisonTable";
import type { SavedCalculation } from "@/types/database";

interface ComparisonViewProps {
  locale: string;
}

export default function ComparisonView({ locale }: ComparisonViewProps) {
  const t = useTranslations("Compare");
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCalculations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/calculations/list");
      const data = await response.json();

      if (data.success) {
        setCalculations(data.calculations);
      }
    } catch (error) {
      console.error("Failed to fetch calculations:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalculations();
  }, [fetchCalculations]);

  const selectedCalculations = calculations.filter((calc) => selectedIds.includes(calc.id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-muted-foreground">Loading calculations...</div>
      </div>
    );
  }

  if (calculations.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>No Calculations</AlertTitle>
        <AlertDescription>
          You don't have any saved calculations yet. Create some calculations to compare them.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selection Interface */}
      <CalculationSelector
        calculations={calculations}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        locale={locale}
      />

      {/* Comparison Table */}
      {selectedIds.length === 0 ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Selection Required</AlertTitle>
          <AlertDescription>{t("noCalculations")}</AlertDescription>
        </Alert>
      ) : selectedIds.length === 1 ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>More Selections Needed</AlertTitle>
          <AlertDescription>{t("selectAtLeast2")}</AlertDescription>
        </Alert>
      ) : (
        <ComparisonTable calculations={selectedCalculations} locale={locale} />
      )}
    </div>
  );
}
