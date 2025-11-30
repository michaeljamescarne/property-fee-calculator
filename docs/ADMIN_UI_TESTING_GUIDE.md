# Admin UI Testing Guide - Step by Step

## Prerequisites

- ✅ Server running on `http://localhost:3001`
- ✅ Database migrations completed
- ✅ Seed data loaded
- ✅ Logged in as admin user

## Step 3: Admin UI Testing

### 3.1 Access Admin Benchmarks Page

1. Navigate to: `http://localhost:3001/en/admin/benchmarks` (or your locale)
2. You should see:
   - Page title: "Benchmark Data Management"
   - Description text
   - Three tabs: "Market Benchmarks", "Cost Benchmarks", "Macro Benchmarks"

**Expected Result**: Page loads without errors, all three tabs visible

---

### 3.2 Test Market Benchmarks Tab (Existing Functionality)

1. Click on "Market Benchmarks" tab (should be selected by default)
2. Verify:
   - [ ] Table displays existing benchmark data
   - [ ] Can see columns: State, Suburb, Postcode, Gross Rental Yield, etc.
   - [ ] Filter by State dropdown works
   - [ ] "Active Only" checkbox works
   - [ ] "Add New" button is visible
   - [ ] Can click "Add New" and form opens
   - [ ] Can edit existing benchmarks (pencil icon)
   - [ ] Can delete benchmarks (trash icon)

**Expected Result**: All existing functionality still works

---

### 3.3 Test Cost Benchmarks Tab

1. Click on "Cost Benchmarks" tab
2. **Initial Load Check**:
   - [ ] Tab switches smoothly
   - [ ] Table loads (may show many rows if seeded)
   - [ ] No console errors
   - [ ] Loading spinner appears briefly, then data loads

3. **Table Display Check**:
   - [ ] Columns visible: State, Property Type, Metric, Value, Unit, Data Source, Last Updated, Status, Actions
   - [ ] Data is formatted correctly
   - [ ] Active/Inactive badges show correctly

4. **Filtering Tests**:
   - [ ] **Filter by State**: Select "NSW" from dropdown
     - Should only show NSW records
   - [ ] **Filter by Property Type**: Select "newDwelling"
     - Should only show newDwelling records
   - [ ] **Filter by Metric**: Select "council_rate_percent"
     - Should only show that metric
   - [ ] **Active Only**: Check the checkbox
     - Should hide inactive records
   - [ ] **Combined Filters**: Try multiple filters together
     - Should show records matching all filters

5. **Add New Cost Benchmark**:
   - [ ] Click "Add New" button
   - [ ] Dialog opens with form
   - [ ] Fill in form:
     - State: Select "NSW"
     - Property Type: Select "newDwelling"
     - Metric: Select "council_rate_percent"
     - Value: Enter `0.35`
     - Unit: Select "percent_of_value"
     - Data Source: Enter "Test Data"
     - Notes: Enter "Test benchmark"
     - Active: Checked
   - [ ] Click "Save"
   - [ ] Dialog closes
   - [ ] New record appears in table
   - [ ] Verify the new record has correct values

6. **Edit Cost Benchmark**:
   - [ ] Find a record in the table
   - [ ] Click the edit icon (pencil)
   - [ ] Dialog opens with current values pre-filled
   - [ ] Change the value (e.g., from 0.30 to 0.35)
   - [ ] Click "Save"
   - [ ] Dialog closes
   - [ ] Table updates with new value
   - [ ] Refresh page and verify change persists

7. **Delete Cost Benchmark**:
   - [ ] Find a test record (or one you just created)
   - [ ] Click the delete icon (trash)
   - [ ] Confirmation dialog appears
   - [ ] Click "Delete" in dialog
   - [ ] Record is removed from table
   - [ ] Refresh page and verify record is gone

**Expected Result**: All CRUD operations work correctly

---

### 3.4 Test Macro Benchmarks Tab

1. Click on "Macro Benchmarks" tab
2. **Initial Load Check**:
   - [ ] Tab switches smoothly
   - [ ] Table loads (should show 8 records if seeded)
   - [ ] No console errors

3. **Table Display Check**:
   - [ ] Columns visible: Category, Metric, Value, Unit, Data Source, Refresh Cadence, Last Updated, Status, Actions
   - [ ] Data is formatted correctly
   - [ ] Should see records for:
     - Investment: asx_total_return, term_deposit_rate, bond_rate, savings_rate
     - Tax: cgt_withholding, default_marginal_tax_rate
     - Financing: default_interest_rate, inflation_rate

