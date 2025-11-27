/**
 * Subscription & Pricing Types
 * Prepared for future payment integration
 */

import { SubscriptionStatus } from './database';

// Subscription tiers
export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';

// Subscription plan
export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  description: string;
  price: {
    monthly: number;
    annual: number;
  };
  features: string[];
  limits: {
    calculationsPerMonth: number | 'unlimited';
    savedCalculations: number | 'unlimited';
    pdfExports: boolean;
    prioritySupport: boolean;
    advancedAnalytics: boolean;
  };
}

// User subscription
export interface UserSubscription {
  userId: string;
  status: SubscriptionStatus;
  tier: SubscriptionTier;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

// Payment provider types (prepared for Stripe/Paddle)
export interface CheckoutSession {
  id: string;
  url: string;
  expiresAt: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
}

// Usage tracking
export interface UsageStats {
  userId: string;
  period: string; // YYYY-MM
  calculationsUsed: number;
  calculationsLimit: number | 'unlimited';
  pdfExportsUsed: number;
}













