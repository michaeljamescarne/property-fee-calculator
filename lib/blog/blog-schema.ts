// Blog Schema.org Structured Data Generation

import type { BlogPost } from "@/lib/blogContentProcessor";

const BASE_URL = "https://propertycosts.com.au";

/**
 * Generate Article schema for individual blog posts
 */
export function generateArticleSchema(post: BlogPost, locale: string) {
  const url = `${BASE_URL}/${locale}/blog/${post.slug}`;
  const publishedDate = new Date(post.date).toISOString();

  // Extract plain text from content for articleBody (first 500 chars)
  const articleBody = post.content
    .replace(/<[^>]*>/g, "")
    .replace(/\n/g, " ")
    .trim()
    .substring(0, 500);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    articleBody: articleBody,
    image: `${BASE_URL}/images/blog-og-default.png`, // Default OG image
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: {
      "@type": "Organization",
      name: "Property Costs",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Property Costs",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: post.category,
    keywords: post.tags.join(", "),
    inLanguage: locale === "zh" ? "zh-CN" : "en-AU",
    url,
    wordCount: post.content.replace(/<[^>]*>/g, "").split(/\s+/).length,
  };
}

/**
 * Generate Blog schema for blog listing page
 */
export function generateBlogSchema(posts: BlogPost[], locale: string) {
  const url = `${BASE_URL}/${locale}/blog`;

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Property Investment Blog",
    description:
      "Expert guides and insights on Australian property investment, FIRB requirements, stamp duty, and foreign buyer regulations.",
    url,
    inLanguage: locale === "zh" ? "zh-CN" : "en-AU",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: new Date(post.date).toISOString(),
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
      author: {
        "@type": "Organization",
        name: "Property Costs",
      },
    })),
  };
}

/**
 * Generate BreadcrumbList schema for blog pages
 */
export function generateBlogBreadcrumbSchema(locale: string, slug?: string) {
  const breadcrumbs = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${BASE_URL}/${locale}`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: `${BASE_URL}/${locale}/blog`,
    },
  ];

  if (slug) {
    // For individual posts, we'd need the post title
    // This will be handled in the page component
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs,
  };
}

/**
 * Generate BreadcrumbList schema for individual blog post
 */
export function generatePostBreadcrumbSchema(locale: string, slug: string, title: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${BASE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${BASE_URL}/${locale}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${BASE_URL}/${locale}/blog/${slug}`,
      },
    ],
  };
}

/**
 * Generate WebPage schema for blog listing page
 */
export function generateBlogWebPageSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Blog - Property Investment Guides",
    description:
      "Comprehensive guides on Australian property investment, FIRB approval, stamp duty, and foreign buyer regulations. Expert insights for property investors.",
    url: `${BASE_URL}/${locale}/blog`,
    inLanguage: locale === "zh" ? "zh-CN" : "en-AU",
    keywords: [
      "property investment",
      "FIRB",
      "foreign property buyer",
      "Australia",
      "stamp duty",
      "property investment guide",
      "foreign investment",
      "property costs",
    ],
  };
}

/**
 * Generate WebPage schema for individual blog post
 */
export function generatePostWebPageSchema(
  locale: string,
  slug: string,
  title: string,
  description: string,
  tags: string[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${BASE_URL}/${locale}/blog/${slug}`,
    inLanguage: locale === "zh" ? "zh-CN" : "en-AU",
    keywords: tags,
  };
}

/**
 * Inject structured data into HTML script tag
 */
export function injectStructuredData(schema: object) {
  return {
    __html: JSON.stringify(schema),
  };
}
