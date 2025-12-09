# Database Production Issues - Investigation Summary

## Problem Statement

**Issue**: Database operations work locally but fail in production:
- ❌ User login doesn't create users in Supabase table
- ❌ Lead creation doesn't work
- ❌ Benchmarks don't load

**Local Environment**: ✅ All operations work correctly

**Production Environment**: ❌ All database operations fail

**User Note**: Possible that migration scripts were skipped during setup. Supabase appears to only have one environment at the moment.

---

## Investigation Approach

Two investigation documents have been created:

1. **`DATABASE_INVESTIGATION_PLAN.md`** - Comprehensive investigation plan with detailed steps
2. **`DATABASE_INVESTIGATION_CHECKLIST.md`** - Quick reference checklist for rapid diagnosis

---

## Most Likely Root Causes (Based on Analysis)

### 1. Single Supabase Project (High Probability)

**Indicator**: User mentioned "Supabase appears to only have one environment"

**Problem**: Local and production both pointing to the same Supabase project/database

**Impact**:
- Data mixing between environments
- Migration conflicts
- Potential data corruption

**Evidence Needed**:
- Compare `NEXT_PUBLIC_SUPABASE_URL` in local `.env.local` vs Vercel production env vars
- Check number of Supabase projects in dashboard

**Solution**: Create separate production Supabase project

---

### 2. Migrations Not Run on Production (High Probability)

**Indicator**: Operations work locally (where migrations were run) but fail in production

**Problem**: Database tables don't exist in production database

**Required Tables** (must exist):
- `user_profiles` - For user authentication
- `magic_codes` - For passwordless login
- `leads` - For email capture
- `firb_calculations` - For calculation storage
- `benchmark_data` - For benchmark lookups
- `cost_benchmarks` - For cost benchmarking
- `macro_benchmarks` - For macro benchmarking
- `saved_calculations` - For saved user calculations

**Evidence Needed**:
- Run table existence query in production Supabase SQL Editor
- Check Vercel logs for "relation does not exist" errors

**Solution**: Run all migrations in production Supabase project

---

### 3. Table Structure Issues (Medium Probability)

**Problem**: Tables exist but have incorrect structure

