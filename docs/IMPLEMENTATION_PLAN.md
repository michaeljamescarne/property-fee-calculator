# Implementation Plan: Property Investment Analysis Platform

## Overview

This document outlines the step-by-step implementation plan for building the comprehensive Property Investment Analysis Platform as specified in the PRD. This will be a **fresh implementation** that replaces the existing FIRB calculator while preserving its core functionality.

> **Related Documents**:
>
> - [Product Requirements Document](./PRODUCT_REQUIREMENTS_DOCUMENT.md)
> - [Style Guide](./STYLE_GUIDE.md) - Design system and styling
> - [Development Guidelines](./DEVELOPMENT_GUIDELINES.md) - **Development workflow, testing, and deployment process**

---

## 1. Project Setup & Architecture

### 1.1 New Project Structure

**Decision**: Start fresh with a new repository/project structure

**Recommended Approach**:

- Create new repository: `property-investment-platform` (or similar)
- Clean slate implementation
- Import/adapt code from existing FIRB calculator where applicable
- Modern tech stack aligned with PRD requirements

### 1.2 Technology Stack (Confirm/Update)

Based on PRD and existing codebase:

**Frontend**:

- Next.js 15 (App Router) - ✅ Confirmed
- React 18+
- TypeScript
- Tailwind CSS
- shadcn/ui components
- next-intl (i18n - English, Chinese)

**Backend**:

- Next.js API Routes
- Server Actions (where applicable)

**Database**:

- Supabase (PostgreSQL)
- Row Level Security (RLS)

**Authentication**:

- Supabase Auth

**Other Services**:

- Resend (Email)
- PDF Generation (jsPDF or server-side alternative)

### 1.3 Project Initialization Steps

```bash
# 1. Create new Next.js project
npx create-next-app@latest property-investment-platform \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

# 2. Install core dependencies
npm install \
  @supabase/supabase-js \
  next-intl \
  resend \
  zod \
  jspdf \
  lucide-react

# 3. Install shadcn/ui
npx shadcn-ui@latest init

# 4. Set up project structure
mkdir -p \
  app/\[locale\] \
  components/{ui,features,admin} \
  lib/{calculations,auth,data,utils} \
  types \
  supabase/migrations \
  messages
```

### 1.4 Project Structure

```
property-investment-platform/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              # Root layout with i18n
│   │   ├── page.tsx                # Homepage
│   │   ├── calculator/
│   │   │   └── page.tsx            # Main calculator wizard
│   │   ├── results/
│   │   │   └── page.tsx            # Results dashboard
│   │   ├── dashboard/
│   │   │   └── page.tsx           # User dashboard (saved calculations)
│   │   └── admin/                  # Admin routes (protected)
│   │       ├── regulations/
│   │       └── benchmarks/
│   ├── api/
│   │   ├── calculate/
│   │   ├── regulations/
│   │   └── benchmarks/
│   └── globals.css
├── components/
│   ├── ui/                         # shadcn components
│   ├── features/
│   │   ├── calculator/
│   │   │   ├── PropertyInputStep.tsx
│   │   │   ├── UserProfileStep.tsx
│   │   │   ├── FinancialDetailsStep.tsx
│   │   │   └── ReviewStep.tsx
│   │   ├── results/
│   │   │   ├── EligibilitySection.tsx
│   │   │   ├── CostBreakdownSection.tsx
│   │   │   ├── InvestmentQualitySection.tsx
│   │   │   ├── OptimalUseCaseSection.tsx
│   │   │   └── SensitivityAnalysisSection.tsx
│   │   └── admin/
│   │       ├── RegulationsAdmin.tsx
│   │       └── BenchmarksAdmin.tsx
│   └── shared/
├── lib/
│   ├── calculations/
│   │   ├── firb.ts                 # FIRB calculations (from existing)
│   │   ├── costs.ts                # Cost breakdown (from existing)
│   │   ├── investment-analytics.ts # Investment quality (from existing)
│   │   ├── optimal-use-case.ts     # NEW: Long-term vs short-stay
│   │   └── sensitivity.ts          # Sensitivity analysis
│   ├── data/
│   │   ├── regulations.ts          # Short-stay regulations lookup
│   │   └── benchmarks.ts           # Market benchmarks lookup
│   ├── pdf/
│   │   └── generate-report.ts      # PDF generation
│   └── validations/
│       └── calculator.ts           # Zod schemas
├── types/
│   ├── calculator.ts
│   ├── investment.ts
│   └── database.ts
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_short_stay_regulations.sql
│   │   └── 003_benchmark_data.sql
│   └── seed/
│       ├── initial_regulations.sql
│       └── initial_benchmarks.sql
├── messages/
│   ├── en.json
│   └── zh.json
└── docs/
    ├── PRODUCT_REQUIREMENTS_DOCUMENT.md
    └── IMPLEMENTATION_PLAN.md
```

