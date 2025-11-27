# Product Requirements Document: Property Investment Analysis Platform

> **Related Documents**: 
> - [Implementation Plan](./IMPLEMENTATION_PLAN.md)
> - [Style Guide](./STYLE_GUIDE.md) - Design system, colors, typography, and component specifications
> - [Development Guidelines](./DEVELOPMENT_GUIDELINES.md) - Development workflow, testing, and deployment process

## Executive Summary

### Product Vision
A comprehensive SaaS platform that helps property investors (Australian and foreign) quickly assess eligibility, understand all acquisition and ongoing costs, evaluate investment quality, and determine optimal property use (long-term rental vs short-stay accommodation) for Australian property investments.

### Core Value Proposition
**"Advise if an investment property is a good investment and how to use the property to maximize returns"**

The platform provides factual information and analysis (not recommendations) to help investors make informed decisions about Australian property investments.

### Product Relationship
**This is a NEW comprehensive product that extends the existing FIRB calculator.** The existing FIRB calculator serves as the foundation, and this PRD defines the expanded comprehensive product scope.

---

## 1. Product Overview

### 1.1 Problem Statement
Purchasing investment property in Australia is complex and risky due to:
- **Eligibility Complexity**: Difficult to understand if eligible to purchase a given property (especially for foreign investors)
- **Cost Transparency**: Hard to understand all acquisition and ongoing costs
- **Investment Quality**: Challenging to assess if it's a good investment opportunity (potential returns)
- **Use Case Optimization**: Unclear whether to use property for long-term rental or short-stay accommodation

### 1.2 Target Users

#### Primary Users
- **Property Investors** purchasing properties in Australia ONLY
- **Australian Investors**: Citizens and permanent residents
- **Foreign Investors**: Temporary residents, foreign nationals, and overseas investors

#### User Personas
1. **First-Time Investor (Australian)**: Needs guidance on eligibility, costs, and investment basics
2. **Experienced Investor (Australian)**: Wants detailed analysis and comparison tools
3. **Foreign Investor (Temporary Resident)**: Critical need for FIRB guidance and restrictions understanding
4. **Foreign Investor (Overseas)**: Requires comprehensive FIRB, costs, and tax implications

#### User Segments
- **Experience Level**: Both first-time and experienced investors
- **Nationality**: Australian and foreign (with different feature needs)
- **Property Use Intent**: Owner-occupied, rental, or short-stay accommodation

### 1.3 Geographic & Property Scope

#### Property Types Supported
- **Residential**: Houses, apartments, townhouses, units
- **Commercial**: Office, retail, industrial (all types)
- **Land**: Vacant land, off-the-plan purchases
- **Special**: New dwellings, established dwellings, off-the-plan

#### Geographic Coverage
- **All Australian States and Territories**: NSW, VIC, QLD, SA, WA, TAS, ACT, NT
- **All Cities and Suburbs**: Nationwide coverage

#### Price Range
- **MVP Limit**: Properties under $20,000,000 AUD
- **Future**: May expand beyond this limit

---

## 2. Public-Facing Website

### 2.1 Website Overview

The public-facing website serves as the primary entry point for users, providing information about the platform, educational content, and access to the calculator. The website must be professional, user-friendly, and optimized for both Australian and international investors.

### 2.2 Homepage

#### 2.2.1 Purpose
The homepage is the primary landing page that introduces the platform, explains its value proposition, and guides users to start using the calculator.

#### 2.2.2 Key Sections

**Hero Section**:
- **Headline**: Clear value proposition (e.g., "Analyze any investment property in seconds")
- **Subheading**: Brief description of platform capabilities
- **Primary CTA**: "Start Analysis" or "Get Started Free" button linking to calculator
- **Secondary CTA**: "View Sample Report" button
- **Trust Indicators**: 
  - "Trusted by X investors"
  - "Free to use"
  - "Results in 30 seconds"
  - "No signup required" (for sample)
- **Visual**: Dashboard screenshot or calculator preview image
- **Language Selector**: Prominent language switcher (English/Chinese)

**Features Section**:
- **Feature 1: Instant Eligibility Check**
  - Title: "Check FIRB Eligibility Instantly"
  - Description: Explain eligibility assessment capabilities
  - Visual: Screenshot or illustration
  - Key points:
    - FIRB requirements analysis
    - Property type restrictions
    - Detailed explanations

- **Feature 2: Comprehensive Cost Breakdown**
  - Title: "Complete Cost Transparency"
  - Description: All acquisition and ongoing costs
  - Visual: Cost breakdown chart or diagram
  - Key points:
    - Upfront costs (FIRB, stamp duty, surcharges)
    - Ongoing costs (rates, insurance, maintenance)
    - Total investment required

- **Feature 3: Investment Quality Analysis**
  - Title: "Investment Quality Assessment"
  - Description: ROI, cash flow, and growth projections
  - Visual: Analytics dashboard screenshot
  - Key points:
    - 10-year projections
    - ROI calculations
    - Market benchmarks comparison

**How It Works Section**:
- Step-by-step process (3-4 steps)
- Visual flow or numbered steps
- Clear explanation of user journey

**Fees Required Section**:
- Information about FIRB fees (when required vs not required)
- Visual distinction between required and not required
- Links to detailed information

**FIRB Approval Information Section**:
- What is FIRB explanation
- Timeline information (standard, expedited, complex)
- Process steps (4-step visual)
- Key requirements
- Penalties and warnings

**Call-to-Action (CTA) Section**:
- Prominent CTA button
- Compelling headline
- Clear value proposition
- Link to calculator

#### 2.2.3 Design Requirements
- Modern, professional design (see Style Guide)
- Responsive (mobile, tablet, desktop)
- Fast loading (<3 seconds)
- SEO optimized
- Accessible (WCAG 2.1 AA compliance)
- Multi-language support (English/Chinese)

**Design System**: See `STYLE_GUIDE.md` for complete design specifications, color palette, typography, and component styling based on Attio.com design aesthetic.

#### 2.2.4 SEO Elements
- Structured data (Schema.org markup)
- Meta tags (title, description, keywords)
- Open Graph tags for social sharing
- Canonical URLs
- Sitemap inclusion

### 2.3 Navigation

#### 2.3.1 Navigation Structure
- **Logo/Brand**: Clickable logo linking to homepage
- **Main Navigation Items**:
  - Home
  - Calculator (link to calculator page)
  - Blog
  - FAQ
  - Dashboard (if logged in)
- **User Actions**:
  - Language selector (English/Chinese)
  - Login/Sign Up button (if not authenticated)
  - User menu (if authenticated):
    - Dashboard
    - Saved Calculations
    - Account Settings
    - Logout

#### 2.3.2 Navigation Behavior
- Sticky navigation (stays visible on scroll)
- Mobile-responsive hamburger menu
- Active state indication
- Smooth scrolling to sections
- Breadcrumbs on deeper pages

### 2.4 Blog

#### 2.4.1 Purpose
Provide educational content, market insights, regulatory updates, and investment guidance to attract and retain users.

#### 2.4.2 Blog Structure

**Blog Listing Page** (`/blog`):
- **Header**:
  - Page title: "Property Investment Blog"
  - Brief description
  - Search functionality
  - Category filters
- **Featured Posts**:
  - 2-3 featured posts with large cards
  - Prominent display
  - Recent and relevant content
- **Recent Posts Grid**:
  - Card-based layout
  - Each card includes:
    - Featured image
    - Category/tag
    - Title
    - Excerpt
    - Publication date
    - Read time estimate
    - Author (optional)
- **Pagination**: Load more or numbered pages
- **Categories/Tags**: Sidebar or filter section
- **Newsletter Signup**: Optional opt-in

**Blog Post Page** (`/blog/[slug]`):
- **Header**:
  - Title
  - Meta information (date, author, read time, category)
  - Featured image
- **Content**:
  - Article content (markdown/rich text)
  - Images and media
  - Related calculations/links to calculator
  - Call-to-action buttons
- **Sidebar**:
  - Table of contents (if long article)
  - Related posts
  - Popular posts
  - Newsletter signup
- **Footer**:
  - Social sharing buttons
  - Author bio (if applicable)
  - Related articles
  - Comments section (optional)

#### 2.4.3 Blog Content Categories
- **FIRB Guides**: FIRB requirements, eligibility, application process
- **Costs & Fees**: Stamp duty, surcharges, ongoing costs
- **Investment Guides**: Investment strategies, market analysis
- **Visa & Residency**: Visa types, residency requirements
- **Market Updates**: Property market trends, regulatory changes
- **Case Studies**: Real investment examples (anonymized)
- **How-To Guides**: Step-by-step tutorials

#### 2.4.4 Content Management
- **Content Storage**: Markdown files or CMS
- **Content Structure**: 
  - Front matter (metadata)
  - Markdown content
  - Images/assets
- **Content Updates**: Regular posting schedule (weekly/bi-weekly)
- **SEO**: Each post optimized for search
- **Multi-language**: Blog posts in English and Chinese (or translation)

#### 2.4.5 Blog Features
- Search functionality
- Category filtering
- Tag system
- Related posts algorithm
- Social sharing
- Print-friendly layout
- RSS feed
- Email newsletter integration

