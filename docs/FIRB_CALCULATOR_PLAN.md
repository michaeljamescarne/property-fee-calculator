# FIRB Calculator Implementation Plan

## Overview
This document outlines the plan for implementing a comprehensive FIRB (Foreign Investment Review Board) fee calculator that integrates seamlessly with the existing Property Fee Calculator application.

---

## 1. Route Structure

### New Routes to Add

```
app/[locale]/
├── firb-calculator/
│   └── page.tsx                 # Main FIRB calculator page
├── firb-results/
│   └── page.tsx                 # Results page (optional - could be on same page)
├── privacy/
│   └── page.tsx                 # Privacy policy page
├── terms/
│   └── page.tsx                 # Terms of service page
└── disclaimer/
    └── page.tsx                 # Disclaimer page
```

### API Routes

```
app/api/
├── calculate-fees/
│   └── route.ts                 # Existing simple calculator
└── calculate-firb/
    └── route.ts                 # NEW: FIRB fee calculator endpoint
```

### URL Examples
- `/en/firb-calculator` - English FIRB calculator
- `/zh/firb-calculator` - Chinese FIRB calculator
- `/en/privacy` - Privacy policy
- `/en/terms` - Terms of service
- `/en/disclaimer` - Disclaimer

---

## 2. Database Requirements

### Current State
**No database currently exists** - all calculations are stateless.

### Recommended Approach: Supabase (or alternative)

#### Option A: No Database (Recommended for MVP)
**Pros:**
- Simpler deployment
- No ongoing database costs
- Faster development
- All calculations are deterministic

**Cons:**
- No saved calculations
- No user accounts
- No calculation history

#### Option B: Add Supabase for Advanced Features

**If Database is Needed:**

##### Table: `firb_calculations`
```sql
CREATE TABLE firb_calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- User info (optional - for anonymous tracking)
  session_id TEXT,
  user_email TEXT,
  
  -- Property details
  property_price DECIMAL(12, 2) NOT NULL,
  property_type TEXT NOT NULL, -- 'established', 'new', 'vacant'
  state TEXT NOT NULL, -- 'NSW', 'VIC', 'QLD', etc.
  
  -- Buyer details
  entity_type TEXT NOT NULL, -- 'individual', 'company', 'trust'
  residency_status TEXT NOT NULL, -- 'foreign', 'temporary', 'permanent'
  
  -- Calculated results
  firb_application_fee DECIMAL(10, 2),
  stamp_duty DECIMAL(12, 2),
  stamp_duty_surcharge DECIMAL(12, 2),
  land_tax_surcharge DECIMAL(12, 2),
  total_upfront_costs DECIMAL(12, 2),
  annual_costs DECIMAL(12, 2),
  
  -- Metadata
  locale TEXT DEFAULT 'en',
  calculation_version TEXT DEFAULT '1.0'
);

-- Index for performance
CREATE INDEX idx_created_at ON firb_calculations(created_at);
CREATE INDEX idx_session_id ON firb_calculations(session_id);
```

##### Table: `fee_schedules` (for admin updates)
```sql
CREATE TABLE fee_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  effective_date DATE NOT NULL,
  property_value_min DECIMAL(12, 2),
  property_value_max DECIMAL(12, 2),
  firb_fee DECIMAL(10, 2) NOT NULL,
  state TEXT,
  fee_type TEXT, -- 'firb', 'stamp_duty_surcharge', etc.
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

##### Table: `saved_calculations` (for user accounts)
```sql
CREATE TABLE saved_calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  calculation_id UUID REFERENCES firb_calculations(id),
  name TEXT, -- User-given name for calculation
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Environment Variables (if using database)
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## 3. Integration with Existing Navigation & Layout

### Navigation Component (`components/Navigation.tsx`)

**Current Navigation:**
- Home
- Calculator
- Language Switcher

**Updated Navigation:**
```typescript
// Add new nav item
<Link href={`/${locale}/firb-calculator`}>
  {t('firb')}
</Link>
```

### Footer Component (`components/Footer.tsx`)

**Already includes:**
- Quick Links section
- Resources section
- Legal links (Privacy, Terms, Disclaimer)

