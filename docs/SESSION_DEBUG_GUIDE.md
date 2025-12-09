# Session Debugging Guide

## Problem

- Cookie appears to be set ✅
- Dashboard shows "Welcome back, [email]" ✅ (server-side works)
- Navigation still shows "Login" button ❌ (client-side doesn't work)
- Admin portal redirects ❌ (server-side check fails)

## Step 1: Check Browser Console Logs

### Open Browser DevTools

1. **Open the website**: https://www.propertycosts.com.au/en/dashboard
2. **Open DevTools**: Press `F12` or Right-click → Inspect
3. **Go to Console tab**

### Look for These Logs

You should see logs like:

- `"Session check response: { authenticated: false, hasUser: false }"`
- `"DashboardClient - Auth state: { isAuthenticated: false }"`
- `"Session API - Cookie header present: true/false"`
- `"Session API - Session found: true/false"`

**Copy all console logs** and share them.

## Step 2: Check Network Tab

### Check Session API Request

1. **Go to Network tab** in DevTools
2. **Filter by**: `session` or `auth`
3. **Find the request**: `/api/auth/session`
4. **Click on it** to see details

### Check Request Headers

Look for:

- **Request Headers** → `Cookie: firb-session=...`
- If missing, the cookie isn't being sent

### Check Response

Look for:

- **Response** tab → Should show `{ authenticated: true/false, user: ... }`
- **Status Code**: Should be `200`

**Take a screenshot** or copy the request/response details.

## Step 3: Check Cookies

### Verify Cookie Exists

1. **Go to Application tab** (or Storage tab)
2. **Click Cookies** → `https://www.propertycosts.com.au`
3. **Look for**: `firb-session`

### Check Cookie Properties

The cookie should have:

- **Name**: `firb-session`
- **Value**: A long JWT token (starts with `eyJ...`)
- **Domain**: `propertycosts.com.au` (or `.propertycosts.com.au`)
- **Path**: `/`
- **HttpOnly**: ✅ (checked)
- **Secure**: ✅ (checked in production)
- **SameSite**: `Lax`

**Take a screenshot** or note the cookie details.

## Step 4: Test Session API Directly

### Run in Browser Console

```javascript
// Test 1: Check if cookie is being sent
fetch("/api/auth/session", {
  credentials: "include",
  headers: {
    "Cache-Control": "no-cache",
  },
})
  .then((r) => {
    console.log("Response status:", r.status);
    console.log("Response headers:", [...r.headers.entries()]);
    return r.json();
  })
  .then((data) => {
    console.log("Session data:", data);
  })
  .catch((err) => console.error("Error:", err));
```

**Copy the output** and share it.

## Step 5: Check Server Logs (Vercel)

### Access Vercel Logs

1. **Go to**: https://vercel.com/dashboard
2. **Select your project**: `property-fee-calculator`
3. **Go to**: **Deployments** tab
4. **Click on the latest deployment**
5. **Go to**: **Functions** tab or **Logs** tab

### Look for These Log Messages

Search for:

- `"Session API - Cookie header present"`
- `"Session API - Session found"`
- `"requireAdmin - Session check"`
- `"requireAdmin - Profile data"`
- `"Admin check failed"`

**Copy relevant log entries** and share them.

## Step 6: Test Admin Check Directly

### Run in Browser Console

```javascript
// Test admin check
fetch("/api/admin/check", {
  credentials: "include",
})
  .then((r) => r.json())
  .then((data) => {
    console.log("Admin check result:", data);
  })
  .catch((err) => console.error("Error:", err));
```

**Copy the output** and share it.

## Step 7: Manual Cookie Test

### Check Cookie Value

```javascript
// Get cookie value
document.cookie.split(";").find((c) => c.includes("firb-session"));
```

**Copy the output** (or note if it's empty).

### Test with Cookie in Header

```javascript
// Get cookie value manually
const cookieValue = document.cookie
  .split("; ")
  .find((row) => row.startsWith("firb-session="))
  ?.split("=")[1];

if (cookieValue) {
  console.log("Cookie found:", cookieValue.substring(0, 50) + "...");

  // Test session API with explicit cookie
  fetch("/api/auth/session", {
    credentials: "include",
    headers: {
      Cookie: `firb-session=${cookieValue}`,
    },
  })
    .then((r) => r.json())
    .then(console.log);
} else {
  console.log("No cookie found!");
}
```

**Copy the output** and share it.

## Step 8: Check for CORS/Headers Issues

### Test with Full Request Details

```javascript
// Full diagnostic
const testSession = async () => {
  console.log("=== SESSION DEBUG TEST ===");

  // Check cookie
  const cookie = document.cookie.split(";").find((c) => c.includes("firb-session"));
  console.log("1. Cookie in document.cookie:", cookie ? "FOUND" : "NOT FOUND");
  if (cookie) {
    console.log("   Cookie value (first 50 chars):", cookie.substring(0, 50));
  }

  // Test session API
  console.log("2. Testing /api/auth/session...");
  try {
    const response = await fetch("/api/auth/session", {
      credentials: "include",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    console.log("   Response status:", response.status);
    console.log("   Response headers:", Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log("   Response data:", data);

    if (data.authenticated) {
      console.log("   ✅ Session is authenticated!");
      console.log("   User:", data.user?.email);
    } else {
      console.log("   ❌ Session is NOT authenticated");
    }
  } catch (error) {
    console.error("   Error:", error);
  }

  // Test admin check
  console.log("3. Testing /api/admin/check...");
  try {
    const response = await fetch("/api/admin/check", {
      credentials: "include",
    });
    const data = await response.json();
    console.log("   Admin check result:", data);
  } catch (error) {
    console.error("   Error:", error);
  }
};

testSession();
```

**Run this in console** and copy the entire output.

## What to Share

Please share:

1. **Browser Console Output**:
   - All logs from the console (especially session-related)
   - Output from the test scripts above

2. **Network Tab Details**:
   - Screenshot or details of `/api/auth/session` request
   - Request headers (especially Cookie header)
   - Response body

3. **Cookie Details**:
   - Screenshot of the cookie from Application tab
   - Cookie properties (domain, path, httpOnly, secure, sameSite)

4. **Vercel Logs** (if accessible):
   - Any server-side logs related to session or admin checks

5. **Current Behavior**:
   - What page you're on when testing
   - Whether you just logged in or have been on the page for a while

## Quick Diagnostic Script

Copy and paste this entire script into your browser console:

```javascript
(async () => {
  console.log("=== COMPREHENSIVE SESSION DEBUG ===\n");

  // 1. Check cookie
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const sessionCookie = cookies.find((c) => c.startsWith("firb-session="));
  console.log("1. Cookie Check:");
  console.log("   - All cookies:", cookies);
  console.log("   - Session cookie found:", !!sessionCookie);
  if (sessionCookie) {
    const value = sessionCookie.split("=")[1];
    console.log("   - Cookie value length:", value?.length);
    console.log("   - Cookie starts with:", value?.substring(0, 20));
  }
  console.log("");

  // 2. Test session API
  console.log("2. Session API Test:");
  try {
    const res = await fetch("/api/auth/session", {
      credentials: "include",
      cache: "no-store",
    });
    const data = await res.json();
    console.log("   - Status:", res.status);
    console.log("   - Response:", data);
    console.log("   - Authenticated:", data.authenticated);
    console.log("   - Has user:", !!data.user);
  } catch (err) {
    console.error("   - Error:", err);
  }
  console.log("");

  // 3. Test admin check
  console.log("3. Admin Check Test:");
  try {
    const res = await fetch("/api/admin/check", {
      credentials: "include",
    });
    const data = await res.json();
    console.log("   - Response:", data);
  } catch (err) {
    console.error("   - Error:", err);
  }
  console.log("");

  // 4. Check current auth state
  console.log("4. Current Page State:");
  console.log("   - URL:", window.location.href);
  console.log("   - Path:", window.location.pathname);
  console.log("");

  console.log("=== END DEBUG ===");
})();
```

**Run this script** and copy the entire output.



