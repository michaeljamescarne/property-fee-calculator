/**
 * Centralized base URL management for schema.org structured data
 * Ensures consistent domain usage across all schemas
 */

export const BASE_URL = "https://propertycosts.com.au";

/**
 * Get the full URL for a given path
 * @param path - Path relative to base URL (e.g., "/en/firb-calculator")
 * @returns Full URL
 */
export function getSchemaUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
}

/**
 * Get locale-specific URL
 * @param locale - Locale code (e.g., "en", "zh")
 * @param path - Path relative to locale (e.g., "firb-calculator")
 * @returns Full URL
 */
export function getLocaleUrl(locale: string, path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  if (cleanPath) {
    return `${BASE_URL}/${locale}/${cleanPath}`;
  }
  return `${BASE_URL}/${locale}`;
}
