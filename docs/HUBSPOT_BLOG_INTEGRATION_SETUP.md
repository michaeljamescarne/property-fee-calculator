# HubSpot Blog Integration Setup Guide

## Overview

This guide walks you through setting up HubSpot blog integration (Option 2) for tracking blog post views, engagement, and lead capture. This integration works on **HubSpot Free Tier** ✅.

---

## Prerequisites

- HubSpot account (free tier is sufficient)
- Access to HubSpot account settings
- Your HubSpot Portal ID (found in tracking code: `442487843`)

---

## Step 1: Create HubSpot API Access (Choose Your Method)

HubSpot has introduced a new developer platform (version 2025.2), but **legacy private apps are still fully supported** and recommended for simple API integrations like this one.

### Option A: Legacy Private App (Recommended for This Use Case) ✅

**Why Choose This:**
- ✅ Simplest setup for REST API access
- ✅ Still fully supported by HubSpot
- ✅ Perfect for server-side API calls
- ✅ No migration required
- ✅ Works with any programming language

**Setup Steps:**

1. **Log into HubSpot**
   - Go to https://app.hubspot.com
   - Navigate to your account

2. **Access Legacy Apps**
   - Go to **Settings** (gear icon in top right)
   - Navigate to **Development** → **Legacy Apps**
   - Click **Create a private app**

3. **Configure App**
   - **Name**: "Blog Integration" (or any name you prefer)
   - **Description**: "API integration for blog tracking and lead capture"

4. **Set Scopes (Permissions)**
   - Under **Scopes**, select:
     - ✅ **Events** → `events.send` (for tracking blog views)
     - ✅ **Contacts** → `contacts.write` (for creating/updating contacts)
     - ✅ **Forms** → `forms.read` (for reading form data)
   - Click **Continue**

5. **Get Access Token**
   - After creating the app, you'll see the **Access Token** (formerly called API Key)
   - **Copy this token** - you'll need it for environment variables
   - ⚠️ **Important**: Keep this token secure and never commit it to Git

### Option B: New Developer Platform (2025.2) - For Advanced Use Cases

**When to Choose This:**
- Building a full HubSpot app with UI extensions
- Need app cards, webhooks, or other advanced features
- Want to distribute your app to other HubSpot accounts
- Building with Node.js/JavaScript

**Note:** For simple REST API integrations like blog tracking, the legacy private app (Option A) is recommended and sufficient. The new platform is more complex and designed for full-featured apps.

**If You Want to Use the New Platform:**
- See: https://developers.hubspot.com/docs/apps/developer-platform/build-apps/overview
- Requires HubSpot CLI installation
- More setup complexity for this use case

### Recommendation

**For this blog integration, use Option A (Legacy Private App)** - it's simpler, still fully supported, and perfect for our needs.

---

## Step 2: Configure Environment Variables

### Local Development

