# Pre-Merge Checklist: Benchmark Integration

This guide provides detailed step-by-step instructions for verifying the benchmark integration before merging to production.

## Step 2: Pre-Merge Verification

### 2.1 Run Database Migrations

The migrations must be run in the exact order specified below. Each migration builds on the previous one.

#### Option A: Using Supabase Dashboard (Recommended for Production)

1. **Access Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project
   - Navigate to **SQL Editor** (left sidebar)

2. **Run Migration 1: Create Cost Benchmarks Table**
   - Click **"New Query"** button
   - Open the file: `supabase/migrations/20250118_create_cost_benchmarks.sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click **"Run"** or press `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)
   - ✅ Verify success message: "Success. No rows returned"
   - ⚠️ If you see errors, check:
     - Are you connected to the correct database?
     - Do the enum types already exist? (They might from previous migrations)

3. **Run Migration 2: Create Macro Benchmarks Table**
   - Click **"New Query"** again (or clear the editor)
   - Open: `supabase/migrations/20250118_create_macro_benchmarks.sql`
   - Copy and paste into SQL Editor
   - Click **"Run"**
   - ✅ Verify success message

4. **Run Migration 3: Seed Cost Benchmarks**
   - Click **"New Query"**
   - Open: `supabase/migrations/20250118_seed_cost_benchmarks.sql`
   - Copy and paste into SQL Editor
   - Click **"Run"**
   - ✅ Verify success message
   - ✅ Check row count: Should insert/update benchmarks for all states and property types

5. **Run Migration 4: Seed Macro Benchmarks**
   - Click **"New Query"**
   - Open: `supabase/migrations/20250118_seed_macro_benchmarks.sql`
   - Copy and paste into SQL Editor
   - Click **"Run"**
   - ✅ Verify success message
   - ✅ Check row count: Should insert/update macro benchmarks

#### Option B: Using Supabase CLI (For Development)

```bash
# Navigate to project directory
cd /Users/michaelcarne/Sites/aupropertyinvestment/property-fee-calculator

# Ensure Supabase CLI is installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project (if not already linked)
supabase link --project-ref your-project-ref

# Run all migrations
supabase db push

# Or run migrations individually
supabase migration up
```

#### Verification: Check Tables Exist

Run this SQL query in Supabase SQL Editor to verify:

```sql
-- Check cost_benchmarks table
SELECT
  COUNT(*) as total_records,
  COUNT(DISTINCT state) as states,
  COUNT(DISTINCT property_type) as property_types,
  COUNT(DISTINCT metric) as metrics
FROM cost_benchmarks
WHERE is_active = true;

-- Check macro_benchmarks table
SELECT
  COUNT(*) as total_records,
  COUNT(DISTINCT metric) as metrics
FROM macro_benchmarks
WHERE is_active = true;

-- Sample data check
SELECT state, property_type, metric, value_numeric, unit
FROM cost_benchmarks
WHERE is_active = true
ORDER BY state, property_type, metric
LIMIT 10;

SELECT category, metric, value_numeric, unit
FROM macro_benchmarks
WHERE is_active = true
ORDER BY category, metric;
```

**Expected Results:**

- `cost_benchmarks`: Should have records for all 8 states × 4 property types × multiple metrics
- `macro_benchmarks`: Should have records for all macro metrics (ASX, interest rates, tax rates, etc.)

---

### 2.2 Test Admin Interface

#### 2.2.1 Access Admin Page

1. **Start Development Server** (if not running)

   ```bash
   cd /Users/michaelcarne/Sites/aupropertyinvestment/property-fee-calculator
   npm run dev
   ```

2. **Navigate to Admin Benchmarks Page**
   - Open browser: `http://localhost:3000/en/admin/benchmarks`
   - Or production URL: `https://your-domain.com/en/admin/benchmarks`
   - ⚠️ You may need to be authenticated as admin

3. **Verify Page Loads**
   - ✅ Should see three tabs: "Market Benchmarks", "Cost Benchmarks", "Macro Benchmarks"
   - ✅ No console errors in browser DevTools

#### 2.2.2 Test Cost Benchmarks Tab

1. **Click "Cost Benchmarks" Tab**
   - ✅ Should see a table/list of cost benchmarks
   - ✅ Should see filters for State and Property Type

2. **Test Filtering**
   - Select a state (e.g., "NSW") from State filter
   - ✅ Should filter results to show only NSW benchmarks
   - Select a property type (e.g., "Established") from Property Type filter
   - ✅ Should further filter to NSW + Established
   - Clear filters
   - ✅ Should show all benchmarks again

