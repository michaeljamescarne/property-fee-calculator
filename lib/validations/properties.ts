/**
 * Property Validation Schemas
 * Zod schemas for property-related form validation
 */

import { z } from "zod";

// Reuse state and property type enums (matching firb.ts patterns)
const australianStateSchema = z.enum(["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"]);
const propertyTypeSchema = z.enum(["newDwelling", "established", "vacantLand", "commercial"]);

// Property Status
export const propertyStatusSchema = z.enum(["active", "sold", "archived"]);

// Loan Type
export const loanTypeSchema = z.enum(["principalAndInterest", "interestOnly"]);

// Property Classification
export const propertyClassificationSchema = z.enum(["unit", "house"]).nullable();

// Transaction Category
export const transactionCategorySchema = z.enum([
  "purchase_cost",
  "improvement",
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
  "loan_repayment",
  "rental_income",
  "other_income",
  "sale_cost",
  "other_expense",
]);

// Transaction Type
export const transactionTypeSchema = z.enum(["income", "expense", "capital"]);

// Recurring Frequency
export const recurringFrequencySchema = z.enum(["monthly", "quarterly", "annually"]).nullable();

// Valuation Type
export const valuationTypeSchema = z.enum(["market", "bank", "agent", "user_estimate"]);

// Property Create/Update Schema
export const propertySchema = z.object({
  property_name: z.string().max(255).nullable().optional(),
  property_address: z.string().min(1, "Property address is required").max(500),
  property_state: australianStateSchema,
  property_type: propertyTypeSchema,
  property_classification: propertyClassificationSchema,
  bedrooms: z.number().int().min(0).max(5).nullable().optional(),
  purchase_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  purchase_price: z.number().positive("Purchase price must be greater than 0"),
  purchase_costs: z.number().min(0).default(0),
  deposit_amount: z.number().min(0).nullable().optional(),
  loan_amount: z.number().min(0).nullable().optional(),
  current_value: z.number().positive().nullable().optional(),
  current_loan_balance: z.number().min(0).nullable().optional(),
  interest_rate: z.number().min(0).max(100).nullable().optional(),
  loan_term_years: z.number().int().min(1).max(50).nullable().optional(),
  loan_type: loanTypeSchema.nullable().optional(),
  is_rental: z.boolean().default(false),
  weekly_rent: z.number().min(0).nullable().optional(),
  property_management_fee_percent: z.number().min(0).max(100).nullable().optional(),
  status: propertyStatusSchema.default("active"),
  sold_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  sale_price: z.number().positive().nullable().optional(),
  sale_costs: z.number().min(0).nullable().optional(),
  source_calculation_id: z.string().uuid().nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
});

export const propertyCreateSchema = propertySchema;
export const propertyUpdateSchema = propertySchema.partial().extend({
  id: z.string().uuid(),
});

// Property Transaction Schema
export const propertyTransactionSchema = z.object({
  property_id: z.string().uuid(),
  transaction_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  category: transactionCategorySchema,
  type: transactionTypeSchema,
  description: z.string().min(1, "Description is required").max(500),
  amount: z.number().positive("Amount must be greater than 0"),
  is_tax_deductible: z.boolean().default(false),
  is_capital_improvement: z.boolean().default(false),
  is_recurring: z.boolean().default(false),
  recurring_frequency: recurringFrequencySchema.optional(),
  recurring_end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  receipt_url: z.string().url().nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export const propertyTransactionCreateSchema = propertyTransactionSchema;
export const propertyTransactionUpdateSchema = propertyTransactionSchema
  .partial()
  .extend({
    id: z.string().uuid(),
    property_id: z.string().uuid(),
  })
  .omit({ property_id: true }); // property_id shouldn't be updated

// Property Value History Schema
export const propertyValueHistorySchema = z.object({
  property_id: z.string().uuid(),
  valuation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  value: z.number().positive("Value must be greater than 0"),
  valuation_type: valuationTypeSchema,
  valuation_source: z.string().max(255).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export const propertyValueHistoryCreateSchema = propertyValueHistorySchema;

// Type exports for TypeScript
export type PropertyFormData = z.infer<typeof propertySchema>;
export type PropertyCreateInput = z.infer<typeof propertyCreateSchema>;
export type PropertyUpdateInput = z.infer<typeof propertyUpdateSchema>;
export type PropertyTransactionFormData = z.infer<typeof propertyTransactionSchema>;
export type PropertyTransactionCreateInput = z.infer<typeof propertyTransactionCreateSchema>;
export type PropertyTransactionUpdateInput = z.infer<typeof propertyTransactionUpdateSchema>;
export type PropertyValueHistoryFormData = z.infer<typeof propertyValueHistorySchema>;
export type PropertyValueHistoryCreateInput = z.infer<typeof propertyValueHistoryCreateSchema>;
