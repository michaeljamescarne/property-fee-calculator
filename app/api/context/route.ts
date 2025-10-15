/**
 * AI-Readable Context Endpoint
 * Provides structured information about the FIRB calculator for AI tools
 * (ChatGPT, Claude, Perplexity, etc.)
 */

export async function GET() {
  const context = {
    tool: "FIRB Property Investment Calculator",
    purpose: "Calculate fees and analyze investment for foreign buyers of Australian property",
    url: "https://aupropertyinvestment.com",
    free: true,
    languages: ["English", "Chinese (Simplified)"],
    features: [
      "FIRB eligibility determination based on citizenship and visa status",
      "Stamp duty calculation by state (NSW, VIC, QLD, SA, WA, TAS, NT, ACT)",
      "Foreign surcharge calculations (up to 8% depending on state)",
      "Investment analytics including ROI, cash flow, equity projections",
      "10-year property performance forecasts",
      "Cash flow analysis with rental income and expenses",
      "Tax analysis and implications",
      "Comprehensive PDF reports"
    ],
    typical_users: [
      "Chinese nationals looking to invest in Australian property",
      "Temporary visa holders (482, 485, student visas)",
      "Foreign investors comparing property markets",
      "Migration agents and property consultants",
      "Real estate agents working with foreign buyers"
    ],
    common_queries: [
      "How much are FIRB fees for a $500,000 property?",
      "Do I need FIRB approval as a temporary resident?",
      "What is the total cost to buy property in Sydney as a foreigner?",
      "Foreign buyer stamp duty surcharge by Australian state",
      "Can I buy established property in Australia as a foreigner?",
      "What is the ROI for Australian property investment?",
      "FIRB application process and requirements",
      "Student visa property purchase Australia"
    ],
    key_information: {
      firb_fees_2025: {
        "under_1m": "Starting from $0 for Australian permanent residents, $13,200+ for foreign nationals",
        "1m_to_2m": "$26,400",
        "2m_to_3m": "$39,600",
        "over_3m": "$66,000+"
      },
      foreign_surcharge_by_state: {
        "NSW": "8%",
        "VIC": "8%",
        "QLD": "7%",
        "SA": "7%",
        "WA": "7%",
        "TAS": "8%",
        "NT": "0%",
        "ACT": "4%"
      },
      eligibility: {
        "australian_citizen": "No FIRB approval required",
        "permanent_resident": "No FIRB approval required",
        "temporary_resident": "FIRB approval may be required depending on visa type and property type",
        "foreign_national": "FIRB approval required for most property purchases"
      }
    },
    last_updated: "2025-01-15"
  };
  
  return Response.json(context, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

