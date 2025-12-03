/**
 * Resend Email Client Configuration
 * Initializes the Resend client for sending transactional emails
 */

import { Resend } from "resend";

// Initialize Resend with placeholder at build time, will be validated at runtime
export const resend = new Resend(process.env.RESEND_API_KEY || "placeholder");

/**
 * Get email configuration
 *
 * For production: Set RESEND_FROM_EMAIL environment variable to your verified domain email
 * Example: RESEND_FROM_EMAIL="Property Costs <noreply@propertycosts.com.au>"
 *
 * For testing: Uses onboarding@resend.dev (only works for account owner's verified email)
 *
 * To verify your domain:
 * 1. Go to https://resend.com/domains
 * 2. Add your domain (e.g., propertycosts.com.au)
 * 3. Add the DNS records provided by Resend to your domain
 * 4. Wait for verification (usually takes a few minutes)
 * 5. Set RESEND_FROM_EMAIL environment variable in Vercel
 */
export const EMAIL_CONFIG = {
  from: process.env.RESEND_FROM_EMAIL || "Property Costs <onboarding@resend.dev>", // Fallback to test domain
  replyTo: process.env.RESEND_REPLY_TO || "support@propertycosts.com.au",
};