---

## 2. Implementation Phases

### Phase 0: Foundation Setup (Week 1)

**Goal**: Set up project infrastructure and core systems

#### Tasks:

1. **Project Initialization**
   - [ ] Create new repository
   - [ ] Set up Next.js project with TypeScript
   - [ ] Configure Tailwind CSS
   - [ ] Install and configure shadcn/ui
   - [ ] Set up i18n (next-intl) with English and Chinese
   - [ ] Configure ESLint and Prettier

2. **Database Setup (Minimal)**
   - [ ] Create Supabase project
   - [ ] Create leads/email capture table
   - [ ] Set up basic Row Level Security (RLS)
   - [ ] Create admin user roles (for future use)

3. **Core Infrastructure**
   - [ ] Set up environment variables
   - [ ] Configure API routes structure
   - [ ] Set up error handling
   - [ ] Configure logging

**Deliverable**: Working project skeleton with database for lead capture

---

### Phase 1: Public Website & Lead Capture (Week 2-3)

**Goal**: Build the public-facing website to generate demand and collect leads before calculator launch

#### Tasks:

1. **Homepage Development**
   - [ ] Build hero section with value proposition
   - [ ] Create features section (3 main features)
   - [ ] Build "How It Works" section
   - [ ] Create FIRB approval information section
   - [ ] Add trust indicators and CTAs
   - [ ] Implement responsive design
   - [ ] Add SEO optimization (meta tags, structured data)

2. **Navigation & Footer**
   - [ ] Build sticky navigation component
   - [ ] Implement language selector (English/Chinese)
   - [ ] Create footer with links and information
   - [ ] Add mobile hamburger menu

3. **Blog System**
   - [ ] Create blog listing page (`/blog`)
   - [ ] Create blog post page (`/blog/[slug]`)
   - [ ] Set up markdown content management
   - [ ] Implement blog post categories and tags
   - [ ] Add search functionality
   - [ ] Create RSS feed
   - [ ] Add social sharing buttons

4. **FAQ System**
   - [ ] Create FAQ landing page (`/faq`)
   - [ ] Build FAQ search functionality
   - [ ] Implement category navigation
   - [ ] Create expandable FAQ items
   - [ ] Add popular questions section
   - [ ] Implement feedback mechanism

5. **Legal Pages**
   - [ ] Create Privacy Policy page (`/privacy`)
   - [ ] Create Terms of Service page (`/terms`)
   - [ ] Create Disclaimer page (`/disclaimer`)
   - [ ] Ensure all pages are multi-language

6. **Lead Capture System (Simple Email Capture)**
   - [ ] Create simple email capture form component
   - [ ] Design lead capture UI (homepage CTA, dedicated landing page)
   - [ ] Create API endpoint (`/api/leads`) for email capture
   - [ ] Build simple database table for leads:
     ```sql
     CREATE TABLE leads (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       email TEXT NOT NULL UNIQUE,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );
     ```
   - [ ] Implement email validation
   - [ ] Add duplicate prevention
   - [ ] Create success/error messaging
   - [ ] Add thank you page/confirmation message
   - [ ] Export leads to CRM (manual or API integration)

7. **SEO & Performance**
   - [ ] Optimize all pages for SEO
   - [ ] Add structured data (Schema.org)
   - [ ] Create XML sitemap
   - [ ] Configure robots.txt
   - [ ] Optimize images and assets
   - [ ] Ensure <3s page load times
   - [ ] Set up analytics (Google Analytics)

8. **Multi-Language Content**
   - [ ] Translate homepage content
   - [ ] Translate FAQ content
   - [ ] Translate legal pages
   - [ ] Create initial blog posts (English and Chinese)
   - [ ] Ensure all UI elements are translated

9. **Accessibility & Responsive Design**
   - [ ] Ensure WCAG 2.1 AA compliance
   - [ ] Test on mobile, tablet, desktop
   - [ ] Implement keyboard navigation
   - [ ] Add screen reader support

**Deliverable**: Fully functional public website with lead capture, ready for marketing and demand generation

**Key Features**:

