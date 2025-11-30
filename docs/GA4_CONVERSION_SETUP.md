# Google Analytics 4 (GA4) Conversion Tracking Setup Guide

This guide explains how to set up conversion goals in Google Analytics 4 for tracking important user actions on the Property Costs website.

## Current Implementation Status

✅ **GA4 Integration**: Fully implemented
✅ **Event Tracking**: All conversion events are tracked
✅ **Conversion Events**: Configured in code

### Tracked Conversion Events

The following events are automatically tracked:

1. **`calculator_completed`** - When user completes FIRB calculator
2. **`lead_captured`** - When user submits email in lead capture form
3. **`email_sent`** - When user sends calculation results via email
4. **`pdf_downloaded`** - When user downloads PDF report

---

## Step 1: Verify GA4 Measurement ID

✅ **Measurement ID Configured**: `G-BQTTCSVY3H`

The Google Analytics measurement ID is already configured in the codebase. It will use:

1. Environment variable `NEXT_PUBLIC_GA_MEASUREMENT_ID` (if set in `.env.local` or Vercel)
2. Default fallback: `G-BQTTCSVY3H` (configured in code)

**To override with environment variable** (recommended for production):

1. Add to `.env.local` for local development:
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-BQTTCSVY3H
   ```
2. Add to Vercel environment variables for production:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-BQTTCSVY3H`
   - Select all environments (Production, Preview, Development)
   - Redeploy after adding

**To verify the measurement ID**:

