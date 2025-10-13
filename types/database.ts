/**
 * Database Types for FIRB Calculations
 * Generated from Supabase schema
 */

// Enum types matching database
export type CitizenshipStatus = 'australian' | 'permanent' | 'temporary' | 'foreign';
export type PropertyType = 'newDwelling' | 'established' | 'vacantLand' | 'commercial';
export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'ACT' | 'NT';
export type EntityType = 'individual' | 'company' | 'trust';
export type SubscriptionStatus = 'free' | 'trial' | 'paid';

// Eligibility Result structure (stored as JSON)
export interface EligibilityResult {
  isEligible: boolean;
  requiresFIRB: boolean;
  firbApprovalType: 'required' | 'exempt' | 'notAllowed';
  restrictions: string[];
  recommendations: string[];
  approvalTimeline?: {
    standard: string;
    expedited: string;
  };
}

// Cost Breakdown structure (stored as JSON)
// This matches the actual output from lib/firb/calculations.ts
export interface CostBreakdown {
  upfrontCosts: {
    propertyPrice: number;
    firbFee: number;
    stampDuty: number;
    foreignSurcharge: number;
    legalFees: number;
    inspectionFees: number;
    loanCosts: number;
    total: number;
  };
  ongoingCosts: {
    annualLandTax: number;
    councilRates: number;
    insurance: number;
    maintenance: number;
    vacancyFee: number;
    total: number;
  };
  totalInvestmentCost: number;
  breakdown: {
    category: string;
    items: { name: string; amount: number; description?: string }[];
  }[];
}

// FeeBreakdownItem interface removed - now using the breakdown structure from calculations.ts

// Database table structure
export interface FIRBCalculation {
  id: string;
  created_at: string;
  updated_at: string;
  share_url_slug: string;
  
  // Citizenship data
  citizenship_status: CitizenshipStatus;
  visa_type: string | null;
  is_ordinarily_resident: boolean | null;
  
  // Property data
  property_type: PropertyType;
  property_value: number;
  property_state: AustralianState;
  property_address: string | null;
  is_first_home: boolean;
  deposit_percent: number | null;
  entity_type: EntityType;
  
  // Calculated results
  eligibility_result: EligibilityResult;
  cost_breakdown: CostBreakdown;
  
  // Metadata
  user_email: string | null;
  locale: string;
  deleted_at: string | null;
}

// Insert type (omits auto-generated fields)
export type FIRBCalculationInsert = Omit<
  FIRBCalculation,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
> & {
  share_url_slug?: string; // Auto-generated if not provided
};

// Update type (all fields optional except id)
export type FIRBCalculationUpdate = Partial<Omit<FIRBCalculation, 'id' | 'created_at'>> & {
  id: string;
};

// Public view type (excludes sensitive data)
export type FIRBCalculationPublic = Omit<FIRBCalculation, 'user_email' | 'deleted_at'>;

// Query filters
export interface FIRBCalculationFilters {
  citizenship_status?: CitizenshipStatus;
  property_type?: PropertyType;
  property_state?: AustralianState;
  entity_type?: EntityType;
  minValue?: number;
  maxValue?: number;
  locale?: string;
}

// Statistics type
export interface FIRBCalculationStats {
  totalCalculations: number;
  averagePropertyValue: number;
  mostCommonState: AustralianState;
  mostCommonPropertyType: PropertyType;
  byState: Record<AustralianState, number>;
  byPropertyType: Record<PropertyType, number>;
}

// Auth-related types

// User Profile
export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  last_login_at: string;
  subscription_status: SubscriptionStatus;
  subscription_tier: string | null;
  calculations_count: number;
  updated_at: string;
}

// Magic Code
export interface MagicCode {
  id: string;
  email: string;
  code: string; // Hashed
  expires_at: string;
  attempts: number;
  used: boolean;
  created_at: string;
}

// Saved Calculation
export interface SavedCalculation {
  id: string;
  user_id: string;
  calculation_data: CalculationData;
  property_address: string | null;
  property_value: number | null;
  eligibility_status: string | null;
  calculation_name: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

// Full calculation data structure
export interface CalculationData {
  // Form inputs
  citizenshipStatus: CitizenshipStatus;
  visaType?: string;
  isOrdinarilyResident?: boolean;
  propertyType: PropertyType;
  propertyValue: number;
  propertyState: AustralianState;
  propertyAddress?: string;
  isFirstHome: boolean;
  depositPercent?: number;
  entityType: EntityType;
  
  // Investment analytics inputs (optional)
  weeklyRent?: number;
  managementFee?: number;
  loanAmount?: number;
  interestRate?: number;
  loanTerm?: number;
  annualGrowthRate?: number;
  marginalTaxRate?: number;
  capitalGainsDiscount?: number;
  
  // Results
  eligibility: EligibilityResult;
  costs: CostBreakdown;
  analytics?: any; // Investment analytics results if calculated
}

// Insert types
export type SavedCalculationInsert = Omit<
  SavedCalculation,
  'id' | 'created_at' | 'updated_at'
>;

// Update types
export type SavedCalculationUpdate = Partial<
  Omit<SavedCalculation, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>;

// Supabase Database type
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'id' | 'created_at'>>;
      };
      magic_codes: {
        Row: MagicCode;
        Insert: Omit<MagicCode, 'id' | 'created_at'>;
        Update: Partial<Omit<MagicCode, 'id' | 'created_at'>>;
      };
      saved_calculations: {
        Row: SavedCalculation;
        Insert: SavedCalculationInsert;
        Update: SavedCalculationUpdate;
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      subscription_status: SubscriptionStatus;
    };
  };
}