### 2.5 FAQ (Frequently Asked Questions)

#### 2.5.1 Purpose
Provide quick answers to common questions, reducing support burden and improving user experience.

#### 2.5.2 FAQ Structure

**FAQ Landing Page** (`/faq`):
- **Header**:
  - Page title: "Frequently Asked Questions"
  - Brief description
  - Search bar (prominent)
- **Popular Questions Section**:
  - 6-10 most frequently asked questions
  - Quick access to common queries
- **Category Navigation**:
  - Sidebar or top navigation
  - Categories:
    - FIRB & Eligibility
    - Costs & Fees
    - Investment Analysis
    - Account & Reports
    - Technical Support
    - General
- **FAQ Categories**:
  - Expandable accordion or cards
  - Questions grouped by category
  - Search highlighting
  - Expand/collapse functionality

**FAQ Question Display**:
- Question title (clickable)
- Answer content (expandable)
- Related questions links
- "Was this helpful?" feedback (thumbs up/down)
- "Contact support" link if not helpful

#### 2.5.3 FAQ Content Requirements
- **Coverage**: All major user questions
- **Clarity**: Clear, concise answers
- **Accuracy**: Regularly updated
- **Examples**: Include examples where helpful
- **Links**: Link to relevant calculator sections or blog posts
- **Multi-language**: Full FAQ in English and Chinese

#### 2.5.4 FAQ Features
- Full-text search
- Category filtering
- Popular questions highlighting
- Related questions suggestions
- Feedback mechanism
- Analytics tracking (which questions are most viewed)

### 2.6 Authentication Pages

#### 2.6.1 Login Page

**Purpose**: Allow registered users to access their account and saved calculations.

**Page Elements**:
- **Header**: "Sign In" or "Login"
- **Form Fields**:
  - Email address (required)
  - Password (required)
  - "Remember me" checkbox (optional)
  - "Forgot password?" link
- **Actions**:
  - "Sign In" button
  - "Sign Up" link (for new users)
  - Social login options (optional - Google, etc.)
- **Additional Information**:
  - Security notice
  - Link to privacy policy
  - Language selector

**Functionality**:
- Email/password validation
- Error handling (invalid credentials, account locked, etc.)
- Success redirect to dashboard or previous page
- Password strength requirements display
- Account verification reminder (if email not verified)

#### 2.6.2 Sign Up / Registration Page

**Purpose**: Allow new users to create accounts.

**Page Elements**:
- **Header**: "Create Account" or "Sign Up"
- **Form Fields**:
  - Email address (required, validated)
  - Password (required, with strength indicator)
  - Confirm password (required)
  - Name (optional)
  - Language preference (default: detected from browser)
  - Terms of service checkbox (required)
  - Privacy policy acknowledgment (required)
  - Marketing emails opt-in (optional)
- **Actions**:
  - "Create Account" button
  - "Sign In" link (for existing users)
- **Additional Information**:
  - Account benefits list
  - Security information

**Functionality**:
- Real-time validation
- Password strength requirements
- Email format validation
- Duplicate email checking
- Email verification sent after registration
- Success message with verification email instructions

#### 2.6.3 Password Reset Flow

**Forgot Password Page**:
- Email input field
- "Send Reset Link" button
- Instructions
- Back to login link

**Reset Password Page**:
- New password input
- Confirm password input
- "Reset Password" button
- Token validation
- Success/error messaging

#### 2.6.4 Email Verification

**Verification Page**:
- Confirmation message
- "Resend verification email" option
- Link to login once verified

**Verification Email**:
- Professional email template
- Clear verification link
- Expiration notice
- Support contact information

### 2.7 Legal & Compliance Pages

#### 2.7.1 Privacy Policy (`/privacy`)

**Content Requirements**:
- Data collection practices
- Data usage and storage
- User rights (GDPR compliance)
- Cookie policy
- Third-party services
- Contact information for privacy inquiries
- Last updated date
- Multi-language version

#### 2.7.2 Terms of Service (`/terms`)

**Content Requirements**:
- Service description
- User obligations
- Platform rules
- Intellectual property
- Limitation of liability
- Dispute resolution
- Governing law
- Last updated date
- Multi-language version

#### 2.7.3 Disclaimer (`/disclaimer`)

**Content Requirements**:
- Not financial advice disclaimer
- Not legal advice disclaimer
- Accuracy disclaimers
- Professional consultation requirements
- Liability limitations
- Last updated date
- Multi-language version

### 2.8 Footer

#### 2.8.1 Footer Structure

**Columns**:
- **Column 1: Company**
  - Company name/logo
  - Brief description
  - Mission statement
- **Column 2: Product**
  - Calculator
  - Features
  - Pricing (if applicable)
  - Blog
- **Column 3: Resources**
  - FAQ
  - Guides
  - Case Studies
  - Help Center
- **Column 4: Legal**
  - Privacy Policy
  - Terms of Service
  - Disclaimer
- **Column 5: Contact**
  - Email address
  - Support
  - Social media links

**Bottom Bar**:
- Copyright notice
- Language selector
- Social media icons
- Last updated date

### 2.9 Search Functionality

#### 2.9.1 Global Search
- Search bar in navigation
- Search across:
  - Blog posts
  - FAQ questions
  - Calculator features
  - Help documentation
- Search results page
- Search suggestions/autocomplete

#### 2.9.2 Search Features
- Full-text search
- Result highlighting
- Category filtering
- Recent searches
- Popular searches

### 2.10 Multi-Language Support

#### 2.10.1 Language Options
- **English**: Primary language
- **Chinese (Mandarin)**: Secondary language
- Language selector in navigation
- URL structure: `/en/` or `/zh/`

#### 2.10.2 Translation Requirements
- All website content translated
- Blog posts translated (or separate versions)
- FAQ fully translated
- Legal pages translated
- Calculator interface translated
- Email templates translated

#### 2.10.3 Language Detection
- Browser language detection
- Default to English if unsupported language
- User preference saved in account
- URL-based language switching

### 2.11 SEO & Performance

#### 2.11.1 SEO Requirements
- **On-Page SEO**:
  - Optimized title tags
  - Meta descriptions
  - Header tags (H1, H2, H3)
  - Alt text for images
  - Internal linking
- **Technical SEO**:
  - XML sitemap
  - Robots.txt
  - Canonical URLs
  - Structured data (Schema.org)
  - Open Graph tags
  - Twitter Card tags
- **Content SEO**:
  - Keyword optimization
  - Content quality
  - Regular updates
  - Mobile-friendly

#### 2.11.2 Performance Requirements
- **Page Load Speed**: <3 seconds
- **Core Web Vitals**: Meet Google thresholds
- **Mobile Performance**: Optimized for mobile devices
- **Image Optimization**: Compressed, lazy-loaded
- **Code Optimization**: Minified CSS/JS
- **CDN**: Content delivery network for assets

#### 2.11.3 Analytics & Tracking
- Google Analytics integration
- User behavior tracking
- Conversion tracking
- Search query tracking
- Error tracking
- Performance monitoring

### 2.12 Accessibility

#### 2.12.1 Accessibility Standards
- **WCAG 2.1 Level AA** compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast requirements
- Focus indicators
- Alt text for images
- ARIA labels where needed

#### 2.12.2 Accessibility Features
- Skip to content link
- High contrast mode (optional)
- Text size adjustment
- Keyboard shortcuts
- Screen reader announcements

### 2.13 Responsive Design

#### 2.13.1 Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px

#### 2.13.2 Mobile Considerations
- Touch-friendly interface
- Mobile-optimized navigation
- Simplified layouts for small screens
- Fast loading on mobile networks
- Mobile-first design approach

---

## 3. Core Features & Functionality

### 3.1 Eligibility Assessment

#### 3.1.1 Scope
**Purpose**: Provide factual information about eligibility to purchase specific property types based on citizenship/residency status.

**Important**: The system provides **information only**, not final determinations. Users must seek professional advice.

#### 3.1.2 Eligibility Factors Analyzed

**✓ FIRB Approval Requirements** (YES - Core Feature)
- Foreign Investment Review Board requirements
- Visa type impact on eligibility
- Property type restrictions
- Temporary resident restrictions (e.g., established dwelling ban)
- Ordinarily resident status
- Expedited vs standard processing

**✗ Borrowing Capacity/Finance Approval** (NO - Out of Scope)
- Not included in MVP
- Users assume they have financing

**✗ Strata/Body Corporate Rules** (NO - Out of Scope)
- Not included in MVP
- Users must check individually

**✗ Other Regulatory Constraints** (NO - Out of Scope)
- Not included in MVP

#### 3.1.3 Eligibility Output
- Eligibility status (Eligible, Not Eligible, Requires FIRB Approval)
- Detailed restrictions and explanations
- FIRB application requirements (if applicable)
- Property type-specific guidance
- Next steps guidance (not recommendations)

### 3.2 Comprehensive Cost Analysis

#### 3.2.1 Acquisition Costs

**Government Fees & Taxes**
- FIRB Application Fee (tiered by property value)
  - Standard processing (30 days)
  - Expedited processing (10 days) - premium fee
