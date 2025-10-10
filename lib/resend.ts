/**
 * Resend Email Client Configuration
 * Initializes the Resend client for sending transactional emails
 */

import { Resend } from 'resend';

// Initialize Resend with placeholder at build time, will be validated at runtime
export const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder');

// Default email configuration
export const EMAIL_CONFIG = {
  from: 'FIRB Calculator <noreply@propertyfeecalculator.com>', // Update with your verified domain
  replyTo: 'support@propertyfeecalculator.com', // Update with your support email
};

