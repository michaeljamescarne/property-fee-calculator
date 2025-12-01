/**
 * Printable Report Component
 * Browser-print friendly version of the FIRB analysis report
 */

"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { EligibilityResult } from "@/lib/firb/eligibility";
import { CostBreakdown } from "@/lib/firb/calculations";
import type { InvestmentAnalytics } from "@/types/investment";
import type { FIRBCalculatorFormData } from "@/lib/validations/firb";
import EligibilityResultCard from "./EligibilityResultCard";
import InvestmentSummary from "./InvestmentSummary";
import SensitivityAnalysis from "./SensitivityAnalysis";
import TaxAnalysis from "./TaxAnalysis";
import InvestmentScore from "./InvestmentScore";

interface PrintableReportProps {
  eligibility: EligibilityResult;
  costs: CostBreakdown;
  formData: FIRBCalculatorFormData;
  analytics?: InvestmentAnalytics;
}

export default function PrintableReport({
  eligibility,
  costs,
  formData,
  analytics,
}: PrintableReportProps) {
  const t = useTranslations("FIRBCalculator.results");

  // Add a state to track if we're in print mode
  const [isPrintMode, setIsPrintMode] = React.useState(false);

  // Listen for print events
  React.useEffect(() => {
    const handleBeforePrint = () => setIsPrintMode(true);
    const handleAfterPrint = () => setIsPrintMode(false);

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  const costSections = [
    {
      title: "Upfront Costs",
      items: [
        {
          label: "FIRB Fee",
          amount: costs.upfrontCosts?.firbFee || 0,
          description: "Foreign Investment Review Board application fee",
        },
        {
          label: "Stamp Duty",
          amount: costs.upfrontCosts?.stampDuty || 0,
          description: "State government transfer duty",
        },
        {
          label: "Foreign Buyer Surcharge",
          amount: costs.upfrontCosts?.foreignSurcharge || 0,
          description: "Additional surcharge for foreign buyers",
        },
        {
          label: "Legal Fees",
          amount: costs.upfrontCosts?.legalFees || 0,
          description: "Conveyancing and legal costs",
        },
        {
          label: "Inspection Fees",
          amount: costs.upfrontCosts?.inspectionFees || 0,
          description: "Building and pest inspections",
        },
        {
          label: "Loan Costs",
          amount: costs.upfrontCosts?.loanCosts || 0,
          description: "Loan establishment fees",
        },
      ],
    },
    {
      title: "Ongoing Costs",
      items: [
        {
          label: "Land Tax",
          amount: costs.ongoingCosts?.annualLandTax || 0,
          description: "Annual land tax assessment",
        },
        {
          label: "Council Rates",
          amount: costs.ongoingCosts?.councilRates || 0,
          description: "Local government rates",
        },
        {
          label: "Insurance",
          amount: costs.ongoingCosts?.insurance || 0,
          description: "Property and landlord insurance",
        },
        {
          label: "Maintenance",
          amount: costs.ongoingCosts?.maintenance || 0,
          description: "Property maintenance and repairs",
        },
        {
          label: "Vacancy Fee",
          amount: costs.ongoingCosts?.vacancyFee || 0,
          description: "Annual vacancy fee (if applicable)",
        },
      ],
    },
  ];

  return (
    <div
      className="print-container p-12 pt-16"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "210mm",
        minHeight: "297mm",
        zIndex: -1,
        opacity: 0.01,
        pointerEvents: "none",
      }}
    >
      <style jsx>{`
        @media print {
          .print-container {
            position: static !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            min-height: auto !important;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: auto !important;
            pointer-events: auto !important;
            display: block !important;
          }

          .print-page-break {
            page-break-before: always;
          }

          .print-avoid-break {
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Cover Page */}
      <div className="print-avoid-break">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">FIRB Investment Analysis Report</h1>
          <p className="text-xl text-muted-foreground mb-4">
            Comprehensive Property Investment Analysis
          </p>
          <p className="text-sm text-muted-foreground">
            Generated on {formatDate(new Date(), "en-AU")}
          </p>
        </div>

        {/* Property Summary */}
        <div className="mb-12 p-8 border rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Property Details</h2>
          <div className="grid grid-cols-2 gap-4">
            {formData.propertyAddress && (
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-semibold">{formData.propertyAddress}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Property Type</p>
              <p className="font-semibold">{formData.propertyType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Property Value</p>
              <p className="font-semibold">{formatCurrency(formData.propertyValue || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">State</p>
              <p className="font-semibold">{formData.state}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Citizenship Status</p>
              <p className="font-semibold">{formData.citizenshipStatus}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Entity Type</p>
              <p className="font-semibold">{formData.entityType}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Eligibility Section */}
      <div className="print-page-break print-avoid-break mt-16">
        <h2 className="text-2xl font-bold mb-6">Eligibility Assessment</h2>
        <EligibilityResultCard eligibility={eligibility} />
      </div>

      {/* Cost Breakdown */}
      <div className="print-page-break mt-16">
        <h2 className="text-2xl font-bold mb-6">Cost Breakdown</h2>

        {/* Total Investment */}
        <div className="mb-8 p-6 border rounded-lg bg-muted">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Investment Required</p>
              <p className="text-sm">Property price plus all upfront costs</p>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(costs.totalInvestmentCost)}</p>
          </div>
        </div>

        {/* Cost Sections */}
        {costSections.map((section, index) => (
          <div key={index} className="mb-8 print-avoid-break">
            <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex justify-between items-start p-4 border rounded"
                >
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.amount)}</p>
                </div>
              ))}
              {section.items.length > 1 && (
                <div className="flex justify-between items-center pt-3 border-t font-semibold">
                  <span>Subtotal</span>
                  <span>
                    {formatCurrency(section.items.reduce((sum, item) => sum + item.amount, 0))}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Ongoing Costs Summary */}
        <div className="mt-8 p-6 rounded-lg bg-muted">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Annual Ongoing Costs</p>
              <p className="text-sm text-muted-foreground">Estimated annual recurring expenses</p>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(costs.ongoingCosts?.total || 0)}</p>
          </div>
        </div>
      </div>

      {/* Investment Analytics */}
      {analytics && (
        <>
          <div className="print-page-break mt-16">
            <h2 className="text-2xl font-bold mb-6">Investment Performance Analysis</h2>
            <div className="print-avoid-break">
              <InvestmentSummary analytics={analytics} />
            </div>
          </div>

          <div className="print-page-break mt-16">
            <h2 className="text-2xl font-bold mb-6">Sensitivity & Risk Analysis</h2>
            <div className="print-avoid-break">
              <SensitivityAnalysis analytics={analytics} />
            </div>
          </div>

          <div className="print-page-break mt-16">
            <h2 className="text-2xl font-bold mb-6">Tax Analysis & Benefits</h2>
            <div className="print-avoid-break">
              <TaxAnalysis analytics={analytics} />
            </div>
          </div>

          <div className="print-page-break mt-16">
            <h2 className="text-2xl font-bold mb-6">Investment Score & Recommendation</h2>
            <div className="print-avoid-break">
              <InvestmentScore analytics={analytics} />
            </div>
          </div>
        </>
      )}

      {/* Disclaimer */}
      <div className="print-page-break mt-16">
        <h2 className="text-2xl font-bold mb-6">Important Disclaimer</h2>
        <div className="p-8 border rounded-lg">
          <p className="text-sm mb-4">
            The estimates and outputs generated by the PropertyCosts.com.au calculator are for
            illustrative and hypothetical purposes only. This information constitutes General Advice
            and does not take into account your personal objectives, financial situation, or needs.
            We have not considered whether the information or the hypothetical scenarios generated
            are suitable for your specific circumstances. The results must not be relied upon as
            professional legal, financial, or tax advice, and are not a substitute for consulting a
            qualified professional. Before making any property investment, finance, or legal
            decisions, you should seek independent advice from a licensed financial planner, tax
            professional, or legal practitioner.
          </p>
        </div>
      </div>
    </div>
  );
}
