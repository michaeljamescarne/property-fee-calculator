import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home, BookOpen } from "lucide-react";
import { getBlogPost, getAllBlogPosts } from "@/lib/blogContentProcessor";
import { getRelatedPosts, formatBlogDate, getCategoryColor } from "@/lib/blog/blog-utils-client";
import {
  generateArticleSchema,
  generatePostBreadcrumbSchema,
  generatePostWebPageSchema,
  injectStructuredData,
} from "@/lib/blog/blog-schema";
import HelpfulFeedback from "@/components/blog/HelpfulFeedback";
import RelatedPosts from "@/components/blog/RelatedPosts";

const BASE_URL = "https://propertycosts.com.au";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPost(slug, locale);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const url = `${BASE_URL}/${locale}/blog/${slug}`;
  const publishedDate = new Date(post.date).toISOString();

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: "Property Costs" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: "Property Costs",
      locale: locale === "zh" ? "zh_CN" : "en_AU",
      type: "article",
      publishedTime: publishedDate,
      modifiedTime: publishedDate,
      section: post.category,
      tags: post.tags,
      images: [
        {
          url: `${BASE_URL}/images/blog-og-default.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [`${BASE_URL}/images/blog-og-default.png`],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const post = getBlogPost(slug, locale);
  const allPosts = getAllBlogPosts(locale);
  const relatedPosts = post ? getRelatedPosts(post, allPosts, 3) : [];

  if (!post) {
    notFound();
  }

  const formattedDate = formatBlogDate(post.date, locale);
  const categoryColor = getCategoryColor(post.category);

  // Structured data
  const articleSchema = generateArticleSchema(post, locale);
  const breadcrumbSchema = generatePostBreadcrumbSchema(locale, slug, post.title);
  const webPageSchema = generatePostWebPageSchema(
    locale,
    slug,
    post.title,
    post.excerpt,
    post.tags
  );

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={injectStructuredData(articleSchema)}
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
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-600">
              <li>
                <Link href={`/${locale}`} className="hover:text-blue-600 flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </li>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <li>
                <Link
                  href={`/${locale}/blog`}
                  className="hover:text-blue-600 flex items-center gap-1"
                >
                  <BookOpen className="h-4 w-4" />
                  Blog
                </Link>
              </li>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <li className="text-gray-900 font-medium truncate max-w-md">{post.title}</li>
            </ol>
          </nav>

          <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 md:p-12">
            {/* Header */}
            <header className="mb-8 pb-8 border-b border-gray-200">
              {/* Category Badge */}
              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${categoryColor}`}
                >
                  {post.category}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                {post.date && (
                  <>
                    <time dateTime={post.date}>{formattedDate}</time>
                    {post.readTime && <span>•</span>}
                  </>
                )}
                {post.readTime && <span>{post.readTime}</span>}
              </div>

              {post.excerpt && (
                <p className="text-lg text-gray-600 leading-relaxed">{post.excerpt}</p>
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none 
                prose-headings:font-semibold prose-headings:text-gray-900 
                prose-h1:text-4xl prose-h1:font-bold prose-h1:leading-tight prose-h1:mb-6 prose-h1:mt-8
                prose-h2:text-3xl prose-h2:font-semibold prose-h2:leading-snug prose-h2:mb-4 prose-h2:mt-8
                prose-h3:text-2xl prose-h3:font-semibold prose-h3:leading-snug prose-h3:mb-3 prose-h3:mt-6
                prose-h4:text-xl prose-h4:font-semibold prose-h4:leading-snug prose-h4:mb-2 prose-h4:mt-4
                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:text-gray-600 prose-ul:my-4 prose-ul:pl-6
                prose-ol:text-gray-600 prose-ol:my-4 prose-ol:pl-6
                prose-li:my-2 prose-li:leading-relaxed
                prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:my-4
                prose-code:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded prose-pre:p-4 prose-pre:my-4
                prose-img:rounded prose-img:my-4 prose-img:shadow-sm
                prose-hr:border-gray-200 prose-hr:my-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Helpful Feedback */}
            <HelpfulFeedback postSlug={post.slug} />

            {/* Related Posts */}
            {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} locale={locale} />}
          </article>
        </div>
      </main>
    </>
  );
}
