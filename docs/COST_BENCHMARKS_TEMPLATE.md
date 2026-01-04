# Cost Benchmarks Collection Template

Fill out this template for all 8 states × 11 metrics = 88 records.

---

## Quick Start

**Property Type:** `established` (most common property type)  
**Records needed:** 88 total (8 states × 11 metrics)

---

## Master Template - Fill Out All States

Copy this table and fill in the values. Start with NSW and work through each state.

```
State | Property Type | Metric | Value | Unit | Data Source | Notes
------|---------------|--------|-------|------|-------------|------
NSW   | established   | council_rate_percent | | percent | |
NSW   | established   | insurance_percent | | percent | |
NSW   | established   | maintenance_percent | | percent | |
NSW   | established   | vacancy_rate_percent | | percent | |
NSW   | established   | management_fee_percent | | percent | |
NSW   | established   | letting_fee_weeks | | weeks | |
NSW   | established   | rent_growth_percent | | percent | |
NSW   | established   | interest_rate_percent | | percent | |
NSW   | established   | selling_costs_percent | | percent | |
NSW   | established   | loan_cost_basis_points | | basis_points | |
NSW   | established   | strata_fee_percent | | percent | |

[Repeat above for: VIC, QLD, SA, WA, TAS, ACT, NT]
```

---

## Default Values Reference

Use these as starting points (from code):

| Metric | Default | Unit | Can Use Default? |
|--------|---------|------|------------------|
| council_rate_percent | 0.3% | percent | ❌ Varies by state/council |
| insurance_percent | 0.2% | percent | ✅ Relatively consistent |
| maintenance_percent | 1.5% | percent | ✅ Use 1.5% for established |
| vacancy_rate_percent | 5.0% | percent | ❌ Varies by market |
| management_fee_percent | 8.0% | percent | ✅ Industry standard |
| letting_fee_weeks | 2.0 | weeks | ✅ Industry standard |
| rent_growth_percent | 3.0% | percent | ❌ Varies by state |
| interest_rate_percent | 6.5% | percent | ✅ Same for all (RBA rate) |
| selling_costs_percent | 4.0% | percent | ✅ Industry standard |
| loan_cost_basis_points | 10.0 | basis_points | ✅ Industry standard |
| strata_fee_percent | 0.0% | percent | ✅ Use 0% for houses |

---

## Simplified Collection Strategy

### Step 1: Fill in Constants (Same for All States)

These can be the same for all states:
- **insurance_percent:** 0.2% (or state average if known)
- **management_fee_percent:** 8.0% (industry standard)
- **letting_fee_weeks:** 2.0 weeks
- **interest_rate_percent:** 6.5% (RBA rate - same for all)
- **selling_costs_percent:** 4.0% (industry standard)
- **loan_cost_basis_points:** 10.0 bps (standard)
- **strata_fee_percent:** 0.0% (for houses)

### Step 2: Fill in State-Specific Values

These need state-specific research:
- **council_rate_percent:** Varies by state/council
- **vacancy_rate_percent:** Varies by rental market
- **rent_growth_percent:** From rental market data (you already have this from benchmark_data!)
- **maintenance_percent:** Use 1.5% for established (or state-specific if available)

---

## Quick Reference: What Each Metric Means

1. **council_rate_percent:** Annual council rates as % of property value
2. **insurance_percent:** Annual property insurance as % of property value  
3. **maintenance_percent:** Annual maintenance as % of property value (1.5% for established)
4. **vacancy_rate_percent:** Time property is unrented (e.g., 5% = ~18 days/year)
5. **management_fee_percent:** Property management fee as % of rental income
6. **letting_fee_weeks:** One-time letting fee in weeks of rent (typically 2 weeks)
7. **rent_growth_percent:** Annual rent growth rate (can use rental data you already collected)
8. **interest_rate_percent:** Mortgage interest rate (6.5% standard variable)
9. **selling_costs_percent:** Total selling costs as % of sale price (typically 4%)
10. **loan_cost_basis_points:** One-time loan costs (10 bps = 0.1% standard)
11. **strata_fee_percent:** Strata/body corporate fees (0% for houses)

---

## State-by-State Fill-Out Guide

### NSW
```
1. council_rate_percent: _____% (Source: ________)
2. insurance_percent: 0.2% (or _____% if state-specific)
3. maintenance_percent: 1.5% (or _____% if state-specific)
4. vacancy_rate_percent: _____% (Source: ________)
5. management_fee_percent: 8.0% (or _____% if state-specific)
6. letting_fee_weeks: 2.0 weeks
7. rent_growth_percent: _____% (Use rental data you collected)
8. interest_rate_percent: 6.5% (RBA rate)
9. selling_costs_percent: 4.0% (industry standard)
10. loan_cost_basis_points: 10.0 bps (standard)
11. strata_fee_percent: 0.0% (for houses)
```

Repeat for: VIC, QLD, SA, WA, TAS, ACT, NT

---

## Helpful Tips

1. **Council rates:** Check state local government websites or use 0.3-0.6% as range
2. **Vacancy rates:** Can estimate from rental market strength (strong = 2-3%, weaker = 5-8%)
3. **Rent growth:** You already collected capital growth data - rent growth often correlates
4. **Constants:** Many metrics are industry standards - can use same values for all states
5. **Start with defaults:** Use defaults where reasonable, only research state-specific variations

---

## Minimal Collection Approach

If you want to start quickly:

1. **Use defaults** for: insurance, management fee, letting fee, interest rate, selling costs, loan costs, strata fee
2. **Research only:** council rates, vacancy rates, rent growth (state-specific)
3. **Use 1.5%** for maintenance (established property standard)

This reduces research to ~3 metrics per state instead of 11!

---

## Ready to Start?

1. Open the template above
2. Start with NSW
3. Fill in all 11 metrics
4. Use as template for other states
5. Adjust state-specific values where needed

Once you have all 8 states filled out, let me know and I'll create the SQL INSERT statements!










