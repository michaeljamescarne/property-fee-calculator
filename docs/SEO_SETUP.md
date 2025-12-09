# SEO Setup Guide - Search Console & Webmaster Tools

This guide provides step-by-step instructions for submitting your sitemap to Google Search Console and Bing Webmaster Tools to ensure proper search engine indexing.

## Prerequisites

- Website is live and accessible at `https://propertycosts.com.au`
- Sitemap is accessible at `https://propertycosts.com.au/sitemap.xml`
- Admin access to Google Search Console
- Admin access to Bing Webmaster Tools (Microsoft account)

---

## 1. Verify Sitemap Accessibility

Before submitting, verify your sitemap is accessible:

1. Visit: `https://propertycosts.com.au/sitemap.xml`
2. Confirm the XML sitemap loads correctly
3. Verify it includes all expected URLs:
   - Homepage (`/en`, `/zh`)
   - FIRB Calculator (`/en/firb-calculator`, `/zh/firb-calculator`)
   - Blog pages (`/en/blog`, `/zh/blog`, individual posts)
   - FAQ page (`/en/faq`, `/zh/faq`)
   - Other static pages

### Current Sitemap Structure

The sitemap is dynamically generated at build time and includes:

- **Static Routes** (with priorities):
  - Homepage: Priority 1.0, Daily updates
  - FIRB Calculator: Priority 0.9, Weekly updates
  - Blog: Priority 0.8, Daily updates
  - FAQ: Priority 0.8, Weekly updates
  - Dashboard: Priority 0.5, Weekly updates
  - Legal pages (Disclaimer, Privacy, Terms): Priority 0.3, Monthly updates

- **Dynamic Routes**:
  - All blog posts with individual URLs
  - Featured posts: Priority 0.8
  - Regular posts: Priority 0.6

- **Multi-language Support**:
  - All routes available in both `/en` and `/zh` locales

---

## 2. Google Search Console Setup

### Step 1: Access Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google account
3. If you haven't verified your property yet, add it:
   - Click "Add Property"
   - Enter: `https://propertycosts.com.au`
   - Choose verification method (recommended: HTML file upload or DNS verification)

### Step 2: Verify Property Ownership

**Option A: HTML File Upload (Recommended)**

1. Download the verification HTML file from Search Console
2. Upload it to your site's root directory (via Vercel or your hosting platform)
3. Ensure it's accessible at `https://propertycosts.com.au/[verification-filename].html`
4. Click "Verify" in Search Console

**Option B: DNS Verification**

1. Add the TXT record provided by Google to your DNS settings
2. Wait for DNS propagation (can take up to 24 hours)
3. Click "Verify" in Search Console

### Step 3: Submit Sitemap

1. In Google Search Console, select your property (`propertycosts.com.au`)
2. Navigate to **Sitemaps** in the left sidebar (under "Indexing")
3. In the "Add a new sitemap" field, enter: `sitemap.xml`
4. Click **Submit**
5. Wait a few moments and refresh the page
6. You should see:
   - Status: "Success" (green checkmark)
   - Last read date
   - Number of discovered URLs

### Step 4: Monitor Sitemap Status

- Check back in 24-48 hours to see:
  - How many URLs were discovered
  - How many URLs are indexed
  - Any errors or warnings

### Step 5: Request Indexing (Optional)

For faster indexing of important pages:

1. Go to **URL Inspection** tool in Search Console
2. Enter important URLs (homepage, calculator, main blog posts)
3. Click "Request Indexing"
4. Repeat for critical pages

**Important URLs to prioritize:**

- `https://propertycosts.com.au/en`
- `https://propertycosts.com.au/zh`
- `https://propertycosts.com.au/en/firb-calculator`
- `https://propertycosts.com.au/zh/firb-calculator`
- `https://propertycosts.com.au/en/blog`
- `https://propertycosts.com.au/en/faq`

---

## 3. Bing Webmaster Tools Setup

### Step 1: Access Bing Webmaster Tools

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Sign in with your Microsoft account (create one if needed)
3. Click "Add a site"

### Step 2: Add Your Site

1. Enter your website URL: `https://propertycosts.com.au`
2. Click "Add"
3. Choose verification method:

**Option A: XML File Upload (Recommended)**

