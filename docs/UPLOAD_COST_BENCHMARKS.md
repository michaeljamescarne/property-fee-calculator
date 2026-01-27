# Upload Cost Benchmarks to Production

## Overview
This guide will help you upload the collected cost benchmark data to your production Supabase database.

## Data Summary
- **Total Records**: 88 (8 states × 11 metrics)
- **Property Type**: Established properties
- **States**: NSW, VIC, QLD, SA, WA, TAS, ACT, NT
- **Metrics**: 11 cost metrics per state

## Steps to Upload

### 1. Open Supabase SQL Editor
1. Go to your **production** Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**

### 2. Copy and Run the SQL
1. Open `docs/SEED_COST_BENCHMARKS.sql`
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press `Ctrl/Cmd + Enter`)

### 3. Verify the Upload
After running, you should see:
- **88 rows** in the verification query results
- All records with `is_active = true`
- All records with `property_type = 'established'`

### 4. Expected Results
The verification query should show:
- 8 states (NSW, VIC, QLD, SA, WA, TAS, ACT, NT)
- 11 metrics per state:
  - `council_rate_percent`
  - `insurance_percent`
  - `maintenance_percent`
  - `vacancy_rate_percent`
  - `management_fee_percent`
  - `letting_fee_weeks`
  - `rent_growth_percent`
  - `interest_rate_percent`
  - `selling_costs_percent`
  - `loan_cost_basis_points`
  - `strata_fee_percent`

## What the SQL Does

1. **Deactivates existing records**: Sets `is_active = false` for any existing active cost benchmarks for established properties
2. **Inserts new records**: Adds all 88 new cost benchmark records
3. **Verifies the upload**: Runs a SELECT query to confirm all records were inserted correctly

## Troubleshooting

### Error: "duplicate key value violates unique constraint"
- This means there are still active records that weren't deactivated
- Solution: The UPDATE statement should handle this, but if it persists, manually deactivate:
  ```sql
  UPDATE cost_benchmarks 
  SET is_active = false 
  WHERE property_type = 'established' AND is_active = true;
  ```
  Then re-run the INSERT statements

### Error: "invalid input value for enum"
- Check that state values match: 'NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'
- Check that property_type is 'established'
- Check that metric names match the enum values exactly

### No rows returned in verification
- Check that `is_active = true` in the INSERT statements
- Verify the WHERE clause in the verification query

## Next Steps

After successful upload:
1. ✅ Cost benchmarks are now available in production
2. ✅ The calculator can use these values for established properties
3. ✅ You can view/edit them in the admin benchmarks section

## Notes

- This upload is for **established properties only**
- If you need to add data for other property types (newDwelling, vacantLand, commercial), you'll need to collect and upload that data separately
- The data sources and notes are included in each record for reference