- Professional homepage showcasing platform value
- Blog system for content marketing
- FAQ system for user education
- Simple email capture (leads exported to CRM)
- Multi-language support (English/Chinese)
- SEO optimized
- Ready for marketing campaigns

---

### Phase 2: Authentication & User Accounts (Week 4)

**Goal**: Set up user authentication system for when calculator launches

#### Tasks:

1. **Database Setup (Complete)**
   - [ ] Create user accounts table (Supabase Auth handles this)
   - [ ] Create calculations table (for saved calculations)
   - [ ] Create short_stay_regulations table
   - [ ] Create benchmark_data table
   - [ ] Set up Row Level Security (RLS) for all tables
   - [ ] Create admin user roles

2. **Authentication**
   - [ ] Configure Supabase Auth
   - [ ] Create login page
   - [ ] Create signup/registration page
   - [ ] Implement email verification
   - [ ] Create password reset flow
   - [ ] Set up protected routes middleware
   - [ ] Create user dashboard placeholder

**Deliverable**: Complete authentication system ready for calculator integration

---

### Phase 3: Core Calculator (Week 5-7)

**Goal**: Build the essential calculator functionality (P0 features)

#### Tasks:

1. **Import Existing Calculator Code**
   - [ ] Port FIRB calculation logic from existing project
   - [ ] Port cost breakdown calculation logic
   - [ ] Port investment analytics calculation logic
   - [ ] Refactor to match new project structure
   - [ ] Add TypeScript types
   - [ ] Write unit tests

2. **Calculator Wizard UI**
   - [ ] Build Step 1: Property Input
     - Address input with validation
     - Property type selector
     - Purchase price input
     - Bedrooms/bathrooms
   - [ ] Build Step 2: User Profile
     - Citizenship/residency selector
     - FIRB-specific questions (conditional)
     - Intended use selector
     - Deposit percentage
   - [ ] Build Step 3: Financial Details
     - Weekly rent input
     - Capital growth rate input
     - Loan details (if applicable)
     - Council rates
     - Property management options
   - [ ] Build Step 4: Review
     - Summary display
     - Edit functionality
     - Input validation warnings

3. **Calculation API**
   - [ ] Create `/api/calculate` endpoint
   - [ ] Integrate all calculation engines
   - [ ] Error handling
   - [ ] Response validation

4. **Results Dashboard (Basic)**
   - [ ] Eligibility section
   - [ ] Cost breakdown section
   - [ ] Investment quality section (basic)
   - [ ] Download PDF button

5. **PDF Generation**
   - [ ] Port existing PDF generation code
   - [ ] Update to match new report structure
   - [ ] Add all disclaimers
   - [ ] Test PDF output

**Deliverable**: Working calculator with core calculations and basic results view

---

### Phase 4: Benchmark Data System (Week 8-9)

**Goal**: Implement state/suburb benchmark data system (P1)

#### Tasks:

1. **Database & API**
   - [ ] Verify benchmark_data table schema
   - [ ] Create API endpoints for benchmark lookups
   - [ ] Implement address-to-suburb/state mapping
   - [ ] Fallback logic (suburb → state)

2. **Admin Interface**
   - [ ] Create admin dashboard (protected route)
   - [ ] Build benchmarks CRUD interface
   - [ ] Bulk import functionality (CSV)
   - [ ] Data validation
   - [ ] Version history display

3. **Initial Data Population**
   - [ ] Research and collect state-level benchmarks
   - [ ] Research and collect top 50-100 suburb benchmarks
   - [ ] Populate database
   - [ ] Verify data accuracy

4. **Integration with Calculator**
   - [ ] Update Step 3 to show benchmark suggestions
   - [ ] Display user input vs benchmark comparison
   - [ ] Add benchmark acceptance UI
   - [ ] Update results to show benchmark comparisons

**Deliverable**: Benchmark data system with admin interface and calculator integration

---

### Phase 5: Short-Stay Regulations (Week 10-11)

**Goal**: Implement short-stay regulations database (P1)

#### Tasks:

1. **Database & API**
   - [ ] Verify short_stay_regulations table schema
   - [ ] Create API endpoints for regulation lookups
   - [ ] Implement address-to-council mapping
   - [ ] Fallback logic for missing regulations

2. **Admin Interface**
   - [ ] Build regulations CRUD interface
   - [ ] Bulk import functionality (CSV)
   - [ ] Verification workflow
   - [ ] Version history
   - [ ] Change notifications

3. **Initial Data Population**
   - [ ] Research top 50 councils (major tourist areas)
   - [ ] Collect regulation data
   - [ ] Populate database
   - [ ] Verify data accuracy

