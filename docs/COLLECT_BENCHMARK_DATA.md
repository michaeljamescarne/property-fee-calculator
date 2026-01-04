# Collect Benchmark Data - State-Level Rental Yields & Capital Growth

Step-by-step guide to collect state-level benchmark data for all 8 Australian states.

---

## What We're Collecting

**Table:** `benchmark_data`  
**Records needed:** 8 (one per state)  
**Level:** State-level (suburb data can be added later)

---

## Data Fields to Collect

For each state, you need:

1. **Gross Rental Yield** - Percentage (e.g., 3.50 for 3.5%)
2. **Net Rental Yield** - Percentage (after costs)
3. **Median Weekly Rent** - AUD (e.g., 650.00)
4. **Capital Growth 5yr** - Percentage per annum (e.g., 6.50 for 6.5% p.a.)
5. **Capital Growth 10yr** - Percentage per annum
6. **Median Property Value** - AUD (e.g., 950000.00)
7. **Data Source** - Where you got the data
8. **Data Quality Score** - 1-10 rating

---

## Collection Template

Fill out this table for each state:

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

---

## Data Sources

### Primary Sources

**1. CoreLogic**
- **Website:** https://www.corelogic.com.au/
- **What to find:** Rental yields, capital growth, median values
- **Access:** May require subscription, or check public reports

**2. Domain**
- **Website:** https://www.domain.com.au/
- **What to find:** 
  - Go to "Research" section
  - State-level property reports
  - Rental yields, median prices, growth rates

**3. RealEstate.com.au**
- **Website:** https://www.realestate.com.au/
- **What to find:** Property statistics and market reports

**4. ABS (Australian Bureau of Statistics)**
- **Website:** https://www.abs.gov.au/
- **What to find:** Census data, property statistics
- **Search:** "Residential Property Price Indexes" or "Census property data"

**5. SQM Research**
- **Website:** https://sqmresearch.com.au/
- **What to find:** Rental yields, capital growth, market data
- **Note:** Some data may require subscription

---

## How to Find Each Field

### 1. Gross Rental Yield

**Formula:** (Annual Rent / Property Value) × 100

**Where to find:**
- CoreLogic reports - "Gross rental yield"
- Domain Research - "Rental yield"
- RealEstate.com.au statistics
- SQM Research - "Gross rental yield"

**Example:** If annual rent is $33,800 and property value is $950,000
- Gross Yield = ($33,800 / $950,000) × 100 = 3.56%

---

### 2. Net Rental Yield

**Formula:** ((Annual Rent - Annual Costs) / Property Value) × 100

**Where to find:**
- CoreLogic reports - "Net rental yield"
- SQM Research - "Net rental yield"
- May need to calculate from gross yield minus typical costs (5-8%)

**Example:** If gross yield is 3.5% and costs are ~1.5% of property value
- Net Yield = 3.5% - 1.5% = 2.0%

**Tip:** If you can't find net yield, use gross yield minus 1-1.5% as an estimate

---

### 3. Median Weekly Rent

**Where to find:**
- Domain - "Median weekly rent" by state
- RealEstate.com.au - Rental statistics
- ABS - Census rental data
- CoreLogic - Median rental prices

**Example:** $650/week = $650.00

---

### 4. Capital Growth 5yr

**What we need:** Average annual capital growth rate over the last 5 years

**Where to find:**
- CoreLogic - "5-year capital growth" or "Annual growth rate"
- Domain Research - "5-year capital growth"
- RealEstate.com.au - Market trends
- SQM Research - Capital growth data

**Example:** If property values increased from $800k to $1,000k over 5 years:
- Total growth = (1,000,000 / 800,000) - 1 = 25%
- Annual growth = (1.25 ^ (1/5)) - 1 ≈ 4.56% p.a.

**Look for:** Reports showing "Annual capital growth rate" or "5-year average growth"

---

### 5. Capital Growth 10yr

**What we need:** Average annual capital growth rate over the last 10 years

