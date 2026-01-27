# Database Configuration Investigation Plan

## Overview

This document outlines the investigation plan to diagnose why database operations (user creation, lead creation, benchmarks) work locally but fail in production.

## Investigation Objectives

1. **Determine if local and production use separate Supabase projects/databases**
2. **Identify why user/lead creation fails in production**
3. **Verify if migration scripts were run on production database**
4. **Check environment variable configuration**

---

## Investigation Steps

### Step 1: Verify Database Environment Configuration

#### 1.1 Check Local Environment Variables

**Action**: Check what Supabase project local environment points to

```bash
# Check local .env.local file (if accessible)
cat property-fee-calculator/.env.local | grep SUPABASE
```

**Expected Findings**:
- `NEXT_PUBLIC_SUPABASE_URL` should point to a Supabase project URL
- Note the project ID from the URL (e.g., `https://xxxxx.supabase.co`)

**Questions to Answer**:
- What is the local Supabase project URL?
- What is the local project reference ID?

#### 1.2 Check Production Environment Variables

**Action**: Check Vercel environment variables

**Location**: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**Required Variables to Check**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Questions to Answer**:
- What is the production Supabase project URL?
- Are all three variables set?
- Do the URLs match (should be different for local vs production)?
- Compare the project reference IDs (from URL)

**Expected Result**:
- ✅ Local and production should have **different** Supabase project URLs
- ✅ Both should have all required environment variables set

#### 1.3 Compare Database Projects

**Action**: Log into Supabase dashboard and verify

**Steps**:
1. Go to https://app.supabase.com
2. Check how many projects exist
3. For each project, check:
   - Project name
   - Project reference ID (from Settings → General)
   - Database URL (Settings → Database)

**Questions to Answer**:
- How many Supabase projects exist?
- Which project does local `.env.local` point to?
- Which project does production Vercel env vars point to?
- Are they the same or different?

**Expected Result**:
- ✅ Should have at least 2 projects (one for local/dev, one for production)
- ⚠️ If only 1 project exists → This is likely the root cause

---

### Step 2: Verify Migration Status

#### 2.1 Check Which Migrations Should Have Been Run

**Required Tables** (based on codebase analysis):

1. **Auth System Tables**:
   - `user_profiles` (from `20250112_auth_system_fixed.sql`)
   - `magic_codes` (from `20250112_auth_system_fixed.sql`)
   - `saved_calculations` (from `20250112_auth_system_fixed.sql`)

2. **Application Tables**:
   - `leads` (from `20250115_create_leads_table.sql`)
   - `firb_calculations` (from `20250110_create_firb_calculations.sql`)
   - `benchmark_data` (from `20250117_phase4_benchmark_data.sql`)
   - `cost_benchmarks` (from `20250118_create_cost_benchmarks.sql`)
   - `macro_benchmarks` (from `20250118_create_macro_benchmarks.sql`)

3. **Supporting Migrations**:
   - `20250114_fix_rls_policies.sql` (RLS policy fixes)
   - `20250118_fix_user_profiles_auth_reference.sql` (Foreign key fix)
   - `20250118_add_role_to_user_profiles.sql` (Admin role support)

#### 2.2 Check Local Database Schema

**Action**: Run SQL queries in local Supabase project SQL Editor

**SQL Query 1: List All Tables**
```sql
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**SQL Query 2: Check for Required Tables**
```sql
SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN '✓' ELSE '✗' END AS user_profiles,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'magic_codes') THEN '✓' ELSE '✗' END AS magic_codes,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leads') THEN '✓' ELSE '✗' END AS leads,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'firb_calculations') THEN '✓' ELSE '✗' END AS firb_calculations,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'benchmark_data') THEN '✓' ELSE '✗' END AS benchmark_data,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cost_benchmarks') THEN '✓' ELSE '✗' END AS cost_benchmarks,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'macro_benchmarks') THEN '✓' ELSE '✗' END AS macro_benchmarks,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'saved_calculations') THEN '✓' ELSE '✗' END AS saved_calculations;
```

**SQL Query 3: Check Table Row Counts (Local)**
```sql
SELECT 
    'user_profiles' as table_name, COUNT(*) as row_count FROM user_profiles
