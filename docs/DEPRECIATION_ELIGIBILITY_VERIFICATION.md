# Depreciation Eligibility Verification

## Summary

**CRITICAL FINDING**: Depreciation deductions are **ONLY available for income-producing properties**. They are **NOT available** for:
- Primary residences (owner-occupied)
- Properties not rented out
- Vacant properties not generating income

## 1. Income-Producing Requirement

### ✅ Eligible for Depreciation
- **Rental properties** (rented out or genuinely available for rent)
- **Properties used to generate assessable income**

### ❌ NOT Eligible for Depreciation
- **Primary residences** (owner-occupied, not rented)
- **Properties not rented out** (vacant, holiday homes for personal use)
- **Properties not generating income**

### ⚠️ Partial Eligibility
- **Part of primary residence rented out**: Can claim depreciation proportional to income-producing portion
- **Converted from primary residence to rental**: Can claim depreciation from conversion date, but NOT on existing second-hand assets (if converted after July 1, 2017)

## 2. Property Type Eligibility

### Residential Properties (newDwelling, established)

#### Capital Works (Division 43) - 2.5% per year for 40 years
- ✅ **New dwellings**: Eligible if built after September 15, 1987
- ✅ **Established properties**: Eligible if built after September 15, 1987 AND used for income-producing purposes
- ❌ **Properties built before September 15, 1987**: NOT eligible (unless substantially renovated after this date)
- **Basis**: Original construction cost OR purchase price (excluding land) when first used for income-producing purposes

#### Plant & Equipment (Division 40)
- ✅ **New dwellings**: All plant & equipment eligible
- ⚠️ **Established properties purchased after May 9, 2017**: 
  - ❌ CANNOT depreciate existing (second-hand) plant & equipment
  - ✅ CAN depreciate NEW plant & equipment purchased after acquisition
- ✅ **Established properties purchased before May 9, 2017**: Can depreciate existing plant & equipment

### Vacant Land

#### Capital Works (Division 43)
- ❌ **Vacant land**: NO depreciation available (no building structure)
- ✅ **After development**: Once building is constructed and property is income-producing, depreciation becomes available

#### Plant & Equipment (Division 40)
- ❌ **Vacant land**: NO plant & equipment to depreciate
- ✅ **After development**: Plant & equipment installed can be depreciated

### Commercial Properties

#### Capital Works (Division 43)
- ✅ **Commercial properties**: Eligible for capital works deductions
- **Rate**: Typically 2.5% per year for 40 years (same as residential) for properties built after certain dates
- **Note**: Some commercial properties may have different rates (e.g., 4% for certain types), but 2.5% is standard for most

#### Plant & Equipment (Division 40)
- ✅ **Commercial properties**: Eligible for plant & equipment depreciation
- **Note**: May have different effective lives than residential properties

## 3. Current Code Issues

### Issue 1: No Income-Producing Check
**Location**: `property-fee-calculator/lib/firb/tax-calculator.ts` - `calculateTaxDeductions()`

**Problem**: Code calculates depreciation regardless of property usage
```typescript
// Current code doesn't check if property is income-producing
if (propertyType === "newDwelling") {
  // Calculates depreciation
}
```

**Should be**:
```typescript
// Only calculate if property is income-producing
if (isIncomeProducing && (propertyType === "newDwelling" || isEligibleForCapitalWorks)) {
  // Calculate depreciation
}
```

### Issue 2: Only Applies to "newDwelling"
**Problem**: Established properties built after 1987 are also eligible

**Should check**:
- Property construction date (after Sept 15, 1987)
- Whether property is income-producing
- Building age (must be < 40 years for capital works)

### Issue 3: Vacant Land Should Return $0
**Problem**: Vacant land has no building, so depreciation should be $0

**Current**: Code only calculates for "newDwelling", so vacant land gets $0 (correct by accident)

### Issue 4: Commercial Properties Not Handled
**Problem**: Commercial properties are eligible but not explicitly handled

**Should**: Add logic for commercial property depreciation

## 4. Required Changes

### Add Property Usage Check
The `InvestmentInputs` type already has `propertyUsage?: "rental" | "primaryResidence" | "vacant"`

