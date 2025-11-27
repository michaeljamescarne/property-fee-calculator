# PRD Comparison: DealCheck.io Feature Analysis

## Overview

This document compares our Property Investment Analysis Platform PRD against [DealCheck.io](https://dealcheck.io/), a leading US property investment analysis tool. The goal is to identify missing features and suggest enhancements to make our platform more competitive.

---

## DealCheck Key Features

### 1. Property Data Import & Automation
- Import property data from public records & active listings
- Auto-populate property description, list price, value estimates, rent estimates, property taxes
- Import property photos
- **Status in PRD**: ❌ Not included - Manual input only

### 2. Comparable Sales (Comps) Lookup
- Recent sales comps lookup
- Rental comps lookup
- Market statistics
- ARV (After Repair Value) estimates
- Rent estimates based on property characteristics
- **Status in PRD**: ⚠️ Mentioned as "not for MVP" - Should reconsider

### 3. Multiple Investment Strategies
- Rental Properties (buy & hold, rehab & hold)
- Airbnb/VRBO/Vacation Rentals
- BRRRR Properties (Buy, Rehab, Rent, Refinance, Repeat)
- Flips & Rehab Projects
- Multi-Family & Commercial Buildings
- Wholesale Deals
- House Hacks
- **Status in PRD**: ⚠️ Limited - Only rental vs short-stay comparison

### 4. Advanced Deal Structuring
- Rehab budget tracking
- Closing costs customization
- Rent roll management (multi-unit)
- Financing options (various loan types)
- Offer calculator (max allowable offer price)
- **Status in PRD**: ⚠️ Partial - Basic loan details, no offer calculator

### 5. Report Types & Sharing
- Interactive online reports
- Marketing reports (for agents/brokers)
- PDF reports
- Custom branding on reports
- Share with lenders, partners, clients
- **Status in PRD**: ⚠️ Partial - PDF only, no marketing variant, basic sharing

### 6. Portfolio Management
- Analyze multiple properties
- Compare properties side-by-side
- Deal portfolio tracking
- **Status in PRD**: ❌ Not included - Single property analysis only

### 7. Mobile Applications
- iOS app
- Android app
- Web browser access
- **Status in PRD**: ⚠️ Post-MVP (v1.3)

### 8. Advanced Analytics
- Cap rate calculations
- Cash-on-cash return
- ROI (multiple types)
- Profit from sale
- Long-term projections (rentals, BRRRR)
- Profit projections (flips)
- **Status in PRD**: ✅ Included - Similar metrics exist

---

## Missing Features & Recommendations

### HIGH PRIORITY - Should Add to PRD

#### 1. Property Data Import & Auto-Population
**Recommendation**: Add to P1 (MVP Important) or P2 (Post-MVP)

**Why Important**:
- Significantly improves user experience
- Reduces data entry errors
- Saves time (key value proposition of DealCheck)
- Competitive necessity

**Implementation**:
- **MVP**: Manual property search with basic data import from:
  - Domain.com.au listings
  - Realestate.com.au listings
  - CoreLogic (if API available)
- **Post-MVP**: Automatic property data import via:
  - Property address lookup
  - Public records integration
  - Listing data APIs

**PRD Addition**:
```markdown
### 2.5 Property Data Import & Auto-Population

#### 2.5.1 Manual Property Search (MVP - P1)
- Search by address or listing ID
- Import from Domain.com.au (if listing URL provided)
- Import from Realestate.com.au (if listing URL provided)
- Auto-populate: property description, price, photos, basic details
- User can verify and edit imported data

#### 2.5.2 Automatic Data Import (Post-MVP - P2)
- Address-based property lookup
- Public records integration
- Automatic property photos import
- Property history (previous sales)
- Automated valuation estimates
```

#### 2. Comparable Sales (Comps) & Market Data
**Recommendation**: Upgrade from "Not for MVP" to P1 (MVP Important)

**Why Important**:
- Users need comps to validate their estimates
- Builds trust in the platform
- Competitive feature (DealCheck emphasizes this)
- Helps with rent and value estimation

**Implementation**:
- **MVP**: Basic comps display from:
  - CoreLogic API (if available)
  - Domain.com.au sold listings (manual research)
  - Realestate.com.au sold listings (manual research)
- Display: Recent sales in area, similar properties, rental listings

**PRD Addition**:
```markdown
### 2.6 Comparable Sales & Market Data

#### 2.6.1 Sales Comps (P1 - MVP Important)
- Recent sales in suburb (last 12 months)
- Similar property types and sizes
- Price per square meter comparison
- Help validate purchase price estimates

#### 2.6.2 Rental Comps (P1 - MVP Important)
- Recent rental listings in area
- Similar property types and sizes
- Weekly rent per bedroom comparison
- Help validate rent estimates

#### 2.6.3 Market Statistics (P1 - MVP Important)
- Suburb median prices
- Suburb median rents
- Price trends (6-month, 12-month)
- Rental yield trends
- Days on market statistics
```

#### 3. Offer Calculator (Max Allowable Offer)
**Recommendation**: Add to P1 (MVP Important)

**Why Important**:
- Helps investors determine maximum offer price
- Reverse calculation (work backwards from desired returns)
- Competitive feature
- High user value

**Implementation**:
- Calculate max offer price based on:
  - Desired ROI
  - Desired cash flow
  - Desired cap rate
  - Desired yield
- Multiple criteria options
- Show "deal score" at different price points

**PRD Addition**:
```markdown
### 2.7 Offer Calculator (Max Allowable Offer)

#### 2.7.1 Purpose
Help investors determine the maximum price they can offer while still meeting their investment criteria.

#### 2.7.2 Calculation Criteria (User Selectable)
- Target ROI (%)
- Target cash flow (annual/monthly)
- Target cap rate (%)
- Target yield (gross/net)
- Target cash-on-cash return (%)

#### 2.7.3 Output
- Maximum allowable offer price
- Deal score at different price points
- Sensitivity analysis (what if seller asks for $X more?)
- Comparison to current list price
```

#### 4. Multiple Investment Strategies
**Recommendation**: Expand beyond rental vs short-stay (Add to P2)

**Why Important**:
- Australian market has different investment strategies
- Some strategies may be more relevant than US BRRRR
- Expands target market

**Australian-Specific Strategies**:
- **Buy & Hold** (existing - rental)
- **Renovate & Hold** (similar to BRRRR but Australian context)
- **Renovate & Sell** (flip)
- **Development** (subdivide, build)
- **Short-Stay** (existing - Airbnb/VRBO)
- **Commercial** (existing but can expand)

**PRD Addition**:
```markdown
### 2.8 Investment Strategy Modes

#### 2.8.1 Buy & Hold (Rental)
- Standard long-term rental analysis
- Current implementation

#### 2.8.2 Renovate & Hold (P2 - Post-MVP)
- Purchase price + renovation costs
- After-renovation value (ARV)
- Refinance calculation
- Rental income post-renovation
- Similar to BRRRR but Australian context

#### 2.8.3 Renovate & Sell (Flip) (P2 - Post-MVP)
- Purchase price + renovation costs
- After-renovation value (ARV)
- Selling costs
- Holding period
- Profit calculation
- Tax implications (CGT)

#### 2.8.4 Development (P2 - Post-MVP)
- Land purchase
- Development costs
- Construction costs
- Final value (subdivided or built)
- Timeline and financing
```

#### 5. Marketing Reports & Custom Branding
**Recommendation**: Add to P1 (MVP Important)

**Why Important**:
- Agents/brokers need to present properties to clients
- Professional presentation builds trust
- Revenue opportunity (premium feature)
- Competitive feature

**Implementation**:
- Marketing report variant (cleaner, less technical)
- Custom branding options:
  - Upload logo
  - Custom color scheme
  - Company name
  - Contact information
- Shareable links (public or private)
- Email reports to clients

**PRD Addition**:
```markdown
### 4.4 Report Variants

#### 4.4.1 Detailed Analysis Report (Existing)
- Comprehensive technical analysis
- All calculations and projections
- For investor decision-making

#### 4.4.2 Marketing Report (P1 - MVP Important)
- Cleaner, less technical presentation
- Focus on key highlights
- Suitable for presenting to clients
- Custom branding options:
  - Company logo
  - Brand colors
  - Contact information
  - Professional formatting

#### 4.4.3 Executive Summary Report (P2 - Post-MVP)
- One-page summary
- Key metrics only
- Quick decision-making
```

#### 6. Property Comparison & Portfolio Management
**Recommendation**: Add to P2 (Post-MVP but plan for it)

**Why Important**:
- Investors often analyze multiple properties
- Helps decision-making
- Portfolio tracking
- Competitive feature

**PRD Addition**:
```markdown
### 2.9 Property Comparison & Portfolio

#### 2.9.1 Compare Properties (P2 - Post-MVP)
- Side-by-side comparison of 2-4 properties
- Key metrics comparison
- Visual comparison charts
- "Best deal" recommendation based on criteria

#### 2.9.2 Portfolio Management (P2 - Post-MVP)
- Save multiple property analyses
- Portfolio overview dashboard
- Aggregate portfolio metrics
- Track saved properties over time
- Notes and tags for organization
```

---

### MEDIUM PRIORITY - Consider for Enhancement

#### 7. Property Photos Integration
**Recommendation**: Add to P2 (Post-MVP)

**Why**:
- Visual context helps analysis
- Professional presentation
- User expectation

**PRD Addition**:
```markdown
### 3.1.3 Property Photos
- Upload property photos
- Import from listing URLs
- Display in report
- Limit: 5-10 photos per property
```

#### 8. Rent Roll Management (Multi-Unit)
**Recommendation**: Add to P2 (Post-MVP)

**Why**:
- Multi-unit properties need rent roll
- Common in Australian market (duplexes, townhouses)
- More accurate analysis

**PRD Addition**:
```markdown
### 3.3.3 Multi-Unit Properties (P2 - Post-MVP)
- Rent roll management
- Per-unit rent and expenses
- Vacancy by unit
- Total portfolio income
```

#### 9. Advanced Financing Options
**Recommendation**: Enhance existing financing section

**Why**:
- Australian market has unique financing
- Interest-only vs P&I options
- Offset accounts
- Different loan structures

**PRD Addition**:
```markdown
### 3.3.1 Enhanced Financing Options
- Interest-only period (years)
- Offset account impact
- Line of credit options
- Vendor financing
- Construction loan (for developments)
```

#### 10. Mobile Applications
**Recommendation**: Move from v1.3 to v1.2 (Post-MVP but earlier)

**Why**:
- Mobile usage is high
- Investors use mobile devices
- Competitive necessity

---

### AUSTRALIAN-SPECIFIC ENHANCEMENTS

These features are unique to Australian market and should be prioritized:

#### 11. Development & Subdivision Analysis
**Recommendation**: Add to P2 (Post-MVP)

**Why**:
- Common Australian investment strategy
- Land subdivision is common
- Needs different analysis

**PRD Addition**:
```markdown
### 2.8.5 Development & Subdivision Analysis (P2)
- Land purchase analysis
- Development approval costs
- Construction costs
- Subdivision costs
- Final lot values
- Timeline and financing
- Profit on completion
```

#### 12. Negative Gearing Calculator
**Recommendation**: Already included but can enhance

**Why**:
- Critical for Australian investors
- Complex tax implications
- Major decision factor

**Enhancement**:
- More detailed tax scenarios
- Multiple tax bracket analysis
- Impact of different strategies

---

## Feature Comparison Matrix

| Feature | DealCheck | Our PRD | Priority | Recommendation |
|---------|-----------|---------|----------|----------------|
| Property Data Import | ✅ | ❌ | HIGH | Add to P1 |
| Sales Comps Lookup | ✅ | ⚠️ Not MVP | HIGH | Upgrade to P1 |
| Rental Comps Lookup | ✅ | ⚠️ Not MVP | HIGH | Upgrade to P1 |
| Market Statistics | ✅ | ⚠️ Basic | HIGH | Enhance to P1 |
| Offer Calculator | ✅ | ❌ | HIGH | Add to P1 |
| Multiple Investment Strategies | ✅ | ⚠️ Limited | MEDIUM | Expand to P2 |
| Marketing Reports | ✅ | ⚠️ Basic | MEDIUM | Add to P1 |
| Custom Branding | ✅ | ❌ | MEDIUM | Add to P1 |
| Portfolio Management | ✅ | ❌ | MEDIUM | Add to P2 |
| Property Comparison | ✅ | ❌ | MEDIUM | Add to P2 |
| Property Photos | ✅ | ❌ | LOW | Add to P2 |
| Mobile Apps | ✅ | ⚠️ v1.3 | MEDIUM | Move to v1.2 |
| Rent Roll (Multi-Unit) | ✅ | ❌ | LOW | Add to P2 |
| BRRRR Analysis | ✅ | ❌ | LOW | Adapt for AU (P2) |
| Flip Analysis | ✅ | ❌ | LOW | Add to P2 |
| Development Analysis | ✅ | ❌ | MEDIUM | Add to P2 (AU-specific) |

---

## Recommended PRD Updates

### Immediate Updates (Before Development Starts)

1. **Add Property Data Import** (Section 2.5)
   - Manual property search and import
   - Listing URL import
   - Auto-population of basic data

2. **Upgrade Comps to P1** (Section 2.6)
   - Sales comps lookup
   - Rental comps lookup
   - Market statistics

3. **Add Offer Calculator** (Section 2.7)
   - Max allowable offer calculation
   - Multiple criteria options
   - Deal scoring

4. **Add Marketing Reports** (Section 4.4)
   - Marketing report variant
   - Custom branding options

### Post-MVP Enhancements (v1.2+)

5. **Expand Investment Strategies** (Section 2.8)
   - Renovate & Hold
   - Renovate & Sell (Flip)
   - Development & Subdivision

6. **Add Portfolio Management** (Section 2.9)
   - Property comparison
   - Saved properties portfolio
   - Portfolio dashboard

7. **Mobile Applications** (Move to v1.2)
   - iOS app
   - Android app

---

## Competitive Advantages to Maintain

Our PRD already includes features that DealCheck doesn't emphasize:

1. **FIRB Eligibility Assessment** ✅
   - Unique to Australian market
   - Critical for foreign investors
   - Competitive advantage

2. **Short-Stay Regulations Database** ✅
   - Australian-specific
   - Council-level detail
   - Competitive advantage

3. **Multi-Language Support** ✅
   - English and Chinese
   - Important for foreign investors
   - Competitive advantage

4. **Foreign Buyer Surcharges** ✅
   - State-specific calculations
   - Australian-specific
   - Competitive advantage

---

## Updated Priority Recommendations

### P0 - Must Have (No Changes)
- All existing P0 features remain

### P1 - Should Have (Add These)
- ✅ Property data import (manual, MVP)
- ✅ Sales comps lookup (basic)
- ✅ Rental comps lookup (basic)
- ✅ Market statistics (enhanced)
- ✅ Offer calculator (max allowable offer)
- ✅ Marketing reports with custom branding
- ✅ All existing P1 features

### P2 - Nice to Have (Add These)
- ✅ Property comparison (2-4 properties)
- ✅ Portfolio management
- ✅ Renovate & Hold analysis
- ✅ Renovate & Sell (Flip) analysis
- ✅ Development & Subdivision analysis
- ✅ Property photos integration
- ✅ Rent roll management (multi-unit)
- ✅ Mobile applications (move from v1.3)

---

## Implementation Impact

### Timeline Impact
- **Adding P1 features**: +2-3 weeks to MVP timeline
- **Total MVP timeline**: ~18 weeks (4.5 months) instead of 15 weeks

### Development Complexity
- Property data import: Medium complexity (API integration)
- Comps lookup: Medium complexity (data aggregation)
- Offer calculator: Low complexity (reverse calculation)
- Marketing reports: Low complexity (report variant)
- Custom branding: Low complexity (template customization)

### Data Requirements
- Sales comps: Need CoreLogic API or manual data aggregation
- Rental comps: Need Domain/Realestate.com.au data or APIs
- Market statistics: Enhanced benchmark data

---

## Conclusion

DealCheck demonstrates that property investment analysis tools need:
1. **Data automation** (import, comps, market data)
2. **Multiple investment strategies**
3. **Professional presentation** (marketing reports, branding)
4. **Portfolio management** (comparison, tracking)

**Key Recommendations**:
1. ✅ Add property data import to P1
2. ✅ Upgrade comps/market data to P1
3. ✅ Add offer calculator to P1
4. ✅ Add marketing reports to P1
5. ✅ Plan portfolio management for v1.2
6. ✅ Maintain Australian-specific advantages (FIRB, short-stay)

These additions will make our platform competitive with DealCheck while maintaining our unique Australian market focus.

---

## Document Status
**Version**: 1.0  
**Created**: January 2025  
**Status**: Ready for PRD Updates  
**Reference**: [DealCheck.io](https://dealcheck.io/)

