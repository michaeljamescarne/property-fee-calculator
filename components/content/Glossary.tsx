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
 * Default FIRB-related glossary terms
 */
export const defaultFIRBGlossary: GlossaryTerm[] = [
  {
    term: "FIRB",
    definition:
      "Foreign Investment Review Board. An Australian government body that reviews foreign investment proposals to ensure they benefit Australia.",
    relatedTerms: ["Foreign Investment", "Approval", "Application"],
  },
  {
    term: "Foreign Investment",
    definition:
      "Investment in Australian assets by individuals or entities that are not Australian citizens or permanent residents.",
    relatedTerms: ["FIRB", "Foreign Buyer", "Temporary Resident"],
  },
  {
    term: "Stamp Duty",
    definition:
      "A state tax levied on property purchases in Australia. Rates vary by state and property value.",
    relatedTerms: ["Foreign Surcharge", "Transfer Duty", "Property Tax"],
  },
  {
    term: "Foreign Surcharge",
    definition:
      "An additional stamp duty surcharge applied to foreign property buyers in most Australian states.",
    relatedTerms: ["Stamp Duty", "Foreign Buyer", "Surcharge"],
  },
  {
    term: "Land Tax Surcharge",
    definition:
      "An annual tax surcharge on land owned by foreign persons in certain Australian states.",
    relatedTerms: ["Land Tax", "Foreign Buyer", "Annual Costs"],
  },
  {
    term: "Vacancy Fee",
    definition:
      "An annual fee payable by foreign property owners if their property is not occupied or available for rent for at least 183 days per year.",
    relatedTerms: ["FIRB", "Foreign Buyer", "Annual Costs"],
  },
];
