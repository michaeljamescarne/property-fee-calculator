# Improved Tax Calculations: Capital Gains Tax & Depreciation

## Overview

This PR implements comprehensive improvements to tax calculations, specifically:
1. **Capital Gains Tax (CGT)** - Now properly considers citizenship, residency status, and property usage
2. **Depreciation** - Now correctly applies only to income-producing properties and uses purchase price basis

## Key Changes

### 1. Capital Gains Tax Improvements

#### Tax Residency Determination
- Added `determineTaxResidency()` function to properly determine tax residency from citizenship status and ordinarily resident flag
- Distinguishes between Australian tax residents and foreign tax residents
- Handles Australian citizens, permanent residents, temporary residents, and foreign persons

#### CGT Discount Rules
- **Australian tax residents**: 50% CGT discount if asset held >12 months
- **Foreign tax residents**: No discount for assets acquired after May 8, 2012
- **Legacy rule**: Foreign residents may still get discount for assets acquired before May 8, 2012

#### Main Residence Exemption
- **Primary Residence (Australian residents)**: Full CGT exemption - $0 CGT payable
- **Primary Residence (Foreign residents)**: No exemption (as of June 30, 2020)
- **6-Year Rule**: Properties rented after being main residence can claim full exemption for up to 6 years
- **Partial Exemption**: Handles mixed use scenarios (main residence then rental)

#### Property Usage Considerations
- **Primary Residence**: Full exemption (Australian residents only)
- **Rental Property**: Full CGT applies (with exemptions if 6-year rule applies)
- **Vacant Property**: Full CGT applies (no exemptions)

#### Withholding Tax
- Only applies to foreign residents selling property ≥ $750,000
- Uses macro benchmark rate (configurable, default 12.5%)
- Australian residents: No withholding tax

### 2. Depreciation Calculation Improvements

#### Income-Producing Requirement
- Depreciation is **ONLY** available for income-producing properties (rental properties)
- **Primary residences**: $0 depreciation (not income-producing)
- **Vacant properties**: $0 depreciation (not income-producing)

#### Property Type Handling
- **New Dwellings**: Full depreciation available (if built after Sept 15, 1987)
- **Established Properties**: Capital works depreciation available (if built after Sept 15, 1987)
- **Vacant Land**: $0 depreciation (no building structure)
- **Commercial Properties**: Eligible for depreciation

#### Cost Basis
- Uses **purchase price** (or construction cost) instead of current market value
- Only depreciates building portion (70% of cost, excluding land)
- Plant & equipment depreciation for new dwellings only

#### User Input
- Added checkbox: "Building was constructed after September 15, 1987"
- Includes tooltip explaining capital works depreciation eligibility
- Only shown for rental properties (income-producing)

### 3. Tax Analysis Display Improvements

#### Assumptions Section
- Added comprehensive assumptions section showing:
  - Tax residency status
  - Property usage
  - Main residence exemption status and explanation
  - CGT discount application and explanation
  - Withholding tax applicability
  - Marginal tax rate used
  - Holding period

#### CGT Display
- Shows main residence exemption amount (if applicable)
- Shows taxable capital gain (after exemptions)
- Clear separation between total capital gain and taxable portion

#### Styling
- Consistent left-aligned layout for all assumption fields
- Titles don't wrap (using `whitespace-nowrap` and `min-w-[180px]`)
- All values left-aligned for readability

## Files Changed

### Core Logic
- `lib/firb/tax-calculator.ts` - Enhanced CGT and depreciation calculations
- `lib/firb/investment-analytics.ts` - Passes property usage and residency info to tax calculations
- `types/investment.ts` - Added `builtAfter1987` field and updated CGT type definitions

### UI Components
- `components/firb/TaxAnalysis.tsx` - Added assumptions section and main residence exemption display
- `components/firb/FinancialDetailsStep.tsx` - Added "built after 1987" checkbox with tooltip
- `components/firb/ResultsPanel.tsx` - Passes citizenship/residency to analytics

### Translations
- `messages/en.json` - Added tax analysis assumptions translations
- `messages/zh.json` - Added Chinese translations

### Documentation
- `docs/DEPRECIATION_CALCULATION_REVIEW.md` - Detailed depreciation analysis
- `docs/DEPRECIATION_ELIGIBILITY_VERIFICATION.md` - Depreciation eligibility rules
- `docs/CGT_PROPERTY_USAGE_REVIEW.md` - CGT property usage analysis

## Testing Recommendations

### CGT Scenarios to Test
1. ✅ Australian citizen, ordinarily resident, primary residence → Should show $0 CGT
2. ✅ Australian citizen, ordinarily resident, rental property → Should show CGT with 50% discount
3. ✅ Australian citizen, NOT ordinarily resident, rental property → Should show CGT with no discount
4. ✅ Foreign person, rental property → Should show CGT with no discount + withholding tax
5. ✅ Primary residence (foreign resident) → Should show CGT (no exemption)

### Depreciation Scenarios to Test
1. ✅ Primary residence → Should show $0 depreciation
2. ✅ Vacant property → Should show $0 depreciation
3. ✅ New dwelling, rental, built after 1987 → Should show depreciation
4. ✅ Established property, rental, built after 1987 → Should show capital works depreciation
5. ✅ Established property, rental, built before 1987 → Should show $0 depreciation (if checkbox unchecked)

## Breaking Changes

None - all changes are backward compatible. Default behavior:
- If property usage not specified, defaults to "rental"
- If builtAfter1987 not specified, defaults based on property type
- If residency not specified, defaults to foreign resident (conservative)

## Migration Notes

No database migrations required. All changes are in calculation logic and UI.

## Related Issues

- Addresses tax calculation accuracy concerns
- Implements proper ATO compliance for CGT and depreciation
- Improves user transparency with assumptions display

