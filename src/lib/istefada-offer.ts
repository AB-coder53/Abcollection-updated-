import { parsePriceInr } from "@/lib/seo";

export const ISTEFADA_OFFER_COOKIE = "abc_istefada_offer";
export const ISTEFADA_PROMO_CODE = "ISTEFADA100";
export const ISTEFADA_DISCOUNT_INR = 100;
export const ISTEFADA_SOURCE = "istefada";
export const ISTEFADA_OFFER_MAX_AGE = 60 * 60 * 24 * 30;

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