- Stamp Duty (state-specific calculations)
  - First home buyer concessions
  - Property value brackets
- Foreign Buyer Surcharge (state-specific, 7-8%)
  - NSW: 8%
  - VIC: 8%
  - QLD: 7%
  - Other states: varies
- Annual Land Tax Surcharge (if applicable)

**Professional Fees**
- Legal & Conveyancing (estimated based on property value)
- Building & Pest Inspections
- Land Surveys
- Loan Establishment Fees (if applicable)

**Additional Costs**
- Deposit amount
- Loan costs (if borrowing)
- Other upfront expenses

#### 3.2.2 Ongoing Costs

**Annual Ongoing Costs**
- Council Rates (user input with default)
- Land Tax (if applicable)
- Insurance (building & contents)
- Maintenance & Repairs (percentage of property value)
- Strata/Body Corporate Fees (if applicable, selector yes/no with default)
- Property Management Fees (if applicable)
- Vacancy Fee (if applicable for foreign investors)

**Loan Costs** (if applicable)
- Monthly loan repayments
- Interest payments
- Loan insurance

#### 3.2.3 Cost Breakdown Output
- Total upfront investment required
- Annual ongoing costs
- Monthly cash flow impact
- Cost breakdown by category
- Comparison to similar properties (if data available)

### 3.3 Investment Quality Analysis

#### 3.3.1 Metrics Analyzed

**✓ Rental Yield** (YES)
- Gross rental yield
- Net rental yield (after expenses)
- Effective yield (after vacancy)
- Comparison to market benchmarks (state/suburb level)
- Weekly rent input (user-provided, with benchmark suggestions)

**✓ Cash Flow Projections** (YES - FULL in MVP)
- 10-year projections (user-configurable)
- Monthly and annual cash flow
- After-tax cash flow
- Cumulative cash flow
- Break-even analysis

**✓ Capital Growth Projections** (YES)
- Default: State/suburb-specific benchmarks (from database)
- User can override all defaults
- 10-year projection
- Property value appreciation
- Equity growth calculations
- Total ROI over hold period
- Scenarios: Conservative, Moderate (state default), Optimistic

**✓ Area Demographics & Growth Indicators** (YES)
- Population growth (if data available)
- Economic indicators
- Infrastructure development
- Market trends

**✓ Alternative Investment Comparison** (YES)
- Bonds (historical average, fixed initially)
- Equities/ASX (historical average, fixed initially)
- Term deposits
- High-interest savings
- Future: API data integration

**✓ Sensitivity Analysis** (YES - FULL in MVP)
- Vacancy rate impact (multiple scenarios)
- Interest rate impact (multiple scenarios)
- Capital growth scenarios (Conservative, Moderate, Optimistic)

**✗ Comparable Sales Data** (NO - Not for MVP)
- Manual user input initially
- Future: API integration (CoreLogic, Domain, etc.)

#### 3.3.2 Investment Analysis Output
- Investment score (0-10) with breakdown
- Rental yield metrics (with market comparison)
- Cash flow projections (10-year)
- Capital growth projections
- ROI metrics (total and annualized)
- Alternative investment comparison
- Sensitivity analysis (vacancy, interest rates, growth scenarios)
- Strengths and weaknesses assessment
- Risk profile analysis

### 3.4 Optimal Use Case Analysis

#### 3.4.1 Long-Term Rental vs Short-Stay Comparison

**Purpose**: Help users understand which use case maximizes returns based on their specific property and circumstances.

**Analysis Components**:

**✓ Short-Stay Regulations & Restrictions** (YES - Configurable Database)
- **Data Source**: Configurable rules database (manually updated by admins)
- **Data Lookup**: Based on property address (council/area identification)
- **Regulation Details**:
  - Council/area-specific short-stay regulations
  - Zoning restrictions
  - Permitted days per year
  - Licensing requirements
  - Compliance costs (annual fees, one-time fees)
  - Effective dates and version control
- **Update Process**: Manual admin updates (monthly review minimum)
- **Fallback**: If no specific regulation found, show general guidance and note that user should verify

**✓ Income Comparison Modeling** (YES)
- Long-term rental income (annual)
- Short-stay income (annual, considering occupancy rates)
- Income after management costs
- Income after regulatory compliance costs

**✓ Management Costs & Effort** (YES)
- Long-term: Property management fees, tenant sourcing, maintenance
- Short-stay: Platform fees (Airbnb, Booking.com), cleaning, management, compliance
- Time investment comparison
- Risk factors (vacancy, damage, regulation changes)

#### 3.4.2 Optimal Use Output
- Income comparison matrix (long-term vs short-stay)
- Net profit comparison
- Management complexity comparison
- Regulatory compliance requirements
- Risk assessment for each use case
- Guidance on next steps (not recommendations)

### 3.5 Offer Calculator (Max Allowable Offer)

#### 3.5.1 Purpose
Help investors determine the maximum price they can offer while still meeting their investment criteria. This reverse calculation allows users to work backwards from their desired returns to determine the highest acceptable purchase price.

#### 3.5.2 Calculation Criteria (User Selectable)
Users can select one or more criteria to calculate maximum offer:
- **Target ROI (%)**: Desired return on investment over hold period
- **Target Cash Flow**: Desired annual or monthly cash flow (positive or negative)
- **Target Cap Rate (%)**: Desired capitalization rate
- **Target Yield**: Desired gross or net rental yield
- **Target Cash-on-Cash Return (%)**: Desired return on cash invested

#### 3.5.3 Calculation Process
1. User selects primary criteria (e.g., "I need 5% ROI")
2. User enters all other property details (rent, expenses, etc.)
3. System calculates maximum offer price that meets criteria
4. System shows deal score at different price points
5. System compares to current list price or user's estimated purchase price

#### 3.5.4 Output
- **Maximum Allowable Offer Price**: The highest price that still meets investment criteria
- **Deal Score**: Rating (0-10) at different price points showing deal quality
- **Sensitivity Analysis**: "What if seller asks for $X more?" scenarios
- **Price Comparison**: Maximum offer vs current list price vs market value
- **Margin Analysis**: How much room for negotiation
- **Warning Alerts**: If maximum offer is below market value (deal may not be feasible)

#### 3.5.5 Integration
- Accessible from calculator wizard (alternative calculation mode)
- Available in results dashboard
- Included in PDF report
- Can be used before or after standard analysis

---

### 3.6 Investment Strategy Modes

#### 3.6.1 Buy & Hold (Rental) - Current Implementation
- Standard long-term rental analysis
- Existing comprehensive implementation
- Suitable for traditional rental property investments

#### 3.6.2 Renovate & Hold (P2 - Post-MVP)
- **Purpose**: Analyze properties that require renovation before renting
- **Inputs Required**:
  - Purchase price
  - Renovation costs (detailed breakdown)
  - After-renovation value (ARV)
  - Refinance options and terms
  - Rental income post-renovation
- **Calculations**:
  - Total investment (purchase + renovation)
  - Refinance amount available
  - Cash returned after refinance
  - Net cash invested after refinance
  - Ongoing cash flow post-refinance
  - ROI on cash invested
- **Output**: Similar to BRRRR method but adapted for Australian market context

#### 3.6.3 Renovate & Sell (Flip) (P2 - Post-MVP)
- **Purpose**: Analyze properties purchased for renovation and quick sale
- **Inputs Required**:
  - Purchase price
  - Renovation costs (detailed breakdown)
  - After-renovation value (ARV)
  - Selling costs (agent fees, legal, etc.)
  - Holding period (months)
  - Financing costs during hold period
- **Calculations**:
  - Total investment (purchase + renovation + holding costs)
  - Gross profit (ARV - total investment)
  - Net profit after selling costs
  - ROI on investment
  - Annualized return
  - Tax implications (CGT calculation)
- **Output**: Profit projections, timeline analysis, risk assessment

#### 3.6.4 Development & Subdivision (P2 - Post-MVP)
- **Purpose**: Analyze land development or subdivision projects
- **Inputs Required**:
  - Land purchase price
  - Development approval costs
  - Construction costs (if building)
  - Subdivision costs
  - Final lot/property values
  - Timeline (planning, construction, settlement)
  - Financing structure
- **Calculations**:
  - Total project cost
  - Final value (subdivided lots or built properties)
  - Gross profit
  - Net profit after all costs
  - ROI and timeline
  - Cash flow during development
  - Risk factors (approval delays, cost overruns)
- **Output**: Development feasibility analysis, timeline projections, profit analysis

#### 3.6.5 Short-Stay Accommodation - Current Implementation
- Existing comprehensive implementation
- Includes short-stay regulations and compliance
- Income comparison with long-term rental

#### 3.6.6 Commercial Properties - Current Implementation
- Basic commercial analysis included
- Can be expanded in future versions

### 3.7 Property Comparison & Portfolio Management

