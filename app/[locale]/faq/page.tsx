"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { ArrowRight, Calculator, AlertCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FAQSearch from "@/components/faq/FAQSearch";
import FAQNavigation from "@/components/faq/FAQNavigation";
import FAQCategory from "@/components/faq/FAQCategory";
import PopularQuestions from "@/components/faq/PopularQuestions";
import { getFAQData } from "@/lib/faq/faq-utils";
import { filterFAQs, getPopularQuestions } from "@/lib/faq/faq-search";
import {
  generateFAQPageSchema,
  generateBreadcrumbSchema,
  generateWebPageSchema,
  injectStructuredData,
} from "@/lib/faq/faq-schema";

export default function FAQPage() {
  const locale = useLocale();
  const allCategories = getFAQData();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  const [openQuestionId, setOpenQuestionId] = useState<string | undefined>();

  // Get popular questions
  const popularQuestions = useMemo(() => getPopularQuestions(allCategories, 6), [allCategories]);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    return filterFAQs(allCategories, {
      searchTerm: searchTerm.trim(),
      category: activeCategory,
    });
  }, [allCategories, searchTerm, activeCategory]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setActiveCategory(undefined); // Clear category filter when searching
  }, []);

  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      setActiveCategory(categoryId === activeCategory ? undefined : categoryId);
      setSearchTerm(""); // Clear search when clicking category
    },
    [activeCategory]
  );

  // Total questions count
  const totalQuestions = allCategories.reduce((sum, cat) => sum + cat.questions.length, 0);

  // Structured data
  const faqSchema = generateFAQPageSchema(allCategories);
  const breadcrumbSchema = generateBreadcrumbSchema(locale);
  const webPageSchema = generateWebPageSchema(locale);

  // Scroll to question from URL hash and auto-expand
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1);
      if (hash) {
        // Set the question as open
        setOpenQuestionId(hash);

        // Scroll to the element after a short delay
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    }
  }, []);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setOpenQuestionId(hash);
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={injectStructuredData(faqSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={injectStructuredData(breadcrumbSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={injectStructuredData(webPageSchema)}
      />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-6">
                <BookOpen className="h-4 w-4" />
                {totalQuestions}+ Questions Answered
              </div>

              <h1 className="text-4xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Everything you need to know about buying Australian property as a foreign investor
              </p>

              {/* Search Bar */}
              <FAQSearch
                onSearch={handleSearch}
                placeholder="Search FAQs... (e.g., 'FIRB approval', 'stamp duty', 'student visa')"
              />
            </div>
          </div>
        </section>

        {/* Category Navigation */}
        <FAQNavigation
          categories={allCategories}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {!searchTerm && !activeCategory && (
            <>
              {/* Popular Questions */}
              <PopularQuestions questions={popularQuestions} locale={locale} />

              {/* Info Banner */}
              <Alert className="mb-12 border-blue-400 bg-blue-50">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <AlertDescription className="text-gray-800">
                  <strong className="font-semibold">Need calculations?</strong> Use our FIRB
                  Calculator to get instant cost estimates for your property purchase.{" "}
                  <Link
                    href={`/${locale}/firb-calculator`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Calculate Now →
                  </Link>
                </AlertDescription>
              </Alert>
            </>
          )}

          {/* Search Results Info */}
          {searchTerm && searchTerm.length >= 2 && (
            <div className="mb-8">
              <p className="text-gray-600">
                Found{" "}
                <strong className="text-gray-900">
                  {filteredCategories.reduce((sum, cat) => sum + cat.questions.length, 0)}
                </strong>{" "}
                results for &ldquo;{searchTerm}&rdquo;
              </p>
            </div>
          )}

          {/* No Results */}
          {searchTerm && searchTerm.length >= 2 && filteredCategories.length === 0 && (
            <Card className="border border-gray-200 shadow-sm rounded bg-white">
              <CardContent className="p-6 text-center">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No results found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn&apos;t find any FAQs matching &ldquo;{searchTerm}&rdquo;
                </p>
                <Button variant="outline" onClick={() => setSearchTerm("")} className="rounded">
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          )}

          {/* FAQ Categories */}
          {filteredCategories.length > 0 && (
            <div className="space-y-8">
              {filteredCategories.map((category) => (
                <FAQCategory
                  key={category.id}
                  category={category}
                  defaultOpen={!!searchTerm}
                  openQuestionId={openQuestionId}
                />
              ))}
            </div>
          )}

          {/* CTA Section */}
          <section className="mt-16">
            <Card className="border border-gray-200 shadow-md rounded bg-blue-600">
              <CardContent className="p-6 text-center">
                <h2 className="text-3xl font-semibold text-white mb-4">
                  Ready to Calculate Your Fees?
                </h2>
                <p className="text-white/90 text-base mb-8 max-w-2xl mx-auto">
                  Get instant, accurate cost estimates for your Australian property purchase
                  including FIRB fees, stamp duty, and ongoing costs.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="rounded px-8 py-3 text-base font-medium"
                >
                  <Link href={`/${locale}/firb-calculator`}>
                    <Calculator className="h-5 w-5 mr-2" />
                    Calculate Fees Now
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Disclaimer */}
          <div className="mt-12 text-center text-sm text-gray-600 max-w-3xl mx-auto">
            <p className="leading-relaxed">
              <strong className="text-gray-900">Disclaimer:</strong> This information is general in
              nature and does not constitute professional advice. FIRB rules, fees, and requirements
              are subject to change. Always seek professional legal and financial advice for your
              specific circumstances. Last updated: January 2025.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