**Update Required:**
Add FIRB Calculator to Quick Links:
```typescript
<li>
  <Link href={`/${locale}/firb-calculator`}>
    {t('quickLinks.firbCalculator')}
  </Link>
</li>
```

### Layout Integration (`app/[locale]/layout.tsx`)

**Current Structure:**
```typescript
<div className="flex flex-col min-h-screen">
  <Navigation />
  <div className="flex-1">
    {children}  // Pages render here
  </div>
  <Footer />
</div>
```

**No changes needed** - new pages automatically inherit this layout.

---

## 4. Component Structure

### Matching Existing Patterns

#### Pattern 1: Client Component with Translations
```typescript
'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
// shadcn/ui imports

export default function FIRBCalculatorPage() {
  const t = useTranslations('FIRBCalculator');
  const locale = useLocale();
  const [formData, setFormData] = useState({});
  
  return (
    <main className="container mx-auto px-4 py-12">
      {/* Content */}
    </main>
  );
}
```

#### Pattern 2: Form State Management
```typescript
// Follow calculator/page.tsx pattern
const [propertyPrice, setPropertyPrice] = useState('');
const [propertyType, setPropertyType] = useState('');
const [state, setState] = useState('');
const [entityType, setEntityType] = useState('');
const [result, setResult] = useState<FIRBResult | null>(null);
const [loading, setLoading] = useState(false);

const handleCalculate = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/calculate-firb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    setResult(data);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};
```

#### Pattern 3: Card-Based Layout
```typescript
// Use existing Card component pattern
<div className="grid md:grid-cols-2 gap-8">
  <Card>
    <CardHeader>
      <CardTitle>{t('title')}</CardTitle>
      <CardDescription>{t('description')}</CardDescription>
    </CardHeader>
    <CardContent>
      {/* Form fields */}
    </CardContent>
  </Card>
  
  {result && (
    <Card>
      <CardHeader>
        <CardTitle>{t('results')}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Results display */}
      </CardContent>
    </Card>
  )}
</div>
```

#### Pattern 4: Styling Conventions
```typescript
// Color coding (match existing patterns)
const colorSchemes = {
  info: 'border-blue-200 bg-blue-50/50',
  success: 'border-green-200 bg-green-50/50',
  warning: 'border-orange-200 bg-orange-50/50',
  danger: 'border-red-200 bg-red-50/50'
};

// Icons with consistent sizing
<FileText className="h-6 w-6 text-blue-600" />
<CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
```

---

## 5. All New Files to Create

### Components
```
components/
├── FIRBCalculatorForm.tsx       # Main calculator form
├── FIRBResults.tsx              # Results display component
├── PropertyTypeSelector.tsx     # Radio/Select for property type
├── StateSelector.tsx            # Dropdown for Australian states
├── EntityTypeSelector.tsx       # Individual/Company/Trust selector
└── FeeBreakdown.tsx            # Detailed fee breakdown component
```

### Pages
```
app/[locale]/
├── firb-calculator/
│   └── page.tsx                 # FIRB calculator page
├── privacy/
│   └── page.tsx                 # Privacy policy
├── terms/
│   └── page.tsx                 # Terms of service
└── disclaimer/
    └── page.tsx                 # Disclaimer page
```

### API Routes
```
app/api/
└── calculate-firb/
    └── route.ts                 # FIRB calculation endpoint
```

### Types
```
types/
├── firb.ts                      # TypeScript interfaces for FIRB
└── index.ts                     # Export all types
```

### Utilities (if needed)
```
lib/
├── firb-calculations.ts         # FIRB fee calculation logic
├── fee-schedules.ts            # Fee schedules by property value
└── state-fees.ts               # State-specific surcharge rates
```

### Translation Updates
```
messages/
├── en.json                      # Add 'FIRBCalculator' namespace
└── zh.json                      # Add Chinese translations
```

### Documentation
```
docs/
├── FIRB_CALCULATOR_PLAN.md     # This file
└── FEE_SCHEDULES.md            # Document fee structures and sources
```

---

## 6. Data Flow Architecture

