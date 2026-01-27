/**
 * Create Property Form Component
 * Form to create a new property
 */

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { PropertyType, AustralianState } from "@/lib/firb/constants";
import { propertyCreateSchema } from "@/lib/validations/properties";
import AddressAutocomplete from "@/components/firb/AddressAutocomplete";

interface CreatePropertyFormProps {
  locale: string;
}

export default function CreatePropertyForm({ locale }: CreatePropertyFormProps) {
  const t = useTranslations("Properties.createProperty");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state - initialize with empty/default values
  const [formData, setFormData] = useState({
    property_name: "",
    property_address: "",
    property_state: "" as AustralianState | "",
    property_type: "" as PropertyType | "",
    property_classification: null as "unit" | "house" | null,
    bedrooms: null as number | null,
    purchase_date: "",
    purchase_price: "",
    purchase_costs: "0",
    deposit_amount: "",
    loan_amount: "",
    current_value: "",
    current_loan_balance: "",
    interest_rate: "",
    loan_term_years: "",
    loan_type: null as "principalAndInterest" | "interestOnly" | null,
    is_rental: false,
    weekly_rent: "",
    property_management_fee_percent: "",
    status: "active" as "active" | "sold" | "archived",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare data for validation
      const submitData: Record<string, unknown> = {
        property_address: formData.property_address,
        property_state: formData.property_state,
        property_type: formData.property_type,
        purchase_date: formData.purchase_date,
        purchase_price: parseFloat(formData.purchase_price),
        purchase_costs: Math.max(0, parseFloat(formData.purchase_costs) || 0),
        status: formData.status,
      };

      // Add optional fields if they have values
      if (formData.property_name) submitData.property_name = formData.property_name;
      if (formData.property_classification !== null)
        submitData.property_classification = formData.property_classification;
      if (formData.bedrooms !== null) submitData.bedrooms = parseInt(formData.bedrooms.toString());
      if (formData.deposit_amount) submitData.deposit_amount = parseFloat(formData.deposit_amount);
      if (formData.loan_amount) submitData.loan_amount = parseFloat(formData.loan_amount);
      if (formData.current_value) submitData.current_value = parseFloat(formData.current_value);
      if (formData.current_loan_balance)
        submitData.current_loan_balance = parseFloat(formData.current_loan_balance);
      if (formData.interest_rate) submitData.interest_rate = parseFloat(formData.interest_rate);
      if (formData.loan_term_years) submitData.loan_term_years = parseInt(formData.loan_term_years);
      if (formData.loan_type) submitData.loan_type = formData.loan_type;
      submitData.is_rental = formData.is_rental;
      if (formData.is_rental || formData.weekly_rent) {
        submitData.weekly_rent = formData.weekly_rent ? parseFloat(formData.weekly_rent) : null;
      }
      if (formData.property_management_fee_percent)
        submitData.property_management_fee_percent = parseFloat(
          formData.property_management_fee_percent
        );
      if (formData.notes) submitData.notes = formData.notes;

      // Validate
      const validation = propertyCreateSchema.safeParse(submitData);
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.issues.forEach((issue) => {
          const path = issue.path[0] as string;
          fieldErrors[path] = issue.message;
        });
        setErrors(fieldErrors);
        setIsSubmitting(false);
        return;
      }

      // Submit
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.details) {
          const fieldErrors: Record<string, string> = {};
          result.details.forEach((issue: { path?: string[]; message?: string }) => {
            const path = issue.path?.[0] as string | undefined;
            if (path && issue.message) {
              fieldErrors[path] = issue.message;
            }
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ submit: result.message || "Failed to create property" });
        }
        setIsSubmitting(false);
        return;
      }

      // Success - redirect to property detail page
      if (result.success && result.property) {
        router.push(`/${locale}/properties/${result.property.id}`);
        router.refresh();
      } else {
        throw new Error("Property creation failed");
      }
    } catch (error) {
      console.error("Error creating property:", error);
      setErrors({ submit: "An unexpected error occurred. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("form.basicInfo.title")}</CardTitle>
          <CardDescription>{t("form.basicInfo.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Property Name */}
          <div className="space-y-2">
            <Label htmlFor="property_name">{t("form.basicInfo.name")}</Label>
            <Input
              id="property_name"
              value={formData.property_name}
              onChange={(e) => setFormData({ ...formData, property_name: e.target.value })}
              placeholder={t("form.basicInfo.namePlaceholder")}
            />
          </div>

          {/* Property Address */}
          <div className="space-y-2">
            <Label htmlFor="property_address">
              {t("form.basicInfo.address")} <span className="text-red-600">*</span>
            </Label>
            <AddressAutocomplete
              value={formData.property_address}
              onChange={(address) => setFormData({ ...formData, property_address: address })}
              onStateChange={(state) => setFormData({ ...formData, property_state: state })}
              placeholder={t("form.basicInfo.addressPlaceholder") || "Start typing an address..."}
            />
            {errors.property_address && (
              <p className="text-sm text-red-600">{errors.property_address}</p>
            )}
          </div>

          {/* Property State */}
          <div className="space-y-2">
            <Label htmlFor="property_state">
              {t("form.basicInfo.state")} <span className="text-red-600">*</span>
            </Label>
            <Select
              value={formData.property_state || undefined}
              onValueChange={(value) =>
                setFormData({ ...formData, property_state: value as AustralianState })
              }
              required
            >
              <SelectTrigger id="property_state">
                <SelectValue placeholder={t("form.basicInfo.statePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NSW">New South Wales</SelectItem>
                <SelectItem value="VIC">Victoria</SelectItem>
                <SelectItem value="QLD">Queensland</SelectItem>
                <SelectItem value="SA">South Australia</SelectItem>
                <SelectItem value="WA">Western Australia</SelectItem>
                <SelectItem value="TAS">Tasmania</SelectItem>
                <SelectItem value="ACT">Australian Capital Territory</SelectItem>
                <SelectItem value="NT">Northern Territory</SelectItem>
              </SelectContent>
            </Select>
            {errors.property_state && (
              <p className="text-sm text-red-600">{errors.property_state}</p>
            )}
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <Label>
              {t("form.basicInfo.type")} <span className="text-red-600">*</span>
            </Label>
            <RadioGroup
              value={formData.property_type}
              onValueChange={(value) =>
                setFormData({ ...formData, property_type: value as PropertyType })
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="newDwelling" id="newDwelling" />
                  <Label htmlFor="newDwelling" className="cursor-pointer flex-1">
                    New Dwelling
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="established" id="established" />
                  <Label htmlFor="established" className="cursor-pointer flex-1">
                    Established Dwelling
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="vacantLand" id="vacantLand" />
                  <Label htmlFor="vacantLand" className="cursor-pointer flex-1">
                    Vacant Land
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="commercial" id="commercial" />
                  <Label htmlFor="commercial" className="cursor-pointer flex-1">
                    Commercial Property
                  </Label>
                </div>
              </div>
            </RadioGroup>
            {errors.property_type && <p className="text-sm text-red-600">{errors.property_type}</p>}
          </div>

          {/* Property Classification (for established properties) */}
          {formData.property_type === "established" && (
            <div className="space-y-2">
              <Label>
                {t("form.basicInfo.classification")} <span className="text-red-600">*</span>
              </Label>
              <RadioGroup
                value={formData.property_classification || ""}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    property_classification: value as "unit" | "house" | null,
                  })
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="unit" id="unit" />
                    <Label htmlFor="unit" className="cursor-pointer flex-1">
                      Unit
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="house" id="house" />
                    <Label htmlFor="house" className="cursor-pointer flex-1">
                      House
                    </Label>
                  </div>
                </div>
              </RadioGroup>
              {errors.property_classification && (
                <p className="text-sm text-red-600">{errors.property_classification}</p>
              )}
            </div>
          )}

          {/* Bedrooms */}
          <div className="space-y-2">
            <Label htmlFor="bedrooms">{t("form.basicInfo.bedrooms")}</Label>
            <Select
              value={formData.bedrooms?.toString() || ""}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  bedrooms: value === "" ? null : parseInt(value),
                })
              }
            >
              <SelectTrigger id="bedrooms">
                <SelectValue placeholder={t("form.basicInfo.bedroomsPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Studio</SelectItem>
                <SelectItem value="1">1 Bedroom</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3">3 Bedrooms</SelectItem>
                <SelectItem value="4">4 Bedrooms</SelectItem>
                <SelectItem value="5">5+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("form.purchaseInfo.title")}</CardTitle>
          <CardDescription>{t("form.purchaseInfo.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Purchase Date */}
          <div className="space-y-2">
            <Label htmlFor="purchase_date">
              {t("form.purchaseInfo.date")} <span className="text-red-600">*</span>
            </Label>
            <Input
              id="purchase_date"
              type="date"
              value={formData.purchase_date}
              onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
              required
            />
            {errors.purchase_date && <p className="text-sm text-red-600">{errors.purchase_date}</p>}
          </div>

          {/* Purchase Price */}
          <div className="space-y-2">
            <Label htmlFor="purchase_price">
              {t("form.purchaseInfo.price")} <span className="text-red-600">*</span>
            </Label>
            <Input
              id="purchase_price"
              type="number"
              min="0"
              value={formData.purchase_price}
              onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
              placeholder="850000"
              required
            />
            {errors.purchase_price && (
              <p className="text-sm text-red-600">{errors.purchase_price}</p>
            )}
          </div>

          {/* Purchase Costs */}
          <div className="space-y-2">
            <Label htmlFor="purchase_costs">{t("form.purchaseInfo.costs")}</Label>
            <Input
              id="purchase_costs"
              type="number"
              min="0"
              value={formData.purchase_costs}
              onChange={(e) => {
                const value = e.target.value;
                if (value && parseFloat(value) < 0) {
                  setFormData({ ...formData, purchase_costs: "0" });
                } else {
                  setFormData({ ...formData, purchase_costs: value });
                }
              }}
              placeholder="45000"
            />
          </div>

          {/* Deposit Amount */}
          <div className="space-y-2">
            <Label htmlFor="deposit_amount">{t("form.purchaseInfo.deposit")}</Label>
            <Input
              id="deposit_amount"
              type="number"
              min="0"
              value={formData.deposit_amount}
              onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
              placeholder="170000"
            />
          </div>

          {/* Loan Amount */}
          <div className="space-y-2">
            <Label htmlFor="loan_amount">{t("form.purchaseInfo.loan")}</Label>
            <Input
              id="loan_amount"
              type="number"
              min="0"
              value={formData.loan_amount}
              onChange={(e) => setFormData({ ...formData, loan_amount: e.target.value })}
              placeholder="680000"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("form.currentInfo.title")}</CardTitle>
          <CardDescription>{t("form.currentInfo.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Value */}
          <div className="space-y-2">
            <Label htmlFor="current_value">{t("form.currentInfo.currentValue")}</Label>
            <Input
              id="current_value"
              type="number"
              min="0"
              value={formData.current_value}
              onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
              placeholder="900000"
            />
          </div>

          {/* Current Loan Balance */}
          <div className="space-y-2">
            <Label htmlFor="current_loan_balance">{t("form.currentInfo.currentLoanBalance")}</Label>
            <Input
              id="current_loan_balance"
              type="number"
              min="0"
              value={formData.current_loan_balance}
              onChange={(e) => setFormData({ ...formData, current_loan_balance: e.target.value })}
              placeholder="650000"
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <Label htmlFor="interest_rate">{t("form.currentInfo.interestRate")}</Label>
            <Input
              id="interest_rate"
              type="number"
              min="0"
              max="100"
              value={formData.interest_rate}
              onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
              placeholder="5.5"
            />
          </div>

          {/* Loan Term */}
          <div className="space-y-2">
            <Label htmlFor="loan_term_years">{t("form.currentInfo.loanTerm")}</Label>
            <Input
              id="loan_term_years"
              type="number"
              min="1"
              max="50"
              value={formData.loan_term_years}
              onChange={(e) => setFormData({ ...formData, loan_term_years: e.target.value })}
              placeholder="30"
            />
          </div>

          {/* Loan Type */}
          <div className="space-y-2">
            <Label htmlFor="loan_type">{t("form.currentInfo.loanType")}</Label>
            <Select
              value={formData.loan_type || ""}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  loan_type: value as "principalAndInterest" | "interestOnly" | null,
                })
              }
            >
              <SelectTrigger id="loan_type">
                <SelectValue placeholder={t("form.currentInfo.loanTypePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="principalAndInterest">Principal & Interest</SelectItem>
                <SelectItem value="interestOnly">Interest Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("form.rentalInfo.title")}</CardTitle>
          <CardDescription>{t("form.rentalInfo.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Is Rental */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_rental"
              checked={formData.is_rental}
              onChange={(e) => setFormData({ ...formData, is_rental: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="is_rental" className="cursor-pointer">
              {t("form.rentalInfo.isRental")}
            </Label>
          </div>

          {formData.is_rental && (
            <>
              {/* Weekly Rent */}
              <div className="space-y-2">
                <Label htmlFor="weekly_rent">{t("form.rentalInfo.weeklyRent")}</Label>
                <Input
                  id="weekly_rent"
                  type="number"
                  min="0"
                  value={formData.weekly_rent}
                  onChange={(e) => setFormData({ ...formData, weekly_rent: e.target.value })}
                  placeholder="650"
                />
              </div>

              {/* Property Management Fee */}
              <div className="space-y-2">
                <Label htmlFor="property_management_fee_percent">
                  {t("form.rentalInfo.managementFee")}
                </Label>
                <Input
                  id="property_management_fee_percent"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.property_management_fee_percent}
                  onChange={(e) =>
                    setFormData({ ...formData, property_management_fee_percent: e.target.value })
                  }
                  placeholder="7.5"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("form.otherInfo.title")}</CardTitle>
          <CardDescription>{t("form.otherInfo.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">{t("form.otherInfo.status")}</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value as "active" | "sold" | "archived" })
              }
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t("form.otherInfo.notes")}</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t("form.otherInfo.notesPlaceholder")}
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {errors.submit && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex justify-between">
        <Link href={`/${locale}/properties`}>
          <Button type="button" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("form.submit")}
        </Button>
      </div>
    </form>
  );
}
