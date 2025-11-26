"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogPostMeta } from "@/lib/blog/types";

type BlogClientProps = {
  posts: BlogPostMeta[];
  locale: string;
};

const BlogClient = ({ posts, locale }: BlogClientProps) => {
  const t = useTranslations("Blog");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(posts.map((post) => post.category)));
    return unique.sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = !activeCategory || post.category === activeCategory;
      const matchesSearch =
        !searchTerm ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchTerm]);

  const featuredPosts = filteredPosts.filter((post) => post.featured);

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">Blog</p>
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          {t("title")}
        </h1>
        <p className="text-xl text-muted-foreground mb-4">{t("subtitle")}</p>
        <a
          href="/rss.xml"
          className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
          aria-label="Subscribe to RSS feed"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z" />
            <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM3 15a2 2 0 114 0 2 2 0 01-4 0z" />
          </svg>
          RSS Feed
        </a>
      </div>

      {/* Search */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search articles..."
            className="w-full h-14 rounded border border-border pl-12 pr-12 text-base focus:border-primary focus-visible:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-sm text-muted-foreground mt-2 ml-1">
            {filteredPosts.length} {filteredPosts.length === 1 ? "result" : "results"} for “
            {searchTerm}”
          </p>
        )}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        <Button
          variant={activeCategory ? "outline" : "default"}
          size="sm"
          className="rounded px-4"
          onClick={() => setActiveCategory(null)}
        >
          All Topics
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            className="rounded px-4"
            onClick={() => setActiveCategory((current) => (current === category ? null : category))}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Featured posts */}
      {featuredPosts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">{t("featured")}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Card
                key={post.slug}
                className="group hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <Badge variant="outline" className="text-xs">
                      Featured
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    <Link href={`/${locale}/blog/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString("en-AU", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="rounded">
                      <Link href={`/${locale}/blog/${post.slug}`}>
                        {t("readMore")} <ArrowRight className="ml-1 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* All posts */}
      <section>
        <h2 className="text-3xl font-bold mb-8">{t("allPosts")}</h2>
        {filteredPosts.length === 0 ? (
          <Card className="border border-dashed">
            <CardContent className="p-12 text-center">
              <p className="text-lg font-semibold mb-2">No articles match your filters.</p>
              <p className="text-muted-foreground">
                Try adjusting your search or choose a different category.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card
                key={post.slug}
                className="group hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    <Link href={`/${locale}/blog/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.date).toLocaleDateString("en-AU", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="rounded">
                      <Link href={`/${locale}/blog/${post.slug}`}>
                        {t("readMore")} <ArrowRight className="ml-1 w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default BlogClient;
