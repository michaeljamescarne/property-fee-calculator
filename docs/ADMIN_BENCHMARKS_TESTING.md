# Admin Benchmarks Interface Testing Guide

## Prerequisites

1. **Database Migrations**: Ensure all migrations have been run:

   ```bash
   # Run migrations in Supabase or via your migration tool
   # Required migrations:
   # - 20250118_create_cost_benchmarks.sql
   # - 20250118_create_macro_benchmarks.sql
   # - 20250118_seed_cost_benchmarks.sql (optional - seeds initial data)
   # - 20250118_seed_macro_benchmarks.sql (optional - seeds initial data)
   ```

2. **Admin Access**: Ensure you have an admin user account in the `user_profiles` table with `role = 'admin'`

3. **Development Server**: Start the Next.js dev server:
   ```bash
   npm run dev
   ```

## Testing Steps

### 1. Access Admin Interface

Navigate to: `http://localhost:3000/[locale]/admin/benchmarks`

Replace `[locale]` with your locale (e.g., `en` or `zh`).

You should see:

- A page with three tabs: "Market Benchmarks", "Cost Benchmarks", "Macro Benchmarks"
- Each tab contains a full CRUD interface

### 2. Test Cost Benchmarks Tab

#### 2.1 View Existing Benchmarks

- Click on "Cost Benchmarks" tab
- Should display a table with existing cost benchmarks (if seeded)
- Test filters:
  - Filter by State (dropdown)
  - Filter by Property Type (dropdown)
  - Filter by Metric (dropdown)
  - Toggle "Active Only" checkbox

#### 2.2 Add New Cost Benchmark

1. Click "Add New" button
2. Fill in the form:
   - State: Select a state (e.g., NSW)
   - Property Type: Select (e.g., newDwelling)
   - Metric: Select (e.g., council_rate_percent)
   - Value: Enter a number (e.g., 0.30)
   - Unit: Select (e.g., percent_of_value)
   - Data Source: Optional (e.g., "Test Data")
   - Notes: Optional
   - Active: Checkbox (should be checked by default)
3. Click "Save"
4. Verify the new benchmark appears in the table

#### 2.3 Edit Existing Benchmark

1. Click the edit icon (pencil) on any benchmark row
2. Modify values (e.g., change the value_numeric)
3. Click "Save"
4. Verify changes are reflected in the table

#### 2.4 Delete Benchmark

1. Click the delete icon (trash) on any benchmark row
2. Confirm deletion in the alert dialog
3. Verify the benchmark is removed from the table

### 3. Test Macro Benchmarks Tab

#### 3.1 View Existing Benchmarks

- Click on "Macro Benchmarks" tab
- Should display a table with existing macro benchmarks (if seeded)
- Test filters:
  - Filter by Category (dropdown)
  - Filter by Metric (dropdown)
  - Toggle "Active Only" checkbox

#### 3.2 Add New Macro Benchmark

1. Click "Add New" button
2. Fill in the form:
   - Category: Select (e.g., investment)
   - Metric: Select (e.g., asx_total_return)
   - Value: Enter a number (e.g., 7.20)
   - Unit: Select (e.g., percent)
   - Data Source: Optional (e.g., "ASX")
   - Refresh Cadence: Optional (e.g., quarterly)
   - Notes: Optional
   - Active: Checkbox
3. Click "Save"
4. Verify the new benchmark appears in the table

#### 3.3 Edit/Delete Macro Benchmark

- Follow same steps as Cost Benchmarks (2.3 and 2.4)

### 4. Test Market Benchmarks Tab

- This is the existing functionality
- Verify it still works correctly with the new tabbed interface

### 5. Test API Endpoints Directly

#### 5.1 Public Cost Benchmarks API

```bash
# Get all active cost benchmarks
curl http://localhost:3000/api/cost-benchmarks

# Filter by state
curl http://localhost:3000/api/cost-benchmarks?state=NSW

# Filter by property type
curl http://localhost:3000/api/cost-benchmarks?property_type=newDwelling

# Filter by metric
curl http://localhost:3000/api/cost-benchmarks?metric=council_rate_percent
```

#### 5.2 Admin Cost Benchmarks API

```bash
# Requires authentication - test via browser dev tools Network tab
# GET /api/admin/cost-benchmarks
# POST /api/admin/cost-benchmarks
# PUT /api/admin/cost-benchmarks/[id]
# DELETE /api/admin/cost-benchmarks/[id]
```

#### 5.3 Public Macro Benchmarks API

```bash
# Get all active macro benchmarks
curl http://localhost:3000/api/macro-benchmarks

# Filter by category
curl http://localhost:3000/api/macro-benchmarks?category=investment

# Filter by metric
curl http://localhost:3000/api/macro-benchmarks?metric=asx_total_return
```

## Expected Behavior

### Success Cases

- ✅ All three tabs load without errors
- ✅ Tables display data correctly
- ✅ Filters work as expected
- ✅ Add/Edit/Delete operations succeed
- ✅ Form validation prevents invalid submissions
- ✅ Success messages appear after operations
- ✅ Data persists after page refresh

### Error Cases to Test

- ❌ Try to add duplicate benchmark (same state + property_type + metric)
  - Should show error or update existing
- ❌ Try to submit form with missing required fields
  - Should show validation errors
- ❌ Try to access admin endpoints without authentication
  - Should return 403 Forbidden

## Database Verification

After testing, verify data in Supabase:

```sql
-- Check cost benchmarks
SELECT state, property_type, metric, value_numeric, unit, is_active, last_updated
FROM cost_benchmarks
ORDER BY state, property_type, metric;

-- Check macro benchmarks
SELECT category, metric, value_numeric, unit, is_active, last_updated
FROM macro_benchmarks
ORDER BY category, metric;

-- Check for any inactive benchmarks
SELECT COUNT(*) as inactive_count
FROM cost_benchmarks
WHERE is_active = false;
```

## Troubleshooting

### Issue: Tabs not showing

- Check that `components/ui/tabs.tsx` exists
- Verify `@radix-ui/react-tabs` is installed

### Issue: API returns 403

- Verify user has admin role in `user_profiles` table
- Check authentication is working

### Issue: No data in tables

- Run seed migrations if not already done
- Check database connection
- Verify RLS policies allow reading

### Issue: Cannot save benchmarks

- Check database connection
- Verify RLS policies allow admin writes
- Check browser console for errors

## Next Steps

After successful testing:

1. Update calculator functions to use these benchmarks (see `update-calculator-usage` todo)
2. Add CSV import functionality for bulk updates
3. Add data validation rules
4. Add audit logging for changes











