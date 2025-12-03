# Resend Email Setup Guide

## Current Issue

The application is currently using Resend's test domain (`onboarding@resend.dev`) which has limitations:

- ✅ **Works**: Only for sending emails to the account owner's verified email (`michaeljamescarne@gmail.com`)
- ❌ **Fails**: For any other email addresses with error:
  ```
  You can only send testing emails to your own email address.
  To send emails to other recipients, please verify a domain at resend.com/domains
  ```

## Solution: Verify Your Domain

To send emails to **any recipient**, you need to:

1. **Verify your domain** in Resend
2. **Set the `RESEND_FROM_EMAIL` environment variable** with your verified domain email

## Step-by-Step Setup

### Step 1: Verify Domain in Resend

1. Go to https://resend.com/domains
2. Click **"Add Domain"**
3. Enter your domain: `propertycosts.com.au`
4. Resend will provide DNS records to add:
   - **SPF Record**: `v=spf1 include:resend.com ~all`
   - **DKIM Records**: Multiple CNAME records (provided by Resend)
   - **DMARC Record** (optional but recommended)

5. Add these DNS records to your domain's DNS settings:
   - Log in to your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare)
   - Navigate to DNS management
   - Add the SPF, DKIM, and DMARC records provided by Resend
   - Wait for DNS propagation (usually 5-30 minutes)

6. Wait for verification:
   - Resend will automatically verify your domain once DNS records are detected
   - You'll see a green checkmark when verified

### Step 2: Set Environment Variable

Once your domain is verified, set the `RESEND_FROM_EMAIL` environment variable:

#### For Vercel Production:

1. Go to https://vercel.com/dashboard
2. Select your project: `property-fee-calculator`
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `RESEND_FROM_EMAIL`
   - **Value**: `Property Costs <noreply@propertycosts.com.au>`
   - **Environment**: Production (and Preview if desired)
5. Click **Save**
6. **Redeploy** your application for changes to take effect

#### For Local Development:

Add to `.env.local`:

```env
RESEND_FROM_EMAIL=Property Costs <noreply@propertycosts.com.au>
```

### Step 3: Verify It Works

1. Try logging in with a different email address (not `michaeljamescarne@gmail.com`)
2. The magic code email should be sent successfully
3. Check server logs - should see: `Magic code email sent successfully to: [email] Message ID: [id]`

## Configuration Details

### Current Configuration

The application now supports:

- **Environment Variable**: `RESEND_FROM_EMAIL` (optional)
- **Fallback**: If not set, uses `onboarding@resend.dev` (test domain, limited)
- **Reply-To**: `RESEND_REPLY_TO` (optional, defaults to `support@propertycosts.com.au`)

### Email Address Format

Use this format for `RESEND_FROM_EMAIL`:

```
Property Costs <noreply@propertycosts.com.au>
```

Or just the email:

```
noreply@propertycosts.com.au
```

### Recommended Email Addresses

For `propertycosts.com.au` domain:

- **From**: `noreply@propertycosts.com.au` or `Property Costs <noreply@propertycosts.com.au>`
- **Reply-To**: `support@propertycosts.com.au` (for user inquiries)

## Error Handling

The application now provides better error messages:

- **403 Validation Error**: Clear message about domain verification requirement
- **Test Mode Error**: Explains that test domain only works for account owner
- **Detailed Logging**: Server logs include full error details for debugging

## Troubleshooting

### Still Getting 403 Errors?

1. **Check domain verification status**:
   - Go to https://resend.com/domains
   - Ensure `propertycosts.com.au` shows as "Verified" ✅

2. **Verify DNS records**:
   - Use a DNS checker tool (e.g., https://mxtoolbox.com)
   - Ensure SPF and DKIM records are present and correct

3. **Check environment variable**:
   - In Vercel: Settings → Environment Variables
   - Ensure `RESEND_FROM_EMAIL` is set correctly
   - Ensure it's set for the correct environment (Production)

4. **Redeploy after changes**:
   - Environment variable changes require a redeploy
   - Go to Vercel → Deployments → Redeploy

### Email Not Sending?

1. **Check Resend API key**:
   - Ensure `RESEND_API_KEY` is set in Vercel
   - Verify the key is valid in Resend dashboard

2. **Check server logs**:
   - Look for Resend API errors
   - Check for domain verification messages

3. **Test with account owner email**:
   - Try `michaeljamescarne@gmail.com` first
   - If this works, domain verification is the issue

## Production Checklist

- [ ] Domain `propertycosts.com.au` verified in Resend
- [ ] DNS records (SPF, DKIM) added and verified
- [ ] `RESEND_FROM_EMAIL` environment variable set in Vercel
- [ ] `RESEND_REPLY_TO` environment variable set (optional)
- [ ] Application redeployed after environment variable changes
- [ ] Tested sending email to non-owner email address
- [ ] Verified emails are received (check spam folder)

## Additional Notes

- **Free Tier**: Resend free tier includes 3,000 emails/month
- **Rate Limits**: 100 emails/day on free tier
- **Email Validation**: The application validates email format before sending
- **Error Logging**: All email errors are logged with full details for debugging

## Related Files

- `lib/resend.ts` - Email configuration
- `app/api/auth/send-code/route.ts` - Magic code email sending
- `app/api/send-firb-results/route.ts` - FIRB results email sending
- `env.example.txt` - Environment variable examples
