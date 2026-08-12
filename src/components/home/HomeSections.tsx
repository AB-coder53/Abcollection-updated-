"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useReservation } from "@/components/site/SiteShell";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import type { Collection, Product } from "@/lib/catalog-types";

const FAN_FALLBACK = [
  "/images/oversized-lavender.png",
  "/images/regular-white.webp",
  "/images/terry-beige.png",
  "/images/sun-faded-green.png",
  "/images/lava-black.png",
];

export function HomeHero({ products }: { products: Product[] }) {
  const { primaryCta, ctaLabel } = useReservation();
  const rotations = [-14, -7, 0, 7, 14];
  const fanImages = products.slice(0, 5).map((p) => p.image);
  const images = fanImages.length >= 3 ? fanImages : FAN_FALLBACK;

  return (
    <section className="overflow-hidden px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
      <div className="mx-auto max-w-5xl text-center">
        <div className="animate-fan-in inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-[0.65rem] font-semibold tracking-[0.16em] text-ink-foreground uppercase">
          <ShoppingBag className="size-3.5" strokeWidth={2} />
          Premium Tees
        </div>

        <h1 className="animate-fan-in mt-7 font-display text-[2.4rem] leading-[1.05] font-bold tracking-tight uppercase sm:text-6xl lg:text-7xl">
          It&apos;s a manifesto
          <br />
          to be worn.
        </h1>

        <p
          className="animate-fan-in mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
          style={{ animationDelay: "120ms" }}
        >
          Heavyweight 240–300 GSM cotton essentials for everyday life. Timeless cuts, honest
          pricing, and a 10% launch privilege for early supporters.
        </p>

        <div
          className="animate-fan-in mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "200ms" }}
        >
          <Button
            onClick={primaryCta}
            className="h-12 rounded-full bg-teal px-10 text-sm font-semibold tracking-[0.12em] text-teal-foreground uppercase hover:bg-teal/90"
          >
            {ctaLabel}
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-full border-foreground px-8 text-sm font-semibold tracking-[0.12em] uppercase"
          >
            <Link href="/collection">Shop Collection</Link>
          </Button>
        </div>
      </div>

      <div className="relative mx-auto mt-14 flex max-w-6xl items-end justify-center gap-2 sm:mt-16 sm:gap-4 md:gap-5">
        {images.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="animate-fan-in w-[18%] min-w-[4.5rem] max-w-[11rem] origin-bottom"
            style={{ animationDelay: `${260 + index * 80}ms` }}
          >
            <div
              className="overflow-hidden rounded-2xl bg-muted shadow-[0_18px_40px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:-translate-y-2"
              style={{ transform: `rotate(${rotations[index % rotations.length]}deg)` }}
            >
              <img
                src={src}
                alt="AB Collection premium tee lookbook"
                width={440}
                height={586}
                className="aspect-[3/4] w-full object-cover object-top"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomeDiscover({ collections }: { collections: Collection[] }) {
  return (
    <section className="bg-sand px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="discover-heading">
      <Reveal>
        <h2
          id="discover-heading"
          className="text-center font-display text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Discover Collection
        </h2>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3">
        {collections.map((category, index) => {
          const href = category.productId ? `/collection/${category.productId}` : "/collection";
          return (
            <Reveal key={category.id} delay={index * 90}>
              <article
                className={`${category.tint} overflow-hidden rounded-[1.75rem] p-4 pb-5 shadow-sm`}
              >
                <Link href={href} className="block overflow-hidden rounded-[1.25rem] bg-white/40">
                  <img
                    src={category.image}
                    alt={`${category.title} tees from AB Collection`}
                    width={640}
                    height={800}
                    className="aspect-[4/5] w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  />
                </Link>
                <Button
                  asChild
                  className="mt-4 h-12 w-full rounded-full bg-teal text-sm font-semibold tracking-[0.14em] text-teal-foreground uppercase hover:bg-teal/90"
                >
                  <Link href={href}>{category.title}</Link>
                </Button>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function HomeFeatured({ products }: { products: Product[] }) {
  const featured = products.filter((p) => p.featured).slice(0, 6);
  const list = featured.length ? featured : products.slice(0, 6);

  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="featured-heading">
      <Reveal>
        <h2
          id="featured-heading"
          className="text-center font-display text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Featured Collection
        </h2>
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((product, index) => (
          <Reveal key={product.id} delay={index * 60}>
            <ProductCard product={product} badge={product.badge || undefined} />
          </Reveal>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          asChild
          className="h-12 rounded-full bg-teal px-10 text-sm font-semibold tracking-[0.12em] text-teal-foreground uppercase hover:bg-teal/90"
        >
          <Link href="/collection">See All</Link>
        </Button>
      </div>
    </section>
  );
}

export function HomeCommunity({ products }: { products: Product[] }) {
  const positions = [
    "left-[8%] top-[18%]",
    "left-[18%] top-[58%]",
    "left-[28%] top-[22%]",
    "left-[12%] bottom-[12%]",
    "right-[10%] top-[16%]",
    "right-[22%] top-[52%]",
    "right-[8%] bottom-[18%]",
    "right-[30%] bottom-[14%]",
    "left-[42%] top-[12%]",
    "left-[48%] bottom-[10%]",
  ];
  const communityImages = products.slice(0, 10).map((p) => p.image);

  return (
    <section className="relative overflow-hidden bg-ink px-5 py-28 text-ink-foreground sm:px-8 sm:py-36">
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <g stroke="white" strokeWidth="0.15" strokeDasharray="0.8 0.8" fill="none" opacity="0.35">
            <line x1="12" y1="25" x2="50" y2="50" />
            <line x1="25" y1="70" x2="50" y2="50" />
            <line x1="40" y1="20" x2="50" y2="50" />
            <line x1="70" y1="22" x2="50" y2="50" />
            <line x1="85" y1="30" x2="50" y2="50" />
            <line x1="80" y1="65" x2="50" y2="50" />
            <line x1="65" y1="82" x2="50" y2="50" />
            <line x1="35" y1="85" x2="50" y2="50" />
          </g>
        </svg>
      </div>

      {communityImages.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className={`animate-float-soft absolute hidden size-16 overflow-hidden rounded-full border-2 border-white/20 shadow-lg md:block lg:size-20 ${positions[index]}`}
          style={{ animationDelay: `${index * 0.35}s` }}
        >
          <img src={src} alt="" className="h-full w-full object-cover object-top" />
        </div>
      ))}

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="font-display text-4xl font-bold tracking-tight uppercase sm:text-6xl">
            Wear Everyday
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm text-ink-foreground/65 sm:text-base">
            Built for comfort. Designed to be lived in. Join the first wave of AB Collection.
          </p>
          <Button
            asChild
            className="mt-8 h-12 rounded-full bg-teal px-8 text-sm font-semibold tracking-[0.12em] text-teal-foreground uppercase"
          >
            <Link href="/about">Our Story</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
