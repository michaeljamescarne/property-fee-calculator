# Quick Admin Setup - Step by Step

## Step 1: Find Your User ID

Run this query in Supabase SQL Editor (replace `your@email.com` with your actual email):

```sql
-- Find your user ID
SELECT id, email, role
FROM user_profiles
WHERE email = 'your@email.com';
```

**OR** if you don't have a user_profiles record yet, find it from auth.users:

```sql
-- Find from auth.users
SELECT id, email
FROM auth.users
WHERE email = 'your@email.com';
```

## Step 2: Set Admin Role

### Option A: If user_profiles record EXISTS

Replace `YOUR_ACTUAL_USER_ID_HERE` with the UUID from Step 1:

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE id = 'YOUR_ACTUAL_USER_ID_HERE';
```

### Option B: If user_profiles record DOES NOT EXIST

Replace both `YOUR_ACTUAL_USER_ID_HERE` and `your@email.com`:

```sql
INSERT INTO user_profiles (id, email, role)
VALUES ('YOUR_ACTUAL_USER_ID_HERE', 'your@email.com', 'admin')
ON CONFLICT (id)
DO UPDATE SET role = 'admin';
```

## Step 3: Verify

```sql
SELECT id, email, role
FROM user_profiles
WHERE email = 'your@email.com';
```

You should see `role = 'admin'`.

## Complete Example

If your email is `john@example.com` and your user ID is `123e4567-e89b-12d3-a456-426614174000`:

```sql
-- Step 1: Find (optional - just to verify)
SELECT id, email, role FROM user_profiles WHERE email = 'john@example.com';

-- Step 2: Update to admin
UPDATE user_profiles
SET role = 'admin'
WHERE id = '123e4567-e89b-12d3-a456-426614174000';

-- Step 3: Verify
SELECT id, email, role FROM user_profiles WHERE email = 'john@example.com';
```

## Alternative: Set Admin by Email (Easier!)

If you know your email, you can update directly:

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'your@email.com';
```

This is the easiest way - just replace `your@email.com` with your actual email address!
