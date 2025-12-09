/**
 * UTM Parameter Tracking Utility
 * Parses, stores, and tracks UTM parameters for campaign attribution
 */

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/**
 * Parse UTM parameters from URL
 */
export function parseUTMParams(): UTMParams {
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {};

  const utmKeys: (keyof UTMParams)[] = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];

  utmKeys.forEach((key) => {
    const value = params.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });

  return utmParams;
}

/**
 * Store UTM parameters in localStorage for session tracking
 */
export function storeUTMParams(params: UTMParams): void {
  if (typeof window === "undefined" || Object.keys(params).length === 0) {
    return;
  }

  try {
    // Store with timestamp
    const stored = {
      params,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("utm_params", JSON.stringify(stored));
  } catch (error) {
    console.error("Error storing UTM parameters:", error);
  }
}

/**
 * Get stored UTM parameters from localStorage
 */
export function getStoredUTMParams(): UTMParams | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem("utm_params");
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    const timestamp = new Date(parsed.timestamp);
    const now = new Date();

    // Expire after 30 days
    const daysDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 30) {
      localStorage.removeItem("utm_params");
      return null;
    }

    return parsed.params;
  } catch (error) {
    console.error("Error retrieving UTM parameters:", error);
    return null;
  }
}

/**
 * Initialize UTM tracking - parse from URL and store
 */
export function initializeUTMTracking(): UTMParams {
  const params = parseUTMParams();

  // If we have new UTM params, store them
  if (Object.keys(params).length > 0) {
    storeUTMParams(params);
  } else {
    // Otherwise, try to get stored params
    const stored = getStoredUTMParams();
    if (stored) {
      return stored;
    }
  }

  return params;
}

/**
 * Get UTM parameters for analytics events
 * Returns current URL params or stored params
 */
export function getUTMParamsForAnalytics(): UTMParams {
  const urlParams = parseUTMParams();

  // If URL has params, use those (they're more recent)
  if (Object.keys(urlParams).length > 0) {
    return urlParams;
  }

  // Otherwise, use stored params
  return getStoredUTMParams() || {};
}

/**
 * Format UTM params for analytics
 */
export function formatUTMForAnalytics(params: UTMParams): Record<string, string> {
  const formatted: Record<string, string> = {};

  if (params.utm_source) formatted.source = params.utm_source;
  if (params.utm_medium) formatted.medium = params.utm_medium;
  if (params.utm_campaign) formatted.campaign = params.utm_campaign;
  if (params.utm_term) formatted.term = params.utm_term;
  if (params.utm_content) formatted.content = params.utm_content;

  return formatted;
}