#### 3.7.1 Property Comparison (P2 - Post-MVP)
- **Purpose**: Compare multiple properties side-by-side to identify the best investment opportunity
- **Functionality**:
  - Compare 2-4 properties simultaneously
  - Side-by-side metrics display
  - Visual comparison charts
  - Key metrics comparison:
    - Purchase price
    - Total investment required
    - Rental yield (gross, net)
    - Cash flow (annual, monthly)
    - ROI (total, annualized)
    - Investment score
    - Risk profile
  - "Best Deal" recommendation based on user-selected criteria
  - Export comparison report

#### 3.7.2 Portfolio Management (P2 - Post-MVP)
- **Purpose**: Track and manage multiple property analyses over time
- **Features**:
  - Save multiple property analyses
  - Portfolio overview dashboard
  - Aggregate portfolio metrics:
    - Total portfolio value
    - Total portfolio income
    - Total portfolio cash flow
    - Portfolio-wide ROI
    - Diversification analysis
  - Property notes and tags for organization
  - Property status tracking (analyzing, under offer, purchased, etc.)
  - Timeline view of portfolio growth
  - Export portfolio summary report

#### 3.7.3 Use Cases
- **Investors**: Compare multiple properties before making purchase decision
- **Agents/Brokers**: Present multiple investment options to clients
- **Portfolio Builders**: Track and manage growing property portfolio
- **Decision Makers**: Quick comparison of investment opportunities

---

## 4. User Input & Data Collection

### 4.1 Property Information Input

#### 4.1.1 Property Details (Required)
- **Property Address**: Street, suburb, state, postcode
  - **Option**: "Use example/dummy property" if user doesn't have specific property
- **Property Type**: House, apartment, townhouse, land, commercial
- **Purchase Price**: AUD (numeric input)
- **Number of Bedrooms**: (for rental yield estimation)
- **Number of Bathrooms**: (for rental yield estimation)

#### 4.1.2 Optional Property Details
- Property Size (land area, building area) - Not required for MVP
- Strata Fees: Selector (yes/no) with default value if yes

### 4.2 User Profile Information

#### 4.2.1 Required User Information
- **Nationality/Residency Status**: 
  - Australian Citizen
  - Permanent Resident
  - Temporary Resident (with visa type)
  - Foreign National
- **Intended Property Use**:
  - Owner-occupied
  - Long-term rental
  - Short-stay accommodation
  - Mixed use

#### 4.2.2 Optional User Information
- Investment goals (not required for MVP)
- Budget (not required for MVP)
- Risk tolerance (not required for MVP)

### 4.3 Financial Inputs

#### 4.3.1 Acquisition Financials
- **Purchase Price**: Required
- **Deposit %**: Default 20%, user can override
- **First Home Buyer**: Yes/No selector
- **Loan Details** (if borrowing):
  - Loan amount
  - Interest rate (default based on market)
  - Loan type (Principal & Interest, Interest Only)
  - Loan term (years)

#### 4.3.2 Rental & Investment Inputs
- **Expected Weekly Rent**: Required (user input)
  - **System Suggestion**: Based on property value and state/suburb benchmark yield
  - User can use suggestion or enter own estimate
  - Display shows: User input vs Market benchmark
- **Vacancy Rate**: Default 5%, user can override
- **Capital Growth Rate**: Default state/suburb benchmark (from database), user can override
- **Council Rates Estimate**: Input with default
- **Property Management**: Self-managed or managed (fee %)

### 4.4 Calculation Assumptions & Defaults

#### 4.4.1 Long-Term Rental Yield
- **User Input**: Weekly rent amount (required)
- **Benchmark Data**: State/Suburb-specific rental yield benchmarks (from database)
  - System calculates expected rent based on property value and benchmark yield
  - User can use benchmark suggestion or enter own estimate
  - Display shows: User input vs Market benchmark
- **Comparison**: Highlight if user input is above/below market average

#### 4.4.2 Cash Flow Projections
- **Projection Period**: 10 years (default)
- **Rent Growth**: 3% per annum (default, user override)
- **Expense Growth**: 3% per annum (default)

#### 4.4.3 Capital Growth Projections
- **Default**: State/Suburb-specific benchmark data (from database)
  - State-level defaults (required for MVP)
  - Suburb-level defaults (if available, otherwise use state)
  - User can override all defaults
- **Scenarios**: Conservative (4%), Moderate (state default), Optimistic (8%)
- **Display**: Show user input vs market benchmark for comparison

#### 4.4.4 Expense Assumptions
- **Rates**: User input with default
- **Strata**: Yes/no selector with default if yes
- **Insurance**: 0.25% of property value (default)
- **Maintenance**: 1.5% of property value annually (default)
- **Property Management**: 8% of rent (default)
- **Loan Interest**: Based on user input or market rate

#### 4.4.5 Alternative Investment Benchmarks (Fixed - MVP)
- **ASX/Equities**: 7-8% annual return (historical average)
- **Term Deposits**: 4-4.5% annual return
- **Government Bonds**: 4-4.5% annual return
- **High-Interest Savings**: 4.5-5% annual return
- **Future**: API integration for real-time rates

---

## 5. Report & Output Formats

### 5.1 Report Formats

#### 5.1.1 Dashboard View (Interactive)
- Real-time calculation results
- Interactive charts and graphs
- Expandable sections
- Edit and recalculate functionality
- Save/share capabilities

#### 5.1.2 PDF Report (Downloadable)
- Comprehensive multi-page report
- Professional branded template
- All calculations and analysis
- Charts and visualizations
- Disclaimer and legal information
- Print-optimized layout

#### 5.1.3 Marketing Report (P2 - Post-MVP)
- Cleaner, less technical presentation
- Focus on key highlights and selling points
- Suitable for presenting to clients, lenders, or partners
- Professional formatting optimized for client presentation
- Custom branding options (see Section 4.3)

### 5.2 Report Contents

#### 5.2.1 Eligibility Assessment Section
- Eligibility status
- FIRB requirements (if applicable)
- Restrictions and explanations
- Property type-specific guidance
- Next steps guidance

#### 5.2.2 Investment Cost Breakdown
- Complete upfront cost breakdown
- Annual ongoing costs
- Monthly cash flow impact
- Cost breakdown by category
- Visual charts and graphs

#### 5.2.3 Financial Projections
- 10-year cash flow projections
- Rental yield metrics (gross, net, effective)
- Capital growth projections
- Equity growth over time
- ROI calculations (total and annualized)
- User inputs vs market benchmarks comparison

#### 5.2.4 Comparison Matrix
- Long-term rental vs short-stay income comparison
- Management costs comparison
- Regulatory compliance comparison
- Risk assessment for each use case

#### 5.2.5 Alternative Investment Comparison
- Property investment vs bonds
- Property investment vs equities
- Property investment vs term deposits
- Total return comparison
- Annualized return comparison

#### 5.2.6 Sensitivity Analysis
- Vacancy rate impact scenarios
- Interest rate impact scenarios
- Capital growth scenarios (Conservative, Moderate, Optimistic)

#### 5.2.7 Regulatory Alerts & Warnings
- FIRB requirements (if applicable)
- Short-stay restrictions (if applicable)
- State-specific surcharges
- Important compliance notes
- Legal disclaimers

#### 5.2.8 Next Steps Guidance (Not Recommendations)
- What to do next (informational)
- Professional services to consider
- Documentation required
- Timeline expectations
- Compliance checklist

### 5.3 Sample Report Access

#### 5.3.1 Dummy/Sample Report
- **Access**: Available without account creation
- **Content**: Full report structure with example data
- **Purpose**: Show users what they'll receive
- **Limitation**: Not personalized, example data only

#### 5.3.2 Full Report
- **Access**: Requires account creation
- **Content**: Full personalized analysis with user's data
- **Payment**: Required for full report (v1.1 - MVP is free/beta)

### 5.4 Custom Branding & Marketing Reports (P2 - Post-MVP)

#### 5.4.1 Custom Branding Options
- **Purpose**: Allow agents, brokers, and professionals to brand reports with their company identity
- **Branding Elements**:
  - **Company Logo**: Upload and display company logo on reports
  - **Brand Colors**: Customize report color scheme (primary and accent colors)
  - **Company Name**: Display company/business name on reports
  - **Contact Information**: Add company contact details (phone, email, website)
  - **Professional Footer**: Custom footer with company information
- **Report Types**:
  - Marketing reports (always branded)
  - Detailed analysis reports (optional branding)
  - Executive summary reports (optional branding)

#### 5.4.2 Marketing Report Features
- **Target Audience**: Clients, lenders, partners, investors
- **Content Focus**:
  - Key highlights and selling points
  - Investment opportunity summary
  - Key metrics and projections
  - Visual charts and graphs
  - Less technical language
  - Professional presentation
- **Formatting**:
  - Clean, modern design
  - Professional layout
  - High-quality visuals
  - Print-ready format
  - Shareable online link

#### 5.4.3 Sharing & Distribution
- **Shareable Links**: Generate public or private links to reports
- **Email Distribution**: Send reports directly to clients via email
- **Download Options**: PDF download with custom branding
- **Access Control**: Set expiration dates and access permissions
- **Analytics**: Track report views and engagement (optional)

