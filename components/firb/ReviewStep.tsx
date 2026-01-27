/**
 * Review Step Component
 * Shows summary of all entered data before calculation
 */

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Edit,
  User,
  Home,
  MapPin,
  Building,
  DollarSign,
  Percent,
  Calculator,
  TrendingUp,
  Info,
  FileSearch,
} from "lucide-react";
import { FIRBCalculatorFormData } from "@/lib/validations/firb";
import type { InvestmentInputs } from "@/types/investment";

interface ReviewStepProps {
  formData: Partial<FIRBCalculatorFormData>;
  investmentInputs?: Partial<InvestmentInputs>;
  onEdit: (step: "purchaseType" | "citizenship" | "property" | "financial") => void;
  onCalculate: () => void;
  isCalculating?: boolean;
}

export default function ReviewStep({
  formData,
  investmentInputs,
  onEdit,
  onCalculate,
  isCalculating,
}: ReviewStepProps) {
  console.log('ReviewStep rendered', { onEdit: typeof onEdit, onEditToString: onEdit?.toString?.()?.substring(0, 100) });
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false);
  const t = useTranslations("FIRBCalculator.review");
  const tPurchaseType = useTranslations("FIRBCalculator.purchaseType");
  const tCitizenship = useTranslations("FIRBCalculator.citizenship");
  const tProperty = useTranslations("FIRBCalculator.property");
  const tFinancial = useTranslations("FIRBCalculator.financialDetails");
  const tResults = useTranslations("FIRBCalculator.results");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getPropertyTypeName = (type: string) => {
    return tProperty(`types.${type}.title`);
  };

  const getStateName = (state: string) => {
    const stateNames: Record<string, string> = {
      NSW: "New South Wales",
      VIC: "Victoria",
      QLD: "Queensland",
      SA: "South Australia",
      WA: "Western Australia",
      TAS: "Tasmania",
      ACT: "Australian Capital Territory",
      NT: "Northern Territory",
    };
    return stateNames[state] || state;
  };

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200 shadow-sm rounded bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900">{t("title")}</CardTitle>
          <CardDescription className="text-gray-600">{t("description")}</CardDescription>
        </CardHeader>
      </Card>

      {/* Type Information */}
      <Card className="border border-gray-200 shadow-sm rounded bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            {formData.purchaseType === "existing" ? (
              <FileSearch className="h-5 w-5 text-gray-600" />
            ) : (
              <Home className="h-5 w-5 text-gray-600" />
            )}
            <CardTitle className="text-lg font-semibold text-gray-900">
              {t("typeTitle") || "Type"}
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Remove edit param from URL FIRST to prevent useEffect interference
              const url = new URL(window.location.href);
              if (url.searchParams.has("edit")) {
                url.searchParams.delete("edit");
                window.history.replaceState({}, "", url.toString());
              }
              onEdit("purchaseType");
            }}
            className="gap-2 rounded"
          >
            <Edit className="h-4 w-4" />
            {t("edit")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">{tPurchaseType("typeLabel")}</p>
            <p className="font-medium mt-1 text-gray-900">
              {formData.purchaseType === "purchasing"
                ? tPurchaseType("purchasing.title")
                : formData.purchaseType === "existing"
                  ? tPurchaseType("existing.title")
                  : "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Citizenship Information */}
      <Card className="border border-gray-200 shadow-sm rounded bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-lg font-semibold text-gray-900">
              {t("citizenshipTitle")}
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('ReviewStep: Edit citizenship clicked');
              // Remove edit param from URL FIRST to prevent useEffect interference
              const url = new URL(window.location.href);
              if (url.searchParams.has("edit")) {
                url.searchParams.delete("edit");
                window.history.replaceState({}, "", url.toString());
                console.log('ReviewStep: Removed edit param from URL');
              }
              // Then call onEdit
              console.log('ReviewStep: About to call onEdit("citizenship")');
              try {
                onEdit("citizenship");
                console.log('ReviewStep: onEdit("citizenship") called successfully');
              } catch (error) {
                console.error('ReviewStep: Error calling onEdit', error);
              }
            }}
            className="gap-2 rounded"
          >
            <Edit className="h-4 w-4" />
            {t("edit")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">{tCitizenship("statusLabel")}</p>
              <p className="font-medium mt-1 text-gray-900">
                {formData.citizenshipStatus && tCitizenship(`${formData.citizenshipStatus}.title`)}
              </p>
            </div>

            {formData.citizenshipStatus === "temporary" && formData.visaType && (
              <div>
                <p className="text-sm text-gray-600">{tCitizenship("visaType.label")}</p>
                <p className="font-medium mt-1 text-gray-900">{formData.visaType}</p>
              </div>
            )}

            {formData.citizenshipStatus === "australian" && (
              <div>
                <p className="text-sm text-gray-600">{tCitizenship("ordinarilyResident.label")}</p>
                <Badge variant={formData.isOrdinarilyResident !== false ? "default" : "secondary"}>
                  {formData.isOrdinarilyResident !== false ? t("yes") : t("no")}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Property Information */}
      <Card className="border border-gray-200 shadow-sm rounded bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-lg font-semibold text-gray-900">
              {t("propertyTitle")}
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Remove edit param from URL FIRST to prevent useEffect interference
              const url = new URL(window.location.href);
              if (url.searchParams.has("edit")) {
                url.searchParams.delete("edit");
                window.history.replaceState({}, "", url.toString());
              }
              onEdit("property");
            }}
            className="gap-2 rounded"
          >
            <Edit className="h-4 w-4" />
            {t("edit")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">{tProperty("typeLabel")}</p>
              <p className="font-medium mt-1 text-gray-900">
                {formData.propertyType && getPropertyTypeName(formData.propertyType)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">{tProperty("valueLabel")}</p>
              <p className="font-medium mt-1 flex items-center gap-1 text-gray-900">
                <DollarSign className="h-4 w-4 text-gray-600" />
                {formData.propertyValue && formatCurrency(formData.propertyValue)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">{tProperty("stateLabel")}</p>
              <p className="font-medium mt-1 flex items-center gap-1 text-gray-900">
                <MapPin className="h-4 w-4 text-gray-600" />
                {formData.state && getStateName(formData.state)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">{tProperty("entityLabel")}</p>
              <p className="font-medium mt-1 flex items-center gap-1 text-gray-900">
                <Building className="h-4 w-4 text-gray-600" />
                {formData.entityType && tProperty(`entities.${formData.entityType}`)}
              </p>
            </div>

            {formData.propertyAddress && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">{tProperty("addressLabel")}</p>
                <p className="font-medium mt-1 text-gray-900">{formData.propertyAddress}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600">{tProperty("firstHome.label")}</p>
              <Badge variant={formData.isFirstHome ? "default" : "secondary"}>
                {formData.isFirstHome ? t("yes") : t("no")}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-gray-600">{tProperty("depositLabel")}</p>
              <p className="font-medium mt-1 flex items-center gap-1 text-gray-900">
                <Percent className="h-4 w-4 text-gray-600" />
                {formData.depositPercent}%
                {formData.propertyValue && (
                  <span className="text-sm text-gray-600 ml-2">
                    (
                    {formatCurrency(
                      (formData.propertyValue * (formData.depositPercent || 0)) / 100
                    )}
                    )
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Details Information */}
      {investmentInputs &&
        investmentInputs.estimatedWeeklyRent != null &&
        investmentInputs.estimatedWeeklyRent > 0 && (
          <Card className="border border-gray-200 shadow-sm rounded bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {t("financialTitle") || "Financial Details"}
                </CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Remove edit param from URL FIRST to prevent useEffect interference
                  const url = new URL(window.location.href);
                  if (url.searchParams.has("edit")) {
                    url.searchParams.delete("edit");
                    window.history.replaceState({}, "", url.toString());
                  }
                  onEdit("financial");
                }}
                className="gap-2 rounded"
              >
                <Edit className="h-4 w-4" />
                {t("edit")}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    {tFinancial("rental.weeklyRent") || "Weekly Rent"}
                  </p>
                  <p className="font-medium mt-1 flex items-center gap-1 text-gray-900">
                    <DollarSign className="h-4 w-4 text-gray-600" />$
                    {investmentInputs.estimatedWeeklyRent?.toLocaleString("en-AU")}/week
                    <span className="text-sm text-gray-600 ml-2">
                      (${((investmentInputs.estimatedWeeklyRent || 0) * 52).toLocaleString("en-AU")}
                      /year)
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">
                    {tFinancial("growth.rate") || "Capital Growth Rate"}
                  </p>
                  <p className="font-medium mt-1 flex items-center gap-1 text-gray-900">
                    <TrendingUp className="h-4 w-4 text-gray-600" />
                    {investmentInputs.capitalGrowthRate || 6}%
                  </p>
                </div>

                {investmentInputs.loanAmount && investmentInputs.loanAmount > 0 && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">
                        {tFinancial("loan.interestRate") || "Interest Rate"}
                      </p>
                      <p className="font-medium mt-1 text-gray-900">
                        {investmentInputs.interestRate || 6.5}%
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">
                        {tFinancial("loan.term") || "Loan Term"}
                      </p>
                      <p className="font-medium mt-1 text-gray-900">
                        {investmentInputs.loanTerm || 30} years
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <p className="text-sm text-gray-600">
                    {tFinancial("rental.vacancyRate") || "Vacancy Rate"}
                  </p>
                  <p className="font-medium mt-1 text-gray-900">
                    {investmentInputs.vacancyRate || 5}%
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">
                    {tFinancial("managementFee") || "Property Management"}
                  </p>
                  <p className="font-medium mt-1 text-gray-900">
                    {investmentInputs.selfManaged
                      ? tFinancial("selfManaged") || "Self-Managed"
                      : `${investmentInputs.propertyManagementFee || 8}%`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Disclaimer Acknowledgment */}
      <div className="p-6 bg-blue-50 border border-blue-200 rounded">
        <div className="flex items-start gap-3 mb-4">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {tResults("disclaimer.title")}
            </h3>
            <p className="text-sm text-gray-700 mb-4">{tResults("disclaimer.content")}</p>
            <div className="flex items-start gap-3 pt-3 border-t border-blue-200">
              <Checkbox
                id="disclaimer-acknowledge"
                checked={disclaimerAcknowledged}
                onCheckedChange={(checked) => setDisclaimerAcknowledged(checked === true)}
                className="mt-1"
              />
              <Label
                htmlFor="disclaimer-acknowledge"
                className="text-sm font-medium leading-relaxed cursor-pointer text-gray-900"
              >
                I acknowledge and accept that the information provided is general advice only and
                that I should seek independent professional advice before making any investment
                decisions.
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={onCalculate}
          disabled={isCalculating || !disclaimerAcknowledged}
          className="min-w-[200px] rounded"
        >
          {isCalculating ? t("calculating") : t("calculateButton")}
        </Button>
      </div>
      {!disclaimerAcknowledged && (
        <p className="text-sm text-center text-gray-500 mt-2">
          Please acknowledge the disclaimer above to proceed
        </p>
      )}
    </div>
  );
}
