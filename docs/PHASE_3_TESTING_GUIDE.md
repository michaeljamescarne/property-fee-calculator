# Phase 3: Core Calculator - Testing Guide

## Overview

This guide covers testing the complete calculator wizard flow, including the new Financial Details step and Optimal Use Case Analysis.

---

## Test 1: Complete Wizard Flow

### Steps to Test

1. **Navigate to Calculator**
   - Go to: `http://localhost:3002/en/firb-calculator`
   - Verify: Page loads with progress indicator showing 5 steps

2. **Step 1: Citizenship**
   - Select: "Australian Citizen"
   - Verify: "Ordinarily Resident" checkbox appears
   - Check: "Are you ordinarily resident in Australia?"
   - Click: "Next"
   - Expected: Progress indicator shows Step 1 complete, moves to Step 2

3. **Step 2: Property Details**
   - Select: "New Dwelling"
   - Enter: Property value (e.g., $1,500,000)
   - Select: State (e.g., "Victoria")
   - Enter: Address (optional)
   - Select: Deposit percentage (e.g., 20%)
   - Click: "Next"
   - Expected: Progress indicator shows Step 2 complete, moves to Step 3

4. **Step 3: Financial Details** ⭐ NEW
   - Verify: Weekly rent is auto-populated (based on state yield)
   - Adjust: Weekly rent if needed
   - Verify: Capital growth rate slider (default 6%)
   - Verify: Loan details section appears (if deposit < 100%)
   - Adjust: Interest rate if needed
   - Enter: Council rates (optional)
   - Select: Self-managed or property management
   - Click: "Next"
   - Expected: Progress indicator shows Step 3 complete, moves to Step 4

5. **Step 4: Review**
   - Verify: All entered information is displayed
   - Verify: Can edit Citizenship and Property sections
   - Click: "Generate Report"
   - Expected: Calculation runs, moves to Step 5 (Results)

6. **Step 5: Results**
   - Verify: Eligibility section displays
   - Verify: Cost breakdown displays
   - Verify: Investment Analysis toggle appears
   - Click: "Show Investment Analysis"
   - Expected: Investment analytics sections expand

---

## Test 2: Financial Details Step

### Test Cases

1. **Auto-populated Values**
   - Start with different states (NSW, VIC, QLD)
   - Verify: Weekly rent estimates differ by state
   - Verify: Loan amount calculated correctly from deposit

2. **Input Validation**
   - Try: Entering $0 for weekly rent
   - Expected: "Next" button should be disabled
   - Try: Entering negative values
   - Expected: Should be prevented or handled gracefully

3. **Loan Details**
   - Test: With 20% deposit (loan should appear)
   - Test: With 100% deposit (loan section should not appear)
   - Adjust: Interest rate slider
   - Verify: Values update correctly

4. **Property Management**
   - Toggle: Self-managed checkbox
   - Verify: Management fee slider appears/disappears
   - Verify: Calculations update accordingly

---

## Test 3: Optimal Use Case Analysis

### Prerequisites

- Complete wizard with financial details
- View results page
- Expand Investment Analysis section

### Test Cases

1. **Basic Display**
   - Verify: "Optimal Use Case Analysis" section appears
   - Verify: Two comparison cards (Long-Term vs Short-Stay)
   - Verify: Recommendation alert at top

2. **Long-Term Rental Card**
   - Verify: Annual income displays correctly
   - Verify: Annual expenses displays correctly
   - Verify: Net income = income - expenses
   - Verify: Management complexity badge
   - Verify: Regulatory compliance badge
   - Verify: Risk level badge

3. **Short-Stay Card**
   - Verify: Annual income (should be higher than long-term)
   - Verify: Annual expenses (should include platform fees, cleaning)
   - Verify: Net income calculation
   - Verify: Regulations display (if available)

4. **Regulations Lookup**
   - Test: With property in different states
   - Verify: API call to `/api/short-stay-regulations`
   - Check: Browser Network tab for API response
   - Verify: Regulations display correctly (or null if none)

5. **Recommendation Logic**
   - Test: Property where short-stay is prohibited
   - Expected: Recommendation = "Long-term rental"
   - Test: Property where short-stay is permitted
   - Expected: Recommendation based on net income comparison

6. **Comparison Summary**
   - Verify: Income difference displays
   - Verify: Net difference displays
   - Verify: Net yield displays
   - Verify: Percentage differences are correct

7. **Reasoning Section**
   - Verify: Reasoning points display
   - Verify: Points are relevant to the recommendation

---

## Test 4: Short-Stay Regulations API

### Manual API Testing

1. **Test with State Only**

   ```
   GET /api/short-stay-regulations?state=VIC
   ```

   - Expected: Returns regulations for Victoria (if exists)

2. **Test with Postcode**

   ```
   GET /api/short-stay-regulations?state=NSW&postcode=2000
   ```

   - Expected: Returns regulations for Sydney CBD (if exists)

3. **Test with Council**

   ```
   GET /api/short-stay-regulations?state=VIC&council=Melbourne
   ```

   - Expected: Returns regulations for Melbourne council (if exists)

4. **Test No Regulations**

   ```
   GET /api/short-stay-regulations?state=NT
   ```

   - Expected: Returns `{ success: true, regulation: null }`

---

## Test 5: Integration Testing

### End-to-End Flow

1. **Complete Calculation**
   - Fill all wizard steps
   - Generate report
   - Verify: All sections display correctly
   - Verify: No console errors

2. **Edit and Recalculate**
   - From Results: Click "Edit Calculation"
   - Change: Financial details (e.g., weekly rent)
   - Recalculate
   - Verify: Optimal use case updates

3. **Save Calculation** (if logged in)
   - Click: "Save Calculation"
   - Verify: Calculation saved
   - Reload: From dashboard
   - Verify: All data loads correctly

4. **PDF Generation**
   - Click: "Download PDF Report"
   - Verify: PDF generates
   - Verify: Optimal use case included (if applicable)

---

## Test 6: Edge Cases

1. **No Financial Details**
   - Skip: Financial Details step (if possible)
   - Verify: Optimal use case doesn't display (or shows message)

2. **Zero Weekly Rent**
   - Enter: $0 for weekly rent
   - Verify: Validation prevents proceeding

3. **Very High Property Value**
   - Enter: $20,000,000
   - Verify: Calculations handle correctly

4. **Different Property Types**
   - Test: New Dwelling, Established, Vacant Land, Commercial
   - Verify: Optimal use case adapts appropriately

---

## Expected Issues to Watch For

1. **Translation Keys**
   - Watch for: `FIRBCalculator.xxx.yyy` appearing instead of text
   - Fix: Add missing translation keys

2. **API Errors**
   - Watch for: Failed short-stay regulations lookup
   - Expected: Should gracefully handle (show null regulations)

3. **Calculation Errors**
   - Watch for: NaN or undefined in calculations
   - Fix: Add validation and default values

4. **Performance**
   - Watch for: Slow API calls
   - Expected: Regulations lookup should be fast (< 500ms)

---

## Success Criteria

✅ All 5 wizard steps work correctly  
✅ Financial Details step collects all inputs  
✅ Optimal Use Case Analysis displays in results  
✅ Short-stay regulations API works  
✅ Recommendations are logical and accurate  
✅ No console errors or translation key issues  
✅ All calculations are accurate

---

## Next Steps After Testing

1. Fix any bugs found
2. Add missing translation keys
3. Optimize performance if needed
4. Document any edge cases
5. Proceed to Phase 4 (if Phase 3 is complete)
