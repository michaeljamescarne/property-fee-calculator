# Macro Benchmarks - Collected Data

**Collection Date:** January 2025  
**Status:** ✅ Complete - Ready for SQL Insert

---

## Collected Values

| # | Category | Metric | Value | Unit | Source | Notes |
|---|----------|--------|-------|------|--------|-------|
| 1 | investment | asx_total_return | 12.8% | percent | S&P/ASX 200 Accumulation Index | Based on recent 5-year average total return |
| 2 | investment | term_deposit_rate | 5.00% | percent | Comparison sites | Average of highest advertised 1-year rates (Heartland/Judo) |
| 3 | investment | bond_rate | 4.56% | percent | Australian 10-year Government Bond | Yield as of early December 2025 |
| 4 | investment | savings_rate | 5.00% | percent | Canstar/RateCity | Highest promotional rate (Rabobank, Westpac Life) |
| 5 | tax | cgt_withholding | 15.0% | percent | ATO | Rate for contracts signed on or after 1 Jan 2025 (increased from 12.5%) |
| 6 | tax | default_marginal_tax_rate | 37.0% | percent | ATO | Using 37% as default (noting Stage 3 tax cut changes) |
| 7 | financing | default_interest_rate | 6.5% | percent | Big 4 banks average | Standard variable owner occupier rate |
| 8 | financing | inflation_rate | 3.8% | percent | ABS | Annual All Groups CPI for 12 months to October 2025 |

---

## Key Updates from Defaults

- **ASX Total Return:** Increased from 7.2% to 12.8% (strong recent performance)
- **Term Deposit Rate:** Increased from 4.0% to 5.00% (higher rates)
- **Bond Rate:** Updated from 4.5% to 4.56% (current yield)
- **Savings Rate:** Increased from 4.5% to 5.00% (higher promotional rates)
- **CGT Withholding:** Increased from 12.5% to 15.0% (ATO rate change from Jan 2025)
- **Default Marginal Tax Rate:** Unchanged at 37.0%
- **Default Interest Rate:** Unchanged at 6.5%
- **Inflation Rate:** Updated from 3.0% to 3.8% (current CPI)

---

## SQL File Ready

The SQL INSERT statements have been created in:
- `docs/SEED_MACRO_BENCHMARKS.sql`

**Next Steps:**
1. Review the SQL file
2. Run it in production Supabase SQL Editor
3. Verify all 8 records were inserted
4. Move on to next benchmark table (benchmark_data)

---

## Verification Query

After running the SQL, use this to verify:

```sql
SELECT 
    category,
    metric,
    value_numeric,
    unit,
    data_source,
    last_updated,
    is_active
FROM macro_benchmarks
WHERE is_active = true
ORDER BY category, metric;
```

**Expected:** 8 rows (4 investment, 2 tax, 2 financing)