4. **Integration with Calculator**
   - [ ] Update results to show regulations (if short-stay selected)
   - [ ] Display compliance costs
   - [ ] Show warnings for missing regulations

**Deliverable**: Short-stay regulations system with admin interface

---

### Phase 6: Optimal Use Case Comparison (Week 12-13)

**Goal**: Build long-term rental vs short-stay comparison (P1)

#### Tasks:

1. **Calculation Engine**
   - [ ] Build long-term rental income model
   - [ ] Build short-stay income model (with occupancy rates)
   - [ ] Build management costs comparison
   - [ ] Build regulatory compliance cost calculation
   - [ ] Build risk assessment algorithms

2. **UI Components**
   - [ ] Create OptimalUseCaseSection component
   - [ ] Build comparison matrix
   - [ ] Add income charts
   - [ ] Add cost breakdowns
   - [ ] Add risk indicators

3. **Integration**
   - [ ] Integrate with short-stay regulations lookup
   - [ ] Add to results dashboard
   - [ ] Add to PDF report

**Deliverable**: Complete optimal use case comparison feature

---

### Phase 7: Enhanced Analytics (Week 14-15)

**Goal**: Complete investment quality analysis and sensitivity analysis (P1)

#### Tasks:

1. **Sensitivity Analysis**
   - [ ] Build vacancy rate impact scenarios (3-4)
   - [ ] Build interest rate impact scenarios (3-4)
   - [ ] Build capital growth scenarios (Conservative/Moderate/Optimistic)
   - [ ] Create visualization components

2. **Investment Quality Enhancements**
   - [ ] Complete investment score calculation
   - [ ] Add strengths/weaknesses analysis
   - [ ] Add risk profile
   - [ ] Add alternative investment comparison

3. **Results Dashboard Completion**
   - [ ] Complete all sections
   - [ ] Add interactive charts
   - [ ] Add export functionality
   - [ ] Add save calculation functionality

**Deliverable**: Complete investment analysis with all features

---

### Phase 8: Launch Preparation (Week 16-17)

**Goal**: Finalize MVP and prepare for launch

#### Tasks:

1. **Launch Preparation**
   - [ ] UI/UX polish
   - [ ] Responsive design testing
   - [ ] Accessibility audit
   - [ ] Performance optimization
   - [ ] Cross-browser testing
   - [ ] Mobile responsiveness

2. **Testing**
   - [ ] Unit tests for all calculations
   - [ ] Integration tests for API endpoints
   - [ ] E2E tests for user flows
   - [ ] Manual QA testing
   - [ ] Load testing

3. **Documentation**
   - [ ] User documentation
   - [ ] Admin documentation
   - [ ] API documentation
   - [ ] Deployment guide

4. **Pre-Launch Checklist**
   - [ ] Set up production environment
   - [ ] Configure monitoring/logging
   - [ ] Set up error tracking
   - [ ] Prepare marketing materials
   - [ ] Beta testing with select users
   - [ ] Export collected leads to CRM

5. **Launch Day**
   - [ ] Deploy to production
   - [ ] Monitor system performance
   - [ ] Social media announcement
   - [ ] Monitor support channels

**Deliverable**: Production-ready MVP ready for market launch

---

## 3. Code Migration Strategy

### 3.1 From Existing FIRB Calculator

**What to Port**:

- ✅ FIRB calculation logic (`lib/firb/calculations.ts`)
- ✅ Eligibility checking (`lib/firb/eligibility.ts`)
- ✅ Cost breakdown calculations (`lib/firb/calculations.ts`)
- ✅ Investment analytics (`lib/firb/investment-analytics.ts`)
- ✅ PDF generation logic (adapt to new structure)
- ✅ Type definitions (`types/investment.ts`, `types/database.ts`)

**What to Adapt**:

- 🔄 Calculator wizard UI (rebuild with new structure)
- 🔄 Results display (enhance with new features)
- 🔄 API routes (restructure for new architecture)

**What to Build New**:

- 🆕 Benchmark data system
- 🆕 Short-stay regulations system
- 🆕 Optimal use case comparison
- 🆕 Enhanced sensitivity analysis
- 🆕 Admin interfaces

### 3.2 Migration Steps

1. **Code Audit**
   - Review existing codebase
   - Identify reusable components
   - Document dependencies

2. **Selective Porting**
   - Copy calculation logic (pure functions)
   - Adapt TypeScript types
   - Refactor for new structure