4. **Filtering Tests**:
   - [ ] **Filter by Category**: Select "investment"
     - Should only show investment benchmarks
   - [ ] **Filter by Metric**: Select "asx_total_return"
     - Should only show that metric
   - [ ] **Active Only**: Check the checkbox
     - Should hide inactive records

5. **Add New Macro Benchmark**:
   - [ ] Click "Add New" button
   - [ ] Dialog opens with form
   - [ ] Fill in form:
     - Category: Select "investment"
     - Metric: Select "asx_total_return" (or another)
     - Value: Enter `7.50`
     - Unit: Select "percent"
     - Data Source: Enter "Test Data"
     - Refresh Cadence: Select "quarterly"
     - Notes: Enter "Test macro benchmark"
     - Active: Checked
   - [ ] Click "Save"
   - [ ] Dialog closes
   - [ ] New record appears in table (or existing one updates if metric exists)

6. **Edit Macro Benchmark**:
   - [ ] Find a record in the table
   - [ ] Click the edit icon (pencil)
   - [ ] Dialog opens with current values
   - [ ] Change the value
   - [ ] Click "Save"
   - [ ] Table updates
   - [ ] Refresh page and verify change persists

7. **Delete Macro Benchmark**:
   - [ ] Find a test record
   - [ ] Click the delete icon (trash)
   - [ ] Confirm deletion
   - [ ] Record is removed
   - [ ] Refresh page and verify

**Expected Result**: All CRUD operations work correctly

---

### 3.5 Test Error Handling

1. **Form Validation**:
   - [ ] Try to save with missing required fields
     - Should show validation errors or prevent submission
   - [ ] Try to enter invalid values (e.g., negative numbers where not allowed)
     - Should validate input

2. **Network Errors** (simulate):
   - [ ] Disconnect from internet temporarily
   - [ ] Try to save a benchmark
     - Should show appropriate error message

3. **Unauthorized Access**:
   - [ ] If possible, test with non-admin user
     - Should redirect or show 403 error

---

### 3.6 Browser Console Check

1. Open browser DevTools (F12 or Cmd+Option+I)
2. Go to Console tab
3. Navigate through all three tabs
4. Check for:
   - [ ] No red errors
   - [ ] No warnings (yellow messages are usually OK)
   - [ ] API calls are successful (check Network tab)

**Expected Result**: No console errors

---

### 3.7 Network Tab Verification

1. Open browser DevTools → Network tab
2. Navigate to admin benchmarks page
3. Check API calls:
   - [ ] `GET /api/admin/cost-benchmarks` - Status 200
   - [ ] `GET /api/admin/macro-benchmarks` - Status 200
   - [ ] `GET /api/admin/benchmarks` - Status 200 (for market benchmarks)
4. When adding/editing:
   - [ ] `POST /api/admin/cost-benchmarks` - Status 200
   - [ ] `PUT /api/admin/cost-benchmarks/[id]` - Status 200
   - [ ] `DELETE /api/admin/cost-benchmarks/[id]` - Status 200

**Expected Result**: All API calls return 200 status

---

### 3.8 Data Persistence Test

1. Add a new benchmark
2. Refresh the page
3. Verify:
   - [ ] Benchmark still exists
   - [ ] Values are correct
4. Edit a benchmark
5. Refresh the page
6. Verify:
   - [ ] Changes persisted
7. Delete a benchmark
8. Refresh the page
9. Verify:
   - [ ] Benchmark is gone

**Expected Result**: All changes persist after refresh

---

## Common Issues & Solutions

### Issue: Tabs not switching

**Solution**: Check browser console for errors, verify tabs component is imported correctly

### Issue: Table shows "No benchmarks found"

**Solution**:

- Check if seed data was loaded
- Verify database connection
- Check browser console for API errors

### Issue: Can't save benchmarks

**Solution**:

- Check browser console for errors
- Verify you're logged in as admin
- Check Network tab for API response errors
- Verify RLS policies allow admin writes

### Issue: Filters not working

**Solution**:

- Check browser console for JavaScript errors
- Verify API calls are being made with correct parameters
- Check Network tab to see if filters are passed correctly

---

## Success Criteria

✅ All three tabs load without errors  
✅ Tables display data correctly  
✅ Filters work as expected  
✅ Can add new benchmarks  
✅ Can edit existing benchmarks  
✅ Can delete benchmarks  
✅ Data persists after page refresh  
✅ No console errors  
✅ API calls return 200 status  
✅ Forms validate correctly

If all checks pass, the admin UI is fully functional! 🎉
