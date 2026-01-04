# Comprehensive Cookie Debugging Guide

## Root Cause Analysis

After reviewing the code and Next.js documentation, I've identified the core issue:

**The Problem**: `response.cookies.set()` in Next.js API routes may not always work reliably, especially when combined with `NextResponse.json()`. The cookie might be set on the response object but not actually sent in the HTTP response headers.

## The Solution

I've implemented a **dual approach**:

1. **Manual Set-Cookie header** - Build the cookie string manually and add it to response headers
2. **Cookies API backup** - Also use `response.cookies.set()` as a fallback

## Testing Steps

### Step 1: Test Cookie Setting

After deployment, test the cookie setting:

```javascript
// In browser console
fetch("/api/auth/test-cookie", { credentials: "include" })
  .then((r) => r.json())
  .then((data) => {
    console.log("Cookie test result:", data);
    console.log("Set-Cookie headers:", data.diagnostics.setCookieHeaders);
  });
```

**Expected**: Should see `Set-Cookie` headers in the response.

### Step 2: Test Login Flow

1. **Clear all cookies** for `propertycosts.com.au`
2. **Log in** via the login modal
3. **Check Network tab**:
   - Find `/api/auth/verify-code` request
   - Check **Response Headers** → `Set-Cookie`
   - Should see: `firb-session=eyJ...` with proper attributes

4. **Check Application tab**:
   - Go to **Cookies** → `https://www.propertycosts.com.au`
   - Look for `firb-session` cookie
   - **Note**: HttpOnly cookies won't appear in `document.cookie`, but should appear in Application tab

### Step 3: Verify Cookie is Read

```javascript
// Test session API
fetch("/api/auth/session", { credentials: "include" })
  .then((r) => r.json())
  .then((data) => {
    console.log("Session check:", data);
    console.log("Authenticated:", data.authenticated);
  });
```

**Expected**: Should return `{ authenticated: true, user: {...} }`

## Common Issues and Fixes

### Issue 1: Cookie Not Appearing in Browser

**Possible Causes**:

- Cookie domain mismatch
- Secure flag on non-HTTPS
- SameSite policy blocking
- Browser blocking third-party cookies

**Fix**: Check cookie attributes match your environment:

- `Secure`: Only `true` in production (HTTPS)
- `SameSite`: `Lax` (allows same-site requests)
- `Path`: `/` (available site-wide)
- `Domain`: Should match your domain (or omit for current domain)

### Issue 2: Cookie Set But Not Read

**Possible Causes**:

- Cookie expired immediately
- Path mismatch
- Domain mismatch
- HttpOnly flag preventing JavaScript access (this is expected!)

**Fix**: HttpOnly cookies can't be read by `document.cookie`, but they should still be sent with requests. Use the session API to verify.

### Issue 3: Session API Returns `authenticated: false`

**Possible Causes**:

- Cookie not being sent with request
- Cookie expired
- JWT secret mismatch
- Cookie value corrupted

**Fix**: Check:

1. Request includes `credentials: 'include'`
2. Cookie exists in Application tab
3. Cookie hasn't expired
4. JWT_SECRET matches between environments

## Debugging Checklist

- [ ] Cookie appears in Application → Cookies tab
- [ ] Cookie has correct attributes (HttpOnly, Secure, SameSite, Path)
- [ ] `Set-Cookie` header present in Network tab for `/api/auth/verify-code`
- [ ] Session API returns `authenticated: true` when cookie exists
- [ ] Cookie persists after page reload
- [ ] Cookie is sent with subsequent requests (check Network tab)

## Next Steps

If the cookie still isn't working after this fix:

1. **Check Vercel logs** for the `verify-code` route
2. **Verify environment variables** (JWT_SECRET, NODE_ENV)
3. **Test in incognito mode** to rule out browser extensions
4. **Check browser console** for CORS or security errors
5. **Verify domain** - ensure cookie domain matches your site domain

## Alternative Approach (If Still Failing)

If cookies still don't work, consider:

1. **Using localStorage + API token** (less secure, but works)
2. **Using Supabase Auth** (built-in session management)
3. **Using middleware** to set cookies (runs before API routes)

But the current approach should work - the manual Set-Cookie header ensures the cookie is sent regardless of Next.js API route limitations.