**Known Issues from Codebase**:
- `user_profiles` might have foreign key to `auth.users` (which doesn't exist)
- RLS policies might not allow service role access
- Missing default UUID generation on `user_profiles.id`

**Evidence Needed**:
- Check foreign key constraints
- Check RLS policies
- Check column defaults

**Solution**: Run fix migrations (`20250118_fix_user_profiles_auth_reference.sql`, `20250114_fix_rls_policies.sql`)

---

### 4. Environment Variables Missing (Low Probability)

**Problem**: Production environment variables not configured in Vercel

**Required Variables**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Evidence Needed**:
- Check Vercel environment variables dashboard
- Check Vercel logs for "environment variable not set" errors

**Solution**: Add missing environment variables in Vercel

---

## Investigation Steps Overview

### Phase 1: Environment Verification (10 minutes)

1. **Check Local Configuration**
   - Open `.env.local`
   - Note Supabase project URL
   - Verify all env vars present

2. **Check Production Configuration**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Note Supabase project URL
   - Compare with local URL

3. **Verify Separate Projects**
   - Check Supabase dashboard
   - Count number of projects
   - Identify which project is production

**Expected Outcome**: Determine if single vs separate databases

---

### Phase 2: Database Schema Verification (15 minutes)

1. **Check Local Database**
   - Run table existence query
   - Verify all required tables present
   - Check table row counts

2. **Check Production Database**
   - Run same queries in production Supabase
   - Compare with local results
   - Identify missing tables

**Expected Outcome**: Identify missing tables or structural differences

---

### Phase 3: Structure Deep Dive (10 minutes)

1. **Check Table Structure**
   - Verify `user_profiles` structure
   - Check for problematic foreign keys
   - Verify column defaults

2. **Check RLS Policies**
   - Verify RLS enabled/disabled correctly
   - Check service role policies
   - Verify policy correctness

**Expected Outcome**: Identify structural issues

---

### Phase 4: Runtime Verification (10 minutes)

1. **Test Production APIs**
   - Test lead creation endpoint
   - Check response and errors
   - Review Vercel logs

2. **Check Error Patterns**
   - Look for specific error messages
   - Identify failure points
   - Document error codes

**Expected Outcome**: Understand runtime behavior

---

## Quick Diagnosis Flow

```
START
  ↓
Check: Are local and production Supabase URLs different?
  ├─ NO → ROOT CAUSE: Single database
  │        ACTION: Create separate production project
  │
  └─ YES → Continue ↓
        ↓
    Check: Do required tables exist in production?
      ├─ NO → ROOT CAUSE: Migrations not run
      │        ACTION: Run all migrations
      │
      └─ YES → Continue ↓
            ↓
        Check: Does user_profiles have FK to auth.users?
          ├─ YES → ROOT CAUSE: Structure issue
          │        ACTION: Run fix migration
          │
          └─ NO → Continue ↓
                ↓
            Check: Do RLS policies allow service_role?
              ├─ NO → ROOT CAUSE: RLS blocking
              │        ACTION: Run RLS fix migration
              │
              └─ YES → Continue ↓
                    ↓
                Check: Are env vars set in Vercel?
                  ├─ NO → ROOT CAUSE: Missing config
                  │        ACTION: Add env vars
                  │
                  └─ YES → Check Vercel logs for specific errors
```

---

## Required Migrations Reference

If migrations need to be run, here's the complete list:

### Core Tables
1. `20250110_create_firb_calculations.sql` - FIRB calculations storage
2. `20250112_auth_system_fixed.sql` - Authentication system (user_profiles, magic_codes, saved_calculations)
3. `20250115_create_leads_table.sql` - Lead capture

### Benchmark Tables
4. `20250117_phase4_benchmark_data.sql` - Main benchmark data
5. `20250118_create_cost_benchmarks.sql` - Cost benchmarking
6. `20250118_create_macro_benchmarks.sql` - Macro benchmarking

### Fixes
7. `20250114_fix_rls_policies.sql` - Fix RLS for service role
8. `20250118_fix_user_profiles_auth_reference.sql` - Remove FK to auth.users
9. `20250118_add_role_to_user_profiles.sql` - Add admin role support

---

## Key Code References

### User Creation
- **File**: `app/api/auth/verify-code/route.ts`
- **Process**: Verifies magic code → Checks/creates `user_profiles` → Creates session
- **Dependency**: `user_profiles` table must exist

### Lead Creation
- **File**: `app/api/leads/route.ts`
- **Process**: Validates email → Inserts into `leads` table
- **Dependency**: `leads` table must exist, RLS must allow service role

### Benchmarks
- **File**: `app/api/benchmarks/route.ts`
- **Process**: Queries `benchmark_data` table
- **Dependency**: `benchmark_data` table must exist

### Database Client
- **File**: `lib/supabase/server.ts`
- **Function**: `createServiceRoleClient()` - Used by all API routes
- **Dependency**: `SUPABASE_SERVICE_ROLE_KEY` must be set

---

## Expected Investigation Time

- **Quick Diagnosis** (checklist): 15-20 minutes
- **Full Investigation** (detailed plan): 45-60 minutes
- **With Documentation**: +15 minutes

---

## Next Steps

1. **Perform Investigation**
   - Use `DATABASE_INVESTIGATION_CHECKLIST.md` for quick check
   - Use `DATABASE_INVESTIGATION_PLAN.md` for detailed investigation

2. **Document Findings**
   - Record actual root cause
   - Note evidence (queries, logs, errors)
   - List affected components

3. **Create Fix Plan** (separate step)
   - Based on findings
   - Step-by-step remediation
   - Test plan

4. **Execute Fixes** (after approval)
   - Implement fixes
   - Verify in production
   - Document resolution

---

## Important Notes

- ⚠️ **No code changes** should be made during investigation (as requested)
- ✅ Focus on **identifying root cause**, not fixing yet
- ✅ Use Supabase SQL Editor for all database queries
- ✅ Check Vercel logs for production runtime errors
- ✅ Compare local vs production systematically

---

## Files Created

1. `DATABASE_INVESTIGATION_PLAN.md` - Comprehensive investigation guide
2. `DATABASE_INVESTIGATION_CHECKLIST.md` - Quick reference checklist
3. `DATABASE_ISSUE_SUMMARY.md` - This summary document

All files located in: `property-fee-calculator/docs/`




