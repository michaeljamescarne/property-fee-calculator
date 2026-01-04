/**
 * Value History Form Component
 * Form for creating a property value history entry
 */

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { propertyValueHistoryCreateSchema } from "@/lib/validations/properties";

interface ValueHistoryFormProps {
  propertyId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ValueHistoryForm({
  propertyId,
  onSuccess,
  onCancel,
}: ValueHistoryFormProps) {
  const t = useTranslations("Properties.detail.values.form");
  const tTypes = useTranslations("Properties.detail.values");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    valuation_date: new Date().toISOString().split("T")[0],
    value: "",
    valuation_type: "user_estimate" as "market" | "bank" | "agent" | "user_estimate",
    valuation_source: "",
    notes: "",
    updateCurrentValue: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare data for validation
      const submitData: Record<string, unknown> = {
        property_id: propertyId,
        valuation_date: formData.valuation_date,
        value: parseFloat(formData.value),
        valuation_type: formData.valuation_type,
        updateCurrentValue: formData.updateCurrentValue,
      };

      // Add optional fields
      if (formData.valuation_source) {
        submitData.valuation_source = formData.valuation_source;
      }
      if (formData.notes) {
        submitData.notes = formData.notes;
      }

      // Validate
      const validation = propertyValueHistoryCreateSchema.safeParse(submitData);

      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          fieldErrors[path] = issue.message;
        });
        setErrors(fieldErrors);
        setIsSubmitting(false);
        return;
      }

      // Submit
      const response = await fetch(`/api/properties/${propertyId}/values`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save value history");
      }

      onSuccess();
    } catch (err) {
      setErrors({
        _form: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors._form && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {errors._form}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Valuation Date */}
        <div className="space-y-2">
          <Label htmlFor="valuation_date">
            {t("valuationDate")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="valuation_date"
            type="date"
            value={formData.valuation_date}
            onChange={(e) => setFormData({ ...formData, valuation_date: e.target.value })}
            aria-invalid={!!errors.valuation_date}
          />
          {errors.valuation_date && (
            <p className="text-sm text-destructive">{errors.valuation_date}</p>
          )}
        </div>

        {/* Value */}
        <div className="space-y-2">
          <Label htmlFor="value">
            {t("value")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="value"
            type="number"
            min="0"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            placeholder="0"
            aria-invalid={!!errors.value}
          />
          {errors.value && <p className="text-sm text-destructive">{errors.value}</p>}
        </div>

        {/* Valuation Type */}
        <div className="space-y-2">
          <Label htmlFor="valuation_type">
            {t("valuationType")} <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.valuation_type}
            onValueChange={(value: "market" | "bank" | "agent" | "user_estimate") =>
              setFormData({ ...formData, valuation_type: value })
            }
          >
            <SelectTrigger id="valuation_type" aria-invalid={!!errors.valuation_type}>
              <SelectValue placeholder={t("valuationTypePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market">{tTypes("types.market")}</SelectItem>
              <SelectItem value="bank">{tTypes("types.bank")}</SelectItem>
              <SelectItem value="agent">{tTypes("types.agent")}</SelectItem>
              <SelectItem value="user_estimate">{tTypes("types.user_estimate")}</SelectItem>
            </SelectContent>
          </Select>
          {errors.valuation_type && (
            <p className="text-sm text-destructive">{errors.valuation_type}</p>
          )}
        </div>

        {/* Valuation Source */}
        <div className="space-y-2">
          <Label htmlFor="valuation_source">{t("valuationSource")}</Label>
          <Input
            id="valuation_source"
            value={formData.valuation_source}
            onChange={(e) => setFormData({ ...formData, valuation_source: e.target.value })}
            placeholder={t("valuationSourcePlaceholder")}
            aria-invalid={!!errors.valuation_source}
          />
          {errors.valuation_source && (
            <p className="text-sm text-destructive">{errors.valuation_source}</p>
          )}
        </div>
      </div>

      {/* Update Current Value */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="updateCurrentValue"
            checked={formData.updateCurrentValue}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, updateCurrentValue: !!checked })
            }
          />
          <Label htmlFor="updateCurrentValue" className="cursor-pointer">
            {t("updateCurrentValue")}
          </Label>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">{t("notes")}</Label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder={t("notesPlaceholder")}
          rows={3}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          aria-invalid={!!errors.notes}
        />
        {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("create")}
        </Button>
      </div>
    </form>
  );
}

