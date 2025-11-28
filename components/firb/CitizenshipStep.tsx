/**
 * Citizenship Step Component
 * Collects citizenship status and related information
 */

"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CitizenshipStatus, TEMPORARY_VISA_TYPES } from "@/lib/firb/constants";
import { Info, AlertCircle } from "lucide-react";

interface CitizenshipStepProps {
  citizenshipStatus: CitizenshipStatus | "";
  visaType?: string;
  isOrdinarilyResident?: boolean;
  onCitizenshipStatusChange: (status: CitizenshipStatus) => void;
  onVisaTypeChange: (visaType: string) => void;
  onOrdinarilyResidentChange: (isResident: boolean) => void;
  errors?: Record<string, boolean>;
}

export default function CitizenshipStep({
  citizenshipStatus,
  visaType,
  isOrdinarilyResident,
  onCitizenshipStatusChange,
  onVisaTypeChange,
  onOrdinarilyResidentChange,
  errors = {},
}: CitizenshipStepProps) {
  const t = useTranslations("FIRBCalculator.citizenship");

  return (
    <Card className="border border-gray-200 shadow-sm rounded bg-white">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-semibold text-gray-900">{t("title")}</CardTitle>
        <CardDescription className="text-base mt-2 text-gray-600">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Citizenship Status */}
        <div id="citizenship-status-section" className="space-y-4">
          <Label className="text-base font-semibold text-gray-900">
            {t("statusLabel")} <span className="text-red-600">*</span>
          </Label>
          {errors.citizenshipStatus && (
            <div className="flex items-center gap-2 p-3 rounded bg-red-50 border border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">Please select your citizenship status</p>
            </div>
          )}
          <RadioGroup
            value={citizenshipStatus}
            onValueChange={(value) => onCitizenshipStatusChange(value as CitizenshipStatus)}
            className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${errors.citizenshipStatus ? "ring-2 ring-red-500 rounded-lg p-2" : ""}`}
          >
            {/* Australian Citizen */}
            <Label htmlFor="australian" className="cursor-pointer block">
              <div
                className={`flex items-center space-x-3 rounded border-2 p-4 hover:border-blue-600 hover:bg-blue-50 hover:shadow-sm transition-all h-20 ${
                  errors.citizenshipStatus ? "border-red-300 bg-red-50/50" : "border-gray-200"
                }`}
              >
                <RadioGroupItem value="australian" id="australian" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">{t("australian.title")}</div>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                    {t("australian.description")}
                  </p>
                </div>
              </div>
            </Label>

            {/* Permanent Resident */}
            <Label htmlFor="permanent" className="cursor-pointer block">
              <div
                className={`flex items-center space-x-3 rounded border-2 p-4 hover:border-blue-600 hover:bg-blue-50 hover:shadow-sm transition-all h-20 ${
                  errors.citizenshipStatus ? "border-red-300 bg-red-50/50" : "border-gray-200"
                }`}
              >
                <RadioGroupItem value="permanent" id="permanent" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">{t("permanent.title")}</div>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                    {t("permanent.description")}
                  </p>
                </div>
              </div>
            </Label>

            {/* Temporary Resident */}
            <Label htmlFor="temporary" className="cursor-pointer block">
              <div
                className={`flex items-center space-x-3 rounded border-2 p-4 hover:border-blue-600 hover:bg-blue-50 hover:shadow-sm transition-all h-20 ${
                  errors.citizenshipStatus ? "border-red-300 bg-red-50/50" : "border-gray-200"
                }`}
              >
                <RadioGroupItem value="temporary" id="temporary" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">{t("temporary.title")}</div>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                    {t("temporary.description")}
                  </p>
                </div>
              </div>
            </Label>

            {/* Foreign Person */}
            <Label htmlFor="foreign" className="cursor-pointer block">
              <div
                className={`flex items-center space-x-3 rounded border-2 p-4 hover:border-blue-600 hover:bg-blue-50 hover:shadow-sm transition-all h-20 ${
                  errors.citizenshipStatus ? "border-red-300 bg-red-50/50" : "border-gray-200"
                }`}
              >
                <RadioGroupItem value="foreign" id="foreign" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">{t("foreign.title")}</div>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                    {t("foreign.description")}
                  </p>
                </div>
              </div>
            </Label>
          </RadioGroup>
        </div>

        {/* Conditional: Visa Type for Temporary Residents */}
        {citizenshipStatus === "temporary" && (
          <div
            className={`space-y-3 p-4 rounded border ${
              errors.visaType ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex items-start gap-2">
              <Info
                className={`h-5 w-5 mt-0.5 ${errors.visaType ? "text-red-600" : "text-blue-600"}`}
              />
              <div className="flex-1">
                <Label htmlFor="visa-type" className="text-base font-medium text-gray-900">
                  {t("visaType.label")} <span className="text-red-600">*</span>
                </Label>
                {errors.visaType && (
                  <p className="text-sm text-red-600 mt-1">Please select your visa type</p>
                )}
                <p className="text-sm text-gray-600 mt-1 mb-3">{t("visaType.description")}</p>
                <Select value={visaType} onValueChange={onVisaTypeChange}>
                  <SelectTrigger
                    id="visa-type"
                    className={`bg-background ${
                      errors.visaType ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder={t("visaType.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPORARY_VISA_TYPES.map((visa) => (
                      <SelectItem key={visa.value} value={visa.value}>
                        {visa.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Conditional: Ordinarily Resident for Australian Citizens */}
        {citizenshipStatus === "australian" && (
          <div className="space-y-3 p-4 bg-amber-50 rounded border border-amber-200">
            <div className="flex items-start gap-3">
              <Checkbox
                id="ordinarily-resident"
                checked={isOrdinarilyResident ?? true}
                onCheckedChange={(checked) => onOrdinarilyResidentChange(checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label
                  htmlFor="ordinarily-resident"
                  className="font-medium cursor-pointer text-gray-900"
                >
                  {t("ordinarilyResident.label")}
                </Label>
                <p className="text-sm text-gray-600 mt-1">{t("ordinarilyResident.description")}</p>
              </div>
            </div>
          </div>
        )}

        {/* Information Box */}
        {citizenshipStatus && (
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            <div className="flex gap-2">
              <Info className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-600">
                {citizenshipStatus === "australian" && t("info.australian")}
                {citizenshipStatus === "permanent" && t("info.permanent")}
                {citizenshipStatus === "temporary" && t("info.temporary")}
                {citizenshipStatus === "foreign" && t("info.foreign")}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
