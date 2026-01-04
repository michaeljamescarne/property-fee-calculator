# Phase 1 Suburb Benchmark Data Ingestion

## Overview

This document describes the ingestion of Phase 1 suburb-specific benchmark data from the Property Market Data Expansion analysis (2025). The data includes 65 priority suburbs across major Australian capital cities with separate House and Unit classifications.

## Migration Files

### 1. Schema Update: `20250120_add_property_classification_to_benchmarks.sql`

**Purpose**: Adds `property_classification` field to the `benchmark_data` table to distinguish between House and Unit benchmarks.

**Changes**:
- Adds `property_classification` column (TEXT, CHECK constraint: 'house', 'unit', or NULL)
- Updates unique index to include `property_classification` in the uniqueness constraint
- Adds index on `property_classification` for query performance

**Impact**: 
- Allows storing separate benchmarks for houses and units in the same suburb
- Maintains backward compatibility (NULL values allowed for state-level or combined benchmarks)

### 2. Data Insertion: `20250120_insert_suburb_benchmarks_phase1.sql`

**Purpose**: Inserts suburb-level benchmark data for 65 priority suburbs.

**Data Coverage**:
- **NSW**: 25 suburbs (Surry Hills, Bondi, Mosman, Parramatta, Penrith, etc.)
- **VIC**: 15 suburbs (Hawthorn, Box Hill, Footscray, Carlton, Southbank, etc.)
- **QLD**: 11 suburbs (New Farm, Fortitude Valley, Scarborough, North Lakes, etc.)
- **WA**: 9 suburbs (Scarborough, Fremantle, Subiaco, Northbridge, Cottesloe, etc.)
- **SA**: 6 suburbs (Norwood, Glenelg, Adelaide CBD, North Adelaide, etc.)
- **ACT**: 5 suburbs (Braddon, Kingston, Dickson, Griffith, etc.)

**Data Fields**:
- `gross_rental_yield`: Percentage (e.g., 2.80 for 2.8%)
- `net_rental_yield`: NULL (not provided in Phase 1, can be calculated as ~75-80% of gross)
- `median_weekly_rent`: AUD amount
- `median_property_value`: AUD amount
- `capital_growth_5yr`: Percentage per annum (using 12-month growth as proxy)
- `capital_growth_10yr`: NULL (not available in Phase 1 data)
- `data_quality_score`: 7-9 (7 = Medium, 8 = Medium-high, 9 = High confidence)
- `data_source`: Primary data sources (CoreLogic, SQM Research, Domain, etc.)

**Important Notes**:
1. **Capital Growth**: The `capital_growth_5yr` field uses 12-month growth data from the PDF as a proxy. This should be refined with actual 5-year averages in future updates.
2. **Net Yield**: `net_rental_yield` is NULL for all records. It can be calculated as approximately 75-80% of gross yield if needed.
3. **Property Classification**: Each suburb has separate records for 'house' and 'unit' where data is available.
4. **Data Quality**: Scores range from 7-9, with 9 indicating high-confidence triangulated data from multiple sources.

## Application Instructions

### Step 1: Apply Schema Migration

Run the schema update migration first:

```sql
-- Execute in Supabase SQL Editor or via migration tool
\i supabase/migrations/20250120_add_property_classification_to_benchmarks.sql
```

Or via Supabase Dashboard:
1. Go to SQL Editor
2. Copy and paste the contents of `20250120_add_property_classification_to_benchmarks.sql`
3. Execute

### Step 2: Insert Benchmark Data

Run the data insertion migration:

```sql
-- Execute in Supabase SQL Editor or via migration tool
\i supabase/migrations/20250120_insert_suburb_benchmarks_phase1.sql
```

Or via Supabase Dashboard:
1. Go to SQL Editor
2. Copy and paste the contents of `20250120_insert_suburb_benchmarks_phase1.sql`
3. Execute

### Step 3: Verify Data

Verify the data was inserted correctly:

```sql
-- Count records by state
SELECT state, property_classification, COUNT(*) as count
FROM benchmark_data
WHERE suburb_name IS NOT NULL
GROUP BY state, property_classification
ORDER BY state, property_classification;

-- Sample data check
SELECT suburb_name, postcode, property_classification, 
       gross_rental_yield, median_weekly_rent, capital_growth_5yr
FROM benchmark_data
WHERE suburb_name = 'Parramatta'
ORDER BY property_classification;
```

## API Compatibility

The existing `/api/benchmarks` endpoint will automatically use the new suburb-level data when available. The API:

1. **Prioritizes suburb-level data** over state-level when a suburb is specified
2. **Falls back to state-level** if no suburb match is found
3. **Does not currently filter by property_classification** - it returns the first match found

### Future Enhancement Recommendations

Consider updating the API to:
1. Accept an optional `property_classification` parameter ('house' or 'unit')
2. Return both house and unit benchmarks when available
3. Prioritize property_classification matches when provided

Example API enhancement:
```
GET /api/benchmarks?state=NSW&suburb=Parramatta&property_classification=unit
```

## Data Quality Notes

### High Confidence (Score 9)
- Triangulated from at least 2 primary sources (CoreLogic + SQM Research)
- Recent data (<3 months)
- Statistically significant sample size (>30 transactions per quarter)
- Examples: Surry Hills, Bondi, Parramatta, New Farm

### Medium-High Confidence (Score 8)
- Reputable industry reports (Domain, REIA)
- Data within 6 months
- Minor extrapolation may have been used
- Examples: Penrith, Werribee, North Lakes

### Medium Confidence (Score 7)
- Reports older than 6 months
- Some inference from neighboring suburbs
- Examples: Maroubra, North Adelaide, Kingston

## Market Insights from Phase 1 Data

The Phase 1 data reveals several key market trends:

1. **Supply-Constraint Boom (Perth & Brisbane)**: Markets like Scarborough (WA) and New Farm (QLD) show simultaneous capital growth and yield expansion - a rare anomaly indicating severe supply constraints.

2. **Affordability Ceiling (Sydney & Melbourne Premium)**: Suburbs like Mosman and Hawthorn show yield compression and slowed growth as borrowing capacity limits are reached.

3. **Investor Tax Exodus (Victoria)**: Carlton and Southbank show decade-high yields (5%+) but negative capital growth due to Victorian land tax changes.

4. **Ripple Effect (Western Sydney)**: Parramatta shows 30% house growth, driving demand into surrounding suburbs.

## Next Steps: Phase 2

Phase 2 should target "Middle Ring" suburbs:
- **Sydney**: Liverpool, Campbelltown, Sutherland Shire
- **Melbourne**: Frankston, Dandenong, Ringwood
- **Brisbane**: Logan, Ipswich
- **Regional**: Gold Coast, Newcastle, Geelong

## Maintenance

- **Update Frequency**: Quarterly recommended for high-traffic suburbs
- **Data Sources**: Continue triangulating from CoreLogic, SQM Research, Domain, and State REIs
- **Quality Threshold**: Maintain minimum score of 7 for production data
- **Version Control**: Each update increments the `version` field automatically

## References

- Source Document: Property Market Data Expansion.pdf
- Data Collection Plan: Suburb Benchmark Data Collection Plan.pdf
- Database Schema: `supabase/migrations/20250117_phase4_benchmark_data.sql`










