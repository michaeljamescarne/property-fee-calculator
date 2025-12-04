/**
 * Blog Posts API Route
 * Server-side endpoint to fetch blog posts (avoids fs module in client components)
 * Uses Next.js 16 caching APIs for improved performance
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/blogContentProcessor";

// Cache tags for revalidation
export const CACHE_TAGS = {
  blogPosts: "blog-posts",
} as const;

// Revalidate every hour (blog posts don't change frequently)
export const revalidate = 3600; // 1 hour in seconds

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get("locale") || "en";

    const posts = getAllBlogPosts(locale);

    const response = NextResponse.json({
      success: true,
      posts,
    });

    // Set cache tags for this response
    response.headers.set("Cache-Tag", `${CACHE_TAGS.blogPosts},blog-posts-${locale}`);

    return response;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blog posts",
      },
      { status: 500 }
    );
  }
}