1. Download the verification XML file
2. Upload it to your site's root directory
3. Ensure it's accessible at `https://propertycosts.com.au/[verification-filename].xml`
4. Click "Verify" in Bing Webmaster Tools

**Option B: Meta Tag Verification**

1. Copy the meta tag provided
2. Add it to your site's `<head>` section
3. For this Next.js site, add to `app/[locale]/layout.tsx` in the metadata
4. Click "Verify" in Bing Webmaster Tools

**Option C: DNS Verification**

1. Add the CNAME record to your DNS settings
2. Wait for DNS propagation
3. Click "Verify" in Bing Webmaster Tools

### Step 3: Submit Sitemap

1. After verification, go to **Sitemaps** in the left sidebar
2. Click **Submit Sitemap**
3. Enter: `https://propertycosts.com.au/sitemap.xml`
4. Click **Submit**
5. You'll see the sitemap listed with:
   - Status
   - Submission date
   - Number of URLs

### Step 4: Monitor Status

- Check back in 24-48 hours for indexing progress
- View sitemap details to see:
  - URLs discovered
  - URLs indexed
  - Any errors

---

## 4. Ongoing Maintenance

### Regular Checks (Monthly)

1. **Google Search Console**:
   - Check for indexing errors
   - Monitor coverage report
   - Review search performance
   - Check mobile usability

2. **Bing Webmaster Tools**:
   - Check indexing status
   - Review crawl errors
   - Monitor search performance

### When Adding New Content

- **Blog Posts**: Automatically included in sitemap (no action needed)
- **New Pages**: Ensure they're added to `app/sitemap.ts` static routes if needed
- **Sitemap Updates**: The sitemap regenerates on each build/deployment

### Resubmitting Sitemap

You typically **don't need to resubmit** the sitemap after updates. Search engines will:

- Re-crawl the sitemap periodically (usually within days)
- Detect new URLs automatically
- Index new content as they discover it

**Resubmit only if:**

- You made major structural changes
- You haven't seen new content indexed in 2+ weeks
- Search Console shows sitemap errors

---

## 5. Troubleshooting

### Sitemap Not Accessible

**Problem**: Getting 404 when accessing `/sitemap.xml`

**Solutions**:

1. Verify the site is deployed and accessible
2. Check that `app/sitemap.ts` exists and exports correctly
3. Ensure Next.js is configured to generate sitemap
4. Try accessing `/sitemap.xml` directly in browser

### Sitemap Not Updating

**Problem**: Search engines show old URLs

**Solutions**:

1. Verify sitemap regenerates on deployment
2. Check `lastModified` dates in sitemap XML
3. Wait 24-48 hours for search engines to recrawl
4. Use "URL Inspection" to request re-indexing

### Low Indexing Rate

**Problem**: Only a few URLs indexed out of many discovered

**Solutions**:

1. Check for crawl errors in Search Console
2. Ensure pages return 200 status codes
3. Verify pages have quality content
4. Check for robots.txt blocks
5. Ensure pages are accessible (not behind authentication)
6. Improve page load speeds

### Duplicate URLs

**Problem**: Both `/en/` and `/zh/` versions indexed separately

**Note**: This is expected behavior for multi-language sites. Both versions should be indexed. Google will show the appropriate version based on user's language preference.

---

## 6. Additional Resources

- [Google Search Console Help](https://support.google.com/webmasters)
- [Bing Webmaster Tools Help](https://www.bing.com/webmasters/help)
- [Next.js Sitemap Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)

---

## 7. Verification Checklist

- [ ] Sitemap accessible at `https://propertycosts.com.au/sitemap.xml`
- [ ] Google Search Console property verified
- [ ] Sitemap submitted to Google Search Console
- [ ] Bing Webmaster Tools property verified
- [ ] Sitemap submitted to Bing Webmaster Tools
- [ ] Confirmed sitemap status is "Success" in both tools
- [ ] Important pages requested for indexing
- [ ] Monitoring scheduled (monthly checks)

---

## Current Sitemap URL

```
https://propertycosts.com.au/sitemap.xml
```

**Last Updated**: Automatically regenerated on each deployment

**Total URLs**: Varies based on number of blog posts (static routes + dynamic blog posts × 2 locales)

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review search engine-specific help documentation
3. Verify your sitemap XML is valid using: https://www.xml-sitemaps.com/validate-xml-sitemap.html
4. Ensure your website is publicly accessible and not blocked by robots.txt



