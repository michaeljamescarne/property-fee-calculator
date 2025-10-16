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
    title: 'Ultimate FIRB Guide 2025: Complete Foreign Investment Rules',
    excerpt: 'Everything foreign investors need to know about FIRB approval, fees, and requirements for Australian property investment.',
    date: '2025-01-15',
    readTime: '12 min read',
    category: 'FIRB Guide',
    featured: true,
    tags: ['FIRB', 'Foreign Investment', 'Property Rules'],
    content: `
# Ultimate FIRB Guide 2025: Complete Foreign Investment Rules

The Foreign Investment Review Board (FIRB) is Australia's regulatory body that examines foreign investment proposals. For property investors, understanding FIRB requirements is crucial for successful Australian real estate investments.

## What is FIRB?

The Foreign Investment Review Board (FIRB) is an Australian government body that examines proposals by foreign persons to invest in Australia and makes recommendations to the Treasurer on those proposals.

### Key Responsibilities:
- Reviewing foreign investment proposals
- Providing advice to the Treasurer
- Ensuring compliance with foreign investment rules
- Protecting Australia's national interests

## Who Needs FIRB Approval?

### Foreign Persons Requiring Approval:
- **Foreign nationals** (non-Australian citizens)
- **Temporary residents** (457, 482, student visa holders)
- **Foreign companies** and trusts
- **Foreign governments** and their agencies

### Australian Citizens/Residents:
- **Australian citizens** - No FIRB approval required
- **Permanent residents** - No FIRB approval required
- **New Zealand citizens** - No FIRB approval required

## Property Types and FIRB Rules

### New Dwellings
- **Approval Required**: Yes, for foreign persons
- **Conditions**: Can be purchased as investment or primary residence
- **No restrictions** on number of properties
- **Must be sold** to Australian citizens/residents if used as investment

### Established Dwellings
- **Approval Required**: Yes, for foreign persons
- **Conditions**: Can only be purchased as primary residence
- **Must be sold** when no longer primary residence
- **Cannot be rented out** while owned

### Vacant Land
- **Approval Required**: Yes, for foreign persons
- **Conditions**: Must commence construction within 24 months
- **Completion deadline**: 4 years from purchase
- **Cannot be sold** until construction completed

## FIRB Application Fees 2025

| Property Value | FIRB Application Fee |
|----------------|---------------------|
| Under $1M | $13,200 |
| $1M - $1.999M | $26,400 |
| $2M - $2.999M | $39,600 |
| $3M - $3.999M | $52,800 |
| $4M - $4.999M | $66,000 |
| Each additional $1M | +$13,200 |

### Vacant Land Fees:
- Under $1.5M: $5,500

### Expedited Processing:
- Additional $10,000+ for 10-day processing

## Application Process

### Step 1: Determine Eligibility
Use our [FIRB Calculator](/firb-calculator) to determine if you need approval and calculate associated costs.

### Step 2: Gather Required Documents
- Passport copy
- Visa documentation
- Property details
- Financial statements
- Proof of funds

### Step 3: Submit Application
- Complete online application
- Pay application fee
- Wait for approval (typically 30 days)

### Step 4: Receive Approval
- Approval letter with conditions
- Proceed with property purchase
- Comply with ongoing requirements

## Common Conditions

### For New Dwellings:
- Must be sold to Australian citizens/residents if used as investment
- Cannot be rented to foreign persons
- Must notify FIRB of any changes

### For Established Dwellings:
- Must be used as primary residence
- Cannot be rented out
- Must be sold when no longer primary residence

### For Vacant Land:
- Must commence construction within 24 months
- Must complete construction within 4 years
- Cannot be sold until construction completed

## Penalties for Non-Compliance

### Civil Penalties:
- **Individuals**: Up to $1.1 million
- **Companies**: Up to $5.5 million
- **Additional penalties**: Up to 25% of property value

### Criminal Penalties:
- **Individuals**: Up to 3 years imprisonment
- **Companies**: Up to $5.5 million fine

### Forced Divestment:
- Property must be sold
- Cannot purchase replacement property
- May be banned from future purchases

## Tips for Success

### Before Applying:
1. **Use our calculator** to understand costs
2. **Review all conditions** carefully
3. **Ensure compliance** with ongoing requirements
4. **Seek professional advice** if unsure

### During Application:
1. **Provide complete information**
2. **Respond promptly** to requests
3. **Maintain accurate records**
4. **Follow up** if needed

### After Approval:
1. **Comply with all conditions**
2. **Notify FIRB** of changes
3. **Keep records** of compliance
4. **Seek advice** for any questions

## Conclusion

Understanding FIRB requirements is essential for successful Australian property investment. Use our comprehensive calculator to determine your eligibility and costs, then follow the application process carefully to ensure compliance.

**Ready to calculate your FIRB costs?** [Use our free calculator](/firb-calculator) to get instant results and detailed breakdowns.
    `
  },
  'stamp-duty-calculator-by-state': {
    slug: 'stamp-duty-calculator-by-state',
    title: 'Stamp Duty Calculator by State: Complete 2025 Comparison',
    excerpt: 'Compare stamp duty rates and foreign buyer surcharges across all Australian states and territories.',
    date: '2025-01-12',
    readTime: '8 min read',
    category: 'Costs & Fees',
    featured: true,
    tags: ['Stamp Duty', 'State Comparison', 'Foreign Buyer Surcharge'],
    content: `
# Stamp Duty Calculator by State: Complete 2025 Comparison

Stamp duty is one of the largest upfront costs when purchasing property in Australia. For foreign buyers, additional surcharges can significantly increase these costs. This comprehensive guide breaks down stamp duty rates across all Australian states and territories.

## What is Stamp Duty?

Stamp duty (also called transfer duty) is a state government tax levied on property transactions. It's calculated based on the property's purchase price and varies significantly between states.

## Stamp Duty Rates by State

### New South Wales (NSW)
**Base Stamp Duty Rates:**
- $0 - $14,000: 1.25%
- $14,001 - $32,000: $175 + 1.5% of excess over $14,000
- $32,001 - $85,000: $445 + 1.75% of excess over $32,000
- $85,001 - $319,000: $1,372.50 + 3.5% of excess over $85,000
- $319,001 - $1,064,000: $9,562.50 + 4.5% of excess over $319,000
- Over $1,064,000: $43,087.50 + 5.5% of excess over $1,064,000

**Foreign Buyer Surcharge:** 8%

### Victoria (VIC)
**Base Stamp Duty Rates:**
- $0 - $25,000: 1.4%
- $25,001 - $130,000: $350 + 2.4% of excess over $25,000
- $130,001 - $960,000: $2,870 + 5% of excess over $130,000
- Over $960,000: $44,370 + 6.5% of excess over $960,000

**Foreign Buyer Surcharge:** 8%

### Queensland (QLD)
**Base Stamp Duty Rates:**
- $0 - $5,000: 0%
- $5,001 - $75,000: 1.5%
- $75,001 - $540,000: $1,050 + 3.5% of excess over $75,000
- $540,001 - $1,000,000: $17,325 + 4.5% of excess over $540,000
- Over $1,000,000: $38,025 + 5.75% of excess over $1,000,000

**Foreign Buyer Surcharge:** 7%

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

**Foreign Buyer Surcharge:** 7%

### Western Australia (WA)
**Base Stamp Duty Rates:**
- $0 - $120,000: 1.9%
- $120,001 - $150,000: $2,280 + 2.85% of excess over $120,000
- $150,001 - $360,000: $3,135 + 3.8% of excess over $150,000
- $360,001 - $725,000: $11,115 + 4.75% of excess over $360,000
- Over $725,000: $28,445 + 5.15% of excess over $725,000

**Foreign Buyer Surcharge:** 7%

### Tasmania (TAS)
**Base Stamp Duty Rates:**
- $0 - $3,000: 1.75%
- $3,001 - $25,000: $52.50 + 2.25% of excess over $3,000
- $25,001 - $75,000: $547.50 + 3.5% of excess over $25,000
- $75,001 - $200,000: $1,297.50 + 4% of excess over $75,000
- $200,001 - $375,000: $6,297.50 + 4.25% of excess over $200,000
- Over $375,000: $13,737.50 + 4.5% of excess over $375,000

**Foreign Buyer Surcharge:** 8%

### Northern Territory (NT)
**Base Stamp Duty Rates:**
- $0 - $525,000: 0.5%
- $525,001 - $3,000,000: $2,625 + 5.5% of excess over $525,000
- Over $3,000,000: $138,750 + 7.5% of excess over $3,000,000

**Foreign Buyer Surcharge:** 0%

### Australian Capital Territory (ACT)
**Base Stamp Duty Rates:**
- $0 - $200,000: 2.2%
- $200,001 - $300,000: $4,400 + 3.4% of excess over $200,000
- $300,001 - $500,000: $7,800 + 4.32% of excess over $300,000
- $500,001 - $750,000: $16,440 + 5.9% of excess over $500,000
- $750,001 - $1,000,000: $31,190 + 6.4% of excess over $750,000
- Over $1,000,000: $47,190 + 6.4% of excess over $1,000,000

**Foreign Buyer Surcharge:** 0%

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
