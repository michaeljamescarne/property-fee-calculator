import { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blogContentProcessor";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://propertycosts.com.au";
  const locales = ["en", "zh"];

  // Static routes with priorities
  const staticRoutes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/calculator", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "daily" as const },
    { path: "/faq", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/dashboard", priority: 0.5, changeFrequency: "weekly" as const },
    { path: "/disclaimer", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "monthly" as const },
  ];

  // Generate sitemap entries for each locale and route
  const routes: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    // Add static routes
    staticRoutes.forEach((route) => {
      routes.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    });

    // Add blog posts dynamically
    try {
      const blogPosts = getAllBlogPosts(locale);
      blogPosts.forEach((post) => {
        routes.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: new Date(post.date),
          changeFrequency: "weekly",
          priority: post.featured ? 0.8 : 0.6,
        });
      });
    } catch (error) {
      // If blog posts can't be loaded (e.g., in build), continue without them
      console.error("Error loading blog posts for sitemap:", error);
    }
  });

  return routes;
}
