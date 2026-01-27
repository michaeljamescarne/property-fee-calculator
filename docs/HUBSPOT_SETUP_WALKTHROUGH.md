# HubSpot Legacy App Setup - Step-by-Step Walkthrough

## Step 1: Access HubSpot Legacy Apps

1. **Log into HubSpot**
   - Go to: https://app.hubspot.com
   - Log in with your HubSpot account credentials

2. **Navigate to Legacy Apps**
   - Click the **Settings** icon (gear icon) in the top right corner
   - In the left sidebar, look for **Development** (under "Integrations")
   - Click on **Development**
   - You should see **Legacy Apps** as an option
   - Click on **Legacy Apps**

**What you should see:**
- A page showing any existing legacy apps (or empty if this is your first)
- A button to "Create a private app" or "Create app"

**If you can't find it:**
- Make sure you have admin/owner permissions in your HubSpot account
- The path is: Settings → Development → Legacy Apps

---

## Step 2: Create a New Private App

1. **Click "Create a private app"** button
   - This will open the app creation wizard

2. **Basic Information**
   - **App name**: Enter `Blog Integration` (or any descriptive name)
   - **Description**: Enter `API integration for tracking blog post views, engagement, and lead capture`
   - Click **Next** or **Continue**

---

## Step 3: Configure Scopes (Permissions)

This is the most important step - you need to grant the app permission to access specific HubSpot APIs.

**Required Scopes:**

1. **Events API** (for tracking blog views)
   - Find **Events** in the scopes list
   - Check the box for **`events.send`** (or "Send events")
   - This allows the app to track custom events like blog post views

2. **Contacts API** (for creating/updating contacts)
   - Find **Contacts** in the scopes list
   - Check the box for **`contacts.write`** (or "Write contacts")
   - This allows the app to create or update contacts when forms are submitted

3. **Forms API** (for reading form data - optional but recommended)
   - Find **Forms** in the scopes list
   - Check the box for **`forms.read`** (or "Read forms")
   - This allows the app to read form configuration

**After selecting scopes:**
- Click **Next** or **Continue**
- Review the scopes you've selected
- Click **Create app** or **Save**

---

## Step 4: Get Your Access Token

1. **After creating the app:**
   - You'll be taken to the app details page
   - Look for a section showing your **Access Token** or **API Key**

2. **Copy the Access Token**
   - Click the **Copy** button next to the access token
   - Or manually select and copy the entire token
   - ⚠️ **IMPORTANT**: This token is shown only once! Copy it now.

3. **Save the Token Securely**
   - Paste it into a secure password manager or temporary secure note
   - You'll need it in the next step

**Token Format:**
- Should look like: `pat-na1-xxxx-xxxx-xxxx-xxxxxxxxxxxxx`
- Or: `xxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx`
- Length: Usually 50-100 characters

---

## Step 5: Configure Environment Variables

### For Local Development

1. **Open or create `.env.local` file**
   - In your project root: `/Users/michaelcarne/Sites/aupropertyinvestment/property-fee-calculator/`
   - Create the file if it doesn't exist

2. **Add the HubSpot Access Token**
   ```env
   HUBSPOT_API_KEY=your_access_token_here
   ```
   - Replace `your_access_token_here` with the token you copied in Step 4
   - **Important**: No quotes around the token, just paste it directly

3. **Verify other HubSpot variables** (should already be set):
   ```env
   NEXT_PUBLIC_HUBSPOT_ID=442487843
   ```

4. **Save the file**

### For Production (Vercel)

1. **Go to Vercel Dashboard**
   - Navigate to: https://vercel.com/dashboard
   - Select your project: `property-fee-calculator` (or your project name)

2. **Navigate to Environment Variables**
   - Click on your project
   - Go to **Settings** tab
   - Click **Environment Variables** in the left sidebar

3. **Add New Variable**
   - Click **Add New** button
   - **Key**: `HUBSPOT_API_KEY`
   - **Value**: Paste your access token from Step 4
   - **Environment**: Select **Production** (and **Preview** if you want it in preview deployments too)
   - Click **Save**

4. **Verify Existing Variable**
   - Check that `NEXT_PUBLIC_HUBSPOT_ID` exists
   - Value should be: `442487843`
   - If missing, add it with the same process

