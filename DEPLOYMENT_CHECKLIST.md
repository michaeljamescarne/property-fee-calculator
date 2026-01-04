# Deployment Checklist: Property Classification and Bedrooms Benchmarks

## ✅ Pre-Deployment

- [x] All code changes committed
- [x] Branch pushed to remote
- [x] PR description created (`PR_PROPERTY_CLASSIFICATION_BEDROOMS.md`)

## 🔄 Create Pull Request

1. Visit: https://github.com/michaeljamescarne/property-fee-calculator/pull/new/feature/property-classification-bedrooms-benchmarks

2. **Title**: `feat: Add property classification and bedrooms to benchmarks`

3. **Description**: Copy content from `PR_PROPERTY_CLASSIFICATION_BEDROOMS.md`

4. **Base branch**: `feature/nextjs-16-upgrade` (or `main` if that's your production branch)

5. **Reviewers**: Add yourself or team members

6. **Labels**: Add `enhancement`, `database`, `ui` labels if available

## 🗄️ Database Migrations (REQUIRED)

**⚠️ IMPORTANT: Run these migrations BEFORE merging to production**

### Migration 1: Cost Benchmarks
```sql
-- File: supabase/migrations/20250119_add_property_classification_to_cost_benchmarks.sql
```

### Migration 2: FIRB Calculations
```sql
-- File: supabase/migrations/20250119_add_property_classification_to_firb_calculations.sql
```

### How to Run Migrations

**Option 1: Via Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file content
4. Run each migration separately
5. Verify columns were added:
   ```sql
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'cost_benchmarks' 
   AND column_name IN ('property_classification', 'bedrooms');
   ```

**Option 2: Via Supabase CLI**
```bash
supabase db push
```

**Option 3: Via Migration Script**
If you have a migration runner, ensure these files are in your migrations folder and run your migration process.

## 🧪 Pre-Merge Testing

Before merging the PR, test:

- [ ] Property classification selection works (Unit/House)
- [ ] Bedrooms selection works (Studio, 1-5+)
- [ ] Fields only show for "established" property type
- [ ] Validation requires fields for established properties
- [ ] Benchmark API filtering works correctly
- [ ] Admin interface can create/edit benchmarks with new fields
- [ ] No console errors
- [ ] Build passes: `npm run build`

## 🚀 Post-Merge Deployment

### 1. Merge PR
- Merge the pull request into your base branch
- Delete the feature branch after merge (optional)

### 2. Deploy to Production
- Your CI/CD pipeline should automatically deploy
- Or manually deploy if needed:
  ```bash
  git checkout main  # or your production branch
  git pull origin main
  npm install
  npm run build
  # Deploy to your hosting platform
  ```

### 3. Verify Database Migrations
- Confirm migrations ran successfully in production
- Check that columns exist in production database

### 4. Test in Production
- [ ] Visit calculator in production
- [ ] Select "Established Dwelling"
- [ ] Verify classification and bedrooms fields appear
- [ ] Test selection and form submission
- [ ] Check admin interface works

## 📊 Post-Deployment Tasks

### Populate Benchmarks (Optional but Recommended)

After deployment, you'll want to populate benchmarks with specific classification/bedrooms data:

1. **Via Admin Interface**
   - Navigate to admin benchmarks section
   - Create benchmarks for specific combinations (e.g., NSW + Established + Unit + 2 bedrooms)

2. **Via SQL (Bulk Import)**
   - Prepare SQL INSERT statements for bulk data
   - Example structure:
     ```sql
     INSERT INTO cost_benchmarks 
     (state, property_type, property_classification, bedrooms, metric, value, is_active)
     VALUES 
     ('NSW', 'established', 'unit', 2, 'legal_fees', 1500, true),
     ('NSW', 'established', 'house', 3, 'legal_fees', 2000, true);
     ```

### Monitor
- Check error logs for any issues
- Monitor user feedback
- Verify calculations are using correct benchmarks

## 🔄 Rollback Plan (If Needed)

If issues occur:

1. **Revert Code**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

2. **Database Rollback** (if needed)
   ```sql
   -- Remove columns (only if necessary)
   ALTER TABLE cost_benchmarks 
   DROP COLUMN IF EXISTS property_classification,
   DROP COLUMN IF EXISTS bedrooms;
   
   ALTER TABLE firb_calculations 
   DROP COLUMN IF EXISTS property_classification,
   DROP COLUMN IF EXISTS bedrooms;
   ```

   **Note**: This will lose any data in these columns. Only do this if absolutely necessary.

## 📝 Notes

- Fields are nullable, so existing benchmarks continue to work
- System falls back to general benchmarks if specific ones aren't found
- No breaking changes - fully backward compatible
- Admin interface supports both specific and general benchmarks

---

**Branch**: `feature/property-classification-bedrooms-benchmarks`  
**PR URL**: https://github.com/michaeljamescarne/property-fee-calculator/pull/new/feature/property-classification-bedrooms-benchmarks  
**Status**: Ready for PR creation and review










