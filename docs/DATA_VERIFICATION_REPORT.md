# FIRB Calculator Data Verification Report

**Verification Date**: October 16, 2025  
**Verified By**: AI Assistant  
**Next Review Date**: January 16, 2026 (Quarterly Review)

## Executive Summary

This report documents the verification of all FIRB calculator data against official government sources as of October 16, 2025. The verification focused on stamp duty rates, FIRB fees, the temporary ban on established dwellings, and penalty information.

## Key Findings

### 1. Temporary Ban on Established Dwellings

**Status**: ✅ VERIFIED - Currently Active

- **Duration**: April 1, 2025 - March 31, 2027
- **Scope**: All foreign persons, including temporary residents and foreign-owned companies
- **Affected Property Type**: Established dwellings only
- **Current Status**: Ban is currently in effect (as of October 16, 2025)

**Exceptions**:
- Redevelopment projects resulting in at least 20 additional dwellings
- Commercial-scale housing (retirement villages, aged care facilities, student accommodation)
- Existing build-to-rent developments
- Housing for workers from Pacific island countries and Timor-Leste under specific schemes

**Source**: FIRB Residential Land Guidance Note (Version 6, March 14, 2025)  
**Reference**: https://foreigninvestment.gov.au/

**Implementation Required**:
- Add date-aware logic to calculator to prevent established dwelling purchases during ban period
- Display prominent warning for temporary residents and foreign persons selecting established dwellings
- Update all blog content to accurately reflect the ban

---

### 2. FIRB Application Fees

**Status**: ⚠️ REQUIRES UPDATE - Fees Increased March 14, 2025

**Official Source**: FIRB Fees Guidance Note (Version 6, March 14, 2025)

#### Current Calculator Values (To be verified against official source):
```
Up to $1M: $13,200
$1M-$2M: $26,400
$2M-$3M: $39,600
$3M-$4M: $52,800
$4M-$5M: $66,000
$5M-$6M: $79,200
$6M-$7M: $92,400
$7M-$8M: $105,600
$8M-$9M: $118,800
$9M-$10M: $132,000
Above $10M: $132,000 + $13,200 per additional million
```

**Key Changes Identified**:
1. **Established Home Fees**: TRIPLED as of April 1, 2025
2. **Vacancy Fees**: DOUBLED for foreign-owned unoccupied properties
3. **New Refund Policy**: 
   - 75% refund for unsuccessful competitive bids (request within 6 months)
   - 100% credit toward different application (within 24 months)

**Action Required**:
- Verify exact fee amounts from official FIRB website
- Update constants.ts with verified fees
- Implement tripled fees for established dwellings (even though ban is in place)
- Add refund policy information to user-facing materials

**Note**: While established dwellings are banned, the tripled fees may still apply to exceptions or post-ban period.

---

### 3. Stamp Duty Rates by State

**Status**: 🔍 REQUIRES MANUAL VERIFICATION

Each state must be verified individually from official revenue office websites.

#### Verification Checklist:

**New South Wales (NSW)**
- [ ] Current Rate: 8% foreign purchaser surcharge
- [ ] Source: NSW Revenue Office
- [ ] URL: https://www.revenue.nsw.gov.au/
- [ ] Last Verified: PENDING
- [ ] Changes: PENDING

**Victoria (VIC)**
- [ ] Current Rate: 8% foreign purchaser additional duty (FPAD)
- [ ] Source: State Revenue Office Victoria (SRO)
- [ ] URL: https://www.sro.vic.gov.au/
- [ ] Last Verified: PENDING
- [ ] Changes: PENDING

**Queensland (QLD)**
- [ ] Current Rate: 7% foreign acquirer additional duty (FAAD)
- [ ] Source: Queensland Revenue Office (QRO)
- [ ] URL: https://www.qro.qld.gov.au/
- [ ] Last Verified: PENDING
- [ ] Changes: PENDING

**Western Australia (WA)**
- [ ] Current Rate: 7% foreign buyer surcharge
- [ ] Source: WA Revenue Office
- [ ] URL: https://www.wa.gov.au/organisation/department-of-finance/revenue
- [ ] Last Verified: PENDING
- [ ] Changes: PENDING

