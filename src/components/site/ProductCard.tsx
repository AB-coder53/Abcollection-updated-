"use client";

import Link from "next/link";

import { useReservation } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/catalog-types";
import { cn } from "@/lib/utils";

type Props = {
  product: Product;
  badge?: string;
  compact?: boolean;
};

export function ProductCard({ product, badge, compact = false }: Props) {
  const { openReservation } = useReservation();
  const label = badge || product.badge || "";

  return (
    <article
      className={cn(
        "flex h-full flex-col border border-border bg-background shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
        compact ? "rounded-2xl p-3" : "rounded-3xl p-4",
      )}
    >
      <Link
        href={`/collection/${product.id}`}
        className={cn("relative overflow-hidden bg-muted", compact ? "rounded-xl" : "rounded-2xl")}
      >
        {label ? (
          <span
            className={cn(
              "absolute top-2 right-2 z-10 rounded-full bg-white font-semibold tracking-[0.08em] text-foreground uppercase shadow-sm",
              compact ? "px-2 py-0.5 text-[0.55rem]" : "top-3 right-3 px-3 py-1 text-[0.65rem]",
            )}
          >
            {label}
          </span>
        ) : null}
        <img
          src={product.image}
          alt={`${product.name} — ${product.fabric}`}
          width={800}
          height={1000}
          className={cn(
            "w-full object-cover object-top transition-transform duration-700 hover:scale-105",
            compact ? "aspect-[4/5]" : "aspect-[4/5]",
          )}
        />
      </Link>

      <div className={cn("flex flex-1 flex-col", compact ? "mt-3" : "mt-4")}>
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              "min-w-0 font-bold leading-snug",
              compact ? "text-sm" : "text-base sm:text-lg",
            )}
          >
            <Link href={`/collection/${product.id}`} className="hover:text-teal">
              {product.name}
            </Link>
          </h3>
          <p className={cn("shrink-0 font-semibold text-teal", compact ? "text-xs" : "text-sm")}>
            {product.price}
          </p>
        </div>
        {!compact ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {product.tagline}
          </p>
        ) : (
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{product.tagline}</p>
        )}
        <div className={cn("grid gap-2", compact ? "mt-3" : "mt-5")}>
          <Button
            onClick={() => openReservation(product)}
            className={cn(
              "w-full rounded-full bg-teal font-semibold tracking-[0.12em] text-teal-foreground uppercase hover:bg-teal/90",
              compact ? "h-9 text-[0.6rem]" : "h-11 text-xs",
            )}
          >
            Reserve Interest
          </Button>
          <Link
            href={`/collection/${product.id}`}
            className={cn(
              "inline-flex items-center justify-center rounded-full border border-border font-semibold tracking-[0.12em] uppercase transition-colors hover:bg-muted",
              compact ? "h-8 text-[0.6rem]" : "h-10 text-xs",
            )}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
