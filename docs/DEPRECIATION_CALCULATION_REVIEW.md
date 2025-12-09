# Depreciation Calculation Review

## Current Implementation Analysis

### Location
- **File**: `property-fee-calculator/lib/firb/tax-calculator.ts`
- **Function**: `calculateTaxDeductions()` (lines 48-108)
- **Function**: `estimateDepreciation()` (lines 294-196)

### Current Calculation Logic

```typescript
if (propertyType === "newDwelling") {
  const buildingValue = propertyValue * 0.7; // 70% building, 30% land
  const plantValue = propertyValue * 0.1; // 10% fixtures
  
  // Building: 2.5% for up to 40 years
  if (buildingAge < 40) {
    depreciation += buildingValue * 0.025;
  }
  
  // Plant & equipment: 20% diminishing for 5 years
  if (buildingAge < 5) {
    depreciation += plantValue * 0.2 * (1 - buildingAge * 0.2);
  }
}
```

### Issues Identified

#### 1. **Only Applies to "newDwelling"**
- **Problem**: Depreciation is only calculated for `propertyType === "newDwelling"`
- **Reality**: Established properties built after September 15, 1987 are also eligible for capital works deductions
- **Impact**: Established properties get $0 depreciation, which is incorrect

#### 2. **Uses Current Property Value Instead of Original Cost**
- **Problem**: Calculation uses `propertyValue * 0.7` (current market value)
- **ATO Rule**: Capital works deductions apply to:
  - **Original construction cost** (for properties built after Sept 15, 1987)
  - **Purchase price** (excluding land) when first used for income-producing purposes
  - **NOT** current market value
- **Impact**: Depreciation is calculated on inflated values, leading to incorrect deductions

#### 3. **No Separate Treatment of Capital Improvements**
- **Problem**: Code doesn't account for capital improvements made during ownership
- **ATO Rule**: Capital improvements should be depreciated separately from the original building
- **Impact**: If user makes improvements, they're not being depreciated

#### 4. **Plant & Equipment Calculation is Simplified**
- **Problem**: Uses a flat 20% diminishing value rate
- **ATO Rule**: Each plant & equipment item has its own effective life (e.g., carpets 8-10 years, appliances 5-10 years)
- **Impact**: May overstate or understate plant & equipment depreciation

#### 5. **Building Age Logic**
- **Current**: Uses `buildingAge` parameter (defaults to 0 for new, 10 for established)
- **Issue**: For established properties, the building age should determine if the property is still within the 40-year depreciation period
- **Impact**: May calculate depreciation for properties that have exceeded the 40-year limit

## Australian ATO Depreciation Rules

### Capital Works Deductions (Division 43)

**Eligibility:**
- Residential properties constructed after **September 15, 1987**
- Applies to structural elements: walls, floors, roofs, built-in fixtures
- Rate: **2.5% per year** for **40 years** (straight-line method)
- Based on **original construction cost** or **purchase price** (excluding land)

**What Can Be Depreciated:**
1. Original building construction cost (if built after Sept 15, 1987)
2. Capital improvements made during ownership (depreciated separately)
3. Renovations and extensions

**What Cannot Be Depreciated:**
- Land value
- Properties built before September 15, 1987 (unless renovated after this date)
- Repairs (these are immediately deductible)

### Plant & Equipment Deductions (Division 40)

**Eligibility:**
- Removable or mechanical assets
- Each item has an effective life determined by ATO
- Can use either:
  - **Diminishing value method** (faster depreciation in early years)
  - **Prime cost method** (straight-line)

**Common Effective Lives:**
- Carpets: 8-10 years
- Appliances: 5-10 years
- Air conditioning: 10-15 years
- Blinds/curtains: 6-10 years

## Recommended Fixes

### 1. Apply Depreciation to Established Properties
```typescript
// Should check if property was built after Sept 15, 1987
const constructionDate = purchaseDate ? new Date(purchaseDate) : new Date();
const cutoffDate = new Date("1987-09-15");
const isEligibleForCapitalWorks = constructionDate > cutoffDate || buildingAge < 40;

if (propertyType === "newDwelling" || (propertyType === "established" && isEligibleForCapitalWorks)) {
  // Calculate depreciation
}
```

### 2. Use Purchase Price Instead of Current Value
```typescript
// Should use purchase price (excluding land), not current market value
const purchasePrice = propertyValue; // This should be the original purchase price
const landValue = purchasePrice * 0.3; // 30% land
const buildingCost = purchasePrice * 0.7; // 70% building

// Only depreciate if building age < 40 years
if (buildingAge < 40) {
  depreciation += buildingCost * 0.025;
}
```

### 3. Add Capital Improvements Parameter
```typescript
interface TaxDeductionInputs {
  // ... existing fields
  capitalImprovements?: number; // Annual capital improvements made
  capitalImprovementsAge?: number; // Age of improvements in years
}

// Depreciate capital improvements separately
if (capitalImprovements && capitalImprovementsAge < 40) {
  depreciation += capitalImprovements * 0.025;
}
```

### 4. Improve Plant & Equipment Calculation
```typescript
// More accurate plant & equipment calculation
// Could use a weighted average based on typical property fixtures
const plantValue = propertyValue * 0.1;
const plantEffectiveLife = 8; // Average effective life in years

// Diminishing value method
if (buildingAge < plantEffectiveLife) {
  const diminishingRate = 1 / plantEffectiveLife;
  depreciation += plantValue * diminishingRate * Math.pow(1 - diminishingRate, buildingAge);
}
```

### 5. Consider Property Purchase Date
```typescript
// For existing properties, need to know:
// - When property was built (to check if eligible)
// - When it was first used for income-producing purposes
// - Purchase price (not current market value)
```

## Example Calculation

### Current (Incorrect) Calculation
- Property Value: $1,000,000 (current market value)
- Property Type: newDwelling
- Building Age: 0 years
- Building Value: $1,000,000 × 0.7 = $700,000
- Plant Value: $1,000,000 × 0.1 = $100,000
- **Depreciation**: 
  - Building: $700,000 × 2.5% = $17,500/year
  - Plant: $100,000 × 20% = $20,000/year
  - **Total: $37,500/year**

### Correct Calculation (Based on Purchase)
- Purchase Price: $800,000 (original purchase price)
- Land Value: $800,000 × 0.3 = $240,000
- Building Cost: $800,000 × 0.7 = $560,000
- Plant Value: $800,000 × 0.1 = $80,000
- Building Age: 0 years
- **Depreciation**:
  - Building: $560,000 × 2.5% = $14,000/year (for 40 years)
  - Plant: $80,000 × 12.5% (diminishing, year 1) = $10,000/year
  - **Total: $24,000/year**

### Difference
- Current calculation: $37,500/year
- Correct calculation: $24,000/year
- **Overstatement: $13,500/year (56% higher)**

## Recommendations

1. **Immediate Fix**: Use purchase price instead of current property value
2. **Add Property Age Check**: Only calculate if built after Sept 15, 1987
3. **Apply to Established Properties**: Don't exclude established properties
4. **Add Capital Improvements**: Allow users to input capital improvements
5. **Improve Plant & Equipment**: Use more accurate effective life calculations
6. **Add Disclaimer**: Note that actual depreciation requires a quantity surveyor report

## ATO Compliance Note

The ATO requires:
- Depreciation schedules prepared by qualified quantity surveyors for accurate claims
- Proper documentation of construction dates and costs
- Separation of repairs (immediately deductible) from capital improvements (depreciated)

The current simplified calculation is an **estimate only** and should be clearly labeled as such.



