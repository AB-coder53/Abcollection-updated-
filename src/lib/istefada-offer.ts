import { parsePriceInr } from "@/lib/seo";

/** Legacy cookie name — cleared by middleware; offer is no longer cookie-based. */
export const ISTEFADA_OFFER_COOKIE = "abc_istefada_offer";
export const ISTEFADA_PROMO_CODE = "ISTEFADA100";
export const ISTEFADA_DISCOUNT_INR = 100;
export const ISTEFADA_SOURCE = "istefada";
/** Query param value: /?from=istefada activates offer for this page load only (lost on refresh). */
export const ISTEFADA_FROM_QUERY = "istefada";

export function applyIstefadaDiscount(originalPrice: number, discount = ISTEFADA_DISCOUNT_INR) {
  return Math.max(originalPrice - discount, 0);
}

export function getDiscountedPriceLabel(catalogPrice: string) {
  const original = parsePriceInr(catalogPrice);
  if (original == null)
    return { original, final: null, originalLabel: catalogPrice, finalLabel: catalogPrice };
  const final = applyIstefadaDiscount(original);
  return {
    original,
    final,
    originalLabel: catalogPrice,
    finalLabel: `₹${final.toLocaleString("en-IN")}`,
  };
}
