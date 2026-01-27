# Benchmarks Setup Verification Checklist

## ✅ Code Quality Checks

- [x] TypeScript compilation passes (`npm run type-check`)
- [x] No linter errors
- [x] All API routes created
- [x] All admin UI components created

## 📊 Database Verification

### Step 1: Run SQL Verification Script

Run the SQL verification script in Supabase SQL Editor:

```sql
-- File: docs/VERIFY_BENCHMARKS_SETUP.sql
```

Expected results:

- ✅ Both tables exist (`cost_benchmarks`, `macro_benchmarks`)
- ✅ Cost benchmarks: ~160 active records (8 states × 2 property types × 10 metrics)
- ✅ Macro benchmarks: 8 active records
- ✅ No duplicate active records
- ✅ All required indexes exist
- ✅ RLS policies are enabled

### Step 2: Quick Database Checks

Run these quick checks:

```sql
-- Quick count check
SELECT
  (SELECT COUNT(*) FROM cost_benchmarks WHERE is_active = true) as cost_benchmarks_count,
  (SELECT COUNT(*) FROM macro_benchmarks WHERE is_active = true) as macro_benchmarks_count;

-- Should return: cost_benchmarks_count >= 100, macro_benchmarks_count = 8
```

## 🌐 API Endpoint Testing

### Public Endpoints (No Auth Required)

#### 1. Cost Benchmarks API

```bash
# Get all active cost benchmarks
curl http://localhost:3000/api/cost-benchmarks

# Filter by state
curl http://localhost:3000/api/cost-benchmarks?state=NSW

# Filter by property type
curl http://localhost:3000/api/cost-benchmarks?property_type=newDwelling

# Filter by metric
curl http://localhost:3000/api/cost-benchmarks?metric=council_rate_percent

# Combined filters
curl "http://localhost:3000/api/cost-benchmarks?state=NSW&property_type=newDwelling&metric=council_rate_percent"
```

**Expected**: JSON response with `success: true` and `benchmarks` array

#### 2. Macro Benchmarks API

```bash
# Get all active macro benchmarks
curl http://localhost:3000/api/macro-benchmarks

# Filter by category
curl http://localhost:3000/api/macro-benchmarks?category=investment

# Filter by metric
curl http://localhost:3000/api/macro-benchmarks?metric=asx_total_return
```

**Expected**: JSON response with `success: true` and `benchmarks` array

### Admin Endpoints (Requires Admin Auth)

Test these via browser dev tools Network tab while logged in as admin:

#### 3. Admin Cost Benchmarks API

- `GET /api/admin/cost-benchmarks` - List all (including inactive)
- `POST /api/admin/cost-benchmarks` - Create new
- `PUT /api/admin/cost-benchmarks/[id]` - Update existing
- `DELETE /api/admin/cost-benchmarks/[id]` - Delete

#### 4. Admin Macro Benchmarks API

- `GET /api/admin/macro-benchmarks` - List all (including inactive)
- `POST /api/admin/macro-benchmarks` - Create new
- `PUT /api/admin/macro-benchmarks/[id]` - Update existing
- `DELETE /api/admin/macro-benchmarks/[id]` - Delete

## 🖥️ Admin UI Testing

### Access Admin Interface

1. Navigate to: `http://localhost:3000/en/admin/benchmarks` (or your locale)
2. Ensure you're logged in as an admin user

### Test Market Benchmarks Tab

- [ ] Tab loads without errors
- [ ] Existing benchmarks display correctly
- [ ] Can filter by state
- [ ] Can add new benchmark
- [ ] Can edit existing benchmark
- [ ] Can delete benchmark

### Test Cost Benchmarks Tab

- [ ] Tab loads without errors
- [ ] Table displays cost benchmarks
- [ ] Can filter by:
  - [ ] State
  - [ ] Property Type
  - [ ] Metric
  - [ ] Active Only checkbox
