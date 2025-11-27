/**
 * Review Step Component
 * Shows summary of all entered data before calculation
 */

"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { FIRBCalculatorFormData } from "@/lib/validations/firb";
import type { InvestmentInputs } from "@/types/investment";

interface ReviewStepProps {
  formData: Partial<FIRBCalculatorFormData>;
  investmentInputs?: Partial<InvestmentInputs>;
  onEdit: (step: "citizenship" | "property" | "financial") => void;
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
  const t = useTranslations("FIRBCalculator.review");
  const tCitizenship = useTranslations("FIRBCalculator.citizenship");
  const tProperty = useTranslations("FIRBCalculator.property");
  const tFinancial = useTranslations("FIRBCalculator.financialDetails");

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
            onClick={() => onEdit("citizenship")}
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
            onClick={() => onEdit("property")}
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
      {investmentInputs && investmentInputs.estimatedWeeklyRent && (
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
              onClick={() => onEdit("financial")}
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

      {/* Calculate Button */}
      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={onCalculate}
          disabled={isCalculating}
          className="min-w-[200px] rounded"
        >
          {isCalculating ? t("calculating") : t("calculateButton")}
        </Button>
      </div>
    </div>
  );
}
