'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, Calculator, AlertCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FAQSearch from '@/components/faq/FAQSearch';
import FAQNavigation from '@/components/faq/FAQNavigation';
import FAQCategory from '@/components/faq/FAQCategory';
import PopularQuestions from '@/components/faq/PopularQuestions';
import { getFAQData } from '@/lib/faq/faq-utils';
import { filterFAQs, getPopularQuestions } from '@/lib/faq/faq-search';
import { generateFAQPageSchema, generateBreadcrumbSchema, generateWebPageSchema, injectStructuredData } from '@/lib/faq/faq-schema';

export default function FAQPage() {
  const locale = useLocale();
  const allCategories = getFAQData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | undefined>();

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

  const handleCategoryClick = useCallback((categoryId: string) => {
    setActiveCategory(categoryId === activeCategory ? undefined : categoryId);
    setSearchTerm(''); // Clear search when clicking category
  }, [activeCategory]);

  // Total questions count
  const totalQuestions = allCategories.reduce((sum, cat) => sum + cat.questions.length, 0);

  // Structured data
  const faqSchema = generateFAQPageSchema(allCategories);
  const breadcrumbSchema = generateBreadcrumbSchema(locale);
  const webPageSchema = generateWebPageSchema(locale);

  // Scroll to question from URL hash
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 500);
      }
    }
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

      <main className="min-h-screen bg-muted">
        {/* Hero Section */}
        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                <BookOpen className="h-4 w-4" />
                {totalQuestions}+ Questions Answered
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Frequently Asked Questions
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
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
              <Alert className="mb-12 border-primary/20 bg-primary/5">
                <AlertCircle className="h-5 w-5 text-primary" />
                <AlertDescription className="text-foreground/80">
                  <strong className="font-semibold">Need calculations?</strong> Use our FIRB Calculator to get instant cost estimates for your property purchase.
                  {' '}
                  <Link href={`/${locale}/firb-calculator`} className="text-primary hover:underline font-medium">
                    Calculate Now →
                  </Link>
                </AlertDescription>
              </Alert>
            </>
          )}

          {/* Search Results Info */}
          {searchTerm && searchTerm.length >= 2 && (
            <div className="mb-8">
              <p className="text-foreground/70">
                Found <strong className="text-foreground">{filteredCategories.reduce((sum, cat) => sum + cat.questions.length, 0)}</strong> results for &ldquo;{searchTerm}&rdquo;
              </p>
            </div>
          )}

          {/* No Results */}
          {searchTerm && searchTerm.length >= 2 && filteredCategories.length === 0 && (
            <Card className="border-none shadow-sm rounded-2xl bg-white">
              <CardContent className="p-12 text-center">
                <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn&apos;t find any FAQs matching &ldquo;{searchTerm}&rdquo;
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm('')}
                  className="rounded-lg"
                >
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
                />
              ))}
            </div>
          )}

          {/* CTA Section */}
          <section className="mt-16">
            <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-accent to-primary">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Calculate Your Fees?
                </h2>
                <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                  Get instant, accurate cost estimates for your Australian property purchase including FIRB fees, stamp duty, and ongoing costs.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="rounded-xl px-8 py-6 text-base font-semibold shadow-xl"
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
          <div className="mt-12 text-center text-sm text-muted-foreground max-w-3xl mx-auto">
            <p className="leading-relaxed">
              <strong className="text-foreground">Disclaimer:</strong> This information is general in nature and does not constitute professional advice. FIRB rules, fees, and requirements are subject to change. Always seek professional legal and financial advice for your specific circumstances. Last updated: January 2025.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

