/**
 * Blog Posts API Route
 * Server-side endpoint to fetch blog posts (avoids fs module in client components)
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/blogContentProcessor";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get("locale") || "en";

    const posts = getAllBlogPosts(locale);

    return NextResponse.json({
      success: true,
      posts,
    });
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
