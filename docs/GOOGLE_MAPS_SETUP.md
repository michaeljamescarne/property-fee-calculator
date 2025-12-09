# Google Maps API Setup Guide

## Overview

The FIRB Calculator uses Google Places Autocomplete API to provide address lookup and validation for Australian properties. This ensures users enter valid, correctly formatted addresses and automatically fills in the state/territory.

---

## Setup Instructions

### 1. Get a Google Maps API Key

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** (or select existing)
3. **Enable the Places API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Places API"
   - Click "Enable"
4. **Create an API Key**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key

### 2. Restrict Your API Key (Important for Security)

1. **Click on your API key** to edit it
2. **Set Application Restrictions**:
   - Choose "HTTP referrers (web sites)"
   - Add your domains:
     - `http://localhost:3000/*` (for local development)
     - `http://localhost:3001/*` (backup port)
     - `https://yourdomain.com/*` (your production domain)
     - `https://*.vercel.app/*` (for Vercel previews)
3. **Set API Restrictions**:
   - Choose "Restrict key"
   - Select only: "Places API"
4. **Save**

### 3. Add API Key to Your Project

**For Local Development:**

Create or update `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

**For Production (Vercel):**

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - Key: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Value: Your API key
   - Environment: Production, Preview, Development

### 4. Restart Development Server

```bash
# Kill current server
pkill -f "next dev"

# Start fresh server
npm run dev
```

---

## How It Works

### Address Autocomplete Features

1. **Australian addresses only** - Restricted to AU addresses
2. **Real-time suggestions** - Shows matching addresses as you type
3. **Auto-fill state** - Automatically sets the state/territory when address is selected
4. **Formatted addresses** - Returns properly formatted Australian addresses
5. **Fallback** - Works as regular input if API key not configured

### User Experience

**With API Key:**

- User types "123 George St"
- Sees dropdown suggestions: "123 George Street, Sydney NSW 2000"
- Selects address
- Address field populated
- State automatically set to "NSW"

**Without API Key:**

- Works as regular text input
- User can type any address
- Must manually select state
- Shows informational message about API key

---

## Pricing

**Google Places API Pricing:**

- **Free Tier**: $200/month credit (approximately 28,000 autocomplete requests)
- **After Free Tier**: $2.83 per 1,000 requests (Autocomplete - Per Session)
- **Estimated Cost**: For 1,000 monthly users, ~$3-10/month

**Billing Setup Required**: Even for free tier, you must enable billing in Google Cloud Console.

---

## Optional: Alternative Solutions

If you prefer not to use Google Maps API, alternatives include:

1. **No Address Validation** (Current fallback)
   - Free
   - User types address manually
   - No validation or autocomplete

2. **Australia Post API**
   - Free tier available
   - Australian-specific
   - Limited free tier

3. **HERE Maps API**
   - $200/month free tier
   - Alternative to Google

---

## Testing

To test if address autocomplete is working:

1. Start dev server with API key configured
2. Go to FIRB Calculator → Property Details step
3. Click in "Property Address" field
4. Start typing an Australian address (e.g., "1 Martin Place")
5. You should see autocomplete suggestions appear
6. Select an address
7. State should auto-populate

If you see "Google Maps API key not configured", the component will work as a regular text input.

---

## Security Best Practices

✅ **DO:**

- Restrict API key to specific domains
- Restrict to only Places API
- Monitor usage in Google Cloud Console
- Set up billing alerts

❌ **DON'T:**

- Commit API keys to git
- Use unrestricted API keys
- Share API keys publicly
- Skip billing setup (even for free tier)

---

## Troubleshooting

**"Google Maps API key not configured"**

- Check `.env.local` has `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- Restart dev server after adding key
- Key must start with `NEXT_PUBLIC_` to be available in browser

**"RefererNotAllowedMapError"**

This error occurs when your production domain is not authorized in Google Cloud Console. To fix:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Navigate to**: APIs & Services → Credentials
3. **Click on your API key** to edit it
4. **Under "Application restrictions"** → "HTTP referrers (web sites)"
5. **Add your production domain(s)**:
   - `https://www.propertycosts.com.au/*`
   - `https://propertycosts.com.au/*` (without www)
   - `https://*.propertycosts.com.au/*` (for all subdomains)
6. **Also include development domains**:
   - `http://localhost:3000/*`
   - `http://localhost:3001/*`
   - `https://*.vercel.app/*` (for Vercel previews)
7. **Save** the changes
8. **Wait 1-2 minutes** for changes to propagate
9. **Refresh your production site** and test again

**Important**: The error message will show the exact URL that needs to be authorized. Make sure to add both the exact URL pattern and wildcard patterns to cover all pages.

**No autocomplete suggestions appearing**

- Check browser console for errors
- Verify Places API is enabled in Google Cloud Console
- Check API key restrictions
- Ensure billing is enabled (even for free tier)

---

## Current Status

- ✅ AddressAutocomplete component created
- ✅ Integrated into Property Details step
- ✅ Auto-fills state when address selected
- ✅ Fallback to regular input if no API key
- ⚠️ Requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to be set