1. **Open `.env.local`** (create if it doesn't exist)

2. **Add HubSpot Access Token**:
   ```env
   HUBSPOT_API_KEY=your_access_token_here
   ```
   Note: The environment variable is still called `HUBSPOT_API_KEY` for backward compatibility, but it now stores the access token from your private app.

3. **Verify HubSpot Tracking ID** (should already be set):
   ```env
   NEXT_PUBLIC_HUBSPOT_ID=442487843
   ```

### Production (Vercel)

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Go to **Settings** → **Environment Variables**

2. **Add Environment Variable**:
   - **Key**: `HUBSPOT_API_KEY`
   - **Value**: Your HubSpot access token (from Step 1)
   - **Environment**: Production (and Preview if desired)
   - Click **Save**

3. **Verify** `NEXT_PUBLIC_HUBSPOT_ID` is set:
   - Should already be configured from HubSpot tracking setup
   - Value: `442487843`

---

## Step 3: Test the Integration

### Test Blog Post Tracking

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Visit a Blog Post**:
   - Go to `http://localhost:3000/en/blog/ultimate-firb-guide-2025`
   - Open browser Developer Tools → Network tab
   - Look for requests to `/api/hubspot/track-blog-view`
   - Should see `200 OK` response

3. **Check HubSpot Events**:
   - In HubSpot, go to **Reports** → **Analytics Tools** → **Custom Reports**
   - Create a new report or check Events dashboard
   - You should see `blog_post_view` events appearing

### Test Event Tracking

1. **Check Console**:
   - Open browser Developer Tools → Console
   - Should see no errors related to HubSpot

2. **Verify API Routes**:
   - Test endpoint: `POST /api/hubspot/track-event`
   - Can test with curl or Postman

---

## Step 4: Create HubSpot Forms (Optional - for Lead Capture)

### Create a Form in HubSpot

1. **Go to HubSpot Forms**:
   - In HubSpot, go to **Marketing** → **Lead Capture** → **Forms**
   - Click **Create form**

2. **Configure Form**:
   - Choose a template or start from scratch
   - Add fields (Email, First Name, Last Name, etc.)
   - Set up form settings

3. **Get Form ID**:
   - After creating the form, click on it
   - In the form settings, you'll see the **Form ID** (e.g., `abc123-def456-ghi789`)
   - Copy this ID

4. **Add Form to Blog Post**:
   ```tsx
   import HubSpotForm from "@/components/blog/HubSpotForm";

   // In your blog post component:
   <HubSpotForm
     formId="your-form-id-here"
     portalId="442487843"
     region="ap1" // or "na1" for North America
   />
   ```

### Form Placement Options

**Option 1: Inline in Blog Post**
```tsx
<div className="my-8 p-6 bg-gray-50 rounded-lg">
  <h3 className="text-xl font-semibold mb-4">Get Your Free FIRB Guide</h3>
  <HubSpotForm
    formId="your-form-id"
    portalId="442487843"
    region="ap1"
  />
</div>
```

**Option 2: Sidebar/Sticky Form**
```tsx
<aside className="sticky top-4">
  <HubSpotForm
    formId="your-form-id"
    portalId="442487843"
    region="ap1"
  />
</aside>
```

---

## Step 5: Verify Integration in HubSpot

### Check Events Dashboard

1. **View Events**:
   - Go to **Reports** → **Analytics Tools** → **Custom Reports**
   - Create report for "Events"
   - Filter by event name: `blog_post_view`, `blog_post_engagement`

2. **Check Contacts**:
   - Go to **Contacts** → **All contacts**
   - Contacts created from forms should appear here

3. **View Form Submissions**:
   - Go to **Marketing** → **Lead Capture** → **Forms**
   - Click on your form
   - View submissions and associated contacts

---

## What Gets Tracked

### Automatic Tracking

✅ **Blog Post Views**
- Event: `blog_post_view`
- Properties: `post_slug`, `post_title`, `post_category`, `locale`
- Triggered: When user visits a blog post

✅ **Blog Post Engagement**
- Event: `blog_post_engagement`
- Properties: `post_slug`, `time_on_page_seconds`, `scroll_depth_percent`
- Triggered: When user spends 5+ seconds on page, and periodically every 30 seconds

### Manual Tracking

You can also track custom events:
```typescript
// In your component
fetch("/api/hubspot/track-event", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    eventName: "custom_event_name",
    properties: {
      custom_property: "value",
    },
    email: "user@example.com", // optional
  }),
});
```

---

## Troubleshooting

### Events Not Appearing in HubSpot

1. **Check Access Token**:
   - Verify `HUBSPOT_API_KEY` is set correctly (contains your access token)
   - Check it's not expired or revoked
   - Access tokens don't expire, but apps can be deleted

2. **Check API Scopes**:
   - Ensure private app has `events.send` scope
   - Go to **Development** → **Legacy Apps** to verify
   - Recreate private app if needed

3. **Check Network Requests**:
   - Open Developer Tools → Network tab
   - Look for `/api/hubspot/track-*` requests
   - Check for error responses

4. **Check Server Logs**:
   - Look for error messages in Vercel logs or local server console
   - Common errors: Invalid API key, missing scopes

### Forms Not Loading

1. **Check Form ID**:
   - Verify form ID is correct
   - Form must be published in HubSpot

2. **Check Portal ID**:
   - Verify `NEXT_PUBLIC_HUBSPOT_ID` matches your HubSpot account
   - Should be `442487843` based on your tracking code

3. **Check Region**:
   - Verify region matches your HubSpot account region
   - Common: `na1` (North America), `ap1` (Asia Pacific), `eu1` (Europe)

4. **Check Browser Console**:
   - Look for JavaScript errors
   - HubSpot forms script should load from `js-{region}.hsforms.net`

---

## API Rate Limits (Free Tier)

- **Burst Limit**: 100 requests per 10 seconds
- **Daily Limit**: 40,000 requests per day
- **Recommendation**: Current implementation should stay well within limits

---

## Next Steps

1. ✅ Set up API key (Step 1)
2. ✅ Configure environment variables (Step 2)
3. ✅ Test integration (Step 3)
4. ⏭️ Create forms for lead capture (Step 4)
5. ⏭️ Monitor analytics in HubSpot (Step 5)
6. ⏭️ Set up custom reports and dashboards
7. ⏭️ Create email workflows based on blog engagement

---

## Support

- **HubSpot API Docs**: https://developers.hubspot.com/docs/api/events
- **HubSpot Forms Docs**: https://developers.hubspot.com/docs/api/marketing/forms
- **HubSpot Community**: https://community.hubspot.com
- **Developer Platform Guidance**: See `docs/HUBSPOT_DEVELOPER_PLATFORM_GUIDANCE.md` for information about HubSpot's new developer platform and legacy apps

---

## Summary

✅ **Integration Complete!**

Your blog is now integrated with HubSpot and will:
- Track all blog post views
- Track engagement metrics (time on page, scroll depth)
- Capture leads via HubSpot forms
- Attribute leads to specific blog posts
- Provide analytics in HubSpot dashboard

All of this works on **HubSpot Free Tier** - no paid subscription required! 🎉