3. **Test Adding New Benchmark**
   - Click **"Add New Benchmark"** or **"+"** button
   - Fill in the form:
     - State: Select "NSW"
     - Property Type: Select "Established"
     - Metric: Select "council_rate_percent"
     - Value: Enter `0.35` (for 0.35%)
     - Unit: Should auto-fill as "percent"
     - Data Source: Enter "Test"
     - Notes: Enter "Test benchmark"
   - Click **"Save"** or **"Create"**
   - ✅ Should see success message
   - ✅ New benchmark should appear in the list
   - ✅ Previous active benchmark for same (state, property_type, metric) should be deactivated

4. **Test Editing Benchmark**
   - Find a benchmark in the list
   - Click **"Edit"** button (pencil icon)
   - Change the value (e.g., change from 0.35 to 0.40)
   - Click **"Save"**
   - ✅ Should see success message
   - ✅ Updated value should appear in the list

5. **Test Deleting Benchmark**
   - Find a benchmark you just created (or a test one)
   - Click **"Delete"** button (trash icon)
   - Confirm deletion in the dialog
   - ✅ Should see success message
   - ✅ Benchmark should be removed from the list (or marked inactive)

#### 2.2.3 Test Macro Benchmarks Tab

1. **Click "Macro Benchmarks" Tab**
   - ✅ Should see a table/list of macro benchmarks
   - ✅ Should see filter for Category (Investment, Tax, Financing)

2. **Test Filtering**
   - Select a category (e.g., "Investment") from Category filter
   - ✅ Should filter results to show only Investment benchmarks
   - Clear filter
   - ✅ Should show all benchmarks again

3. **Test Adding New Macro Benchmark**
   - Click **"Add New Benchmark"** button
   - Fill in the form:
     - Category: Select "Investment"
     - Metric: Select "asx_total_return"
     - Value: Enter `7.5` (for 7.5%)
     - Unit: Should auto-fill as "percent"
     - Data Source: Enter "Test"
     - Refresh Cadence: Select "Monthly"
     - Notes: Enter "Test macro benchmark"
   - Click **"Save"**
   - ✅ Should see success message
   - ✅ New benchmark should appear in the list
   - ✅ Previous active benchmark for same metric should be deactivated

4. **Test Editing and Deleting** (same as Cost Benchmarks)

#### 2.2.4 Verify Error Handling

1. **Test Invalid Input**
   - Try to add a benchmark with missing required fields
   - ✅ Should see validation error messages
   - ✅ Should not allow saving

2. **Test Duplicate Active Benchmark**
   - Add a benchmark with same (state, property_type, metric) as existing active one
   - ✅ Should deactivate the old one and activate the new one
   - ✅ Should not create duplicate active records

---

### 2.3 Verify Calculator Uses Benchmarks

#### 2.3.1 Test Cost Calculations

1. **Open Calculator**
   - Navigate to: `http://localhost:3000/en/firb-calculator`
   - Or production URL

2. **Fill in Property Details**
   - Citizenship Status: Select "Foreign"
   - Property Type: Select "Established"
   - Property Value: Enter `1000000` (1 million)
   - State: Select "NSW"
   - Click **"Next"**

3. **Check Network Tab (Browser DevTools)**
   - Open DevTools (F12)
   - Go to **Network** tab
   - Filter by "cost-benchmarks" or "firb-calculate"
   - Complete the calculator steps
   - ✅ Should see API calls to `/api/cost-benchmarks` or `/api/firb-calculate`
   - ✅ Check response: Should include benchmark values

4. **Verify Calculations Use Benchmarks**
   - Complete calculator to see results
   - Check the **"Annual Ongoing Costs"** section:
     - **Council Rates**: Should use benchmark value (not hardcoded 0.3%)
     - **Insurance**: Should use benchmark value (not hardcoded 0.2%)
     - **Maintenance**: Should use benchmark value (not hardcoded 1% or 1.5%)
   - ✅ Values should match what's in the database for NSW + Established

#### 2.3.2 Test Investment Analytics

1. **Complete Calculator to Results Page**
   - Fill in all steps including Financial Details
   - Click **"Calculate"**

2. **Check Investment Analytics**
   - Scroll to **"Investment Analytics"** section
   - Check **"Investment Comparison"**:
     - **ASX Return**: Should use macro benchmark (not hardcoded 7.2%)
     - **Term Deposit**: Should use macro benchmark (not hardcoded 4.0%)
     - **Bond Rate**: Should use macro benchmark (not hardcoded 4.5%)
     - **Savings Rate**: Should use macro benchmark (not hardcoded 4.5%)

