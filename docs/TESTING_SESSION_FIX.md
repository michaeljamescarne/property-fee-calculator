# Session Cookie Testing Guide

## Prerequisites

✅ Build has passed  
✅ Code is deployed to production  
✅ You have access to Vercel logs

## Step 1: Test Cookie Setting

### 1.1 Clear All Cookies

1. Open DevTools (F12)
2. Go to **Application** tab → **Cookies** → `https://www.propertycosts.com.au`
3. Delete any `firb-session` cookie if it exists
4. Or use **Incognito/Private mode** for a clean test

### 1.2 Test Cookie Endpoint

Run this in the browser console:

```javascript
fetch("/api/auth/test-cookie", { credentials: "include" })
  .then((r) => r.json())
  .then((data) => {
    console.log("=== COOKIE TEST RESULTS ===");
    console.log("Set-Cookie headers:", data.diagnostics.setCookieHeaders);
    console.log("Cookie count:", data.diagnostics.setCookieCount);
    console.log("Has cookie in request:", data.diagnostics.hasCookieInRequest);
    console.log("Cookies API read:", data.diagnostics.cookiesApiRead);
  });
```

**Expected**: Should see `Set-Cookie` headers in the response.

## Step 2: Test Login Flow

### 2.1 Log In

1. Go to: https://www.propertycosts.com.au/en/calculator
2. Click **"Login"** button
3. Enter your email: `michaeljamescarne@gmail.com`
4. Request a code and enter it
5. Click **"Verify Code"**

### 2.2 Check Network Tab

1. Open **Network** tab in DevTools
2. Find the `/api/auth/verify-code` request
3. Click on it to see details
4. Check **Response Headers**:
   - Look for `Set-Cookie: firb-session=...`
   - Should see the cookie with proper attributes

### 2.3 Check Application Tab

1. Go to **Application** tab → **Cookies** → `https://www.propertycosts.com.au`
2. Look for `firb-session` cookie
3. Check its properties:
   - **Name**: `firb-session`
   - **Value**: Should be a long JWT token (starts with `eyJ...`)
   - **Domain**: `propertycosts.com.au`
   - **Path**: `/`
   - **HttpOnly**: ✅ (checked)
   - **Secure**: ✅ (checked in production)
   - **SameSite**: `Lax`
   - **Expires**: Should be ~30 days from now

**If cookie is NOT present**: The cookie setting failed. Check Vercel logs.

## Step 3: Test Session API

### 3.1 Check Session Status

Run this in the browser console:

```javascript
fetch("/api/auth/session", { credentials: "include" })
  .then((r) => {
    console.log("Response status:", r.status);
    return r.json();
  })
  .then((data) => {
    console.log("=== SESSION API RESULTS ===");
    console.log("Authenticated:", data.authenticated);
    console.log("Has user:", !!data.user);
    console.log("Full response:", data);
  });
```

**Expected**: Should return `{ authenticated: true, user: {...} }`

**If `authenticated: false`**: Check Vercel logs for verification errors.

### 3.2 Check Vercel Logs

1. Go to: https://vercel.com/dashboard
2. Select your project: `property-fee-calculator`
3. Go to **Deployments** tab
4. Click on the latest deployment
5. Go to **Functions** tab or **Logs** tab
6. Search for: `"Session API"` or `"verifySession"`

**Look for these log messages**:

- `"Session API - Cookie header present: true"`
- `"getSessionFromRequest - Token found in request"`
- `"verifySession - Token verified successfully"` OR `"verifySession - Token verification failed"`
- If failed, look for the error message

## Step 4: Test Client-Side Auth State

### 4.1 Check Navigation

1. After logging in, check if the **Navigation** shows:
   - Your email address (instead of "Login" button)
   - A dropdown menu with "Dashboard" and "Logout" options

**If still shows "Login"**: The AuthProvider isn't reading the session.

### 4.2 Check Browser Console

Look for these logs:

- `"Session check response: { authenticated: true, hasUser: true }"`
- `"DashboardClient - Auth state: { isAuthenticated: true }"`

**If you see `authenticated: false`**: The session API isn't working.

## Step 5: Test Admin Access

### 5.1 Try Admin Portal