### Calculator Flow
```
1. User Input (Form)
   └─> FIRBCalculatorForm Component
       └─> Local State (useState)

2. Validation
   └─> Client-side: Button disabled if incomplete
   └─> Server-side: API validates all inputs

3. Calculation Request
   └─> POST /api/calculate-firb
       └─> Request body: { propertyPrice, propertyType, state, entityType, ... }

4. Server Processing
   └─> Validate inputs
   └─> Look up fee schedules (hardcoded or from database)
   └─> Calculate FIRB fee
   └─> Calculate stamp duty + surcharge
   └─> Calculate land tax surcharge
   └─> Return comprehensive result object

5. Display Results
   └─> FIRBResults Component
       └─> Breakdown cards
       └─> Visual fee comparison
       └─> Export/Save options (future)
```

### TypeScript Interfaces

```typescript
// types/firb.ts

export type PropertyType = 'established' | 'new' | 'vacant';
export type EntityType = 'individual' | 'company' | 'trust';
export type ResidencyStatus = 'foreign' | 'temporary' | 'permanent';
export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'NT' | 'ACT';

export interface FIRBCalculationInput {
  propertyPrice: number;
  propertyType: PropertyType;
  state: AustralianState;
  entityType: EntityType;
  residencyStatus: ResidencyStatus;
  landValue?: number; // Optional - for land tax calculation
}

export interface FIRBCalculationResult {
  // Input echo
  input: FIRBCalculationInput;
  
  // FIRB fees
  firbApplicationFee: number;
  expeditedFee?: number;
  
  // Stamp duty
  standardStampDuty: number;
  foreignerSurcharge: number;
  totalStampDuty: number;
  
  // Land tax
  landValue: number;
  annualLandTaxSurcharge: number;
  
  // Vacancy fee
  annualVacancyFee: number;
  
  // Totals
  totalUpfrontCosts: number;
  totalAnnualCosts: number;
  totalFirstYearCost: number;
  
  // Breakdown
  breakdown: FeeBreakdownItem[];
}

export interface FeeBreakdownItem {
  category: string;
  description: string;
  amount: number;
  frequency: 'one-time' | 'annual';
  optional: boolean;
}
```

---

## 7. FIRB Fee Schedule (2025)

### Application Fees by Property Value

| Property Value | FIRB Application Fee |
|----------------|---------------------|
| Under $1M | $13,200 |
| $1M - $1.999M | $26,400 |
| $2M - $2.999M | $39,600 |
| $3M - $3.999M | $52,800 |
| $4M - $4.999M | $66,000 |
| Each additional $1M | +$13,200 |

**Vacant Land:**
- Under $1.5M: $5,500

**Expedited Processing:**
- Additional $10,000+ (10-day processing)

### State Stamp Duty Surcharges

| State | Foreign Buyer Surcharge |
|-------|------------------------|
| NSW | 8% |
| VIC | 8% |
| QLD | 7% |
| SA | 7% |
| WA | 7% |
| TAS | 8% |
| NT | 0% |
| ACT | 0% |

### Land Tax Surcharges (Annual)

| State | Annual Surcharge |
|-------|-----------------|
| NSW | 2% |
| VIC | 1.5% |
| QLD | 2% |
| SA | 0.5% |
| WA | 4% |
| TAS | 1.5% |
| NT | 0% |
| ACT | 0.75% |

---

## 8. Component Architecture

### Page Components

#### `app/[locale]/firb-calculator/page.tsx`
```typescript
'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import FIRBCalculatorForm from '@/components/FIRBCalculatorForm';
import FIRBResults from '@/components/FIRBResults';
import { FIRBCalculationResult } from '@/types/firb';

export default function FIRBCalculatorPage() {
  const t = useTranslations('FIRBCalculator');
  const locale = useLocale();
  const [result, setResult] = useState<FIRBCalculationResult | null>(null);

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">
        {t('title')}
      </h1>
      
      <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <FIRBCalculatorForm onCalculate={setResult} />
        {result && <FIRBResults result={result} />}
      </div>
    </main>
  );
}
```

### Form Components

