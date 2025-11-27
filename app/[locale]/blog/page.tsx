import { getAllBlogPosts } from "@/lib/blogContentProcessor";
import BlogPageClient from "@/components/blog/BlogPageClient";
import {
  generateBlogSchema,
  generateBlogBreadcrumbSchema,
  generateBlogWebPageSchema,
  injectStructuredData,
} from "@/lib/blog/blog-schema";

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = getAllBlogPosts(locale);

  // Structured data
  const blogSchema = generateBlogSchema(posts, locale);
  const breadcrumbSchema = generateBlogBreadcrumbSchema(locale);
  const webPageSchema = generateBlogWebPageSchema(locale);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={injectStructuredData(blogSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={injectStructuredData(breadcrumbSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={injectStructuredData(webPageSchema)}
      />

      <BlogPageClient posts={posts} locale={locale} />
    </>
  );
}
