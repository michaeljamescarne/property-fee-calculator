// Blog Utility Functions

import type { BlogPost } from "@/lib/blogContentProcessor";
import { getAllBlogPosts } from "@/lib/blogContentProcessor";

/**
 * Get all blog posts (server-side only)
 */
export function getBlogPosts(locale: string): BlogPost[] {
  return getAllBlogPosts(locale);
}

/**
 * Get related posts based on tags and category
 */
export function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3
): BlogPost[] {
  // Exclude current post
  const otherPosts = allPosts.filter((post) => post.slug !== currentPost.slug);

  // Calculate relevance score for each post
  const scoredPosts: Array<{ post: BlogPost; score: number }> = [];

  otherPosts.forEach((post) => {
    let score = 0;

    // Same category (higher weight)
    if (post.category === currentPost.category) {
      score += 10;
    }

    // Shared tags (medium weight per tag)
    const sharedTags = currentPost.tags.filter((tag) => post.tags.includes(tag));
    score += sharedTags.length * 5;

    // Same featured status (low weight)
    if (post.featured === currentPost.featured) {
      score += 1;
    }

    if (score > 0) {
      scoredPosts.push({ post, score });
    }
  });

  // Sort by score (highest first), then by date (newest first)
  return scoredPosts
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    })
    .slice(0, limit)
    .map((item) => item.post);
}

/**
 * Get posts by category
 */
export function getPostsByCategory(posts: BlogPost[], category: string): BlogPost[] {
  return posts
    .filter((post) => post.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get posts by tag
 */
export function getPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  return posts
    .filter((post) => post.tags.includes(tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Format date for display
 */
export function formatBlogDate(dateString: string, locale: string = "en"): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Generate blog post URL
 */
export function generateBlogUrl(locale: string, slug: string): string {
  return `/${locale}/blog/${slug}`;
}

/**
 * Get reading time from post (if not already calculated)
 */
export function calculateReadingTime(content: string): string {
  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200;
  const textContent = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
  const wordCount = textContent.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  if (minutes === 1) {
    return "1 min read";
  }
  return `${minutes} min read`;
}

/**
 * Extract plain text excerpt from content
 */
export function extractExcerpt(content: string, maxLength: number = 160): string {
  const textContent = content.replace(/<[^>]*>/g, "").trim();
  if (textContent.length <= maxLength) {
    return textContent;
  }

  // Find the last space before maxLength to avoid cutting words
  const truncated = textContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return truncated.substring(0, lastSpace) + "...";
}

/**
 * Get category color (for UI styling)
 */
export function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    "Costs & Fees": "bg-blue-100 text-blue-700",
    "Investment Analysis": "bg-green-100 text-green-700",
    "FIRB Guide": "bg-purple-100 text-purple-700",
    "City Guides": "bg-orange-100 text-orange-700",
    "Investment Guide": "bg-indigo-100 text-indigo-700",
  };

  return colorMap[category] || "bg-gray-100 text-gray-700";
}
