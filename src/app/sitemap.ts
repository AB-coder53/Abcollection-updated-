import type { MetadataRoute } from "next";

import { getProducts } from "@/lib/catalog.server";
import { PUBLIC_STATIC_ROUTES } from "@/lib/seo-routes";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const products = await getProducts();

  const staticRoutes: MetadataRoute.Sitemap = PUBLIC_STATIC_ROUTES.map(
    ({ path, changeFrequency, priority }) => ({
      url: path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/collection/${product.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: product.featured ? 0.85 : 0.8,
  }));

  // Public indexable URLs only: 5 static pages + product detail pages.
  // Admin (/admin/*) and API (/api/*) are excluded via robots.txt.
  return [...staticRoutes, ...productRoutes];
}