3. **Check Default Inputs**
   - Go back to **"Financial Details"** step
   - Check default values:
     - **Vacancy Rate**: Should use cost benchmark (not hardcoded 5%)
     - **Property Management Fee**: Should use cost benchmark (not hardcoded 8%)
     - **Interest Rate**: Should use macro benchmark (not hardcoded 6.5%)
     - **Marginal Tax Rate**: Should use macro benchmark (not hardcoded 37%)

#### 2.3.3 Test Fallback Behavior

1. **Temporarily Deactivate a Benchmark**
   - Go to Admin Benchmarks page
   - Edit a cost benchmark (e.g., council_rate_percent for NSW + Established)
   - Set `is_active = false` (or delete it)
   - Save

2. **Test Calculator Again**
   - Complete calculator with same inputs (NSW + Established)
   - ✅ Should still work (uses fallback default)
   - ✅ Check console: Should log fallback usage or use default value
   - ✅ Calculations should not break

3. **Reactivate Benchmark**
   - Go back to Admin and reactivate the benchmark
   - ✅ Calculator should use benchmark again

#### 2.3.4 Verify API Endpoints

Test the public API endpoints directly:

1. **Test Cost Benchmarks API**

   ```bash
   # Get all cost benchmarks for NSW + Established
   curl "http://localhost:3000/api/cost-benchmarks?state=NSW&property_type=established"

   # Or in browser:
   # http://localhost:3000/api/cost-benchmarks?state=NSW&property_type=established
   ```

   - ✅ Should return JSON with benchmarks array
   - ✅ Should only return `is_active = true` records
   - ✅ Should include `value_numeric`, `unit`, `metric`, etc.

2. **Test Macro Benchmarks API**

   ```bash
   # Get all macro benchmarks
   curl "http://localhost:3000/api/macro-benchmarks"

   # Or filter by category
   curl "http://localhost:3000/api/macro-benchmarks?category=investment"
   ```

   - ✅ Should return JSON with benchmarks array
   - ✅ Should only return `is_active = true` records

3. **Test FIRB Calculate API** (with benchmarks)

   ```bash
   curl -X POST "http://localhost:3000/api/firb-calculate" \
     -H "Content-Type: application/json" \
     -d '{
       "citizenshipStatus": "foreign",
       "propertyType": "established",
       "propertyValue": 1000000,
       "state": "NSW",
       "isFirstHome": false,
       "depositPercent": 20
     }'
   ```

   - ✅ Should return cost breakdown
   - ✅ Costs should reflect benchmark values (check council rates, insurance, maintenance)

---

### 2.4 Database Verification Script

Run the verification SQL script to check everything is set up correctly:

1. **Open SQL Editor in Supabase**
2. **Run Verification Script**
   - Open: `docs/VERIFY_BENCHMARKS_SETUP.sql`
   - Copy entire contents
   - Paste into SQL Editor
   - Click **"Run"**

3. **Check Results**
   - ✅ All checks should pass (no errors)
   - ✅ Should see counts for:
     - Cost benchmarks by state/property type
     - Macro benchmarks by category
     - Active vs inactive records
     - Indexes created
     - RLS policies enabled

---

### 2.5 Checklist Summary

Before merging, verify:

- [ ] All 4 migrations run successfully
- [ ] Tables exist and have data (`cost_benchmarks`, `macro_benchmarks`)
- [ ] Admin interface loads without errors
- [ ] Can add/edit/delete cost benchmarks
- [ ] Can add/edit/delete macro benchmarks
- [ ] Filters work correctly
- [ ] Calculator uses benchmark values (not hardcoded)
- [ ] Investment analytics use macro benchmarks
- [ ] Fallback behavior works when benchmarks missing
- [ ] API endpoints return correct data
- [ ] No console errors in browser
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)

---

## Troubleshooting

### Migration Errors

**Error: "relation already exists"**

- Table already exists from previous migration
- Solution: Either drop the table first, or skip this migration

**Error: "type already exists"**

- Enum types already exist
- Solution: This is fine, the migration will handle it

**Error: "constraint already exists"**

- Unique constraint already exists
- Solution: Drop the constraint first, or modify migration

### Admin Interface Not Loading

- Check browser console for errors
- Verify you're authenticated as admin
- Check API routes are accessible
- Verify database tables exist

### Calculator Not Using Benchmarks

- Check browser Network tab for API calls
- Verify API endpoints return data
- Check browser console for errors
- Verify benchmarks are active (`is_active = true`)
- Check fallback defaults are being used (this is OK if benchmarks missing)

---

## Next Steps After Verification

Once all checks pass:

1. ✅ Merge the PR to main branch
2. Deploy to production
3. Run migrations on production database
4. Verify production admin interface
5. Monitor for any issues