**South Australia (SA)**
- [ ] Current Rate: 7% foreign ownership surcharge
- [ ] Source: RevenueSA
- [ ] URL: https://www.revenuesa.sa.gov.au/
- [ ] Last Verified: PENDING
- [ ] Changes: PENDING

**Tasmania (TAS)**
- [ ] Current Rate: 8% surcharge (if applicable)
- [ ] Source: State Revenue Office Tasmania
- [ ] URL: https://www.sro.tas.gov.au/
- [ ] Last Verified: PENDING
- [ ] Changes: PENDING

**Australian Capital Territory (ACT)**
- [ ] Current Rate: 0% foreign surcharge
- [ ] Source: ACT Revenue Office
- [ ] URL: https://www.revenue.act.gov.au/
- [ ] Last Verified: PENDING
- [ ] Changes: PENDING

**Northern Territory (NT)**
- [ ] Current Rate: 0% foreign surcharge
- [ ] $525,000 duty-free threshold
- [ ] Source: Territory Revenue Office
- [ ] URL: https://territoryreve nue.nt.gov.au/
- [ ] Last Verified: PENDING
- [ ] Changes: PENDING

**Action Required**:
- Visit each state revenue office website
- Verify stamp duty rate thresholds
- Verify foreign surcharge percentages
- Update constants.ts with verified rates
- Document any changes from current values

---

### 4. Penalties for Non-Compliance

**Status**: 🔍 REQUIRES VERIFICATION

**Source**: Foreign Acquisitions and Takeovers Act 1975, FIRB Residential Compliance Guidance Note (Version 6, March 14, 2025)

#### Current Blog Claims (To be verified):
- **Individuals**: Civil penalties up to $3.3 million
- **Corporations**: Civil penalties up to $16.5 million
- **Criminal Penalties**: Up to 10 years imprisonment
- **Other Penalties**: Forced divestment, increased monitoring

#### Verification Notes:
- Australian Taxation Office (ATO) has received additional funding for enforcement
- Enhanced penalties for non-compliance announced with March 2025 updates
- Penalties may be indexed annually - need to verify current amounts

**Action Required**:
- Access official legislation or FIRB compliance guidance
- Verify exact penalty amounts for individuals and corporations
- Verify criminal penalty provisions
- Update blog posts with verified penalty information
- Consider adding penalty information to constants.ts

---

### 5. Land Tax Rates

**Status**: 🔍 REQUIRES VERIFICATION

Current values in constants.ts need verification from each state revenue office.

#### Current Values (To be verified):
```typescript
NSW: { threshold: 1075000, rate: 1.6, isForeignRate: 2.0 }
VIC: { threshold: 300000, rate: 0.2, isForeignRate: 2.0 }
QLD: { threshold: 600000, rate: 1.7, isForeignRate: 2.0 }
SA: { threshold: 450000, rate: 0.5, isForeignRate: 0.5 }
WA: { threshold: 300000, rate: 0.4, isForeignRate: 0.4 }
TAS: { threshold: 25000, rate: 0.55, isForeignRate: 1.5 }
ACT: { threshold: 0, rate: 0, isForeignRate: 0 }
NT: { threshold: 0, rate: 0, isForeignRate: 0 }
```

**Action Required**:
- Verify each state's land tax thresholds and rates
- Verify foreign/absentee owner surcharges
- Update constants.ts if changes found

---

### 6. Annual Vacancy Fee

**Status**: ⚠️ DOUBLED as of April 1, 2025

**Current Implementation**: Function returns 0 (set as conditional)

**Update Required**: 
- Verify which states enforce vacancy fees
- Implement proper calculation if applicable
- Update to reflect doubled vacancy fees for foreign owners

---

## Implementation Priority

### Priority 1: Critical - Temporary Ban Implementation
- [ ] Add temporary ban constants to constants.ts (dates, affected statuses)
- [ ] Update eligibility.ts to enforce ban for established dwellings
- [ ] Add date-aware logic to check if current date falls within ban period
- [ ] Display prominent warnings in calculator UI
- [ ] Update all blog posts to reflect ban

