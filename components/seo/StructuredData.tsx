/**
 * SEO Structured Data Components
 * Provides schema.org markup for better search engine understanding
 */

export function CalculatorSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FIRB Property Investment Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "AUD"
    },
    "description": "Free FIRB fee calculator for foreign investors purchasing Australian property. Calculate FIRB fees, stamp duty, and investment returns.",
    "featureList": [
      "FIRB eligibility check",
      "Stamp duty calculation by state",
      "Foreign surcharge calculations",
      "Investment analytics and ROI projections",
      "10-year property performance forecasts",
      "Cash flow analysis",
      "Equity growth projections"
    ],
    "url": "https://propertycosts.com.au",
    "provider": {
      "@type": "Organization",
      "name": "AU Property Investment"
    }
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AU Property Investment",
    "url": "https://propertycosts.com.au",
    "logo": "https://aupropertyinvestment.com/logo.png",
    "description": "Free FIRB calculator and investment analytics for foreign property investors in Australia",
    "sameAs": [
      // Add social media profiles when available
    ]
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