**Where to find:**
- CoreLogic - "10-year capital growth"
- Domain Research - "10-year capital growth"
- Historical property price data

**Tip:** 10-year growth is often more stable/smoother than 5-year

---

### 6. Median Property Value

**Where to find:**
- Domain - "Median house price" by state
- RealEstate.com.au - Median prices
- CoreLogic - "Median dwelling value"
- ABS - Residential Property Price Indexes

**Example:** $950,000 = 950000.00

---

### 7. Data Source

**What to write:**
- Source name (e.g., "CoreLogic - January 2025")
- Report name if available
- Date of data collection

**Example:** "CoreLogic - Property Market Report, January 2025"

---

### 8. Data Quality Score

**Rate 1-10 based on:**
- **10:** Official government data, recent (< 3 months)
- **9:** Major industry source (CoreLogic, Domain), recent
- **8:** Industry standard, recent
- **7:** Industry standard, 3-6 months old
- **6:** Industry estimate, recent
- **5:** Estimate or older data

**Guideline:**
- CoreLogic/Domain = 8-9
- ABS/RBA = 9-10
- RealEstate.com.au = 7-8
- Industry estimates = 5-6

---

## Research Strategy

### Option 1: Quick Start (Using Public Sources)

1. **Start with Domain** (free, good public data):
   - Go to domain.com.au/research
   - Search for state-level reports
   - Find rental yields, median prices

2. **Check RealEstate.com.au**:
   - Look for state statistics
   - Compare values

3. **Use ABS for official data**:
   - Property price indexes
   - Rental data

### Option 2: Comprehensive (If You Have Access)

1. **CoreLogic** (best data, may require subscription)
2. **SQM Research** (detailed rental yield data)
3. **Cross-reference** multiple sources

---

## Quick Reference: What to Search For

For each state, search:
- "[State] rental yield 2025"
- "[State] median house price 2025"
- "[State] property capital growth 5 years"
- "[State] median weekly rent 2025"

**Example searches:**
- "NSW rental yield 2025"
- "Victoria capital growth 5 years"
- "Queensland median property price"

---

## Example: NSW Data Collection

**Source:** Domain Research, CoreLogic

| Field | Value | Notes |
|-------|-------|-------|
| Gross Rental Yield | 3.50% | From CoreLogic state average |
| Net Rental Yield | 2.50% | Gross minus estimated costs |
| Median Weekly Rent | $650 | Domain median rent |
| Capital Growth 5yr | 6.50% p.a. | CoreLogic 5-year average |
| Capital Growth 10yr | 7.00% p.a. | CoreLogic 10-year average |
| Median Property Value | $950,000 | Domain median house price |
| Data Source | "CoreLogic + Domain, January 2025" | |
| Quality Score | 8 | Major sources, recent |

---

## Collection Checklist

For each state:
- [ ] Gross rental yield found
- [ ] Net rental yield found (or calculated)
- [ ] Median weekly rent found
- [ ] Capital growth 5yr found
- [ ] Capital growth 10yr found
- [ ] Median property value found
- [ ] Data source documented
- [ ] Quality score assigned

**States to complete:**
- [ ] NSW
- [ ] VIC
- [ ] QLD
- [ ] SA
- [ ] WA
- [ ] TAS
- [ ] ACT
- [ ] NT

---

## Tips

1. **Start with major states first:** NSW, VIC, QLD (most data available)
2. **Use multiple sources:** Cross-reference for accuracy
3. **Note dates:** Document when data was published
4. **Estimate if needed:** Net yield can be calculated from gross
5. **Focus on established properties:** Most benchmark data is for established dwellings

---

## Ready to Start?

1. Open the template table above
2. Start with NSW (most data available)
3. Work through each state systematically
4. Document sources as you go

Once you have all 8 states filled out, let me know and I'll create the SQL INSERT statements!

---

## Need Help?

If you can't find specific values:
- Use industry averages as starting points
- Note estimates in the "Data Source" field
- We can refine values later

Good luck with your research! 🎯










