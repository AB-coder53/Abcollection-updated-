"use client";

import { useEffect } from "react";

import type { CarouselApi } from "@/components/ui/carousel";

export function useCarouselAutoplay(api: CarouselApi | undefined, delayMs = 3800) {
  useEffect(() => {
    if (!api) return;

    let timer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      stop();
      timer = setInterval(() => {
        api.scrollNext();
      }, delayMs);
    };

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };

    start();
    api.on("pointerDown", stop);
    api.on("pointerUp", start);

    return () => {
      stop();
      api.off("pointerDown", stop);
      api.off("pointerUp", start);
    };
  }, [api, delayMs]);
}
