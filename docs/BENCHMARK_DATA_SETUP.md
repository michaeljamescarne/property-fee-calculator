# Benchmark Data Setup Guide

## Overview

This guide explains how to populate the benchmark_data table with initial state-level rental yield and capital growth data for all Australian states and territories.

---

## Available Seed Data

### Files Provided

1. **SQL Seed File**: `supabase/migrations/20250117_seed_benchmark_data.sql`
   - Contains INSERT statements for all 8 states/territories
   - Can be run directly in Supabase SQL Editor
2. **CSV Seed File**: `supabase/migrations/20250117_seed_benchmark_data.csv`
   - Same data in CSV format
   - Can be imported via the admin interface

### Data Included

The seed data includes benchmark values for:

- ✅ **NSW** (New South Wales)
- ✅ **VIC** (Victoria)
- ✅ **QLD** (Queensland)
- ✅ **WA** (Western Australia)
- ✅ **SA** (South Australia)
- ✅ **TAS** (Tasmania)
- ✅ **ACT** (Australian Capital Territory)
- ✅ **NT** (Northern Territory)

Each state includes:

- Gross rental yield (%)
- Net rental yield (%)
- 5-year capital growth average (% per annum)
- 10-year capital growth average (% per annum)
- Data source information
- Quality scores and notes

---

## Method 1: Import via Admin Interface (Recommended)

### Steps

1. **Log in as Admin**
   - Navigate to `/en/admin/benchmarks` (or `/zh/admin/benchmarks`)
   - Ensure you're logged in with admin privileges

2. **Import CSV File**
   - Click the **"Import CSV"** button
   - Select the file: `supabase/migrations/20250117_seed_benchmark_data.csv`
   - Click **"Import"**
   - Review the import results

3. **Verify Data**
   - Check that all 8 states appear in the benchmarks table
   - Verify the data looks correct
   - Test by going to the calculator and entering property details for different states

### Advantages

- ✅ No direct database access needed
- ✅ Uses the same validation as manual entry
- ✅ Shows import results/errors
- ✅ Can be done by non-technical users

---

## Method 2: SQL Script Execution

### Steps

1. **Access Supabase SQL Editor**
   - Go to your Supabase dashboard
   - Navigate to **SQL Editor**
   - Click **"New Query"**

2. **Copy and Paste SQL**
   - Open `supabase/migrations/20250117_seed_benchmark_data.sql`
   - Copy the entire contents
   - Paste into the SQL Editor

3. **Run the Script**
   - Click **"Run"** or press `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)
   - Check for success message
   - Verify no errors occurred

4. **Verify Data**
   - Run a query to check:

   ```sql
   SELECT state, gross_rental_yield, capital_growth_5yr
   FROM benchmark_data
   WHERE suburb_name IS NULL
   ORDER BY state;
   ```

   - Should show 8 rows (one per state/territory)

### Advantages

- ✅ Fast execution
- ✅ Atomic operation
- ✅ Good for initial setup

---

## Data Source Information

### Source

- **Provider**: CoreLogic / Domain Research
- **Period**: 2024-2025 market data
- **Last Updated**: January 2025

### Data Quality Scores

- Most states: **8/10** (high quality, reliable sources)
- TAS, NT: **7/10** (good quality, slightly less comprehensive)

### Notes on Data

- All values are state-level averages
- Metro areas typically have lower yields but higher capital growth
- Regional areas typically have higher yields but lower capital growth
- Data is based on historical averages and current market conditions

---

## Adding Suburb-Level Data

After populating state-level data, you can add suburb-level benchmarks:

### Via Admin Interface

1. Navigate to `/admin/benchmarks`
2. Click **"Add New Benchmark"**
3. Fill in:
   - State (required)
   - Suburb name (optional but recommended)
   - Postcode (optional)
   - Rental yields
   - Capital growth rates
   - Data source and notes

### Via CSV Import

1. Create a CSV file with suburb data
2. Include columns: `state`, `suburb_name`, `postcode`, `gross_rental_yield`, etc.
3. Import via admin interface

### Example Suburb Data

```csv
state,suburb_name,postcode,gross_rental_yield,capital_growth_5yr,data_source,last_updated
NSW,Sydney,2000,2.80,6.50,CoreLogic 2024,2025-01-17
NSW,Parramatta,2150,4.20,5.80,CoreLogic 2024,2025-01-17
VIC,Melbourne,3000,3.20,5.90,CoreLogic 2024,2025-01-17
```

---

## Verifying Benchmark Integration

After importing the data, verify it works:

### 1. Calculator Integration

1. Go to `/en/firb-calculator`
2. Complete Citizenship and Property Details steps
3. Enter a property value and select a state
4. Proceed to **Financial Details** step
5. You should see benchmark suggestions appear

### 2. Results Panel

1. Complete a full calculation
2. View the results panel
3. Expand **Investment Analytics**
4. Scroll to **Benchmark Comparison** section
5. Verify benchmarks are displayed

### 3. Admin Interface

1. Go to `/admin/benchmarks`
2. Verify all 8 states appear in the table
3. Test filtering by state
4. Verify data can be edited if needed

---

## Updating Benchmark Data

### When to Update

- Quarterly updates recommended
- When market conditions change significantly
- When new reliable data sources become available

### How to Update

**Option 1: Bulk Update via CSV**

1. Export existing data from admin interface (if export feature available)
2. Update values in CSV
3. Re-import via admin interface (will update existing records)

**Option 2: Manual Updates**

1. Go to `/admin/benchmarks`
2. Click edit on each state record
3. Update values
4. Save

**Option 3: SQL Update**

```sql
UPDATE benchmark_data
SET
  gross_rental_yield = 3.30,
  capital_growth_5yr = 5.60,
  last_updated = CURRENT_DATE,
  updated_at = NOW()