UNION ALL
SELECT 'leads', COUNT(*) FROM leads
UNION ALL
SELECT 'magic_codes', COUNT(*) FROM magic_codes
UNION ALL
SELECT 'firb_calculations', COUNT(*) FROM firb_calculations
UNION ALL
SELECT 'benchmark_data', COUNT(*) FROM benchmark_data;
```

**Questions to Answer**:
- Which tables exist in local database?
- Do all required tables exist?
- Are there any users/leads in local database?

#### 2.3 Check Production Database Schema

**Action**: Run the same SQL queries in production Supabase project SQL Editor

**Important**: Make sure you're logged into the **correct** Supabase project (the one production points to)

**Questions to Answer**:
- Which tables exist in production database?
- Are all required tables present?
- If tables exist, are they empty or populated?

**Expected Result**:
- ✅ Production should have all the same tables as local
- ⚠️ If production is missing tables → Migrations were not run

#### 2.4 Compare Local vs Production Schema

**Action**: Compare results from Step 2.2 and 2.3

**Questions to Answer**:
- Are the table structures identical?
- Are there differences in columns?
- Are there differences in constraints (foreign keys, indexes)?

---

### Step 3: Test Database Connectivity

#### 3.1 Test Local Database Connection

**Action**: Verify local environment can connect to Supabase

**Method**: Check application logs or test via API

**Expected**: 
- ✅ Local operations work (as stated by user)

#### 3.2 Test Production Database Connection

**Action**: Verify production environment can connect to Supabase

**Method 1: Check Vercel Logs**
- Go to Vercel Dashboard → Latest Deployment → Logs
- Look for errors related to:
  - "Failed to connect to database"
  - "Environment variable not set"
  - "PGRST116" (row not found)
  - "relation does not exist" (table missing)

**Method 2: Test Production API Endpoints**

Test the leads endpoint:
```bash
curl -X POST https://your-production-url.com/api/leads \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Expected Response**:
- Success (201) if working
- Error (500) with details if failing

**Method 3: Check Browser Console**

On production site, open browser console and check for:
- Network errors to `/api/leads`, `/api/auth/*`
- Error messages in console logs

**Questions to Answer**:
- Can production connect to Supabase?
- What specific error messages appear?
- Are environment variables being read correctly?

---

### Step 4: Verify User Creation Flow

#### 4.1 Understand User Creation Process

**From Code Analysis** (`app/api/auth/verify-code/route.ts`):

1. User enters email and receives magic code
2. User verifies code
3. System checks for existing `user_profiles` record by email
4. If not found, creates new record in `user_profiles` table
5. Creates JWT session token

**Questions to Answer**:
- Does the `user_profiles` table exist in production?
- Does the code successfully find/create the profile?
- Where does the process fail?

#### 4.2 Check Production Error Logs

**Action**: Review Vercel logs during login attempt

**Look For**:
- Errors in `/api/auth/verify-code` endpoint
- Errors in `/api/auth/session` endpoint
- Database connection errors
- "PGRST116" errors (row not found)
- "relation does not exist" (table missing)
- Foreign key constraint errors

**Common Error Patterns**:

1. **Table Doesn't Exist**:
   ```
   relation "user_profiles" does not exist
   ```
   → Migration not run

