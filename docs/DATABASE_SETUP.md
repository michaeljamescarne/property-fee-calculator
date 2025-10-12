# Database Setup Guide - Supabase Integration

## Overview

This project currently **does not have a database**. All calculations are stateless. This guide explains how to add Supabase for FIRB calculation persistence, shareable URLs, and user features.

---

## Why Add a Database?

### Current Limitations (No Database)
- ❌ No shareable calculation URLs
- ❌ No calculation history
- ❌ No saved results
- ❌ No user accounts
- ❌ No analytics on calculations

### Benefits with Supabase
- ✅ Shareable calculation URLs (e.g., `/results/abc123`)
- ✅ Save and retrieve calculations
- ✅ Email results to users
- ✅ User accounts (optional)
- ✅ Analytics and insights
- ✅ PostgreSQL with full SQL capabilities
- ✅ Real-time subscriptions (future)
- ✅ Row Level Security (RLS)
- ✅ Free tier: 500MB database, 50K monthly active users

---

## Setup Steps

### Step 1: Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - **Name**: Property Fee Calculator
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to Australia (e.g., Sydney)
4. Click "Create new project"
5. Wait 2-3 minutes for provisioning

### Step 2: Get Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (safe for client-side)
   - **service_role key**: `eyJhbGc...` (keep secret!)

### Step 3: Install Supabase Client

```bash
cd /Users/michaelcarne/Sites/aupropertyinvestment/property-fee-calculator
npm install @supabase/supabase-js
```

### Step 4: Configure Environment Variables

