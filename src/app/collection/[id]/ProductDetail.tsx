"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useReservation } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/catalog-types";

export function ProductDetail({ product }: { product: Product }) {
  const images = product.images ?? [product.image];
  const [index, setIndex] = useState(0);
  const { openReservation } = useReservation();
  const go = (dir: number) => setIndex((i) => (i + dir + images.length) % images.length);

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
      <div>
        <div className="relative overflow-hidden rounded-3xl bg-muted">
          <img
            src={images[index]}
            alt={`${product.name} — ${product.colors[index] ?? product.fabric}`}
            width={1120}
            height={1400}
            className="aspect-[4/5] w-full object-cover object-top"
          />
          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => go(-1)}
                className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => go(1)}
                className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow"
              >
                <ChevronRight className="size-4" />
              </button>
            </>
          ) : null}
        </div>
        {images.length > 1 ? (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(i)}
                className={`overflow-hidden rounded-xl border ${
                  i === index ? "border-foreground" : "border-transparent"
                }`}
              >
                <img
                  src={src}
                  alt={`${product.name} colour ${product.colors[i] ?? i + 1}`}
                  className="aspect-square w-full object-cover object-top"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <nav
          className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link href="/collection" className="hover:text-foreground">
            Collection
          </Link>
          <span aria-hidden>/</span>
          <span className="min-w-0 break-words text-foreground">{product.name}</span>
        </nav>

        <p className="eyebrow mt-8">{product.fabric}</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {product.name}
        </h1>
        <p className="mt-4 text-2xl font-semibold text-teal">{product.price}</p>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <ul className="mt-8 space-y-3">
          {product.details.map((detail) => (
            <li key={detail} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal" />
              {detail}
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Colours
            </p>
            <p className="mt-2 text-sm">{product.colors.join(" · ")}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Sizes
            </p>
            <p className="mt-2 text-sm">{product.sizes.join(" · ")}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => openReservation(product)}
            className="h-12 w-full rounded-full bg-teal px-8 text-xs font-semibold tracking-[0.14em] text-teal-foreground uppercase hover:bg-teal/90 sm:w-auto"
          >
            Reserve Interest
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 w-full rounded-full border-foreground px-8 text-xs font-semibold tracking-[0.14em] uppercase sm:w-auto"
          >
            <Link href="/collection">Back to Collection</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
