/**
 * Purchase Type Step Component
 * First step asking if user is purchasing or reviewing existing property
 */

"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, FileSearch, AlertCircle } from "lucide-react";

export type PurchaseType = "purchasing" | "existing";

interface PurchaseTypeStepProps {
  purchaseType: PurchaseType | "";
  onPurchaseTypeChange: (type: PurchaseType) => void;
  errors?: Record<string, boolean>;
}

export default function PurchaseTypeStep({
  purchaseType,
  onPurchaseTypeChange,
  errors = {},
}: PurchaseTypeStepProps) {
  const t = useTranslations("FIRBCalculator.purchaseType");

  return (
    <Card className="border border-gray-200 shadow-sm rounded bg-white">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-semibold text-gray-900">{t("title")}</CardTitle>
        <CardDescription className="text-base mt-2 text-gray-600">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Purchase Type Selection */}
        <div id="purchase-type-section" className="space-y-4">
          <Label className="text-base font-semibold text-gray-900">
            {t("typeLabel")} <span className="text-red-600">*</span>
          </Label>
          {errors.purchaseType && (
            <div className="flex items-center gap-2 p-3 rounded bg-red-50 border border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">Please select a purchase type</p>
            </div>
          )}
          <RadioGroup
            value={purchaseType}
            onValueChange={(value) => onPurchaseTypeChange(value as PurchaseType)}
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
              errors.purchaseType ? "ring-2 ring-red-500 rounded-lg p-2" : ""
            }`}
          >
            {/* Purchasing a Property */}
            <Label htmlFor="purchasing" className="cursor-pointer block">
              <div
                className={`flex items-start space-x-3 rounded border-2 p-6 hover:border-blue-600 hover:bg-blue-50 hover:shadow-sm transition-all ${
                  errors.purchaseType ? "border-red-300 bg-red-50/50" : "border-gray-200"
                }`}
              >
                <RadioGroupItem value="purchasing" id="purchasing" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="h-5 w-5 text-blue-600" />
                    <div className="font-semibold text-base text-gray-900">
                      {t("purchasing.title")}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{t("purchasing.description")}</p>
                </div>
              </div>
            </Label>

            {/* Reviewing Existing Investment */}
            <Label htmlFor="existing" className="cursor-pointer block">
              <div
                className={`flex items-start space-x-3 rounded border-2 p-6 hover:border-blue-600 hover:bg-blue-50 hover:shadow-sm transition-all ${
                  errors.purchaseType ? "border-red-300 bg-red-50/50" : "border-gray-200"
                }`}
              >
                <RadioGroupItem value="existing" id="existing" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileSearch className="h-5 w-5 text-blue-600" />
                    <div className="font-semibold text-base text-gray-900">
                      {t("existing.title")}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{t("existing.description")}</p>
                </div>
              </div>
            </Label>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}