#### 5.4.4 Use Cases
- **Real Estate Agents**: Present investment properties to potential buyers
- **Property Brokers**: Showcase investment opportunities to clients
- **Investment Advisors**: Share analysis with clients
- **Lenders**: Present property analysis for loan applications
- **Partners**: Share deals with investment partners

---

## 6. User Account & Access

### 6.1 Account Requirements

#### 5.1.1 Account Creation
- **Required For**: Full report generation
- **Required For**: Saving calculations
- **Required For**: Calculation history
- **Not Required For**: Sample report viewing
- **Not Required For**: Basic calculations (may be limited)

#### 5.1.2 Account Information
- Email address (required)
- Password (required)
- Name (optional)
- Language preference (English/Chinese)

#### 5.1.3 Account Features
- Save calculations
- View calculation history
- Download reports
- Share calculation links
- Email reports

### 6.2 Access Levels

#### 5.2.1 Guest Access (No Account)
- View sample report
- Basic calculations (may be limited)
- Cannot save or download

#### 5.2.2 Registered User (Free/Beta)
- Full calculation access
- Save calculations
- Download PDF reports
- View history
- Email reports

#### 5.2.3 Paid User (v1.1 - Future)
- All registered user features
- Unlimited calculations
- Priority support
- Advanced features

---

## 7. Data Sources & Maintenance

### 7.1 Data Sources (MVP)

#### 6.1.1 User-Provided Data (Primary)
- Property details (address, type, price)
- Financial inputs (rent, deposit, loan details)
- User profile (citizenship, intended use)
- All calculations based on user inputs
- **User can override all defaults**

#### 6.1.2 Static Data (System)
- FIRB fee schedules (regularly updated manually)
- Stamp duty rates by state (regularly updated manually)
- Foreign buyer surcharge rates by state (regularly updated manually)
- Default assumptions (maintenance %, insurance %, etc.)

#### 6.1.3 Short-Stay Regulations Database (Configurable)

**Data Source Strategy**:
- **Primary Sources**: 
  - Council websites and official documentation
  - State government planning departments
  - Local planning scheme documents
  - Council meeting minutes and resolutions
  - Planning permit databases
- **Data Collection Method**: Manual research and data entry by admin team
- **Verification Process**: 
  - Cross-reference with official council sources
  - Verify effective dates
  - Document source URLs/documents
  - Mark as verified when confirmed

**Database Structure**: Configurable rules database for manual updates

**Fields Required**:
- Council/Area identifier (name, postcode range, or geographic boundary)
- State/Territory
- Short-stay permitted (yes/no)
- Maximum days per year (if limited, null if unlimited)
- Licensing required (yes/no, description if yes)
- Compliance costs (annual fee, one-time fee, etc.)
- Zoning restrictions (description)
- Effective date
- Last updated date
- Source of regulation (URL or document reference)
- Notes/additional requirements

**Update Frequency**: 
- **Initial Population**: Research and populate all major councils (200+) in first 3 months
- **Ongoing Maintenance**: Monthly review of all councils for regulation changes
- **Priority Councils**: Major tourist areas (Sydney, Melbourne, Gold Coast, etc.) reviewed bi-weekly
- **Change Detection**: Monitor council websites and planning department announcements

**Admin Interface**: Required for managing regulations
- Bulk import/export functionality
- Version history tracking
- Verification workflow
- Change notifications

**Version Control**: Track changes over time with audit trail
- Previous versions stored for historical reference
- Change log shows who updated and when
- Effective date tracking for temporal queries

**Fallback Strategy**: 
- If no specific regulation found, show general guidance
- Display warning: "No specific regulation found for this area. Please verify with local council."
- Provide links to council contact information
- Show state-level general guidance if available

#### 6.1.4 Benchmark Data (State/Suburb Level - MVP)

**Data Source Strategy**:
- **Rental Yield Benchmarks**:
  - **Primary Sources**: 
    - CoreLogic rental data (via manual research initially, API in v1.2)
    - Domain.com.au rental listings (aggregated analysis)
    - Realestate.com.au rental listings (aggregated analysis)
    - Australian Bureau of Statistics (ABS) housing data
    - State government housing reports
  - **Data Collection Method**: 
    - Initial: Manual research and aggregation of market data
    - Calculate median/average yields from available listings
    - Cross-reference multiple sources for accuracy
  - **By state** (required for MVP - all 8 states/territories):
    - Gross rental yield (%)
    - Net rental yield (after typical expenses)
    - Median weekly rent by property type
  - **By suburb** (if available, otherwise use state default):
    - Priority: Major suburbs (top 100 by population)
    - Gradually expand to all suburbs
    - Fallback to state-level if suburb data unavailable
  - **Update frequency**: Quarterly (aligns with property market reporting cycles)

- **Capital Growth Benchmarks**:
  - **Primary Sources**:
    - CoreLogic Hedonic Home Value Index
    - Australian Bureau of Statistics (ABS) house price indexes
    - Domain.com.au house price reports
    - Realestate.com.au market reports
    - State government property data
  - **Data Collection Method**:
    - Calculate historical averages from publicly available data
    - 5-year and 10-year rolling averages
    - Weighted averages by property type
  - **By state** (required for MVP):
    - 5-year capital growth rate (% p.a.)
    - 10-year capital growth rate (% p.a.)
    - Median property value trends
  - **By suburb** (if available, otherwise use state default):
    - Priority: Major suburbs with sufficient data
    - Historical trends where available
  - **Update frequency**: Quarterly (aligns with property market reporting cycles)

- **Alternative Investment Returns** (Fixed - MVP):
  - **ASX/Equities**: 7-8% (historical average over 20 years)
  - **Term Deposits**: 4-4.5% (current market rates)
  - **Government Bonds**: 4-4.5% (10-year bond yield)
  - **High-Interest Savings**: 4.5-5% (current market rates)
  - **Data Source**: Reserve Bank of Australia (RBA) data, historical averages
  - **Update frequency**: Semi-annually (or when significant changes occur)

- **Market Comparison Data**:
  - Show user inputs vs market benchmarks
  - Highlight if user inputs are above/below market (within 10% = normal, >10% = highlight)
  - Provide context on market positioning:
    - "Your estimate is X% above/below market average"
    - "This suggests your property may be [above/below] market value"
  - Data quality indicators:
    - Show confidence level in benchmark data
    - Indicate if data is state-level vs suburb-level
    - Note when data was last updated

### 7.2 Data Maintenance Requirements

#### 6.2.1 Regular Updates Required
- **FIRB Rules & Fees**: Quarterly review (regulations change)
- **Stamp Duty Rates**: Quarterly review (state budgets)
- **Foreign Buyer Surcharges**: Quarterly review (policy changes)
- **Short-Stay Regulations**: Monthly review (councils frequently update)
- **Market Benchmarks**: Quarterly review (economic conditions)

#### 6.2.2 Update Process (MVP)
- Manual data entry by admin team
- Admin interface for managing data
- Version control for regulatory changes
- Audit trail for data updates
- User notifications for significant changes

### 7.3 Future Data Integrations (Post-MVP)
- Real estate API integrations (Domain, realestate.com.au)
- CoreLogic data (property values, rental yields)
- Government APIs (FIRB, state revenue offices)
- Market data APIs (rental yields, capital growth)
- Alternative investment APIs (bond rates, ASX data)

---

## 8. Technical Requirements

### 8.1 Platform Architecture

#### 7.1.1 Current Stack
- **Frontend**: Next.js 15 (App Router)
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **PDF Generation**: jsPDF (client-side) or server-side
- **Email**: Resend API
- **Internationalization**: next-intl (English, Chinese)

#### 7.1.2 Key Technical Components
- **FIRB calculation engine** (existing - extends for comprehensive product)
- **Investment analytics engine** (existing - extends for comprehensive analysis)
- **Cost calculation engine** (existing)
- **PDF report generator** (existing)
- Multi-language support (existing)

#### 7.1.3 New Components Required for Comprehensive Product
- **Short-Stay Regulations Database**:
  - Database schema for regulations
  - Admin interface for managing regulations
  - API endpoints for regulation lookups
  - Address-to-council/area mapping logic
- **State/Suburb Benchmark Data System**:
  - Database schema for benchmark data
  - Admin interface for managing benchmarks
  - API endpoints for benchmark lookups
  - Address-to-suburb/state mapping logic
- **Optimal Use Case Comparison Engine**:
  - Long-term rental income modeling
  - Short-stay income modeling (with occupancy rates)
  - Management cost comparison
  - Regulatory compliance cost calculation
  - Risk assessment algorithms

### 8.2 Performance Requirements
- Calculation response time: < 2 seconds
- PDF generation: < 5 seconds
- Page load time: < 3 seconds
- Support concurrent users: 100+ (MVP)

### 8.3 Security & Compliance
- Data encryption (in transit and at rest)
- User data privacy (GDPR considerations)
- Secure authentication
- Financial calculation accuracy
- Legal disclaimers on all outputs

---

## 9. User Experience & User Flows

### 9.1 Primary User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRIMARY USER FLOW                            │
└─────────────────────────────────────────────────────────────────┘

