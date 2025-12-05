import { NextIntlClientProvider } from "next-intl";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "../globals.css";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BetaBanner from "@/components/BetaBanner";
import { AuthProvider } from "@/components/auth/AuthProvider";
import AuthenticatedSidebar from "@/components/portal/AuthenticatedSidebar";
import MainContentWrapper from "@/components/portal/MainContentWrapper";
import { generateOrganizationSchema, injectStructuredData } from "@/lib/schema/organization-schema";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MetaPixel from "@/components/analytics/MetaPixel";
import HubSpotTracking from "@/components/analytics/HubSpotTracking";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";

  const baseUrl = "https://propertycosts.com.au";
  const enUrl = `${baseUrl}/en`;
  const zhUrl = `${baseUrl}/zh`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: isZh
        ? "FIRB计算器 - 澳大利亚房产投资费用计算 | 外国投资审批"
        : "FIRB Calculator - Australian Property Investment Fee Calculator",
      template: isZh ? "%s | FIRB计算器" : "%s | FIRB Calculator",
    },
    description: isZh
      ? "免费FIRB费用计算器，帮助外国投资者计算澳大利亚房产投资的所有费用、税收和FIRB申请要求。即时资格检查、详细成本分析、投资回报率预测。"
      : "Free FIRB fee calculator helping foreign investors calculate all costs, taxes, and FIRB application requirements for Australian property investment. Instant eligibility checks, detailed cost analysis, ROI projections.",
    keywords: [
      isZh ? "FIRB计算器" : "FIRB calculator",
      isZh ? "澳大利亚房产投资" : "Australian property investment",
      isZh ? "外国投资审批" : "foreign investment approval",
      isZh ? "FIRB费用" : "FIRB fees",
      isZh ? "印花税计算" : "stamp duty calculator",
      isZh ? "海外买家" : "foreign buyer",
      isZh ? "澳洲买房" : "buying property in Australia",
      isZh ? "房产投资回报率" : "property investment ROI",
      isZh ? "外籍人士买房" : "foreign national property purchase",
    ],
    alternates: {
      canonical: `${baseUrl}/${locale}`,
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
      url: `${baseUrl}/${locale}`,
      siteName: "Property Costs",
      title: isZh
        ? "FIRB计算器 - 澳大利亚房产投资费用计算"
        : "FIRB Calculator - Australian Property Investment Fee Calculator",
      description: isZh
        ? "免费FIRB费用计算器，帮助外国投资者计算澳大利亚房产投资的所有费用、税收和FIRB申请要求。"
        : "Free FIRB fee calculator helping foreign investors calculate all costs, taxes, and FIRB application requirements for Australian property investment.",
      images: [
        {
          url: `${baseUrl}/images/calculator-preview.png`,
          width: 1200,
          height: 630,
          alt: isZh
            ? "成本明细表 - 房产投资费用明细"
            : "Cost Breakdown - Property Investment Cost Details",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isZh
        ? "FIRB计算器 - 澳大利亚房产投资费用计算"
        : "FIRB Calculator - Australian Property Investment Fee Calculator",
      description: isZh
        ? "免费FIRB费用计算器，帮助外国投资者计算澳大利亚房产投资的所有费用。"
        : "Free FIRB fee calculator helping foreign investors calculate all costs for Australian property investment.",
      images: [`${baseUrl}/images/calculator-preview.png`],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure locale is valid, fallback to 'en'
  const validLocale = locale && ["en", "zh"].includes(locale) ? locale : "en";

  // Load messages directly
  const messages = await import(`../../messages/${validLocale}.json`);

  // Generate Organization schema
  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang={validLocale}>
      <head>
        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={injectStructuredData(organizationSchema)}
        />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages.default} locale={validLocale}>
          <AuthProvider>
            {/* Skip to content link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded focus:font-medium focus:shadow-lg"
            >
              Skip to main content
            </a>
            <div className="flex flex-col">
              <BetaBanner />
              <Navigation />
              <div className="flex min-h-screen">
                {/* Sidebar - only visible when authenticated */}
                <AuthenticatedSidebar />
                {/* Main Content - adjust padding when sidebar is visible */}
                <MainContentWrapper>{children}</MainContentWrapper>
              </div>
              <Footer />
            </div>
          </AuthProvider>
        </NextIntlClientProvider>
        <GoogleAnalytics />
        <MetaPixel />
        <HubSpotTracking />
      </body>
    </html>
  );
}
