"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { EarlyAccessOverlay } from "@/components/EarlyAccessOverlay";
import { RegisterDialog } from "@/components/RegisterDialog";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import type { Product } from "@/lib/catalog-types";
import { trackEvent } from "@/lib/early-access";
import { useEarlyAccess } from "@/hooks/use-early-access";

type ReservationContextValue = {
  unlocked: boolean;
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
  const { unlocked } = useEarlyAccess();
  const ctaLabel = unlocked ? "RESERVE NOW" : "GET EARLY ACCESS";

  const openEarlyAccess = useCallback(() => setEarlyAccessOpen(true), []);

  const openReservation = useCallback(
    (product: Product | null = null) => {
      if (!unlocked) {
        setEarlyAccessOpen(true);
        return;
      }
      setSelected(product);
      setRegisterOpen(true);
      trackEvent("reservation_started", product ? { product: product.name } : {});
    },
    [unlocked],
  );

  const primaryCta = useCallback(() => {
    if (unlocked) openReservation(null);
    else openEarlyAccess();
  }, [unlocked, openReservation, openEarlyAccess]);

  const value = useMemo(
    () => ({ unlocked, ctaLabel, openEarlyAccess, openReservation, primaryCta }),
    [unlocked, ctaLabel, openEarlyAccess, openReservation, primaryCta],
  );

  return (
    <ReservationContext.Provider value={value}>
      <div className="min-h-screen bg-background text-foreground">
        <EarlyAccessOverlay forceOpen={earlyAccessOpen} onClose={() => setEarlyAccessOpen(false)} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <RegisterDialog open={registerOpen} onOpenChange={setRegisterOpen} product={selected} />
      </div>
    </ReservationContext.Provider>
  );
}
