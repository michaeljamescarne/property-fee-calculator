# Macro Benchmarks - Data Collection

Let's start here with the 8 macro benchmark records.

---

## Fill Out This Table

| # | Category | Metric | Value | Unit | Data Source | Refresh Cadence | Notes |
|---|----------|--------|-------|------|-------------|-----------------|-------|
| 1 | investment | asx_total_return | _____ | percent | _____________ | quarterly | |
| 2 | investment | term_deposit_rate | _____ | percent | _____________ | monthly | |
| 3 | investment | bond_rate | _____ | percent | _____________ | monthly | |
| 4 | investment | savings_rate | _____ | percent | _____________ | monthly | |
| 5 | tax | cgt_withholding | _____ | percent | _____________ | annually | |
| 6 | tax | default_marginal_tax_rate | _____ | percent | _____________ | annually | |
| 7 | financing | default_interest_rate | _____ | percent | _____________ | monthly | |
| 8 | financing | inflation_rate | _____ | percent | _____________ | quarterly | |

---

## Current Default Values (January 2025)

Use these as starting points. Research and update with current values:

| Metric | Default Value | Where to Find Current Value |
|--------|---------------|----------------------------|
| **asx_total_return** | 7.2% | ASX website - 5-year average total return (capital gains + dividends) |
| **term_deposit_rate** | 4.0% | RBA website or bank comparison sites - 1-year term deposit rates |
| **bond_rate** | 4.5% | RBA website - 10-year Australian Government Bond yield |
| **savings_rate** | 4.5% | RBA website or bank comparison sites - high interest savings accounts |
| **cgt_withholding** | 12.5% | ATO website - fixed rate for non-resident CGT withholding |
| **default_marginal_tax_rate** | 37.0% | ATO website - tax bracket for $120k-$180k income |
| **default_interest_rate** | 6.5% | RBA cash rate + typical bank margin (currently ~3% + margin) |
| **inflation_rate** | 3.0% | ABS website - latest CPI annual rate |

---

## Quick Research Guide

### 1. ASX Total Return (asx_total_return)
- **Source:** ASX website
- **What to find:** 5-year average total return (includes dividends)
- **Default:** 7.2%
- **Your value:** _____%

### 2. Term Deposit Rate (term_deposit_rate)
- **Source:** RBA website or bank comparison sites
- **What to find:** Current 1-year term deposit interest rate
- **Default:** 4.0%
- **Your value:** _____%

### 3. Bond Rate (bond_rate)
- **Source:** RBA website
- **What to find:** Current 10-year Australian Government Bond yield
- **Default:** 4.5%
- **Your value:** _____%

### 4. Savings Rate (savings_rate)
- **Source:** RBA website or bank comparison sites
- **What to find:** High interest savings account rate
- **Default:** 4.5%
- **Your value:** _____%

### 5. CGT Withholding (cgt_withholding)
- **Source:** ATO website
- **What to find:** Non-resident capital gains tax withholding rate (usually fixed)
- **Default:** 12.5%
- **Your value:** _____%

### 6. Default Marginal Tax Rate (default_marginal_tax_rate)
- **Source:** ATO website
- **What to find:** Marginal tax rate for $120k-$180k income bracket
- **Default:** 37.0%
- **Your value:** _____%

### 7. Default Interest Rate (default_interest_rate)
- **Source:** RBA website
- **What to find:** Current cash rate + typical bank margin (~2-3%)
- **Default:** 6.5%
- **Your value:** _____%

### 8. Inflation Rate (inflation_rate)
- **Source:** ABS website (latest CPI release)
- **What to find:** Annual CPI inflation rate
- **Default:** 3.0%
- **Your value:** _____%

---

## Action Items

1. **Research each value** - Use the sources listed above
2. **Fill out the table** - Write values directly in this document
3. **Document sources** - Note where you got each value
4. **When complete** - We'll create the SQL INSERT statements

---

## Ready to Start?

Begin with item #1 (asx_total_return) and work your way through all 8 metrics. Once you have all the values filled in, let me know and I'll create the SQL INSERT statements for you!




