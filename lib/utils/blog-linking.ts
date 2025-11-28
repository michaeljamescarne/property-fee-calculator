/**
 * Blog Linking Utility
 * Helps find related blog posts for FAQ questions and internal linking
 */

import type { BlogPost } from "@/lib/blogContentProcessor";

/**
 * Find blog posts related to a FAQ question based on keywords
 */
export function findRelatedBlogPosts(
  questionText: string,
  allPosts: BlogPost[],
  maxResults: number = 2
): BlogPost[] {
  // Keywords that indicate topics
  const keywords = questionText.toLowerCase().split(/\s+/);

  // Score each blog post based on relevance
  const scoredPosts = allPosts.map((post) => {
    const postText = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
    let score = 0;

    // Check for keyword matches
    keywords.forEach((keyword) => {
      if (keyword.length > 3) {
        // Only check meaningful words
        const matches = (postText.match(new RegExp(keyword, "g")) || []).length;
        score += matches;
      }
    });

    // Boost score for FIRB-related keywords
    const firbKeywords = ["firb", "foreign investment", "stamp duty", "surcharge", "approval"];
    firbKeywords.forEach((keyword) => {
      if (postText.includes(keyword)) {
        score += 2;
      }
    });

    return { post, score };
  });

  // Sort by score and return top results
  return scoredPosts
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((item) => item.post);
}

/**
 * Get calculator link for a given locale
 */
export function getCalculatorLink(locale: string): string {
  return `/${locale}/firb-calculator`;
}

/**
 * Get FAQ link for a given locale and optional question ID
 */
export function getFAQLink(locale: string, questionId?: string): string {
  const base = `/${locale}/faq`;
  return questionId ? `${base}#${questionId}` : base;
}
