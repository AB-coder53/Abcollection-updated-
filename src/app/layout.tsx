import type { ReactNode } from "react";

import { AppProviders } from "@/components/site/AppProviders";
import { GoogleAnalytics } from "@/components/site/GoogleAnalytics";
import { SiteFonts } from "@/components/site/SiteFonts";
import { canonicalUrl } from "@/lib/canonical-url";
import { getCatalog } from "@/lib/catalog.server";
import { JsonLd, buildRootMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

import "./globals.css";

export const metadata = buildRootMetadata();

export default async function RootLayout({ children }: { children: ReactNode }) {
  const catalog = await getCatalog();

  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={canonicalUrl("/")} />
        <link rel="sitemap" type="application/xml" href={canonicalUrl("/sitemap.xml")} />
        <link rel="alternate" type="text/plain" href={canonicalUrl("/llms.txt")} title="LLMs.txt" />
        <link rel="alternate" type="text/plain" href={canonicalUrl("/ai.txt")} title="AI.txt" />
      </head>
      <SiteFonts>
        <GoogleAnalytics />
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <AppProviders catalog={catalog}>{children}</AppProviders>
      </SiteFonts>
    </html>
  );
}