WHERE state = 'NSW' AND suburb_name IS NULL;
```

---

## Troubleshooting

### No Benchmarks Showing

- ✅ Verify data exists: `SELECT * FROM benchmark_data WHERE is_active = true;`
- ✅ Check RLS policies allow public read access
- ✅ Verify API endpoint is working: `/api/benchmarks?state=NSW`
- ✅ Check browser console for errors

### Import Errors

- ✅ Verify CSV format matches template
- ✅ Check all required fields are present
- ✅ Ensure state codes are valid (NSW, VIC, QLD, etc.)
- ✅ Verify numeric values are within valid ranges

### Data Not Updating

- ✅ Check if records exist (might need UPDATE instead of INSERT)
- ✅ Verify unique constraint is working correctly
- ✅ Check admin permissions

---

## Current Seed Data Summary

| State | Gross Yield | Net Yield | 5yr Growth | 10yr Growth | Notes                                     |
| ----- | ----------- | --------- | ---------- | ----------- | ----------------------------------------- |
| NSW   | 3.20%       | 2.50%     | 5.50%      | 5.80%       | Sydney metro 2.8-3.5%, regional 4-6%      |
| VIC   | 3.40%       | 2.60%     | 5.20%      | 5.50%       | Melbourne metro 3.0-3.8%, regional 4-5.5% |
| QLD   | 4.50%       | 3.50%     | 4.80%      | 5.00%       | Brisbane metro 4.0-5.0%, regional 5-7%    |
| WA    | 4.20%       | 3.30%     | 3.50%      | 3.80%       | Perth metro 3.8-4.8%, regional 5-7%       |
| SA    | 4.10%       | 3.20%     | 4.50%      | 4.70%       | Adelaide metro 3.8-4.5%, regional 5-6%    |
| TAS   | 4.80%       | 3.70%     | 5.20%      | 5.40%       | Hobart metro 4.5-5.2%, regional 5-7%      |
| ACT   | 3.80%       | 2.90%     | 5.00%      | 5.20%       | Strong rental demand                      |
| NT    | 5.50%       | 4.30%     | 2.50%      | 2.80%       | Higher yields, lower growth               |

---

## Next Steps

After populating the benchmark data:

1. ✅ **Test the Calculator**
   - Try different states
   - Verify benchmarks appear in Financial Details step
   - Check benchmark comparison in results

2. ✅ **Add Suburb Data** (Optional)
   - Add data for major cities/suburbs
   - Improve accuracy for specific locations

3. ✅ **Monitor Usage**
   - Track which benchmarks are used most
   - Gather feedback on data accuracy
   - Plan for quarterly updates

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify database connection and RLS policies
3. Check admin permissions
4. Review API endpoint logs

For questions or data updates, refer to the main documentation or contact the development team.









