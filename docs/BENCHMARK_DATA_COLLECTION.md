# Benchmark Data Collection - Step by Step

Let's collect benchmark data systematically, starting with the easiest and working our way up.

---

## Step 1: Macro Benchmarks (8 records) - START HERE

**Why start here:** Simplest - only 8 records, Australia-wide, easy to verify

### Quick Reference Table

Fill this out as you research:

| Category | Metric | Value | Unit | Data Source | Refresh Cadence | Notes |
|----------|--------|-------|------|-------------|-----------------|-------|
| investment | asx_total_return |  | percent |  | quarterly |  |
| investment | term_deposit_rate |  | percent |  | monthly |  |
| investment | bond_rate |  | percent |  | monthly |  |
| investment | savings_rate |  | percent |  | monthly |  |
| tax | cgt_withholding |  | percent |  | annually |  |
| tax | default_marginal_tax_rate |  | percent |  | annually |  |
| financing | default_interest_rate |  | percent |  | monthly |  |
| financing | inflation_rate |  | percent |  | quarterly |  |

### Current Default Values (Use as Starting Point)

| Metric | Default | Where to Get Updated Value |
|--------|---------|----------------------------|
| asx_total_return | 7.2% | ASX website, investment data providers |
| term_deposit_rate | 4.0% | RBA website, bank comparison sites |
| bond_rate | 4.5% | RBA website (10-year bond yield) |
| savings_rate | 4.5% | RBA website, bank comparison sites |
| cgt_withholding | 12.5% | ATO website (fixed rate) |
| default_marginal_tax_rate | 37.0% | ATO website (tax brackets) |
| default_interest_rate | 6.5% | RBA website (cash rate + margin) |
| inflation_rate | 3.0% | ABS website (CPI) |

### Data Collection Links

**RBA (Reserve Bank of Australia):**
- Interest rates: https://www.rba.gov.au/statistics/cash-rate/
- Bond rates: https://www.rba.gov.au/statistics/tables/
- Term deposits: https://www.rba.gov.au/statistics/tables/

**ABS (Australian Bureau of Statistics):**
- Inflation/CPI: https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation

**ATO (Australian Taxation Office):**
- Tax rates: https://www.ato.gov.au/tax-rates-and-codes/
- CGT withholding: https://www.ato.gov.au/business/international-tax-for-business/foreign-residents-in-australia/capital-gains-tax/

**ASX:**
- Total return data: https://www.asx.com.au/

### Fill This Out Now:

1. **asx_total_return**: _____% (Source: _____________)
2. **term_deposit_rate**: _____% (Source: _____________)
3. **bond_rate**: _____% (Source: _____________)
4. **savings_rate**: _____% (Source: _____________)
5. **cgt_withholding**: _____% (Source: _____________)
6. **default_marginal_tax_rate**: _____% (Source: _____________)
7. **default_interest_rate**: _____% (Source: _____________)
8. **inflation_rate**: _____% (Source: _____________)

---

## Step 2: Benchmark Data - State Level (8 records)

### Quick Reference Table

Fill this out for each state:

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

### Data Sources for Rental & Growth Data

**CoreLogic:**
- Rental yields, capital growth, median values
- https://www.corelogic.com.au/

**Domain:**
- Rental data, property values
- https://www.domain.com.au/

**RealEstate.com.au:**
- Property data and statistics
- https://www.realestate.com.au/

**ABS:**
- Census data, property statistics
- https://www.abs.gov.au/

### Key Questions for Each State:

1. **Gross Rental Yield:** Annual rent / Property value × 100 = ?%
2. **Net Rental Yield:** (Annual rent - Annual costs) / Property value × 100 = ?%
3. **Median Weekly Rent:** $_____ per week
4. **Capital Growth 5yr:** Average annual growth over 5 years = ?% p.a.
5. **Capital Growth 10yr:** Average annual growth over 10 years = ?% p.a.
6. **Median Property Value:** $_____

---

## Step 3: Cost Benchmarks - Established Properties (88 records)

### Template for Each State

For each state, fill out these 11 metrics for **established** properties:

| State | Property Type | Metric | Value | Unit | Data Source | Notes |
|-------|---------------|--------|-------|------|-------------|-------|
| [STATE] | established | council_rate_percent | | percent | | |
| [STATE] | established | insurance_percent | | percent | | |
| [STATE] | established | maintenance_percent | | percent | | |
| [STATE] | established | vacancy_rate_percent | | percent | | |
| [STATE] | established | management_fee_percent | | percent | | |
| [STATE] | established | letting_fee_weeks | | weeks | | |
| [STATE] | established | rent_growth_percent | | percent | | |
| [STATE] | established | interest_rate_percent | | percent | | |
| [STATE] | established | selling_costs_percent | | percent | | |
| [STATE] | established | loan_cost_basis_points | | basis_points | | |
| [STATE] | established | strata_fee_percent | | percent | | |

### Default Values (Use as Starting Point)

| Metric | Default | Notes |
|--------|---------|-------|
| council_rate_percent | 0.3% | Varies by council - may need state averages |
| insurance_percent | 0.2% | Property insurance |
| maintenance_percent | 1.5% | Higher for established properties |
| vacancy_rate_percent | 5.0% | Varies by area |
| management_fee_percent | 8.0% | Property management |
| letting_fee_weeks | 2.0 weeks | One-time fee |
| rent_growth_percent | 3.0% | Annual growth |
| interest_rate_percent | 6.5% | From RBA + margin |
| selling_costs_percent | 4.0% | Agent fees + legal |
| loan_cost_basis_points | 10.0 bps | Application fees |
| strata_fee_percent | 0.0% | Only for strata properties |

### Data Sources for Cost Benchmarks

**Council Rates:**
- Check individual council websites or state local government associations

**Insurance:**
- Property insurance comparison sites, industry averages

**Property Management:**
- Real estate industry standards (typically 7-9%)

**Vacancy Rates:**
- Domain, RealEstate.com.au statistics

**Interest Rates:**
- RBA website (cash rate) + typical bank margins

---

## Collection Checklist

### Macro Benchmarks
- [ ] Research and fill all 8 values
- [ ] Document data sources
- [ ] Note dates of data collection
- [ ] Ready to create SQL

### Benchmark Data
- [ ] Research rental yields for all 8 states
- [ ] Research capital growth for all 8 states
- [ ] Research median values and rents
- [ ] Document data sources
- [ ] Ready to create SQL

### Cost Benchmarks
- [ ] Start with NSW (template)
- [ ] Complete all states for established properties
- [ ] Document data sources
- [ ] Ready to create SQL

---

## Next Steps After Collection

Once you've filled out the data:

1. ✅ Review all values for reasonableness
2. ✅ Cross-check with multiple sources
3. ✅ Create SQL INSERT statements
4. ✅ Test SQL in a development environment (optional)
5. ✅ Upload to production database

---

## Quick Start Action Items

**Right now:**
1. Open the macro benchmarks table above
2. Research and fill in the 8 values
3. Document where you got each value
4. Come back and we'll create the SQL INSERT statements

**Then:**
- Move on to benchmark_data (state-level)
- Finally cost_benchmarks (established properties)

Ready to start? Let's begin with macro benchmarks!










