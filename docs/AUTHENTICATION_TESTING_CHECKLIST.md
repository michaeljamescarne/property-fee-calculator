# Authentication Testing Checklist

This document outlines the testing steps to validate the authentication fixes implemented in Phase 8.

## Test Endpoints Created

1. **`/api/auth/test-cookie`** - Tests cookie setting and reading capabilities
2. **`/api/auth/debug-session`** - Provides detailed session debugging information

## Pre-Deployment Checklist

### Environment Variables

- [ ] `JWT_SECRET` is set in Vercel environment variables
- [ ] `JWT_SECRET` is NOT the default value (`your-secret-key-change-this-in-production`)
- [ ] `NODE_ENV` is set to `production` in production

### Local Testing

#### 1. Test Cookie Setting

```bash
# Start the dev server
npm run dev

# Test the cookie endpoint (before login)
curl http://localhost:3000/api/auth/test-cookie

# Expected: Should show cookie options, no session cookie found
```

#### 2. Test Login Flow

1. Navigate to `http://localhost:3000/en/calculator`
2. Click "Login" button
3. Enter email address
4. Enter 6-digit code from email
5. Verify:
   - [ ] Cookie is set (check browser DevTools > Application > Cookies)
   - [ ] Cookie has correct attributes:
     - [ ] `httpOnly: true`
     - [ ] `secure: false` (in local, true in production)
     - [ ] `sameSite: Lax`
     - [ ] `path: /`
     - [ ] Domain: not set (defaults to localhost)
   - [ ] User is redirected to dashboard
   - [ ] Login button disappears
   - [ ] User email is visible in dashboard

#### 3. Test Session API

```bash
# After logging in, test session endpoint
curl -H "Cookie: firb-session=YOUR_TOKEN" http://localhost:3000/api/auth/session

# Or use browser console:
fetch('/api/auth/session', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log)

# Expected: { authenticated: true, user: {...} }
```

#### 4. Test Debug Endpoints

```bash
# Test cookie endpoint
curl http://localhost:3000/api/auth/test-cookie

# Test session debug endpoint (after login)
curl -H "Cookie: firb-session=YOUR_TOKEN" http://localhost:3000/api/auth/debug-session

# Or in browser console:
fetch('/api/auth/debug-session', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log)
```

#### 5. Test Admin Routes

1. Ensure your user has `role: 'admin'` in `user_profiles` table
2. Navigate to an admin route (e.g., `/en/admin`)
3. Verify:
   - [ ] User is NOT redirected to calculator
   - [ ] Admin page loads successfully
   - [ ] User can access admin features

#### 6. Test Cookie Persistence

1. After logging in:
   - [ ] Refresh the page - user should remain logged in
   - [ ] Navigate to different pages - session persists
   - [ ] Close and reopen browser tab - session persists (cookie has 30-day expiry)

#### 7. Test Logout

1. Click logout button
2. Verify:
   - [ ] Cookie is deleted (check DevTools)
   - [ ] User is redirected to calculator
   - [ ] Login button appears
   - [ ] Session API returns `authenticated: false`

## Production Testing

### 1. Verify Environment Variables

- [ ] Check Vercel dashboard: Settings > Environment Variables
- [ ] `JWT_SECRET` is set and is NOT the default value
- [ ] `NODE_ENV` is `production`

### 2. Test Cookie Domain

1. Log in on `www.propertycosts.com.au`
2. Verify cookie domain is `.propertycosts.com.au` (check DevTools)
3. Navigate to `propertycosts.com.au` (without www)
4. Verify:
   - [ ] User remains logged in
   - [ ] Session API works on both domains

### 3. Test Production Login Flow

1. Navigate to `https://www.propertycosts.com.au/en/calculator`
2. Complete login flow
3. Verify:
   - [ ] Cookie is set with `Secure: true`
   - [ ] Cookie domain is `.propertycosts.com.au`
   - [ ] User is redirected to dashboard
   - [ ] Client-side AuthProvider detects authenticated state
   - [ ] Login button disappears
   - [ ] Admin routes work when logged in

### 4. Test Session API in Production

```javascript
// In browser console on production site:
fetch("/api/auth/session", { credentials: "include" })
  .then((r) => r.json())
  .then(console.log);

// Expected: { authenticated: true, user: {...} }
```

### 5. Test Cookie Reading in Production

```javascript
// In browser console:
fetch("/api/auth/debug-session", { credentials: "include" })
  .then((r) => r.json())
  .then(console.log);

// Check the response:
// - step1_requestHeaders: Should show cookie header
// - step2_parsedCookies: Should show firb-session cookie
// - step3_tokenValidation: Should show valid token format
// - step4_tokenVerification: Should show successful verification
// - step5_helperFunction: Should show session found
```

### 6. Test Client-Side Auth State

1. After logging in, check browser console for:
   - [ ] No errors related to session
   - [ ] `AuthProvider` shows `isAuthenticated: true`
   - [ ] User object is populated

2. Refresh the page:
   - [ ] User remains logged in
   - [ ] No flash of "logged out" state

### 7. Test API Routes in Production

Test that all API routes can read the session:

- [ ] `/api/calculations/list` - Returns user's calculations
- [ ] `/api/calculations/save` - Saves calculation successfully
- [ ] `/api/admin/check` - Returns admin status
- [ ] `/api/auth/session` - Returns authenticated state

## Common Issues and Solutions

### Issue: Cookie not being set

**Symptoms:** Login succeeds but cookie is not in browser
**Check:**

1. Verify `Set-Cookie` header in Network tab
2. Check cookie domain matches current domain
3. Verify `Secure` flag matches (true in production, false in local)
4. Check browser console for cookie-related errors

### Issue: Session API returns `authenticated: false`

**Symptoms:** Cookie exists but session API can't read it
**Check:**

1. Use `/api/auth/debug-session` to see detailed info
2. Verify cookie is being sent in request (check `step1_requestHeaders`)
3. Verify token format is valid (check `step3_tokenValidation`)
4. Verify JWT_SECRET matches between environments

### Issue: Client-side shows logged out but server-side works

**Symptoms:** Dashboard shows user email but login button is visible
**Check:**

1. Verify `AuthProvider` is calling `/api/auth/session`
2. Check Network tab - is session API returning correct response?
3. Verify `credentials: "include"` is set in fetch requests
4. Check for CORS issues

### Issue: Admin routes redirect even when logged in

**Symptoms:** User is logged in but admin routes redirect
**Check:**

1. Verify user has `role: 'admin'` in database
2. Check `/api/admin/check` endpoint
3. Verify `requireAdmin()` function is reading session correctly

## Validation Checklist Summary

- [ ] Cookie is set with correct attributes in production
- [ ] Cookie domain works for both www and non-www
- [ ] Session API can read cookie from request headers
- [ ] JWT verification succeeds with production JWT_SECRET
- [ ] Client-side AuthProvider detects authenticated state
- [ ] Admin routes work when logged in
- [ ] Cookie persists across page reloads
- [ ] Cookie is sent with all API requests (credentials: "include")
- [ ] Logout properly clears cookie
- [ ] All API routes can read session correctly

## Next Steps After Testing

1. Monitor Vercel logs for any authentication errors
2. Check browser console for client-side errors
3. Verify production metrics (login success rate, session duration)
4. Remove or secure debug endpoints if needed (consider adding authentication to debug endpoints)











