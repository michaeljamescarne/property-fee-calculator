# HubSpot Blog Tracking - Testing Guide

## Quick Test Checklist

- [ ] HubSpot tracking script loads on blog pages
- [ ] Custom events are being sent
- [ ] Events appear in HubSpot dashboard
- [ ] No console errors

---

## Step 1: Verify Tracking Script is Loaded

### Test Locally

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Visit a Blog Post**
   - Open: http://localhost:3000/en/blog/ultimate-firb-guide-2025
   - Or any other blog post

3. **Check if HubSpot Script Loaded**
   - Open browser Developer Tools (F12)
   - Go to **Console** tab
   - Type: `window._hsq` and press Enter
   - **Expected**: Should see an array `[]` (not `undefined`)
   - This confirms HubSpot tracking script is loaded

4. **Check Network Tab**
   - Go to **Network** tab in Developer Tools
   - Filter by: `hs-scripts.com` or `442487843`
   - **Expected**: Should see a request to `js-ap1.hs-scripts.com/442487843.js`
   - Status should be `200 OK`

---

## Step 2: Verify Custom Events are Being Sent

### Check Console for Events

1. **Open Console Tab**
   - In Developer Tools → **Console**

2. **Monitor HubSpot Queue**
   - Type: `window._hsq` and press Enter
   - You should see events being queued
   - Events look like: `[{...}, {...}]`

3. **Check for Errors**
   - Look for any red error messages
   - Should see no errors related to HubSpot

### Check Network Tab for Event Requests

1. **Go to Network Tab**
   - Filter by: `__ptq.gif` or `ptq`
   - **Expected**: Should see requests to HubSpot's tracking pixel
   - These are the actual event tracking requests
   - Status should be `200 OK` or `204 No Content`

2. **Check Request Details**
   - Click on a `__ptq.gif` request
   - Go to **Payload** or **Query String Parameters** tab
   - Should see parameters like:
     - `name=blog_post_view`
     - `post_slug=...`
     - `post_title=...`

---

## Step 3: Verify Events in HubSpot Dashboard

### Check HubSpot Events Dashboard

1. **Log into HubSpot**
   - Go to: https://app.hubspot.com

2. **Navigate to Events**
   - Go to **Reports** → **Analytics Tools** → **Custom Reports**
   - Or: **Reports** → **Analytics Tools** → **Events**

3. **Look for Custom Events**
   - Search for: `blog_post_view`
   - Search for: `blog_post_engagement`
   - **Note**: Events may take 5-10 minutes to appear

### Alternative: Check Behavioral Events

1. **Go to Behavioral Events**
   - Navigate to: **Reports** → **Analytics Tools** → **Behavioral Events**
   - Or: **Marketing** → **Analytics Tools** → **Behavioral Events**

2. **Look for Your Events**
   - Should see `blog_post_view` and `blog_post_engagement`
   - Click on an event to see details

---

## Step 4: Test Engagement Tracking

### Test Time on Page

1. **Stay on Blog Post**
   - Visit a blog post
   - Wait at least 5 seconds
   - **Expected**: `blog_post_engagement` event should fire

2. **Check Console**
   - Open Console
   - Type: `window._hsq`
   - Should see engagement events in the queue

### Test Scroll Depth

1. **Scroll Down the Page**
   - Scroll to 25%, 50%, 75%, 100%
   - **Expected**: Scroll depth is tracked

2. **Check Event Properties**
   - In Network tab, find `__ptq.gif` requests
   - Check the `scroll_depth_percent` parameter
   - Should increase as you scroll

---

## Step 5: Test Multiple Blog Posts

1. **Visit Different Posts**
   - Visit 2-3 different blog posts
   - **Expected**: Each should track a `blog_post_view` event
   - Each should have different `post_slug` and `post_title` properties

2. **Verify in HubSpot**
   - Check Events dashboard
   - Should see multiple `blog_post_view` events
   - Each with different post details

---

## Troubleshooting

### Issue: `window._hsq` is undefined

**Possible Causes:**
- HubSpot tracking script hasn't loaded yet
- Script failed to load
- Ad blocker blocking the script

**Solutions:**
1. Wait a few seconds and check again
2. Check Network tab for `442487843.js` request
3. Disable ad blocker and try again
4. Check browser console for script errors

### Issue: No `__ptq.gif` Requests

**Possible Causes:**
- Events not being sent
- HubSpot script not fully loaded
- JavaScript errors preventing events

**Solutions:**
1. Check Console for JavaScript errors
2. Verify `window._hsq` exists
3. Check that `trackCustomBehavioralEvent` is being called
4. Wait a few seconds - events may be batched

### Issue: Events Not Appearing in HubSpot

**Possible Causes:**
- Events take time to process (5-10 minutes)
- Wrong HubSpot account
- Events being filtered

**Solutions:**
1. Wait 10-15 minutes and check again
2. Verify you're checking the correct HubSpot account
3. Check Events dashboard (not just Reports)
4. Look in Behavioral Events section

### Issue: Console Errors

**Common Errors:**
- `_hsq is not defined` - Script not loaded yet (normal, will retry)
- `trackCustomBehavioralEvent is not a function` - Wrong API method

**Solutions:**
- Most errors are harmless if script loads eventually
- Check Network tab to confirm script loaded
- Verify tracking code ID is correct (`442487843`)

---

## Expected Results

### ✅ Success Indicators

1. **Console**: `window._hsq` returns an array
2. **Network**: Requests to `__ptq.gif` with status 200/204
3. **HubSpot**: Events appear in dashboard within 10 minutes
4. **No Errors**: Console shows no red error messages

### 📊 What You Should See in HubSpot

- **Event Name**: `blog_post_view`
- **Properties**:
  - `post_slug`: "ultimate-firb-guide-2025"
  - `post_title`: "Complete FIRB Guide 2025"
  - `post_category`: "FIRB Guide"
  - `locale`: "en"

- **Event Name**: `blog_post_engagement`
- **Properties**:
  - `post_slug`: "ultimate-firb-guide-2025"
  - `time_on_page_seconds`: 30, 60, 90, etc.
  - `scroll_depth_percent`: 0-100

---

## Quick Test Script

Run this in browser console on a blog post page:

```javascript
// Check if HubSpot is loaded
console.log("HubSpot loaded:", typeof window._hsq !== "undefined");

// Check current queue
console.log("Current queue:", window._hsq);

// Manually trigger an event (for testing)
if (window._hsq) {
  window._hsq.push([
    "trackCustomBehavioralEvent",
    {
      name: "test_event",
      properties: {
        test: true,
        timestamp: new Date().toISOString(),
      },
    },
  ]);
  console.log("Test event sent!");
}
```

---

## Next Steps After Testing

Once tracking is confirmed working:

1. ✅ **Monitor Events**: Check HubSpot dashboard regularly
2. ✅ **Create Reports**: Set up custom reports for blog analytics
3. ✅ **Add Forms**: Create HubSpot forms for lead capture (optional)
4. ✅ **Set Up Workflows**: Create email workflows based on blog engagement (optional)

---

## Summary

**Testing Checklist:**
- [ ] HubSpot script loads (`window._hsq` exists)
- [ ] Events are sent (see `__ptq.gif` requests)
- [ ] Events appear in HubSpot dashboard
- [ ] No console errors
- [ ] Engagement tracking works (time on page, scroll depth)

If all checkboxes are ✅, your integration is working! 🎉




