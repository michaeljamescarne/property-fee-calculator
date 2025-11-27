# Authentication System Setup Guide

This guide walks you through setting up the passwordless authentication system for the FIRB Calculator.

## Overview

The authentication system includes:

- ✅ Passwordless email authentication (magic codes)
- ✅ User profiles and session management
- ✅ Saved calculations dashboard
- ✅ JWT-based sessions
- ⏸️ Paywall infrastructure (prepared but inactive)

## Prerequisites

- Node.js and npm installed
- Supabase account (free tier is sufficient)
- Resend API key (already configured)

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in project details:
   - **Name**: `firb-calculator` (or your preferred name)
   - **Database Password**: Generate a secure password (save it!)
   - **Region**: Choose closest to your users
4. Wait for project to be created (~2 minutes)

## Step 2: Get API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role** key (`SUPABASE_SERVICE_ROLE_KEY`) ⚠️ Keep this secret!

## Step 3: Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/20250112_auth_system.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute the migration
6. Verify tables were created:
   - Go to **Table Editor**
   - You should see: `user_profiles`, `magic_codes`, `saved_calculations`

## Step 4: Configure Environment Variables

1. Create or update `.env.local` file in the project root:

```bash
# Resend API Key (already configured)
RESEND_API_KEY=re_your_resend_api_key_here

# Google Maps API Key (already configured)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Supabase Configuration (ADD THESE)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT Secret for Sessions (GENERATE A NEW ONE)
# Use: openssl rand -base64 32
JWT_SECRET=your-secure-random-32-character-secret-here
```

2. Generate a secure JWT secret:

```bash
openssl rand -base64 32
```

3. **IMPORTANT**: Also add these environment variables to Vercel:
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Add all the Supabase and JWT_SECRET variables
   - Redeploy your project

## Step 5: Install Dependencies

Dependencies are already installed! If you need to reinstall:

```bash
cd property-fee-calculator
npm install
```

Installed packages:

- `@supabase/supabase-js` - Supabase client
- `@supabase/ssr` - Server-side rendering support
- `jose` - JWT token handling

## Step 6: Test Authentication Flow

1. Start the development server:

```bash
npm run dev
```

2. Open [http://localhost:3000/en](http://localhost:3000/en)

3. Click the **Login** button in the navigation

4. Enter your email address

5. Check your email for the 6-digit code

6. Enter the code to authenticate

7. You should see your email in the navigation dropdown

8. Try running a FIRB calculation and saving it

9. Click **Dashboard** to view saved calculations

## Step 7: Verify Database

1. Go to Supabase **Table Editor**
2. Check `user_profiles` - should have your user record
3. Check `saved_calculations` - should show any calculations you saved
4. Check `magic_codes` - should show recent authentication codes

## Security Checklist

- [ ] JWT_SECRET is a strong random value (32+ characters)
- [ ] SUPABASE_SERVICE_ROLE_KEY is never exposed to client-side code
- [ ] Environment variables are set in Vercel
- [ ] Row Level Security (RLS) is enabled on all tables
- [ ] RLS policies are correctly configured (auto-configured in migration)

## Troubleshooting

### "Unauthorized" errors

- Check that JWT_SECRET is set correctly
- Verify cookies are being set (check browser DevTools → Application → Cookies)
- Clear cookies and try logging in again

### Email not sending

- Check RESEND_API_KEY is valid
- Check Resend dashboard for delivery status
- Verify email is not in spam folder

### Database errors

- Verify migration was run successfully
- Check Supabase logs (Database → Logs)
- Ensure RLS policies allow user operations

### "Failed to fetch user profile"

- Check user_profiles table exists
- Verify trigger `on_auth_user_created` is active
- Check Supabase logs for errors

## Features Enabled

### ✅ Currently Active

- Passwordless email authentication
- User profiles and sessions
- Saved calculations
- User dashboard
- Auth-protected routes

### ⏸️ Prepared But Inactive

- Paywall/content locking (set `PAYWALL_CONFIG.enabled = true` in `lib/features/paywall.ts`)
- Payment integration placeholders
- Usage limits tracking

## Next Steps

### When Ready for Paywall

1. Review `lib/features/paywall.ts`
2. Set `enabled: true` in PAYWALL_CONFIG
3. Integrate payment provider (Stripe/Paddle)
4. Update paywall components to handle payment flow

### Optional Enhancements

- Email templates customization (`emails/MagicCodeEmail.tsx`)
- Dashboard analytics
- Export calculations to PDF
- Sharing calculations via URL
- Email notifications for saved calculations

## Support

For issues:

1. Check Supabase logs (Dashboard → Logs)
2. Check browser console for errors
3. Review network requests in DevTools
4. Check the migration ran successfully

## Cost Estimate

**Free Tier Limits:**

- Supabase: 500MB database, 2GB bandwidth, 50K MAU
- Resend: 3,000 emails/month
- **Total**: $0/month for MVP stage

You'll only need to upgrade when you exceed these limits.
