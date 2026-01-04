# Collect Cost Benchmarks - Established Properties

Step-by-step guide to collect cost benchmark data for all 8 states × 11 metrics = 88 records.

---

## What We're Collecting

**Table:** `cost_benchmarks`  
**Property Type:** `established` (most common)  
**Records needed:** 88 (8 states × 11 metrics)

---

## The 11 Cost Metrics

For each state, you need values for these 11 metrics:

1. **council_rate_percent** - Council rates as % of property value
2. **insurance_percent** - Property insurance as % of property value
3. **maintenance_percent** - Maintenance costs as % of property value
4. **vacancy_rate_percent** - Vacancy rate (time property is unrented)
5. **management_fee_percent** - Property management fee as % of rental income
6. **letting_fee_weeks** - One-time letting fee in weeks of rent
7. **rent_growth_percent** - Annual rent growth rate
8. **interest_rate_percent** - Default mortgage interest rate
9. **selling_costs_percent** - Selling costs (agent fees, legal) as % of sale price
10. **loan_cost_basis_points** - One-time loan costs (100 bps = 1%)
11. **strata_fee_percent** - Strata/body corporate fees as % of property value (0 if not applicable)

---

## Default Values (Starting Points)

These are the current default values from code. Use as starting points and refine for each state:

| Metric | Default | Unit | Notes |
|--------|---------|------|-------|
| council_rate_percent | 0.3% | percent | Varies significantly by council/state |
| insurance_percent | 0.2% | percent | Property insurance - relatively consistent |
| maintenance_percent | 1.0% | percent | 1.5% for established properties |
| vacancy_rate_percent | 5.0% | percent | Varies by market/area |
| management_fee_percent | 8.0% | percent | Property management industry standard |
| letting_fee_weeks | 2.0 | weeks | One-time letting fee |
| rent_growth_percent | 3.0% | percent | Annual rent growth - varies by state |
| interest_rate_percent | 6.5% | percent | From RBA + bank margin (may vary slightly) |
| selling_costs_percent | 4.0% | percent | Agent fees (2-3%) + legal/other costs |
| loan_cost_basis_points | 10.0 | basis_points | Application/settlement fees (0.1%) |
| strata_fee_percent | 0.0% | percent | Only for units/apartments (can use 0 for houses) |

---

## Collection Template

### Fill Out This Template for Each State

Use one table per state, or combine all states in a spreadsheet.

**Template for [STATE]:**

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

---

## All States Combined Template (Recommended)

Fill out this master table for all 8 states:

**Copy this and fill in values:**

```
State | Metric | Value | Unit | Data Source | Notes
------|--------|-------|------|-------------|------
NSW   | council_rate_percent | | percent | |
NSW   | insurance_percent | | percent | |
NSW   | maintenance_percent | | percent | |
NSW   | vacancy_rate_percent | | percent | |
NSW   | management_fee_percent | | percent | |
NSW   | letting_fee_weeks | | weeks | |
NSW   | rent_growth_percent | | percent | |
NSW   | interest_rate_percent | | percent | |
NSW   | selling_costs_percent | | percent | |
NSW   | loan_cost_basis_points | | basis_points | |
NSW   | strata_fee_percent | | percent | |
[Repeat for VIC, QLD, SA, WA, TAS, ACT, NT]
```

---

## Detailed Metric Explanations

### 1. Council Rate Percent

**What it is:** Annual council rates as percentage of property value

**How to find:**
- Check individual council websites for rates
- State local government associations may have averages
- Usually 0.3% - 0.6% of property value

**Example:** If property is $1M and annual rates are $3,500
- Rate = ($3,500 / $1,000,000) × 100 = 0.35%

**Varies by:** Council, property type, property value

---

### 2. Insurance Percent

**What it is:** Annual property insurance as percentage of property value

**How to find:**
- Insurance comparison websites
- Industry averages (typically 0.2-0.3%)
- Relatively consistent across states

**Example:** $2,000 insurance on $1M property = 0.2%

---

### 3. Maintenance Percent

**What it is:** Annual maintenance costs as percentage of property value

**Industry standards:**
- New properties: ~1.0%
- Established properties: ~1.5%
- Older properties: 2%+

**How to find:**
- Property management companies
- Industry standards
- RBA/housing research

**Note:** Higher for established properties

---

### 4. Vacancy Rate Percent

**What it is:** Percentage of time property is unrented (e.g., 5% = ~18 days/year)

**How to find:**
- Domain/RealEstate.com.au statistics
- Property management industry data
- State rental market reports

**Typical range:** 2-5% in strong markets, 5-8% in weaker markets

---

### 5. Management Fee Percent

**What it is:** Property management fee as percentage of rental income

**Industry standards:**
- Standard rate: 7-9%
- May vary slightly by state/market

**How to find:**
- Property management company websites
- Real estate industry standards
- Relatively consistent (can use same for all states or slight variations)

---

### 6. Letting Fee (Weeks)

**What it is:** One-time fee paid when finding new tenant, in weeks of rent

**Industry standards:**
- Typically 1-2 weeks of rent
- Standard is 2 weeks

