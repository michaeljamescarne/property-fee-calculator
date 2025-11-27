/**
 * Premium Content Access Control for PDF Generation
 * Future-proofing for tiered subscription model
 */

export type ContentTier = "free" | "standard" | "premium";

export interface UserSubscription {
  userId: string;
  tier: ContentTier;
  expiresAt: Date;
  features: string[];
}

export interface TierFeatures {
  executiveSummary: boolean;
  tableOfContents: boolean;
  propertyDetails: boolean;
  eligibilitySection: boolean;
  costBreakdown: boolean;
  investmentAnalysis: boolean;
  charts: boolean;
  projections: boolean;
  comparisons: boolean;
  sensitivityAnalysis: boolean;
  taxAnalysis: boolean;
  recommendations: boolean;
  glossary: boolean;
  disclaimer: boolean;
}

// Define what each tier includes
export const TIER_FEATURES: Record<ContentTier, TierFeatures> = {
  free: {
    executiveSummary: true,
    tableOfContents: false,
    propertyDetails: true,
    eligibilitySection: true,
    costBreakdown: false, // Obscured with upgrade prompt - show summary only
    investmentAnalysis: false,
    charts: false,
    projections: false,
    comparisons: false,
    sensitivityAnalysis: false,
    taxAnalysis: false,
    recommendations: false,
    glossary: true,
    disclaimer: true,
  },
  standard: {
    executiveSummary: true,
    tableOfContents: true,
    propertyDetails: true,
    eligibilitySection: true,
    costBreakdown: true,
    investmentAnalysis: true,
    charts: false, // Charts only in premium
    projections: true, // Table only, no chart
    comparisons: false,
    sensitivityAnalysis: false,
    taxAnalysis: true,
    recommendations: true,
    glossary: true,
    disclaimer: true,
  },
  premium: {
    // All features enabled
    executiveSummary: true,
    tableOfContents: true,
    propertyDetails: true,
    eligibilitySection: true,
    costBreakdown: true,
    investmentAnalysis: true,
    charts: true,
    projections: true,
    comparisons: true,
    sensitivityAnalysis: true,
    taxAnalysis: true,
    recommendations: true,
    glossary: true,
    disclaimer: true,
  },
};

/**
 * Check user's subscription tier
 * @param userId - User ID to check subscription for
 * @returns Content tier the user has access to
 *
 * @note Currently defaults to 'premium' for all users
 * @todo Implement when payment system is added:
 *  - Query database for user subscription
 *  - Check expiry date
 *  - Handle grace periods
 *  - Return actual tier based on subscription status
 */
export async function getUserContentTier(userId?: string): Promise<ContentTier> {
  // TODO: Implement when payment system is added
  // Example future implementation:
  //
  // if (!userId) return 'free';
  //
  // const subscription = await db.query(`
  //   SELECT tier, expires_at FROM user_subscriptions
  //   WHERE user_id = $1 AND expires_at > NOW()
  //   ORDER BY expires_at DESC LIMIT 1
  // `, [userId]);
  //
  // if (!subscription) return 'free';
  // return subscription.tier as ContentTier;

  // For now, return premium for all users
  console.log("[ContentAccess] getUserContentTier called for userId:", userId);
  return "premium";
}

/**
 * Helper to check if a specific feature is available for a tier
 * @param tier - Content tier to check
 * @param feature - Feature to check access for
 * @returns True if feature is available in this tier
 */
export function hasAccess(tier: ContentTier, feature: keyof TierFeatures): boolean {
  return TIER_FEATURES[tier]?.[feature] ?? false;
}

/**
 * Get tier display name
 * @param tier - Content tier
 * @returns Human-readable tier name
 */
export function getTierDisplayName(tier: ContentTier): string {
  const names: Record<ContentTier, string> = {
    free: "Free",
    standard: "Standard",
    premium: "Premium",
  };
  return names[tier];
}

/**
 * Get upgrade CTA text based on current tier
 * @param currentTier - Current content tier
 * @returns Call-to-action text for upgrading
 */
export function getUpgradeCTA(currentTier: ContentTier): string {
  if (currentTier === "free") {
    return "Upgrade to Standard or Premium to unlock full analysis";
  } else if (currentTier === "standard") {
    return "Upgrade to Premium for complete investment insights with charts";
  }
  return "";
}

/**
 * Database schema reference (for future implementation)
 *
 * CREATE TABLE user_subscriptions (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 *   tier VARCHAR(20) NOT NULL CHECK (tier IN ('free', 'standard', 'premium')),
 *   started_at TIMESTAMP NOT NULL DEFAULT NOW(),
 *   expires_at TIMESTAMP,
 *   auto_renew BOOLEAN DEFAULT false,
 *   payment_method_id VARCHAR(100),
 *   stripe_subscription_id VARCHAR(100),
 *   created_at TIMESTAMP DEFAULT NOW(),
 *   updated_at TIMESTAMP DEFAULT NOW(),
 *   UNIQUE(user_id, started_at)
 * );
 *
 * CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
 * CREATE INDEX idx_user_subscriptions_expires ON user_subscriptions(expires_at);
 */
