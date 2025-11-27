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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            {t("title") || "Property Investment Analysis Platform"}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            {t("subtitle") ||
              "Comprehensive analysis for Australian property investments"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href={`/${locale}/firb-calculator`}>
                <Calculator className="mr-2 h-5 w-5" />
                Start Calculator
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`/${locale}/faq`}>Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Make Informed Decisions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-background rounded-lg border">
              <Calculator className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Cost Calculator</h3>
              <p className="text-muted-foreground">
                Calculate all upfront and ongoing costs for your property
                investment
              </p>
            </div>
            <div className="p-6 bg-background rounded-lg border">
              <TrendingUp className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Investment Analysis
              </h3>
              <p className="text-muted-foreground">
                Get detailed ROI projections and cash flow analysis
              </p>
            </div>
            <div className="p-6 bg-background rounded-lg border">
              <Shield className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">FIRB Eligibility</h3>
              <p className="text-muted-foreground">
                Understand FIRB requirements and eligibility for your
                situation
              </p>
            </div>
            <div className="p-6 bg-background rounded-lg border">
              <FileText className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Detailed Reports</h3>
              <p className="text-muted-foreground">
                Download comprehensive PDF reports with all your calculations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Analyze Your Property Investment?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get started with our comprehensive calculator and receive detailed
            analysis in minutes.
          </p>
          <Button size="lg" asChild>
            <Link href={`/${locale}/firb-calculator`}>Start Your Analysis</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
