/**
 * Calculator Schema.org Structured Data Generation
 * Creates SoftwareApplication schema for the FIRB Calculator tool
 */

import { BASE_URL } from "@/lib/utils/schema-base-url";

export interface CalculatorSchemaOptions {
  locale: string;
  title?: string;
  description?: string;
}

/**
 * Generate SoftwareApplication schema for FIRB Calculator
 */
export function generateCalculatorSchema(options: CalculatorSchemaOptions) {
  const { locale } = options;
  const url = `${BASE_URL}/${locale}/calculator`;

  const title =
    options.title ||
    (locale === "zh"
      ? "FIRB计算器 - 澳大利亚房产投资费用计算"
      : "FIRB Calculator - Australian Property Investment Fee Calculator");

  const description =
    options.description ||
    (locale === "zh"
      ? "免费FIRB费用计算器，帮助外国投资者计算澳大利亚房产投资的所有费用、税收和FIRB申请要求。即时资格检查、详细成本分析、投资回报率预测。"
      : "Free FIRB fee calculator helping foreign investors calculate all costs, taxes, and FIRB application requirements for Australian property investment. Instant eligibility checks, detailed cost analysis, ROI projections.");

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    description: description,
    url: url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0",
    releaseNotes: "Comprehensive FIRB fee calculator with eligibility checking and cost analysis",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "AUD",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2025-12-31",
    },
    featureList: [
      locale === "zh" ? "即时FIRB资格检查" : "Instant FIRB eligibility checking",
      locale === "zh" ? "详细成本明细分析" : "Detailed cost breakdown analysis",
      locale === "zh" ? "印花税和附加费计算" : "Stamp duty and surcharge calculations",
      locale === "zh" ? "投资回报率预测" : "Investment ROI projections",
      locale === "zh" ? "现金流分析" : "Cash flow analysis",
      locale === "zh" ? "10年投资展望" : "10-year investment outlook",
      locale === "zh" ? "PDF报告下载" : "PDF report downloads",
      locale === "zh" ? "邮件发送结果" : "Email results sharing",
    ],
    screenshot: `${BASE_URL}/images/calculator-preview.png`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
    author: {
      "@type": "Organization",
      name: "Property Costs",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Property Costs",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.svg`,
        width: 200,
        height: 200,
      },
    },
    inLanguage: locale === "zh" ? "zh-CN" : "en-AU",
    audience: {
      "@type": "Audience",
      audienceType: locale === "zh" ? "外国房产投资者" : "Foreign Property Investors",
      geographicArea: {
        "@type": "Country",
        name: "Australia",
      },
    },
    keywords: [
      locale === "zh" ? "FIRB计算器" : "FIRB calculator",
      locale === "zh" ? "澳大利亚房产投资" : "Australian property investment",
      locale === "zh" ? "外国投资审批" : "foreign investment approval",
      locale === "zh" ? "印花税计算" : "stamp duty calculator",
      locale === "zh" ? "房产投资费用" : "property investment costs",
    ],
  };
}

/**
 * Generate HowTo schema for calculator usage (alternative/complementary schema)
 */
export function generateCalculatorHowToSchema(locale: string) {
  const url = `${BASE_URL}/${locale}/calculator`;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name:
      locale === "zh"
        ? "如何使用FIRB计算器计算房产投资费用"
        : "How to Use the FIRB Calculator for Property Investment Costs",
    description:
      locale === "zh"
        ? "逐步指南：如何使用FIRB计算器计算澳大利亚房产投资的所有费用"
        : "Step-by-step guide on how to use the FIRB calculator to calculate all costs for Australian property investment",
    url: url,
    totalTime: "PT5M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "AUD",
      value: "0",
    },
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: locale === "zh" ? "选择公民身份状态" : "Select Citizenship Status",
        text:
          locale === "zh"
            ? "选择您的公民身份状态（澳大利亚公民、永久居民、临时居民或外国国民）"
            : "Select your citizenship status (Australian citizen, permanent resident, temporary resident, or foreign national)",
        url: `${url}#step-1`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: locale === "zh" ? "输入房产详情" : "Enter Property Details",
        text:
          locale === "zh" ? "输入房产类型、价值和所在州" : "Enter property type, value, and state",
        url: `${url}#step-2`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: locale === "zh" ? "输入财务详情" : "Enter Financial Details",
        text:
          locale === "zh"
            ? "输入首付百分比和其他财务信息"
            : "Enter deposit percentage and other financial information",
        url: `${url}#step-3`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: locale === "zh" ? "查看结果" : "View Results",
        text:
          locale === "zh"
            ? "查看详细的费用明细、资格检查和投资分析"
            : "View detailed cost breakdown, eligibility check, and investment analysis",
        url: `${url}#results`,
      },
    ],
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
