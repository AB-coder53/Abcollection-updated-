"use client";

import { useState } from "react";

import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/Reveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useCarouselAutoplay } from "@/hooks/use-carousel-autoplay";
import type { Product } from "@/lib/catalog-types";

export function ProductGrid({ products }: { products: Product[] }) {
  const [api, setApi] = useState<CarouselApi>();
  useCarouselAutoplay(api);

  return (
    <>
      {/* Mobile: auto-sliding carousel with compact cards */}
      <div className="mx-auto max-w-7xl md:hidden">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
            duration: 28,
            dragFree: false,
          }}
          className="w-full touch-pan-y"
        >
          <CarouselContent className="-ml-3">
            {products.map((product) => (
              <CarouselItem key={product.id} className="basis-[78%] pl-3">
                <ProductCard product={product} compact />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Tablet & desktop: grid */}
      <div className="mx-auto hidden max-w-7xl gap-5 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {products.map((product, index) => (
          <Reveal key={product.id} delay={index * 50}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
