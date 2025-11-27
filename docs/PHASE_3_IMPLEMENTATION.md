# Phase 3: Core Calculator - Implementation Guide

## Current Status

### ✅ Already Implemented

- FIRB Calculator wizard (Citizenship → Property → Review → Results)
- Eligibility checking
- Cost breakdown calculations
- Investment analytics calculation engine
- Results panel with investment analytics display
- PDF generation

### ❌ Missing for Phase 3

1. **Step 3: Financial Details** in wizard flow
2. **Optimal Use Case Analysis** (long-term vs short-stay)
3. **Integration** of financial inputs into wizard

## Phase 3 Tasks

### Task 1: Add Financial Details Step to Wizard

**Current Flow:**
Citizenship → Property → Review → Results

**Target Flow:**
Citizenship → Property → **Financial Details** → Review → Results

**Steps:**

1. Create `FinancialDetailsStep.tsx` component
2. Update wizard navigation logic
3. Update progress indicator (5 steps instead of 4)
4. Integrate financial inputs into calculation

### Task 2: Build Optimal Use Case Analysis

**Components Needed:**

1. `lib/firb/optimal-use-case.ts` - Calculation logic
2. `components/firb/OptimalUseCaseSection.tsx` - Display component
3. API endpoint for short-stay regulations lookup
4. Integration into results panel

### Task 3: Enhance Results Dashboard

**Add:**

- Optimal use case comparison section
- Enhanced investment quality display
- Better integration of all sections

## Implementation Priority

1. **High Priority**: Add Financial Details step (enables investment analytics in wizard)
2. **High Priority**: Build optimal use case analysis (core PRD feature)
3. **Medium Priority**: Enhance results dashboard integration

## Next Action

Start with Task 1: Create Financial Details Step component.
