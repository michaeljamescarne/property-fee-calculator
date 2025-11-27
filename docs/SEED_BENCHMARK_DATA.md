# Seed Benchmark Data - Step by Step Guide

This guide will help you populate the `benchmark_data` table with initial state-level benchmark data.

## What This Does

The seed script adds rental yield and capital growth benchmarks for all 8 Australian states and territories:

- **NSW**: 3.2% gross yield, 5.5% capital growth
- **VIC**: 3.4% gross yield, 5.2% capital growth
- **QLD**: 4.5% gross yield, 4.8% capital growth
- **WA**: 4.2% gross yield, 3.5% capital growth
- **SA**: 4.1% gross yield, 4.5% capital growth
- **TAS**: 4.8% gross yield, 5.2% capital growth
- **ACT**: 3.8% gross yield, 5.0% capital growth
- **NT**: 5.5% gross yield, 2.5% capital growth

## Steps to Run

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor** (left sidebar)

2. **Open the Seed Script**
   - The file is located at: `supabase/migrations/20250117_seed_benchmark_data.sql`
   - Copy the entire contents of the file

3. **Paste and Run**
   - Paste the SQL into the SQL Editor
   - Click **Run** (or press `Cmd+Enter` / `Ctrl+Enter`)

4. **Verify Success**
   - You should see: "Success. No rows returned" (or similar success message)
   - The script uses `ON CONFLICT DO NOTHING`, so it's safe to run multiple times

5. **Verify Data**
   - Go to **Table Editor** → `benchmark_data`
   - You should see 8 rows (one for each state/territory)
   - All rows should have `suburb_name` and `postcode` as `NULL` (state-level data)

## Expected Results

After running the seed script:

- ✅ 8 state-level benchmark records created
- ✅ All states/territories covered (NSW, VIC, QLD, WA, SA, TAS, ACT, NT)
- ✅ Rental yields and capital growth rates populated
- ✅ Data source and quality scores included
- ✅ All records marked as `is_active = true`

## Next Steps

Once the seed data is populated:

1. Test the calculator - benchmarks should now appear in the Financial Details step
2. Add suburb-level data via admin interface (when built)
3. Update benchmarks periodically as market conditions change

## Troubleshooting

**Error: "relation benchmark_data does not exist"**

- Run the main migration first: `20250117_phase4_benchmark_data.sql`

**Error: "duplicate key value violates unique constraint"**

- This is normal if you've already run the seed script
- The `ON CONFLICT DO NOTHING` clause prevents errors
- You can safely ignore this or check existing data

**No data appears after running**

- Check that the migration script ran successfully first
- Verify you're looking at the correct table (`benchmark_data`)
- Check that `is_active = true` filter is not hiding the data
