// Server-Side Blog Utility Functions
// These functions require Node.js modules and should only be used in server components

import type { BlogPost } from "@/lib/blogContentProcessor";
import { getAllBlogPosts } from "@/lib/blogContentProcessor";

/**
 * Get all blog posts (server-side only)
 */
export function getBlogPosts(locale: string): BlogPost[] {
  return getAllBlogPosts(locale);
}
