import { NextRequest, NextResponse } from "next/server";
import { trackBlogPostView } from "@/lib/hubspot/client";

/**
 * API Route: Track Blog Post View
 *
 * POST /api/hubspot/track-blog-view
 *
 * Body:
 * {
 *   "slug": "ultimate-firb-guide-2025",
 *   "title": "Complete FIRB Guide 2025",
 *   "category": "FIRB Guide",
 *   "locale": "en",
 *   "email": "user@example.com" // optional
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, category, locale, email } = body;

    if (!slug || !title || !category || !locale) {
      return NextResponse.json(
        { error: "slug, title, category, and locale are required" },
        { status: 400 }
      );
    }

    const success = await trackBlogPostView(slug, title, category, locale, email);

    if (!success) {
      return NextResponse.json({ error: "Failed to track blog post view" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in track-blog-view route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
