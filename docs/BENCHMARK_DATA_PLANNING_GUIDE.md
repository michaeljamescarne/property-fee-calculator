# Benchmark Data Planning Guide

This guide will help you plan and structure comprehensive benchmark data for all three benchmark tables before uploading to production.

---

## Overview of Benchmark Tables

### 1. `benchmark_data` - Rental Yield & Capital Growth
- **Purpose:** State/suburb-level rental yield and capital growth benchmarks
- **Granularity:** State-level (required) or suburb-level (optional)

### 2. `cost_benchmarks` - Property Costs
- **Purpose:** State and property-type scoped cost benchmarks
- **Granularity:** State × Property Type × Metric

### 3. `macro_benchmarks` - Global Benchmarks
- **Purpose:** Global benchmarks for investment comparisons, tax rates, financing
- **Granularity:** Single value per metric (Australia-wide)

---

## Table 1: benchmark_data

### Structure

**Fields:**
- `state` - Australian state (NSW, VIC, QLD, SA, WA, TAS, ACT, NT)
- `suburb_name` - Optional, NULL for state-level data
- `postcode` - Optional
- `gross_rental_yield` - Percentage (e.g., 4.50 for 4.5%)
- `net_rental_yield` - Percentage
- `median_weekly_rent` - AUD
- `capital_growth_5yr` - Percentage per annum (e.g., 6.00 for 6%)
- `capital_growth_10yr` - Percentage per annum
- `median_property_value` - AUD
- `data_source` - Where the data came from
- `last_updated` - Date
- `data_quality_score` - 1-10
- `notes` - Optional notes
- `is_active` - true/false

### Planning Template

Start with **state-level data** (suburb data can be added later):

| State | Gross Rental Yield (%) | Net Rental Yield (%) | Median Weekly Rent ($) | Capital Growth 5yr (% p.a.) | Capital Growth 10yr (% p.a.) | Median Property Value ($) | Data Source | Quality Score |
|-------|------------------------|----------------------|------------------------|----------------------------|-----------------------------|---------------------------|-------------|---------------|
| NSW   |                        |                      |                        |                            |                             |                           |             |               |
| VIC   |                        |                      |                        |                            |                             |                           |             |               |
| QLD   |                        |                      |                        |                            |                             |                           |             |               |
| SA    |                        |                      |                        |                            |                             |                           |             |               |
| WA    |                        |                      |                        |                            |                             |                           |             |               |
| TAS   |                        |                      |                        |                            |                             |                           |             |               |
| ACT   |                        |                      |                        |                            |                             |                           |             |               |
| NT    |                        |                      |                        |                            |                             |                           |             |               |

### Data Sources Suggestions

- **Rental Yields:** CoreLogic, Domain, RealEstate.com.au, ABS
- **Capital Growth:** CoreLogic, Domain, REA Group, RP Data
- **Median Values:** CoreLogic, Domain, ABS Census

### Example Data (NSW - for reference)

```sql
INSERT INTO benchmark_data (
    state,
    suburb_name,
    postcode,
    gross_rental_yield,
    net_rental_yield,
    median_weekly_rent,
    capital_growth_5yr,
    capital_growth_10yr,
    median_property_value,
    data_source,
    last_updated,
    data_quality_score,
    notes,
    is_active
) VALUES (
    'NSW',
    NULL, -- State-level data
    NULL,
    3.50, -- 3.5% gross yield
    2.50, -- 2.5% net yield (after costs)
    650.00, -- $650/week median rent
    6.50, -- 6.5% p.a. over 5 years
    7.00, -- 7.0% p.a. over 10 years
    950000.00, -- $950,000 median value
    'CoreLogic - January 2025',
    CURRENT_DATE,
    8, -- High quality
    'State-wide averages for established dwellings',
    true
);
```

---

## Table 2: cost_benchmarks

### Structure

**Fields:**
- `state` - Australian state
- `property_type` - newDwelling, established, vacantLand, commercial
- `metric` - One of 11 cost metrics
- `value_numeric` - The numeric value
- `unit` - percent, percent_of_value, weeks, currency, basis_points, percentage_points
- `data_source` - Where the data came from
- `last_updated` - Date
- `notes` - Optional notes
- `is_active` - true/false

### Metrics Available

