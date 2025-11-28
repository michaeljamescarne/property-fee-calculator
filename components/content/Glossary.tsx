"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GlossaryTerm {
  term: string;
  definition: string;
  relatedTerms?: string[];
}

interface GlossaryProps {
  terms: GlossaryTerm[];
  locale?: string;
}

export default function Glossary({ terms, locale = "en" }: GlossaryProps) {
  const [openTerm, setOpenTerm] = useState<string | null>(null);

  const toggleTerm = (term: string) => {
    setOpenTerm(openTerm === term ? null : term);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          {locale === "zh" ? "术语表" : "Glossary"}
        </h3>
      </div>
      <div className="space-y-2">
        {terms.map((item) => (
          <div
            key={item.term}
            className="border border-gray-200 rounded bg-white"
            itemScope
            itemType="https://schema.org/DefinedTerm"
          >
            <Button
              variant="ghost"
              className="w-full justify-between p-4 h-auto"
              onClick={() => toggleTerm(item.term)}
            >
              <span className="font-semibold text-gray-900" itemProp="name">
                {item.term}
              </span>
              {openTerm === item.term ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </Button>
            {openTerm === item.term && (
              <div className="px-4 pb-4">
                <p className="text-gray-600" itemProp="description">
                  {item.definition}
                </p>
                {item.relatedTerms && item.relatedTerms.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">
                      {locale === "zh" ? "相关术语：" : "Related terms:"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.relatedTerms.map((related) => (
                        <span
                          key={related}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                        >
                          {related}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Comprehensive FIRB and property investment glossary terms
 * Based on official Australian property investment terminology
 */
export const defaultFIRBGlossary: GlossaryTerm[] = [
  // Regulatory & Compliance Terms
  {
    term: "FIRB",
    definition:
      "Foreign Investment Review Board. The Australian government body that reviews and manages non-sensitive foreign investment in Australia, including residential real estate acquisitions.",
    relatedTerms: ["Foreign Investment", "Approval", "Application", "Foreign Person"],
  },
  {
    term: "Foreign Acquisitions and Takeovers Act 1975",
    definition:
      "The primary Australian legislation that sets out the rules and requirements for foreign investment, which the FIRB and ATO administer.",
    relatedTerms: ["FIRB", "Regulation", "Compliance"],
  },
  {
    term: "Foreign Person",
    definition:
      "The legal definition of an individual, company, or trust required to seek FIRB approval before purchasing property in Australia.",
    relatedTerms: ["FIRB", "Foreign Investment", "Foreign Buyer"],
  },
  {
    term: "No Objection Notification",
    definition:
      "The official document issued by the government, typically by the Treasury or ATO, which confirms that a foreign investment proposal has been approved.",
    relatedTerms: ["FIRB", "Approval", "ATO"],
  },
  {
    term: "Non-compliance",
    definition:
      "The act of failing to adhere to the requirements of the Foreign Acquisitions and Takeovers Act 1975 or the conditions attached to a FIRB approval.",
    relatedTerms: ["FIRB", "Compliance", "Penalties"],
  },
  {
    term: "Divestment Order",
    definition:
      "A formal order issued by the Treasurer of Australia, or delegates in the Treasury/ATO, forcing a foreign owner to sell a property that was acquired or held in breach of the rules.",
    relatedTerms: ["FIRB", "Compliance", "Penalties"],
  },
  // Property and Residency Terms
  {
    term: "Temporary Resident Visa",
    definition:
      "A non-permanent visa status. For FIRB purposes, temporary residents face restrictions, such as being generally required to sell an established dwelling upon their visa expiry.",
    relatedTerms: ["Visa", "Temporary Resident", "Established Dwelling"],
  },
  {
    term: "Permanent Resident (PR)",
    definition:
      "A resident status that generally exempts the buyer from requiring FIRB approval and some foreign buyer surcharges.",
    relatedTerms: ["Residency", "Visa", "Exemption"],
  },
  {
    term: "Special Category Visa (Subclass 444)",
    definition:
      "A visa specifically for New Zealand citizens, who are generally treated as Australian residents for FIRB and stamp duty purposes, provided they meet certain residency conditions.",
    relatedTerms: ["Visa", "New Zealand", "Residency"],
  },
  {
    term: "Established Dwelling",
    definition:
      "A property that has previously been built and occupied. Purchases by temporary residents are highly restricted, often requiring the dwelling to be used as a principal place of residence and sold upon visa expiry.",
    relatedTerms: ["Property Type", "Temporary Resident", "New Dwelling"],
  },
  {
    term: "New Dwelling",
    definition:
      "A newly constructed residential property (or one sold as part of a development). FIRB rules for foreign persons buying these are generally more permissive than for established dwellings.",
    relatedTerms: ["Property Type", "Established Dwelling", "Development"],
  },
  {
    term: "Vacant Land",
    definition:
      "Land with no residential dwelling on it. Foreign investors buying vacant land must typically agree to construct a dwelling within a specified timeframe.",
    relatedTerms: ["Property Type", "Development", "Construction"],
  },
  {
    term: "Primary Residence",
    definition:
      "The owner's main place of residence. The definition is critical for FIRB conditions and for claiming the Main Residence Exemption from Capital Gains Tax (CGT).",
    relatedTerms: ["Residence", "CGT", "Exemption"],
  },
  // Fees, Taxes, and Costs
  {
    term: "FIRB Application Fee",
    definition:
      "The mandatory, non-refundable fee required when lodging a foreign investment application. The fee is tiered based on the value of the property being acquired.",
    relatedTerms: ["FIRB", "Fees", "Application"],
  },
  {
    term: "Stamp Duty",
    definition:
      "A state tax levied on property purchases in Australia. Rates vary by state and property value.",
    relatedTerms: ["Tax", "State Tax", "Transfer Duty"],
  },
  {
    term: "Stamp Duty Surcharge",
    definition:
      "Also known as Foreign Purchaser Additional Duty, this is a significant additional tax levied by state governments on foreign persons purchasing residential property, on top of the standard stamp duty.",
    relatedTerms: ["Stamp Duty", "Foreign Buyer", "Surcharge", "Foreign Surcharge"],
  },
  {
    term: "Foreign Surcharge",
    definition:
      "An additional stamp duty surcharge applied to foreign property buyers in most Australian states. Also known as Foreign Purchaser Additional Duty.",
    relatedTerms: ["Stamp Duty", "Foreign Buyer", "Surcharge", "Stamp Duty Surcharge"],
  },
  {
    term: "Land Tax Surcharge",
    definition:
      "An annual property tax levied by state governments on foreign owners of residential land (particularly investment properties), in addition to the standard land tax. Note: Rates and rules vary significantly by state.",
    relatedTerms: ["Land Tax", "Foreign Buyer", "Annual Costs", "State Tax"],
  },
  {
    term: "Vacancy Fee",
    definition:
      "An annual fee administered by the ATO imposed on foreign owners of residential dwellings if the property is not genuinely occupied or rented out for at least 183 days (approx. 6 months) in a year.",
    relatedTerms: ["FIRB", "Foreign Buyer", "Annual Costs", "ATO"],
  },
  {
    term: "Capital Gains Tax (CGT)",
    definition:
      "The tax paid on the profit realized when selling an investment property. The rules and exemptions are different for foreign residents compared to Australian residents.",
    relatedTerms: ["Tax", "Investment", "Property Sale", "Primary Residence"],
  },
  {
    term: "Withholding Tax on Property Sales (FRCGW)",
    definition:
      "Officially the Foreign Resident Capital Gains Withholding (FRCGW), this is an amount the purchaser must withhold from the sale price and pay to the ATO when the seller is a foreign resident.",
    relatedTerms: ["CGT", "Property Sale", "ATO", "Withholding"],
  },
  {
    term: "GST (Goods and Services Tax)",
    definition:
      "A 10% broad-based consumption tax that is generally included in the price of new residential property or vacant land subdivided for new housing.",
    relatedTerms: ["Tax", "New Dwelling", "Vacant Land"],
  },
  {
    term: "First-Home Buyer Concessions",
    definition:
      "State-based schemes offering discounts or exemptions on stamp duty. Foreign buyers may be excluded or subject to specific conditions when accessing these benefits.",
    relatedTerms: ["Stamp Duty", "Concessions", "First Home Buyer"],
  },
  {
    term: "Upfront Costs",
    definition:
      "The total cash amount required at the time of purchase, including the deposit, FIRB fee, stamp duty/surcharge, and legal fees.",
    relatedTerms: ["Costs", "Deposit", "FIRB Fee", "Stamp Duty"],
  },
  // Investment and Transaction Terms
  {
    term: "Off-the-plan Purchases",
    definition:
      "Buying a property based on floor plans and specifications before the building's construction is finished. States often offer stamp duty concessions on the construction value for these purchases.",
    relatedTerms: ["New Dwelling", "Development", "Construction", "Stamp Duty"],
  },
  {
    term: "Investment Analytics",
    definition:
      "The use of data-driven tools to project the financial viability of a property purchase, including cash flow and profitability over time.",
    relatedTerms: ["Investment", "ROI", "Cash Flow", "Analysis"],
  },
  {
    term: "ROI (Return on Investment)",
    definition:
      "A measure of the profitability of the investment, calculated as the gain from the investment relative to its cost.",
    relatedTerms: ["Investment", "Profitability", "Investment Analytics"],
  },
  {
    term: "Equity Growth",
    definition:
      "The increase in the ownership value of the property over time, calculated as the difference between the property's current market value and the outstanding loan balance.",
    relatedTerms: ["Investment", "Equity", "Property Value", "Loan"],
  },
  {
    term: "Mortgagee Sale",
    definition:
      "The forced sale of a property by the lender (mortgagee) to recover the outstanding debt from a defaulting borrower.",
    relatedTerms: ["Loan", "Mortgage", "Property Sale"],
  },
  {
    term: "Foreign Investment",
    definition:
      "Investment in Australian assets by individuals or entities that are not Australian citizens or permanent residents.",
    relatedTerms: ["FIRB", "Foreign Buyer", "Temporary Resident", "Foreign Person"],
  },
];
