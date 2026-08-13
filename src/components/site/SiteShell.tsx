"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { EarlyAccessOverlay } from "@/components/EarlyAccessOverlay";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import type { Product } from "@/lib/catalog-types";

const ReserveInterestDialog = dynamic(
  () => import("@/components/ReserveInterestDialog").then((m) => m.ReserveInterestDialog),
  { ssr: false },
);

type ReservationContextValue = {
  ctaLabel: string;
  openEarlyAccess: () => void;
  openReservation: (product?: Product | null) => void;
  primaryCta: () => void;
};

const ReservationContext = createContext<ReservationContextValue | null>(null);

export function useReservation() {
  const ctx = useContext(ReservationContext);
  if (!ctx) throw new Error("useReservation must be used within SiteShell");
  return ctx;
}

export function SiteShell({ children }: { children: ReactNode }) {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [earlyAccessOpen, setEarlyAccessOpen] = useState(false);
  const ctaLabel = "RESERVE INTEREST";

  const openEarlyAccess = useCallback(() => setEarlyAccessOpen(true), []);

  const openReservation = useCallback((product: Product | null = null) => {
    setSelected(product);
    setRegisterOpen(true);
  }, []);

  const primaryCta = useCallback(() => {
    openReservation(null);
  }, [openReservation]);

  const value = useMemo(
    () => ({ ctaLabel, openEarlyAccess, openReservation, primaryCta }),
    [ctaLabel, openEarlyAccess, openReservation, primaryCta],
  );

  return (
    <ReservationContext.Provider value={value}>
      <div className="min-h-screen bg-background text-foreground">
        <EarlyAccessOverlay forceOpen={earlyAccessOpen} onClose={() => setEarlyAccessOpen(false)} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        {registerOpen ? (
          <ReserveInterestDialog
            open={registerOpen}
            onOpenChange={setRegisterOpen}
            product={selected}
          />
        ) : null}
      </div>
    </ReservationContext.Provider>
  );
}
