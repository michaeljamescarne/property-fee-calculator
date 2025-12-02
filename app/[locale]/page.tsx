import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Shield, FileText, CheckCircle, Info } from "lucide-react";
import LeadCaptureForm from "@/components/lead/LeadCaptureForm";
import { getLocaleUrl } from "@/lib/utils/schema-base-url";
import { CustomAlert } from "@/components/ui/custom-alert";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";
  const baseUrl = "https://propertycosts.com.au";
  const url = getLocaleUrl(locale);
  const enUrl = getLocaleUrl("en");
  const zhUrl = getLocaleUrl("zh");

  const title = isZh
    ? "澳大利亚房产投资费用计算器 | FIRB费用、印花税、投资分析工具"
    : "Australian Property Investment Fee Calculator | FIRB Fees, Stamp Duty & Investment Analysis";

  const description = isZh
    ? "免费的澳大利亚房产投资费用计算器。计算FIRB申请费、印花税、土地税附加费、律师费等所有费用。提供详细的投资回报率分析、现金流预测和10年投资展望。"
    : "Free Australian property investment fee calculator. Calculate FIRB application fees, stamp duty, land tax surcharge, legal costs, and all property purchase expenses. Includes detailed ROI analysis, cash flow projections, and 10-year investment outlook.";

  return {
    title,
    description,
    keywords: isZh
      ? [
          "澳大利亚房产投资",
          "FIRB计算器",
          "印花税计算器",
          "房产投资费用",
          "外国投资审批",
          "澳洲买房成本",
          "投资回报率计算",
          "FIRB费用",
          "土地税附加费",
        ]
      : [
          "Australian property investment",
          "FIRB calculator",
          "stamp duty calculator",
          "property investment fees",
          "foreign investment approval",
          "buying property in Australia",
          "ROI calculator",
          "FIRB fees",
          "land tax surcharge",
          "property investment analysis",
          "foreign buyer costs",
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
            ? "成本明细表 - 总投资成本、前期费用和年度持续费用"
            : "Cost Breakdown - Total Investment Cost, Upfront Costs, and Annual Ongoing Costs",
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

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("HomePage");
  const tResults = await getTranslations("FIRBCalculator.results");

  const featureCards = [
    {
      id: "cost-calculator",
      icon: Calculator,
      title: t("features.costCalculator.title"),
      description: t("features.costCalculator.description"),
    },
    {
      id: "investment-analysis",
      icon: TrendingUp,
      title: t("features.investmentAnalysis.title"),
      description: t("features.investmentAnalysis.description"),
    },
    {
      id: "firb-eligibility",
      icon: Shield,
      title: t("features.firbEligibility.title"),
      description: t("features.firbEligibility.description"),
    },
    {
      id: "detailed-reports",
      icon: FileText,
      title: t("features.detailedReports.title"),
      description: t("features.detailedReports.description"),
    },
  ];

  const detailSections = [
    {
      id: "cost-calculator",
      heading: t("sections.costCalculator.heading"),
      label: featureCards[0].title,
      body: t("sections.costCalculator.body"),
      bullets: [
        t("sections.costCalculator.points.one"),
        t("sections.costCalculator.points.two"),
        t("sections.costCalculator.points.three"),
      ],
      image: {
        src: "/images/calculator-preview.png",
        alt:
          t("sections.costCalculator.imageAlt") ||
          "Cost Breakdown showing Total Investment Cost, Upfront Costs, and Annual Ongoing Costs",
        width: 720,
        height: 512,
      },
      ctaLabel: t("sections.costCalculator.cta"),
      ctaHref: `/${locale}/calculator`,
    },
    {
      id: "investment-analysis",
      heading: t("sections.investmentAnalysis.heading"),
      label: featureCards[1].title,
      body: t("sections.investmentAnalysis.body"),
      bullets: [
        t("sections.investmentAnalysis.points.one"),
        t("sections.investmentAnalysis.points.two"),
        t("sections.investmentAnalysis.points.three"),
      ],
      image: {
        src: "/images/analytics-dashboard-hero.png",
        alt: t("sections.investmentAnalysis.imageAlt"),
        width: 720,
        height: 512,
      },
      ctaLabel: t("sections.investmentAnalysis.cta"),
      ctaHref: `/${locale}/calculator`,
    },
    {
      id: "firb-eligibility",
      heading: t("sections.firbEligibility.heading"),
      label: featureCards[2].title,
      body: t("sections.firbEligibility.body"),
      bullets: [
        t("sections.firbEligibility.points.one"),
        t("sections.firbEligibility.points.two"),
        t("sections.firbEligibility.points.three"),
      ],
      image: {
        src: "/images/eligibility-screenshot.png",
        alt: t("sections.firbEligibility.imageAlt"),
        width: 720,
        height: 512,
      },
      ctaLabel: t("sections.firbEligibility.cta"),
      ctaHref: `/${locale}/faq`,
    },
    {
      id: "detailed-reports",
      heading: t("sections.detailedReports.heading"),
      label: featureCards[3].title,
      body: t("sections.detailedReports.body"),
      bullets: [
        t("sections.detailedReports.points.one"),
        t("sections.detailedReports.points.two"),
        t("sections.detailedReports.points.three"),
      ],
      image: {
        src: "/images/sample-report-page1.png",
        alt: t("sections.detailedReports.imageAlt"),
        width: 1998,
        height: 2122,
      },
      ctaLabel: t("sections.detailedReports.cta"),
      ctaHref: `/${locale}/calculator`,
    },
  ];

  return (
    <div className="min-h-screen scroll-smooth">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            {t("title") || "Australian Property Investment Analysis"}
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {t("subtitle") || "Comprehensive analysis for Australian property investments"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="rounded">
              <Link href={`/${locale}/calculator`}>
                <Calculator className="mr-2 h-5 w-5" />
                Start Calculator
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded">
              <Link href={`/${locale}/faq`}>Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Navigation */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">
            {t("features.sectionTitle")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((card) => (
              <a
                key={card.id}
                href={`#${card.id}`}
                className="group p-6 bg-white rounded border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <card.icon className="h-10 w-10 text-blue-600 mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 whitespace-nowrap">
                  {card.title}
                </h3>
                <p className="text-gray-600 mb-3">{card.description}</p>
                <span className="inline-flex items-center text-blue-600 font-semibold">
                  {t("features.learnMore")}
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Sections */}
      <div className="space-y-24 md:space-y-32 mt-16 md:mt-20">
        {detailSections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className="container mx-auto px-4 scroll-mt-28 md:scroll-mt-36"
            aria-labelledby={`${section.id}-heading`}
          >
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div className={index % 2 !== 0 ? "md:order-2" : ""}>
                <Image
                  src={section.image.src}
                  alt={section.image.alt}
                  width={section.image.width}
                  height={section.image.height}
                  className="rounded border border-gray-200 shadow-lg"
                  priority={index === 0}
                />
              </div>
              <div className={`space-y-6 ${index % 2 !== 0 ? "md:order-1" : ""}`}>
                <p className="text-sm font-semibold tracking-wide uppercase text-blue-600">
                  {section.label}
                </p>
                <h2
                  id={`${section.id}-heading`}
                  className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight"
                >
                  {section.heading}
                </h2>
                <p className="text-lg text-gray-600">{section.body}</p>
                <ul className="space-y-4">
                  {section.bullets.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className="rounded">
                  <Link href={section.ctaHref}>{section.ctaLabel}</Link>
                </Button>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* What is FIRB Section */}
      <section className="container mx-auto px-4 py-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
            {locale === "zh" ? "什么是FIRB？" : "What is FIRB?"}
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-4">
              {locale === "zh"
                ? "FIRB（外国投资审查委员会）是澳大利亚政府的一个机构，负责审查外国投资提案，确保这些投资符合国家利益。对于希望在澳大利亚购买房产的外国投资者，通常需要获得FIRB的批准。"
                : "FIRB (Foreign Investment Review Board) is an Australian government body responsible for reviewing foreign investment proposals to ensure they align with national interests. Foreign investors wishing to purchase property in Australia typically need to obtain FIRB approval."}
            </p>
            <p className="text-gray-600 mb-4">
              {locale === "zh"
                ? "FIRB申请过程涉及支付申请费，费用金额取决于房产价值。此外，外国买家还需要支付额外的印花税附加费和年度土地税附加费（在某些州）。"
                : "The FIRB application process involves paying an application fee, the amount of which depends on the property value. Additionally, foreign buyers are required to pay additional stamp duty surcharges and annual land tax surcharges (in certain states)."}
            </p>
            <p className="text-gray-600">
              {locale === "zh"
                ? "我们的免费计算器可以帮助您准确计算所有这些费用，让您在投资前充分了解总成本。"
                : "Our free calculator helps you accurately calculate all these costs, giving you a complete understanding of the total expenses before you invest."}
            </p>
          </div>
        </div>
      </section>

      {/* Lead Capture */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded shadow-sm px-8 py-12 text-center">
          <p className="text-sm font-semibold tracking-wide uppercase text-blue-600">
            {t("leadCapture.title")}
          </p>
          <p className="text-2xl md:text-3xl font-semibold text-gray-900 mt-3 mb-4">
            {t("leadCapture.description")}
          </p>
          <p className="text-gray-600 mb-8">
            {t("leadCapture.helper") ||
              "Get new insights, rate changes, and FIRB updates in your inbox."}
          </p>
          <div className="max-w-xl mx-auto">
            <LeadCaptureForm variant="inline" />
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <CustomAlert
            variant="default"
            icon={<Info className="h-4 w-4" />}
            title={tResults("disclaimer.title")}
          >
            <p className="text-sm">{tResults("disclaimer.content")}</p>
          </CustomAlert>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4 text-gray-900">
            Ready to Analyze Your Property Investment?
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Get started with our comprehensive calculator and receive detailed analysis in minutes.
          </p>
          <Button size="lg" asChild className="rounded">
            <Link href={`/${locale}/calculator`}>Start Your Analysis</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
