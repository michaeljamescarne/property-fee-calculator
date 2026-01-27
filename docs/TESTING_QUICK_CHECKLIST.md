# Quick Testing Checklist - Phase 3

## 🚀 10-Minute Quick Test

### ✅ Test 1: Basic Flow (2 min)

1. Go to `/en/firb-calculator`
2. Complete all 5 steps:
   - Citizenship: Australian Citizen ✓ Ordinarily Resident → Next
   - Property: New Dwelling, $1,500,000, VIC, 20% → Next
   - Financial: Verify rent ($1,154/week), adjust if needed → Next
   - Review: Check all details → Generate Report
   - Results: Verify all sections appear

**Pass Criteria:** All steps complete, no errors

---

### ✅ Test 2: Financial Details (2 min)

1. Go back to Step 3
2. Verify:
   - Weekly rent auto-filled
   - Capital growth slider works
   - Loan details appear (if deposit < 100%)
   - Council rates input works
   - Self-managed toggle works

**Pass Criteria:** All inputs work, values update correctly

---

### ✅ Test 3: Optimal Use Case (3 min)

1. In Results page
2. Click "Show Investment Analysis"
3. Scroll to "Optimal Use Case Analysis"
4. Verify:
   - Two cards display (Long-Term & Short-Stay)
   - Annual expenses show numbers (not NaN)
   - Net income calculated correctly
   - Recommendation displays
   - Comparison summary shows differences

**Pass Criteria:** All values display correctly, calculations accurate

---

### ✅ Test 4: Edit Functionality (2 min)

1. From Results: Click "Edit Calculation"
2. Change: Weekly rent to $1,500
3. Recalculate
4. Verify: Optimal use case updates with new values

**Pass Criteria:** Edit works, recalculations update correctly

---

### ✅ Test 5: Console Check (1 min)

1. Open Browser DevTools (F12)
2. Check Console tab
3. Verify: No red errors

**Pass Criteria:** No console errors

---

## 🐛 Common Issues to Watch For

1. **NaN Values** → Check calculation logic
2. **Translation Keys** → Add missing keys
3. **API Errors** → Check network tab, verify API works
4. **Missing Sections** → Check component rendering
5. **Calculation Errors** → Verify formulas

---

## 📝 Report Format

**Test Date:** **\*\***\_\_\_**\*\***  
**Tester:** **\*\***\_\_\_**\*\***

**Results:**

- [ ] Test 1: Pass / Fail
- [ ] Test 2: Pass / Fail
- [ ] Test 3: Pass / Fail
- [ ] Test 4: Pass / Fail
- [ ] Test 5: Pass / Fail

**Issues Found:**

1.
2.
3.

**Overall Status:** ☐ Ready for Phase 4 ☐ Needs Fixes











