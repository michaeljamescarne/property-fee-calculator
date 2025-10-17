'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';

// Mock blog post data - will be replaced with dynamic content from markdown files
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  featured: boolean;
  tags: string[];
  content: string;
}

const blogPosts: Record<string, BlogPost> = {
  'ultimate-firb-guide-2025': {
    slug: 'ultimate-firb-guide-2025',
    title: 'Complete FIRB Guide 2025: Everything You Need to Know About Foreign Investment in Australian Property',
    excerpt: 'Thinking about investing in Australian property as a foreign buyer? Understanding FIRB (Foreign Investment Review Board) requirements isn\'t just recommended—it\'s mandatory. This comprehensive guide breaks down everything you need to know about FIRB approval, fees, and compliance in 2025.',
    date: '2025-01-15',
    readTime: '12 min read',
    category: 'FIRB Guide',
    featured: true,
    tags: ['FIRB', 'Foreign Investment', 'Property Rules'],
    content: `<!-- Updated spacing fix -->
Thinking about investing in Australian property as a foreign buyer? Understanding FIRB (Foreign Investment Review Board) requirements isn't just recommended—it's mandatory. This comprehensive guide breaks down everything you need to know about FIRB approval, fees, and compliance in 2025.

## **What is FIRB and Why Does It Matter?**

The Foreign Investment Review Board (FIRB) examines foreign investment proposals in Australia and advises the Treasurer on whether they align with Australia's national interest. For property investors, FIRB approval is the gateway to legally purchasing Australian real estate.

Think of FIRB as the gatekeeper ensuring that foreign investment benefits Australia while protecting domestic housing availability and national interests.

### **FIRB's Key Responsibilities**

- Reviewing and assessing foreign investment applications
- Advising the Treasurer on national interest concerns
- Monitoring compliance with approval conditions
- Protecting Australia's strategic and economic interests

## **Do You Need FIRB Approval?**

### Foreign Persons Who Need Approval

You'll need FIRB approval if you're:

- A **foreign national** (non-Australian citizen)
- A **temporary resident** (including 457, 482, or student visa holders)
- A **foreign company** or trust
- Representing a **foreign government** or its agencies

### **Who Doesn't Need FIRB Approval?**

You're exempt from FIRB requirements if you're:

- An Australian citizen
- An Australian permanent resident
- A New Zealand citizen with a Special Category Visa (subclass 444)

## **Understanding Property Types and Current Rules**

### New Dwellings (Off-the-Plan and New Homes)

**Approval Status:** Required for foreign persons  
**Purpose:** Investment or primary residence  
**Restrictions:** None on the number of properties you can buy

New dwellings include properties that have never been occupied or sold as a place of residence. This category encompasses off-the-plan apartments, newly constructed houses, and substantially renovated properties that meet the "new dwelling" definition.

### Established Dwellings (Existing Homes)

**⚠️ IMPORTANT: TEMPORARY BAN IN EFFECT**

From **April 1, 2025** to **March 31, 2027**, foreign persons (including temporary residents) **cannot** purchase established dwellings in Australia. This ban aims to ease housing pressure and increase availability for local buyers.

#### Limited Exceptions to the Ban

The ban doesn't apply if you're:

- **Redeveloping property** that will create at least 20 additional dwellings
- Investing in **commercial-scale housing developments** (build-to-rent with specific criteria)
- Purchasing under the **Pacific Australia Labour Mobility scheme**

#### What This Means for Temporary Residents

Previously, temporary residents could buy one established dwelling to live in while in Australia. This is no longer possible during the ban period. If you're on a temporary visa and want to buy property, you'll need to focus on new developments or vacant land.

**After the Ban Ends (Post-March 2027)**

Historical rules will likely resume:
- Established dwellings can only be purchased as your primary residence
- The property must be sold when it's no longer your main home
- You cannot rent the property to others while you own it

### Vacant Land

**Approval Status:** Required for foreign persons  
**Key Conditions:** 
- Construction must begin within **24 months** of purchase
- All construction must be completed within **4 years** of approval
- The land cannot be sold until construction is finished

These timelines are strictly enforced, with the government cracking down on "land banking" practices.

## **FIRB Application Fees 2025/26**

Application fees are indexed annually and vary significantly based on property type and value. Here's what you'll pay for applications from July 1, 2025 to June 30, 2026:

### New Dwellings & Vacant Land Fees
<table class="w-full border-collapse border border-gray-300 mb-6">
  <thead>
    <tr class="bg-gray-50">
      <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Property Value</th>
      <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Application Fee</th>
    </tr>
  </thead>
  <tbody>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Under $75,000</td>
      <td class="border border-gray-300 px-4 py-3">$4,500</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Up to $1M</td>
      <td class="border border-gray-300 px-4 py-3">$15,100</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Up to $2M</td>
      <td class="border border-gray-300 px-4 py-3">$30,300</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Up to $3M</td>
      <td class="border border-gray-300 px-4 py-3">$60,600</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Up to $4M</td>
      <td class="border border-gray-300 px-4 py-3">$90,900</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Up to $5M</td>
      <td class="border border-gray-300 px-4 py-3">$121,200</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Up to $10M</td>
      <td class="border border-gray-300 px-4 py-3">$272,700</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Up to $20M</td>
      <td class="border border-gray-300 px-4 py-3">$575,700</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Up to $30M</td>
      <td class="border border-gray-300 px-4 py-3">$878,700</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Up to $40M</td>
      <td class="border border-gray-300 px-4 py-3">$1,181,700</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Over $40M</td>
      <td class="border border-gray-300 px-4 py-3">$1,205,200</td>
    </tr>
  </tbody>
</table>

*For the complete fee schedule including all price points, visit the <a href="https://www.ato.gov.au/individuals-and-families/investments-and-assets/foreign-resident-investments/foreign-investment-in-australia/fees-for-foreign-residential-investors" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">ATO website</a>.*
### Established Dwellings Fees (Tripled Rates)
⚠️ **Note:** While established dwellings are banned during April 2025–March 2027, these tripled fees apply to exceptional circumstances and will apply again after the ban ends:
<table class="w-full border-collapse border border-gray-300 mb-6">
  <thead>
    <tr class="bg-gray-50">
      <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Property Value</th>
      <th class="border border-gray-300 px-4 py-3 text-left font-semibold">Application Fee</th>
    </tr>
  </thead>
  <tbody>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Under $75,000</td>
      <td class="border border-gray-300 px-4 py-3">$13,500</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Up to $1M</td>
      <td class="border border-gray-300 px-4 py-3">$45,300</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Up to $2M</td>
      <td class="border border-gray-300 px-4 py-3">$90,900</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Up to $3M</td>
      <td class="border border-gray-300 px-4 py-3">$181,800</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Up to $5M</td>
      <td class="border border-gray-300 px-4 py-3">$363,600</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Up to $10M</td>
      <td class="border border-gray-300 px-4 py-3">$818,100</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Up to $20M</td>
      <td class="border border-gray-300 px-4 py-3">$1,727,100</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Up to $30M</td>
      <td class="border border-gray-300 px-4 py-3">$2,636,100</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Up to $40M</td>
      <td class="border border-gray-300 px-4 py-3">$3,545,100</td>
    </tr>
    <tr class="hover:bg-gray-50">
      <td class="border border-gray-300 px-4 py-3">Over $40M</td>
      <td class="border border-gray-300 px-4 py-3">$3,615,600</td>
    </tr>
  </tbody>
</table>

The tripling of established dwelling fees reflects the government's policy to encourage foreign investment in new housing stock rather than existing homes.

### **Additional Fee Information**

**Expedited Processing:** You can pay double the standard fee for 10-day priority processing (subject to approval).

**Variation Fees:** If you need to modify an existing approval:
- Simple variation: $4,500
- Complex variation: $30,300

**Developer Certificates:** Property developers pay a flat $65,200 initial fee for New or near-new dwelling exemption certificates, plus per-sale fees for each dwelling sold to foreign persons.

## **The FIRB Application Process: Step by Step**

### Step 1: Determine Your Eligibility

Start by using the <a href="https://www.propertycosts.com.au/en/firb-calculator" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">FIRB Calculator on PropertyCosts.com.au</a> to:
- Confirm whether you need approval
- Calculate your exact application fee
- Understand applicable conditions

### Step 2: Gather Required Documents

Before applying, prepare:

- **Passport copy** (certified if required)
- **Current visa documentation** (if applicable)
- **Property details** (address, purchase price, property type)
- **Financial statements** demonstrating capacity to purchase
- **Proof of funds** or financing pre-approval
- **Company documents** (if purchasing through a corporate entity)

### Step 3: Submit Your Application

Applications for residential property are submitted through the <a href="https://www.ato.gov.au/" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">ATO's online portal</a>. The process includes:

1. Creating an account or logging in
2. Completing the online application form
3. Uploading supporting documents
4. Paying the application fee
5. Receiving acknowledgment of submission

**Important:** The 30-day assessment period only begins once the correct fee is paid.

### Step 4: Assessment and Approval

The Treasury and FIRB typically assess applications within **30 days**, though this can be extended if additional information is needed or if the application raises national interest concerns.

You'll receive either:
- A **no objection notification** with conditions
- A request for more information
- In rare cases, a rejection

### Step 5: Compliance and Ongoing Obligations

Once approved, you must:

- **Purchase within the specified timeframe** (usually 12 months)
- **Comply with all conditions** attached to your approval
- **Report to FIRB** as required (e.g., when construction is completed)
- **Lodge annual vacancy fee returns** if applicable

## **Understanding FIRB Conditions**

Every FIRB approval comes with conditions you must follow. Here are the most common:

### For New Dwellings

- If purchasing as an investment, the property must eventually be sold to Australian citizens or permanent residents
- The property cannot be rented to foreign persons
- You must notify FIRB of any material changes to your circumstances

### For Vacant Land

- Construction must commence within **24 months**
- All dwellings must be completed within **4 years**
- Regular progress reports may be required
- The land cannot be sold until development is complete (with limited exceptions)
- Land banking is strictly prohibited

### For All Property Types

- The property must be used in accordance with the stated purpose in your application
- You must comply with all Australian laws and regulations
- You may be required to submit annual compliance reports

## The Cost of Non-Compliance: Penalties and Enforcement

The Australian government takes FIRB compliance seriously. In recent years, penalties have significantly increased, and enforcement has become more aggressive.

### **Civil Penalties (Updated 2023–2025)**

As of 2025, civil penalties for breaching FIRB regulations can include:

- **Individuals:** Up to $1.65 million (5,000 penalty units)
- **Corporations:** Up to $16.5 million (50,000 penalty units)

Common civil penalty offenses include:
- Failing to obtain FIRB approval before purchasing
- Breaching conditions of your approval
- Making false or misleading statements in your application
- Failing to advertise new dwellings to Australian buyers

### Criminal Penalties

Serious breaches can result in criminal prosecution:

- **Imprisonment:** Up to **10 years** for severe violations
- **Criminal fines:** In addition to or instead of imprisonment
- **Criminal record:** Affecting future visa applications and business opportunities

Criminal charges typically apply to:
- Willful violations of FIRB requirements
- Fraud or deliberate misrepresentation
- Repeated non-compliance after warnings
- Schemes designed to circumvent FIRB rules

### Unauthorized Acquisition Penalties

If you acquire property without proper FIRB approval, penalties are calculated as the **greater of**:

- **Double the capital gain** when you sell the property
- **50% of what you paid** for the property
- **50% of the property's current market value**

This means a $1 million property purchased without approval could result in a $500,000 penalty, plus you may be forced to sell.

### Vacancy Fee Penalties

Failing to comply with vacancy fee requirements can cost:

- Up to $165,000 for failing to lodge returns or pay fees
- From April 9, 2024, vacancy fees are **double the original application fee**
- Additional penalties for false declarations

### Forced Divestment

Beyond financial penalties, you may be ordered to **sell the property**:

- Often under unfavorable market conditions
- With no guarantee of recovering your investment
- Including all associated costs (legal fees, agent fees, stamp duty losses)

### Real Enforcement Examples

The government actively pursues non-compliance:

- **2015-2021:** 434 properties were forcibly disposed of
- **April 2022:** Federal Court imposed a $250,000 fine on a foreign investor for unauthorized purchases
- **Ongoing:** Enhanced audit programs targeting land banking and non-compliance
- **2024-2025:** Increased ATO enforcement with dedicated funding for residential property compliance

## **Annual Vacancy Fees: What You Need to Know**

If you purchased a residential property after May 9, 2017 with FIRB approval, you may need to pay an annual vacancy fee.

### When the Vacancy Fee Applies

You'll pay this fee if your property is:

- Not occupied for at least **183 days** (6 months) during the "vacancy year"
- Not available for rent for at least 183 days during the vacancy year
- Available for rent but at an unrealistic price that prevents renting

### How Much You'll Pay

The vacancy fee equals **double your original FIRB application fee** (for properties purchased after April 9, 2024).

**Example:** If you paid $30,300 for FIRB approval to purchase a $2 million new apartment, your annual vacancy fee would be $60,600 if the property remains vacant for more than 6 months.

### How to Comply

Each year you must:

1. Lodge a **vacancy fee return** by the due date (usually within 30 days after your "vacancy year" ends)
2. Pay any fees owing
3. Keep records proving occupancy or rental availability

## **Tips for Successful FIRB Applications**

### Before Applying

- **Start early:** FIRB approval takes at least 30 days, often longer
- **Get professional advice:** Consider engaging a lawyer or specialist consultant
- **Check the ban:** Ensure your intended purchase isn't affected by the established dwelling ban
- **Calculate all costs:** Use the PropertyCosts calculator to understand total expenses
- **Arrange finance:** Get pre-approval before applying to FIRB

### During the Application

- **Be thorough:** Incomplete applications cause delays
- **Be honest:** False information can lead to criminal charges
- **Respond quickly:** If FIRB requests more information, provide it promptly
- **Keep records:** Save all correspondence and documents
- **Check your timeline:** Don't sign purchase contracts before receiving FIRB approval

### After Approval

- **Read your conditions carefully:** Understand exactly what you must do
- **Set reminders:** For construction deadlines, vacancy returns, and reporting requirements
- **Maintain records:** Keep proof of compliance (rental agreements, construction invoices, etc.)
- **Seek clarification:** Contact FIRB or the ATO if you're unsure about anything
- **Report changes:** Notify FIRB if your circumstances change materially

## **Frequently Asked Questions**

**Q: Can I buy property with my Australian citizen spouse?**  
A: Yes, but the structure matters. If you're purchasing as joint tenants or tenants in common, you'll typically need FIRB approval for your share. If your spouse is purchasing alone and you're not on the title, FIRB approval isn't required. Be cautious: arrangements designed to circumvent FIRB can be illegal.

**Q: What happens if the ban extends beyond March 2027?**  
A: The government will review the ban before it expires and announce any extension. If it's extended, existing approvals remain valid, but new applications for established dwellings will continue to be rejected (except for exempted categories).

**Q: Can I buy multiple new properties?**  
A: Yes. Foreign persons can purchase unlimited new dwellings and vacant land, subject to obtaining FIRB approval and paying the fee for each property.

**Q: How long does FIRB approval last?**  
A: Typically 12 months from approval date. If you don't complete the purchase within this period, you may need to reapply and pay a new fee.

**Q: Can I rent out my property while I'm overseas?**  
A: For new dwellings purchased as investments, yes—this is expected. For established dwellings purchased as your primary residence (after the ban ends), no—you must sell when you leave Australia permanently or it's no longer your main residence.

**Q: What if I purchased property without FIRB approval?**  
A: Contact a lawyer immediately. You may be able to apply for retrospective approval, but expect significant penalties regardless. During the current ban period, retrospective approval for established dwellings is generally not being granted.

## Looking Ahead: FIRB Policy Changes

Australia's foreign investment policy evolves in response to housing market conditions and national interest considerations. Recent changes include:

- **2023-2024:** Tripling of established dwelling fees and doubling of vacancy fees
- **April 2025:** Implementation of the two-year established dwelling ban
- **2025:** Enhanced compliance measures and increased audit activity
- **2025-2026:** Streamlined processing for "low-risk" investments in new housing

The government has signaled that FIRB policy will continue adapting to support housing affordability for Australians while still welcoming beneficial foreign investment.

## How PropertyCosts Can Help

Understanding FIRB is complex, but getting started doesn't have to be. The <a href="https://www.propertycosts.com.au/en/firb-calculator" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">PropertyCosts FIRB Calculator</a> provides:

- **Instant eligibility assessment** – Find out if you need FIRB approval
- **Accurate fee calculation** – Know exactly what you'll pay
- **Condition breakdown** – Understand your obligations
- **Timeline estimates** – Plan your purchase properly
- **Comprehensive cost analysis** – See all property acquisition costs in one place

<a href="https://www.propertycosts.com.au/en/firb-calculator" class="inline-flex items-center text-blue-600 hover:text-blue-800 underline font-medium" target="_blank" rel="noopener noreferrer">Calculate your FIRB costs now →</a>

---

## Key Takeaways

1. **FIRB approval is mandatory** for most foreign property purchases in Australia
2. **Established dwellings are banned** for foreign persons until March 31, 2027 (limited exceptions apply)
3. **Application fees vary significantly** based on property type and value—new dwellings use standard rates while established dwellings (when permitted) incur triple fees
4. **Penalties are severe**—up to $16.5 million for corporations, 10 years imprisonment, and forced property sale
5. **Compliance is ongoing**—annual vacancy returns, development deadlines, and condition adherence are required
6. **Professional advice matters**—FIRB rules are complex and continuously evolving

Understanding FIRB requirements is your first step toward successful property investment in Australia. With proper planning, professional guidance, and the right tools, navigating the FIRB process becomes manageable—setting you up for a compliant and rewarding investment experience.

*This guide is for informational purposes only and does not constitute legal or financial advice. FIRB regulations are complex and change frequently. Always seek professional advice for your specific situation.*

---

**Related Resources:**
- <a href="https://foreigninvestment.gov.au/" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">FIRB Official Website</a>
- <a href="https://www.ato.gov.au/" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">ATO Foreign Investment Portal</a>
- <a href="https://www.propertycosts.com.au/en/firb-calculator" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">PropertyCosts FIRB Calculator</a>
    `
  },
  'stamp-duty-calculator-by-state': {
    slug: 'stamp-duty-calculator-by-state',
    title: 'Australian Stamp Duty Guide 2025: Complete State-by-State Comparison for Property Buyers',
    excerpt: 'Navigate Australia\'s complex stamp duty landscape with our comprehensive state-by-state guide. Compare rates, calculate costs, and understand foreign buyer surcharges across all states and territories.',
    date: '2025-01-12',
    readTime: '15 min read',
    category: 'Costs & Fees',
    featured: true,
    tags: ['Stamp Duty', 'State Comparison', 'Foreign Buyer Surcharge'],
    content: `
# Australian Stamp Duty Guide 2025: Complete State-by-State Comparison for Property Buyers

*Last updated: 12 January 2025 | 8 min read*

Buying property in Australia means facing one of the largest upfront costs you'll encounter: stamp duty. For foreign buyers, additional surcharges can push these costs even higher. Whether you're purchasing in Sydney, Melbourne, or regional Queensland, understanding how stamp duty varies across states is crucial for smart property investment.

This comprehensive guide breaks down stamp duty rates across all Australian states and territories, explains foreign buyer surcharges, and helps you calculate your true property costs.

## What is Stamp Duty and Why Does It Matter?

Stamp duty (officially called transfer duty in most states) is a state government tax you pay when you buy property. Think of it as the price of admission to property ownership—except this admission fee can easily run into tens of thousands of dollars.

The amount you pay depends on three key factors:

1. **Property value** – Higher-priced properties attract progressively higher rates
2. **Location** – Each state sets its own rates and thresholds
3. **Buyer status** – Foreign buyers pay significant additional surcharges in most states

Unlike ongoing costs like council rates or land tax, stamp duty is a one-time payment due shortly after you sign the purchase contract (typically within 30–90 days depending on the state).

## Understanding the Foreign Buyer Surcharge

If you're not an Australian citizen or permanent resident, you'll face an additional stamp duty surcharge in most states. These surcharges were introduced from 2015 onwards to moderate foreign investment in residential property and ensure foreign buyers contribute to local infrastructure.

**Who qualifies as a foreign buyer?**

You're generally considered a foreign buyer if you're:
- A foreign national (not an Australian citizen)
- A temporary resident (including 457, 482, or student visa holders)
- A foreign company or trust
- A foreign government entity

**Who's exempt?**

You won't pay the foreign buyer surcharge if you're:
- An Australian citizen (even if living overseas)
- An Australian permanent resident
- A New Zealand citizen holding a special category visa (subclass 444) who meets residency requirements

## Stamp Duty Rates by State (2025 Verified)

**Source**: Official state revenue offices, last verified October 16, 2025

### New South Wales (NSW)

NSW has some of the highest property prices and stamp duty costs in Australia.

**Base Stamp Duty Rates:**

| Property Value | Calculation |
|----------------|-------------|
| $0 - $14,000 | 1.25% |
| $14,001 - $32,000 | $175 + 1.5% of excess over $14,000 |
| $32,001 - $85,000 | $445 + 1.75% of excess over $32,000 |
| $85,001 - $319,000 | $1,372.50 + 3.5% of excess over $85,000 |
| $319,001 - $1,064,000 | $9,562.50 + 4.5% of excess over $319,000 |
| Over $1,064,000 | $43,087.50 + 5.5% of excess over $1,064,000 |

**Premium Property Duty:** Properties over $3,721,000 (as of July 2025) attract a premium rate of 7% on the amount exceeding this threshold.

**Foreign Buyer Surcharge: 9%** (increased from 8% on January 1, 2025)

**Example:** For an $800,000 property:
- Standard stamp duty: ~$31,090
- Foreign buyer surcharge: $72,000 (9% of $800,000)
- **Total for foreign buyer: $103,090**

### Victoria (VIC)
**Base Stamp Duty Rates:**
- $0 - $25,000: 1.4%
- $25,001 - $130,000: $350 + 2.4% of excess over $25,000
- $130,001 - $960,000: $2,870 + 5% of excess over $130,000
- Over $960,000: $44,370 + 6.5% of excess over $960,000

**Foreign Buyer Surcharge:** 8% ✅ (verified)

### Queensland (QLD)
**Base Stamp Duty Rates:**
- $0 - $5,000: 0%
- $5,001 - $75,000: 1.5%
- $75,001 - $540,000: $1,050 + 3.5% of excess over $75,000
- $540,001 - $1,000,000: $17,325 + 4.5% of excess over $540,000
- Over $1,000,000: $38,025 + 5.75% of excess over $1,000,000

**Foreign Buyer Surcharge:** 7% ✅ (verified)

### South Australia (SA)
**Base Stamp Duty Rates:**
- $0 - $12,000: 1%
- $12,001 - $30,000: $120 + 2% of excess over $12,000
- $30,001 - $50,000: $480 + 3% of excess over $30,000
- $50,001 - $100,000: $1,080 + 3.5% of excess over $50,000
- $100,001 - $200,000: $2,830 + 4% of excess over $100,000
- $200,001 - $250,000: $6,830 + 4.25% of excess over $200,000
- $250,001 - $300,000: $8,955 + 4.75% of excess over $250,000
- $300,001 - $500,000: $11,330 + 5% of excess over $300,000
- Over $500,000: $21,330 + 5.5% of excess over $500,000

**Foreign Buyer Surcharge:** 7% ✅ (verified)

### Western Australia (WA)
**Base Stamp Duty Rates:**
- $0 - $120,000: 1.9%
- $120,001 - $150,000: $2,280 + 2.85% of excess over $120,000
- $150,001 - $360,000: $3,135 + 3.8% of excess over $150,000
- $360,001 - $725,000: $11,115 + 4.75% of excess over $360,000
- Over $725,000: $28,445 + 5.15% of excess over $725,000

**Foreign Buyer Surcharge:** 7% ✅ (verified)

### Tasmania (TAS)
**Base Stamp Duty Rates:**
- $0 - $3,000: 1.75%
- $3,001 - $25,000: $52.50 + 2.25% of excess over $3,000
- $25,001 - $75,000: $547.50 + 3.5% of excess over $25,000
- $75,001 - $200,000: $1,297.50 + 4% of excess over $75,000
- $200,001 - $375,000: $6,297.50 + 4.25% of excess over $200,000
- Over $375,000: $13,737.50 + 4.5% of excess over $375,000

**Foreign Buyer Surcharge:** 8% ✅ (verified)

### Northern Territory (NT)
**Base Stamp Duty Rates:**
- $0 - $525,000: 0.5%
- $525,001 - $3,000,000: $2,625 + 5.5% of excess over $525,000
- Over $3,000,000: $138,750 + 7.5% of excess over $3,000,000

**Foreign Buyer Surcharge:** 0% ✅ (verified)

### Australian Capital Territory (ACT)
**Base Stamp Duty Rates:**
- $0 - $200,000: 2.2%
- $200,001 - $300,000: $4,400 + 3.4% of excess over $200,000
- $300,001 - $500,000: $7,800 + 4.32% of excess over $300,000
- $500,001 - $750,000: $16,440 + 5.9% of excess over $500,000
- $750,001 - $1,000,000: $31,190 + 6.4% of excess over $750,000
- Over $1,000,000: $47,190 + 6.4% of excess over $1,000,000

**Foreign Buyer Surcharge:** 0% ✅ (verified)

## Foreign Buyer Surcharges Summary

| State | Foreign Buyer Surcharge | Effective Rate |
|-------|------------------------|----------------|
| NSW | 8% | High |
| VIC | 8% | High |
| QLD | 7% | Medium |
| SA | 7% | Medium |
| WA | 7% | Medium |
| TAS | 8% | High |
| NT | 0% | Low |
| ACT | 0% | Low |

## First Home Buyer Concessions

### NSW
- **Exemption**: Up to $650,000
- **Concession**: $650,001 - $800,000
- **Grant**: $10,000 (new homes only)

### VIC
- **Exemption**: Up to $600,000
- **Concession**: $600,001 - $750,000
- **Grant**: $10,000 (new homes only)

### QLD
- **Exemption**: Up to $500,000
- **Concession**: $500,001 - $550,000
- **Grant**: $15,000 (new homes only)

### Other States
Each state offers different concessions and grants. Check with local authorities for current rates.

## Investment Property Considerations

### Additional Costs:
- **Land Tax**: Annual tax on land value
- **Foreign Buyer Surcharge**: Additional stamp duty
- **FIRB Fees**: Application fees for foreign buyers
- **Legal Fees**: Conveyancing costs

### Tax Benefits:
- **Negative Gearing**: Offset rental losses against income
- **Depreciation**: Claim building and fixture depreciation
- **Capital Gains**: 50% discount for assets held >12 months

## How to Calculate Your Stamp Duty

### Method 1: Use Our Calculator
Our [FIRB Calculator](/firb-calculator) automatically calculates stamp duty for all states, including foreign buyer surcharges.

### Method 2: Manual Calculation
1. **Determine base rate** from state tables above
2. **Calculate base stamp duty** using progressive rates
3. **Add foreign buyer surcharge** if applicable
4. **Add any additional fees** (FIRB, legal, etc.)

### Example Calculation (NSW, $800,000 property):
- **Base stamp duty**: $31,087.50
- **Foreign buyer surcharge**: $64,000 (8% of $800,000)
- **Total stamp duty**: $95,087.50

## Tips for Minimizing Stamp Duty

### For Foreign Buyers:
1. **Consider lower-cost states** (NT, ACT have no surcharge)
2. **Look at new developments** (may qualify for grants)
3. **Factor in total costs** (not just stamp duty)
4. **Plan for ongoing costs** (land tax, etc.)

### For Australian Buyers:
1. **First home buyer concessions** (if eligible)
2. **New home grants** (check current availability)
3. **Off-the-plan purchases** (may have concessions)
4. **Regional areas** (may have additional incentives)

## Conclusion

Stamp duty costs vary significantly between states, with foreign buyer surcharges adding substantial additional costs. Use our comprehensive calculator to determine your exact costs and plan your property investment accordingly.

**Ready to calculate your stamp duty?** [Use our free calculator](/firb-calculator) to get instant results for any Australian state.
    `
  },
  'chinese-buyers-guide-australian-property': {
    slug: 'chinese-buyers-guide-australian-property',
    title: 'Complete Guide for Chinese Investors: Buying Australian Property in 2025',
    excerpt: 'Navigate Australia\'s evolving property market as a Chinese investor. This comprehensive guide covers FIRB regulations, capital controls, banking requirements, and cultural considerations for successful property investment.',
    date: '2025-01-10',
    readTime: '15 min read',
    category: 'Investment Guide',
    featured: false,
    tags: ['Chinese Investors', 'Property Investment', 'Cultural Guide'],
    content: `
# Complete Guide for Chinese Investors: Buying Australian Property in 2025

*Last updated: 10 January 2025 | 15 min read*

Australia has remained one of the most sought-after destinations for Chinese property investors, despite evolving regulations and capital control challenges. With its stable economy, world-class education system, and strong long-term property growth, Australia continues to attract savvy investors from mainland China.

This comprehensive guide provides everything Chinese nationals need to know about investing in Australian real estate in 2025—from navigating FIRB regulations to managing capital controls and understanding cultural considerations.

## Why Australia Remains Attractive for Chinese Investors

### Economic and Political Stability

Australia offers something increasingly valuable: predictability. With a transparent legal system, strong property rights protection, and a resilient economy, Australian real estate provides a safe haven for wealth preservation.

**Key advantages:**
- **AAA credit rating** – One of only 10 countries with this distinction
- **Transparent legal system** – Strong enforcement of property rights
- **Political stability** – Democratic governance with consistent policies
- **Currency diversification** – AUD holdings as hedge against RMB volatility
- **No capital gains without repatriation** – Gains stay offshore until you choose to bring them back

### World-Class Education

Education remains a primary driver for Chinese property investment. Australia hosts seven universities in the global top 100, with particularly strong programs in Melbourne, Sydney, and Brisbane.

Many Chinese families purchase property near universities to:
- Provide accommodation for children studying in Australia
- Generate rental income from other international students
- Secure long-term assets in education hubs
- Create potential pathways to permanent residency

**Popular university locations:**
- **Sydney:** University of Sydney, UNSW
- **Melbourne:** University of Melbourne, Monash University
- **Brisbane:** University of Queensland
- **Adelaide:** University of Adelaide
- **Perth:** University of Western Australia

### Quality of Life and Environment

For Chinese investors, Australia offers:
- **Clean air and environment** – A critical factor for families from major Chinese cities
- **Safe, livable cities** – Melbourne and Sydney regularly rank in global top 10
- **Excellent healthcare** – World-class medical facilities
- **Multicultural society** – Established Chinese communities in major cities
- **Outdoor lifestyle** – Beaches, parks, and natural attractions

### Strong Property Fundamentals

Despite short-term fluctuations, Australian property has delivered solid long-term returns:
- **Historical growth:** Average 6-7% annually over past decades
- **Supply constraints:** Limited land in major cities
- **Population growth:** Steady immigration supporting demand
- **Infrastructure investment:** Major transport and development projects
- **Rental yields:** 3-5% in major cities

### Geographic Proximity

Compared to European or North American alternatives, Australia offers:
- **Shorter flight times** – 9-10 hours from major Chinese cities
- **Similar time zone** – Only 2-3 hours difference
- **Cultural connections** – Large established Chinese communities
- **Direct flights** – Multiple daily connections from Beijing, Shanghai, Guangzhou

## Understanding FIRB: The Foreign Investment Review Board

FIRB approval is mandatory for all foreign buyers, including Chinese nationals. Understanding these rules is essential before beginning your property search.

### Current FIRB Rules for Chinese Investors

**What You CAN Buy:**

**1. New Dwellings (Off-the-Plan and Newly Built)**
- No restrictions on number of properties
- Can be purchased for investment or personal use
- Must have FIRB approval before signing contract
- Application fees range from $15,100 to $1,205,200+ depending on property value

**2. Vacant Land**
- Permitted for development purposes
- Must commence construction within 24 months
- All construction must be completed within 4 years
- Cannot resell until development is complete
- Subject to conditions and monitoring

**What You CANNOT Buy:**

**Established Dwellings (Existing Properties)**

⚠️ **CRITICAL CHANGE – TEMPORARY BAN IN EFFECT**

From **April 1, 2025** to **March 31, 2027**, foreign persons (including Chinese nationals and temporary residents) **cannot** purchase established residential properties in Australia.

**Limited exceptions apply only for:**
- Redevelopment projects creating 20+ additional dwellings
- Build-to-rent developments meeting specific criteria
- Properties under the Pacific Australia Labour Mobility scheme

**What this means for Chinese investors:**
- Cannot buy existing houses or apartments (even as primary residence)
- Must focus on off-the-plan apartments, house-and-land packages, or vacant land
- Temporary residents on student or work visas are also affected
- Ban may be extended beyond 2027 pending government review

### FIRB Application Fees (2025/26)

Chinese investors should budget for significant FIRB application fees. These are non-refundable and due at application:

| Property Value | Application Fee |
|----------------|-----------------|
| Up to $1M | $15,100 |
| Up to $2M | $30,300 |
| Up to $3M | $60,600 |
| Up to $5M | $121,200 |
| Up to $10M | $272,700 |
| Over $40M | $1,205,200 |

**Processing time:** Typically 30 days, though can be longer if additional information is required.

**Important:** Use the [PropertyCosts FIRB Calculator](https://www.propertycosts.com.au/en/firb-calculator) to accurately calculate your fees and understand all associated costs before starting your property search.

## Navigating China's Capital Controls

This is often the most challenging aspect for Chinese investors. China maintains strict capital controls to manage currency stability and prevent capital flight.

### Current Capital Control Framework

**Individual Annual Quota:**
- **$50,000 USD per person per year** – This is the standard foreign exchange quota
- Strictly enforced by the State Administration of Foreign Exchange (SAFE)
- Attempts to circumvent controls can result in blacklisting and penalties

**What IS Monitored:**
- Large transfers to property purchases
- Multiple related-party transactions
- Overseas real estate purchases by state-owned enterprises over $1 billion
- Transactions outside core business activities over $1 billion

### Legal Strategies for Transferring Funds

**Important:** Always use legal, compliant methods. Illegal fund transfers can result in serious consequences including:
- Criminal charges in China
- FIRB approval revocation in Australia
- Property seizure
- Banking blacklisting

**Legitimate approaches:**

**1. Family Pooling**
Multiple family members can utilize their individual quotas:
- Parents, spouse, adult children each have $50,000 USD quota
- A family of four can legally transfer $200,000 USD annually
- Must demonstrate legitimate family relationships
- All transfers must be properly documented

**2. Pre-Existing Offshore Funds**
- Funds already held outside mainland China (Hong Kong, Singapore, etc.)
- Legitimate business earnings from overseas operations
- Inheritance or gifts from overseas relatives
- Previous emigration proceeds

**3. Qualified Institutional Programs**
- QDII (Qualified Domestic Institutional Investor) for institutional funds
- QDLP (Qualified Domestic Limited Partnership) for high-net-worth individuals
- Requires substantial minimum investment (typically $5M+ USD)
- Access limited to qualified investors

**4. Commercial Channels**
- Foreign Direct Investment (FDI) structures for business purposes
- Legitimate business-related property purchases
- Requires proper business documentation and commercial rationale

**What to AVOID:**
- Underground banking (地下钱庄)
- Fake trade invoicing
- Bitcoin/cryptocurrency laundering schemes
- Shell company circular transactions

These methods are illegal and carry severe penalties in both China and Australia.

### Working with Financial Advisors

Given the complexity of capital controls, Chinese investors should:
- Consult licensed financial advisors in both jurisdictions
- Plan fund transfers 6-12 months before property purchase
- Maintain comprehensive documentation of all transfers
- Use only legitimate banking channels
- Consider timing around quota renewal periods

## Banking and Finance for Chinese Investors

Securing Australian finance as a Chinese national is challenging but not impossible. Understanding lender requirements is crucial.

### The Lending Landscape

**Current Reality:**
Major Australian banks have significantly tightened lending criteria for foreign buyers since 2015-2016. Many no longer offer loans to non-residents or require very specific conditions.

**Key challenges for Chinese investors:**
- Limited lender options
- Higher interest rates
- Strict income verification
- Currency risk considerations
- Larger deposit requirements

### Deposit Requirements

**Standard Requirements:**
- **30-40% minimum deposit** – Most lenders for foreign buyers
- **Some lenders require 40-50%** – For higher-risk profiles
- **60-70% LVR maximum** – Loan-to-value ratio capped

**Example:**
For a $1,000,000 property:
- Minimum deposit: $300,000-$400,000
- Maximum loan: $600,000-$700,000
- Plus stamp duty, FIRB fees, and legal costs

### Interest Rates and Terms

**Current rates for foreign buyers (2025):**
- **6.5% - 8% per annum** – Typical range for non-residents
- **Higher than resident rates by 1-2%** – Risk premium applied
- **Loan terms: 20-30 years** – Similar to residents
- **Interest-only options:** Available but limited

### Income Verification

Australian lenders require extensive proof of overseas income:

**Required documentation:**
- **Employment contract** (may need NAATI-certified translation)
- **3-6 months payslips**
- **Bank statements** showing salary deposits
- **Tax returns** (past 2-3 years)
- **Employer verification letter**
- **Asset statements**

**Income assessment:**
- **20-40% haircut** typically applied to foreign income
- Accounts for currency risk and verification difficulty
- RMB income must be converted at current exchange rates

### Currency Risk Management

Chinese investors with RMB income and AUD mortgage face exchange rate risk:

**Example scenario:**
- Mortgage repayment: $3,000 AUD per month
- In 2023: ~¥15,000 RMB (at 5.0 exchange rate)
- In 2024: ~¥14,100 RMB (at 4.7 exchange rate)
- Fluctuations can significantly impact affordability

**Risk management strategies:**
- Maintain AUD savings buffer in Australia
- Use currency hedging products
- Plan for 20-30% currency fluctuation
- Consider fixed-rate loans for stability

### Alternative Financing Options

Given challenges with Australian banks, many Chinese investors consider:

**1. Cash Purchase**
- Most straightforward option
- Avoids lending complications
- Requires full capital transfer (challenging with controls)
- No ongoing currency risk

**2. Chinese Banks with Australian Presence**
- Bank of China (Australia)
- ICBC Australia
- May offer more flexible terms for Chinese nationals
- Requires good relationship and strong documentation
- Still subject to Australian lending regulations

**3. Private/Non-Bank Lenders**
- More flexible criteria
- Higher interest rates (8-10%+)
- Shorter loan terms
- Higher fees

**4. Hybrid Approach**
- Partial loan from Chinese bank
- Partial Australian financing
- Requires sophisticated structuring

### 4. Taxation

Beyond stamp duty and FIRB fees, be aware of ongoing taxes:

- **Land Tax**: Annual state-based tax on land value
- **Capital Gains Tax (CGT)**: Applies to profits made from selling property. Foreign residents are generally not eligible for the CGT main residence exemption
- **Foreign Purchaser Surcharge (Stamp Duty)**: An additional duty on top of standard stamp duty in most states

### 5. Cultural and Practical Aspects

- **Feng Shui**: Many Chinese buyers consider Feng Shui principles when selecting a property
- **Location**: Proximity to good schools, Asian supermarkets, and established Chinese communities (e.g., Sydney's Chatswood, Melbourne's Box Hill) is often highly valued
- **Professional Advice**: Engage trusted, bilingual professionals (real estate agents, lawyers, accountants, migration agents) who understand both Australian regulations and Chinese cultural nuances

## Start Your Australian Property Journey

Australia offers a secure and prosperous environment for property investment. With careful planning and professional guidance, Chinese investors can successfully navigate the market.

**Ready to explore your investment potential?** Use our [FIRB Calculator](/firb-calculator) to get a detailed cost breakdown and eligibility assessment for your Australian property investment.
    `
  },
  'visa-types-firb-requirements': {
    slug: 'visa-types-firb-requirements',
    title: 'Complete Guide: Australian Visa Types and FIRB Property Requirements 2025',
    excerpt: 'Your visa status determines FIRB requirements for Australian property purchase. This comprehensive guide covers all visa categories, the critical 2025 established dwelling ban, and step-by-step application process.',
    date: '2025-01-08',
    readTime: '10 min read',
    category: 'Visa & Residency',
    featured: false,
    tags: ['Visa Types', 'FIRB Requirements', 'Temporary Residents'],
    content: `
# Visa Types & FIRB Requirements: Complete Breakdown for Australian Property

Understanding how your Australian visa status impacts Foreign Investment Review Board (FIRB) requirements is critical before purchasing property. This guide provides a detailed breakdown of FIRB rules based on common visa categories.

## Who is a "Foreign Person" for FIRB Purposes?

Generally, a "foreign person" includes:

- An individual not ordinarily resident in Australia
- A corporation or trust in which a foreign person or persons hold a substantial interest

Your visa status directly influences whether you are considered "ordinarily resident" or a "temporary resident," which in turn dictates the FIRB rules that apply to you.

## FIRB Requirements by Visa Type

### 1. Australian Citizens & Permanent Residents

- **FIRB Approval**: **Not required.** Australian citizens and permanent residents are generally exempt from FIRB approval for residential property purchases
- **Spouses**: If an Australian citizen or permanent resident is purchasing property as joint tenants with their foreign spouse, FIRB approval is generally not required

### 2. New Zealand Citizens

- **FIRB Approval**: **Not required.** New Zealand citizens are generally exempt from FIRB approval for residential property purchases
- **Spouses**: Similar to Australian citizens, if a New Zealand citizen is purchasing property as joint tenants with their foreign spouse, FIRB approval is generally not required

### 3. Temporary Residents (e.g., 482, 457, Student Visas, 309/100, 820/801)

Temporary residents are individuals who hold a valid temporary visa that allows them to reside in Australia for a continuous period of more than 12 months, and who have resided in Australia for 12 months or more.

- **Established Dwellings**: Generally, temporary residents **need FIRB approval** to purchase one established dwelling to use as their principal place of residence
  - **Condition**: The property must be sold when they cease to reside in it or when their temporary visa expires, whichever comes first
  - **Important Update**: **As of April 1, 2025, there is a temporary ban on foreign persons (including temporary residents) purchasing established dwellings in Australia, effective until March 31, 2027.** During this period, FIRB applications for established dwellings by temporary residents will generally not be approved
- **New Dwellings**: Temporary residents **need FIRB approval** to purchase new dwellings. There are generally no restrictions on the number of new dwellings, but each purchase requires approval
- **Vacant Land**: Temporary residents **need FIRB approval** to purchase vacant land for residential development, with conditions to complete construction within a specified timeframe (usually 4 years)

### 4. Foreign Nationals (No Visa / Tourist Visa)

Individuals who are not Australian citizens, permanent residents, New Zealand citizens, or temporary residents are considered "non-resident foreign persons."

- **Established Dwellings**: Generally **not permitted** to purchase established dwellings. **This is reinforced by the temporary ban from April 1, 2025 - March 31, 2027**
- **New Dwellings**: **Need FIRB approval** to purchase new dwellings. There are generally no restrictions on the number of new dwellings, but each purchase requires approval
- **Vacant Land**: **Need FIRB approval** to purchase vacant land for residential development, with conditions to complete construction within a specified timeframe (usually 4 years)

## Key Takeaways

- **Always check FIRB**: If you are not an Australian or New Zealand citizen, assume you need FIRB approval
- **Temporary Ban**: Be acutely aware of the temporary ban on established dwellings for foreign persons (including temporary residents) from April 1, 2025, to March 31, 2027
- **Conditions Apply**: FIRB approvals often come with strict conditions that must be adhered to

**Unsure about your FIRB obligations?** Use our [FIRB Calculator](/firb-calculator) to get an instant eligibility check and estimated costs based on your citizenship and property type.
    `
  },
  'new-vs-established-property-foreign-buyers': {
    slug: 'new-vs-established-property-foreign-buyers',
    title: 'New vs Established Property: What Foreign Buyers Need to Know',
    excerpt: 'Compare the FIRB rules, costs, and investment potential of new versus established properties for foreign investors.',
    date: '2025-01-05',
    readTime: '7 min read',
    category: 'Property Types',
    featured: false,
    tags: ['New Property', 'Established Property', 'FIRB Rules'],
    content: `
# New vs Established Property: What Foreign Buyers Need to Know in Australia

For foreign investors looking to enter the Australian property market, one of the most fundamental decisions is whether to purchase a new dwelling or an established property. The rules, costs, and investment implications differ significantly. This guide breaks down the key considerations.

## Defining "New" and "Established" Dwellings

- **New Dwelling**: A dwelling that has not been previously sold as a dwelling, or has been substantially renovated and sold, or has been built on vacant land. This includes off-the-plan purchases
- **Established Dwelling**: Any dwelling that is not a new dwelling. This includes existing houses, apartments, and townhouses that have been previously occupied or sold

## FIRB Rules: A Critical Difference

The Foreign Investment Review Board (FIRB) applies vastly different rules to new versus established properties for foreign persons.

### Purchasing New Dwellings

- **General Rule**: Foreign persons (including non-residents and temporary residents) are generally permitted to purchase new dwellings
- **Approval**: FIRB approval is still required for each new dwelling purchase
- **Benefits**: Encourages the supply of new housing, often fewer restrictions
- **No Limit**: Generally, there is no limit to the number of new dwellings a foreign person can purchase, provided each purchase receives FIRB approval

### Purchasing Established Dwellings

- **General Rule for Non-Residents**: Non-resident foreign persons are generally **prohibited** from purchasing established dwellings
- **Temporary Residents**: Temporary residents generally **need FIRB approval** to purchase one established dwelling to use as their principal place of residence. They must sell it when they cease to reside in it or when their visa expires
- **Important Update: Temporary Ban (April 1, 2025 - March 31, 2027)**: There is a temporary ban on foreign persons (including temporary residents and foreign-owned companies) purchasing established dwellings in Australia. During this period, FIRB applications for established dwellings by temporary residents will generally not be approved
- **Exemptions**: Very limited exemptions exist, such as for foreign-owned companies purchasing established dwellings for their Australian-based employees (subject to conditions)

## Costs and Taxes

### Stamp Duty & Surcharges

- **New Dwellings**: Standard stamp duty applies, plus foreign purchaser surcharges in most states
- **Established Dwellings**: Standard stamp duty applies, plus foreign purchaser surcharges in most states (where permitted)

### FIRB Fees

- FIRB application fees apply to both new and established dwelling purchases (where permitted), tiered by property value

## Investment Potential

### New Dwellings

- **Pros**: Modern amenities, potential for depreciation benefits (tax), often located in master-planned communities, contributes to housing supply
- **Cons**: May be in developing areas with less established infrastructure, potential for oversupply in some markets, off-the-plan risks (e.g., builder delays, changes to plans)

### Established Dwellings

- **Pros**: Often in prime, established locations with existing infrastructure and amenities, potential for immediate rental income, land value appreciation
- **Cons**: Higher maintenance costs, older infrastructure, **significant FIRB restrictions for foreign buyers (especially with the temporary ban)**

## Conclusion

The choice between new and established property is heavily influenced by your foreign investment status and the prevailing FIRB regulations. While new dwellings offer more straightforward pathways for most foreign buyers, established properties in desirable locations can be attractive if you meet the strict eligibility criteria.

**Ready to understand your options?** Use our [FIRB Calculator](/firb-calculator) to assess your eligibility and estimate costs for both new and established properties.
    `
  },
  'sydney-property-investment-calculator-2025': {
    slug: 'sydney-property-investment-calculator-2025',
    title: 'Sydney Property Investment Calculator 2025: Complete Foreign Buyer Guide',
    excerpt: 'Comprehensive guide to Sydney property investment costs, FIRB requirements, and ROI calculations for foreign investors.',
    date: '2025-01-03',
    readTime: '12 min read',
    category: 'City Guides',
    featured: false,
    tags: ['Sydney', 'Property Investment', 'Foreign Buyers'],
    content: `
# Sydney Property Investment Calculator 2025: Complete Foreign Buyer Guide

Sydney, Australia's largest city, remains a global magnet for property investors due to its robust economy, strong population growth, and iconic lifestyle. For foreign buyers, understanding the specific costs and regulations is paramount. This guide, combined with our Sydney-specific calculator insights, will help you navigate the market in 2025.

## Why Invest in Sydney Property?

- **Strong Capital Growth**: Historically, Sydney has delivered significant long-term capital appreciation
- **Economic Hub**: A major financial and business centre, attracting talent and investment
- **Population Growth**: Consistent population increase drives demand for housing
- **Global City Status**: High demand from both local and international buyers and renters

## Key Costs for Foreign Investors in Sydney (2025)

When investing in Sydney property as a foreign buyer, you'll encounter several significant costs beyond the purchase price:

### 1. FIRB Application Fees

All foreign persons require Foreign Investment Review Board (FIRB) approval. Fees are tiered based on the property value.
- **Example**: For a property up to $1 million, the fee is $15,100. This increases with property value.

### 2. New South Wales (NSW) Stamp Duty

NSW stamp duty is a significant upfront cost. For foreign buyers, an additional surcharge applies.
- **General Stamp Duty**: Tiered rates, e.g., approximately 4.5% to 5.5% for properties over $300,000
- **Foreign Purchaser Surcharge**: An additional 8% of the property value ✅ (verified)
- **Example**: On a $1,000,000 property, you could pay around $40,490 (general) + $80,000 (surcharge) = $120,490 in stamp duty

### 3. Land Tax

An annual tax levied by the NSW government on the unimproved value of land you own, above a certain threshold. Foreign owners may face higher rates or lower thresholds.
- **Foreign Owner Surcharge Land Tax**: An additional **5%** ⚠️ **INCREASED** from 4% to 5% effective January 1, 2025

### 4. Legal and Conveyancing Fees

Typically range from $1,500 to $3,000, covering legal work for the property transfer.

### 5. Loan Application Fees & Mortgage Insurance

If you're borrowing, expect lender fees and potentially Lenders Mortgage Insurance (LMI) if your deposit is less than 20%. Foreign buyers often face stricter lending criteria and higher deposit requirements.

### 6. Property Management Fees

If you plan to rent out the property, expect fees of 6-8% of rental income, plus leasing fees.

## FIRB Rules & Restrictions for Sydney

- **New Dwellings**: Generally permitted with FIRB approval
- **Established Dwellings**: Non-residents are generally prohibited. Temporary residents **need FIRB approval** for one established dwelling as their principal place of residence, with a condition to sell upon departure
- **Temporary Ban (April 1, 2025 - March 31, 2027)**: A critical temporary ban is in place for foreign persons (including temporary residents) purchasing established dwellings. During this period, such applications will generally not be approved

## Calculating Your Sydney Investment ROI

Our FIRB Calculator provides a comprehensive breakdown, including:

- **Upfront Costs**: Purchase price, FIRB fees, stamp duty (including foreign surcharge), legal fees
- **Ongoing Costs**: Land tax (including foreign surcharge), council rates, insurance, maintenance
- **Rental Yield**: Potential income from rent
- **Capital Growth Projections**: Estimated property value appreciation over time
- **Cash Flow Analysis**: Detailed 10-year projections of income vs. expenses

**Ready to calculate your Sydney property investment?** Use our [FIRB Calculator](/firb-calculator) for a detailed, Sydney-specific financial analysis.
    `
  },
  'melbourne-property-investment-guide': {
    slug: 'melbourne-property-investment-guide',
    title: 'Melbourne Property Investment Guide: Foreign Buyer\'s Complete 2025 Handbook',
    excerpt: 'Comprehensive guide to Melbourne property investment, including costs, FIRB requirements, and investment strategies.',
    date: '2025-01-01',
    readTime: '11 min read',
    category: 'City Guides',
    featured: false,
    tags: ['Melbourne', 'Property Investment', 'Foreign Buyers'],
    content: `
# Melbourne Property Investment Guide: Foreign Buyer's Complete 2025 Handbook

Melbourne consistently ranks among the world's most liveable cities, boasting a vibrant culture, strong economy, and leading educational institutions. These factors make it a highly attractive market for foreign property investors. This guide provides a comprehensive overview for those looking to invest in Melbourne in 2025.

## Why Invest in Melbourne Property?

- **Liveability**: Consistently high rankings for quality of life, healthcare, education, infrastructure, and environment
- **Economic Diversity**: Strong sectors in finance, healthcare, education, and technology
- **Population Growth**: Rapidly growing population, driving demand for housing
- **Cultural Capital**: Renowned for its arts, food, and sporting events

## Key Costs for Foreign Investors in Melbourne (2025)

Foreign buyers in Melbourne (Victoria) need to budget for several specific costs:

### 1. FIRB Application Fees

All foreign persons must obtain Foreign Investment Review Board (FIRB) approval. Fees are tiered based on the property value.
- **Example**: For a property up to $1 million, the fee is $15,100. This fee increases with property value.

### 2. Victoria (VIC) Stamp Duty

Victorian stamp duty is a substantial upfront cost, with an additional foreign purchaser surcharge.
- **General Stamp Duty**: Tiered rates, e.g., approximately 5.5% for properties over $960,000
- **Foreign Purchaser Surcharge**: An additional 8% of the property value ✅ (verified)
- **Example**: On a $1,000,000 property, you could pay around $55,000 (general) + $80,000 (surcharge) = $135,000 in stamp duty

### 3. Land Tax

An annual tax levied by the Victorian government on the total taxable value of land you own, above a certain threshold.
- **Absentee Owner Surcharge**: An additional 2% on the taxable value of land for foreign owners ✅ (verified)

### 4. Legal and Conveyancing Fees

Typically range from $1,500 to $3,000, covering legal work for the property transfer.

### 5. Loan Application Fees & Mortgage Insurance

If you're borrowing, expect lender fees and potentially Lenders Mortgage Insurance (LMI). Foreign buyers often face stricter lending criteria and higher deposit requirements from Australian banks.

### 6. Property Management Fees

If you plan to rent out the property, expect fees of 6-8% of rental income, plus leasing fees.

## FIRB Rules & Restrictions for Melbourne

- **New Dwellings**: Generally permitted with FIRB approval
- **Established Dwellings**: Non-residents are generally prohibited. Temporary residents **need FIRB approval** for one established dwelling as their principal place of residence, with a condition to sell upon departure
- **Temporary Ban (April 1, 2025 - March 31, 2027)**: A critical temporary ban is in place for foreign persons (including temporary residents) purchasing established dwellings. During this period, such applications will generally not be approved

## Investment Strategies for Melbourne

- **Inner-City Apartments**: Popular with students and young professionals, but be mindful of potential oversupply in some areas
- **Growth Corridors**: Look to outer suburbs with planned infrastructure development for long-term capital growth
- **Regional Victoria**: Explore opportunities in strong regional centres for potentially higher yields and lower entry costs

## Calculating Your Melbourne Investment

Our FIRB Calculator provides a comprehensive breakdown, including:

- **Upfront Costs**: Purchase price, FIRB fees, stamp duty (including foreign surcharge), legal fees
- **Ongoing Costs**: Land tax (including foreign surcharge), council rates, insurance, maintenance
- **Rental Yield**: Potential income from rent
- **Capital Growth Projections**: Estimated property value appreciation over time
- **Cash Flow Analysis**: Detailed 10-year projections of income vs. expenses

**Ready to calculate your Melbourne property investment?** Use our [FIRB Calculator](/firb-calculator) for a detailed, Melbourne-specific financial analysis.
    `
  },
  'brisbane-foreign-investment-property': {
    slug: 'brisbane-foreign-investment-property',
    title: 'Brisbane Foreign Investment Property: Complete 2025 Guide',
    excerpt: 'Comprehensive guide to Brisbane property investment for foreign buyers, including costs, FIRB requirements, and opportunities.',
    date: '2024-12-28',
    readTime: '10 min read',
    category: 'City Guides',
    featured: false,
    tags: ['Brisbane', 'Foreign Investment', 'Property Guide'],
    content: `
# Brisbane Foreign Investment Property: Complete 2025 Guide

Brisbane, Queensland's vibrant capital, is rapidly growing in prominence, driven by significant infrastructure projects, a booming economy, and its selection as the host city for the 2032 Olympic Games. These factors make it an increasingly attractive destination for foreign property investors. This guide provides a comprehensive overview for those looking to invest in Brisbane in 2025.

## Why Invest in Brisbane Property?

- **Growth Potential**: Strong population growth and major infrastructure spending (e.g., Cross River Rail, Brisbane Metro, Queen's Wharf) are set to drive property values
- **Affordability**: Generally more affordable than Sydney and Melbourne, offering higher rental yields
- **Olympic Legacy**: The 2032 Olympic Games are expected to bring significant investment and global attention, boosting the property market
- **Lifestyle**: Subtropical climate, relaxed lifestyle, and access to beautiful natural attractions

## Key Costs for Foreign Investors in Brisbane (2025)

Foreign buyers in Brisbane (Queensland) need to budget for several specific costs:

### 1. FIRB Application Fees

All foreign persons must obtain Foreign Investment Review Board (FIRB) approval. Fees are tiered based on the property value.
- **Example**: For a property up to $1 million, the fee is $15,100. This fee increases with property value.

### 2. Queensland (QLD) Stamp Duty

Queensland stamp duty is an upfront cost, with an additional foreign acquirer duty.
- **General Stamp Duty**: Tiered rates, e.g., approximately 3.5% to 5.75% for properties over $540,000
- **Foreign Acquirer Duty**: An additional 7% of the property value ✅ (verified)
- **Example**: On a $700,000 property, you could pay around $24,350 (general) + $49,000 (surcharge) = $73,350 in stamp duty

### 3. Land Tax

An annual tax levied by the Queensland government on the total taxable value of land you own, above a certain threshold.
- **Absentee Land Tax Surcharge**: An additional 2% on the taxable value of land for foreign owners ✅ (verified)

### 4. Legal and Conveyancing Fees

Typically range from $1,500 to $3,000, covering legal work for the property transfer.

### 5. Loan Application Fees & Mortgage Insurance

If you're borrowing, expect lender fees and potentially Lenders Mortgage Insurance (LMI). Foreign buyers often face stricter lending criteria and higher deposit requirements from Australian banks.

### 6. Property Management Fees

If you plan to rent out the property, expect fees of 7-9% of rental income, plus leasing fees.

## FIRB Rules & Restrictions for Brisbane

- **New Dwellings**: Generally permitted with FIRB approval
- **Established Dwellings**: Non-residents are generally prohibited. Temporary residents **need FIRB approval** for one established dwelling as their principal place of residence, with a condition to sell upon departure
- **Temporary Ban (April 1, 2025 - March 31, 2027)**: A critical temporary ban is in place for foreign persons (including temporary residents) purchasing established dwellings. During this period, such applications will generally not be approved

## Investment Hotspots in Brisbane

- **Inner-City Suburbs**: Areas like South Brisbane, West End, and Fortitude Valley offer strong rental demand for apartments
- **Growth Corridors**: Northern and Southern growth corridors (e.g., Moreton Bay, Logan) offer house and land packages with future capital growth potential
- **Olympic Precincts**: Suburbs near future Olympic venues are likely to see increased infrastructure and demand

## Calculating Your Brisbane Investment

Our FIRB Calculator provides a comprehensive breakdown, including:

- **Upfront Costs**: Purchase price, FIRB fees, stamp duty (including foreign acquirer duty), legal fees
- **Ongoing Costs**: Land tax (including absentee surcharge), council rates, insurance, maintenance
- **Rental Yield**: Potential income from rent
- **Capital Growth Projections**: Estimated property value appreciation over time
- **Cash Flow Analysis**: Detailed 10-year projections of income vs. expenses

**Ready to calculate your Brisbane property investment?** Use our [FIRB Calculator](/firb-calculator) for a detailed, Brisbane-specific financial analysis.
    `
  },
  'firb-fees-breakdown-2025': {
    slug: 'firb-fees-breakdown-2025',
    title: 'FIRB Fees Breakdown 2025: Complete Foreign Investment Cost Guide',
    excerpt: 'Comprehensive breakdown of FIRB application fees, processing costs, and total investment expenses for foreign property buyers.',
    date: '2024-12-25',
    readTime: '9 min read',
    category: 'Costs & Fees',
    featured: false,
    tags: ['FIRB Fees', 'Foreign Investment', 'Cost Breakdown'],
    content: `
# FIRB Fees Breakdown 2025: Complete Foreign Investment Cost Guide

For foreign investors eyeing the Australian property market, understanding the Foreign Investment Review Board (FIRB) application fees is a non-negotiable part of the budgeting process. These fees are a mandatory cost for most foreign acquisitions of Australian residential real estate. This guide provides a comprehensive breakdown of FIRB fees in 2025.

## What are FIRB Application Fees?

FIRB application fees are charges imposed by the Australian Government for processing applications from foreign persons seeking to invest in Australia. These fees contribute to the administration of Australia's foreign investment framework.

## Key Principles of FIRB Fees

- **Mandatory**: If FIRB approval is required, the fee must be paid upon application
- **Tiered Structure**: Fees are tiered based on the value of the proposed investment. Higher value investments incur higher fees
- **Non-Refundable**: Fees are generally non-refundable, even if the application is withdrawn or rejected
- **Annual Indexation**: Fees are typically indexed annually on 1 July, so it's crucial to check the most current schedule. The figures below are based on the latest available guidance (e.g., FIRB Guidance Note 10, Version 6, March 14, 2025)

## FIRB Residential Land Application Fees (2025)

**Source**: Australian Taxation Office - Foreign Investment Fees (1 July 2025 – 30 June 2026)

The following table outlines the typical fees for purchasing residential land (new dwellings, established dwellings where permitted, and vacant land).

| Property Value Range | Application Fee |
| :------------------- | :-------------- |
| Up to $1 million     | $15,100         |
| $1 million - $2 million | $30,300         |
| $2 million - $3 million | $45,500         |
| $3 million - $4 million | $60,600         |
| $4 million - $5 million | $75,800         |
| $5 million - $6 million | $91,000         |
| $6 million - $7 million | $106,200        |
| $7 million - $8 million | $121,400        |
| $8 million - $9 million | $136,600        |
| $9 million - $10 million | $151,800        |
| For every additional $1 million or part thereof above $10 million, the fee increases by $15,100 |

*Note: These fees are for a single dwelling. Different fee structures apply for commercial property, multiple dwellings in one application, or developed residential land.*

## Penalties for Non-Compliance

**Source**: Foreign Acquisitions and Takeovers Act 1975, Treasury announcements (penalties doubled effective January 1, 2023)

It is critical to comply with FIRB regulations. Significant penalties apply for breaches, including:

- **Civil Penalties**: For individuals, fines can be up to **$6,660,000** (30,000 penalty units × $222 per unit). For corporations, fines can be up to **$66,600,000** (300,000 penalty units × $222 per unit)
- **Criminal Penalties**: Imprisonment for up to **10 years**
- **Forced Divestment**: The foreign person may be forced to sell the property, often at a loss

## Other Costs to Budget For

FIRB fees are just one component of the total investment cost. Foreign buyers must also consider:

- **Stamp Duty**: State-based tax on property transfers, often with additional foreign purchaser surcharges
- **Legal/Conveyancing Fees**: For professional legal services
- **Lender Fees**: If obtaining a mortgage
- **Building & Pest Inspections**: Recommended for established properties
- **Council Rates & Land Tax**: Ongoing annual costs
- **Property Management Fees**: If renting out the property

## How Our Calculator Helps

Our [FIRB Calculator](/firb-calculator) provides an instant estimate of your FIRB application fee based on the property value you enter. It also integrates state-specific stamp duty (including foreign surcharges) and other potential costs, giving you a comprehensive financial overview of your Australian property investment.

**Ready to calculate your FIRB fees and total investment costs?** Use our free calculator today!
    `
  },
  'australian-property-roi-calculator': {
    slug: 'australian-property-roi-calculator',
    title: 'Australian Property ROI Calculator: Complete Investment Analysis Guide',
    excerpt: 'Comprehensive guide to calculating property investment returns, rental yields, and capital growth for Australian real estate.',
    date: '2024-12-22',
    readTime: '13 min read',
    category: 'Investment Analysis',
    featured: false,
    tags: ['ROI Calculator', 'Property Investment', 'Investment Analysis'],
    content: `
# Australian Property ROI Calculator: Complete Investment Analysis Guide

Understanding the potential Return on Investment (ROI) is paramount for any property investor, especially for foreign buyers navigating the Australian market. Our FIRB Calculator goes beyond just fees, offering a robust ROI analysis to help you make informed decisions. This guide explains how to calculate ROI and what factors influence it in Australia.

## What is ROI in Property Investment?

Return on Investment (ROI) is a performance measure used to evaluate the efficiency or profitability of an investment. In property, it helps you understand the financial gain or loss relative to the initial cost.

**Basic ROI Formula:**
ROI = (Net Profit / Cost of Investment) x 100%

However, property ROI is more complex, involving both rental yield and capital growth.

## Key Components of Australian Property ROI

### 1. Rental Yield

This measures the annual rental income as a percentage of the property's value.

**Gross Rental Yield Formula:**
(Annual Rental Income / Property Value) x 100%

**Net Rental Yield Formula:**
((Annual Rental Income - Annual Expenses) / Property Value) x 100%

- **Factors Affecting Yield**: Location, property type (house vs. apartment), local rental demand, property condition
- **Australian Context**: Rental yields vary significantly across cities and regions. Generally, regional areas might offer higher yields than capital cities, but capital growth can differ

### 2. Capital Growth

This is the increase in the property's value over time.

- **Factors Affecting Capital Growth**: Economic conditions, interest rates, population growth, infrastructure development, local supply and demand, zoning changes
- **Australian Context**: Australian property markets, particularly in major capital cities, have historically shown strong long-term capital appreciation

### 3. Total Investment Costs

Accurately calculating your "Cost of Investment" is crucial. For foreign buyers, this includes:

- **Purchase Price**
- **FIRB Application Fees** (verified 2025 rates)
- **Stamp Duty** (including foreign purchaser surcharges)
- **Legal/Conveyancing Fees**
- **Lender Fees & Mortgage Insurance** (if applicable)
- **Buyer's Agent Fees** (if used)
- **Initial Renovation/Maintenance Costs**

### 4. Ongoing Expenses

These reduce your net profit and include:

- **Loan Interest Payments**
- **Council Rates**
- **Land Tax** (including foreign owner surcharges - NSW increased to 5% as of January 1, 2025)
- **Strata/Body Corporate Fees** (for apartments/townhouses)
- **Property Management Fees**
- **Insurance**
- **Maintenance & Repairs**
- **Vacancy Costs**

## How Our FIRB Calculator Provides Comprehensive ROI Analysis

Our calculator is designed to give foreign investors a holistic view of their potential ROI by integrating all relevant financial data:

- **Detailed Cost Breakdown**: Calculates all upfront and ongoing costs specific to your situation (FIRB fees, state-specific stamp duty, foreign surcharges, legal fees, etc.)
- **10-Year Projections**: Provides a decade-long forecast of:
  - **Property Value Growth**: Based on customizable annual growth rates
  - **Rental Income Growth**: Based on customizable annual rental increase rates
  - **Cash Flow Analysis**: Monthly and annual breakdown of income vs. expenses
  - **Equity Growth**: How your ownership stake increases over time
- **Key Metrics**: Presents clear figures for:
  - **Gross & Net Rental Yields**
  - **Total ROI (including capital growth)**
  - **Break-even points**

## Maximizing Your Property ROI in Australia

- **Research Location**: Focus on areas with strong demand drivers (jobs, infrastructure, amenities)
- **Understand Market Cycles**: Buy low, sell high (easier said than done, but long-term holds generally perform well)
- **Minimize Vacancy**: Keep good tenants and maintain the property well
- **Tax Efficiency**: Consult a tax advisor to understand deductions and depreciation benefits
- **Leverage**: Use borrowing wisely to amplify returns (but be mindful of interest rate risks)

**Ready to get a detailed ROI analysis for your Australian property investment?** Use our [FIRB Calculator](/firb-calculator) today to unlock comprehensive insights and make smarter investment decisions.
    `
  }
};

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [resolvedParams, setResolvedParams] = React.useState<{ locale: string; slug: string } | null>(null);
  
  React.useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);
  
  const t = useTranslations('Blog');
  
  if (!resolvedParams) {
    return <div>Loading...</div>;
  }
  
  const { slug } = resolvedParams;
  
  const post = blogPosts[slug];
  
  if (!post) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Back Button */}
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 w-4 h-4" />
            {t('backToBlog')}
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{post.category}</Badge>
            {post.featured && (
              <Badge variant="outline">Featured</Badge>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between border-b pb-8">
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {new Date(post.date).toLocaleDateString('en-AU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {post.readTime}
              </div>
            </div>
            
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 w-4 h-4" />
              {t('share')}
            </Button>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>').replace(/#{1,6}\s/g, '<h1>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        </div>

        {/* Tags */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">{t('tags')}</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 mb-12">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold mb-4">{t('cta.title')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('cta.description')}
            </p>
            <Button size="lg" asChild>
              <Link href="/firb-calculator">
                {t('cta.button')} <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Related Posts */}
        <section>
          <h3 className="text-2xl font-bold mb-6">{t('relatedPosts')}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.values(blogPosts)
              .filter((relatedPost: BlogPost) => relatedPost.slug !== slug)
              .slice(0, 2)
              .map((relatedPost: BlogPost) => (
                <Card key={relatedPost.slug} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <Badge variant="secondary" className="text-xs w-fit mb-2">
                      {relatedPost.category}
                    </Badge>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        {relatedPost.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">
                      {relatedPost.excerpt}
                    </p>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${relatedPost.slug}`}>
                        {t('readMore')} <ArrowRight className="ml-1 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>
      </article>
    </main>
  );
}
