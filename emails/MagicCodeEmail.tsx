/**
 * Magic Code Email Template
 * Sent when user requests authentication
 */

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface MagicCodeEmailProps {
  code: string;
}

export default function MagicCodeEmail({ code }: MagicCodeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your login code: {code}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Login Code</Heading>

          <Text style={text}>Hello!</Text>

          <Text style={text}>Use the code below to log in to your Property Costs account:</Text>

          <Section style={codeBox}>
            <Text style={codeText}>{code}</Text>
          </Section>

          <Text style={text}>
            <strong>This code will expire in 10 minutes.</strong>
          </Text>

          <Text style={text}>
            If you didn&apos;t request this code, you can safely ignore this email.
          </Text>

          <Section style={footer}>
            <Text style={footerText}>
              This is an automated email from Property Costs. Please do not reply.
            </Text>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} Australian Property Investment. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
  borderRadius: "8px",
};

const h1 = {
  color: "#1e293b",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0 0 30px",
  textAlign: "center" as const,
};

const text = {
  color: "#334155",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "16px 0",
};

const codeBox = {
  background: "#f8fafc",
  border: "2px solid #6366f1",
  borderRadius: "8px",
  padding: "24px",
  textAlign: "center" as const,
  margin: "32px 0",
};

const codeText = {
  fontSize: "36px",
  fontWeight: "700",
  letterSpacing: "8px",
  color: "#6366f1",
  margin: "0",
  fontFamily: "monospace",
};

const footer = {
  marginTop: "32px",
  paddingTop: "24px",
  borderTop: "1px solid #e2e8f0",
};

const footerText = {
  color: "#64748b",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "4px 0",
  textAlign: "center" as const,
};