Create `.env.local` in project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service role key (for server-side operations only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** `.env.local` is already in `.gitignore` - never commit this file!

### Step 5: Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase/migrations/20250110_create_firb_calculations.sql`
4. Paste into SQL editor
5. Click "Run" or press `Cmd+Enter`
6. Verify success message

**Alternative (using Supabase CLI):**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migration
supabase db push
```

### Step 6: Create Supabase Client

Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (for API routes)
export function createServerSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY not set');
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
```

### Step 7: Update Vercel Environment Variables

For production deployment:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Select all environments (Production, Preview, Development)
6. Click "Save"
7. Redeploy for changes to take effect

---

## Database Schema

### Table: `firb_calculations`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp (auto-updated) |
| `share_url_slug` | TEXT | Unique slug for shareable URLs (auto-generated) |
| `citizenship_status` | ENUM | 'australian', 'permanent', 'temporary', 'foreign' |
| `visa_type` | TEXT | Visa subclass (e.g., '482', '500', '444') |
| `is_ordinarily_resident` | BOOLEAN | Whether temporary resident ordinarily resides in Australia |
| `property_type` | ENUM | 'newDwelling', 'established', 'vacantLand', 'commercial' |
| `property_value` | DECIMAL(12,2) | Property purchase price |
| `property_state` | ENUM | 'NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT' |
| `property_address` | TEXT | Optional property address |
| `is_first_home` | BOOLEAN | First home buyer status |
| `deposit_percent` | DECIMAL(5,2) | Deposit percentage (0-100) |
| `entity_type` | ENUM | 'individual', 'company', 'trust' |
| `eligibility_result` | JSONB | Eligibility determination results |
| `cost_breakdown` | JSONB | Detailed fee breakdown |
| `user_email` | TEXT | Email for sharing results (optional) |
| `locale` | TEXT | 'en' or 'zh' |
| `deleted_at` | TIMESTAMPTZ | Soft delete timestamp |

### JSONB Structures

#### `eligibility_result`:
```json
{
  "isEligible": true,
  "requiresFIRB": true,
  "firbApprovalType": "required",
  "restrictions": [
    "Must use as primary residence",
    "Must sell within 3 months of visa expiry"
  ],
  "recommendations": [
    "Apply for FIRB approval before contract signing",
    "Budget for annual vacancy fee compliance"
  ],
  "approvalTimeline": {
    "standard": "30 days",
    "expedited": "10 days"
  }
}
```

#### `cost_breakdown`:
```json
{
  "upfrontCosts": {
    "firbApplicationFee": 13200,
    "firbExpeditedFee": 0,
    "standardStampDuty": 32000,
    "stampDutySurcharge": 68000,
    "totalStampDuty": 100000,
    "legalFees": 2500,
    "inspectionFees": 800,
    "otherFees": 500,
    "totalUpfront": 117000
  },
  "annualCosts": {
    "landTaxSurcharge": 10200,
    "vacancyFee": 13200,
    "councilRates": 2000,
    "strataFees": 4000,
    "totalAnnual": 29400
  },
  "firstYearTotal": 146400,
  "fiveYearTotal": 264000,
  "tenYearTotal": 411000,
  "breakdown": [
    {
      "id": "firb-1",
      "category": "FIRB",
      "description": "Application Fee",
      "amount": 13200,
      "frequency": "one-time",
      "optional": false,
      "notes": "Based on property value $850,000"
    }
  ]
}
```

---

## Usage Examples

### 1. Save a Calculation (API Route)

```typescript
// app/api/calculate-firb/route.ts
import { createServerSupabaseClient } from '@/lib/supabase';
import { FIRBCalculationInsert } from '@/types/database';

export async function POST(request: NextRequest) {
  const input = await request.json();
  
  // Perform calculations
  const eligibilityResult = determineEligibility(input);
  const costBreakdown = calculateCosts(input);
  
  // Save to database
  const supabase = createServerSupabaseClient();
  
  const calculation: FIRBCalculationInsert = {
    citizenship_status: input.citizenshipStatus,
    visa_type: input.visaType,
    is_ordinarily_resident: input.isOrdinarlyResident,
    property_type: input.propertyType,
    property_value: input.propertyValue,
    property_state: input.propertyState,
    property_address: input.propertyAddress,
    is_first_home: input.isFirstHome,
    deposit_percent: input.depositPercent,
    entity_type: input.entityType,
    eligibility_result: eligibilityResult,
    cost_breakdown: costBreakdown,
    user_email: input.userEmail,
    locale: input.locale || 'en'
    // share_url_slug will be auto-generated
  };
  
  const { data, error } = await supabase
    .from('firb_calculations')
    .insert(calculation)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({
    ...costBreakdown,
    eligibility: eligibilityResult,
    shareUrl: `/results/${data.share_url_slug}`
  });
}
```

### 2. Retrieve Calculation by Share URL

```typescript
// app/api/results/[slug]/route.ts
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('firb_calculations_public') // Use public view (excludes email)
    .select('*')
    .eq('share_url_slug', slug)
    .single();
  
  if (error || !data) {
    return NextResponse.json({ error: 'Calculation not found' }, { status: 404 });
  }
  
  return NextResponse.json(data);
}
```

### 3. Client-Side: Share Calculation

```typescript
// components/FIRBResults.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';

export default function FIRBResults({ shareUrl }: { shareUrl: string }) {
  const [copied, setCopied] = useState(false);
  
  const fullUrl = `${window.location.origin}${shareUrl}`;
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="flex items-center gap-2">
      <Input value={fullUrl} readOnly />
      <Button onClick={handleCopy} variant="outline">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
```

### 4. Results Page

```typescript
// app/[locale]/results/[slug]/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase';
import FIRBResults from '@/components/FIRBResults';
import { notFound } from 'next/navigation';

export default async function ResultsPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServerSupabaseClient();
  
  const { data } = await supabase
    .from('firb_calculations_public')
    .select('*')
    .eq('share_url_slug', slug)
    .single();
  
  if (!data) {
    notFound();
  }
  
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Saved Calculation Results</h1>
      <FIRBResults result={data} />
    </main>
  );
}
```

---

## Security Considerations

### Row Level Security (RLS)

The migration includes RLS policies:

1. **Insert**: Anyone can create calculations (anonymous)
2. **Select**: Anyone can read calculations (for shareable URLs)
3. **Update**: Only calculation owner (by email) if authenticated
4. **Delete**: Only calculation owner (soft delete)

### API Key Security

- ✅ **anon key**: Safe for client-side (limited by RLS)
- ⚠️ **service_role key**: NEVER expose to client (use only in API routes)

### Best Practices

```typescript
// ❌ DON'T: Use service role key client-side
import { createServerSupabaseClient } from '@/lib/supabase';

export default function ClientComponent() {
  const supabase = createServerSupabaseClient(); // ERROR!
}

// ✅ DO: Use anon key client-side
import { supabase } from '@/lib/supabase';

export default function ClientComponent() {
  const client = supabase; // Safe
}

// ✅ DO: Use service role key server-side
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient(); // Correct
}
```

---

## Optional: Email Integration

### Send Calculation Results via Email

```bash
npm install resend
```

```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCalculationEmail(
  email: string,
  shareUrl: string,
  calculation: CostBreakdown
) {
  await resend.emails.send({
    from: 'FIRB Calculator <noreply@propertyfeecalculator.com>',
    to: email,
    subject: 'Your FIRB Calculation Results',
    html: `
      <h1>Your FIRB Fee Calculation</h1>
      <p>Total Upfront Costs: $${calculation.upfrontCosts.totalUpfront.toLocaleString()}</p>
      <p>Annual Costs: $${calculation.annualCosts.totalAnnual.toLocaleString()}</p>
      <p><a href="${shareUrl}">View Full Results</a></p>
    `
  });
}
```

---

## Testing the Database

### 1. Test Connection

```bash
# In your Next.js project
npm run dev
```

Create a test file: `test-supabase.ts`

```typescript
import { supabase } from './lib/supabase';

async function testConnection() {
  const { data, error } = await supabase
    .from('firb_calculations')
    .select('count')
    .limit(1);
  
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('✅ Supabase connected successfully!');
  }
}

testConnection();
```

### 2. Test Insert

```typescript
const { data, error } = await supabase
  .from('firb_calculations')
  .insert({
    citizenship_status: 'foreign',
    property_type: 'newDwelling',
    property_value: 850000,
    property_state: 'NSW',
    entity_type: 'individual',
    is_first_home: true,
    eligibility_result: {
      isEligible: true,
      requiresFIRB: true,
      firbApprovalType: 'required',
      restrictions: [],
      recommendations: []
    },
    cost_breakdown: {
      upfrontCosts: { totalUpfront: 117000 },
      annualCosts: { totalAnnual: 29400 },
      firstYearTotal: 146400,
      breakdown: []
    },
    locale: 'en'
  })
  .select()
  .single();

console.log('Share URL:', data.share_url_slug);
```

### 3. Test Retrieval

```typescript
const { data } = await supabase
  .from('firb_calculations')
  .select('*')
  .eq('share_url_slug', 'abc12345')
  .single();

console.log('Retrieved:', data);
```

---

## Migration Rollback

If you need to undo the migration:

```sql
-- Drop everything in reverse order
DROP VIEW IF EXISTS firb_calculations_public CASCADE;
DROP TABLE IF EXISTS firb_calculations CASCADE;
DROP FUNCTION IF EXISTS generate_share_url_slug() CASCADE;
DROP FUNCTION IF EXISTS set_share_url_slug() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP TYPE IF EXISTS citizenship_status CASCADE;
DROP TYPE IF EXISTS property_type CASCADE;
DROP TYPE IF EXISTS australian_state CASCADE;
DROP TYPE IF EXISTS entity_type CASCADE;
```

---

## Data Retention Policy

### Automatic Cleanup (Optional)

Add a scheduled job in Supabase to clean old calculations:

```sql
-- Delete calculations older than 1 year
CREATE OR REPLACE FUNCTION cleanup_old_calculations()
RETURNS void AS $$
BEGIN
  UPDATE firb_calculations
  SET deleted_at = NOW()
  WHERE created_at < NOW() - INTERVAL '1 year'
    AND user_email IS NULL
    AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Schedule to run daily (in Supabase Dashboard → Database → Cron Jobs)
```

---

## Analytics Queries

### Popular States

```sql
SELECT 
  property_state,
  COUNT(*) as calculation_count,
  AVG(property_value) as avg_property_value,
  AVG((cost_breakdown->'upfrontCosts'->>'totalUpfront')::numeric) as avg_total_cost
FROM firb_calculations
WHERE deleted_at IS NULL
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY property_state
ORDER BY calculation_count DESC;
```

### Property Type Distribution

```sql
SELECT 
  property_type,
  citizenship_status,
  COUNT(*) as count
FROM firb_calculations
WHERE deleted_at IS NULL
GROUP BY property_type, citizenship_status
ORDER BY count DESC;
```

### Average Costs by State

```sql
SELECT 
  property_state,
  AVG((cost_breakdown->'upfrontCosts'->>'firbApplicationFee')::numeric) as avg_firb_fee,
  AVG((cost_breakdown->'upfrontCosts'->>'stampDutySurcharge')::numeric) as avg_surcharge,
  AVG((cost_breakdown->'annualCosts'->>'totalAnnual')::numeric) as avg_annual_cost
FROM firb_calculations
WHERE deleted_at IS NULL
GROUP BY property_state
ORDER BY property_state;
```

---

## Backup and Recovery

### Enable Point-in-Time Recovery

In Supabase Dashboard:
1. Go to **Settings** → **Database**
2. Enable **Point-in-Time Recovery** (PITR)
3. Restore up to 7 days of history

### Manual Backup

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Restore
supabase db reset --db-url postgresql://...
```

---

## Monitoring

### Query Performance

```sql
-- Check slow queries
SELECT 
  calls,
  total_time,
  mean_time,
  query
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Table Statistics

```sql
-- Check table size and row count
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  n_live_tup AS row_count
FROM pg_stat_user_tables
WHERE tablename = 'firb_calculations';
```

---

## Next Steps

1. ✅ Create Supabase project
2. ✅ Get API credentials
3. ✅ Install @supabase/supabase-js
4. ✅ Create .env.local with credentials
5. ✅ Run migration SQL
6. ✅ Create lib/supabase.ts
7. ✅ Update Vercel environment variables
8. ✅ Test connection
9. ✅ Implement save/retrieve in API routes
10. ✅ Add shareable URL feature to UI

---

## Alternative: No Database Approach

If you prefer to keep the application stateless:

### Option 1: URL-based Sharing
- Encode calculation parameters in URL query string
- No database needed
- Works but URLs are very long

### Option 2: localStorage Only
- Save calculations in browser
- No server persistence
- No cross-device access

### Option 3: Hybrid Approach
- Keep calculations stateless
- Add optional "Save" feature with Supabase
- Most users can use without database
- Power users can save results

**Recommendation:** Start with no database (current setup), add Supabase later when users request sharing/saving features.

---

## Cost Estimate

### Supabase Free Tier
- ✅ 500 MB database storage
- ✅ 50K monthly active users
- ✅ 2GB bandwidth
- ✅ 500K Edge Function invocations
- ✅ Unlimited API requests

**Expected Usage:**
- Each calculation: ~2KB
- 10,000 calculations/month: ~20MB
- Well within free tier limits! 💰

### Paid Tier ($25/month)
- 8 GB database
- 100K monthly active users
- 250 GB bandwidth
- Point-in-time recovery
- Daily backups

---

## Summary

✅ **Migration created**: `supabase/migrations/20250110_create_firb_calculations.sql`  
✅ **TypeScript types**: `types/database.ts`  
✅ **Configuration example**: `supabase/config.example.ts`  
✅ **Documentation**: This file

**The database is optional but recommended for:**
- Shareable calculation URLs
- User calculation history
- Email results
- Analytics and insights

**Current project works perfectly without a database** - add it when you need persistence features! 🚀


