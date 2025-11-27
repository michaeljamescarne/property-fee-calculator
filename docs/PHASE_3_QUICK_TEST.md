# Phase 3: Quick Testing Checklist

## 🚀 Quick Start Testing

### Step 1: Basic Wizard Flow (5 minutes)

1. **Open Calculator**

   ```
   http://localhost:3002/en/firb-calculator
   ```

2. **Complete All Steps**
   - ✅ Step 1: Select "Australian Citizen" → Check "Ordinarily Resident" → Next
   - ✅ Step 2: Select "New Dwelling" → Enter $1,500,000 → Select "Victoria" → Next
   - ✅ Step 3: Verify weekly rent auto-filled → Adjust if needed → Next
   - ✅ Step 4: Review → Click "Generate Report"
   - ✅ Step 5: Results page loads

### Step 2: Financial Details Step (2 minutes)

1. **Go back to Step 3**
   - Verify: Weekly rent is pre-filled (should be ~$1,154/week for VIC)
   - Verify: Capital growth slider at 6%
   - Verify: Loan details section appears
   - Adjust: Interest rate slider
   - Toggle: Self-managed checkbox
   - Click: Next

### Step 3: Optimal Use Case Analysis (3 minutes)

1. **In Results Page**
   - Scroll down to "Investment Analysis" section
   - Click: "Show Investment Analysis"
   - Scroll to bottom
   - Look for: "Optimal Use Case Analysis" section

2. **Verify Display**
   - ✅ Two cards: "Long-Term Rental" and "Short-Stay Accommodation"
   - ✅ Recommendation alert at top
   - ✅ Income/expense breakdowns
   - ✅ Comparison summary with differences

### Step 4: Check Console (1 minute)

1. **Open Browser DevTools** (F12)
2. **Check Console Tab**
   - ✅ No red errors
   - ⚠️ Warnings are OK (but note them)
   - ✅ Check Network tab for API calls

### Step 5: Test API (Optional - 2 minutes)

1. **Test Regulations API**

   ```
   http://localhost:3002/api/short-stay-regulations?state=VIC
   ```

   - Expected: `{ "success": true, "regulation": null }` (if no data in DB)
   - Or: Returns regulation object if data exists

---

## ✅ Success Indicators

- [ ] All 5 steps complete without errors
- [ ] Financial Details step shows all inputs
- [ ] Optimal Use Case section appears in results
- [ ] No console errors
- [ ] All text displays (no translation keys)

## ⚠️ Common Issues

1. **Translation keys showing**: Add missing keys to `messages/en.json`
2. **API errors**: Check `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
3. **Optimal Use Case not showing**: Check that weekly rent is entered
4. **Regulations API fails**: Check database table exists

---

## 📝 Report Issues

If you find issues, note:

- Which step failed
- Error message (if any)
- Browser console errors
- Screenshot (if helpful)
