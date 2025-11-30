"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { BookOpen, Calculator, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BlogSearch from "@/components/blog/BlogSearch";
import BlogNavigation from "@/components/blog/BlogNavigation";
import BlogCard from "@/components/blog/BlogCard";
import type { BlogPost } from "@/lib/blogContentProcessor";
import { filterBlogPosts, getCategories, getPopularPosts } from "@/lib/blog/blog-search";

interface BlogPageClientProps {
  posts: BlogPost[];
  locale: string;
}

export default function BlogPageClient({ posts, locale }: BlogPageClientProps) {
  const allPosts = posts;
  const categories = getCategories(allPosts);
  const popularPosts = useMemo(() => getPopularPosts(allPosts, 3), [allPosts]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return filterBlogPosts(allPosts, {
      searchTerm: searchTerm.trim(),
      category: activeCategory || undefined,
    });
  }, [allPosts, searchTerm, activeCategory]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setActiveCategory(""); // Clear category filter when searching
  }, []);

  const handleCategoryClick = useCallback(
    (category: string) => {
      setActiveCategory(category === activeCategory ? "" : category);
      setSearchTerm(""); // Clear search when clicking category
    },
    [activeCategory]
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" />
              {allPosts.length} Articles
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Property Investment Blog
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Expert guides and insights on Australian property investment, FIRB requirements, stamp
              duty, and foreign buyer regulations.
            </p>

            {/* Search Bar */}
            <BlogSearch
              onSearch={handleSearch}
              placeholder="Search articles... (e.g., 'FIRB fees', 'stamp duty', 'Sydney investment')"
            />
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      {categories.length > 0 && (
        <BlogNavigation
          categories={categories}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {!searchTerm && !activeCategory && (
          <>
            {/* Popular/Featured Posts */}
            {popularPosts.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Articles</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {popularPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} locale={locale} />
                  ))}
                </div>
              </section>
            )}

            {/* Info Banner */}
            <Alert className="mb-12 border-blue-400 bg-blue-50">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <AlertDescription className="text-gray-800">
                <strong className="font-semibold">Need calculations?</strong> Use our FIRB
                Calculator to get instant cost estimates for your property purchase.{" "}
                <Link
                  href={`/${locale}/calculator`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Calculate Now →
                </Link>
              </AlertDescription>
            </Alert>
          </>
        )}

        {/* Search Results Info */}
        {(searchTerm || activeCategory) && (
          <div className="mb-8">
            <p className="text-gray-600">
              Found <strong className="text-gray-900">{filteredPosts.length}</strong>{" "}
              {filteredPosts.length === 1 ? "article" : "articles"}
              {searchTerm && searchTerm.length >= 2 && <> for &ldquo;{searchTerm}&rdquo;</>}
              {activeCategory && ` in ${activeCategory}`}
            </p>
          </div>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && (searchTerm || activeCategory) && (
          <Card className="border border-gray-200 shadow-sm rounded bg-white">
            <CardContent className="p-6 text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No articles found</h3>
              <p className="text-gray-600 mb-6">
                We couldn&apos;t find any articles matching your search criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("");
                }}
                className="rounded"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} locale={locale} />
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
                Get instant, accurate cost estimates for your Australian property purchase including
                FIRB fees, stamp duty, and ongoing costs.
              </p>
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="rounded px-8 py-3 text-base font-medium"
              >
                <Link href={`/${locale}/calculator`}>
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculate Fees Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
