/**
 * Organization Schema.org Structured Data Generation
 * Creates Organization schema for the business/website
 */

import { BASE_URL } from "@/lib/utils/schema-base-url";

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Property Costs",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/logo.svg`,
      width: 200,
      height: 200,
    },
    description:
      "Free FIRB fee calculator and property investment analysis tools for foreign investors buying Australian property.",
    sameAs: [
      // Add social media profiles when available
      // "https://www.facebook.com/propertycosts",
      // "https://www.linkedin.com/company/propertycosts",
      // "https://twitter.com/propertycosts",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["en", "zh"],
    },
    areaServed: {
      "@type": "Country",
      name: "Australia",
    },
  };
}

/**
 * Inject structured data into HTML script tag
 */
export function injectStructuredData(schema: object) {
  return {
    __html: JSON.stringify(schema),
  };
}


