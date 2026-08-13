"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { EarlyAccessOverlay } from "@/components/EarlyAccessOverlay";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import type { Product } from "@/lib/catalog-types";
import { isReservationSelection, type ReservationSelection } from "@/lib/reservation-types";

const ReserveInterestDialog = dynamic(
  () => import("@/components/ReserveInterestDialog").then((m) => m.ReserveInterestDialog),
  { ssr: false },
);

type ReservationContextValue = {
  ctaLabel: string;
  openEarlyAccess: () => void;
  openReservation: (request?: Product | ReservationSelection | null) => void;
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
  const [selection, setSelection] = useState<ReservationSelection | null>(null);
  const [earlyAccessOpen, setEarlyAccessOpen] = useState(false);
  const ctaLabel = "RESERVE INTEREST";

  const openEarlyAccess = useCallback(() => setEarlyAccessOpen(true), []);

  const openReservation = useCallback((request: Product | ReservationSelection | null = null) => {
    if (!request) {
      setSelection(null);
      setRegisterOpen(true);
      return;
    }

    if (isReservationSelection(request)) {
      setSelection(request);
    } else {
      const images = request.images?.length ? request.images : [request.image];
      setSelection({
        product: request,
        color: request.colors[0] ?? "",
        size: request.sizes[0] ?? "",
        image: images[0] ?? request.image,
      });
    }
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
            selection={selection}
          />
        ) : null}
      </div>
    </ReservationContext.Provider>
  );
}
