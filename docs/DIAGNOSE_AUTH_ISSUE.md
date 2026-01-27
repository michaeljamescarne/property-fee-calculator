# Diagnose Authentication Issue

## Quick Diagnostic

After deployment, run this in your browser console on the production site:

```javascript
fetch("/api/auth/diagnose", { credentials: "include" })
  .then((r) => r.json())
  .then((data) => {
    console.log("=== AUTH DIAGNOSTIC ===");
    console.log("Summary:", data.summary);
    console.log("Full diagnostics:", data.diagnostics);
  });
```

This will show you **exactly** where the auth flow is failing.

## What to Check

### 1. Cookie Present?

```javascript
data.diagnostics.step1_cookieHeader.present;
```

- `true`: Cookie is being sent with request ✅
- `false`: Cookie not being sent ❌ → Check cookie setting in verify-code

### 2. Token Extracted?

```javascript
data.diagnostics.step2_tokenExtraction.success;
```

- `true`: Token found in cookie ✅
- `false`: Token not in cookie ❌ → Cookie might be corrupted or not set

### 3. Session Verified?

```javascript
data.diagnostics.step3_sessionVerification.hasSession;
```

- `true`: JWT token is valid ✅
- `false`: JWT token invalid ❌ → Check JWT_SECRET mismatch

### 4. Profile Exists?

```javascript
data.diagnostics.step4_databaseCheck.hasProfile;
```

- `true`: User profile found ✅
- `false`: Profile missing ❌ → Check database or run migration

### 5. Auto-Create Attempted?

```javascript
data.diagnostics.step5_autoCreate;
```

- Shows if profile creation was attempted and any errors

### 6. Environment Variables?

```javascript
data.diagnostics.step6_environment;
```

- Check if all required env vars are set

## Common Issues and Fixes

### Issue: Cookie Not Present

**Symptom**: `step1_cookieHeader.present = false`
**Fix**:

- Check Network tab → `/api/auth/verify-code` → Response Headers
- Look for `Set-Cookie` header
- Verify cookie is being set correctly

### Issue: Token Not Extracted

**Symptom**: `step2_tokenExtraction.success = false`
**Fix**:

- Cookie might be malformed
- Check cookie value in Application tab
- Verify cookie name matches `firb-session`

### Issue: Session Verification Failed

**Symptom**: `step3_sessionVerification.hasSession = false`
**Fix**:

- **Most likely**: JWT_SECRET mismatch
- Check Vercel environment variables
- Ensure JWT_SECRET is set and matches
- Token might be expired (check token expiry)

### Issue: Profile Missing

**Symptom**: `step4_databaseCheck.hasProfile = false`
**Fix**:

- Run the migration: `20250118_fix_user_profiles_auth_reference.sql`
- Check if `user_profiles` table exists
- Verify table structure (no foreign key to auth.users)
- Check auto-create attempt in `step5_autoCreate`

### Issue: Auto-Create Failed

**Symptom**: `step5_autoCreate.success = false`
**Fix**:

- Check error in `step5_autoCreate.error`
- Common errors:
  - Foreign key constraint (run migration)
  - RLS policy blocking (check RLS policies)
  - Missing required fields

## Next Steps

1. **Run the diagnostic** and share the output
2. **Check Vercel logs** for any server-side errors
3. **Verify migration** has been run in production Supabase
4. **Check environment variables** in Vercel dashboard

The diagnostic will pinpoint exactly where the issue is.











