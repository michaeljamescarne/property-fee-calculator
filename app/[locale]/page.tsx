import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Shield, FileText } from "lucide-react";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("HomePage");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            {t("title") || "Property Investment Analysis Platform"}
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {t("subtitle") ||
              "Comprehensive analysis for Australian property investments"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="rounded">
              <Link href={`/${locale}/firb-calculator`}>
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

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">
            Everything You Need to Make Informed Decisions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-600 transition-all cursor-pointer">
              <Calculator className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">Cost Calculator</h3>
              <p className="text-gray-600">
                Calculate all upfront and ongoing costs for your property
                investment
              </p>
            </div>
            <div className="p-6 bg-white rounded border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-600 transition-all cursor-pointer">
              <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">
                Investment Analysis
              </h3>
              <p className="text-gray-600">
                Get detailed ROI projections and cash flow analysis
              </p>
            </div>
            <div className="p-6 bg-white rounded border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-600 transition-all cursor-pointer">
              <Shield className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">FIRB Eligibility</h3>
              <p className="text-gray-600">
                Understand FIRB requirements and eligibility for your
                situation
              </p>
            </div>
            <div className="p-6 bg-white rounded border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-600 transition-all cursor-pointer">
              <FileText className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">Detailed Reports</h3>
              <p className="text-gray-600">
                Download comprehensive PDF reports with all your calculations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4 text-gray-900">
            Ready to Analyze Your Property Investment?
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Get started with our comprehensive calculator and receive detailed
            analysis in minutes.
          </p>
          <Button size="lg" asChild className="rounded">
            <Link href={`/${locale}/firb-calculator`}>Start Your Analysis</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
