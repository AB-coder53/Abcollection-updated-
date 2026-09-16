"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  ISTEFADA_DISCOUNT_INR,
  ISTEFADA_FROM_QUERY,
  ISTEFADA_PROMO_CODE,
} from "@/lib/istefada-offer";

type IstefadaOfferContextValue = {
  hasOffer: boolean;
  promoCode: string;
  discountInr: number;
  activateOffer: () => void;
};

const IstefadaOfferContext = createContext<IstefadaOfferContextValue | null>(null);

export function useIstefadaOffer() {
  const ctx = useContext(IstefadaOfferContext);
  if (!ctx) {
    return {
      hasOffer: false,
      promoCode: ISTEFADA_PROMO_CODE,
      discountInr: ISTEFADA_DISCOUNT_INR,
      activateOffer: () => {},
    };
  }
  return ctx;
}

export function IstefadaOfferProvider({ children }: { children: ReactNode }) {
  const [hasOffer, setHasOffer] = useState(false);

  const activateOffer = useCallback(() => {
    setHasOffer(true);
  }, []);

  const value = useMemo(
    () => ({
      hasOffer,
      promoCode: ISTEFADA_PROMO_CODE,
      discountInr: ISTEFADA_DISCOUNT_INR,
      activateOffer,
    }),
    [hasOffer, activateOffer],
  );

  return <IstefadaOfferContext.Provider value={value}>{children}</IstefadaOfferContext.Provider>;
}

function IstefadaOfferActivationInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { activateOffer } = useIstefadaOffer();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    if (searchParams.get("from") !== ISTEFADA_FROM_QUERY) return;

    handled.current = true;
    activateOffer();
    router.replace("/", { scroll: false });
  }, [searchParams, activateOffer, router]);

  return null;
}

export function IstefadaOfferActivation() {
  return (
    <Suspense fallback={null}>
      <IstefadaOfferActivationInner />
    </Suspense>
  );
}
