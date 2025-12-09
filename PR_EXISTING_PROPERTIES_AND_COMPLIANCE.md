# Existing Properties Support & Compliance Updates

## Overview

This PR implements three major enhancements to the FIRB Calculator:

1. **Extended support for existing property owners** - New initial step and flow for reviewing existing investments
2. **Removed financial advice breach components** - Investment Comparison and Investment Score removed for compliance
3. **Removed unnecessary sections** - Investment Analysis Parameters and Market Benchmark Comparison sections removed

## Changes Summary

### 1. New Purchase Type Step

- **New Component**: `components/firb/PurchaseTypeStep.tsx`
  - Introduces first step asking users to select between "Purchasing a property" or "Reviewing an existing investment"
  - Radio button interface with clear descriptions

- **Wizard Flow Updates**:
  - Both flows now include citizenship step (required for both purchasing and existing)
  - Existing properties flow includes purchase date field in Property step
  - Progress indicator shows all 6 steps for both flows

### 2. Existing Property Flow

- **Property Step Enhancement**:
  - Added purchase date field (date picker) for existing properties
  - Purchase date is required when `purchaseType === "existing"`
  - Purchase date informs 10-year projection calculations

- **Eligibility Handling**:
  - Existing properties assume FIRB approval (displayed as "Existing property, not assessed")
  - Eligibility check bypassed for existing properties but citizenship still collected
  - Special status message in EligibilityResultCard for existing properties

- **Investment Analytics**:
  - Purchase date used to calculate years owned
  - Projections adjusted to show remaining years in 10-year projection
  - ProjectionChart displays correct year labels based on purchase date

### 3. Compliance Updates

- **Removed Components**:
  - Investment Comparison component (removed from ResultsPanel)
  - Investment Score component (removed from ResultsPanel)
  - Investment Analysis Parameters section (removed from results)
  - Market Benchmark Comparison section (removed from results)

### 4. Validation & API Updates

- **Validation Schema** (`lib/validations/firb.ts`):
  - `purchaseType` now required (enum: "purchasing" | "existing")
  - `purchaseDate` required when `purchaseType === "existing"`
  - `citizenshipStatus` now required for both flows

- **API Route** (`app/api/firb-calculate/route.ts`):
  - Enhanced error handling with detailed validation messages
  - Proper handling of existing properties (assumes FIRB approval)
  - Improved error responses with validation details

### 5. UI/UX Improvements

- **Navigation**:
  - Back button removed from first step (Purchase Type)
  - Back button properly shows on Citizenship step (step 2)
  - Consistent navigation flow for both purchase types

- **Progress Indicator**:
  - Always shows all 6 steps regardless of purchase type
  - Proper step highlighting and completion tracking

### 6. Translations

- Added translations for Purchase Type step (en.json, zh.json)
- Added translations for Purchase Date field
- Added translation for "Existing property, not assessed" status

### 7. Other Updates

- Updated sample report image dimensions (1998x2122)
- Improved error handling and user feedback
- Enhanced debugging capabilities (removed debug banners for production)

## Files Changed

### New Files

- `components/firb/PurchaseTypeStep.tsx`

### Modified Files

- `app/[locale]/calculator/page.tsx` - Main calculator page with new flow
- `app/[locale]/firb-calculator/page.tsx` - FIRB calculator page updates
- `components/firb/ProgressIndicator.tsx` - Always show all steps
- `components/firb/PropertyDetailsStep.tsx` - Added purchase date field
- `components/firb/ResultsPanel.tsx` - Removed compliance-breaching components
- `components/firb/EligibilityResultCard.tsx` - Handle existing property status
- `components/firb/ProjectionChart.tsx` - Correct year labels for existing properties
- `app/api/firb-calculate/route.ts` - Enhanced validation and error handling
- `lib/validations/firb.ts` - Updated validation schema
- `lib/firb/investment-analytics.ts` - Purchase date integration
- `lib/firb/eligibility.ts` - Existing property handling
- `types/database.ts` - Added purchaseType and purchaseDate types
- `messages/en.json` & `messages/zh.json` - New translations
- `app/[locale]/page.tsx` - Updated sample report image dimensions
- `public/images/sample-report-page1.png` - Updated image

## Testing Checklist

- [x] Purchase Type step appears as first step
- [x] Both "Purchasing" and "Existing" flows work correctly
- [x] Citizenship step shows for both flows
- [x] Purchase date field appears for existing properties
- [x] Purchase date is required validation works
- [x] Existing properties show correct eligibility status
- [x] 10-year projections show correct years for existing properties
- [x] Investment Comparison removed from results
- [x] Investment Score removed from results
- [x] Investment Analysis Parameters section removed
- [x] Market Benchmark Comparison section removed
- [x] Back button navigation works correctly
- [x] Error messages are clear and helpful
- [x] Translations work for both English and Chinese

## Breaking Changes

None - this is a feature addition that maintains backward compatibility.

## Migration Notes

- Existing saved calculations will default to `purchaseType: "purchasing"` for backward compatibility
- No database migrations required

## Deployment Notes

- No environment variable changes required
- No database migrations required
- Clear Next.js cache if image updates don't appear immediately