2. **Foreign Key Error**:
   ```
   insert or update on table "user_profiles" violates foreign key constraint
   ```
   → Table structure issue (references auth.users which doesn't exist)

3. **RLS Policy Blocking**:
   ```
   new row violates row-level security policy
   ```
   → RLS policies not configured correctly

4. **Connection Error**:
   ```
   Failed to connect to database
   ```
   → Environment variables incorrect or network issue

---

### Step 5: Verify Lead Creation Flow

#### 5.1 Understand Lead Creation Process

**From Code Analysis** (`app/api/leads/route.ts`):

1. POST request with email
2. Uses `createServiceRoleClient()` (bypasses RLS)
3. Inserts into `leads` table
4. Handles duplicate email errors gracefully

**Questions to Answer**:
- Does the `leads` table exist in production?
- What error occurs when creating a lead?
- Is the service role key configured correctly?

#### 5.2 Test Lead Creation in Production

**Action**: Attempt to create a lead via production API

**Expected Errors**:
- If table missing: "relation 'leads' does not exist"
- If RLS blocking: "new row violates row-level security policy"
- If duplicate: Should return 200 with "Email already registered"

---

### Step 6: Verify Benchmarks Access

#### 6.1 Understand Benchmarks Access

**From Code Analysis** (`app/api/benchmarks/route.ts`):

1. Queries `benchmark_data` table
2. Uses service role client
3. Returns benchmark data by state/suburb

**Questions to Answer**:
- Does `benchmark_data` table exist in production?
- Is it populated with data?
- Can the API query it successfully?

---

## Diagnostic Checklist

Use this checklist to systematically verify each component:

### Environment Configuration
- [ ] Local `.env.local` has `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Local `.env.local` has `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Local `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Production Vercel has `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Production Vercel has `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Production Vercel has `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Local and production point to **different** Supabase projects

### Database Structure (Local)
- [ ] `user_profiles` table exists
- [ ] `magic_codes` table exists
- [ ] `leads` table exists
- [ ] `firb_calculations` table exists
- [ ] `benchmark_data` table exists
- [ ] `cost_benchmarks` table exists
- [ ] `macro_benchmarks` table exists
- [ ] `saved_calculations` table exists

### Database Structure (Production)
- [ ] `user_profiles` table exists
- [ ] `magic_codes` table exists
- [ ] `leads` table exists
- [ ] `firb_calculations` table exists
- [ ] `benchmark_data` table exists
- [ ] `cost_benchmarks` table exists
- [ ] `macro_benchmarks` table exists
- [ ] `saved_calculations` table exists

### Table Structure Issues
- [ ] `user_profiles` does NOT have foreign key to `auth.users`
- [ ] `user_profiles.id` has default UUID generation
- [ ] RLS policies allow service role access

### Data Presence
- [ ] Local has test users in `user_profiles`
- [ ] Local has test leads in `leads`
- [ ] Production may have users (check after login attempts)
- [ ] Production may have leads (check after submission attempts)

---

## Expected Findings & Root Causes

### Scenario 1: Single Database Project

**Finding**: Local and production both point to the same Supabase project

**Root Cause**: No separate production database configured

**Impact**: 
- All data mixed between environments
- Local testing affects production data
- Migration conflicts possible

**Solution**: Create separate production Supabase project and update Vercel env vars

---

### Scenario 2: Migrations Not Run on Production

**Finding**: Production database is missing required tables

**Root Cause**: Migrations were only run on local database

**Impact**:
- User creation fails (table doesn't exist)
- Lead creation fails (table doesn't exist)
- Benchmarks fail (table doesn't exist)

**Solution**: Run all migrations on production database

---

### Scenario 3: Environment Variables Not Set

**Finding**: Production Vercel env vars are missing or incorrect

**Root Cause**: Environment variables not configured during deployment

**Impact**:
- Cannot connect to database
- Service role operations fail
- Authentication fails

**Solution**: Add/update environment variables in Vercel

---

### Scenario 4: Table Structure Mismatch

**Finding**: Production tables exist but have different structure (e.g., foreign key to auth.users)

**Root Cause**: Old migration run, fix migrations not applied

**Impact**:
- Foreign key errors on insert
- User creation fails
- RLS policies blocking operations

**Solution**: Run fix migrations (`20250118_fix_user_profiles_auth_reference.sql`, `20250114_fix_rls_policies.sql`)

---

### Scenario 5: RLS Policies Blocking

**Finding**: Tables exist but RLS policies prevent inserts

**Root Cause**: RLS policies not configured for service role access

**Impact**:
- All inserts blocked
- Service role client cannot insert

**Solution**: Run RLS fix migration (`20250114_fix_rls_policies.sql`)

---

## Verification Queries for Production

Run these queries in production Supabase SQL Editor to diagnose:

### Query 1: Check Table Existence
```sql
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('user_profiles', 'magic_codes', 'leads', 'firb_calculations', 
                           'benchmark_data', 'cost_benchmarks', 'macro_benchmarks', 'saved_calculations')
        THEN 'REQUIRED'
        ELSE 'OPTIONAL'
    END as status
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

### Query 2: Check user_profiles Structure
```sql
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;
```

### Query 3: Check for Foreign Key to auth.users
```sql
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'user_profiles'
  AND ccu.table_name = 'auth.users';
```
**Expected**: Should return 0 rows (no foreign key to auth.users)

### Query 4: Check RLS Status
```sql
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'leads', 'magic_codes')
ORDER BY tablename;
```

### Query 5: Check RLS Policies
```sql
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'leads')
ORDER BY tablename, policyname;
```

### Query 6: Test Insert Permission (Dry Run)
```sql
-- This won't actually insert, just check permissions
-- Replace with actual test if needed
SELECT 
    has_table_privilege('anon', 'leads', 'INSERT') as anon_can_insert,
    has_table_privilege('authenticated', 'leads', 'INSERT') as auth_can_insert,
    has_table_privilege('service_role', 'leads', 'INSERT') as service_role_can_insert;
```

---

## Next Steps After Investigation

Based on findings, document:

1. **Root Cause**: What is the actual problem?
2. **Evidence**: What queries/logs support this?
3. **Solution**: What needs to be fixed?
4. **Action Items**: Specific steps to resolve

---

## Notes

- This investigation should be performed **without modifying code** (as requested)
- All findings should be documented
- Focus on identifying the root cause, not fixing it yet
- Use Supabase dashboard SQL Editor for all database queries
- Check Vercel logs for production runtime errors












