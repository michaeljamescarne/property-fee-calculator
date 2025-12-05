/**
 * Calculation Selector Component
 * Searchable/filterable list for selecting up to 3 calculations
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, X } from "lucide-react";
import type { SavedCalculation } from "@/types/database";
import { getCalculationSummary } from "@/lib/calculations/storage";

interface CalculationSelectorProps {
  calculations: SavedCalculation[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  locale: string;
}

export default function CalculationSelector({
  calculations,
  selectedIds,
  onSelectionChange,
  locale,
}: CalculationSelectorProps) {
  const t = useTranslations("Compare");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCalculations, setFilteredCalculations] = useState<SavedCalculation[]>(calculations);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCalculations(calculations);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = calculations.filter((calc) => {
      const summary = getCalculationSummary(calc);
      const name = summary.name.toLowerCase();
      const address = summary.address.toLowerCase();
      return name.includes(searchLower) || address.includes(searchLower);
    });

    setFilteredCalculations(filtered);
  }, [searchTerm, calculations]);

  const handleToggle = (id: string): void => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      if (selectedIds.length >= 3) {
        return; // Max 3 selections
      }
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleClear = (): void => {
    onSelectionChange([]);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("selectCalculations")}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{t("selectUpTo3")}</p>
          </div>
          {selectedIds.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClear}>
              <X className="mr-2 h-4 w-4" />
              {t("clear")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search calculations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Selection count */}
        {selectedIds.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {t("selected")}: {selectedIds.length} / 3
          </div>
        )}

        {/* Calculations list */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredCalculations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "No calculations found matching your search" : "No calculations available"}
            </div>
          ) : (
            filteredCalculations.map((calculation) => {
              const summary = getCalculationSummary(calculation);
              const isSelected = selectedIds.includes(calculation.id);
              const isDisabled = !isSelected && selectedIds.length >= 3;

              return (
                <div
                  key={calculation.id}
                  className={`
                    flex items-start gap-3 p-3 rounded-md border transition-colors
                    ${isSelected ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"}
                    ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}
                  `}
                  onClick={() => !isDisabled && handleToggle(calculation.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    disabled={isDisabled}
                    onCheckedChange={() => !isDisabled && handleToggle(calculation.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{summary.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{summary.address}</div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{formatCurrency(summary.value)}</span>
                      <span>{formatDate(summary.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

