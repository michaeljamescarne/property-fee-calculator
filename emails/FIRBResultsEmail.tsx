/**
 * FIRB Results Email Template
 * Professional HTML email template for sending calculation results
 */

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { EligibilityResult } from "@/lib/firb/eligibility";
import { CostBreakdown } from "@/lib/firb/calculations";

interface FIRBResultsEmailProps {
  name?: string;
  eligibility: EligibilityResult;
  costs: CostBreakdown;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function FIRBResultsEmail({ name, eligibility, costs }: FIRBResultsEmailProps) {
  const previewText = `Your FIRB Calculator Results - ${eligibility.canPurchase ? "Eligible" : "Not Eligible"}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>FIRB Investment Analysis</Heading>
            <Text style={headerSubtext}>Property Fee Calculator</Text>
          </Section>

          {/* Greeting */}
          <Section style={section}>
            <Text style={text}>{name ? `Dear ${name},` : "Hello,"}</Text>
            <Text style={text}>
              Thank you for using our FIRB Calculator. Below are your personalized calculation
              results.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Eligibility Summary */}
          <Section style={section}>
            <Heading style={h2}>Eligibility Summary</Heading>
            <div style={eligibility.canPurchase ? alertSuccess : alertWarning}>
              <Text style={alertText}>
                <strong>
                  {eligibility.canPurchase ? "✓ Eligible to Purchase" : "✗ Not Eligible"}
                </strong>
              </Text>
              {eligibility.requiresFIRB && (
                <Text style={alertText}>FIRB approval is required before purchase.</Text>
              )}
            </div>
          </Section>

          {/* Key Information */}
          {eligibility.processingTimeline && (
            <Section style={section}>
              <Heading style={h3}>FIRB Processing Timeline</Heading>
              <div style={infoBox}>
                <Text style={infoText}>
                  <strong>Standard Processing:</strong> {eligibility.processingTimeline.standard}
                </Text>
                <Text style={infoText}>
                  <strong>Expedited Processing:</strong> {eligibility.processingTimeline.expedited}{" "}
                  (double the fee)
                </Text>
              </div>
            </Section>
          )}

          <Hr style={hr} />

          {/* Cost Breakdown */}
          <Section style={section}>
            <Heading style={h2}>Investment Cost Summary</Heading>

            {/* Total Investment */}
            <div style={totalBox}>
              <Text style={totalLabel}>Total Investment Cost</Text>
              <Text style={totalAmount}>{formatCurrency(costs.totalInvestmentCost)}</Text>
            </div>

            {/* Upfront Costs */}
            <Heading style={h3}>Upfront Costs</Heading>
            <table style={table}>
              <tbody>
                <tr style={tableRow}>
                  <td style={tableCellLeft}>Property Purchase Price</td>
                  <td style={tableCellRight}>{formatCurrency(costs.upfrontCosts.propertyPrice)}</td>
                </tr>
                {costs.upfrontCosts.firbFee > 0 && (
                  <tr style={tableRow}>
                    <td style={tableCellLeft}>FIRB Application Fee</td>
                    <td style={tableCellRight}>{formatCurrency(costs.upfrontCosts.firbFee)}</td>
                  </tr>
                )}
                <tr style={tableRow}>
                  <td style={tableCellLeft}>Stamp Duty</td>
                  <td style={tableCellRight}>{formatCurrency(costs.upfrontCosts.stampDuty)}</td>
                </tr>
                {costs.upfrontCosts.foreignSurcharge > 0 && (
                  <tr style={tableRow}>
                    <td style={tableCellLeft}>Foreign Buyer Surcharge</td>
                    <td style={tableCellRight}>
                      {formatCurrency(costs.upfrontCosts.foreignSurcharge)}
                    </td>
                  </tr>
                )}
                <tr style={tableRow}>
                  <td style={tableCellLeft}>Legal & Conveyancing</td>
                  <td style={tableCellRight}>{formatCurrency(costs.upfrontCosts.legalFees)}</td>
                </tr>
                <tr style={tableRow}>
                  <td style={tableCellLeft}>Inspection Fees</td>
                  <td style={tableCellRight}>
                    {formatCurrency(costs.upfrontCosts.inspectionFees)}
                  </td>
                </tr>
                {costs.upfrontCosts.loanCosts > 0 && (
                  <tr style={tableRow}>
                    <td style={tableCellLeft}>Loan Establishment Costs</td>
                    <td style={tableCellRight}>{formatCurrency(costs.upfrontCosts.loanCosts)}</td>
                  </tr>
                )}
                <tr style={tableTotalRow}>
                  <td style={tableCellLeft}>
                    <strong>Total Upfront Costs</strong>
                  </td>
                  <td style={tableCellRight}>
                    <strong>{formatCurrency(costs.upfrontCosts.total)}</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Ongoing Costs */}
            <Heading style={h3}>Annual Ongoing Costs</Heading>
            <table style={table}>
              <tbody>
                {costs.ongoingCosts.annualLandTax > 0 && (
                  <tr style={tableRow}>
                    <td style={tableCellLeft}>Land Tax</td>
                    <td style={tableCellRight}>
                      {formatCurrency(costs.ongoingCosts.annualLandTax)}
                    </td>
                  </tr>
                )}
                <tr style={tableRow}>
                  <td style={tableCellLeft}>Council Rates</td>
                  <td style={tableCellRight}>{formatCurrency(costs.ongoingCosts.councilRates)}</td>
                </tr>
                <tr style={tableRow}>
                  <td style={tableCellLeft}>Insurance</td>
                  <td style={tableCellRight}>{formatCurrency(costs.ongoingCosts.insurance)}</td>
                </tr>
                <tr style={tableRow}>
                  <td style={tableCellLeft}>Maintenance</td>
                  <td style={tableCellRight}>{formatCurrency(costs.ongoingCosts.maintenance)}</td>
                </tr>
                <tr style={tableTotalRow}>
                  <td style={tableCellLeft}>
                    <strong>Total Annual Costs</strong>
                  </td>
                  <td style={tableCellRight}>
                    <strong>{formatCurrency(costs.ongoingCosts.total)}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Restrictions */}
          {eligibility.restrictions && eligibility.restrictions.length > 0 && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading style={h3}>Important Restrictions</Heading>
                <ul style={list}>
                  {eligibility.restrictions.map((restriction, index) => (
                    <li key={index} style={listItem}>
                      {restriction}
                    </li>
                  ))}
                </ul>
              </Section>
            </>
          )}

          {/* Disclaimer */}
          <Hr style={hr} />
          <Section style={section}>
            <Text style={disclaimer}>
              <strong>Important Disclaimer:</strong> This calculator provides estimates only and
              should not be considered financial or legal advice. Actual costs may vary. FIRB
              regulations are subject to change. We strongly recommend consulting with qualified
              professionals including lawyers, accountants, and FIRB specialists before making any
              property investment decisions.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Property Fee Calculator. All rights reserved.
            </Text>
            <Text style={footerText}>
              This is an automated email. Please do not reply to this message.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 40px",
  backgroundColor: "#3B82F6",
  textAlign: "center" as const,
};

const h1 = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0",
  padding: "0",
};

const headerSubtext = {
  color: "#ffffff",
  fontSize: "16px",
  margin: "8px 0 0 0",
};

const section = {
  padding: "0 40px",
  margin: "24px 0",
};

const h2 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "24px 0 16px 0",
};

const h3 = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "20px 0 12px 0",
};

const text = {
  color: "#484848",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const alertSuccess = {
  backgroundColor: "#d1fae5",
  border: "2px solid #10b981",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
};

const alertWarning = {
  backgroundColor: "#fef3c7",
  border: "2px solid #f59e0b",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
};

const alertText = {
  color: "#1a1a1a",
  fontSize: "16px",
  margin: "4px 0",
};

const infoBox = {
  backgroundColor: "#f3f4f6",
  borderRadius: "8px",
  padding: "16px",
  margin: "12px 0",
};

const infoText = {
  color: "#484848",
  fontSize: "14px",
  margin: "8px 0",
};

const totalBox = {
  backgroundColor: "#3B82F6",
  borderRadius: "8px",
  padding: "24px",
  margin: "16px 0",
  textAlign: "center" as const,
};

const totalLabel = {
  color: "#ffffff",
  fontSize: "14px",
  margin: "0",
};

const totalAmount = {
  color: "#ffffff",
  fontSize: "36px",
  fontWeight: "bold",
  margin: "8px 0 0 0",
};

const table = {
  width: "100%",
  border: "1px solid #e6ebf1",
  borderRadius: "8px",
  margin: "16px 0",
};

const tableRow = {
  borderBottom: "1px solid #e6ebf1",
};

const tableTotalRow = {
  backgroundColor: "#f9fafb",
};

const tableCellLeft = {
  padding: "12px 16px",
  color: "#484848",
  fontSize: "14px",
};

const tableCellRight = {
  padding: "12px 16px",
  color: "#484848",
  fontSize: "14px",
  textAlign: "right" as const,
};

const list = {
  margin: "12px 0",
  paddingLeft: "20px",
};

const listItem = {
  color: "#484848",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 0",
};

const disclaimer = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "20px",
  margin: "16px 0",
};

const footer = {
  padding: "0 40px",
  margin: "32px 0 0 0",
  textAlign: "center" as const,
};

const footerText = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "4px 0",
};