3. **Testing**
   - Verify calculations match existing behavior
   - Test edge cases
   - Validate outputs

---

## 4. Database Schema

### 4.1 Lead Capture Schema (Phase 1)

**Priority**: Implement first for lead generation

**Note**: Simple email capture only. CRM will handle all customer engagement.

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at);
```

### 4.2 Future Database Schema (Phases 2+)

Follow the PRD database schemas:

- User accounts and authentication (Phase 2)
- `calculations` table (store comprehensive results)
- `short_stay_regulations` table (Section 13.1)
- `benchmark_data` table (Section 13.2)

### 4.3 Existing Data

**Decision**: Existing FIRB calculator data can be archived or migrated

**Options**:

1. **Archive**: Keep existing database for historical reference
2. **Migrate**: Export existing calculations and import to new system (if needed)

**Recommendation**: Archive existing data, start fresh for new platform

---

## 5. Development Workflow

**Important**: All development must follow the [Development Guidelines](./DEVELOPMENT_GUIDELINES.md). This section provides a high-level overview.

### 5.1 Git Workflow

```
main (production)
  └── develop (integration)
      ├── feature/calculator-wizard
      ├── feature/benchmark-data
      ├── feature/short-stay-regulations
      ├── feature/optimal-use-case
      └── feature/results-dashboard