5. **Redeploy** (if needed)
   - After adding environment variables, you may need to redeploy
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Click **Redeploy**

---

## Step 6: Test the Integration

### Test Locally

1. **Start Development Server**
   ```bash
   cd /Users/michaelcarne/Sites/aupropertyinvestment/property-fee-calculator
   npm run dev
   ```

2. **Visit a Blog Post**
   - Open: http://localhost:3000/en/blog/ultimate-firb-guide-2025
   - Or any other blog post

3. **Check Network Requests**
   - Open browser Developer Tools (F12)
   - Go to **Network** tab
   - Filter by: `hubspot` or `track-blog-view`
   - You should see a request to `/api/hubspot/track-blog-view`
   - Status should be `200 OK` (green)

4. **Check Console for Errors**
   - Go to **Console** tab in Developer Tools
   - Should see no errors related to HubSpot
   - If you see errors, check the Network tab for failed requests

### Verify in HubSpot

1. **Check Events Dashboard**
   - Go back to HubSpot
   - Navigate to **Reports** → **Analytics Tools** → **Custom Reports**
   - Or go to **Reports** → **Analytics Tools** → **Events**
   - Look for events named `blog_post_view`
   - It may take a few minutes to appear

2. **Check App Status**
   - Go to **Settings** → **Development** → **Legacy Apps**
   - Click on your "Blog Integration" app
   - Verify it shows as "Active" or "Enabled"

---

## Troubleshooting

### Issue: Can't find Legacy Apps

**Solution:**
- Make sure you have admin/owner permissions
- Try: Settings → Integrations → Private Apps (old path, may still work)
- Or search for "Private Apps" in HubSpot settings

### Issue: Access Token Not Working

**Check:**
1. Token was copied completely (no spaces before/after)
2. Token is in `.env.local` (local) or Vercel environment variables (production)
3. Server was restarted after adding environment variable
4. Token hasn't been revoked (check app status in HubSpot)

### Issue: Events Not Appearing

**Check:**
1. Network request returns 200 OK (not 401 or 403)
2. Scopes are correctly set (`events.send` is enabled)
3. Wait a few minutes - events may take time to appear
4. Check HubSpot Events dashboard (not just Reports)

### Issue: 401 Unauthorized Error

**Solution:**
- Access token is invalid or expired
- Recreate the private app and get a new token
- Make sure token is correctly set in environment variables

### Issue: 403 Forbidden Error

**Solution:**
- Missing required scopes
- Go back to app settings and verify scopes are set:
  - `events.send` ✅
  - `contacts.write` ✅
  - `forms.read` ✅

---

## Verification Checklist

- [ ] Legacy app created in HubSpot
- [ ] Required scopes selected (`events.send`, `contacts.write`, `forms.read`)
- [ ] Access token copied and saved securely
- [ ] `HUBSPOT_API_KEY` added to `.env.local` (local)
- [ ] `HUBSPOT_API_KEY` added to Vercel environment variables (production)
- [ ] `NEXT_PUBLIC_HUBSPOT_ID` is set (should be `442487843`)
- [ ] Development server restarted (if testing locally)
- [ ] Network request to `/api/hubspot/track-blog-view` returns 200 OK
- [ ] No errors in browser console
- [ ] Events appear in HubSpot dashboard (may take a few minutes)

---

## Next Steps After Setup

Once setup is complete:

1. ✅ **Monitor Events**: Check HubSpot Events dashboard regularly
2. ✅ **Add Forms**: Create HubSpot forms and add to blog posts (optional)
3. ✅ **Set Up Reports**: Create custom reports in HubSpot for blog analytics
4. ✅ **Create Workflows**: Set up email workflows based on blog engagement (optional)

---

## Need Help?

- **HubSpot Support**: https://knowledge.hubspot.com
- **HubSpot Community**: https://community.hubspot.com
- **API Documentation**: https://developers.hubspot.com/docs/api/events

---

## Summary

You've now:
1. ✅ Created a legacy private app in HubSpot
2. ✅ Configured required scopes
3. ✅ Obtained access token
4. ✅ Set up environment variables
5. ✅ Tested the integration

Your blog is now tracking views and engagement in HubSpot! 🎉












