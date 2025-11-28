/**
 * Property Details Step Component
 * Collects property information for FIRB calculations
 */

"use client";

import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { PropertyType, AustralianState, EntityType } from "@/lib/firb/constants";
import { Home, Building, MapPin, DollarSign, Percent, AlertCircle } from "lucide-react";
import AddressAutocomplete from "./AddressAutocomplete";

interface PropertyDetailsStepProps {
  propertyType: PropertyType | "";
  propertyValue: number;
  state: AustralianState | "";
  propertyAddress?: string;
  isFirstHome: boolean;
  depositPercent: number;
  entityType: EntityType;
  onPropertyTypeChange: (type: PropertyType) => void;
  onPropertyValueChange: (value: number) => void;
  onStateChange: (state: AustralianState) => void;
  onPropertyAddressChange: (address: string) => void;
  onFirstHomeChange: (isFirstHome: boolean) => void;
  onDepositPercentChange: (percent: number) => void;
  onEntityTypeChange: (type: EntityType) => void;
  errors?: Record<string, boolean>;
}

export default function PropertyDetailsStep({
  propertyType,
  propertyValue,
  state,
  propertyAddress,
  isFirstHome,
  depositPercent,
  entityType,
  onPropertyTypeChange,
  onPropertyValueChange,
  onStateChange,
  onPropertyAddressChange,
  onFirstHomeChange,
  onDepositPercentChange,
  onEntityTypeChange,
  errors = {},
}: PropertyDetailsStepProps) {
  const t = useTranslations("FIRBCalculator.property");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="border border-gray-200 shadow-sm rounded bg-white">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-semibold text-gray-900">{t("title")}</CardTitle>
        <CardDescription className="text-base mt-2 text-gray-600">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Type */}
        <div id="property-type-section" className="space-y-4">
          <Label className="text-base font-semibold flex items-center gap-2 text-gray-900">
            <Home className="h-5 w-5 text-gray-600" />
            {t("typeLabel")} <span className="text-red-600">*</span>
          </Label>
          {errors.propertyType && (
            <div className="flex items-center gap-2 p-3 rounded bg-red-50 border border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">Please select a property type</p>
            </div>
          )}
          <RadioGroup
            value={propertyType}
            onValueChange={(value) => onPropertyTypeChange(value as PropertyType)}
            className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${errors.propertyType ? "ring-2 ring-red-500 rounded-lg p-2" : ""}`}
          >
            <Label htmlFor="newDwelling" className="cursor-pointer block">
              <div
                className={`flex items-center space-x-3 rounded border-2 p-4 hover:border-blue-600 hover:bg-blue-50 hover:shadow-sm transition-all h-20 ${
                  errors.propertyType ? "border-red-300 bg-red-50/50" : "border-gray-200"
                }`}
              >
                <RadioGroupItem value="newDwelling" id="newDwelling" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">
                    {t("types.newDwelling.title")}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                    {t("types.newDwelling.description")}
                  </p>
                </div>
              </div>
            </Label>

            <Label htmlFor="established" className="cursor-pointer block">
              <div
                className={`flex items-center space-x-3 rounded border-2 p-4 hover:border-blue-600 hover:bg-blue-50 hover:shadow-sm transition-all h-20 ${
                  errors.propertyType ? "border-red-300 bg-red-50/50" : "border-gray-200"
                }`}
              >
                <RadioGroupItem value="established" id="established" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">
                    {t("types.established.title")}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                    {t("types.established.description")}
                  </p>
                </div>
              </div>
            </Label>

            <Label htmlFor="vacantLand" className="cursor-pointer block">
              <div
                className={`flex items-center space-x-3 rounded border-2 p-4 hover:border-blue-600 hover:bg-blue-50 hover:shadow-sm transition-all h-20 ${
                  errors.propertyType ? "border-red-300 bg-red-50/50" : "border-gray-200"
                }`}
              >
                <RadioGroupItem value="vacantLand" id="vacantLand" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">
                    {t("types.vacantLand.title")}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                    {t("types.vacantLand.description")}
                  </p>
                </div>
              </div>
            </Label>

            <Label htmlFor="commercial" className="cursor-pointer block">
              <div
                className={`flex items-center space-x-3 rounded border-2 p-4 hover:border-blue-600 hover:bg-blue-50 hover:shadow-sm transition-all h-20 ${
                  errors.propertyType ? "border-red-300 bg-red-50/50" : "border-gray-200"
                }`}
              >
                <RadioGroupItem value="commercial" id="commercial" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">
                    {t("types.commercial.title")}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                    {t("types.commercial.description")}
                  </p>
                </div>
              </div>
            </Label>
          </RadioGroup>
        </div>

        {/* Property Value */}
        <div className="space-y-3">
          <Label
            htmlFor="property-value"
            className="text-base font-semibold flex items-center gap-2 text-gray-900"
          >
            <DollarSign className="h-5 w-5 text-gray-600" />
            {t("valueLabel")} <span className="text-red-600">*</span>
          </Label>
          {errors.propertyValue && (
            <div className="flex items-center gap-2 p-3 rounded bg-red-50 border border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">Please enter a valid property value</p>
            </div>
          )}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="property-value"
              type="number"
              value={propertyValue || ""}
              onChange={(e) => onPropertyValueChange(Number(e.target.value))}
              placeholder="1000000"
              className={`pl-8 rounded ${errors.propertyValue ? "border-red-500 focus:ring-red-500" : ""}`}
            />
          </div>
          {propertyValue > 0 && (
            <p className="text-sm text-gray-600">{formatCurrency(propertyValue)}</p>
          )}
        </div>

        {/* Property Address (Optional) */}
        <div className="space-y-3">
          <Label
            htmlFor="property-address"
            className="text-base font-semibold flex items-center gap-2 text-gray-900"
          >
            <Building className="h-5 w-5 text-gray-600" />
            {t("addressLabel")}
            <span className="text-sm font-normal text-gray-500">({t("optional")})</span>
          </Label>
          <AddressAutocomplete
            value={propertyAddress || ""}
            onChange={onPropertyAddressChange}
            onStateChange={onStateChange}
            placeholder={t("addressPlaceholder")}
          />
          <p className="text-xs text-gray-500">
            Start typing to see address suggestions. Selecting an address will auto-fill the state.
          </p>
        </div>

        {/* State/Territory */}
        <div className="space-y-3">
          <Label
            htmlFor="state"
            className="text-base font-semibold flex items-center gap-2 text-gray-900"
          >
            <MapPin className="h-5 w-5 text-gray-600" />
            {t("stateLabel")} <span className="text-red-600">*</span>
          </Label>
          {errors.state && (
            <div className="flex items-center gap-2 p-3 rounded bg-red-50 border border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">Please select a state</p>
            </div>
          )}
          <Select value={state} onValueChange={(value) => onStateChange(value as AustralianState)}>
            <SelectTrigger
              id="state"
              className={`w-full ${errors.state ? "border-red-500 focus:ring-red-500" : ""}`}
            >
              <SelectValue placeholder={t("statePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NSW">New South Wales (NSW)</SelectItem>
              <SelectItem value="VIC">Victoria (VIC)</SelectItem>
              <SelectItem value="QLD">Queensland (QLD)</SelectItem>
              <SelectItem value="SA">South Australia (SA)</SelectItem>
              <SelectItem value="WA">Western Australia (WA)</SelectItem>
              <SelectItem value="TAS">Tasmania (TAS)</SelectItem>
              <SelectItem value="ACT">Australian Capital Territory (ACT)</SelectItem>
              <SelectItem value="NT">Northern Territory (NT)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* First Home Buyer */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded border border-gray-200">
          <Checkbox
            id="first-home"
            checked={isFirstHome}
            onCheckedChange={(checked) => onFirstHomeChange(checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1">
            <Label htmlFor="first-home" className="font-medium cursor-pointer text-gray-900">
              {t("firstHome.label")}
            </Label>
            <p className="text-sm text-gray-600 mt-1">{t("firstHome.description")}</p>
          </div>
        </div>

        {/* Deposit Percentage */}
        <div className="space-y-3">
          <Label
            htmlFor="deposit-percent"
            className="text-base font-semibold flex items-center gap-2 text-gray-900"
          >
            <Percent className="h-5 w-5 text-gray-600" />
            {t("depositLabel")}
          </Label>
          <Select
            value={depositPercent.toString()}
            onValueChange={(value) => onDepositPercentChange(Number(value))}
          >
            <SelectTrigger id="deposit-percent" className="w-full">
              <SelectValue placeholder="Select deposit percentage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5%</SelectItem>
              <SelectItem value="10">10%</SelectItem>
              <SelectItem value="15">15%</SelectItem>
              <SelectItem value="20">20%</SelectItem>
              <SelectItem value="25">25%</SelectItem>
              <SelectItem value="30">30%</SelectItem>
              <SelectItem value="35">35%</SelectItem>
              <SelectItem value="40">40%</SelectItem>
              <SelectItem value="50">50%</SelectItem>
              <SelectItem value="60">60%</SelectItem>
              <SelectItem value="70">70%</SelectItem>
              <SelectItem value="80">80%</SelectItem>
              <SelectItem value="90">90%</SelectItem>
              <SelectItem value="100">100%</SelectItem>
            </SelectContent>
          </Select>
          {propertyValue > 0 && depositPercent > 0 && (
            <p className="text-sm text-gray-600">
              {t("depositAmount")}: {formatCurrency((propertyValue * depositPercent) / 100)}
            </p>
          )}
        </div>

        {/* Entity Type */}
        <div className="space-y-3">
          <Label htmlFor="entity-type" className="text-base font-semibold text-gray-900">
            {t("entityLabel")}
          </Label>
          <Select
            value={entityType}
            onValueChange={(value) => onEntityTypeChange(value as EntityType)}
          >
            <SelectTrigger id="entity-type" className="w-full rounded">
              <SelectValue placeholder={t("entityPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">{t("entities.individual")}</SelectItem>
              <SelectItem value="company">{t("entities.company")}</SelectItem>
              <SelectItem value="trust">{t("entities.trust")}</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-600">{t("entityDescription")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