START
  │
  ├─→ [Homepage / Landing Page]
  │     │
  │     ├─→ Option A: "View Sample Report" (No account needed)
  │     │     └─→ Display sample report → END
  │     │
  │     └─→ Option B: "Start Analysis" → Step 1
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Property Input                                          │
└─────────────────────────────────────────────────────────────────┘
  │
  ├─→ User enters property address OR selects "Use example property"
  │     │
  │     ├─→ If "example property": Use predefined dummy data
  │     │
  │     └─→ If real address:
  │           ├─→ System validates address format
  │           ├─→ Extract suburb, state, postcode
  │           └─→ System looks up suburb/state for benchmark data
  │
  ├─→ User selects property type (House, Apartment, Townhouse, etc.)
  │
  ├─→ User enters purchase price (AUD)
  │
  ├─→ User enters number of bedrooms
  │
  ├─→ User enters number of bathrooms
  │
  └─→ [Optional] User enters strata fees (yes/no with amount if yes)
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: User Profile                                            │
└─────────────────────────────────────────────────────────────────┘
  │
  ├─→ User selects citizenship/residency status:
  │     ├─→ Australian Citizen
  │     ├─→ Permanent Resident
  │     ├─→ Temporary Resident (with visa type dropdown)
  │     └─→ Foreign National
  │
  ├─→ IF Foreign/Temporary:
  │     ├─→ System shows FIRB-specific questions
  │     ├─→ User selects visa type (if temporary)
  │     ├─→ User answers "ordinarily resident" question
  │     └─→ User selects expedited FIRB processing (yes/no)
  │
  ├─→ User selects intended property use:
  │     ├─→ Owner-occupied
  │     ├─→ Long-term rental
  │     ├─→ Short-stay accommodation
  │     └─→ Mixed use
  │
  ├─→ User enters deposit percentage (default: 20%)
  │
  └─→ User selects first home buyer status (yes/no)
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: Financial Details                                       │
└─────────────────────────────────────────────────────────────────┘
  │
  ├─→ System displays suggested weekly rent:
  │     ├─→ Calculated from: Property value × Benchmark yield
  │     └─→ Shows: "Market suggests: $X/week based on [State/Suburb] average"
  │
  ├─→ User enters expected weekly rent:
  │     ├─→ Can use suggestion (click "Use suggestion")
  │     ├─→ Can enter custom amount
  │     └─→ System shows comparison: "Your input: $X vs Market: $Y"
  │
  ├─→ User sets vacancy rate (default: 5%, adjustable)
  │
  ├─→ System displays suggested capital growth rate:
  │     ├─→ Based on state/suburb benchmark
  │     └─→ Shows: "Market average: X% p.a. (5-year average)"
  │
  ├─→ User confirms or overrides capital growth rate
  │
  ├─→ IF User indicated borrowing:
  │     ├─→ User enters loan amount (or auto-calculated from deposit %)
  │     ├─→ User enters/confirms interest rate (default: current market rate)
  │     ├─→ User selects loan type (Principal & Interest / Interest Only)
  │     └─→ User enters loan term (years, default: 30)
  │
  ├─→ User enters council rates estimate (with default based on property value)
  │
  ├─→ User selects property management:
  │     ├─→ Self-managed (no fee)
  │     └─→ Managed (enter fee %, default: 8%)
  │
  └─→ [Optional] User adjusts other expense assumptions
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: Review & Calculate                                      │
└─────────────────────────────────────────────────────────────────┘
  │
  ├─→ System displays comprehensive input summary:
  │     ├─→ Property details section
  │     ├─→ User profile section
  │     ├─→ Financial inputs section
  │     └─→ All assumptions and defaults
  │
  ├─→ System highlights any inputs that differ significantly from benchmarks:
  │     ├─→ "⚠️ Your rent estimate is 15% above market average"
  │     └─→ "⚠️ Your capital growth assumption is 2% below market average"
  │
  ├─→ User can edit any section:
  │     ├─→ Click "Edit" on any section
  │     └─→ Returns to that step with pre-filled data
  │
  ├─→ User clicks "Generate Report" button
  │
  ├─→ IF User not logged in:
  │     ├─→ System shows account creation prompt
  │     ├─→ User can: "Create Account" or "Continue as Guest" (limited)
  │     └─→ If "Create Account": → Account Creation Flow (see 8.3)
  │
  └─→ System performs calculations:
        ├─→ Eligibility check (FIRB)
        ├─→ Cost breakdown calculation
        ├─→ Investment quality analysis
        ├─→ Optimal use case comparison
        └─→ Sensitivity analysis
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: Results Display                                         │
└─────────────────────────────────────────────────────────────────┘
  │
  ├─→ System displays interactive dashboard with sections:
  │     │
  │     ├─→ Section 1: Eligibility Assessment
  │     │     ├─→ Eligibility status (Eligible/Not Eligible/Requires FIRB)
  │     │     ├─→ FIRB requirements (if applicable)
  │     │     └─→ Restrictions and explanations
  │     │
  │     ├─→ Section 2: Cost Breakdown
  │     │     ├─→ Upfront costs (visual breakdown chart)
  │     │     ├─→ Ongoing costs (annual/monthly)
  │     │     └─→ Total investment required
  │     │
  │     ├─→ Section 3: Investment Quality Analysis
  │     │     ├─→ Investment score (0-10) with breakdown
  │     │     ├─→ Rental yield metrics (with market comparison)
  │     │     ├─→ 10-year cash flow projections (chart)
  │     │     ├─→ Capital growth projections (chart)
  │     │     ├─→ ROI metrics (total and annualized)
  │     │     └─→ Alternative investment comparison (chart)
  │     │
  │     ├─→ Section 4: Optimal Use Case Comparison
  │     │     ├─→ Long-term rental vs short-stay income comparison
  │     │     ├─→ Management costs comparison
  │     │     ├─→ Short-stay regulations (if applicable)
  │     │     └─→ Risk assessment for each use case
  │     │
  │     └─→ Section 5: Sensitivity Analysis
  │           ├─→ Vacancy rate impact scenarios
  │           ├─→ Interest rate impact scenarios
  │           └─→ Capital growth scenarios (Conservative/Moderate/Optimistic)
  │
  ├─→ User actions available:
  │     ├─→ "Download PDF" → Generate and download PDF report
  │     ├─→ "Email Report" → Send report to user's email
  │     ├─→ "Save Calculation" → Save to user's account (if logged in)
  │     ├─→ "Edit Inputs" → Return to Step 4 (Review)
  │     └─→ "Start New Analysis" → Return to Step 1
  │
  └─→ END
```

#### 8.1.1 Detailed Flow: Account Creation Prompt

```
User clicks "Generate Report" (not logged in)
  │
  ├─→ Modal appears: "Create Account to Generate Full Report"
  │     │
  │     ├─→ Option A: "Create Account"
  │     │     ├─→ Email input
  │     │     ├─→ Password input
  │     │     ├─→ Name (optional)
  │     │     ├─→ Submit
  │     │     └─→ Verification email sent
  │     │         └─→ User verifies email → Continue to calculations
  │     │
  │     ├─→ Option B: "Continue as Guest"
  │     │     └─→ Limited report (no save, no email)
  │     │
  │     └─→ Option C: "Close" → Returns to Step 4
```

#### 8.1.2 Detailed Flow: Benchmark Data Lookup

```
User enters property address
  │
  ├─→ System extracts suburb and state
  │
  ├─→ System queries benchmark_data table:
  │     ├─→ First: Look for suburb-specific data
  │     │     └─→ If found: Use suburb data
  │     │
  │     └─→ If not found: Look for state-level data
  │           └─→ Use state data as fallback
  │
  ├─→ System displays benchmarks:
  │     ├─→ "Market suggests: $X/week rent (based on [Suburb/State] data)"
  │     └─→ "Market average capital growth: X% p.a."
  │
  └─→ User can use suggestions or override
```

#### 8.1.3 Detailed Flow: Short-Stay Regulations Lookup

```
User selects "Short-stay accommodation" as intended use
  │
  ├─→ System extracts council/area from property address
  │
  ├─→ System queries short_stay_regulations table:
  │     ├─→ Match by postcode or suburb
  │     └─→ If multiple matches: Use most specific (suburb > postcode > state)
  │
  ├─→ IF Regulation found:
  │     ├─→ Display regulation details in Step 5 results
  │     ├─→ Include in optimal use case comparison
  │     └─→ Show compliance costs
  │
  └─→ IF No regulation found:
        ├─→ Display warning: "No specific regulation found"
        ├─→ Show general guidance
        └─→ Provide council contact information
