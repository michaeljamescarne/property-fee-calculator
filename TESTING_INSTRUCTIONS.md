# Local Testing Instructions

## Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun package manager

## Step 1: Install Dependencies

Navigate to the project directory and install dependencies:

```bash
cd property-fee-calculator
npm install
# or
yarn install
# or
pnpm install
```

## Step 2: Start the Development Server

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will start at **http://localhost:3000**

## Step 3: Test the Results Page

### Option A: Navigate Through the Calculator Flow

1. **Go to the Calculator:**
   - Open http://localhost:3000
   - Click on "FIRB Calculator" or navigate to `/firb-calculator`

2. **Complete the Calculator Steps:**
   - **Step 1 - Citizenship:** Select your citizenship status (e.g., "Foreign National")
   - **Step 2 - Property Details:**
     - Select property type (e.g., "Established Dwelling")
     - Enter property value (e.g., $500,000)
     - Select state (e.g., "NSW")
   - **Step 3 - Financial Details:**
     - Enter rental income (optional)
     - Enter loan details (optional)
   - **Step 4 - Review:** Review your inputs and click "Calculate"

3. **View Results Page:**
   - The results page will display with:
     - **Eligibility Result Card** (top section)
     - **Cost Breakdown** (with total investment cost in blue box)
     - **Investment Analytics Toggle** (blue card to expand/collapse)
     - **Action Buttons** (Download PDF, Save, Email, Edit, Start Again)

### Option B: Direct URL (if you have a saved calculation)

If you have a saved calculation ID, you can navigate directly to:

```
http://localhost:3000/firb-calculator/results?calculationId=YOUR_ID
```

## Step 4: Verify Style Guide Compliance

### Check the Following Elements:

#### ✅ **Eligibility Result Card**

- [ ] Card has `border border-gray-200` (light gray border)
- [ ] Header background is solid color (not gradient) - red/amber/green
- [ ] All text uses specific gray colors (`text-gray-900`, `text-gray-600`, `text-gray-500`)
- [ ] Icons use `text-blue-600` for primary actions
- [ ] Border radius is 4px (`rounded` class, not `rounded-lg` or `rounded-xl`)

#### ✅ **Cost Breakdown Card**

- [ ] Card has `border border-gray-200 shadow-sm rounded`
- [ ] Total Investment Cost box is solid `bg-blue-600` (not gradient)
- [ ] Card title is `text-2xl font-semibold text-gray-900`
- [ ] Card description is `text-gray-600`
- [ ] All item descriptions are `text-gray-600`
- [ ] Ongoing costs section has `bg-gray-50 border border-gray-200`

#### ✅ **Investment Analytics Toggle Card**

- [ ] Card has `border-2 border-blue-200 bg-blue-50` (not gradient)
- [ ] Border radius is `rounded` (4px)
- [ ] Icon is `text-blue-600`
- [ ] Title is `text-gray-900`
- [ ] Description is `text-gray-600`
- [ ] Button has `rounded` class

#### ✅ **Action Buttons**

- [ ] All buttons have `rounded` class (4px border radius)
- [ ] Buttons are properly styled with consistent spacing

#### ✅ **Investment Analytics Components** (when expanded)

- [ ] All cards have `border border-gray-200 shadow-sm rounded`
- [ ] No gradients (all solid colors)
- [ ] All `text-muted-foreground` replaced with `text-gray-600`
- [ ] All `text-primary` replaced with `text-blue-600`
- [ ] All `bg-muted` replaced with `bg-gray-50`
- [ ] All border radius is `rounded` (4px)

### Visual Checklist:

1. **Colors:**
   - Primary text: `text-gray-900` (dark gray)
   - Secondary text: `text-gray-600` (medium gray)
   - Muted text: `text-gray-500` (light gray)
   - Primary accent: `text-blue-600` (blue)
   - Borders: `border-gray-200` (light gray)

2. **Borders:**
   - All cards have visible borders (`border border-gray-200`)
   - Border radius is consistently 4px (`rounded`)

3. **No Gradients:**
   - All gradient backgrounds removed
   - Solid colors used instead

4. **Typography:**
   - Headings: `font-semibold` (not `font-bold`)
   - H1: `text-3xl` or `text-4xl`
   - H2: `text-2xl` or `text-3xl`
   - Body: `text-base` or `text-sm`

## Step 5: Test Interactive Features

1. **Toggle Investment Analytics:**
   - Click the "Show Investment Analysis" button
   - Verify the card expands smoothly
   - Check all analytics components follow style guide

2. **Accordion in Cost Breakdown:**
   - Click on cost breakdown sections
   - Verify accordion items have proper styling
   - Check borders and text colors

3. **Button Hover States:**
   - Hover over all buttons
   - Verify hover states are consistent

## Step 6: Test Responsive Design

1. **Mobile View:**
   - Open browser DevTools (F12)
   - Switch to mobile view (e.g., iPhone 12 Pro)
   - Verify all cards stack properly
   - Check text sizes are readable

2. **Tablet View:**
   - Test at 768px width
   - Verify grid layouts adapt correctly

3. **Desktop View:**
   - Test at 1920px width
   - Verify proper spacing and alignment

## Troubleshooting

### If the server won't start:

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### If styles look incorrect:

```bash
# Rebuild Tailwind
npm run build
```

### If you see TypeScript errors:

```bash
# Run type check
npm run type-check
```

### If you see linting errors:

```bash
# Fix linting issues
npm run lint:fix
```

## Additional Testing Commands

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test

# Build for production (to catch build errors)
npm run build
```

## Quick Test Checklist

- [ ] Development server starts without errors
- [ ] Can navigate to calculator
- [ ] Can complete calculator flow
- [ ] Results page displays correctly
- [ ] All cards have proper borders and colors
- [ ] No gradients visible
- [ ] All border radius is 4px
- [ ] Text colors match style guide
- [ ] Buttons are properly styled
- [ ] Investment analytics toggle works
- [ ] Responsive design works on mobile/tablet/desktop
