/**
 * Calculator Schema.org Structured Data Generation
 * Creates SoftwareApplication, HowTo, and FAQ schemas for the FIRB calculator
 */

import { getLocaleUrl } from "@/lib/utils/schema-base-url";

const BASE_URL = "https://propertycosts.com.au";

/**
 * Generate SoftwareApplication schema for the calculator
 */
export function generateCalculatorSchema(locale: string) {
  const url = getLocaleUrl(locale, "firb-calculator");
  const isZh = locale === "zh";

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: isZh ? "FIRB计算器" : "FIRB Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "AUD",
    },
    description: isZh
      ? "免费的FIRB费用计算器，帮助外国投资者计算澳大利亚房产投资的所有费用，包括FIRB申请费、印花税、土地税附加费等。"
      : "Free FIRB fee calculator helping foreign investors calculate all costs for Australian property investment, including FIRB application fees, stamp duty, land tax surcharge, and more.",
    url,
    inLanguage: locale === "zh" ? "zh-CN" : "en-AU",
    featureList: isZh
      ? ["FIRB资格检查", "费用计算", "印花税计算", "投资回报率分析", "现金流预测", "10年投资展望"]
      : [
          "FIRB eligibility check",
          "Fee calculation",
          "Stamp duty calculation",
          "ROI analysis",
          "Cash flow projections",
          "10-year investment outlook",
        ],
    screenshot: `${BASE_URL}/images/calculator-preview.png`, // Cost Breakdown preview image
  };
}

/**
 * Generate HowTo schema for calculator steps
 */
export function generateCalculatorHowToSchema(locale: string) {
  const url = getLocaleUrl(locale, "firb-calculator");
  const isZh = locale === "zh";

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: isZh ? "如何使用FIRB计算器" : "How to Use the FIRB Calculator",
    description: isZh
      ? "分步指南：如何使用FIRB计算器计算澳大利亚房产投资的所有费用。"
      : "Step-by-step guide on how to use the FIRB calculator to calculate all costs for Australian property investment.",
    url,
    inLanguage: locale === "zh" ? "zh-CN" : "en-AU",
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
        name: isZh ? "选择公民身份状态" : "Select Citizenship Status",
        text: isZh
          ? "选择您的公民身份状态：澳大利亚公民、永久居民、临时居民或外国国民。"
          : "Select your citizenship status: Australian citizen, permanent resident, temporary resident, or foreign national.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: isZh ? "输入房产详情" : "Enter Property Details",
        text: isZh
          ? "输入房产类型、价值、所在州和地址（可选）。"
          : "Enter property type, value, state, and optional address.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: isZh ? "输入财务详情" : "Enter Financial Details",
        text: isZh
          ? "输入租金收入、贷款详情和其他成本（可选）。"
          : "Enter rental income, loan details, and other costs (optional).",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: isZh ? "查看结果" : "View Results",
        text: isZh
          ? "查看详细的费用明细、资格结果和投资分析。"
          : "View detailed cost breakdown, eligibility results, and investment analysis.",
      },
    ],
  };
}

/**
 * Generate FAQ schema for calculator-related questions
 */
export function generateCalculatorFAQSchema(locale: string) {
  const isZh = locale === "zh";
  const faqUrl = getLocaleUrl(locale, "faq");

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: isZh ? "FIRB计算器是免费的吗？" : "Is the FIRB calculator free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: isZh
            ? "是的，FIRB计算器完全免费使用，无需注册。"
            : "Yes, the FIRB calculator is completely free to use with no registration required.",
        },
      },
      {
        "@type": "Question",
        name: isZh
          ? "计算器支持哪些州和地区？"
          : "Which states and territories does the calculator support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: isZh
            ? "计算器支持所有澳大利亚州和地区：新南威尔士州、维多利亚州、昆士兰州、南澳大利亚州、西澳大利亚州、塔斯马尼亚州、澳大利亚首都领地和北领地。"
            : "The calculator supports all Australian states and territories: NSW, VIC, QLD, SA, WA, TAS, ACT, and NT.",
        },
      },
      {
        "@type": "Question",
        name: isZh ? "计算器需要多长时间？" : "How long does the calculator take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: isZh
            ? "通常需要3-5分钟完成所有步骤并获得详细结果。"
            : "Typically takes 3-5 minutes to complete all steps and receive detailed results.",
        },
      },
      {
        "@type": "Question",
        name: isZh ? "我可以保存或分享计算结果吗？" : "Can I save or share my calculation results?",
        acceptedAnswer: {
          "@type": "Answer",
          text: isZh
            ? "是的，您可以下载PDF报告或通过电子邮件发送结果。"
            : "Yes, you can download a PDF report or email the results to yourself.",
        },
      },
    ],
    url: faqUrl,
    inLanguage: locale === "zh" ? "zh-CN" : "en-AU",
  };
}

/**
 * Generate BreadcrumbList schema for calculator page
 */
export function generateCalculatorBreadcrumbSchema(locale: string) {
  const isZh = locale === "zh";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isZh ? "首页" : "Home",
        item: getLocaleUrl(locale),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isZh ? "FIRB计算器" : "FIRB Calculator",
        item: getLocaleUrl(locale, "firb-calculator"),
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
