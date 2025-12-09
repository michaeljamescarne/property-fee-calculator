# Phase 3: Core Calculator - Implementation Plan

## Overview

Phase 3 builds the comprehensive calculator that extends the existing FIRB calculator to include:

- ✅ Eligibility Assessment (FIRB) - Already implemented
- ✅ Comprehensive Cost Analysis - Already implemented
- ⚠️ Investment Quality Analysis - Partially implemented (needs integration)
- ❌ Optimal Use Case Analysis - Not yet implemented

## Current Status Assessment

### ✅ Already Implemented

1. **FIRB Calculator Wizard**
   - ✅ Step 1: Citizenship Status
   - ✅ Step 2: Property Details
   - ✅ Step 3: Review
   - ✅ Step 4: Results (basic)

2. **Calculation Engines**
   - ✅ FIRB eligibility checking (`lib/firb/eligibility.ts`)
   - ✅ Cost breakdown calculations (`lib/firb/calculations.ts`)
   - ✅ Investment analytics (`lib/firb/investment-analytics.ts`)
   - ✅ Loan calculator (`lib/firb/loan-calculator.ts`)
   - ✅ Tax calculator (`lib/firb/tax-calculator.ts`)

3. **Results Display**
   - ✅ Eligibility section
   - ✅ Cost breakdown section
   - ✅ Basic results panel

### ⚠️ Needs Integration

1. **Investment Quality Analysis**
   - ✅ Calculation logic exists
   - ❌ Not integrated into wizard flow
   - ❌ Not displayed in results
   - ❌ Missing Step 3: Financial Details in wizard

2. **Results Dashboard Enhancement**
   - ⚠️ Basic results exist
   - ❌ Investment quality section missing
   - ❌ Sensitivity analysis missing
   - ❌ Alternative investment comparison missing

### ❌ Not Yet Implemented

1. **Optimal Use Case Analysis**
   - ❌ Long-term vs short-stay comparison
   - ❌ Short-stay regulations lookup
   - ❌ Income modeling for both use cases
   - ❌ Management cost comparison

2. **Enhanced Wizard Steps**
   - ❌ Step 3: Financial Details (rental, growth, loan)
   - ❌ Investment quality inputs
   - ❌ Optimal use case selection

## Phase 3 Tasks

### Task 1: Enhance Calculator Wizard

#### 1.1 Add Step 3: Financial Details

- [ ] Create `FinancialDetailsStep.tsx` component
- [ ] Add weekly rent input
- [ ] Add capital growth rate input
- [ ] Add loan details (if borrowing)
- [ ] Add council rates input
- [ ] Add property management options
- [ ] Integrate with wizard flow

#### 1.2 Update Wizard Flow

- [ ] Update progress indicator (add Step 3)
- [ ] Update step navigation logic
- [ ] Update form data structure
- [ ] Add validation for financial inputs

### Task 2: Integrate Investment Analytics

#### 2.1 Update Calculation API

- [ ] Enhance `/api/firb-calculate` endpoint
- [ ] Add investment analytics calculation
- [ ] Return investment quality metrics
- [ ] Add error handling

#### 2.2 Update Results Panel

- [ ] Add Investment Quality section
- [ ] Display rental yield metrics
- [ ] Display cash flow projections
- [ ] Display capital growth projections
- [ ] Display ROI calculations
- [ ] Add sensitivity analysis display

### Task 3: Build Optimal Use Case Analysis

#### 3.1 Create Optimal Use Case Calculator

- [ ] Create `lib/firb/optimal-use-case.ts`
- [ ] Implement long-term rental income model
- [ ] Implement short-stay income model
- [ ] Add management cost calculations
- [ ] Add comparison logic

#### 3.2 Integrate Short-Stay Regulations

- [ ] Create API endpoint for regulations lookup
- [ ] Query `short_stay_regulations` table
- [ ] Display regulations in results
- [ ] Add compliance cost calculations

#### 3.3 Create Optimal Use Case Component

- [ ] Create `OptimalUseCaseSection.tsx`
- [ ] Display income comparison
- [ ] Display management cost comparison
- [ ] Display regulatory requirements
- [ ] Add recommendations

### Task 4: Enhance Results Dashboard

#### 4.1 Add Investment Quality Section

- [ ] Rental yield display (gross, net, effective)
- [ ] Cash flow projections (10-year)
- [ ] Capital growth projections
- [ ] ROI metrics
- [ ] Investment score

#### 4.2 Add Sensitivity Analysis

- [ ] Vacancy rate scenarios
- [ ] Interest rate scenarios
- [ ] Growth rate scenarios
- [ ] Interactive charts

#### 4.3 Add Alternative Investment Comparison

- [ ] Property vs Bonds
- [ ] Property vs Equities
- [ ] Property vs Term Deposits
- [ ] Total return comparison

### Task 5: Update PDF Generation

#### 5.1 Enhance PDF Report

- [ ] Add investment quality section
- [ ] Add optimal use case comparison
- [ ] Add sensitivity analysis charts
- [ ] Add alternative investment comparison
- [ ] Update report structure

## Implementation Order

1. **Week 1: Enhance Wizard & Integrate Investment Analytics**
   - Add Financial Details step
   - Integrate investment analytics into calculation
   - Update results to show investment quality

2. **Week 2: Build Optimal Use Case Analysis**
   - Create optimal use case calculator
   - Integrate short-stay regulations lookup
   - Build comparison component

3. **Week 3: Polish & Testing**
   - Enhance results dashboard
   - Update PDF generation
   - Comprehensive testing
   - Bug fixes

## Success Criteria

- [ ] All 4 wizard steps work (Citizenship, Property, Financial, Review)
- [ ] Investment quality analysis displays in results
- [ ] Optimal use case comparison works
- [ ] PDF includes all sections
- [ ] All calculations are accurate
- [ ] UI is responsive and accessible

## Next Steps

Start with Task 1.1: Create Financial Details Step component.



