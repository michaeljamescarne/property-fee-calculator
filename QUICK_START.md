# Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp env.example.txt .env.local
```

Edit `.env.local` and add your actual values:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `RESEND_API_KEY` - Your Resend API key (optional, for emails)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Your Google Maps API key (optional)
- `NEXT_PUBLIC_APP_URL` - Your app URL (default: http://localhost:3000)

### 3. Run Database Migrations

Apply the leads table migration in your Supabase dashboard or via CLI:

```bash
# If using Supabase CLI
supabase db push
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 📋 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

### Testing
- `npm run test` - Run tests in watch mode
- `npm run test:unit` - Run unit tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:e2e:ui` - Run E2E tests with UI
- `npm run test:all` - Run all tests

---

## 🏗️ Project Structure

```
property-fee-calculator/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utility functions and helpers
│   ├── utils/            # General utilities (error-handler, logger)
│   ├── firb/             # FIRB calculation logic
│   └── supabase/         # Supabase client setup
├── tests/                 # Test files
│   ├── unit/             # Unit tests
│   └── e2e/              # E2E tests
├── supabase/              # Database migrations
│   └── migrations/       # SQL migration files
└── docs/                  # Documentation
```

---

## 🧪 Testing

### Unit Tests
Unit tests are located in `tests/unit/` and use Vitest.

```bash
npm run test:unit
```

### E2E Tests
E2E tests are located in `tests/e2e/` and use Playwright.

```bash
npm run test:e2e
```

---

## 🔧 Code Quality

### Pre-commit Hooks
Husky automatically runs lint-staged on commit:
- ESLint checks
- Prettier formatting

### CI/CD
GitHub Actions runs on every push/PR:
- Lint and type check
- Unit tests
- Build verification
- E2E tests
- Security audit

---

## 📚 Documentation

- **PRD**: `docs/PRODUCT_REQUIREMENTS_DOCUMENT.md`
- **Implementation Plan**: `docs/IMPLEMENTATION_PLAN.md`
- **Style Guide**: `docs/STYLE_GUIDE.md`
- **Development Guidelines**: `docs/DEVELOPMENT_GUIDELINES.md`
- **Phase 0 Setup**: `docs/PHASE_0_SETUP_COMPLETE.md`

---

## 🐛 Troubleshooting

### Dependencies Issues
```bash
npm install --legacy-peer-deps
```

### TypeScript Errors
```bash
npm run type-check
```

### Linting Errors
```bash
npm run lint:fix
npm run format
```

---

## ✅ Phase 0 Complete

Foundation setup is complete! Ready for Phase 1: Public Website & Lead Capture.

See `docs/PHASE_0_SETUP_COMPLETE.md` for details.



