"use client";

import { useCallback, useEffect, useState } from "react";

import {
  ISTEFADA_DISCOUNT_INR,
  ISTEFADA_OFFER_COOKIE,
  ISTEFADA_OFFER_MAX_AGE,
  ISTEFADA_PROMO_CODE,
} from "@/lib/istefada-offer";

export function readIstefadaOfferCookie() {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((part) => part.trim().startsWith(`${ISTEFADA_OFFER_COOKIE}=${ISTEFADA_PROMO_CODE}`));
}

export function setIstefadaOfferCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${ISTEFADA_OFFER_COOKIE}=${ISTEFADA_PROMO_CODE}; path=/; max-age=${ISTEFADA_OFFER_MAX_AGE}; SameSite=Lax`;
}

export function useIstefadaOffer() {
  const [hasOffer, setHasOffer] = useState(false);

  const refresh = useCallback(() => {
    setHasOffer(readIstefadaOfferCookie());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    hasOffer,
    promoCode: ISTEFADA_PROMO_CODE,
    discountInr: ISTEFADA_DISCOUNT_INR,
    refresh,
  };
}
