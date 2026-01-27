# Pull Request: Property Classification and Bedrooms Benchmarks

## 🎯 Summary

This PR adds property classification (Unit/House) and bedrooms fields to the property wizard, enabling cost benchmarks to be scoped by both unit/house classification and number of bedrooms. These fields are conditionally required - only shown and required when property type is "established".

---

## 📦 What's Included

### 1. Database Schema Updates ✅

- Added `property_classification` column (unit/house) to `cost_benchmarks` table
- Added `bedrooms` column (0-5, where 0 = Studio) to `cost_benchmarks` table
- Added same columns to `firb_calculations` table for saved calculations
- Updated unique constraints to support multiple benchmarks per state/property_type/metric combination
- Maintains backward compatibility (fields are nullable)

### 2. UI Components ✅

- Added property classification selection (Unit/House) in PropertyDetailsStep
- Added bedrooms selection (Studio, 1, 2, 3, 4, 5+) in PropertyDetailsStep
- Fields only appear when property type is "established"
- Fields are required when property type is "established"
- Updated both calculator pages (`firb-calculator` and `calculator`)

### 3. Backend & API Updates ✅

- Updated cost-benchmarks API to accept and filter by `property_classification` and `bedrooms`
- Updated helper functions with intelligent fallback logic (tries specific benchmarks first, falls back to general)
- Updated calculation functions to pass new fields through
- Updated FIRB calculate API route to handle new fields
- Updated admin API routes to support creating/editing benchmarks with new fields

### 4. Admin Interface ✅

- Added property classification and bedrooms fields to admin form
- Added columns to benchmarks table display
- Fields only show when property type is "established"
- Supports creating benchmarks for specific unit/house and bedroom combinations

### 5. Translations ✅

- Added English translations for all new fields
- Added Chinese translations for all new fields

---

## 📁 Files Changed

### New Files (2)

- `supabase/migrations/20250119_add_property_classification_to_cost_benchmarks.sql` - Database migration
- `supabase/migrations/20250119_add_property_classification_to_firb_calculations.sql` - Database migration

### Modified Files (15)

- `lib/firb/constants.ts` - Added PropertyClassification and Bedrooms types
- `lib/validations/firb.ts` - Added conditional validation for new fields
- `types/database.ts` - Added new fields to interfaces
- `components/firb/PropertyDetailsStep.tsx` - Added UI for classification and bedrooms
- `app/[locale]/firb-calculator/page.tsx` - Added state management and callbacks
- `app/[locale]/calculator/page.tsx` - Added state management and callbacks
- `app/api/cost-benchmarks/route.ts` - Added query parameter filtering
- `lib/benchmarks/cost-benchmarks.ts` - Updated helper functions with fallback logic
- `lib/firb/calculations.ts` - Updated to pass new fields
- `app/api/firb-calculate/route.ts` - Updated to handle new fields
- `messages/en.json` - Added translations
- `messages/zh.json` - Added translations
- `components/admin/CostBenchmarksAdminClient.tsx` - Added admin form fields
- `app/api/admin/cost-benchmarks/route.ts` - Updated to handle new fields
- `app/api/admin/cost-benchmarks/[id]/route.ts` - Updated PUT handler

---

## ✨ Key Features

### Conditional Fields

- Property classification and bedrooms fields only appear when property type is "established"
- Fields are required only when property type is "established"
- Automatically cleared when property type changes away from "established"

### Intelligent Benchmark Lookup

- System tries to find specific benchmark (state + property_type + classification + bedrooms)
- Falls back to general benchmark (without classification/bedrooms) if specific one not found
- Maintains backward compatibility with existing benchmarks

### Admin Interface

- Admins can create benchmarks for specific unit/house and bedroom combinations
- Supports both specific and general benchmarks
- Table displays classification and bedrooms columns

---

## 🧪 Testing Instructions

### Test Property Classification Selection

1. Navigate to FIRB Calculator
2. Select "Established Dwelling" as property type
3. Verify "Property Classification" section appears
4. Click "Unit" - should select and show blue border
5. Click "House" - should select and show blue border
6. Verify selection persists when navigating between steps

### Test Bedrooms Selection

1. With "Established Dwelling" selected
2. Verify "Number of Bedrooms" dropdown appears
3. Select "Studio" - should update
4. Select "2 Bedrooms" - should update
5. Verify selection persists

### Test Conditional Behavior

1. Select "New Dwelling" - classification and bedrooms should disappear
2. Select "Established Dwelling" - fields should reappear
3. Verify fields are required (validation error if not selected)

### Test Benchmark Filtering

1. Select established property, NSW, Unit, 2 bedrooms
2. Check network tab - API call should include `property_classification=unit&bedrooms=2`
3. Verify calculations use appropriate benchmarks

### Test Admin Interface

1. Navigate to admin benchmarks section
2. Click "Add New"
3. Select "Established" property type
4. Verify classification and bedrooms fields appear
5. Create a benchmark with specific classification and bedrooms
6. Verify it appears in the table with correct values

---

## 🔍 Code Review Focus Areas

### Database Migrations

- Fields are nullable for backward compatibility
- Unique constraint updated to include new fields
- Indexes updated for efficient lookups

### Validation Logic

- Conditional validation only requires fields for "established" properties
- Uses Zod refine for conditional requirements

### Fallback Logic

- Benchmark lookup tries specific first, then general
- Maintains backward compatibility

### UI/UX

- Fields only show when relevant
- Clear visual feedback when selected
- Consistent with existing property type selection pattern

---

## 🚀 Deployment Impact

### Database Changes

- ⚠️ **Requires running migrations** before deployment:
  - `20250119_add_property_classification_to_cost_benchmarks.sql`
  - `20250119_add_property_classification_to_firb_calculations.sql`

### Breaking Changes

- ✅ None - fully backwards compatible
- ✅ Existing benchmarks continue to work
- ✅ New fields are optional (nullable)

### Environment Variables

- ✅ None required

---

## 📝 Checklist

- [x] Database migrations created and tested
- [x] Type definitions updated
- [x] Validation schemas updated
- [x] UI components updated (both calculator pages)
- [x] API routes updated
- [x] Helper functions updated with fallback logic
- [x] Calculation functions updated
- [x] Translations added (EN + ZH)
- [x] Admin interface updated
- [x] No linter errors
- [x] Backward compatibility maintained
- [x] Ready for production

---

## 🔗 Related Documentation

- Implementation plan: `unit-house-and-bedrooms-benchmarks.plan.md`

---

## 🎬 Next Steps After Merge

1. Run database migrations in production
2. Use admin interface to populate benchmarks with classification/bedrooms data
3. Or prepare SQL INSERT statements for bulk data import
4. Test with real data to verify benchmark accuracy

---

## 💬 Questions?

See the implementation plan or comment on this PR!

---

## ✅ Approval Checklist for Reviewer

- [ ] Property classification selection works
- [ ] Bedrooms selection works
- [ ] Fields only show for established properties
- [ ] Validation works correctly
- [ ] Benchmark filtering works
- [ ] Admin interface supports new fields
- [ ] No console errors
- [ ] Build passes
- [ ] Database migrations ready
- [ ] Ready to merge

---

**Branch:** `feature/property-classification-bedrooms-benchmarks`  
**Base:** `feature/nextjs-16-upgrade` (or `main` if preferred)  
**Author:** AI Assistant (via Cursor)