#### `components/FIRBCalculatorForm.tsx`
```typescript
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import PropertyTypeSelector from './PropertyTypeSelector';
import StateSelector from './StateSelector';
import EntityTypeSelector from './EntityTypeSelector';
import { FIRBCalculationInput, FIRBCalculationResult } from '@/types/firb';

interface Props {
  onCalculate: (result: FIRBCalculationResult) => void;
}

export default function FIRBCalculatorForm({ onCalculate }: Props) {
  const t = useTranslations('FIRBCalculator');
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [propertyPrice, setPropertyPrice] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('new');
  const [state, setState] = useState<AustralianState>('NSW');
  const [entityType, setEntityType] = useState<EntityType>('individual');
  const [landValue, setLandValue] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/calculate-firb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyPrice: parseFloat(propertyPrice),
          propertyType,
          state,
          entityType,
          residencyStatus: 'foreign',
          landValue: landValue ? parseFloat(landValue) : undefined
        } as FIRBCalculationInput)
      });
      
      const data = await response.json();
      onCalculate(data);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('form.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Price */}
          <div className="space-y-2">
            <Label htmlFor="propertyPrice">{t('form.propertyPrice')}</Label>
            <Input
              id="propertyPrice"
              type="number"
              placeholder="850000"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(e.target.value)}
              required
            />
          </div>
          
          {/* Property Type */}
          <PropertyTypeSelector
            value={propertyType}
            onChange={setPropertyType}
          />
          
          {/* State */}
          <StateSelector
            value={state}
            onChange={setState}
          />
          
          {/* Entity Type */}
          <EntityTypeSelector
            value={entityType}
            onChange={setEntityType}
          />
          
          {/* Optional: Land Value */}
          <div className="space-y-2">
            <Label htmlFor="landValue">
              {t('form.landValue')} <span className="text-muted-foreground text-sm">({t('form.optional')})</span>
            </Label>
            <Input
              id="landValue"
              type="number"
              placeholder="600000"
              value={landValue}
              onChange={(e) => setLandValue(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={!propertyPrice || loading}
          >
            {loading ? t('form.calculating') : t('form.calculate')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

#### `components/PropertyTypeSelector.tsx`
```typescript
'use client';

import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PropertyType } from '@/types/firb';

interface Props {
  value: PropertyType;
  onChange: (value: PropertyType) => void;
}

