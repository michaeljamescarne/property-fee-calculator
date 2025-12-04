/**
 * Cache Utilities for Next.js 16
 * Provides helper functions for cache tag management and revalidation
 */

import { revalidateTag, revalidatePath } from "next/cache";

/**
 * Cache tag constants for consistent tag naming
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
 * Revalidate blog posts cache
 * Call this when blog posts are updated
 */
export async function revalidateBlogPosts(locale?: string) {
  revalidateTag(CACHE_TAGS.blogPosts);
  if (locale) {
    revalidateTag(CACHE_TAGS.blogPostsLocale(locale));
  }
}

/**
 * Revalidate a specific blog post
 */
export async function revalidateBlogPost(slug: string) {
  revalidateTag(CACHE_TAGS.blogPost(slug));
  revalidateTag(CACHE_TAGS.blogPosts); // Also invalidate the list
}

/**
 * Revalidate benchmarks cache
 */
export async function revalidateBenchmarks(state?: string, suburb?: string) {
  revalidateTag(CACHE_TAGS.benchmarks);
  if (state) {
    revalidateTag(CACHE_TAGS.benchmarkState(state));
  }
  if (suburb) {
    revalidateTag(CACHE_TAGS.benchmarkSuburb(suburb));
  }
}

/**
 * Revalidate cost benchmarks cache
 */
export async function revalidateCostBenchmarks(state?: string, type?: string) {
  revalidateTag(CACHE_TAGS.costBenchmarks);
  if (state) {
    revalidateTag(CACHE_TAGS.costBenchmarkState(state));
  }
  if (type) {
    revalidateTag(CACHE_TAGS.costBenchmarkType(type));
  }
}

/**
 * Revalidate macro benchmarks cache
 */
export async function revalidateMacroBenchmarks(category?: string) {
  revalidateTag(CACHE_TAGS.macroBenchmarks);
  if (category) {
    revalidateTag(CACHE_TAGS.macroBenchmarkCategory(category));
  }
}

/**
 * Revalidate all benchmark caches
 * Useful when benchmark data is updated in bulk
 */
export async function revalidateAllBenchmarks() {
  revalidateTag(CACHE_TAGS.benchmarks);
  revalidateTag(CACHE_TAGS.costBenchmarks);
  revalidateTag(CACHE_TAGS.macroBenchmarks);
}

/**
 * Revalidate a specific path
 * Useful for page-level cache invalidation
 */
export async function revalidatePage(path: string) {
  revalidatePath(path);
}

