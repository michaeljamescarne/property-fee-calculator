# HubSpot Tracking Code Verification Guide

## Current Implementation

The HubSpot tracking code is implemented in `components/analytics/HubSpotTracking.tsx` and loaded in `app/[locale]/layout.tsx`.

## Verification Steps

### 1. Check Production Deployment

1. Visit your production site: https://propertycosts.com.au
2. Open browser Developer Tools (F12 or Right-click → Inspect)
3. Go to the **Network** tab
4. Refresh the page
5. Search for `442487843.js` or `hs-scripts.com` in the network requests
6. Verify the request shows `200 OK` or `304 Not Modified`

### 2. Verify Script in Page Source

1. Visit your production site
2. Right-click → **View Page Source** (or Ctrl+U / Cmd+U)
3. Search for `hs-script-loader` or `442487843`
4. You should see the script tag with the HubSpot ID

### 3. Check Script Execution

1. Open Developer Tools → **Console** tab
2. Type: `window._hsq` and press Enter
3. You should see an array (this confirms HubSpot is loaded)
4. Type: `window._hsq.push` and press Enter
5. You should see a function (this confirms the tracking queue is active)

### 4. Verify Tracking Pixel

1. Open Developer Tools → **Network** tab
2. Filter by `__ptq.gif` or search for `ptq`
3. You should see requests to HubSpot's tracking pixel
4. Status should be `200 OK`

### 5. HubSpot Validation Tool

1. Log into your HubSpot account
2. Go to **Settings** → **Tracking & Analytics** → **Tracking code**
3. Scroll to **Validate your tracking code**
4. Enter your production URL: `https://propertycosts.com.au`
5. Click **Test** - HubSpot will email you the results

## Common Issues

### Issue: Script Not Loading

**Symptoms:**

- No `442487843.js` request in Network tab
- `window._hsq` is undefined

**Possible Causes:**

1. Environment variable not set in Vercel
2. Ad blocker blocking the script
3. Script not in the page source

**Solutions:**

1. Verify `NEXT_PUBLIC_HUBSPOT_ID` is set in Vercel environment variables
2. Test in incognito mode (disables most ad blockers)
3. Check that the component is imported in `layout.tsx`

### Issue: Script Loading But Not Tracking

**Symptoms:**

- Script loads (200 OK in Network tab)
- `window._hsq` exists
- But no `__ptq.gif` requests

**Possible Causes:**

1. HubSpot account not fully configured
2. Domain not added to HubSpot settings
3. Tracking code validation failed

**Solutions:**

1. In HubSpot, go to **Settings** → **Tracking & Analytics** → **Tracking code**
2. Scroll to **External site domains**
3. Add `propertycosts.com.au` if not already added
4. Save changes

### Issue: Multiple Script Tags

**Symptoms:**

- Multiple `hs-script-loader` IDs in page source
- Console errors about duplicate scripts

**Solutions:**

- The current implementation checks for existing scripts to prevent duplicates
- If you see duplicates, check that the component is only imported once in the layout

## Environment Variable

Make sure `NEXT_PUBLIC_HUBSPOT_ID` is set in Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add or verify:
   - **Key:** `NEXT_PUBLIC_HUBSPOT_ID`
   - **Value:** `442487843`
   - **Environment:** Production (and Preview if desired)
3. Redeploy after adding/updating

## Testing Locally

To test the HubSpot tracking code locally:

1. Add to `.env.local`:

   ```
   NEXT_PUBLIC_HUBSPOT_ID=442487843
   ```

2. Run the dev server:

   ```bash
   npm run dev
   ```

3. Visit `http://localhost:3000/en`

4. Follow the verification steps above

## Expected Behavior

Once correctly deployed:

- ✅ Script loads on every page
- ✅ `window._hsq` is available in console
- ✅ Page views are tracked automatically
- ✅ HubSpot validation tool confirms installation
- ✅ Tracking pixel requests appear in Network tab

## Support

If issues persist after following this guide:

1. Check HubSpot's tracking code documentation
2. Contact HubSpot Support with:
   - Your Hub ID: `442487843`
   - Your domain: `propertycosts.com.au`
   - Screenshots of Network tab showing script requests
   - Console output showing `window._hsq`