1. `council_rate_percent` - Council rates as % of property value
2. `insurance_percent` - Insurance as % of property value
3. `maintenance_percent` - Maintenance as % of property value
4. `vacancy_rate_percent` - Vacancy rate percentage
5. `management_fee_percent` - Property management fee percentage
6. `letting_fee_weeks` - Letting fee in weeks of rent
7. `rent_growth_percent` - Annual rent growth percentage
8. `interest_rate_percent` - Default interest rate percentage
9. `selling_costs_percent` - Selling costs as % of sale price
10. `loan_cost_basis_points` - Loan costs in basis points
11. `strata_fee_percent` - Strata/body corporate fees as % of property value

### Default Values (from code)

These are the current fallback values if no benchmark exists:

| Metric | Default Value | Unit |
|--------|---------------|------|
| council_rate_percent | 0.3 | percent |
| insurance_percent | 0.2 | percent |
| maintenance_percent | 1.0 | percent (1.5% for established) |
| vacancy_rate_percent | 5.0 | percent |
| management_fee_percent | 8.0 | percent |
| letting_fee_weeks | 2.0 | weeks |
| rent_growth_percent | 3.0 | percent |
| interest_rate_percent | 6.5 | percent |
| selling_costs_percent | 4.0 | percent |
| loan_cost_basis_points | 10.0 | basis_points |
| strata_fee_percent | 0.0 | percent |

### Planning Template

You need data for: **8 states × 4 property types × 11 metrics = 352 records**

**Template per state and property type:**

| State | Property Type | Metric | Value | Unit | Data Source | Notes |
|-------|---------------|--------|-------|------|-------------|-------|
| NSW   | established   | council_rate_percent | | percent | | |
| NSW   | established   | insurance_percent | | percent | | |
| NSW   | established   | maintenance_percent | | percent | | |
| ...   | ...           | ...    | | | | |

### Recommended Approach

Start with **established properties only** (most common):
- 8 states × 1 property type × 11 metrics = **88 records**

Then expand to other property types as needed.

### Example Data (NSW, Established - for reference)

```sql
INSERT INTO cost_benchmarks (
    state,
    property_type,
    metric,
    value_numeric,
    unit,
    data_source,
    last_updated,
    notes,
    is_active
) VALUES
    ('NSW', 'established', 'council_rate_percent', 0.35, 'percent', 'NSW Local Government', CURRENT_DATE, 'Average across NSW councils', true),
    ('NSW', 'established', 'insurance_percent', 0.25, 'percent', 'Insurance industry average', CURRENT_DATE, 'Comprehensive property insurance', true),
    ('NSW', 'established', 'maintenance_percent', 1.5, 'percent', 'Industry standard', CURRENT_DATE, 'For established properties', true),
    ('NSW', 'established', 'vacancy_rate_percent', 3.0, 'percent', 'REA Group', CURRENT_DATE, 'Sydney metro average', true),
    ('NSW', 'established', 'management_fee_percent', 7.0, 'percent', 'Property management industry', CURRENT_DATE, 'Standard management fee', true),
    ('NSW', 'established', 'letting_fee_weeks', 2.0, 'weeks', 'Property management industry', CURRENT_DATE, 'Standard letting fee', true),
    ('NSW', 'established', 'rent_growth_percent', 3.5, 'percent', 'CoreLogic', CURRENT_DATE, 'Annual rent growth', true),
    ('NSW', 'established', 'interest_rate_percent', 6.5, 'percent', 'RBA', CURRENT_DATE, 'Current variable rate', true),
    ('NSW', 'established', 'selling_costs_percent', 4.0, 'percent', 'Real estate industry', CURRENT_DATE, 'Including agent fees, legal, etc.', true),
    ('NSW', 'established', 'loan_cost_basis_points', 10.0, 'basis_points', 'Banking industry', CURRENT_DATE, 'Application and settlement fees', true),
    ('NSW', 'established', 'strata_fee_percent', 0.0, 'percent', 'N/A', CURRENT_DATE, 'Only for strata properties', true);
```

---

## Table 3: macro_benchmarks

### Structure

**Fields:**
- `category` - investment, tax, financing
- `metric` - One of 8 macro metrics
- `value_numeric` - The numeric value
- `unit` - percent, percentage_points, basis_points
- `data_source` - Where the data came from
- `refresh_cadence` - Recommended update frequency (monthly, quarterly, annually)
- `last_updated` - Date
- `notes` - Optional notes
- `is_active` - true/false

### Metrics Available

**Investment Category:**
1. `asx_total_return` - ASX total return percentage
2. `term_deposit_rate` - Term deposit rate percentage
3. `bond_rate` - Government bond rate percentage
4. `savings_rate` - High interest savings rate percentage