```

### 9.2 Sample Report Flow
1. User clicks "View Sample Report" on homepage
2. System displays sample report (no account required)
3. User can see full report structure
4. User can proceed to create account for personalized report

### 9.3 Account Creation Flow
1. User attempts to generate full report
2. System prompts for account creation
3. User enters email and password
4. System sends verification email
5. User verifies email
6. User can now generate full report

---

## 10. Success Metrics & KPIs

### 10.1 User Engagement Metrics

#### Targets (MVP - First 6 Months):
- **Number of calculations performed**: 
  - Target: 500+ calculations/month by month 3
  - Target: 1,000+ calculations/month by month 6
- **Report downloads**: 
  - Target: 60% of calculations result in PDF download
  - Target: 300+ downloads/month by month 6
- **User registration rate**: 
  - Target: 40% of users who start calculation create account
  - Target: 200+ new registrations/month by month 6
- **Return user rate**: 
  - Target: 25% of registered users return within 30 days
  - Target: 35% of registered users return within 90 days
- **Time spent on platform**: 
  - Target: Average 8-12 minutes per session
  - Target: Average 15-20 minutes for complete analysis
- **Benchmark data usage**: 
  - Target: 70% of users accept at least one benchmark suggestion
  - Target: 50% of users accept both rent and capital growth suggestions

#### Tracking Methods:
- Google Analytics / Product analytics tool
- Database logging of calculation events
- User session tracking
- A/B testing for benchmark acceptance rates

### 10.2 Business Metrics

#### Targets (MVP - First 6 Months):
- **User acquisition cost (CAC)**: 
  - Target: <$50 per registered user
  - Target: <$25 per registered user by month 6 (optimization)
- **Conversion rate (sample → full report)**: 
  - Target: 30% of sample report viewers create account
  - Target: 40% of sample report viewers create account by month 6
- **User retention rate**: 
  - Target: 30% of users return within 7 days
  - Target: 20% of users return within 30 days
  - Target: 10% of users return within 90 days
- **Revenue per user (v1.1 - Post-MVP)**: 
  - Target: $20-50/month per paid subscriber
  - Target: 5% paid conversion rate from free users

#### Tracking Methods:
- Marketing attribution tracking
- Conversion funnel analysis
- Cohort retention analysis
- Revenue tracking (v1.1+)

### 10.3 Quality Metrics

#### Targets (MVP - First 6 Months):
- **Calculation accuracy**: 
  - Target: 100% accuracy on manual QA checks (weekly)
  - Target: 0 critical calculation errors
  - Target: <1% minor calculation errors (rounding, formatting)
- **User satisfaction scores**: 
  - Target: Net Promoter Score (NPS) > 40
  - Target: Customer Satisfaction Score (CSAT) > 4.0/5.0
  - Target: 80%+ positive feedback on report quality
- **Error rate**: 
  - Target: <2% of calculations result in user-reported errors
  - Target: <0.5% system errors (500 errors, etc.)
- **Support ticket volume**: 
  - Target: <5% of users submit support tickets
  - Target: Average resolution time <24 hours
- **Data accuracy (benchmark data, regulations)**: 
  - Target: 95%+ accuracy on benchmark data (verified quarterly)
  - Target: 90%+ accuracy on short-stay regulations (verified monthly)
  - Target: <5% user-reported data accuracy issues

#### Tracking Methods:
- Weekly manual QA of calculations
- User feedback surveys (post-report)
- Error logging and monitoring
- Support ticket tracking
- Data accuracy audits (quarterly)

### 10.4 Success Criteria for MVP Launch

**Must Achieve (Minimum Viable Product)**:
- ✅ All core features functional and tested
- ✅ 100% calculation accuracy (manual QA)
- ✅ <2% error rate
- ✅ PDF generation working for all report types
- ✅ Multi-language support (English, Chinese) functional
- ✅ Database schemas implemented and populated with initial data

**Should Achieve (Success Metrics)**:
- 100+ calculations in first month
- 50+ registered users in first month
- NPS > 30
- CSAT > 3.5/5.0
- <5% support ticket rate

**Nice to Have (Stretch Goals)**:
- 500+ calculations in first month
- 200+ registered users in first month
- NPS > 50
- CSAT > 4.5/5.0
- <2% support ticket rate

---

## 11. MVP Scope & Phasing

### 11.1 MVP (v1.0) - Free Beta

#### Feature Prioritization (Must Have / Should Have / Nice to Have)

##### P0 - Must Have (MVP Critical Path)
These features are absolutely essential for MVP launch:

1. **Eligibility Assessment (FIRB)** - **Extends existing calculator**
   - Priority: P0
   - Status: ✅ Existing foundation
   - Dependencies: None

2. **Comprehensive Cost Breakdown**
   - Priority: P0
   - Status: ✅ Existing foundation
   - Dependencies: None

3. **Investment Quality Analysis - Core Calculations**
   - Priority: P0
   - Includes:
     - Complete ROI calculations
     - 10-year cash flow projections (monthly and annual)
     - Basic sensitivity analysis (at least 3 scenarios)
   - Status: ✅ Existing foundation
   - Dependencies: None

4. **Dashboard View (Interactive Results)**
   - Priority: P0
   - Status: To be built
   - Dependencies: All calculation engines

5. **PDF Report Generation**
   - Priority: P0
   - Status: ✅ Existing foundation
   - Dependencies: All calculation engines

6. **Account Creation and Authentication**
   - Priority: P0
   - Status: ✅ Existing foundation
   - Dependencies: None

7. **Multi-language Support (English, Chinese)**
   - Priority: P0
   - Status: ✅ Existing foundation
   - Dependencies: None

##### P1 - Should Have (MVP Important)
These features significantly enhance value but can be launched without initially:

8. **State/Suburb Benchmark Data System**
   - Priority: P1
   - Minimum viable: State-level data for all 8 states/territories
   - Suburb-level data: Priority suburbs (top 50-100) for MVP
   - Status: To be built
   - Dependencies: Database schema, admin interface

9. **User Inputs vs Market Benchmarks Comparison**
   - Priority: P1
   - Status: To be built
   - Dependencies: Benchmark data system

10. **Optimal Use Case Comparison - Basic**
    - Priority: P1
    - Minimum viable: Long-term rental vs short-stay income comparison
    - Basic management costs comparison
    - Status: To be built
    - Dependencies: Short-stay regulations database

11. **Short-Stay Regulations Database - Basic**
    - Priority: P1
    - Minimum viable: Top 50 councils (major tourist areas)
    - Admin interface for manual updates
    - Status: To be built
    - Dependencies: Database schema

12. **Sample Report (No Account Required)**
    - Priority: P1
    - Status: ✅ Existing foundation (can enhance)
    - Dependencies: PDF generation

13. **Sensitivity Analysis - Full Scenarios**
    - Priority: P1
    - Includes:
      - Vacancy rate impact (3-4 scenarios)
      - Interest rate impact (3-4 scenarios)
      - Capital growth scenarios (Conservative/Moderate/Optimistic)
    - Status: To be built (partially exists)
    - Dependencies: Investment analytics engine

14. **Offer Calculator (Max Allowable Offer)**
    - Priority: P1
    - Purpose: Calculate maximum offer price based on investment criteria
    - Features:
      - Target ROI, cash flow, cap rate, yield calculations
      - Deal scoring at different price points
      - Sensitivity analysis for price negotiations
      - Comparison to list price
    - Status: To be built
    - Dependencies: Investment analytics engine

##### P2 - Nice to Have (Post-MVP Enhancement)
These features can be added after MVP launch:

15. **Alternative Investment Comparison - Detailed**
    - Priority: P2
    - Status: To be built
    - Dependencies: Investment analytics engine

16. **Short-Stay Regulations - Comprehensive Coverage**
    - Priority: P2
    - All 200+ councils (expand from P1 top 50)
    - Status: Post-MVP
    - Dependencies: P1 version working

17. **Advanced Sensitivity Analysis**
    - Priority: P2
    - More scenarios, interactive charts
    - Status: Post-MVP
    - Dependencies: P1 version working

18. **Calculation History and Saved Reports**
    - Priority: P2
    - Status: To be built
    - Dependencies: Account system

19. **Multiple Investment Strategies**
    - Priority: P2
    - Includes:
      - Renovate & Hold (similar to BRRRR, Australian context)
      - Renovate & Sell (Flip analysis)
      - Development & Subdivision analysis
    - Status: Post-MVP
    - Dependencies: Investment analytics engine, enhanced calculation models

20. **Marketing Reports & Custom Branding**
    - Priority: P2
    - Features:
      - Marketing report variant (client-friendly presentation)
      - Custom branding (logo, colors, company info)
      - Shareable links with access control
      - Email distribution to clients
    - Status: Post-MVP
    - Dependencies: PDF generation, account system

21. **Property Comparison & Portfolio Management**
    - Priority: P2
    - Features:
      - Side-by-side property comparison (2-4 properties)
      - Portfolio dashboard with aggregate metrics
      - Property notes and tags
      - Status tracking (analyzing, under offer, purchased)
      - Comparison reports
    - Status: Post-MVP
    - Dependencies: Account system, calculation storage

#### MVP Launch Requirements

**Phase 1 - Core MVP (Launch Ready)**:
- All P0 features ✅
- P1 features: #8 (State-level benchmarks only), #9, #10 (basic), #12, #14 (Offer Calculator)
- Goal: Launch with core functionality, expand post-launch

**Phase 2 - Enhanced MVP (Month 2-3)**:
- Complete all P1 features including:
  - #13 (Full sensitivity analysis)
  - #14 (Offer Calculator - full implementation)
- Add suburb-level benchmarks (top 100 suburbs)
- Expand short-stay regulations (top 50 councils)

**Phase 3 - Post-MVP (v1.1+)**:
- P2 features prioritized:
  - #20 (Marketing Reports & Custom Branding) - High value for agents/brokers
  - #21 (Property Comparison & Portfolio Management) - High user demand
  - #19 (Multiple Investment Strategies) - Expands market
  - #15-18 (Other P2 features)
- Payment processing
- API integrations
- Advanced features

#### Excluded Features (Future Releases)
- Payment processing (v1.1)
- API integrations for property data (v1.2)
- Advanced market data (v1.2)
- Mobile app (v1.3)
- Real-time market data updates (v1.2)
- Note: Property comparison and portfolio management moved to P2 (v1.1+)

### 11.2 Future Enhancements

#### v1.1 - Monetization
- Payment processing
- Subscription tiers
- Usage limits for free tier
- Premium features

#### v1.2 - Data Integration
- Real estate API integrations
- CoreLogic data
- Market data APIs
- Automated data updates

#### v1.3 - Advanced Features
- Mobile app
- Property comparison tool
- Investment portfolio tracking
- Advanced analytics

---

## 12. Legal & Compliance

### 12.1 Disclaimers Required

#### 11.1.1 Standard Disclaimer Text (To appear on all reports and outputs)

```
IMPORTANT DISCLAIMER