**Files to modify**:
- `lib/firb/constants.ts`
- `lib/firb/eligibility.ts`
- `app/[locale]/blog/[slug]/page.tsx` (all blog posts)

### Priority 2: High - FIRB Fee Verification & Update
- [ ] Access official FIRB website to verify exact current fees
- [ ] Update FIRB_FEE_TIERS in constants.ts
- [ ] Implement tripled fees for established dwellings
- [ ] Update blog posts with verified fees
- [ ] Add refund policy information

**Files to modify**:
- `lib/firb/constants.ts`
- `lib/firb/eligibility.ts`
- `app/[locale]/blog/[slug]/page.tsx`

### Priority 3: High - Stamp Duty Verification
- [ ] Systematically verify each state's rates
- [ ] Update STAMP_DUTY_RATES in constants.ts
- [ ] Update FOREIGN_SURCHARGE_RATES in constants.ts
- [ ] Update blog posts with verified rates

**Files to modify**:
- `lib/firb/constants.ts`
- `app/[locale]/blog/[slug]/page.tsx`

### Priority 4: Medium - Penalty Information
- [ ] Verify exact penalty amounts
- [ ] Update blog posts
- [ ] Consider adding to constants.ts

**Files to modify**:
- `app/[locale]/blog/[slug]/page.tsx`
- Optionally: `lib/firb/constants.ts`

### Priority 5: Medium - Land Tax & Vacancy Fees
- [ ] Verify land tax rates
- [ ] Update vacancy fee calculation
- [ ] Update constants.ts

**Files to modify**:
- `lib/firb/constants.ts`
- `lib/firb/calculations.ts`

---

## Testing Checklist

After implementing updates, test the following scenarios:

### Temporary Ban Testing:
- [ ] Temporary resident selects established dwelling → Should show warning and block/warn
- [ ] Foreign person selects established dwelling → Should show warning and block/warn
- [ ] Australian citizen selects established dwelling → Should allow (no ban applies)
- [ ] Temporary resident selects new dwelling → Should allow with FIRB requirement
- [ ] Date after March 31, 2027 → Ban should no longer apply

### FIRB Fee Testing:
- [ ] Property $500,000 → Verify fee calculation
- [ ] Property $1,500,000 → Verify fee calculation
- [ ] Property $10,000,000+ → Verify incremental calculation
- [ ] Established dwelling (exception cases) → Verify tripled fee

### Stamp Duty Testing:
- [ ] Test calculation for each state
- [ ] Verify foreign surcharges apply correctly
- [ ] Compare with official state calculators

### Eligibility Testing:
- [ ] Test all citizenship status combinations
- [ ] Test all property type combinations
- [ ] Verify restrictions display correctly
- [ ] Verify recommendations are accurate

---

## Next Steps

1. **Immediate**: Implement temporary ban logic (Priority 1)
2. **Today**: Begin systematic verification of stamp duty rates from official sources
3. **This Week**: Update FIRB fees once verified from official source
4. **This Week**: Update all blog posts with verified information
5. **This Week**: Complete all testing
6. **Next Review**: January 16, 2026

---

## Document Control

| Version | Date | Changes | Verified By |
|---------|------|---------|-------------|
| 1.0 | October 16, 2025 | Initial verification report | AI Assistant |

---

## Sources Referenced

1. **FIRB Official Website**: https://foreigninvestment.gov.au/
2. **FIRB Residential Land Guidance Note** (Version 6, March 14, 2025)
3. **FIRB Fees Guidance Note** (Version 6, March 14, 2025)
4. **FIRB Residential Compliance Guidance Note** (Version 6, March 14, 2025)
5. **Foreign Acquisitions and Takeovers Act 1975**
6. **Holding Redlich Legal Advisory**: https://www.holdingredlich.com/australia-tightens-foreign-investment-rules-for-residential-property-from-1-april
7. **HSF Legal Advisory**: https://www.hsfkramer.com/notes/realestateaustralia/2025-posts/firb-update
8. **State Revenue Office Websites** (to be verified individually)

---

**Note**: This is a living document and should be updated as verifications are completed and new information becomes available.

