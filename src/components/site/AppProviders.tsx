"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AnalyticsTracker } from "@/components/site/AnalyticsTracker";
import { CatalogProvider } from "@/components/site/CatalogProvider";
import {
  IstefadaOfferActivation,
  IstefadaOfferProvider,
} from "@/components/site/IstefadaOfferProvider";
import { SiteShell } from "@/components/site/SiteShell";
import type { Catalog } from "@/lib/catalog-types";

export function AppProviders({ children, catalog }: { children: ReactNode; catalog: Catalog }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isCampaignLanding = pathname?.startsWith("/istefada") || pathname?.startsWith("/privilege");

  if (isAdmin) return <>{children}</>;

  if (isCampaignLanding) {
    return (
      <>
        <AnalyticsTracker />
        {children}
      </>
    );
  }

  return (
    <IstefadaOfferProvider>
      <AnalyticsTracker />
      <IstefadaOfferActivation />
      <CatalogProvider initial={catalog}>
        <SiteShell>{children}</SiteShell>
      </CatalogProvider>
    </IstefadaOfferProvider>
  );
}