**How to find:**
- Property management industry standard
- Usually consistent across states (2 weeks is common)

---

### 7. Rent Growth Percent

**What it is:** Expected annual rental growth rate

**How to find:**
- Same sources as benchmark_data rental yields
- CoreLogic, Domain rental growth data
- Historical rent growth trends

**Note:** Should align with capital growth trends

---

### 8. Interest Rate Percent

**What it is:** Default mortgage interest rate

**How to find:**
- RBA website (cash rate)
- Add typical bank margin (2-3%)
- Standard variable rates

**Note:** Can be same across all states (RBA rate + margin) or vary slightly

---

### 9. Selling Costs Percent

**What it is:** Total selling costs as percentage of sale price (agent fees, legal, etc.)

**Components:**
- Real estate agent commission: 2-3%
- Legal/conveyancing: ~$1,500
- Marketing/advertising: varies
- Other costs

**Total:** Usually 3-5% of sale price

**How to find:**
- Real estate industry standards
- Agent commission rates
- Relatively consistent across states

---

### 10. Loan Cost Basis Points

**What it is:** One-time loan application/settlement costs

**Conversion:** 100 basis points = 1%

**Example:** 10 basis points = 0.1% of loan amount

**How to find:**
- Banking industry standard
- Usually consistent (10-15 bps is typical)
- Application fees + settlement fees

---

### 11. Strata Fee Percent

**What it is:** Annual strata/body corporate fees as percentage of property value

**Note:** 
- Only applies to units/apartments/townhouses
- Usually 0% for houses
- Can use 0% as default for established houses

**If needed:**
- Typically 0.3-0.8% for units
- Varies significantly by building

**Recommendation:** Use 0.0% for established houses (most common property type)

---

## Research Strategy

### Quick Start Approach

1. **Use defaults where appropriate:**
   - Some metrics are consistent across states (insurance, management fee, letting fee)
   - Start with defaults, then refine state-specific ones

2. **Focus on state-specific metrics:**
   - Council rates (varies by state/council)
   - Vacancy rates (varies by market)
   - Rent growth (from rental market data)

3. **Research in order:**
   - Start with NSW (most data available)
   - Use as template for other states
   - Adjust state-specific values

---

## Data Sources

### For Council Rates
- Individual council websites
- State local government associations
- Property management companies

### For Insurance
- Insurance comparison sites (Canstar, Finder)
- Industry averages
- Relatively consistent (0.2-0.3%)

### For Maintenance
- Property management companies
- Industry standards
- Housing research reports

### For Vacancy Rates
- Domain rental statistics
- RealEstate.com.au data
- SQM Research

### For Management Fees
- Property management company websites
- Real estate industry standards (7-9%)

### For Rent Growth
- Same sources as benchmark_data
- CoreLogic, Domain rental growth data

### For Interest Rates
- RBA website
- Can be same for all states

### For Selling Costs
- Real estate industry standards
- Agent commission rates

---

## Recommended Collection Order

### Start with Metrics That Vary Least

1. **Interest Rate** - Same for all states (RBA rate)
2. **Insurance** - Relatively consistent
3. **Management Fee** - Standard 7-9%
4. **Letting Fee** - Standard 2 weeks
5. **Selling Costs** - Standard 4%
6. **Loan Costs** - Standard 10 bps
7. **Strata Fee** - Use 0% for houses

### Then State-Specific Metrics

8. **Council Rates** - Varies by state/council
9. **Vacancy Rate** - Varies by market
10. **Rent Growth** - From rental data
11. **Maintenance** - Industry standard (1.5% for established)

---

## Quick Collection Template

**Fill out for each state (NSW example):**

```
NSW - Established Properties:

1. council_rate_percent: _____% (Source: ________)
2. insurance_percent: _____% (Source: ________)
3. maintenance_percent: _____% (Source: ________ - use 1.5% for established)
4. vacancy_rate_percent: _____% (Source: ________)
5. management_fee_percent: _____% (Source: ________)
6. letting_fee_weeks: _____ weeks (Source: ________)
7. rent_growth_percent: _____% (Source: ________)
8. interest_rate_percent: _____% (Source: RBA - can use 6.5% for all)
9. selling_costs_percent: _____% (Source: ________)
10. loan_cost_basis_points: _____ bps (Source: ________)
11. strata_fee_percent: _____% (Source: ________ - use 0% for houses)
```

**Repeat for:** VIC, QLD, SA, WA, TAS, ACT, NT

---

## Tips

1. **Use defaults where reasonable:** Some metrics don't need state-specific values
2. **Start with NSW:** Most data available, use as template
3. **Focus on council rates and vacancy:** These vary most by state
4. **Rent growth:** Can use same sources as benchmark_data you already collected
5. **Interest rates:** Same for all states (RBA rate)

---

## Total Records Needed

**88 records total:**
- 8 states
- × 11 metrics each
- = 88 INSERT statements

---

## Next Steps

1. Start with NSW (fill out all 11 metrics)
2. Use as template for other states
3. Adjust state-specific values where needed
4. When complete, I'll create the SQL INSERT statements

Ready to start? Begin with NSW and work through each state systematically!










