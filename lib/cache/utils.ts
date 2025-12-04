/**
 * Cache Utilities for Next.js 16
 * Provides cache tag constants for consistent naming across the application
 * 
 * Note: Cache revalidation should be done directly in route handlers or server actions
 * using revalidateTag() and revalidatePath() from "next/cache"
 */

/**
 * Cache tag constants for consistent tag naming
 * Use these constants when setting cache tags in API routes
 */
export const CACHE_TAGS = {
  // Blog posts
  blogPosts: "blog-posts",
  blogPost: (slug: string) => `blog-post-${slug}`,
  blogPostsLocale: (locale: string) => `blog-posts-${locale}`,

  // Benchmarks
  benchmarks: "benchmarks",
  benchmarkState: (state: string) => `benchmarks-${state}`,
  benchmarkSuburb: (suburb: string) => `benchmarks-suburb-${suburb}`,

  // Cost benchmarks
  costBenchmarks: "cost-benchmarks",
  costBenchmarkState: (state: string) => `cost-benchmarks-${state}`,
  costBenchmarkType: (type: string) => `cost-benchmarks-type-${type}`,

  // Macro benchmarks
  macroBenchmarks: "macro-benchmarks",
  macroBenchmarkCategory: (category: string) => `macro-benchmarks-${category}`,

  // Calculations (if implementing caching for calculations)
  calculations: "calculations",
  calculation: (id: string) => `calculation-${id}`,
} as const;

/**
 * Example: How to revalidate cache in a route handler
 * 
 * ```typescript
 * import { revalidateTag } from "next/cache";
 * import { CACHE_TAGS } from "@/lib/cache/utils";
 * 
 * export async function POST() {
 *   // ... update data ...
 *   revalidateTag(CACHE_TAGS.blogPosts);
 *   return NextResponse.json({ success: true });
 * }
 * ```
 */

