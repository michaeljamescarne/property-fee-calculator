import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://propertycosts.com.au";
  const locales = ["en", "zh"];

  // Static routes
  const staticRoutes = [
    "",
    "/firb-calculator",
    "/blog",
    "/faq",
    "/dashboard",
    "/disclaimer",
    "/privacy",
    "/terms",
  ];

  // Generate sitemap entries for each locale and route
  const routes: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      routes.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : route === "/firb-calculator" ? 0.9 : 0.7,
      });
    });
  });

  return routes;
}
