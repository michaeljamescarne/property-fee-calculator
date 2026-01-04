# Capital Gains Tax Property Usage Review

## Current Implementation Analysis

### Location
- **File**: `property-fee-calculator/lib/firb/tax-calculator.ts`
- **Function**: `calculateCGT()` (lines 264-357)

### Current Issues

#### 1. **No Main Residence Exemption Consideration**
- **Problem**: Code does NOT check if property is primary residence
- **ATO Rule**: Main residence is **FULLY EXEMPT** from CGT
- **Impact**: Primary residences are incorrectly showing CGT liability

#### 2. **No 6-Year Rule Implementation**
- **Problem**: Code does NOT consider the 6-year rule for rental properties
- **ATO Rule**: If you move out and rent your main residence, you can still claim exemption for up to 6 years
- **Impact**: Properties rented out after being primary residence may incorrectly show CGT

#### 3. **No Partial Exemption Logic**
- **Problem**: Code does NOT handle partial income-producing use
- **ATO Rule**: If property was main residence for part of ownership, partial exemption applies
- **Impact**: Properties with mixed use are not handled correctly

#### 4. **No Property Usage Parameter**
- **Problem**: `calculateCGT()` does NOT accept `propertyUsage` parameter
- **Impact**: Cannot determine if property is primary residence, rental, or vacant

## ATO Rules for Property Usage and CGT

### 1. Primary Residence (Main Residence)

#### Full Exemption
- **Eligibility**: Property must be your main residence
- **Requirements**:
  - You and your family live there
  - Personal belongings are in the home
  - It's your address for mail and electoral roll
  - Services (gas, electricity) are connected
  - Land size ≤ 2 hectares
- **CGT Treatment**: **FULLY EXEMPT** - $0 CGT payable
- **Note**: Foreign residents (as of June 30, 2020) are NOT eligible for main residence exemption

### 2. Rental Property (Income-Producing)

#### Standard Rental Property
- **CGT Treatment**: Full CGT applies (no exemption)
- **CGT Discount**: 50% discount if held >12 months (for Australian residents)
- **Withholding Tax**: Applies to foreign residents selling ≥ $750k

#### 6-Year Rule (Rented After Being Main Residence)
- **Eligibility**: 
  - Property was your main residence before renting
  - You don't designate another property as main residence during rental period
  - Rental period ≤ 6 years
- **CGT Treatment**: **FULLY EXEMPT** during rental period (up to 6 years)
- **Extension**: If you move back in and rent again, the 6-year period can reset

### 3. Vacant Property (Neither Rental Nor Primary Residence)

#### Standard Vacant Property
- **CGT Treatment**: Full CGT applies (no exemption)
- **CGT Discount**: 50% discount if held >12 months (for Australian residents)
- **Note**: Holiday homes, vacant land, and properties not generating income are subject to CGT

### 4. Partial Income-Producing Use

#### Part of Property Used for Income
- **Example**: Renting out a room, running a business from home
- **CGT Treatment**: **PARTIAL EXEMPTION**
- **Calculation**: 
  - Exempt portion = (Time as main residence / Total ownership period) × Capital gain
  - Taxable portion = (Time as income-producing / Total ownership period) × Capital gain

#### Property Used as Main Residence Then Rental
- **CGT Treatment**: **PARTIAL EXEMPTION**
- **Calculation**:
  - Exempt portion = (Time as main residence + eligible rental period) / Total ownership period
  - Taxable portion = (Time as rental beyond 6-year rule) / Total ownership period

### 5. Foreign Residents

#### Main Residence Exemption
- **Rule**: Foreign residents are **NOT eligible** for main residence exemption (as of June 30, 2020)
- **Exception**: Life events (terminal illness, death of spouse/child, divorce)
- **CGT Treatment**: Full CGT applies even if property was main residence

## Required Changes

### 1. Add Property Usage Parameters

```typescript
export function calculateCGT(
  // ... existing parameters
  propertyUsage?: "rental" | "primaryResidence" | "vacant",
  wasMainResidence?: boolean, // Whether property was ever main residence
  yearsAsMainResidence?: number, // Years property was main residence
  yearsRentedAfterMainResidence?: number, // Years rented after being main residence (6-year rule)
  isForeignResidentAtSale?: boolean // Residency status at time of sale
): CGTCalculation
```

### 2. Implement Main Residence Exemption Logic

```typescript
// Main residence exemption
let mainResidenceExemption = 0;
let exemptionExplanation = "";

if (propertyUsage === "primaryResidence" && !isForeignResidentAtSale) {
  // Full exemption for main residence (Australian residents only)
  mainResidenceExemption = capitalGain;
  exemptionExplanation = "Full main residence exemption applies (property is your main residence)";
  cgtAmount = 0; // No CGT payable
} else if (propertyUsage === "primaryResidence" && isForeignResidentAtSale) {
  // Foreign residents not eligible for main residence exemption
  exemptionExplanation = "Main residence exemption not available (foreign resident at time of sale)";
  // CGT applies normally
}
```