```

**Branch Strategy**: See Development Guidelines Section 1.2 for detailed branch naming and workflow.

### 5.2 Feature Development Process

Each feature must follow this workflow:

1. **Create Feature Branch** from `develop`
2. **Develop Feature** following coding standards
3. **Write Tests** (unit, integration, E2E as needed)
4. **Run Tests Locally** - ensure all pass
5. **Create Pull Request** with proper description
6. **Code Review** - at least 1 approval required
7. **Address Feedback** - update PR as needed
8. **Merge to Develop** - after approval
9. **Staging Deployment** - automatic testing
10. **Merge to Main** - after staging verification
11. **Production Deployment** - manual approval

**See Development Guidelines Section 1.1 for complete workflow details.**

### 5.3 Testing Strategy

**Unit Tests** (Required):

- All calculation functions (minimum 80% coverage)
- Data validation functions
- Utility functions
- Custom hooks

**Integration Tests** (Required for critical flows):

- API endpoints
- Database operations
- Authentication flows
- Calculator workflow

**E2E Tests** (Required for key user journeys):

- Complete calculator flow
- Multi-language switching
- PDF generation
- Error scenarios

**See Development Guidelines Section 3 for complete testing requirements.**

### 5.4 Code Quality Standards

**Required**:

- TypeScript strict mode enabled
- ESLint configuration (no errors)
- Prettier formatting (auto-format on save)
- Pre-commit hooks (lint + format)
- Code review process (mandatory)

**See Development Guidelines Section 2 for complete coding standards.**

---

## 6. Deployment Strategy

### 6.1 Environments

**Development**:

- Local development with Supabase local or dev instance
- Hot reloading

**Staging**:

- Production-like environment
- Test data
- Beta user testing

**Production**:

- Vercel (or similar) for Next.js
- Supabase production instance
- Monitoring and analytics

### 6.2 CI/CD Pipeline

**See Development Guidelines Section 5 for complete deployment process.**

#### Pipeline Stages

1. **On Push to Feature Branch**:
   - Run linting (ESLint)
   - Run type checking (TypeScript)
   - Run unit tests
   - Build check
   - Code formatting check (Prettier)

2. **On Pull Request**:
   - All feature branch checks
   - Integration tests
   - Security scanning (npm audit)
   - Build for review deployment

3. **On Merge to Develop**:
   - Run full test suite (unit + integration)
   - Build application
   - Deploy to staging automatically
   - Run E2E tests on staging
   - Notify team of deployment

4. **On Merge to Main**:
   - Run full test suite
   - Build production bundle
   - Deploy to production (manual approval required)
   - Run smoke tests
   - Monitor for errors
   - Notify stakeholders

**All deployments require**: Tests passing, code review approval, and no security vulnerabilities.

---

## 7. Success Criteria

### 7.1 Phase Completion Criteria

**Phase 0**: ✅ Project builds, database accessible, basic infrastructure ready
**Phase 1**: ✅ Public website live, lead capture functional, SEO optimized
**Phase 2**: ✅ Authentication system working, user accounts functional
**Phase 3**: ✅ Calculator produces accurate results, PDF generates
**Phase 4**: ✅ Benchmarks display correctly, admin can manage data
**Phase 5**: ✅ Regulations display correctly, admin can manage data
**Phase 6**: ✅ Comparison shows accurate results
**Phase 7**: ✅ All analytics complete and accurate
**Phase 8**: ✅ MVP ready for launch

### 7.2 Launch Readiness Checklist

**Code Quality**:

- [ ] All P0 features implemented and tested
- [ ] All P1 features implemented and tested
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code review completed for all features
- [ ] TypeScript strict mode - no errors
- [ ] ESLint - no warnings
- [ ] Security audit passed

**Functionality**:

- [ ] Calculation accuracy verified (100%)
- [ ] PDF generation working
- [ ] Multi-language support (English, Chinese)
- [ ] Admin interfaces functional
- [ ] Authentication working
- [ ] Lead capture functional

**Data & Infrastructure**:

- [ ] Database populated with initial data
- [ ] All migrations applied
- [ ] Environment variables configured
- [ ] Monitoring configured

**Performance**:

- [ ] Performance targets met (<2s calculation, <5s PDF)
- [ ] Web Vitals meet targets (LCP < 2.5s, FID < 100ms)
- [ ] Mobile performance acceptable
- [ ] Load testing completed

**Documentation**:

- [ ] Legal disclaimers included
- [ ] User documentation complete
- [ ] API documentation complete
- [ ] Development guidelines followed

**Testing**:

- [ ] Beta testing completed
- [ ] Staging environment verified
- [ ] Rollback plan documented
- [ ] Support process defined

**See Development Guidelines Section 10 for complete checklists.**

---

## 8. Post-Launch (v1.1+)

After MVP launch, continue with:

- P2 features (see PRD Section 10)
- Payment processing
- API integrations
- Advanced features
- Mobile app

---

## 9. Key Decisions & Recommendations

### 9.1 Technical Decisions

1. **PDF Generation**:
   - **Recommendation**: Start with client-side (jsPDF) for MVP
   - Consider server-side for v1.1 if performance issues

2. **Address Lookup**:
   - **Recommendation**: Use postcode-based lookup initially
   - Consider Google Maps API for v1.2 if needed

3. **Data Updates**:
   - **Recommendation**: Manual admin updates for MVP
   - Automate via APIs in v1.2

### 9.2 Team Structure

**Recommended Roles**:

- 1-2 Full-stack developers
- 1 Designer (UI/UX)
- 1 Product manager
- 1 Data researcher (for initial data population)

### 9.3 Timeline Summary

**Public Website First (Weeks 1-3)**:

- **Phase 0**: 1 week (Foundation setup)
- **Phase 1**: 2 weeks (Public website + lead capture)

**Calculator Development (Weeks 4-15)**:

- **Phase 2**: 1 week (Authentication)
- **Phase 3**: 3 weeks (Core calculator)
- **Phase 4**: 2 weeks (Benchmark data)
- **Phase 5**: 2 weeks (Short-stay regulations)
- **Phase 6**: 2 weeks (Optimal use case)
- **Phase 7**: 2 weeks (Enhanced analytics)

**Launch Preparation (Weeks 16-17)**:

- **Phase 8**: 2 weeks (Polish, testing, lead notification)

**Total**: ~17 weeks (~4 months) to MVP launch

**Key Milestone**: Public website goes live after Week 3, allowing for 13+ weeks of lead generation before calculator launch

---

## 10. Next Steps

1. **Immediate Actions**:
   - [ ] Review and approve this implementation plan
   - [ ] Set up new repository
   - [ ] Assemble development team
   - [ ] Set up project management tools
   - [ ] Begin Phase 0

2. **Before Starting**:
   - [ ] Finalize technology stack decisions
   - [ ] Set up Supabase project
   - [ ] Prepare development environment
   - [ ] Review existing codebase for porting

3. **First Week (Phase 0)**:
   - [ ] Complete foundation setup
   - [ ] Create leads database table
   - [ ] Set up basic infrastructure

4. **Weeks 2-3 (Phase 1)**:
   - [ ] Build public website (homepage, blog, FAQ)
   - [ ] Implement lead capture system
   - [ ] Deploy website to production
   - [ ] Begin marketing and lead generation

5. **Weeks 4+ (Calculator Development)**:
   - [ ] Build authentication system
   - [ ] Develop calculator functionality
   - [ ] Continue collecting leads while building

---

## Document Status

**Version**: 1.0  
**Created**: January 2025  
**Status**: Ready for Review  
**Owner**: Development Team
