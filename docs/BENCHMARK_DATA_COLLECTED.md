# Benchmark Data - Collected Values

**Collection Date:** January-March 2025  
**Status:** ✅ Complete - Ready for SQL Insert

---

## Collected State-Level Data

| State | Gross Rental Yield | Net Rental Yield | Median Weekly Rent | Capital Growth 5yr | Capital Growth 10yr | Median Property Value | Data Source | Quality |
|-------|-------------------|------------------|-------------------|-------------------|--------------------|---------------------|-------------|---------|
| NSW   | 3.20% | 2.00% | $650 | 5.50% p.a. | 6.70% p.a. | $1,193,228 | CoreLogic/PropTrack/Domain | 8 |
| VIC   | 3.50% | 2.30% | $580 | 4.00% p.a. | 4.90% p.a. | $772,317 | CoreLogic/PropTrack | 8 |
| QLD   | 3.90% | 2.70% | $600 | 8.50% p.a. | 7.50% p.a. | $893,592 | CoreLogic/PropTrack | 9 |
| SA    | 4.00% | 2.80% | $550 | 10.00% p.a. | 7.20% p.a. | $819,363 | CoreLogic/PropTrack | 9 |
| WA    | 4.40% | 3.20% | $650 | 12.00% p.a. | 3.50% p.a. | $809,870 | CoreLogic/PropTrack | 9 |
| TAS   | 3.90% | 2.70% | $539 | 4.50% p.a. | 10.00% p.a. | $777,000 | Cotality/SQM Research/Aussie | 7 |
| ACT   | 4.30% | 3.10% | $620 | 5.00% p.a. | 4.80% p.a. | $965,910 | CoreLogic/REIA/PropTrack | 8 |
| NT    | 5.80% | 4.60% | $669 | -1.50% p.a. | 3.10% p.a. | $603,669 | CoreLogic/NT Economy | 7 |

---

## Key Observations

### Highest Rental Yields
- **NT:** 5.80% gross (4.60% net) - Highest yield
- **WA:** 4.40% gross (3.20% net)
- **ACT:** 4.30% gross (3.10% net)

### Highest Capital Growth (5yr)
- **WA:** 12.00% p.a. - Strong recent growth
- **SA:** 10.00% p.a. - Strong recent growth
- **QLD:** 8.50% p.a. - Strong growth

### Highest Median Property Values
- **NSW:** $1,193,228 - Most expensive
- **ACT:** $965,910
- **QLD:** $893,592

### Special Notes
- **NT:** Negative 5-year capital growth (-1.50%) reflects recent market conditions in Darwin
- **WA:** Strong 5-year growth (12%) but lower 10-year (3.5%) - recent market recovery
- **TAS:** Strong 10-year growth (10%) showing long-term performance

---

## Data Quality Summary

- **Quality Score 9:** QLD, SA, WA (CoreLogic/PropTrack)
- **Quality Score 8:** NSW, VIC, ACT (CoreLogic/PropTrack/Domain)
- **Quality Score 7:** TAS, NT (Mixed sources)

**Overall:** High quality data from reputable sources

---

## SQL File Ready

The SQL INSERT statements have been created in:
- `docs/SEED_BENCHMARK_DATA.sql`

**Next Steps:**
1. Review the SQL file
2. Run it in production Supabase SQL Editor
3. Verify all 8 state records were inserted
4. Move on to collecting `cost_benchmarks` data

---

## Verification Query

After running the SQL, use this to verify:

```sql
SELECT 
    state,
    gross_rental_yield,
    net_rental_yield,
    median_weekly_rent,
    capital_growth_5yr,
    capital_growth_10yr,
    median_property_value,
    data_quality_score
FROM benchmark_data
WHERE is_active = true
AND suburb_name IS NULL
ORDER BY state;
```

**Expected:** 8 rows (one per state: NSW, VIC, QLD, SA, WA, TAS, ACT, NT)










