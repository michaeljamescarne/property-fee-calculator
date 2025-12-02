/**
 * FIRB Calculator Validation Schemas
 * Zod schemas for form validation
 */

import { z } from "zod";

// Citizenship Step Schema
export const citizenshipSchema = z
  .object({
    citizenshipStatus: z.enum(["australian", "permanent", "temporary", "foreign"], {
      message: "Please select your citizenship status",
    }),
    visaType: z.string().optional(),
    isOrdinarilyResident: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // If temporary, visa type is required
      if (data.citizenshipStatus === "temporary" && !data.visaType) {
        return false;
      }
      return true;
    },
    {
      message: "Visa type is required for temporary residents",
      path: ["visaType"],
    }
  );

// Property Details Step Schema
export const propertyDetailsSchema = z.object({
  propertyType: z.enum(["newDwelling", "established", "vacantLand", "commercial"], {
    message: "Please select a property type",
  }),
  propertyValue: z
    .number({
      message: "Property value must be a number",
    })
    .min(10000, "Property value must be at least $10,000")
    .max(100000000, "Property value cannot exceed $100,000,000"),
  state: z.enum(["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"], {
    message: "Please select a state or territory",
  }),
  propertyAddress: z.string().optional(),
  isFirstHome: z.boolean().default(false),
  depositPercent: z
    .number()
    .min(0, "Deposit percentage cannot be negative")
    .max(100, "Deposit percentage cannot exceed 100%")
    .default(20),
  entityType: z
    .enum(["individual", "company", "trust"], {
      message: "Please select an entity type",
    })
    .default("individual"),
});

// Full Form Schema (combines both steps)
export const firbCalculatorSchema = z
  .object({
    // Purchase type
    purchaseType: z.enum(["purchasing", "existing"], {
      message: "Please select a purchase type",
    }),
    purchaseDate: z.string().optional(), // ISO date string

    // Citizenship fields - required for both purchasing and existing
    citizenshipStatus: z.enum(["australian", "permanent", "temporary", "foreign"], {
      message: "Please select your citizenship status",
    }),
    visaType: z.string().optional(),
    isOrdinarilyResident: z.boolean().optional(),

    // Property fields
    propertyType: z.enum(["newDwelling", "established", "vacantLand", "commercial"]),
    propertyValue: z.number().min(10000).max(100000000),
    state: z.enum(["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"]),
    propertyAddress: z.string().optional(),
    isFirstHome: z.boolean().default(false),
    depositPercent: z.number().min(0).max(100).default(20),
    entityType: z.enum(["individual", "company", "trust"]).default("individual"),

    // Additional options
    expeditedFIRB: z.boolean().optional().default(false),
  })
  .refine(
    (data) => {
      // If existing property, purchase date is required
      if (data.purchaseType === "existing" && !data.purchaseDate) {
        return false;
      }
      return true;
    },
    {
      message: "Purchase date is required for existing properties",
      path: ["purchaseDate"],
    }
  )
  .refine(
    (data) => {
      // Temporary residents need visa type
      if (data.citizenshipStatus === "temporary" && !data.visaType) {
        return false;
      }
      return true;
    },
    {
      message: "Visa type is required for temporary residents",
      path: ["visaType"],
    }
  );

// Email Results Schema
export const emailResultsSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  consentToEmail: z.boolean().refine((val) => val === true, {
    message: "You must consent to receive the results via email",
  }),
});

// Type exports
export type CitizenshipFormData = z.infer<typeof citizenshipSchema>;
export type PropertyDetailsFormData = z.infer<typeof propertyDetailsSchema>;
export type FIRBCalculatorFormData = z.infer<typeof firbCalculatorSchema>;
export type EmailResultsFormData = z.infer<typeof emailResultsSchema>;