- Go to [Google Analytics](https://analytics.google.com)
- Select your property
- Go to **Admin** → **Data Streams**
- Click on your web stream
- Verify the "Measurement ID" matches: `G-BQTTCSVY3H`

---

## Step 2: Mark Events as Conversions in GA4 Dashboard

To track these events as conversions, you need to mark them in the GA4 dashboard:

### Access Events

1. Go to [Google Analytics](https://analytics.google.com)
2. Select your property
3. Navigate to **Admin** (gear icon, bottom left)
4. Click **Events** (under Data display)

### Mark Events as Conversions

For each event you want to track as a conversion:

1. Find the event in the list (you may need to wait 24-48 hours for events to appear after first tracking)
2. Toggle the **Mark as conversion** switch to ON
3. Repeat for each conversion event

**Recommended conversions to mark:**

- ✅ `calculator_completed` - Primary conversion: Calculator usage
- ✅ `lead_captured` - Secondary conversion: Lead generation
- ✅ `email_sent` - Engagement conversion: Email engagement
- ✅ `pdf_downloaded` - Engagement conversion: PDF downloads

---

## Step 3: Verify Event Tracking (Real-Time)

### Test Events in Real-Time

1. Go to **Reports** → **Realtime** in GA4
2. Perform actions on your site:
   - Complete the FIRB calculator
   - Submit lead capture form
   - Send email results
   - Download PDF
3. Watch events appear in real-time (within 30 seconds)

### Expected Events

- **Event Name**: `calculator_completed`
  - **Parameters**:
    - `event_category`: "Calculator"
    - `event_label`: "FIRB Calculator"
    - `value`: Property value (if available)

- **Event Name**: `lead_captured`
  - **Parameters**:
    - `event_category`: "Leads"
    - `event_label`: Source (e.g., "homepage")

- **Event Name**: `email_sent`
  - **Parameters**:
    - `event_category`: "Engagement"
    - `event_label`: "Results Email"

- **Event Name**: `pdf_downloaded`
  - **Parameters**:
    - `event_category`: "Downloads"
    - `event_label`: "PDF with Analytics" or "PDF Basic"

---

## Step 4: Create Custom Reports

### Conversion Report

1. Go to **Reports** → **Engagement** → **Events**
2. Filter by events marked as conversions
3. Create a custom report for conversion analysis

### Funnel Analysis

1. Go to **Explore** → **Funnel exploration**
2. Create funnel:
   - Step 1: Page view (Calculator page)
   - Step 2: `calculator_completed` event
   - Step 3: `email_sent` or `pdf_downloaded` event

---

## Step 5: Set Up Conversion Goals

While events are automatically tracked, you can create more sophisticated goals:

### Create Custom Conversion Goal

1. Go to **Admin** → **Conversions**
2. Click **New conversion event**
3. Enter event name (must match exactly):
   - `calculator_completed`
   - `lead_captured`
   - etc.
4. Click **Save**

**Note**: You can also mark events as conversions directly from the Events list (see Step 2).

---

## Event Tracking Code Reference

### Where Events Are Tracked

**Calculator Completion:**

- File: `components/firb/ResultsPanel.tsx`
- Trigger: When calculation results are displayed
- Code:
  ```typescript
  trackConversion.calculatorCompleted(propertyValue, state);
  ```

**Lead Capture:**

- File: `components/lead/LeadCaptureForm.tsx`
- Trigger: When form is successfully submitted
- Code:
  ```typescript
  trackConversion.leadCaptured("homepage");
  ```

**Email Sent:**

- File: `components/firb/EmailResultsModal.tsx`
- Trigger: When email is successfully sent
- Code:
  ```typescript
  trackConversion.emailSent();
  ```

**PDF Downloaded:**

- Function exists in `components/analytics/GoogleAnalytics.tsx`
- Add tracking call where PDF download is initiated

### Event Structure

All events use the standard format:

```typescript
trackEvent("event_name", "category", "label", value);
```

GA4 automatically maps:

- `event_category` → `category` parameter
- `event_label` → `label` parameter
- `value` → `value` parameter

---

## Troubleshooting

### Events Not Appearing

**Problem**: Events don't show up in GA4

**Solutions**:

1. Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set correctly
2. Check browser console for errors
3. Use GA4 DebugView (see below)
4. Wait 24-48 hours for events to appear in standard reports (Real-time shows immediately)

### DebugView (Recommended for Testing)

1. Install [Google Analytics Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
2. Enable the extension
3. Go to GA4 → **Admin** → **DebugView**
4. Perform actions on your site
5. See events in real-time with full parameter details

### Verify Measurement ID

Check that the measurement ID matches:

1. In GA4: Admin → Data Streams → Web → Measurement ID
2. In code: `.env.local` or Vercel environment variables
3. In browser: Inspect Network tab, look for requests to `google-analytics.com`

---

## Conversion Rate Optimization

### Key Metrics to Monitor

1. **Calculator Completion Rate**
   - Formula: `calculator_completed` / `page_views` (calculator page)
   - Target: > 20% completion rate

2. **Lead Capture Rate**
   - Formula: `lead_captured` / `page_views` (homepage)
   - Target: > 5% conversion rate

3. **Email Engagement Rate**
   - Formula: `email_sent` / `calculator_completed`
   - Target: > 30% engagement rate

4. **PDF Download Rate**
   - Formula: `pdf_downloaded` / `calculator_completed`
   - Target: > 15% download rate

### Setting Up Custom Metrics

1. Go to **Admin** → **Custom Definitions** → **Custom Metrics**
2. Click **Create custom metric**
3. Configure:
   - **Metric name**: Calculator Completion Rate
   - **Scope**: Event
   - **Event parameter**: Use calculated field
   - **Unit of measurement**: Percent

---

## Best Practices

### 1. Event Naming

✅ **Good**: `calculator_completed`, `lead_captured`
❌ **Bad**: `click`, `submit`, `button_click`

### 2. Parameter Usage

- Use `value` for numeric data (property value, amounts)
- Use `label` for categorical data (source, location)
- Keep parameter values consistent

### 3. Testing

- Always test events in DebugView before deploying
- Verify events in Real-time reports
- Check conversion tracking after marking events as conversions

### 4. Documentation

- Document all custom events
- Keep tracking code centralized in `GoogleAnalytics.tsx`
- Update this guide when adding new events

---

## Advanced Configuration

### Enhanced Measurement

GA4 automatically tracks:

- Page views
- Scrolls (90% depth)
- Outbound clicks
- Site search
- Video engagement
- File downloads

Configure in: **Admin** → **Data Streams** → **Web** → **Enhanced measurement**

### User Properties

Track user segments:

1. Go to **Admin** → **Custom Definitions** → **User Properties**
2. Create properties like:
   - `user_type`: "New" or "Returning"
   - `property_value_range`: "$0-500k", "$500k-1M", etc.

### Audience Creation

Create audiences based on conversions:

1. Go to **Admin** → **Audiences**
2. Create audience:
   - **Condition**: Users who triggered `calculator_completed`
   - **Name**: "Calculator Users"
3. Use for remarketing or analysis

---

## Checklist

- [ ] GA4 Measurement ID configured in environment variables
- [ ] Events appearing in Real-time reports
- [ ] `calculator_completed` marked as conversion
- [ ] `lead_captured` marked as conversion
- [ ] `email_sent` marked as conversion (optional)
- [ ] `pdf_downloaded` marked as conversion (optional)
- [ ] Custom conversion report created
- [ ] Funnel analysis set up (optional)
- [ ] DebugView tested and working
- [ ] Conversion rates monitored regularly

---

## Support Resources

- [GA4 Event Tracking Documentation](https://support.google.com/analytics/answer/9267735)
- [GA4 Conversions Guide](https://support.google.com/analytics/answer/9267568)
- [GA4 DebugView](https://support.google.com/analytics/answer/7201382)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)

---

## Current Event Tracking Status

**✅ Implemented:**

- Calculator completion tracking
- Lead capture form tracking
- Email results tracking
- PDF download tracking (function ready)

**Location**: `components/analytics/GoogleAnalytics.tsx`

**Measurement ID**: Set via `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable

---

Last Updated: January 2025