- [ ] Can add new cost benchmark
  - [ ] Form validates required fields
  - [ ] Can select state, property type, metric
  - [ ] Can enter value and unit
  - [ ] Save button works
- [ ] Can edit existing cost benchmark
  - [ ] Edit dialog opens with current values
  - [ ] Changes save correctly
- [ ] Can delete cost benchmark
  - [ ] Delete confirmation dialog appears
  - [ ] Deletion works

### Test Macro Benchmarks Tab

- [ ] Tab loads without errors
- [ ] Table displays macro benchmarks
- [ ] Can filter by:
  - [ ] Category
  - [ ] Metric
  - [ ] Active Only checkbox
- [ ] Can add new macro benchmark
  - [ ] Form validates required fields
  - [ ] Category selection updates available metrics
  - [ ] Can enter value and unit
  - [ ] Can set refresh cadence
  - [ ] Save button works
- [ ] Can edit existing macro benchmark
- [ ] Can delete macro benchmark

## 🔍 Functional Testing

### Test Data Integrity

1. **Add a test cost benchmark**:
   - State: NSW
   - Property Type: newDwelling
   - Metric: council_rate_percent
   - Value: 0.35
   - Unit: percent_of_value
   - Save

2. **Verify it appears in the table**

3. **Edit the value** to 0.40 and save

4. **Verify the change persists** after page refresh

5. **Delete the test record**

6. **Verify it's removed** from the table

### Test Filtering

1. Filter cost benchmarks by state (e.g., NSW)
   - Should only show NSW records

2. Filter by property type (e.g., newDwelling)
   - Should only show newDwelling records

3. Filter by metric (e.g., council_rate_percent)
   - Should only show that metric

4. Combine filters
   - Should show records matching all filters

### Test Error Handling

1. **Try to access admin endpoints without auth**
   - Should return 403 Forbidden

2. **Try to add duplicate active benchmark**
   - Should either update existing or show error

3. **Try to submit form with missing required fields**
   - Should show validation errors

## 📝 Expected Results Summary

### Database

- ✅ `cost_benchmarks` table exists with ~160 active records
- ✅ `macro_benchmarks` table exists with 8 active records
- ✅ No duplicate active records
- ✅ All indexes created
- ✅ RLS policies enabled

### API Endpoints

- ✅ Public GET endpoints return data
- ✅ Admin CRUD endpoints work (with auth)
- ✅ Filtering works correctly
- ✅ Error handling works

### Admin UI

- ✅ All three tabs load
- ✅ Tables display data
- ✅ Filters work
- ✅ Add/Edit/Delete operations work
- ✅ Forms validate correctly

## 🐛 Troubleshooting

### Issue: Tables don't exist

**Solution**: Run the create table migrations first

### Issue: No data in tables

**Solution**: Run the seed migrations

### Issue: API returns 403

**Solution**: Ensure user has admin role in `user_profiles` table

### Issue: UI shows "Failed to load"

**Solution**:

- Check browser console for errors
- Verify database connection
- Check that migrations ran successfully

### Issue: Can't save benchmarks

**Solution**:

- Check RLS policies allow admin writes
- Verify database connection
- Check browser console for specific errors

## ✅ Completion Checklist

- [ ] Database tables created
- [ ] Seed data loaded
- [ ] SQL verification script passes
- [ ] Public API endpoints work
- [ ] Admin API endpoints work (with auth)
- [ ] Admin UI loads all three tabs
- [ ] Can view benchmarks in tables
- [ ] Can filter benchmarks
- [ ] Can add new benchmarks
- [ ] Can edit existing benchmarks
- [ ] Can delete benchmarks
- [ ] Data persists after page refresh
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] No linter errors

## 🎉 Success Criteria

All of the following should be true:

1. ✅ Database has data (verified via SQL)
2. ✅ API endpoints return correct data
3. ✅ Admin UI is fully functional
4. ✅ All CRUD operations work
5. ✅ No errors in console or logs

If all checks pass, the benchmarks system is fully set up and ready to use! 🚀











