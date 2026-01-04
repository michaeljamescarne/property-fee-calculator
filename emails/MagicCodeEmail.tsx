/**
 * Magic Code Email Template
 * Sent when user requests authentication
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

interface MagicCodeEmailProps {
  code: string;
}

export default function MagicCodeEmail({ code }: MagicCodeEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://propertycosts.com.au";
  const logoUrl = `${baseUrl}/logo.svg`;

  return (
    <Html>
      <Head />
      <Preview>Your login code: {code}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Link href={baseUrl} style={logoLink}>
              <Img src={logoUrl} alt="Property Costs" width="32" height="32" style={logo} />
              <Text style={logoText}>Property Costs</Text>
            </Link>
            <Heading style={h1}>Your Login Code</Heading>
          </Section>

          {/* Greeting */}
          <Section style={section}>
            <Text style={text}>Hello!</Text>
            <Text style={text}>Use the code below to log in to your Property Costs account:</Text>
          </Section>

          {/* Code Box */}
          <Section style={codeBoxWrapper}>
            <Section style={codeBox}>
              <Text style={codeText}>{code}</Text>
            </Section>
          </Section>

          {/* Instructions */}
          <Section style={section}>
            <Text style={text}>
              <strong>This code will expire in 10 minutes.</strong>
            </Text>
            <Text style={text}>
              If you didn&apos;t request this code, you can safely ignore this email.
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
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

const text = {
  color: "#333333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px 0",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const codeBoxWrapper = {
  padding: "0 40px",
  margin: "24px 0",
};

const codeBox = {
  backgroundColor: "#f7f7f7",
  border: "1px solid #ebebeb",
  borderRadius: "10px",
  padding: "32px 24px",
  textAlign: "center" as const,
  margin: "0",
};

const codeText = {
  fontSize: "40px",
  fontWeight: "bold",
  letterSpacing: "12px",
  color: "#333333",
  margin: "0",
  fontFamily: 'Inter, "Courier New", monospace',
  lineHeight: "1.2",
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