This report and all calculations are provided for informational purposes only and do not 
constitute financial, investment, tax, or legal advice. The information contained herein 
is based on the data and assumptions you have provided and should not be relied upon as 
the sole basis for making investment decisions.

NOT FINANCIAL ADVICE
This report is not intended to be financial advice. The calculations, projections, and 
analysis are illustrative only and are based on certain assumptions that may not reflect 
your actual circumstances or future market conditions. Past performance is not indicative 
of future results. Property values can decrease as well as increase, and rental income 
is not guaranteed.

NOT LEGAL ADVICE
Eligibility information, FIRB requirements, and regulatory guidance provided in this report 
are general in nature and do not constitute legal advice. Laws and regulations change 
frequently, and this information may not be current or applicable to your specific 
situation. You must seek independent legal advice regarding property purchase, FIRB 
requirements, and compliance with all applicable laws.

PROFESSIONAL CONSULTATION REQUIRED
Before making any investment decisions, you should consult with qualified professionals 
including:
- A licensed financial advisor
- A qualified accountant or tax advisor
- A solicitor or conveyancer
- A registered property valuer
- A mortgage broker (if applicable)

ACCURACY OF INFORMATION
While we strive to ensure the accuracy of calculations and data, we make no warranties 
or representations regarding:
- The accuracy, completeness, or currency of the information provided
- The accuracy of benchmark data, which are estimates based on historical averages
- The applicability of short-stay regulations, which change frequently
- Future market conditions or property performance

REGULATORY CHANGES
Laws, regulations, and policies change frequently. FIRB requirements, stamp duty rates, 
foreign buyer surcharges, and short-stay regulations may have changed since this report 
was generated. You must verify all current requirements with relevant authorities.

BENCHMARK DATA
Market benchmarks (rental yields, capital growth rates) are estimates based on historical 
data and market averages. Actual results may vary significantly. The benchmarks provided 
are indicative only and should not be used as guarantees of future performance.

NO LIABILITY
To the maximum extent permitted by law, [Company Name] and its affiliates, officers, 
employees, and agents exclude all liability for any loss or damage (including indirect, 
consequential, or special loss or damage) arising from or in connection with:
- Your use of or reliance on this report
- Any errors or omissions in the information provided
- Any decisions made based on this report

By using this service, you acknowledge that you have read, understood, and agree to this 
disclaimer.
```

#### 11.1.2 Short Disclaimer (For dashboard/UI)

```
⚠️ This analysis is for informational purposes only and does not constitute financial, 
investment, tax, or legal advice. Please consult with qualified professionals before 
making investment decisions.
```

#### 11.1.3 Section-Specific Disclaimers

**Eligibility Section**:
```
This eligibility assessment is based on general rules and regulations. Laws change 
frequently. You must verify current requirements with FIRB and relevant authorities 
before proceeding. This is not legal advice.
```

**Investment Quality Section**:
```
All projections are based on assumptions and historical data. Actual results may vary. 
Property values can decrease. Past performance does not guarantee future results.
```

**Short-Stay Regulations Section**:
```
Regulations change frequently and vary by council. This information may not be current. 
You must verify current regulations with your local council before operating a short-stay 
property.
```

**Benchmark Data**:
```
Market benchmarks are estimates based on historical averages. Actual market conditions 
may differ significantly. Data sources: [List sources]. Last updated: [Date].
```

### 12.2 Compliance Requirements
- Privacy policy (GDPR compliant)
- Terms of service
- Data protection
- User consent for data usage
- Financial services regulations (if applicable)

### 12.3 Liability Limitations
- System provides information, not recommendations
- Users responsible for verifying information
- No guarantee of accuracy
- Professional advice required
- Benchmark data is indicative only

---

## 13. Database Schemas Required

### 13.1 Short-Stay Regulations Schema

```sql
CREATE TABLE short_stay_regulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Geographic Identification
  council_name TEXT NOT NULL,
  state australian_state NOT NULL,
  postcode_range TEXT, -- e.g., "2000-2010" or "2000"
  suburb_name TEXT,
  
  -- Regulation Details
  short_stay_permitted BOOLEAN NOT NULL,
  max_days_per_year INTEGER, -- NULL if unlimited
  licensing_required BOOLEAN DEFAULT false,
  licensing_description TEXT,
  compliance_cost_annual DECIMAL(10, 2),
  compliance_cost_one_time DECIMAL(10, 2),
  zoning_restrictions TEXT,
  
  -- Metadata
  effective_date DATE NOT NULL,
  last_verified_date DATE,
  source_url TEXT,
  source_document TEXT,
  notes TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1
);

CREATE INDEX idx_short_stay_regulations_state ON short_stay_regulations(state);
CREATE INDEX idx_short_stay_regulations_postcode ON short_stay_regulations(postcode_range);
CREATE INDEX idx_short_stay_regulations_active ON short_stay_regulations(is_active) WHERE is_active = true;
```

### 13.2 Benchmark Data Schema

```sql
CREATE TABLE benchmark_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Geographic Identification
  state australian_state NOT NULL,
  suburb_name TEXT, -- NULL for state-level data
  postcode TEXT,
  
  -- Rental Yield Benchmarks
  gross_rental_yield DECIMAL(5, 2), -- Percentage
  net_rental_yield DECIMAL(5, 2), -- Percentage
  median_weekly_rent DECIMAL(10, 2),
  
  -- Capital Growth Benchmarks
  capital_growth_5yr DECIMAL(5, 2), -- Percentage per annum
  capital_growth_10yr DECIMAL(5, 2), -- Percentage per annum
  median_property_value DECIMAL(12, 2),
  
  -- Data Quality
  data_source TEXT,
  last_updated DATE NOT NULL,
  data_quality_score INTEGER, -- 1-10
  notes TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1
);

CREATE INDEX idx_benchmark_data_state ON benchmark_data(state);
CREATE INDEX idx_benchmark_data_suburb ON benchmark_data(suburb_name);
CREATE INDEX idx_benchmark_data_active ON benchmark_data(is_active) WHERE is_active = true;
```

---

## 14. Admin Interface Requirements

### 14.1 Short-Stay Regulations Admin
- **CRUD Operations**: Create, Read, Update, Delete regulations
- **Bulk Import**: CSV import for regulations
- **Search/Filter**: By state, council, postcode
- **Version History**: View previous versions
- **Verification Workflow**: Mark as verified, add verification date
- **Export**: Export regulations for backup

### 14.2 Benchmark Data Admin
- **CRUD Operations**: Create, Read, Update, Delete benchmark data
- **Bulk Import**: CSV import for benchmark data
- **Search/Filter**: By state, suburb
- **Data Quality Tracking**: Score data quality
- **Update Scheduling**: Set reminders for data updates
- **Export**: Export benchmarks for backup

---

## 15. Appendices

### 15.1 Glossary
- **FIRB**: Foreign Investment Review Board
- **LVR**: Loan-to-Value Ratio
- **ROI**: Return on Investment
- **CGT**: Capital Gains Tax
- **Strata**: Body corporate (for apartments/units)
- **Short-Stay**: Temporary accommodation (Airbnb, Booking.com, etc.)

### 15.2 Reference Documents
- Existing FIRB calculator implementation
- Investment analytics types
- Database schema
- API documentation

---

## Document Status
**Version**: 1.0  
**Last Updated**: [Date]  
**Status**: Final Draft - Ready for Review  
**Next Review**: [Date]

---

## Key Decisions Summary

1. **Product Relationship**: NEW comprehensive product extending existing FIRB calculator
2. **Short-Stay Regulations**: Configurable database with admin interface for manual updates
3. **Benchmark Data**: State/suburb-level benchmarks included in MVP (user can override)
4. **MVP Scope**: FULL investment quality analysis and optimal use case comparison included in MVP
5. **Data Sources**: Manual admin updates for regulations and benchmarks (API integrations in v1.2+)

