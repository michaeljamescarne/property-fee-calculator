# Supabase Database Setup

## Quick Start

This folder contains database migrations and configuration for the FIRB Calculator.

### Current Status
⚠️ **Database is NOT currently set up** - the application works without it.

### To Enable Database Features:

1. **Create Supabase Project**: https://app.supabase.com
2. **Run Migration**: Copy `migrations/20250110_create_firb_calculations.sql` to Supabase SQL Editor
3. **Install Client**: `npm install @supabase/supabase-js`
4. **Configure**: Create `lib/supabase.ts` using `config.example.ts` as template
5. **Set Environment Variables**: Add to `.env.local` and Vercel

See `../docs/DATABASE_SETUP.md` for detailed instructions.

---

## Files in this Directory

- `migrations/20250110_create_firb_calculations.sql` - Database schema migration
- `config.example.ts` - Supabase client configuration template
- `README.md` - This file

---

## Migration File

The migration creates:
- ✅ `firb_calculations` table with full schema
- ✅ 4 enum types for type safety
- ✅ Indexes for performance
- ✅ Auto-generated share URL slugs
- ✅ Row Level Security policies
- ✅ Triggers for updated_at
- ✅ Public view (excludes email)

---

## What Database Enables

### Features Requiring Database:
- Shareable calculation URLs (`/results/abc123`)
- Calculation history
- Save results for later
- Email results to users
- Analytics dashboard
- User accounts (optional)

### Works Without Database:
- All FIRB fee calculations
- Live results display
- Everything else in the app

---

## When to Add Database

**Add Supabase when you want:**
1. Users to share calculations with others
2. Users to save calculations
3. Analytics on popular states/property types
4. Email calculation results
5. User accounts and saved searches

**Current Setup (No Database):**
- Fast and simple
- No maintenance
- Zero cost
- Perfect for MVP

---

## Need Help?

See detailed setup guide: `../docs/DATABASE_SETUP.md`


