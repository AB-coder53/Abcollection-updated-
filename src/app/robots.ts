import type { MetadataRoute } from "next";

import { CRAWL_DISALLOW_PATHS } from "@/lib/seo-routes";
import { SITE_URL } from "@/lib/site";

const AI_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "Google-Extended",
  "anthropic-ai",
  "ClaudeBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  const disallow = [...CRAWL_DISALLOW_PATHS];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/" as const,
        disallow,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
