/**
 * Address Parser Utility
 * Extracts suburb, state, and postcode from property addresses
 */

import type { AustralianState } from '@/lib/firb/constants';

export interface ParsedAddress {
  suburb?: string;
  state?: AustralianState;
  postcode?: string;
}

const STATE_ABBREVIATIONS: Record<string, AustralianState> = {
  'new south wales': 'NSW',
  'nsw': 'NSW',
  'victoria': 'VIC',
  'vic': 'VIC',
  'queensland': 'QLD',
  'qld': 'QLD',
  'south australia': 'SA',
  'sa': 'SA',
  'western australia': 'WA',
  'wa': 'WA',
  'tasmania': 'TAS',
  'tas': 'TAS',
  'australian capital territory': 'ACT',
  'act': 'ACT',
  'northern territory': 'NT',
  'nt': 'NT',
};

/**
 * Parse address string to extract suburb, state, and postcode
 */
export function parseAddress(address: string): ParsedAddress {
  if (!address || address.trim().length === 0) {
    return {};
  }

  const parts = address.split(',').map(p => p.trim()).filter(p => p.length > 0);
  const result: ParsedAddress = {};

  // Postcode is typically 4 digits, usually at the end
  const postcodeRegex = /\b(\d{4})\b/;
  const postcodeMatch = address.match(postcodeRegex);
  if (postcodeMatch) {
    result.postcode = postcodeMatch[1];
  }

  // Try to find state in the address
  const addressLower = address.toLowerCase();
  for (const [key, state] of Object.entries(STATE_ABBREVIATIONS)) {
    if (addressLower.includes(key)) {
      result.state = state;
      break;
    }
  }

  // Suburb is typically the second-to-last part (before state/postcode)
  // Or the last part if no state/postcode found
  if (parts.length >= 2) {
    // If we found postcode, suburb is likely before it
    if (result.postcode) {
      const postcodeIndex = parts.findIndex(p => p === result.postcode);
      if (postcodeIndex > 0) {
        result.suburb = parts[postcodeIndex - 1];
      }
    } else if (parts.length >= 2) {
      // No postcode, suburb might be second-to-last
      result.suburb = parts[parts.length - 2];
    }
  } else if (parts.length === 1 && !result.state && !result.postcode) {
    // Single part - might be suburb name
    result.suburb = parts[0];
  }

  return result;
}

/**
 * Extract suburb from address (simple version)
 */
export function extractSuburb(address: string): string | undefined {
  const parsed = parseAddress(address);
  return parsed.suburb;
}

/**
 * Extract state from address
 */
export function extractState(address: string): AustralianState | undefined {
  const parsed = parseAddress(address);
  return parsed.state;
}

/**
 * Extract postcode from address
 */
export function extractPostcode(address: string): string | undefined {
  const parsed = parseAddress(address);
  return parsed.postcode;
}

