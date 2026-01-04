# Testing Admin Endpoints

## Quick Test Methods

### Method 1: Browser Console (Recommended)

1. **Log in** to https://www.propertycosts.com.au
2. **Open DevTools** (F12 or Right-click → Inspect)
3. **Go to Console tab**
4. **Run this command**:

```javascript
fetch("/api/admin/check")
  .then((r) => r.json())
  .then(console.log);
```

**Expected Output** (if you're an admin):

```json
{
  "loggedIn": true,
  "hasProfile": true,
  "userId": "your-user-id",
  "userEmail": "your-email@example.com",
  "role": "admin",
  "isAdmin": true,
  "message": "You are an admin"
}
```

**If not admin**:

```json
{
  "loggedIn": true,
  "hasProfile": true,
  "userId": "your-user-id",
  "userEmail": "your-email@example.com",
  "role": "user",
  "isAdmin": false,
  "message": "Role is \"user\", not admin"
}
```

**If not logged in**:

```json
{
  "loggedIn": false,
  "message": "Not logged in"
}
```

### Method 2: Direct URL Access

1. **Log in** to https://www.propertycosts.com.au
2. **Open in new tab**: https://www.propertycosts.com.au/api/admin/check
3. **View the JSON response** in your browser

### Method 3: Using Browser Network Tab

1. **Log in** to https://www.propertycosts.com.au
2. **Open DevTools** (F12)
3. **Go to Network tab**
4. **Navigate to**: https://www.propertycosts.com.au/api/admin/check
5. **Click on the request** in the Network tab
6. **View the Response** tab to see the JSON

### Method 4: Using curl (Terminal)

If you have your session cookie:

```bash
curl -H "Cookie: firb-session=YOUR_SESSION_COOKIE" \
  https://www.propertycosts.com.au/api/admin/check
```

To get your session cookie:

1. Open DevTools → Application tab
2. Go to Cookies → https://www.propertycosts.com.au
3. Find `firb-session` cookie
4. Copy its value

## Full Diagnostic Endpoint

For more detailed diagnostics, use the debug endpoint:

```javascript
fetch("/api/admin/debug")
  .then((r) => r.json())
  .then(console.log);
```

This provides:

- Session information
- Profile query results
- Role column existence check
- Table schema information
- Detailed admin check

## Troubleshooting

### Getting 404 Error

- **Wait 2-3 minutes** after deployment for the endpoint to be available
- **Check deployment status** in Vercel dashboard
- **Verify the route exists**: The file should be at `app/api/admin/check/route.ts`

### Getting "Not logged in"

- **Make sure you're logged in** on the website
- **Check cookies**: DevTools → Application → Cookies
- **Try logging out and back in**

### Getting "hasProfile: false"

- Your profile doesn't exist in `user_profiles` table
- **Fix**: Create your profile in Supabase:

```sql
-- Get your user ID first
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Create profile
INSERT INTO user_profiles (id, email, role)
VALUES ('YOUR_USER_ID', 'your-email@example.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

### Getting "role: not set" or "role: user"

- Your role isn't set to admin
- **Fix**: Update your role:

```sql
UPDATE user_profiles
SET role = 'admin', updated_at = NOW()
WHERE email = 'your-email@example.com';
```

### Getting "isAdmin: false"

- Your role is not exactly `'admin'` (case-sensitive)
- **Check**: Run the diagnostic endpoint to see what role you have
- **Fix**: Update role to exactly `'admin'` (lowercase)

## Testing Admin Benchmarks Page

After confirming `isAdmin: true`:

1. **Navigate to**: https://www.propertycosts.com.au/en/admin/benchmarks
2. **Should see**: Admin benchmarks page with three tabs
3. **If redirected**: Check the diagnostic endpoint output for details

## Quick Test Script

Save this as a bookmarklet or run in console:

```javascript
(async () => {
  const response = await fetch("/api/admin/check");
  const data = await response.json();

  console.log("Admin Status:", data);

  if (data.isAdmin) {
    console.log("✅ You have admin access!");
    window.location.href = "/en/admin/benchmarks";
  } else {
    console.log("❌ Admin access denied:", data.message);
    alert(`Admin access denied: ${data.message}`);
  }
})();
```









