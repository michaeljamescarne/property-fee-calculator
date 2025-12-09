/**
 * HubSpot API Client
 * 
 * Provides utilities for interacting with HubSpot APIs
 * Works with HubSpot Free Tier via Legacy Private Apps or New Developer Platform
 * 
 * Note: HubSpot has introduced a new developer platform (2025.2), but legacy
 * private apps are still fully supported and recommended for simple REST API integrations.
 * 
 * See: https://developers.hubspot.com/docs/apps/developer-platform/build-apps/overview
 */

const HUBSPOT_API_BASE = "https://api.hubapi.com";

interface HubSpotEvent {
  eventName: string;
  properties?: Record<string, string | number | boolean>;
  occurredAt?: number;
}

interface HubSpotContact {
  email: string;
  properties?: Record<string, string>;
}

/**
 * Get HubSpot access token from environment variables
 * 
 * Note: Uses legacy private app access token or new developer platform token.
 * Both work the same way for REST API calls.
 */
function getHubSpotApiKey(): string | null {
  // Environment variable name kept as HUBSPOT_API_KEY for backward compatibility
  // but it now stores the access token from private app or developer platform
  return process.env.HUBSPOT_API_KEY || null;
}

/**
 * Track a custom event in HubSpot
 * Uses HubSpot Events API (available on free tier)
 * 
 * @param eventName - Name of the event (e.g., "blog_post_view")
 * @param properties - Event properties (e.g., { post_slug: "firb-guide", post_category: "FIRB Guide" })
 * @param email - Optional contact email to associate event with
 */
export async function trackEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean>,
  email?: string
): Promise<boolean> {
  const apiKey = getHubSpotApiKey();
  
  if (!apiKey) {
    console.warn("HubSpot API key not configured. Event tracking skipped.");
    return false;
  }

  try {
    const event: HubSpotEvent = {
      eventName,
      properties: properties || {},
      occurredAt: Date.now(),
    };

    // HubSpot Events API v3 endpoint
    // Note: For free tier, we use the Events API which tracks events
    // The email parameter associates the event with a contact if provided
    const url = `${HUBSPOT_API_BASE}/events/v3/send?hapikey=${apiKey}`;

    // If email is provided, include it in the request
    const requestBody = email
      ? {
          ...event,
          email: email,
        }
      : event;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HubSpot event tracking failed:", response.status, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error tracking HubSpot event:", error);
    return false;
  }
}

/**
 * Track blog post view event
 */
export async function trackBlogPostView(
  slug: string,
  title: string,
  category: string,
  locale: string,
  email?: string
): Promise<boolean> {
  return trackEvent(
    "blog_post_view",
    {
      post_slug: slug,
      post_title: title,
      post_category: category,
      locale: locale,
      content_type: "blog_post",
    },
    email
  );
}

/**
 * Track blog post engagement (time on page, scroll depth)
 */
export async function trackBlogPostEngagement(
  slug: string,
  timeOnPage: number,
  scrollDepth: number,
  email?: string
): Promise<boolean> {
  return trackEvent(
    "blog_post_engagement",
    {
      post_slug: slug,
      time_on_page_seconds: timeOnPage,
      scroll_depth_percent: scrollDepth,
    },
    email
  );
}

/**
 * Track form submission from blog post
 */
export async function trackBlogFormSubmission(
  slug: string,
  formName: string,
  email: string
): Promise<boolean> {
  return trackEvent(
    "blog_form_submission",
    {
      post_slug: slug,
      form_name: formName,
    },
    email
  );
}

/**
 * Create or update a contact in HubSpot
 * Uses HubSpot Contacts API (available on free tier)
 */
export async function createOrUpdateContact(
  email: string,
  properties?: Record<string, string>
): Promise<boolean> {
  const apiKey = getHubSpotApiKey();
  
  if (!apiKey) {
    console.warn("HubSpot API key not configured. Contact creation skipped.");
    return false;
  }

  try {
    const contact: HubSpotContact = {
      email,
      properties: properties || {},
    };

    const url = `${HUBSPOT_API_BASE}/contacts/v1/contact/createOrUpdate/email/${encodeURIComponent(email)}?hapikey=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HubSpot contact creation failed:", response.status, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error creating HubSpot contact:", error);
    return false;
  }
}

/**
 * Check if HubSpot API is configured
 */
export function isHubSpotConfigured(): boolean {
  return !!getHubSpotApiKey();
}

