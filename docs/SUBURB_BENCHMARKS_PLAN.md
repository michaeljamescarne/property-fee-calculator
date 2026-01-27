# Suburb-Specific Market Benchmarks - Implementation Plan

## Executive Summary

This plan outlines the strategy for implementing suburb-level market benchmarks to complement the existing state-level benchmark data. Suburb-level data will provide more accurate and localized benchmarks for property investment calculations.

**Current State:**
- ✅ Database schema already supports suburb-level data (`benchmark_data` table)
- ✅ API endpoint has fallback logic (suburb → state → null)
- ✅ Address parser can extract suburb/postcode
- ✅ State-level benchmarks exist for all 8 states
- ❌ No suburb-level data currently populated

**Goal:**
Implement suburb-specific benchmarks for major Australian suburbs to provide more accurate local market data.

---

## Table of Contents

1. [Overview & Objectives](#overview--objectives)
2. [Data Requirements](#data-requirements)
3. [Priority & Scope](#priority--scope)
4. [Data Sources & Collection Strategy](#data-sources--collection-strategy)
5. [Database Schema (Already Complete)](#database-schema-already-complete)
6. [Implementation Phases](#implementation-phases)
7. [Data Collection Methodology](#data-collection-methodology)
8. [Data Quality Standards](#data-quality-standards)
9. [Maintenance & Update Strategy](#maintenance--update-strategy)
10. [Challenges & Solutions](#challenges--solutions)
11. [Cost Considerations](#cost-considerations)
12. [Timeline & Milestones](#timeline--milestones)

---

## Overview & Objectives

### Primary Objectives

1. **Provide Granular Market Data**: Move from state-level to suburb-level benchmarks for major markets
2. **Improve Calculator Accuracy**: Enable more precise investment calculations based on local market conditions
3. **Competitive Advantage**: Offer detailed suburb insights that differentiate from generic calculators
4. **Scalable Foundation**: Build infrastructure that can expand to cover more suburbs over time

### Success Metrics

- **Coverage**: 50-100 major suburbs in Phase 1
- **Data Quality**: Minimum 8/10 quality score for all suburb data
- **Usage**: Suburb-level data used in 30%+ of calculations (where suburb is specified)
- **Accuracy**: Suburb benchmarks within 2% of actual market values

---

## Data Requirements

### Metrics to Collect Per Suburb

Based on the existing `benchmark_data` table structure:

#### 1. Rental Yield Benchmarks
- **Gross Rental Yield** (%): Annual rent / Property value × 100
- **Net Rental Yield** (%): (Annual rent - Annual costs) / Property value × 100
- **Median Weekly Rent** (AUD): Median rental price per week

#### 2. Capital Growth Benchmarks
- **Capital Growth 5yr** (% p.a.): Average annual capital growth over 5 years
- **Capital Growth 10yr** (% p.a.): Average annual capital growth over 10 years
- **Median Property Value** (AUD): Median property sale price

#### 3. Metadata
- **Data Source**: Primary source of data
- **Last Updated**: Date of data collection
- **Data Quality Score**: 1-10 rating
- **Notes**: Additional context or caveats

### Geographic Identifiers

- **State**: Required (NSW, VIC, QLD, SA, WA, TAS, ACT, NT)
- **Suburb Name**: Required for suburb-level data
- **Postcode**: Recommended (enables postcode-based lookup)

---

## Priority & Scope

### Phase 1: Major Capital Cities (Priority Suburbs)

**Target: 50-100 suburbs across major capital cities**

#### Sydney (NSW) - 20 suburbs
**Priority Criteria:**
- High transaction volume
- Popular investment locations
- Diverse price ranges
- Strategic geographic coverage

**Suggested Suburbs:**
- Inner: Surry Hills, Potts Point, Newtown, Paddington, Pyrmont
- Eastern: Bondi, Coogee, Randwick, Maroubra
- Northern: Manly, Mosman, North Sydney, Chatswood
- Western: Parramatta, Blacktown, Penrith
- Lower North Shore: Neutral Bay, Cremorne, Crows Nest

#### Melbourne (VIC) - 20 suburbs
**Suggested Suburbs:**
- Inner: Richmond, Fitzroy, South Yarra, St Kilda, Carlton
- Eastern: Hawthorn, Camberwell, Box Hill, Doncaster
- Northern: Northcote, Brunswick, Coburg, Reservoir
- Western: Footscray, Yarraville, Werribee

#### Brisbane (QLD) - 10 suburbs
**Suggested Suburbs:**
- Inner: Fortitude Valley, New Farm, Teneriffe, South Brisbane
- Northern: Chermside, Nundah, North Lakes
- Southern: Sunnybank, Mount Gravatt

#### Perth (WA) - 5 suburbs
**Suggested Suburbs:**
- Inner: Northbridge, Subiaco, Leederville
- Coastal: Scarborough, Fremantle

#### Adelaide (SA) - 5 suburbs
**Suggested Suburbs:**
- Inner: Adelaide CBD, North Adelaide, Norwood
- Coastal: Glenelg

#### Canberra (ACT) - 5 suburbs
**Suggested Suburbs:**
- Inner North: Braddon, Turner, Dickson
- Inner South: Kingston, Griffith

#### Total Phase 1: ~65 suburbs

### Phase 2: Expansion (Post-Launch)
- Additional suburbs in Phase 1 cities
- Regional centers (Newcastle, Gold Coast, Sunshine Coast, Geelong, Wollongong)
- Emerging markets

### Phase 3: Comprehensive Coverage
- All suburbs with sufficient transaction volume
- Regional areas with investment activity

---

## Data Sources & Collection Strategy

### Primary Data Sources

#### 1. CoreLogic (Recommended - Premium)
**Pros:**
- Most comprehensive and reliable
- Historical data available
- Professional-grade accuracy
- Industry standard

**Cons:**
- Paid subscription required
- API access may have usage limits

**Data Available:**
- Median property values
- Rental yields (gross and net)
- Capital growth rates
- Transaction volumes

**Access Method:**
- API integration (if available)
- Manual data export
- Professional subscription

#### 2. Domain / realestate.com.au
**Pros:**
- Free/public data available
- Good coverage of rental markets
- Recent data (monthly updates)

**Cons:**
- Less comprehensive than CoreLogic
- Manual collection required
- May require web scraping (check ToS)

**Data Available:**
- Rental listings and prices
- Sale prices (recent listings)
- Market trends

**Access Method:**
- Public listings analysis
- Market reports
- API (if available)

#### 3. Australian Bureau of Statistics (ABS)
**Pros:**
- Free and authoritative
- Historical data
- Census data (every 5 years)

**Cons:**
- Less frequent updates
- May not have suburb-level granularity
- Statistical Areas (SA) rather than suburbs

**Data Available:**
- Median household income
- Population data
- Property statistics (at SA level)

**Access Method:**
- ABS website
- Data downloads
- API access

#### 4. Real Estate Institutes (REI)
**Pros:**
- Local market expertise
- Regular market reports
- Free public reports

**Cons:**
- Varies by state
- May require manual collection
- Less standardized format

**Data Available:**
- Quarterly market reports
- Median prices by suburb
- Rental statistics

**Access Method:**
- State REI websites
- Quarterly reports
- Press releases

#### 5. PropTrack / REA Group
**Pros:**
- Free market insights
- Good coverage
- Regular updates

**Cons:**
- Less detailed than premium sources
- Manual collection

**Data Available:**
- Market trends
- Price indexes
- Rental data

### Data Collection Strategy

#### Option A: Manual Collection (Phase 1)
**Approach:**
- Research and compile data from free sources
- Use market reports and public data
- Verify across multiple sources

**Pros:**
- No subscription costs
- Full control over data quality
- Can start immediately

**Cons:**
- Time-intensive
- Requires ongoing manual updates
- Less comprehensive

**Estimated Time:** 10-15 hours for 65 suburbs

#### Option B: API Integration (Phase 2+)
**Approach:**
- Integrate with CoreLogic or similar API
- Automated data collection
- Scheduled updates

**Pros:**
- Automated and scalable
- Regular updates
- Comprehensive data

**Cons:**
- Subscription costs ($500-$2000/month)
- Requires development time
- API limitations

#### Option C: Hybrid Approach (Recommended)
**Approach:**
- Phase 1: Manual collection for priority suburbs
- Phase 2: API integration for automated updates and expansion

**Pros:**
- Immediate start with manual data
- Scalable with automation
- Cost-effective progression

---

## Database Schema (Already Complete)

The database schema already supports suburb-level data. Key points:

### Table: `benchmark_data`

```sql
-- Key fields for suburb-level data
state australian_state NOT NULL,
suburb_name TEXT, -- NULL for state-level, populated for suburb-level
postcode TEXT,
gross_rental_yield DECIMAL(5, 2),
net_rental_yield DECIMAL(5, 2),
median_weekly_rent DECIMAL(10, 2),
capital_growth_5yr DECIMAL(5, 2),
capital_growth_10yr DECIMAL(5, 2),
median_property_value DECIMAL(12, 2),
data_source TEXT,
last_updated DATE,
data_quality_score INTEGER (1-10),
notes TEXT,
is_active BOOLEAN
```

### Indexes (Already Created)
- `idx_benchmark_data_suburb` on `suburb_name` (where NOT NULL)
- `idx_benchmark_data_postcode` on `postcode`
- Unique constraint on `(state, suburb_name, postcode)`

### API Endpoint (Already Implemented)
- `/api/benchmarks?state=NSW&suburb=Surry Hills&postcode=2010`
- Fallback logic: suburb → state → null

**No schema changes required!** ✅

---

## Implementation Phases

### Phase 1: Foundation & Priority Suburbs (Weeks 1-4)

#### Week 1: Planning & Research
- [ ] Finalize suburb list (65 priority suburbs)
- [ ] Identify primary data sources
- [ ] Create data collection template
- [ ] Set up data validation processes

#### Week 2-3: Data Collection
- [ ] Collect data for Sydney suburbs (20)
- [ ] Collect data for Melbourne suburbs (20)
- [ ] Collect data for Brisbane suburbs (10)
- [ ] Collect data for Perth suburbs (5)
- [ ] Collect data for Adelaide suburbs (5)
- [ ] Collect data for Canberra suburbs (5)

#### Week 4: Data Entry & Validation
- [ ] Validate all data points
- [ ] Cross-reference with multiple sources
- [ ] Assign quality scores
- [ ] Create SQL INSERT statements
- [ ] Test data in staging environment

**Deliverable:** 65 suburb records ready for production

### Phase 2: Production Launch & Testing (Week 5)

- [ ] Upload suburb data to production
- [ ] Test API endpoint with suburb queries
- [ ] Verify fallback logic works correctly
- [ ] Test calculator with suburb-level data
- [ ] Monitor for any issues

**Deliverable:** Suburb benchmarks live in production

### Phase 3: Expansion & Automation (Weeks 6-12)

- [ ] Add 50-100 more suburbs
- [ ] Evaluate API integration options
- [ ] Implement automated data collection (if API available)
- [ ] Set up scheduled update process
- [ ] Expand to regional centers

**Deliverable:** 100+ suburbs with automated updates

---

## Data Collection Methodology

### Step-by-Step Collection Process

#### 1. Suburb Selection
- Verify suburb name spelling (use official council names)
- Confirm postcode(s) for the suburb
- Note any variations or multi-postcode suburbs

#### 2. Data Research

For each suburb, collect:

**A. Rental Yield Data:**
1. Find median weekly rent from Domain/realestate.com.au
2. Find median property value from CoreLogic/PropTrack
3. Calculate gross rental yield: `(weekly_rent × 52) / property_value × 100`
4. Estimate net rental yield (subtract estimated costs ~30-40%)

**B. Capital Growth Data:**
1. Find 5-year capital growth from CoreLogic/Domain reports
2. Find 10-year capital growth if available
3. Verify with multiple sources

**C. Median Values:**
1. Median property value (houses, or unit/house split if available)
2. Median weekly rent
3. Note property type focus (e.g., "Established houses")

#### 3. Data Validation

**Cross-Reference:**
- Compare values across 2-3 sources
- Check against state averages (should be reasonable)
- Look for outliers and investigate

**Quality Checks:**
- Rental yield typically 2-6% for major cities
- Capital growth typically 3-10% p.a. (long-term)
- Values should align with known market trends

#### 4. Data Recording

Use this template for each suburb:

```
Suburb: [Name]
Postcode: [Code]
State: [NSW/VIC/etc.]

Rental Yield:
- Median Weekly Rent: $[amount]
- Median Property Value: $[amount]
- Gross Rental Yield: [%]
- Net Rental Yield: [%]

Capital Growth:
- 5-year Capital Growth: [% p.a.]
- 10-year Capital Growth: [% p.a.]

Data Sources:
- [Source 1] - [Date]
- [Source 2] - [Date]

Quality Score: [1-10]
Notes: [Any caveats or context]
```

---

## Data Quality Standards

### Quality Score Criteria

| Score | Criteria |
|-------|----------|
| **10** | Multiple authoritative sources (CoreLogic + ABS), recent (< 1 month), large sample size |
| **9** | Authoritative source (CoreLogic/Domain), recent (< 3 months), good sample size |
| **8** | Industry source (REI/Domain), recent (< 6 months), reasonable sample size |
| **7** | Public source (realestate.com.au), recent (< 6 months), adequate sample |
| **6** | Multiple sources agree, but older (6-12 months) or smaller sample |
| **5** | Single source, older data (> 12 months), or estimated |
| **< 5** | Not recommended - too uncertain or outdated |

### Minimum Quality Thresholds

- **Production Data**: Minimum quality score of **7**
- **Pilot Data**: Minimum quality score of **6** (with notes)

### Data Completeness Requirements

**Required Fields:**
- State ✅
- Suburb name ✅
- Postcode ✅ (highly recommended)
- Gross rental yield ✅
- Median property value ✅

**Optional but Recommended:**
- Net rental yield
- Capital growth (5yr and/or 10yr)
- Median weekly rent

**Minimum Viable Record:**
- State + Suburb + Gross Rental Yield + Median Value

---

## Maintenance & Update Strategy

### Update Frequency

| Metric | Recommended Update Frequency | Rationale |
|--------|------------------------------|-----------|
| **Rental Yields** | Quarterly | Rental markets change seasonally |
| **Median Property Values** | Quarterly | Property markets change gradually |
| **Capital Growth** | Annually | Long-term trends need time to develop |
| **All Metrics** | Minimum: Annually | Keep data reasonably current |

### Update Process

#### Manual Updates (Phase 1)
1. Quarterly review of priority suburbs
2. Update markets showing significant changes (>5% variance)
3. Refresh all data annually

#### Automated Updates (Phase 2+)
1. API integration for monthly/quarterly updates
2. Automated quality checks
3. Alerts for significant changes
4. Admin approval workflow for updates

### Data Versioning

- Track `last_updated` date for each record
- Keep historical data (archive old records, don't delete)
- Use `version` field for major updates

### Monitoring

- Track API usage (suburb vs state queries)
- Monitor data freshness (flag records > 12 months old)
- User feedback on data accuracy

---

## Challenges & Solutions

### Challenge 1: Suburb Name Variations
**Problem:** Suburbs may be spelled differently or have variations (e.g., "St. Kilda" vs "St Kilda")

**Solutions:**
- Use standardized suburb names (official council names)
- Store variations in notes field
- Improve address parser to handle variations
- Use fuzzy matching in API queries

### Challenge 2: Multi-Postcode Suburbs
**Problem:** Some suburbs span multiple postcodes (e.g., Parramatta has 2150, 2151)

**Solutions:**
- Use primary postcode for the suburb
- Note multiple postcodes in notes field
- Store separate records for major postcode variations if values differ significantly

### Challenge 3: Property Type Mix
**Problem:** Suburbs may have different values for houses vs units

**Solutions:**
- Focus on "established houses" as primary benchmark (most common)
- Note property type mix in notes field
- Consider separate records for house vs unit if data available

### Challenge 4: Data Availability
**Problem:** Some suburbs may lack sufficient data

**Solutions:**
- Start with high-transaction suburbs
- Use postcode-level data if suburb-level unavailable
- Mark quality score appropriately
- Fallback to state-level data

### Challenge 5: Rapid Market Changes
**Problem:** Property markets can change quickly

**Solutions:**
- Regular update schedule (quarterly minimum)
- Track data freshness
- Alert on significant changes
- Include date context in UI

---

## Cost Considerations

### Phase 1: Manual Collection (Low Cost)
- **Time Investment**: 10-15 hours
- **Data Sources**: Free (Domain, realestate.com.au, ABS)
- **Cost**: $0 (time only)

### Phase 2: API Integration (Medium Cost)
- **CoreLogic API**: ~$500-2000/month (estimated)
- **Development Time**: 20-40 hours
- **Ongoing**: Subscription costs

### Phase 3: Full Automation (Higher Cost)
- **Multiple Data Sources**: $1000-3000/month
- **Infrastructure**: Minimal (Supabase handles storage)
- **Maintenance**: 2-4 hours/month

### Recommendation

**Start with Phase 1 (Manual)** - Validate demand and data quality before investing in APIs.

---

## Timeline & Milestones

### Milestone 1: Planning Complete (Week 1)
- [x] Finalize suburb list
- [x] Identify data sources
- [ ] Create collection templates
- [ ] Set up validation processes

### Milestone 2: Data Collection Complete (Week 4)
- [ ] All 65 priority suburbs researched
- [ ] Data validated and quality scored
- [ ] SQL INSERT statements ready

### Milestone 3: Production Launch (Week 5)
- [ ] Data uploaded to production
- [ ] API tested and verified
- [ ] Calculator tested with suburb data
- [ ] Documentation updated

### Milestone 4: Expansion (Weeks 6-12)
- [ ] 100+ suburbs covered
- [ ] API integration evaluated
- [ ] Automated updates implemented (if applicable)
- [ ] Regional centers added

---

## Next Steps

### Immediate Actions (This Week)

1. **Review & Approve Plan**
   - Review suburb priority list
   - Confirm data collection approach
   - Set timeline expectations

2. **Create Data Collection Template**
   - Excel/Google Sheets template for suburb data
   - Include all required fields
   - Add validation rules

3. **Set Up Data Sources**
   - Bookmark key data source websites
   - Test data accessibility
   - Document collection process

4. **Begin Phase 1 Collection**
   - Start with 5-10 test suburbs
   - Validate collection process
   - Refine methodology

### Questions to Address

1. **Scope Confirmation**: Are 65 suburbs in Phase 1 the right target?
2. **Timeline**: Is 4-5 week timeline acceptable?
3. **Data Sources**: Any preference on manual vs API approach?
4. **Priority Suburbs**: Should we adjust the suburb list based on your user base?

---

## Appendix

### A. Suburb Data Collection Template

[See separate template file: `SUBURB_DATA_COLLECTION_TEMPLATE.md`]

### B. Data Source Links

**CoreLogic:**
- https://www.corelogic.com.au/

**Domain:**
- https://www.domain.com.au/
- Market reports: https://www.domain.com.au/research/

**realestate.com.au:**
- https://www.realestate.com.au/
- PropTrack reports: https://www.proptrack.com.au/

**ABS:**
- https://www.abs.gov.au/
- Census data: https://www.abs.gov.au/statistics/people/population

**REI Websites:**
- REINSW: https://www.reinsw.com.au/
- REIV: https://www.reiv.com.au/
- REIQ: https://www.reiq.com.au/

### C. Example SQL INSERT

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
    'Surry Hills',
    '2010',
    3.20,
    2.10,
    750.00,
    5.50,
    6.20,
    1200000.00,
    'CoreLogic + Domain - January 2025',
    CURRENT_DATE,
    9,
    'Established houses - Inner city location, high demand',
    true
);
```

---

**Document Status:** Draft for Review
**Last Updated:** January 2025
**Next Review:** After Phase 1 completion












