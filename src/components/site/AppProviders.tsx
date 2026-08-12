"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { CatalogProvider } from "@/components/site/CatalogProvider";
import { SiteShell } from "@/components/site/SiteShell";
import type { Catalog } from "@/lib/catalog-types";

export function AppProviders({ children, catalog }: { children: ReactNode; catalog: Catalog }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <CatalogProvider initial={catalog}>
      <SiteShell>{children}</SiteShell>
    </CatalogProvider>
  );
}
