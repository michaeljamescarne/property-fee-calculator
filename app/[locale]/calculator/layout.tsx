import type { Metadata } from "next";
import { getLocaleUrl } from "@/lib/utils/schema-base-url";
import {
  generateCalculatorSchema,
  generateCalculatorHowToSchema,
  generateCalculatorFAQSchema,
  generateCalculatorBreadcrumbSchema,
  injectStructuredData,
} from "@/lib/firb/calculator-schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";
  const baseUrl = "https://propertycosts.com.au";
  const url = getLocaleUrl(locale, "calculator");
  const enUrl = getLocaleUrl("en", "calculator");
  const zhUrl = getLocaleUrl("zh", "calculator");

  const title = isZh
    ? "FIRB计算器 - 免费在线计算澳大利亚房产投资费用 | 印花税、FIRB费用计算"
    : "FIRB Calculator - Free Online Australian Property Investment Fee Calculator | Stamp Duty & FIRB Fees";

  const description = isZh
    ? "免费FIRB费用计算器，即时计算澳大利亚房产投资的所有费用：FIRB申请费、印花税、土地税附加费、律师费、过户费等。支持所有州和地区，包括首次购房者优惠。"
    : "Free FIRB fee calculator. Instantly calculate all costs for Australian property investment: FIRB application fees, stamp duty, land tax surcharge, legal fees, transfer costs, and more. Supports all states and territories, including first home buyer concessions.";

  return {
    title,
    description,
    keywords: isZh
      ? [
          "FIRB计算器",
          "澳大利亚房产投资计算器",
          "印花税计算器",
          "FIRB费用计算",
          "海外买家费用",
          "澳洲买房成本",
          "外国投资审批费用",
          "土地税附加费计算",
          "房产过户费用",
          "FIRB申请费",
        ]
      : [
          "FIRB calculator",
          "Australian property investment calculator",
          "stamp duty calculator",
          "FIRB fees calculator",
          "foreign buyer costs",
          "buying property in Australia",
          "foreign investment approval fees",
          "land tax surcharge calculator",
          "property transfer costs",
          "FIRB application fee",
          "stamp duty surcharge",
          "property investment costs",
        ],
    alternates: {
      canonical: url,
      languages: {
        "en-AU": enUrl,
        en: enUrl,
        "zh-CN": zhUrl,
        zh: zhUrl,
        "x-default": enUrl,
      },
    },
    openGraph: {
      type: "website",
      locale: isZh ? "zh_CN" : "en_AU",
      alternateLocale: isZh ? "en_AU" : "zh_CN",
      url,
      siteName: "Property Costs",
      title,
      description,
      images: [
        {
          url: `${baseUrl}/images/calculator-preview.png`,
          width: 1200,
          height: 630,
          alt: isZh
            ? "成本明细表 - FIRB费用、印花税和年度费用明细"
            : "Cost Breakdown - FIRB Fees, Stamp Duty, and Annual Costs Details",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/images/calculator-preview.png`],
    },
  };
}

export default async function FIRBCalculatorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(locale);
  const howToSchema = generateCalculatorHowToSchema(locale);
  const faqSchema = generateCalculatorFAQSchema(locale);
  const breadcrumbSchema = generateCalculatorBreadcrumbSchema(locale);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={injectStructuredData(calculatorSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={injectStructuredData(howToSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={injectStructuredData(faqSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={injectStructuredData(breadcrumbSchema)}
      />
      {children}
    </>
  );
}



