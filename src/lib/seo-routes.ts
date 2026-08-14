import type { MetadataRoute } from "next";

/** Public marketing pages indexed in sitemap.xml (excludes admin & API). */
export const PUBLIC_STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/collection", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
];

/** Paths that must never be crawled or indexed. */
export const CRAWL_DISALLOW_PATHS = ["/admin/", "/api/"] as const;
