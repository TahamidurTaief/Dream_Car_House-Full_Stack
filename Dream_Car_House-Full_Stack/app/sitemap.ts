import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();

  const publicRoutes = [
    "",
    "/home01",
    "/home02",
    "/home03",
    "/home04",
    "/home05",
    "/home06",
    "/home08",
    "/home09",
    "/home10",
    "/about-us",
    "/blog",
    "/blog-detail",
    "/blog-grid",
    "/compare",
    "/contact",
    "/dealer-detail",
    "/dealer-listing",
    "/faq",
    "/listing-detail-v1",
    "/listing-detail-v2",
    "/listing-detail-v3",
    "/listing-detail-v4",
    "/listing-detail-v5",
    "/listing-grid",
    "/listing-grid2",
    "/listing-grid-map",
    "/listing-list",
    "/listing-list-map",
    "/pricing",
    "/sale-agents",
    "/sale-agents-detail",
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route.startsWith("/listing") ? 0.8 : 0.6,
  }));
}
