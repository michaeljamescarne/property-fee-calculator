/**
 * Resend Email Client Configuration
 * Initializes the Resend client for sending transactional emails
 */

import { Resend } from "resend";

// Initialize Resend with placeholder at build time, will be validated at runtime
export const resend = new Resend(process.env.RESEND_API_KEY || "placeholder");

// Default email configuration
// For testing: Use onboarding@resend.dev (Resend's test email)
// For production: Verify your domain in Resend dashboard
export const EMAIL_CONFIG = {
  from: "Property Costs <onboarding@resend.dev>", // Resend's verified test domain
  replyTo: "support@propertyfeecalculator.com",
};