**Required Logic**:
```typescript
const isIncomeProducing = 
  !propertyUsage || // Default to rental if not specified
  propertyUsage === "rental"; // Only rental properties are income-producing

if (!isIncomeProducing) {
  return { ...deductions, depreciation: 0 }; // No depreciation for non-income properties
}
```

### Update Depreciation Calculation
```typescript
export function calculateTaxDeductions(
  // ... existing parameters
  propertyValue: number,
  propertyType: PropertyType,
  buildingAge: number = 0,
  isIncomeProducing: boolean = true, // NEW PARAMETER
  purchasePrice?: number, // NEW: Use purchase price instead of current value
  constructionDate?: Date // NEW: To check if built after Sept 15, 1987
): TaxDeductions {
  
  let depreciation = 0;
  
  // CRITICAL: Only calculate if income-producing
  if (!isIncomeProducing) {
    return { ...otherDeductions, depreciation: 0, total: ... };
  }
  
  // Vacant land: No depreciation
  if (propertyType === "vacantLand") {
    return { ...otherDeductions, depreciation: 0, total: ... };
  }
  
  // Check if eligible for capital works (built after Sept 15, 1987)
  const cutoffDate = new Date("1987-09-15");
  const isEligibleForCapitalWorks = 
    !constructionDate || constructionDate > cutoffDate;
  
  // Use purchase price if available, otherwise property value
  const costBasis = purchasePrice || propertyValue;
  const buildingCost = costBasis * 0.7; // 70% building, 30% land
  
  // Capital works depreciation (2.5% for 40 years)
  if ((propertyType === "newDwelling" || propertyType === "established" || propertyType === "commercial") 
      && isEligibleForCapitalWorks 
      && buildingAge < 40) {
    depreciation += buildingCost * 0.025;
  }
  
  // Plant & equipment (only for new dwellings or new assets in established properties)
  if (propertyType === "newDwelling") {
    const plantValue = costBasis * 0.1;
    if (buildingAge < 5) {
      depreciation += plantValue * 0.2 * (1 - buildingAge * 0.2);
    }
  }
  // Note: For established properties, only NEW plant & equipment can be depreciated
  // (if purchased after May 9, 2017)
  
  return { ...otherDeductions, depreciation, total: ... };
}
```

## 5. ATO Rules Summary

### Key Dates
- **September 15, 1987**: Cutoff for capital works eligibility
- **May 9, 2017**: Cutoff for second-hand plant & equipment depreciation
- **July 1, 2017**: Cutoff for converted primary residences

### Depreciation Rates
- **Capital Works (Division 43)**: 2.5% per year for 40 years (straight-line)
- **Plant & Equipment (Division 40)**: Varies by effective life (typically 5-15 years)

### Basis for Depreciation
- **Capital Works**: Original construction cost OR purchase price (excluding land) when first used for income-producing purposes
- **NOT**: Current market value

## 6. Recommendations

1. **Add `isIncomeProducing` check**: Only calculate depreciation if property is income-producing
2. **Add `purchasePrice` parameter**: Use purchase price instead of current property value
3. **Add `constructionDate` parameter**: To check eligibility for capital works
4. **Handle established properties**: Don't exclude established properties if they meet criteria
5. **Handle commercial properties**: Add explicit logic for commercial property depreciation
6. **Add disclaimer**: Clearly state that depreciation is only available for income-producing properties
7. **Update UI**: Show $0 depreciation for primary residences and non-rental properties

## 7. Example Scenarios

### Scenario 1: New Dwelling, Rental Property
- ✅ Eligible for depreciation
- Capital works: 2.5% of building cost
- Plant & equipment: Full depreciation available

### Scenario 2: Established Property, Rental, Built 2000
- ✅ Eligible for capital works (built after 1987)
- ⚠️ Plant & equipment: Only NEW items (if purchased after May 9, 2017)
- Capital works: 2.5% of building cost (if building age < 40)

### Scenario 3: Primary Residence
- ❌ NOT eligible for depreciation
- Should return $0 depreciation

### Scenario 4: Vacant Land
- ❌ NOT eligible for depreciation (no building)
- Should return $0 depreciation

### Scenario 5: Commercial Property, Rental
- ✅ Eligible for depreciation
- Capital works: 2.5% of building cost (typically)
- Plant & equipment: Eligible based on effective life











