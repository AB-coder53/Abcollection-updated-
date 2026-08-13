"use client";

import Link from "next/link";
import { useState } from "react";

import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useCarouselAutoplay } from "@/hooks/use-carousel-autoplay";
import type { Collection } from "@/lib/catalog-types";

export function CollectionGrid({ collections }: { collections: Collection[] }) {
  const [api, setApi] = useState<CarouselApi>();
  useCarouselAutoplay(api);

  return (
    <>
      <div className="mx-auto max-w-6xl md:hidden">
        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true, duration: 28, dragFree: false }}
          className="w-full touch-pan-y"
        >
          <CarouselContent className="-ml-3">
            {collections.map((category) => {
              const href = category.productId ? `/collection/${category.productId}` : "/collection";
              return (
                <CarouselItem key={category.id} className="basis-[78%] pl-3">
                  <article className="overflow-hidden rounded-2xl border border-border bg-white p-3 shadow-sm">
                    <Link href={href} className="block overflow-hidden rounded-xl bg-muted">
                      <img
                        src={category.image}
                        alt={`${category.title} tees from AB Collection`}
                        width={640}
                        height={800}
                        className="aspect-[4/5] w-full object-cover object-top"
                      />
                    </Link>
                    <Button
                      asChild
                      className="mt-3 h-10 w-full rounded-full bg-teal text-xs font-semibold tracking-[0.14em] text-teal-foreground uppercase hover:bg-teal/90"
                    >
                      <Link href={href}>{category.title}</Link>
                    </Button>
                  </article>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="mx-auto hidden max-w-6xl gap-5 md:grid md:grid-cols-3 md:gap-6">
        {collections.map((category, index) => {
          const href = category.productId ? `/collection/${category.productId}` : "/collection";
          return (
            <Reveal key={category.id} delay={index * 90}>
              <article className="overflow-hidden rounded-[1.75rem] border border-border bg-white p-4 pb-5 shadow-sm">
                <Link href={href} className="block overflow-hidden rounded-[1.25rem] bg-muted">
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
    </>
  );
}