export default function PropertyTypeSelector({ value, onChange }: Props) {
  const t = useTranslations('FIRBCalculator.form');
  
  return (
    <div className="space-y-3">
      <Label>{t('propertyType')}</Label>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="new" id="new" />
          <Label htmlFor="new" className="font-normal cursor-pointer">
            {t('propertyTypes.new')}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="established" id="established" />
          <Label htmlFor="established" className="font-normal cursor-pointer">
            {t('propertyTypes.established')}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="vacant" id="vacant" />
          <Label htmlFor="vacant" className="font-normal cursor-pointer">
            {t('propertyTypes.vacant')}
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
```

#### `components/StateSelector.tsx`
```typescript
'use client';

import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AustralianState } from '@/types/firb';

interface Props {
  value: AustralianState;
  onChange: (value: AustralianState) => void;
}

export default function StateSelector({ value, onChange }: Props) {
  const t = useTranslations('FIRBCalculator.form');
  
  const states: AustralianState[] = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];
  
  return (
    <div className="space-y-2">
      <Label>{t('state')}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {states.map((state) => (
            <SelectItem key={state} value={state}>
              {t(`states.${state}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
```

#### `components/FIRBResults.tsx`
```typescript
'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FIRBCalculationResult } from '@/types/firb';
import { DollarSign, FileText, AlertCircle } from 'lucide-react';

interface Props {
  result: FIRBCalculationResult;
}

export default function FIRBResults({ result }: Props) {
  const t = useTranslations('FIRBCalculator.results');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* FIRB Fee */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">{t('firbFee')}</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            ${result.firbApplicationFee.toLocaleString()}
          </p>
        </div>
        
        {/* Stamp Duty */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{t('standardStampDuty')}</span>
            <Badge variant="secondary">
              ${result.standardStampDuty.toLocaleString()}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-orange-700">{t('foreignerSurcharge')}</span>
            <Badge variant="secondary" className="bg-orange-100">
              ${result.foreignerSurcharge.toLocaleString()}
            </Badge>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>{t('totalStampDuty')}</span>
            <Badge>${result.totalStampDuty.toLocaleString()}</Badge>
          </div>
        </div>
        
        {/* Annual Costs */}
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h3 className="font-semibold text-orange-800 mb-2">
            {t('annualCosts')}
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>{t('landTaxSurcharge')}</span>
              <span>${result.annualLandTaxSurcharge.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('vacancyFee')}</span>
              <span>${result.annualVacancyFee.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {/* Grand Totals */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 bg-primary text-primary-foreground rounded-lg">
            <span className="font-bold text-lg">{t('totalUpfront')}</span>
            <span className="text-2xl font-bold">
              ${result.totalUpfrontCosts.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              {t('annualCostNote', { amount: result.totalAnnualCosts.toLocaleString() })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### API Route

#### `app/api/calculate-firb/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { FIRBCalculationInput, FIRBCalculationResult } from '@/types/firb';
import { calculateFIRBFee } from '@/lib/firb-calculations';

export async function POST(request: NextRequest) {
  try {
    const input: FIRBCalculationInput = await request.json();
    
    // Validate required fields
    if (!input.propertyPrice || !input.propertyType || !input.state || !input.entityType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate property price
    if (input.propertyPrice <= 0) {
      return NextResponse.json(
        { error: 'Property price must be greater than 0' },
        { status: 400 }
      );
    }
    
    // Perform calculations
    const result = calculateFIRBFee(input);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('FIRB calculation error:', error);
    return NextResponse.json(
      { error: 'Calculation failed' },
      { status: 500 }
    );
  }
}
```

---

## 9. Translation Structure

### messages/en.json
```json
{
  "FIRBCalculator": {
    "title": "FIRB Fee Calculator",
    "subtitle": "Calculate all costs for foreign property investment in Australia",
    "form": {
      "title": "Property Details",
      "propertyPrice": "Property Price (AUD)",
      "propertyType": "Property Type",
      "propertyTypes": {
        "new": "New Dwelling / Off-the-plan",
        "established": "Established Dwelling",
        "vacant": "Vacant Land"
      },
      "state": "State / Territory",
      "states": {
        "NSW": "New South Wales",
        "VIC": "Victoria",
        "QLD": "Queensland",
        "SA": "South Australia",
        "WA": "Western Australia",
        "TAS": "Tasmania",
        "NT": "Northern Territory",
        "ACT": "Australian Capital Territory"
      },
      "entityType": "Purchasing Entity",
      "entityTypes": {
        "individual": "Individual",
        "company": "Company",
        "trust": "Trust"
      },
      "landValue": "Land Value (for land tax)",
      "optional": "Optional",
      "calculate": "Calculate FIRB Fees",
      "calculating": "Calculating..."
    },
    "results": {
      "title": "Fee Breakdown",
      "firbFee": "FIRB Application Fee",
      "standardStampDuty": "Standard Stamp Duty",
      "foreignerSurcharge": "Foreign Buyer Surcharge",
      "totalStampDuty": "Total Stamp Duty",
      "annualCosts": "Annual Ongoing Costs",
      "landTaxSurcharge": "Land Tax Surcharge",
      "vacancyFee": "Vacancy Fee (if applicable)",
      "totalUpfront": "Total Upfront Costs",
      "annualCostNote": "Plus ${amount}/year in ongoing costs"
    }
  }
}
```

---

## 10. Implementation Phases

### Phase 1: Basic Calculator (MVP)
- ✅ Create route structure
- ✅ Build form components
- ✅ Implement FIRB fee calculation logic
- ✅ Create results display
- ✅ Add translations
- ✅ Update navigation
- ⏸️ No database needed

### Phase 2: Enhanced Features
- Add fee schedule documentation
- Add explanatory tooltips
- Add comparison charts
- Add state-by-state comparison
- Add export to PDF

### Phase 3: User Features (Optional)
- Add Supabase database
- User authentication
- Save calculations
- Calculation history
- Email results

### Phase 4: Advanced Features (Future)
- Admin panel for fee updates
- Real-time fee schedule updates
- Integration with property APIs
- Multi-currency support
- Advanced reporting

---

## 11. Required shadcn/ui Components

### Already Installed
- ✅ Button
- ✅ Card
- ✅ Input
- ✅ Label
- ✅ Select
- ✅ Badge
- ✅ Dropdown Menu
- ✅ Separator

### Need to Add
```bash
npx shadcn@latest add radio-group
npx shadcn@latest add tabs
npx shadcn@latest add tooltip
npx shadcn@latest add alert
npx shadcn@latest add progress
```

---

## 12. Calculation Logic Location

### `lib/firb-calculations.ts`
```typescript
import { FIRBCalculationInput, FIRBCalculationResult } from '@/types/firb';
import { getFIRBFeeSchedule, getStampDutySurcharge, getLandTaxSurcharge } from './fee-schedules';

export function calculateFIRBFee(input: FIRBCalculationInput): FIRBCalculationResult {
  const { propertyPrice, propertyType, state, entityType, landValue } = input;
  
  // FIRB Application Fee
  const firbApplicationFee = getFIRBFeeSchedule(propertyPrice, propertyType);
  
  // Stamp Duty Calculation
  const standardStampDuty = calculateStandardStampDuty(propertyPrice, state);
  const surchargeRate = getStampDutySurcharge(state);
  const foreignerSurcharge = propertyPrice * surchargeRate;
  const totalStampDuty = standardStampDuty + foreignerSurcharge;
  
  // Land Tax (Annual)
  const estimatedLandValue = landValue || (propertyPrice * 0.6); // Default: 60% of property value
  const landTaxRate = getLandTaxSurcharge(state);
  const annualLandTaxSurcharge = estimatedLandValue * landTaxRate;
  
  // Vacancy Fee (equal to FIRB fee if property left vacant)
  const annualVacancyFee = firbApplicationFee;
  
  // Totals
  const totalUpfrontCosts = firbApplicationFee + totalStampDuty;
  const totalAnnualCosts = annualLandTaxSurcharge + annualVacancyFee;
  const totalFirstYearCost = totalUpfrontCosts + totalAnnualCosts;
  
  // Breakdown
  const breakdown = [
    {
      category: 'FIRB',
      description: 'Application Fee',
      amount: firbApplicationFee,
      frequency: 'one-time' as const,
      optional: false
    },
    {
      category: 'Stamp Duty',
      description: 'Standard Stamp Duty',
      amount: standardStampDuty,
      frequency: 'one-time' as const,
      optional: false
    },
    {
      category: 'Stamp Duty',
      description: 'Foreign Buyer Surcharge',
      amount: foreignerSurcharge,
      frequency: 'one-time' as const,
      optional: false
    },
    {
      category: 'Land Tax',
      description: 'Annual Surcharge',
      amount: annualLandTaxSurcharge,
      frequency: 'annual' as const,
      optional: false
    },
    {
      category: 'Vacancy',
      description: 'Annual Vacancy Fee (if vacant >183 days)',
      amount: annualVacancyFee,
      frequency: 'annual' as const,
      optional: true
    }
  ];
  
  return {
    input,
    firbApplicationFee,
    standardStampDuty,
    foreignerSurcharge,
    totalStampDuty,
    landValue: estimatedLandValue,
    annualLandTaxSurcharge,
    annualVacancyFee,
    totalUpfrontCosts,
    totalAnnualCosts,
    totalFirstYearCost,
    breakdown
  };
}

function calculateStandardStampDuty(price: number, state: string): number {
  // Simplified - would need actual state-specific stamp duty schedules
  // NSW example (progressive rates)
  if (state === 'NSW') {
    if (price <= 14000) return 1.25 * price / 100;
    if (price <= 32000) return 175 + 1.50 * (price - 14000) / 100;
    if (price <= 85000) return 445 + 1.75 * (price - 32000) / 100;
    if (price <= 319000) return 1372.50 + 3.50 * (price - 85000) / 100;
    if (price <= 1064000) return 9562.50 + 4.50 * (price - 319000) / 100;
    return 43087.50 + 5.50 * (price - 1064000) / 100;
  }
  
  // Default rough estimate for other states
  return price * 0.04;
}
```

### `lib/fee-schedules.ts`
```typescript
import { PropertyType, AustralianState } from '@/types/firb';

export function getFIRBFeeSchedule(price: number, type: PropertyType): number {
  if (type === 'vacant' && price < 1500000) {
    return 5500;
  }
  
  if (price < 1000000) return 13200;
  if (price < 2000000) return 26400;
  if (price < 3000000) return 39600;
  if (price < 4000000) return 52800;
  if (price < 5000000) return 66000;
  
  // Each additional $1M adds $13,200
  const millionsOver5 = Math.ceil((price - 5000000) / 1000000);
  return 66000 + (millionsOver5 * 13200);
}

export function getStampDutySurcharge(state: AustralianState): number {
  const rates: Record<AustralianState, number> = {
    'NSW': 0.08,
    'VIC': 0.08,
    'QLD': 0.07,
    'SA': 0.07,
    'WA': 0.07,
    'TAS': 0.08,
    'NT': 0,
    'ACT': 0
  };
  return rates[state];
}

export function getLandTaxSurcharge(state: AustralianState): number {
  const rates: Record<AustralianState, number> = {
    'NSW': 0.02,
    'VIC': 0.015,
    'QLD': 0.02,
    'SA': 0.005,
    'WA': 0.04,
    'TAS': 0.015,
    'NT': 0,
    'ACT': 0.0075
  };
  return rates[state];
}
```

---

## 13. Additional Files Needed

### Types Definition
```typescript
// types/firb.ts
export type PropertyType = 'established' | 'new' | 'vacant';
export type EntityType = 'individual' | 'company' | 'trust';
export type ResidencyStatus = 'foreign' | 'temporary' | 'permanent';
export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'NT' | 'ACT';

export interface FIRBCalculationInput {
  propertyPrice: number;
  propertyType: PropertyType;
  state: AustralianState;
  entityType: EntityType;
  residencyStatus: ResidencyStatus;
  landValue?: number;
}

export interface FeeBreakdownItem {
  category: string;
  description: string;
  amount: number;
  frequency: 'one-time' | 'annual';
  optional: boolean;
}

export interface FIRBCalculationResult {
  input: FIRBCalculationInput;
  firbApplicationFee: number;
  expeditedFee?: number;
  standardStampDuty: number;
  foreignerSurcharge: number;
  totalStampDuty: number;
  landValue: number;
  annualLandTaxSurcharge: number;
  annualVacancyFee: number;
  totalUpfrontCosts: number;
  totalAnnualCosts: number;
  totalFirstYearCost: number;
  breakdown: FeeBreakdownItem[];
}
```

### Legal Pages Template
```typescript
// app/[locale]/privacy/page.tsx
// app/[locale]/terms/page.tsx  
// app/[locale]/disclaimer/page.tsx

'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  const t = useTranslations('Privacy');
  
  return (
    <main className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-neutral max-w-none">
          {/* Content */}
        </CardContent>
      </Card>
    </main>
  );
}
```

---

## 14. Integration Checklist

### Navigation Updates
- [ ] Add "FIRB Calculator" link to `Navigation.tsx`
- [ ] Add to mobile menu (if exists)
- [ ] Update `messages/en.json` and `messages/zh.json` Nav section

### Footer Updates
- [ ] Add FIRB Calculator to Quick Links
- [ ] Ensure legal page links work
- [ ] Test all footer links

### Homepage Updates (Optional)
- [ ] Add FIRB calculator card/section
- [ ] Update CTA to include FIRB calculator option
- [ ] Add comparison between simple and FIRB calculators

---

## 15. File Creation Summary

### New Files to Create (17 total)

**Components (7):**
1. `components/FIRBCalculatorForm.tsx`
2. `components/FIRBResults.tsx`
3. `components/PropertyTypeSelector.tsx`
4. `components/StateSelector.tsx`
5. `components/EntityTypeSelector.tsx`
6. `components/FeeBreakdown.tsx`
7. `components/ui/radio-group.tsx` (via shadcn)

**Pages (4):**
1. `app/[locale]/firb-calculator/page.tsx`
2. `app/[locale]/privacy/page.tsx`
3. `app/[locale]/terms/page.tsx`
4. `app/[locale]/disclaimer/page.tsx`

**API Routes (1):**
1. `app/api/calculate-firb/route.ts`

**Types (1):**
1. `types/firb.ts`

**Utilities (3):**
1. `lib/firb-calculations.ts`
2. `lib/fee-schedules.ts`
3. `lib/state-fees.ts`

**Documentation (1):**
1. `docs/FEE_SCHEDULES.md`

### Files to Update (4)

1. `components/Navigation.tsx` - Add FIRB calculator link
2. `messages/en.json` - Add FIRBCalculator translations
3. `messages/zh.json` - Add Chinese translations
4. `components/Footer.tsx` - Add FIRB calculator to quick links

---

## 16. Styling Guidelines

### Follow Existing Patterns

**Color Coding:**
- Blue: Information, FIRB fees
- Green: Positive, benefits, exemptions
- Orange: Warnings, surcharges
- Red: Penalties, important notices

**Card Styling:**
```typescript
className="border-blue-200 bg-blue-50/50"  // Info
className="border-green-200 bg-green-50/50" // Positive
className="border-orange-200 bg-orange-50/50" // Warning
className="border-red-200 bg-red-50/50" // Danger
```

**Responsive Grid:**
```typescript
className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
```

**Text Sizing:**
```typescript
// Headings
className="text-4xl font-bold"  // Page title
className="text-3xl font-bold"  // Section title
className="text-2xl font-bold"  // Subsection title
className="text-lg font-semibold" // Card title

// Body
className="text-base"  // Normal text
className="text-sm"    // Small text
className="text-xs"    // Fine print
```

---

## 17. Testing Strategy

### Local Testing
```bash
# On feature branch
npm run dev

# Visit pages
http://localhost:3000/en/firb-calculator
http://localhost:3000/zh/firb-calculator

# Test calculations with various inputs
# Test form validation
# Test responsive design
```

### Build Testing
```bash
npm run build
npm start
```

### Test Cases
1. **Low value property** (<$1M) - Verify $13,200 FIRB fee
2. **High value property** ($5M+) - Verify progressive fee calculation
3. **Different states** - Verify surcharge variations
4. **Vacant land** - Verify $5,500 fee for <$1.5M
5. **Different entity types** - Test individual vs company
6. **Edge cases** - Zero, negative, extremely high values

---

## 18. Next Steps

### Immediate Actions
1. ✅ Create feature branch `feature/add-firb-calculator`
2. Create type definitions
3. Create calculation logic
4. Build form components
5. Build results component
6. Create FIRB calculator page
7. Add API route
8. Update navigation
9. Add translations
10. Test locally
11. Create pull request
12. Deploy to production after approval

### Future Enhancements
- Add comparison tool (simple vs FIRB calculator)
- Add fee schedule documentation
- Add state comparison charts
- Add historical fee tracking
- Add email/PDF export functionality

---

## 19. Links to Existing Patterns

### Reference Files
- **Form pattern**: `app/[locale]/calculator/page.tsx`
- **API pattern**: `app/api/calculate-fees/route.ts`
- **Card layout**: `app/[locale]/page.tsx` (FIRB Approval section)
- **Translation usage**: `components/Navigation.tsx`
- **Client component**: `app/[locale]/page.tsx`
- **Server component**: `app/[locale]/layout.tsx`

### Styling References
- **Gradient backgrounds**: Hero section, CTA section
- **Color-coded cards**: Fees Required section, FIRB Approval section
- **Icon usage**: Throughout homepage
- **Responsive grids**: Features section, How It Works section

---

## Summary

This FIRB calculator will seamlessly integrate with the existing application by:

1. ✅ Following Next.js 15 App Router patterns
2. ✅ Using existing shadcn/ui components and styling
3. ✅ Maintaining i18n support with next-intl
4. ✅ Following TypeScript best practices
5. ✅ Using stateless API calculations (no database required initially)
6. ✅ Matching existing design language and UX patterns
7. ✅ Providing comprehensive, accurate FIRB fee calculations

**Ready to implement!** 🚀


