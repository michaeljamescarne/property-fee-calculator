/**
 * Transaction Form Component
 * Form for creating or editing a property transaction
 */

"use client";

import { useState, useEffect } from "react";
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
import type { PropertyTransaction, TransactionCategory } from "@/types/database";
import { propertyTransactionCreateSchema, propertyTransactionUpdateSchema } from "@/lib/validations/properties";

interface TransactionFormProps {
  propertyId: string;
  transaction?: PropertyTransaction | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TransactionForm({
  propertyId,
  transaction,
  onSuccess,
  onCancel,
}: TransactionFormProps) {
  const t = useTranslations("Properties.detail.transactions.form");
  const tTypes = useTranslations("Properties.detail.transactions");
  const tCategories = useTranslations("Properties.detail.transactions");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    transaction_date: transaction?.transaction_date.split("T")[0] || new Date().toISOString().split("T")[0],
    category: (transaction?.category || "other_expense") as TransactionCategory,
    type: transaction?.type || ("expense" as "income" | "expense" | "capital"),
    description: transaction?.description || "",
    amount: transaction?.amount.toString() || "",
    is_tax_deductible: transaction?.is_tax_deductible || false,
    is_capital_improvement: transaction?.is_capital_improvement || false,
    is_recurring: transaction?.is_recurring || false,
    recurring_frequency: transaction?.recurring_frequency || null,
    recurring_end_date: transaction?.recurring_end_date?.split("T")[0] || "",
    receipt_url: transaction?.receipt_url || "",
    notes: transaction?.notes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare data for validation
      const submitData: Record<string, unknown> = {
        property_id: propertyId,
        transaction_date: formData.transaction_date,
        category: formData.category,
        type: formData.type,
        description: formData.description,
        amount: parseFloat(formData.amount),
        is_tax_deductible: formData.is_tax_deductible,
        is_capital_improvement: formData.is_capital_improvement,
        is_recurring: formData.is_recurring,
      };

      // Add optional fields
      if (formData.recurring_frequency) {
        submitData.recurring_frequency = formData.recurring_frequency;
      }
      if (formData.recurring_end_date) {
        submitData.recurring_end_date = formData.recurring_end_date;
      }
      if (formData.receipt_url) {
        submitData.receipt_url = formData.receipt_url;
      }
      if (formData.notes) {
        submitData.notes = formData.notes;
      }

      // Validate
      const schema = transaction ? propertyTransactionUpdateSchema : propertyTransactionCreateSchema;
      const validation = schema.safeParse(transaction ? { ...submitData, id: transaction.id } : submitData);

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
      const url = transaction
        ? `/api/properties/${propertyId}/transactions/${transaction.id}`
        : `/api/properties/${propertyId}/transactions`;
      const method = transaction ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save transaction");
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

  // Category options grouped by type
  const incomeCategories: TransactionCategory[] = ["rental_income", "other_income"];
  const expenseCategories: TransactionCategory[] = [
    "maintenance",
    "council_rates",
    "water_rates",
    "gas",
    "electricity",
    "insurance",
    "strata_fees",
    "property_management",
    "letting_fees",
    "land_tax",
    "vacancy_fee",
    "depreciation_report",
    "accounting_fees",
    "legal_fees",
    "loan_interest",
    "other_expense",
  ];
  const capitalCategories: TransactionCategory[] = [
    "purchase_cost",
    "improvement",
    "loan_repayment",
    "sale_cost",
  ];

  const getAvailableCategories = () => {
    if (formData.type === "income") return incomeCategories;
    if (formData.type === "expense") return expenseCategories;
    return capitalCategories;
  };

  // Helper function to get translated type label
  const getTypeLabel = (type: "income" | "expense" | "capital") => {
    return tTypes(`types.${type}`);
  };


  // Reset category if it's not valid for the selected type
  useEffect(() => {
    const availableCategories = getAvailableCategories();
    if (!availableCategories.includes(formData.category)) {
      setFormData((prev) => ({
        ...prev,
        category: availableCategories[0],
      }));
    }
  }, [formData.type]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors._form && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {errors._form}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Transaction Date */}
        <div className="space-y-2">
          <Label htmlFor="transaction_date">
            {t("transactionDate")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="transaction_date"
            type="date"
            value={formData.transaction_date}
            onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
            aria-invalid={!!errors.transaction_date}
          />
          {errors.transaction_date && (
            <p className="text-sm text-destructive">{errors.transaction_date}</p>
          )}
        </div>

        {/* Transaction Type */}
        <div className="space-y-2">
          <Label htmlFor="type">
            {t("type")} <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value: "income" | "expense" | "capital") =>
              setFormData({ ...formData, type: value })
            }
          >
            <SelectTrigger id="type" aria-invalid={!!errors.type}>
              <SelectValue placeholder={t("type")}>
                {getTypeLabel(formData.type)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">{tTypes("types.income")}</SelectItem>
              <SelectItem value="expense">{tTypes("types.expense")}</SelectItem>
              <SelectItem value="capital">{tTypes("types.capital")}</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">
            {t("category")} <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value: TransactionCategory) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger id="category" aria-invalid={!!errors.category}>
              <SelectValue placeholder={t("category")} />
            </SelectTrigger>
            <SelectContent>
              {getAvailableCategories().map((category) => (
                <SelectItem key={category} value={category}>
                  {tCategories(`categories.${category}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount">
            {t("amount")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            aria-invalid={!!errors.amount}
          />
          {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          {t("description")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder={t("descriptionPlaceholder")}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      {/* Tax and Capital Improvement Flags */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_tax_deductible"
            checked={formData.is_tax_deductible}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, is_tax_deductible: !!checked })
            }
          />
          <Label htmlFor="is_tax_deductible" className="cursor-pointer">
            {t("taxDeductible")}
          </Label>
        </div>

        {formData.type === "expense" && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_capital_improvement"
              checked={formData.is_capital_improvement}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_capital_improvement: !!checked })
              }
            />
            <Label htmlFor="is_capital_improvement" className="cursor-pointer">
              {t("capitalImprovement")}
            </Label>
          </div>
        )}
      </div>

      {/* Recurring Transaction */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_recurring"
            checked={formData.is_recurring}
            onCheckedChange={(checked) => setFormData({ ...formData, is_recurring: !!checked })}
          />
          <Label htmlFor="is_recurring" className="cursor-pointer">
            {t("recurring")}
          </Label>
        </div>

        {formData.is_recurring && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
            <div className="space-y-2">
              <Label htmlFor="recurring_frequency">{t("recurringFrequency")}</Label>
              <Select
                value={formData.recurring_frequency || ""}
                onValueChange={(value: "monthly" | "quarterly" | "annually" | "") =>
                  setFormData({ ...formData, recurring_frequency: value || null })
                }
              >
                <SelectTrigger id="recurring_frequency">
                  <SelectValue placeholder={t("recurringFrequencyPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">{t("recurringFrequencyOptions.monthly")}</SelectItem>
                  <SelectItem value="quarterly">
                    {t("recurringFrequencyOptions.quarterly")}
                  </SelectItem>
                  <SelectItem value="annually">
                    {t("recurringFrequencyOptions.annually")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurring_end_date">{t("recurringEndDate")}</Label>
              <Input
                id="recurring_end_date"
                type="date"
                value={formData.recurring_end_date}
                onChange={(e) => setFormData({ ...formData, recurring_end_date: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Receipt URL */}
      <div className="space-y-2">
        <Label htmlFor="receipt_url">{t("receiptUrl")}</Label>
        <Input
          id="receipt_url"
          type="url"
          value={formData.receipt_url}
          onChange={(e) => setFormData({ ...formData, receipt_url: e.target.value })}
          placeholder={t("receiptUrlPlaceholder")}
          aria-invalid={!!errors.receipt_url}
        />
        {errors.receipt_url && (
          <p className="text-sm text-destructive">{errors.receipt_url}</p>
        )}
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
          {transaction ? t("update") : t("create")}
        </Button>
      </div>
    </form>
  );
}