1. Navigate to: https://www.propertycosts.com.au/en/admin/benchmarks
2. Should load the admin interface (not redirect to dashboard)

**If redirects to dashboard**: Check Vercel logs for admin check errors.

### 5.2 Check Admin Status

Run this in the browser console:

```javascript
fetch("/api/admin/check", { credentials: "include" })
  .then((r) => r.json())
  .then((data) => {
    console.log("=== ADMIN CHECK RESULTS ===");
    console.log("Logged in:", data.loggedIn);
    console.log("Has profile:", data.hasProfile);
    console.log("Role:", data.role);
    console.log("Is admin:", data.isAdmin);
    console.log("Full response:", data);
  });
```

**Expected**: Should return `{ loggedIn: true, hasProfile: true, role: "admin", isAdmin: true }`

**If `hasProfile: false` or `role: "not set"`**: The `user_profiles` table might be missing the `role` column or your user isn't set to admin.

## Step 6: Comprehensive Diagnostic

Run this complete diagnostic script:

```javascript
(async () => {
  console.log("=== COMPREHENSIVE SESSION DIAGNOSTIC ===\n");

  // 1. Check cookies
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const sessionCookie = cookies.find((c) => c.startsWith("firb-session="));
  console.log("1. Cookie Check:");
  console.log("   - Session cookie in document.cookie:", sessionCookie ? "FOUND" : "NOT FOUND");
  console.log("   - Note: HttpOnly cookies won't appear in document.cookie");
  console.log("   - Check Application tab → Cookies for HttpOnly cookies\n");

  // 2. Test session API
  console.log("2. Session API Test:");
  try {
    const res = await fetch("/api/auth/session", { credentials: "include" });
    const data = await res.json();
    console.log("   - Status:", res.status);
    console.log("   - Authenticated:", data.authenticated);
    console.log("   - Has user:", !!data.user);
    if (data.user) {
      console.log("   - User email:", data.user.email);
    }
    console.log("   - Full response:", data);
  } catch (err) {
    console.error("   - Error:", err);
  }
  console.log("");

  // 3. Test admin check
  console.log("3. Admin Check Test:");
  try {
    const res = await fetch("/api/admin/check", { credentials: "include" });
    const data = await res.json();
    console.log("   - Full response:", data);
  } catch (err) {
    console.error("   - Error:", err);
  }
  console.log("");

  // 4. Check current page
  console.log("4. Current Page State:");
  console.log("   - URL:", window.location.href);
  console.log("   - Path:", window.location.pathname);
  console.log("");

  console.log("=== END DIAGNOSTIC ===");
  console.log("\nNext: Check Vercel logs for detailed server-side logs");
})();
```

## What to Share

After running all tests, please share:

1. **Cookie Test Results** (Step 1.2)
2. **Network Tab Screenshot** (Step 2.2) - showing Set-Cookie header
3. **Application Tab Screenshot** (Step 2.3) - showing cookie properties
4. **Session API Results** (Step 3.1)
5. **Vercel Logs** (Step 3.2) - especially any errors
6. **Admin Check Results** (Step 5.2)
7. **Comprehensive Diagnostic Output** (Step 6)

## Common Issues and Solutions

### Issue: Cookie Not Set

**Symptoms**: No cookie in Application tab after login
**Check**: Vercel logs for `"Verify code - Set-Cookie header"`
**Solution**: Cookie setting failed, check response headers

### Issue: Cookie Set But Session API Returns `authenticated: false`

**Symptoms**: Cookie exists but session API fails
**Check**: Vercel logs for `"verifySession - Token verification failed"`
**Solution**: Likely JWT_SECRET mismatch or token expired

### Issue: Session API Works But Navigation Shows "Login"

**Symptoms**: API returns authenticated but UI doesn't update
**Check**: Browser console for `"Session check response"`
**Solution**: AuthProvider not refreshing, check client-side code

### Issue: Admin Check Fails

**Symptoms**: `hasProfile: false` or `role: "not set"`
**Check**: Database for `user_profiles.role` column
**Solution**: Run migration or set user role manually

## Next Steps After Testing

Once you've completed all tests, share the results and I'll help diagnose any remaining issues.











