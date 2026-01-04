/**
 * FIRB Results Email Template
 * Simple HTML email template for sending calculation results
 * Styled to match website design system
 */

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { EligibilityResult } from "@/lib/firb/eligibility";
import { CostBreakdown } from "@/lib/firb/calculations";
import type { FIRBCalculatorFormData } from "@/lib/validations/firb";
import type { InvestmentAnalytics } from "@/types/investment";
import { PropertyType, AustralianState } from "@/lib/firb/constants";

interface FIRBResultsEmailProps {
  name?: string;
  eligibility: EligibilityResult;
  costs: CostBreakdown;
  formData: FIRBCalculatorFormData;
  analytics?: InvestmentAnalytics;
  shareUrl: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercent = (value: number) => {
  return `${value.toFixed(2)}%`;
};

const getPropertyTypeLabel = (type: PropertyType): string => {
  const labels: Record<PropertyType, string> = {
    newDwelling: "New Dwelling",
    established: "Established Property",
    vacantLand: "Vacant Land",
    commercial: "Commercial Property",
  };
  return labels[type] || type;
};

const getStateLabel = (state: AustralianState): string => {
  const labels: Record<AustralianState, string> = {
    NSW: "New South Wales",
    VIC: "Victoria",
    QLD: "Queensland",
    SA: "South Australia",
    WA: "Western Australia",
    TAS: "Tasmania",
    ACT: "Australian Capital Territory",
    NT: "Northern Territory",
  };
  return labels[state] || state;
};

export default function FIRBResultsEmail({
  name,
  eligibility,
  costs,
  formData,
  analytics,
  shareUrl,
}: FIRBResultsEmailProps) {
  const previewText = `Your FIRB Calculator Results - ${eligibility.canPurchase ? "Eligible" : "Not Eligible"}`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://propertycosts.com.au";
  // Ensure logo URL is absolute and properly formatted for email clients
  const logoUrl = `${baseUrl.replace(/\/$/, "")}/logo.svg`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Link href={baseUrl} style={logoLink}>
              <Img src={logoUrl} alt="Property Costs" width="32" height="32" style={logo} />
              <Text style={logoText}>Property Costs</Text>
            </Link>
            <Heading style={h1}>Property Costs Analysis</Heading>
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

          {/* 1. Key Property Details */}
          <Section style={section}>
            <Heading style={h2}>Key Property Details</Heading>
            <div style={card}>
              <table style={infoTable}>
                <tbody>
                  {formData.propertyAddress && (
                    <tr style={tableRow}>
                      <td style={tableCellLabel}>Property Address:</td>
                      <td style={tableCellValue}>{formData.propertyAddress}</td>
                    </tr>
                  )}
                  <tr style={tableRow}>
                    <td style={tableCellLabel}>Property Value:</td>
                    <td style={tableCellValue}>{formatCurrency(formData.propertyValue || 0)}</td>
                  </tr>
                  <tr style={tableRow}>
                    <td style={tableCellLabel}>Property Type:</td>
                    <td style={tableCellValue}>
                      {formData.propertyType
                        ? getPropertyTypeLabel(formData.propertyType)
                        : "Not specified"}
                    </td>
                  </tr>
                  <tr style={tableRow}>
                    <td style={tableCellLabel}>State:</td>
                    <td style={tableCellValue}>
                      {formData.state ? getStateLabel(formData.state) : "Not specified"}
                    </td>
                  </tr>
                  {analytics?.rentalYield && (
                    <tr style={tableRow}>
                      <td style={tableCellLabel}>Usage:</td>
                      <td style={tableCellValue}>Investment Property</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Section>

          <Hr style={hr} />

          {/* 2. Investment Performance */}
          {analytics && analytics.rentalYield && (
            <>
              <Section style={section}>
                <Heading style={h2}>Investment Performance</Heading>
                <div style={card}>
                  <table style={infoTable}>
                    <tbody>
                      <tr style={tableRow}>
                        <td style={tableCellLabel}>Gross Rental Yield:</td>
                        <td style={tableCellValue}>
                          {formatPercent(analytics.rentalYield.gross * 100)}
                        </td>
                      </tr>
                      <tr style={tableRow}>
                        <td style={tableCellLabel}>Net Rental Yield:</td>
                        <td style={tableCellValue}>
                          {formatPercent(analytics.rentalYield.net * 100)}
                        </td>
                      </tr>
                      <tr style={tableRow}>
                        <td style={tableCellLabel}>Annualized ROI:</td>
                        <td style={tableCellValue}>
                          {formatPercent(analytics.roi?.annualizedROI || 0)}
                        </td>
                      </tr>
                      <tr style={tableRow}>
                        <td style={tableCellLabel}>Monthly Cash Flow:</td>
                        <td style={tableCellValue}>
                          {formatCurrency(analytics.cashFlow?.monthly?.netCashFlow || 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Section>
              <Hr style={hr} />
            </>
          )}

          {/* 3. FIRB Eligibility */}
          <Section style={section}>
            <Heading style={h2}>FIRB Eligibility</Heading>
            <div style={eligibility.canPurchase ? alertSuccess : alertWarning}>
              <Text style={alertText}>
                <strong>
                  {eligibility.canPurchase ? "✓ Eligible to Purchase" : "✗ Not Eligible"}
                </strong>
              </Text>
              {eligibility.requiresFIRB && (
                <Text style={alertText}>FIRB approval is required before purchase.</Text>
              )}
              {!eligibility.requiresFIRB && eligibility.canPurchase && (
                <Text style={alertText}>No FIRB approval required.</Text>
              )}
            </div>
            {eligibility.restrictions && eligibility.restrictions.length > 0 && (
              <div style={infoBox}>
                <Text style={infoText}>
                  <strong>Restrictions:</strong>
                </Text>
                <ul style={list}>
                  {eligibility.restrictions.map((restriction, index) => (
                    <li key={index} style={listItem}>
                      {restriction}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {eligibility.processingTimeline && (
              <div style={infoBox}>
                <Text style={infoText}>
                  <strong>Processing Timeline:</strong>
                </Text>
                <Text style={infoText}>Standard: {eligibility.processingTimeline.standard}</Text>
                <Text style={infoText}>
                  Expedited: {eligibility.processingTimeline.expedited} (double the fee)
                </Text>
              </div>
            )}
          </Section>

          <Hr style={hr} />

          {/* 4. Costs Summary */}
          <Section style={section}>
            <Heading style={h2}>Costs Summary</Heading>

            {/* Total Investment Cost */}
            <div style={totalBox}>
              <Text style={totalLabel}>Total Investment Cost</Text>
              <Text style={totalAmount}>{formatCurrency(costs.totalInvestmentCost)}</Text>
            </div>

            {/* Total Upfront Costs */}
            <Heading style={h3}>Total Upfront Costs</Heading>
            <div style={costBox}>
              <Text style={costAmount}>{formatCurrency(costs.upfrontCosts.total)}</Text>
            </div>

            {/* Investment Costs Breakdown */}
            <Heading style={h3}>Investment Costs</Heading>
            <div style={card}>
              <table style={table}>
                <tbody>
                  <tr style={tableRow}>
                    <td style={tableCellLeft}>Property Purchase Price</td>
                    <td style={tableCellRight}>
                      {formatCurrency(costs.upfrontCosts.propertyPrice)}
                    </td>
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
                </tbody>
              </table>
            </div>

            {/* Ongoing Costs */}
            <Heading style={h3}>Annual Ongoing Costs</Heading>
            <div style={costBox}>
              <Text style={costAmount}>{formatCurrency(costs.ongoingCosts.total)}</Text>
            </div>
          </Section>

          <Hr style={hr} />

          {/* 5. View Report Link */}
          <Section style={section}>
            <div style={linkBox}>
              <Text style={linkText}>
                <strong>View Full Report</strong>
              </Text>
              <Text style={linkDescription}>
                Access your complete calculation results, detailed breakdowns, and investment
                analytics.
              </Text>
              <Link href={shareUrl} style={linkButton}>
                View Report
              </Link>
            </div>
          </Section>

          {/* Disclaimer */}
          <Hr style={hr} />
          <Section style={section}>
            <Text style={disclaimer}>
              <strong>Important Disclaimer:</strong> The estimates and outputs generated by the
              PropertyCosts.com.au calculator are for illustrative and hypothetical purposes only.
              This information constitutes General Advice and does not take into account your
              personal objectives, financial situation, or needs. We have not considered whether the
              information or the hypothetical scenarios generated are suitable for your specific
              circumstances. The results must not be relied upon as professional legal, financial,
              or tax advice, and are not a substitute for consulting a qualified professional.
              Before making any property investment, finance, or legal decisions, you should seek
              independent advice from a licensed financial planner, tax professional, or legal
              practitioner.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Property Costs. All rights reserved.
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

// Styles - Matching website design system
// Colors: Primary #333333, Background #ffffff, Muted #f7f7f7, Border #ebebeb
// Font: Inter (with fallbacks)
// Border radius: 10px (0.625rem)

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
  borderRadius: "10px",
  border: "1px solid #ebebeb",
  overflow: "hidden",
};

const header = {
  padding: "32px 40px",
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #ebebeb",
  textAlign: "center" as const,
};

const logoLink = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  textDecoration: "none",
  marginBottom: "24px",
};

const logo = {
  display: "block",
  width: "32px",
  height: "32px",
};

const logoText = {
  color: "#333333",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const h1 = {
  color: "#333333",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0",
  padding: "0",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const section = {
  padding: "32px 40px",
  margin: "0",
};

const h2 = {
  color: "#333333",
  fontSize: "22px",
  fontWeight: "600",
  margin: "0 0 20px 0",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const h3 = {
  color: "#333333",
  fontSize: "18px",
  fontWeight: "600",
  margin: "24px 0 12px 0",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const text = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px 0",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const hr = {
  borderColor: "#ebebeb",
  borderWidth: "1px",
  borderStyle: "solid",
  borderTop: "none",
  borderLeft: "none",
  borderRight: "none",
  margin: "0",
};

const card = {
  backgroundColor: "#ffffff",
  border: "1px solid #ebebeb",
  borderRadius: "10px",
  padding: "20px",
  margin: "16px 0",
};

const alertSuccess = {
  backgroundColor: "#f0fdf4",
  border: "1px solid #86efac",
  borderRadius: "10px",
  padding: "16px",
  margin: "16px 0",
};

const alertWarning = {
  backgroundColor: "#fffbeb",
  border: "1px solid #fde047",
  borderRadius: "10px",
  padding: "16px",
  margin: "16px 0",
};

const alertText = {
  color: "#333333",
  fontSize: "15px",
  margin: "4px 0",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const infoBox = {
  backgroundColor: "#f7f7f7",
  borderRadius: "10px",
  padding: "16px",
  margin: "12px 0",
};

const infoText = {
  color: "#333333",
  fontSize: "14px",
  margin: "8px 0",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const infoTable = {
  width: "100%",
  margin: "0",
};

const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
  margin: "0",
};

const tableRow = {
  borderBottom: "1px solid #ebebeb",
};

const tableCellLabel = {
  padding: "12px 0",
  color: "#333333",
  fontSize: "14px",
  fontWeight: "600",
  width: "40%",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const tableCellValue = {
  padding: "12px 0",
  color: "#333333",
  fontSize: "14px",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const tableCellLeft = {
  padding: "12px 0",
  color: "#333333",
  fontSize: "14px",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const tableCellRight = {
  padding: "12px 0",
  color: "#333333",
  fontSize: "14px",
  textAlign: "right" as const,
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const totalBox = {
  backgroundColor: "#333333",
  borderRadius: "10px",
  padding: "24px",
  margin: "16px 0",
  textAlign: "center" as const,
};

const totalLabel = {
  color: "#ffffff",
  fontSize: "14px",
  margin: "0",
  fontWeight: "500",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const totalAmount = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "8px 0 0 0",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const costBox = {
  backgroundColor: "#f7f7f7",
  borderRadius: "10px",
  padding: "16px",
  margin: "12px 0",
  textAlign: "center" as const,
};

const costAmount = {
  color: "#333333",
  fontSize: "22px",
  fontWeight: "600",
  margin: "0",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const linkBox = {
  backgroundColor: "#f7f7f7",
  border: "1px solid #ebebeb",
  borderRadius: "10px",
  padding: "24px",
  margin: "16px 0",
  textAlign: "center" as const,
};

const linkText = {
  color: "#333333",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 8px 0",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const linkDescription = {
  color: "#666666",
  fontSize: "14px",
  margin: "0 0 20px 0",
  lineHeight: "20px",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const linkButton = {
  backgroundColor: "#333333",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  padding: "12px 24px",
  borderRadius: "10px",
  textDecoration: "none",
  display: "inline-block",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const list = {
  margin: "8px 0",
  paddingLeft: "20px",
};

const listItem = {
  color: "#333333",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "4px 0",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const disclaimer = {
  color: "#666666",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const footer = {
  padding: "32px 40px",
  margin: "0",
  textAlign: "center" as const,
  backgroundColor: "#f7f7f7",
  borderTop: "1px solid #ebebeb",
};

const footerText = {
  color: "#666666",
  fontSize: "12px",
  margin: "4px 0",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};
