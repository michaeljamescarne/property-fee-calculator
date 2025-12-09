# Phase 3: Comprehensive Testing Plan

## Testing Objectives

1. Verify all wizard steps work correctly
2. Test financial details calculations
3. Test optimal use case analysis with different scenarios
4. Test edge cases and error handling
5. Verify all translations display correctly
6. Test API endpoints
7. Verify data persistence (if applicable)

---

## Test Suite 1: Complete Wizard Flow

### Test 1.1: Basic Flow - Australian Citizen

**Steps:**

1. Navigate to `/en/firb-calculator`
2. Step 1: Select "Australian Citizen" → Check "Ordinarily Resident" → Next
3. Step 2: Select "New Dwelling" → Enter $1,500,000 → Select "Victoria" → 20% deposit → Next
4. Step 3: Verify weekly rent (~$1,154/week) → Adjust to $1,200 → Set growth to 7% → Next
5. Step 4: Review all details → Verify financial section appears → Generate Report
6. Step 5: Verify results display

**Expected Results:**

- ✅ All steps complete without errors
- ✅ Financial details show in Review step
- ✅ Results page loads with all sections
- ✅ Optimal Use Case section appears

---

### Test 1.2: Foreign Person Flow

**Steps:**

1. Step 1: Select "Foreign Person" → Next
2. Step 2: Select "Established Dwelling" → Enter $2,000,000 → Select "NSW" → 30% deposit → Next
3. Step 3: Enter weekly rent $2,000 → Set growth 5% → Next
4. Step 4: Review → Generate Report

**Expected Results:**

- ✅ FIRB required badge appears
- ✅ Foreign buyer surcharge calculated
- ✅ Optimal use case shows regulations (if available)

---

### Test 1.3: Temporary Resident Flow

**Steps:**

1. Step 1: Select "Temporary Resident" → Select visa type → Next
2. Step 2: Select "New Dwelling" → Enter $800,000 → Select "QLD" → Next
3. Step 3: Enter financial details → Next
4. Step 4: Review → Generate Report

**Expected Results:**

- ✅ FIRB required
- ✅ Restrictions displayed
- ✅ Calculations correct

---

## Test Suite 2: Financial Details Step

### Test 2.1: Auto-Population

**Test Cases:**

- [ ] NSW property → Verify weekly rent estimate (~3.2% yield)
- [ ] VIC property → Verify weekly rent estimate (~3.4% yield)
- [ ] QLD property → Verify weekly rent estimate (~4.5% yield)
- [ ] WA property → Verify weekly rent estimate (~4.2% yield)

**Expected:**

- Weekly rent auto-filled based on state
- Loan amount calculated from deposit

---

### Test 2.2: Input Validation

**Test Cases:**

- [ ] Enter $0 for weekly rent → Next button should be disabled
- [ ] Enter negative value → Should be prevented or handled
- [ ] Enter very high value ($100,000/week) → Should accept but show warning if needed
- [ ] Adjust capital growth slider → Value updates correctly
- [ ] Toggle self-managed → Management fee slider appears/disappears

---

### Test 2.3: Loan Details

**Test Cases:**

- [ ] 20% deposit → Loan section appears
- [ ] 100% deposit → Loan section does not appear
- [ ] Adjust interest rate slider → Value updates
- [ ] Change loan term → Value updates
- [ ] Toggle interest-only → Loan type changes

---

## Test Suite 3: Optimal Use Case Analysis

### Test 3.1: Basic Comparison

**Setup:**

- Property: $1,500,000 in VIC
- Weekly rent: $1,200
- Capital growth: 6%

**Expected:**

- Long-term rental: Shows annual income, expenses, net income
- Short-stay: Shows higher income, higher expenses
- Recommendation: Based on net income comparison
- Comparison summary: Shows differences

---

### Test 3.2: Short-Stay Prohibited

**Setup:**

- Property in area where short-stay is prohibited (if regulations exist)
- Or test with mock data

**Expected:**

- Short-stay card shows "Not Permitted" badge
- Recommendation: Long-term rental
- Reasoning: Mentions prohibition

---

### Test 3.3: Short-Stay with Regulations

**Setup:**

- Property in area with short-stay regulations
- Max days per year: 180
- Licensing required: Yes

**Expected:**

- Regulations displayed in short-stay card
- Compliance costs included in expenses
- Recommendation considers regulations

---

### Test 3.4: High Income Short-Stay

**Setup:**

- Property in tourist area (e.g., Gold Coast)
- High weekly rent potential
- Short-stay permitted

**Expected:**

- Short-stay shows significantly higher income
- Recommendation: Short-stay or mixed
- Reasoning: Mentions higher income potential

