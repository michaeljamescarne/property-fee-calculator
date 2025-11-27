/**
 * Paywall Feature Flags
 * Configuration for future pricing/paywall implementation
 *
 * NOTE: Paywall is NOT active yet. Set enabled: true when ready to launch.
 */

export const PAYWALL_CONFIG = {
  // Master switch - toggle to true when ready to launch pricing
  enabled: false,

  // Sections available to anonymous/free users
  freeSections: [
    "summary", // Investment Performance Summary
    "basic-projections", // Basic 10-year projections overview
    "inputs", // Investment parameters
  ],

  // Sections that require authentication/payment
  lockedSections: [
    "tax-analysis", // Tax Analysis & Deductions
    "sensitivity", // Sensitivity Analysis
    "comparison", // Investment Comparison
    "detailed-projections", // Detailed year-by-year breakdown
    "cash-flow", // Cash Flow Analysis
    "investment-score", // Investment Score & Verdict
  ],

  // Usage limits
  limits: {
    free: {
      calculationsPerMonth: 10,
      savedCalculations: 5,
      pdfExports: false,
      advancedAnalytics: false,
    },
    paid: {
      calculationsPerMonth: "unlimited" as const,
      savedCalculations: "unlimited" as const,
      pdfExports: true,
      advancedAnalytics: true,
    },
  },
};

/**
 * Check if a section is accessible
 */
export function isSectionAccessible(
  sectionId: string,
  isAuthenticated: boolean,
  isPaid: boolean = false
): boolean {
  // If paywall is disabled, everything is accessible
  if (!PAYWALL_CONFIG.enabled) {
    return true;
  }

  // Free sections are always accessible
  if (PAYWALL_CONFIG.freeSections.includes(sectionId)) {
    return true;
  }

  // Locked sections require authentication (and payment if implemented)
  if (PAYWALL_CONFIG.lockedSections.includes(sectionId)) {
    return isAuthenticated && (isPaid || !PAYWALL_CONFIG.enabled);
  }

  // Unknown sections default to accessible
  return true;
}

/**
 * Get paywall message for a locked section
 */
export function getPaywallMessage(sectionId: string, isAuthenticated: boolean): string {
  if (!isAuthenticated) {
    return "Login to unlock advanced analytics and save your calculations";
  }

  // Future: return payment message when pricing is enabled
  return "Upgrade to unlock this feature";
}

/**
 * Check if user has reached their usage limits
 */
export function hasReachedLimit(usageCount: number, limit: number | "unlimited"): boolean {
  if (!PAYWALL_CONFIG.enabled || limit === "unlimited") {
    return false;
  }

  return usageCount >= limit;
}
