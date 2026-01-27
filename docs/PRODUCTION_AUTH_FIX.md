# Production Authentication Fix Guide

## Problem

Authentication works locally but fails in production.

## Common Causes

### 1. JWT_SECRET Mismatch

**Symptom**: Token verification fails in production
**Check**: Vercel environment variables
**Fix**: Ensure `JWT_SECRET` is set and matches (or is different but consistent)

### 2. Cookie Domain/Path Issues

**Symptom**: Cookie not being set or read
**Check**: Cookie domain in production vs localhost
**Fix**: Ensure cookie domain is correct for production

### 3. Secure Flag on HTTP

**Symptom**: Cookie not being set (only in production)
**Check**: `secure: process.env.NODE_ENV === "production"`
**Fix**: Should be `true` in production (HTTPS), `false` in local (HTTP)

### 4. Environment Variables Missing

**Symptom**: Various errors
**Check**: All required env vars in Vercel
**Fix**: Add missing variables

## Diagnostic Steps

### Step 1: Check Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Select project: `property-fee-calculator`
3. Go to: **Settings** → **Environment Variables**
4. Verify these are set:
   - `JWT_SECRET` (required)
   - `NEXT_PUBLIC_SUPABASE_URL` (if using Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (if using Supabase)
   - `SUPABASE_SERVICE_ROLE_KEY` (if using Supabase)
   - `RESEND_API_KEY` (for email codes)
   - `NODE_ENV` (should be `production` in production)

### Step 2: Test Cookie Setting in Production

Run this in production browser console:

```javascript
fetch("/api/auth/test-cookie", { credentials: "include" })
  .then((r) => r.json())
  .then((data) => {
    console.log("Cookie test:", data);
    console.log("Set-Cookie headers:", data.diagnostics.setCookieHeaders);
  });
```

**Expected**: Should see `Set-Cookie` headers

### Step 3: Check Production Logs

1. Go to Vercel Dashboard → Latest Deployment → Logs
2. Look for:
   - `"Verify code - Set-Cookie header: PRESENT/MISSING"`
   - `"verifySession - Token verification failed"`
   - Any JWT_SECRET errors

### Step 4: Verify JWT_SECRET

The JWT_SECRET must be:

- Set in Vercel environment variables
- Same value used for both creating and verifying tokens
- A secure random string (not the default)

**Generate a secure secret**:

```bash
openssl rand -base64 32
```

**Set in Vercel**:

1. Go to Settings → Environment Variables
2. Add `JWT_SECRET` with the generated value
3. Select "Production" environment
4. Redeploy

## Quick Fixes

### Fix 1: Ensure JWT_SECRET is Set

```bash
# Generate a secure secret
openssl rand -base64 32

# Then add to Vercel:
# Settings → Environment Variables → Add JWT_SECRET
```

### Fix 2: Verify Cookie Settings

The cookie should be set with:

- `secure: true` in production (HTTPS only)
- `sameSite: "lax"` (allows same-site requests)
- `path: "/"` (available site-wide)
- No explicit `domain` (defaults to current domain)

### Fix 3: Check Production URL

Ensure the production URL matches:

- Cookie domain should match your domain
- No trailing slashes
- Correct protocol (https://)

## Testing After Fix

1. **Clear all cookies** for production domain
2. **Log in** via production site
3. **Check Application tab** → Cookies → Should see `firb-session`
4. **Test session API**:
   ```javascript
   fetch("/api/auth/session", { credentials: "include" })
     .then((r) => r.json())
     .then(console.log);
   ```

## Most Likely Issue

Based on "works locally but not production", the most common cause is:

**JWT_SECRET not set or different in production**

The token is created with one secret locally, but production tries to verify with a different (or missing) secret.

## Solution

1. **Generate a new JWT_SECRET**:

   ```bash
   openssl rand -base64 32
   ```

2. **Add to Vercel**:
   - Settings → Environment Variables
   - Name: `JWT_SECRET`
   - Value: (paste generated secret)
   - Environment: Production (and Preview if needed)

3. **Redeploy**:
   - Vercel will automatically redeploy, or
   - Trigger a new deployment manually

4. **Test**:
   - Users will need to log in again (old tokens won't work)
   - New tokens will be created with the correct secret

## Verification

After setting JWT_SECRET, check Vercel logs for:

- No more "JWT_SECRET must be set" warnings
- `"verifySession - Token verified successfully"` messages
- Session API returning `authenticated: true`