---

## Test Suite 4: Edge Cases

### Test 4.1: Very Low Property Value

**Setup:**

- Property value: $200,000
- Weekly rent: $200

**Expected:**

- All calculations work
- No division by zero errors
- Optimal use case displays correctly

---

### Test 4.2: Very High Property Value

**Setup:**

- Property value: $19,000,000 (near $20M limit)
- Weekly rent: $15,000

**Expected:**

- Calculations handle large numbers
- No overflow errors
- All displays format correctly

---

### Test 4.3: Zero Deposit

**Setup:**

- Deposit: 0%
- Loan: 100%

**Expected:**

- Loan details show full property value
- Calculations work correctly
- No errors

---

### Test 4.4: Different Property Types

**Test Each:**

- [ ] New Dwelling
- [ ] Established Dwelling
- [ ] Vacant Land
- [ ] Commercial Property

**Expected:**

- Each type calculates correctly
- Optimal use case adapts (e.g., vacant land might not show short-stay)

---

## Test Suite 5: API Endpoints

### Test 5.1: Short-Stay Regulations API

**Test Cases:**

```bash
# Test with state only
GET /api/short-stay-regulations?state=VIC
Expected: Returns regulations or null

# Test with postcode
GET /api/short-stay-regulations?state=NSW&postcode=2000
Expected: Returns regulations for Sydney CBD if exists

# Test with invalid state
GET /api/short-stay-regulations?state=XX
Expected: Returns null or error

# Test without state
GET /api/short-stay-regulations
Expected: Returns 400 error
```

---

### Test 5.2: FIRB Calculate API

**Test Cases:**

- [ ] Valid request → Returns eligibility and costs
- [ ] Invalid request → Returns 400 error
- [ ] Missing required fields → Returns validation error

---

## Test Suite 6: Translations

### Test 6.1: English

- [ ] All labels display (no translation keys)
- [ ] All tooltips display
- [ ] All error messages display

### Test 6.2: Chinese

- [ ] Switch to Chinese (`/zh/firb-calculator`)
- [ ] All labels display in Chinese
- [ ] All sections translate correctly

---

## Test Suite 7: Integration Testing

### Test 7.1: Edit and Recalculate

**Steps:**

1. Complete calculation
2. Click "Edit Calculation"
3. Change financial details (e.g., weekly rent)
4. Recalculate

**Expected:**

- Returns to Review step
- Can edit any step
- Recalculation updates all results
- Optimal use case updates

---

### Test 7.2: Save and Reload (if logged in)

**Steps:**

1. Complete calculation
2. Click "Save Calculation"
3. Go to Dashboard
4. Load saved calculation

**Expected:**

- Calculation saves successfully
- All data loads correctly
- Results display correctly
- Can edit and recalculate

---

## Test Suite 8: Performance

### Test 8.1: Calculation Speed

- [ ] Complete calculation should take < 2 seconds
- [ ] Optimal use case calculation < 500ms
- [ ] Regulations API call < 1 second

### Test 8.2: Page Load

- [ ] Initial page load < 3 seconds
- [ ] Step transitions are smooth
- [ ] No lag when typing in inputs

---

## Test Suite 9: Browser Compatibility

### Test 9.1: Desktop Browsers

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Test 9.2: Mobile Devices

- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad)

**Expected:**

- All features work
- Responsive design works
- Touch interactions work

---

## Test Suite 10: Error Handling

### Test 10.1: Network Errors

- [ ] Disconnect internet → Try calculation
- [ ] Expected: Error message displayed

### Test 10.2: Invalid Inputs

- [ ] Enter text in number fields
- [ ] Enter special characters
- [ ] Expected: Validation prevents or handles gracefully

### Test 10.3: API Failures

- [ ] Regulations API fails
- [ ] Expected: Optimal use case still works (with null regulations)

---

## Testing Checklist

### Quick Smoke Test (5 minutes)

- [ ] Complete one full calculation
- [ ] Verify all 5 steps work
- [ ] Verify results display
- [ ] Verify optimal use case appears
- [ ] Check console for errors

### Full Test Suite (30 minutes)

- [ ] Complete all test suites above
- [ ] Document any issues found
- [ ] Verify fixes work

---

## Issues Found

### Critical Issues

- [ ] List any critical issues here

### Minor Issues

- [ ] List any minor issues here

### Enhancements

- [ ] List any enhancement suggestions here

---

## Sign-Off

**Tester:** **\*\*\*\***\_**\*\*\*\***  
**Date:** **\*\*\*\***\_**\*\*\*\***  
**Status:** ☐ Pass ☐ Fail ☐ Needs Fixes



