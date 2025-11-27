import { NextIntlClientProvider } from "next-intl";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "../globals.css";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";
// GoogleAnalytics component - optional

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";

  return {
    metadataBase: new URL("https://propertycosts.com.au"),
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
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Ensure locale is valid, fallback to 'en'
  const validLocale = locale && ['en', 'zh'].includes(locale) ? locale : 'en';
  
  // Load messages directly
  const messages = await import(`../../messages/${validLocale}.json`);

  return (
    <html lang={validLocale}>
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
            <div className="flex flex-col min-h-screen">
              <Navigation />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </NextIntlClientProvider>
        {/* Google Analytics - add when component is available */}
      </body>
    </html>
  );
}
