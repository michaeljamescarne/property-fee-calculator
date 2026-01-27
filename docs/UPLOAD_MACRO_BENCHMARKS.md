# Upload Macro Benchmarks to Production

Step-by-step instructions to upload the macro benchmarks to your production database.

---

## Step 1: Open Production Supabase SQL Editor

1. Go to: https://app.supabase.com
2. Log in to your account
3. Select the **production project**: `gdhhjtjpcpttfgfkmhks`
4. Click **SQL Editor** in the left sidebar
5. Click **New Query** button

---

## Step 2: Copy the SQL File

1. Open the file: `docs/SEED_MACRO_BENCHMARKS_CLEAN.sql`
2. Copy the **entire file contents** (everything from `--` comments to the end)
3. Paste it into the Supabase SQL Editor

---

## Step 3: Review the SQL

The SQL file will:
1. ✅ Deactivate any existing benchmarks (if any)
2. ✅ Insert 8 new macro benchmark records
3. ✅ Run a verification query to show all records

**What will be inserted:**
- ASX Total Return: 12.8%
- Term Deposit Rate: 5.00%
- Bond Rate: 4.56%
- Savings Rate: 5.00%
- CGT Withholding: 15.0%
- Default Marginal Tax Rate: 37.0%
- Default Interest Rate: 6.5%
- Inflation Rate: 3.8%

---

## Step 4: Run the SQL

1. Click the **Run** button (or press `Cmd+Enter` / `Ctrl+Enter`)
2. Wait for execution to complete
3. Check the results panel at the bottom

**Expected Results:**
- First query: Should show "Success" with number of rows updated (may be 0 if no existing records)
- Second query (INSERT): Should show "Success" with "8 rows" inserted
- Third query (SELECT): Should show 8 rows of data

---

## Step 5: Verify Success

The verification query at the end should return 8 rows:

| category | metric | value_numeric | unit | data_source | last_updated | is_active |
|----------|--------|---------------|------|-------------|--------------|-----------|
| investment | asx_total_return | 12.80 | percent | ... | ... | true |
| investment | term_deposit_rate | 5.00 | percent | ... | ... | true |
| investment | bond_rate | 4.56 | percent | ... | ... | true |
| investment | savings_rate | 5.00 | percent | ... | ... | true |
| tax | cgt_withholding | 15.0 | percent | ... | ... | true |
| tax | default_marginal_tax_rate | 37.0 | percent | ... | ... | true |
| financing | default_interest_rate | 6.5 | percent | ... | ... | true |
| financing | inflation_rate | 3.8 | percent | ... | ... | true |

**Verify:**
- ✅ 8 rows returned
- ✅ All `is_active` = true
- ✅ Values match what you collected
- ✅ 4 investment, 2 tax, 2 financing

---

## Troubleshooting

### Error: "permission denied"

**Cause:** You may not be logged in as admin in Supabase

**Solution:** 
- Make sure you're logged into the correct Supabase account
- The RLS policies require admin role to insert

### Error: "duplicate key value violates unique constraint"

**Cause:** Records already exist and weren't deactivated

**Solution:**
- Check if UPDATE query ran successfully
- Or manually run: `UPDATE macro_benchmarks SET is_active = false WHERE is_active = true;`
- Then re-run the INSERT

### No rows returned in verification

**Cause:** INSERT failed silently or RLS is blocking

**Solution:**
- Check for error messages in the SQL Editor
- Verify your admin role is set correctly
- Check RLS policies

---

## After Successful Upload

✅ **Macro benchmarks are now in production!**

**Next Steps:**
1. Test the benchmarks in your application
2. Move on to collecting `benchmark_data` (state-level rental yields and capital growth)
3. Then collect `cost_benchmarks` data

---

## Quick Verification Query

After uploading, you can run this anytime to check your macro benchmarks:

```sql
SELECT 
    category,
    metric,
    value_numeric,
    unit,
    data_source,
    last_updated
FROM macro_benchmarks
WHERE is_active = true
ORDER BY category, metric;
```

---

Ready to upload? Follow the steps above and let me know when it's complete!












