# Suburb Benchmarks - Quick Summary

## Overview

This is a summary of the plan for implementing suburb-specific market benchmarks. The full detailed plan is in `SUBURB_BENCHMARKS_PLAN.md`.

---

## Current Status

✅ **What's Already Done:**
- Database schema supports suburb-level data (`benchmark_data` table)
- API endpoint has suburb lookup and fallback logic
- Address parser can extract suburb/postcode from addresses
- State-level benchmarks exist for all 8 states

❌ **What's Missing:**
- No suburb-level data currently in the database
- Need to collect and upload suburb benchmarks

---

## The Plan in 3 Steps

### Step 1: Collect Data for Priority Suburbs (65 suburbs)
**Target:** Major capital city suburbs
- Sydney: 20 suburbs
- Melbourne: 20 suburbs
- Brisbane: 10 suburbs
- Perth: 5 suburbs
- Adelaide: 5 suburbs
- Canberra: 5 suburbs

**Timeline:** 2-3 weeks

### Step 2: Validate & Upload
**Actions:**
- Validate data quality (minimum score 7/10)
- Create SQL INSERT statements
- Upload to production database

**Timeline:** 1 week

### Step 3: Test & Expand
**Actions:**
- Test API endpoint with suburb queries
- Verify calculator uses suburb data correctly
- Expand to more suburbs (100+)

**Timeline:** Ongoing

---

## Key Metrics to Collect

For each suburb, collect:

1. **Rental Yield:**
   - Median weekly rent ($)
   - Median property value ($)
   - Gross rental yield (%)
   - Net rental yield (%)

2. **Capital Growth:**
   - 5-year capital growth (% p.a.)
   - 10-year capital growth (% p.a.)

3. **Metadata:**
   - Data source
   - Quality score (1-10)
   - Notes

---

## Data Sources

### Free Sources (Recommended to Start)
- **Domain**: Market reports and rental data
- **realestate.com.au/PropTrack**: Market insights
- **ABS**: Census and property statistics
- **Real Estate Institutes**: Quarterly market reports

### Premium Sources (Future)
- **CoreLogic**: Most comprehensive (subscription required)
- **API Integration**: For automated updates

**Recommendation:** Start with free sources, validate the approach, then consider premium APIs if needed.

---

## Priority Suburbs (Phase 1)

### Sydney (20)
Inner: Surry Hills, Potts Point, Newtown, Paddington, Pyrmont  
Eastern: Bondi, Coogee, Randwick, Maroubra  
Northern: Manly, Mosman, North Sydney, Chatswood  
Western: Parramatta, Blacktown, Penrith  
Lower North Shore: Neutral Bay, Cremorne, Crows Nest

### Melbourne (20)
Inner: Richmond, Fitzroy, South Yarra, St Kilda, Carlton  
Eastern: Hawthorn, Camberwell, Box Hill, Doncaster  
Northern: Northcote, Brunswick, Coburg, Reservoir  
Western: Footscray, Yarraville, Werribee

### Brisbane (10)
Inner: Fortitude Valley, New Farm, Teneriffe, South Brisbane  
Northern: Chermside, Nundah, North Lakes  
Southern: Sunnybank, Mount Gravatt

### Perth (5)
Inner: Northbridge, Subiaco, Leederville  
Coastal: Scarborough, Fremantle

### Adelaide (5)
Inner: Adelaide CBD, North Adelaide, Norwood  
Coastal: Glenelg

### Canberra (5)
Inner North: Braddon, Turner, Dickson  
Inner South: Kingston, Griffith

---

## Data Collection Process

### Quick Workflow

1. **Research Suburb**
   - Find median rent from Domain/realestate.com.au
   - Find median property value from CoreLogic/Domain reports
   - Calculate gross rental yield
   - Find capital growth data

2. **Validate Data**
   - Cross-reference 2-3 sources
   - Check against expected ranges
   - Assign quality score

3. **Record Data**
   - Use the collection template (see `SUBURB_DATA_COLLECTION_TEMPLATE.md`)
   - Document sources
   - Note any caveats

4. **Create SQL**
   - Convert to SQL INSERT statements
   - Include all required fields
   - Test in staging first

---

## Expected Timeline

| Phase | Duration | Activities |
|-------|----------|-----------|
| **Planning** | Week 1 | Finalize suburb list, set up templates |
| **Collection** | Weeks 2-3 | Research and collect data for 65 suburbs |
| **Validation** | Week 4 | Validate, create SQL, test |
| **Launch** | Week 5 | Upload to production, test API |
| **Expansion** | Ongoing | Add more suburbs, consider automation |

**Total Phase 1: 4-5 weeks**

---

## Data Quality Standards

### Minimum Requirements
- **Quality Score**: Minimum 7/10 for production
- **Data Sources**: At least 2 sources for validation
- **Recency**: Within 6 months (prefer < 3 months)
- **Completeness**: All required fields populated

### Quality Score Guide
- **10**: Multiple authoritative sources (CoreLogic + ABS), very recent
- **9**: Authoritative source (CoreLogic), recent (< 3 months)
- **8**: Industry source (Domain), recent (< 6 months)
- **7**: Public sources, recent, cross-validated
- **< 7**: Not recommended for production

---

## Expected Results

After Phase 1 completion:

✅ **65 suburb records** in the database  
✅ **API endpoint** returns suburb-specific data when available  
✅ **Calculator** uses suburb benchmarks when suburb is provided  
✅ **Fallback logic** works (suburb → state → defaults)  
✅ **Foundation** for future expansion

---

## Next Steps

### Immediate Actions

1. **Review the Full Plan**
   - Read `SUBURB_BENCHMARKS_PLAN.md` for complete details
   - Review priority suburb list
   - Confirm timeline expectations

2. **Set Up Collection**
   - Review `SUBURB_DATA_COLLECTION_TEMPLATE.md`
   - Create spreadsheet based on template
   - Bookmark data source websites

3. **Start Collection (Optional)**
   - Begin with 5-10 test suburbs
   - Validate collection process
   - Refine methodology

### Questions to Answer

1. **Scope**: Does the 65-suburb Phase 1 target work?
2. **Timeline**: Is 4-5 weeks acceptable?
3. **Approach**: Manual collection first, or invest in API integration?
4. **Priority**: Any specific suburbs you want to prioritize based on your users?

---

## Files Reference

- **Full Plan**: `SUBURB_BENCHMARKS_PLAN.md` - Comprehensive implementation plan
- **Collection Template**: `SUBURB_DATA_COLLECTION_TEMPLATE.md` - Data collection guide
- **This Summary**: `SUBURB_BENCHMARKS_SUMMARY.md` - Quick reference

---

## Key Decisions Needed

Before starting collection, please confirm:

- [ ] **Suburb List**: Approve the 65 priority suburbs or suggest changes
- [ ] **Timeline**: Confirm 4-5 week timeline is acceptable
- [ ] **Approach**: Manual collection first (recommended) vs API integration
- [ ] **Resources**: Who will collect the data? (Internal team or external)
- [ ] **Budget**: Any budget for premium data sources (CoreLogic API)?

---

**Status:** Ready to begin Phase 1 when approved! 🚀










