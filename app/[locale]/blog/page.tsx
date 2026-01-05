import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blogContentProcessor";
import BlogPageClient from "@/components/blog/BlogPageClient";
import {
  generateBlogSchema,
  generateBlogBreadcrumbSchema,
  generateBlogWebPageSchema,
  injectStructuredData,
} from "@/lib/blog/blog-schema";

const BASE_URL = "https://propertycosts.com.au";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";
  const url = `${BASE_URL}/${locale}/blog`;

  const title = isZh
    ? "房产投资博客 - 澳大利亚FIRB、印花税、外国买家指南"
    : "Property Investment Blog - Expert Guides on FIRB, Stamp Duty & Foreign Buyer Regulations";

  const description = isZh
    ? "澳大利亚房产投资专家指南和见解。了解FIRB要求、印花税、外国买家法规和投资策略。全面的房产投资资源。"
    : "Expert guides and insights on Australian property investment, FIRB requirements, stamp duty, and foreign buyer regulations. Comprehensive property investment resources.";

  const keywords = isZh
    ? [
        "房产投资",
        "FIRB",
        "外国房产买家",
        "澳大利亚",
        "印花税",
        "房产投资指南",
        "外国投资",
        "房产成本",
      ]
    : [
        "property investment",
        "FIRB",
        "foreign property buyer",
        "Australia",
        "stamp duty",
        "property investment guide",
        "foreign investment",
        "property costs",
      ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: "Property Costs",
      locale: isZh ? "zh_CN" : "en_AU",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/images/blog-og-default.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/images/blog-og-default.png`],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = getAllBlogPosts();

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
