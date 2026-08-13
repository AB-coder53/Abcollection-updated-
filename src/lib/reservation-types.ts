import type { Product } from "@/lib/catalog-types";

export type ReservationSelection = {
  product: Product;
  color: string;
  size: string;
  image: string;
};

export function isReservationSelection(
  value: Product | ReservationSelection | null | undefined,
): value is ReservationSelection {
  return !!value && "product" in value && "color" in value;
}