### 3. Implement 6-Year Rule Logic

```typescript
// 6-Year Rule: Rented after being main residence
if (
  propertyUsage === "rental" &&
  wasMainResidence &&
  yearsRentedAfterMainResidence !== undefined &&
  yearsRentedAfterMainResidence <= 6 &&
  !isForeignResidentAtSale
) {
  // Full exemption under 6-year rule
  mainResidenceExemption = capitalGain;
  exemptionExplanation = `Full main residence exemption applies (6-year rule: rented for ${yearsRentedAfterMainResidence} years after being main residence)`;
  cgtAmount = 0;
} else if (
  propertyUsage === "rental" &&
  wasMainResidence &&
  yearsRentedAfterMainResidence !== undefined &&
  yearsRentedAfterMainResidence > 6 &&
  !isForeignResidentAtSale
) {
  // Partial exemption: Only first 6 years exempt
  const exemptPeriod = Math.min(6, yearsRentedAfterMainResidence);
  const totalOwnershipPeriod = yearsAsMainResidence + yearsRentedAfterMainResidence;
  const exemptProportion = (yearsAsMainResidence + exemptPeriod) / totalOwnershipPeriod;
  mainResidenceExemption = capitalGain * exemptProportion;
  exemptionExplanation = `Partial main residence exemption applies (6-year rule: ${exemptProportion * 100}% exempt)`;
  // CGT applies to non-exempt portion
}
```

### 4. Implement Partial Exemption Logic

```typescript
// Partial exemption: Mixed use
if (
  propertyUsage === "rental" &&
  yearsAsMainResidence !== undefined &&
  yearsAsMainResidence > 0 &&
  holdPeriodYears > yearsAsMainResidence
) {
  const exemptProportion = yearsAsMainResidence / holdPeriodYears;
  mainResidenceExemption = capitalGain * exemptProportion;
  exemptionExplanation = `Partial main residence exemption applies (${(exemptProportion * 100).toFixed(0)}% of ownership period was main residence)`;
  // CGT applies to non-exempt portion
}
```

### 5. Update CGT Calculation

```typescript
// Calculate taxable capital gain (after exemptions)
const taxableCapitalGain = Math.max(0, capitalGain - mainResidenceExemption);

// Apply CGT discount to taxable portion only
const cgtAmount = taxableCapitalGain * discountFactor * (marginalTaxRate / 100);
```

### 6. Update CGTCalculation Interface

```typescript
export interface CGTCalculation {
  // ... existing fields
  mainResidenceExemption: number;
  taxableCapitalGain: number; // Capital gain after exemptions
  exemptionExplanation: string;
  assumptions: {
    // ... existing assumptions
    propertyUsage: "rental" | "primaryResidence" | "vacant";
    mainResidenceExemptionApplied: boolean;
    exemptionAmount: number;
    exemptionExplanation: string;
  };
}
```

## Example Scenarios

### Scenario 1: Primary Residence (Australian Resident)
- Property Usage: Primary Residence
- Tax Residency: Australian
- **Result**: $0 CGT (full exemption)

### Scenario 2: Primary Residence (Foreign Resident)
- Property Usage: Primary Residence
- Tax Residency: Foreign (at sale)
- **Result**: Full CGT applies (no exemption for foreign residents)

### Scenario 3: Rental Property (Never Main Residence)
- Property Usage: Rental
- Was Main Residence: No
- **Result**: Full CGT applies (with 50% discount if held >12 months)

### Scenario 4: Rental Property (6-Year Rule Eligible)
- Property Usage: Rental
- Was Main Residence: Yes
- Years Rented: 3 years (within 6-year limit)
- Tax Residency: Australian
- **Result**: $0 CGT (full exemption under 6-year rule)

### Scenario 5: Rental Property (Beyond 6-Year Rule)
- Property Usage: Rental
- Was Main Residence: Yes
- Years as Main Residence: 5 years
- Years Rented: 8 years (exceeds 6-year limit)
- Tax Residency: Australian
- **Result**: Partial exemption
  - Exempt: (5 + 6) / 13 = 84.6% of capital gain
  - Taxable: 15.4% of capital gain (with 50% discount if held >12 months)

### Scenario 6: Vacant Property
- Property Usage: Vacant
- **Result**: Full CGT applies (no exemption)

## Recommendations

1. **Add property usage parameter** to `calculateCGT()` function
2. **Implement main residence exemption** logic
3. **Implement 6-year rule** logic
4. **Add fields to InvestmentInputs** for:
   - `wasMainResidence?: boolean`
   - `yearsAsMainResidence?: number`
   - `yearsRentedAfterMainResidence?: number`
5. **Update UI** to collect this information (if needed)
6. **Update assumptions display** to show exemption information
7. **Add disclaimer** about foreign resident ineligibility for main residence exemption