**Tax Category:**
5. `cgt_withholding` - Capital gains tax withholding percentage
6. `default_marginal_tax_rate` - Default marginal tax rate percentage

**Financing Category:**
7. `default_interest_rate` - Default interest rate percentage
8. `inflation_rate` - Inflation rate percentage

### Default Values (from code)

| Metric | Default Value | Unit | Category |
|--------|---------------|------|----------|
| asx_total_return | 7.2 | percent | investment |
| term_deposit_rate | 4.0 | percent | investment |
| bond_rate | 4.5 | percent | investment |
| savings_rate | 4.5 | percent | investment |
| cgt_withholding | 12.5 | percent | tax |
| default_marginal_tax_rate | 37.0 | percent | tax |
| default_interest_rate | 6.5 | percent | financing |
| inflation_rate | 3.0 | percent | financing |

### Planning Template

Only **8 records needed** (one per metric, Australia-wide):

| Category | Metric | Value | Unit | Data Source | Refresh Cadence | Notes |
|----------|--------|-------|------|-------------|-----------------|-------|
| investment | asx_total_return | | percent | | | |
| investment | term_deposit_rate | | percent | | | |
| investment | bond_rate | | percent | | | |
| investment | savings_rate | | percent | | | |
| tax | cgt_withholding | | percent | | | |
| tax | default_marginal_tax_rate | | percent | | | |
| financing | default_interest_rate | | percent | | | |
| financing | inflation_rate | | percent | | | |

### Example Data (for reference)

```sql
INSERT INTO macro_benchmarks (
    category,
    metric,
    value_numeric,
    unit,
    data_source,
    refresh_cadence,
    last_updated,
    notes,
    is_active
) VALUES
    ('investment', 'asx_total_return', 7.2, 'percent', 'ASX', 'quarterly', CURRENT_DATE, '5-year average total return', true),
    ('investment', 'term_deposit_rate', 4.0, 'percent', 'RBA', 'monthly', CURRENT_DATE, '1-year term deposit', true),
    ('investment', 'bond_rate', 4.5, 'percent', 'RBA', 'monthly', CURRENT_DATE, '10-year government bond', true),
    ('investment', 'savings_rate', 4.5, 'percent', 'RBA', 'monthly', CURRENT_DATE, 'High interest savings', true),
    ('tax', 'cgt_withholding', 12.5, 'percent', 'ATO', 'annually', CURRENT_DATE, 'Non-resident CGT withholding', true),
    ('tax', 'default_marginal_tax_rate', 37.0, 'percent', 'ATO', 'annually', CURRENT_DATE, 'Marginal rate for $120k-$180k income', true),
    ('financing', 'default_interest_rate', 6.5, 'percent', 'RBA', 'monthly', CURRENT_DATE, 'Standard variable rate', true),
    ('financing', 'inflation_rate', 3.0, 'percent', 'ABS', 'quarterly', CURRENT_DATE, 'CPI annual rate', true);
```

---

## Data Collection Strategy

### Phase 1: Start Small (Recommended)

1. **macro_benchmarks** - 8 records (easiest, Australia-wide)
2. **cost_benchmarks** - Start with established properties only (88 records)
3. **benchmark_data** - State-level only (8 records)

**Total Phase 1: 104 records**

### Phase 2: Expand

4. **cost_benchmarks** - Add other property types
5. **benchmark_data** - Add suburb-level data for major cities

---

## Data Quality Guidelines

### For Each Benchmark:

1. **Data Source:** Always document where the data came from
2. **Last Updated:** Keep track of when data was collected
3. **Quality Score:** 1-10 rating based on:
   - Source reliability (government = 10, industry = 8, estimate = 5)
   - Data recency (within 3 months = 10, 6 months = 7, 1 year = 5)
   - Sample size (large = 10, medium = 7, small = 5)

### Quality Score Guidelines:

- **10:** Official government data (ABS, RBA, ATO), recent (< 3 months)
- **9:** Major industry source (CoreLogic, Domain), recent
- **8:** Industry standard, recent
- **7:** Industry standard, 3-6 months old
- **6:** Industry estimate, recent
- **5:** Estimate or older data
- **< 5:** Use with caution, consider not using

---

## Next Steps

1. **Fill out the planning templates above** with actual data
2. **Gather data sources** for each benchmark
3. **Create SQL INSERT statements** from your planning data
4. **Review and validate** all values before uploading
5. **Upload to production** database

Would you like me to create a specific planning spreadsheet or SQL template for any of these tables?




