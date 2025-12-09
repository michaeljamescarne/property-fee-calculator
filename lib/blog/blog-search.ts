// Blog Search and Filter Logic

import type { BlogPost } from "@/lib/blogContentProcessor";

export interface BlogFilterOptions {
  searchTerm?: string;
  category?: string;
  tag?: string;
  featured?: boolean;
}

/**
 * Search blog posts by title, excerpt, content, and tags
 */
export function searchBlogPosts(posts: BlogPost[], searchTerm: string): BlogPost[] {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return posts;
  }

  const term = searchTerm.toLowerCase().trim();
  const results: Array<{ post: BlogPost; relevance: number }> = [];

  posts.forEach((post) => {
    let relevance = 0;

    // Check title (highest weight)
    if (post.title.toLowerCase().includes(term)) {
      relevance += 10;
      // Bonus for exact match at start
      if (post.title.toLowerCase().startsWith(term)) {
        relevance += 5;
      }
    }

    // Check excerpt (medium weight)
    if (post.excerpt.toLowerCase().includes(term)) {
      relevance += 5;
    }

    // Check tags (medium weight)
    post.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(term)) {
        relevance += 4;
      }
    });

    // Check category (low weight)
    if (post.category.toLowerCase().includes(term)) {
      relevance += 2;
    }

    // Check content (lower weight, only if other matches found)
    if (relevance > 0 && post.content.toLowerCase().includes(term)) {
      relevance += 1;
    }

    if (relevance > 0) {
      results.push({ post, relevance });
    }
  });

  // Sort by relevance (highest first), then by date (newest first)
  return results
    .sort((a, b) => {
      if (b.relevance !== a.relevance) {
        return b.relevance - a.relevance;
      }
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    })
    .map((result) => result.post);
}

/**
 * Filter blog posts by various criteria
 */
export function filterBlogPosts(posts: BlogPost[], options: BlogFilterOptions): BlogPost[] {
  let filtered = [...posts];

  // Filter by category
  if (options.category) {
    filtered = filtered.filter((post) => post.category === options.category);
  }

  // Filter by tag
  if (options.tag) {
    filtered = filtered.filter((post) => post.tags.includes(options.tag!));
  }

  // Filter by featured
  if (options.featured !== undefined) {
    filtered = filtered.filter((post) => post.featured === options.featured);
  }

  // Search term filtering
  if (options.searchTerm && options.searchTerm.trim().length >= 2) {
    filtered = searchBlogPosts(filtered, options.searchTerm);
  }

  return filtered;
}

/**
 * Get popular/featured posts
 */
export function getPopularPosts(posts: BlogPost[], limit: number = 6): BlogPost[] {
  // First prioritize featured posts, then by date
  return [...posts]
    .sort((a, b) => {
      // Featured posts first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      // Then by date (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
}

/**
 * Get all unique categories from posts
 */
export function getCategories(posts: BlogPost[]): Array<{ name: string; count: number }> {
  const categoryMap = new Map<string, number>();

  posts.forEach((post) => {
    const count = categoryMap.get(post.category) || 0;
    categoryMap.set(post.category, count + 1);
  });

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get all unique tags from posts
 */
export function getAllTags(posts: BlogPost[]): Array<{ tag: string; count: number }> {
  const tagMap = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      const count = tagMap.get(tag) || 0;
      tagMap.set(tag, count + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Highlight search term in text
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return text;
  }

  // Escape special regex characters
  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedTerm})`, "gi");
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
}



