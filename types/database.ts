/**
 * Database Types for FIRB Calculations
 * Generated from Supabase schema
 */

// Enum types matching database
export type CitizenshipStatus = 'australian' | 'permanent' | 'temporary' | 'foreign';
export type PropertyType = 'newDwelling' | 'established' | 'vacantLand' | 'commercial';
export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'ACT' | 'NT';
export type EntityType = 'individual' | 'company' | 'trust';

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
export interface CostBreakdown {
  upfrontCosts: {
    firbApplicationFee: number;
    firbExpeditedFee?: number;
    standardStampDuty: number;
    stampDutySurcharge: number;
    totalStampDuty: number;
    legalFees: number;
    inspectionFees: number;
    otherFees: number;
    totalUpfront: number;
  };
  annualCosts: {
    landTaxSurcharge: number;
    vacancyFee: number;
    councilRates: number;
    strataFees: number;
    totalAnnual: number;
  };
  firstYearTotal: number;
  fiveYearTotal: number;
  tenYearTotal: number;
  breakdown: FeeBreakdownItem[];
}

export interface FeeBreakdownItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  frequency: 'one-time' | 'annual' | 'monthly';
  optional: boolean;
  notes?: string;
}

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

