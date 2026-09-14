"use client";

import { ArrowRight, Check, Tag } from "lucide-react";
import { useMemo, useState } from "react";

import { DISCOUNT_AMOUNT } from "@/lib/privilege/content";
import { privilegeImageForColor } from "@/lib/privilege/catalog";
import type { PrivilegeProduct } from "@/lib/privilege/types";

type CuratedCapsuleProps = {
  products: PrivilegeProduct[];
  onClaimProduct: (product: PrivilegeProduct, selectedSize: string, selectedColor: string) => void;
  onSeeFullCollection: () => void;
};

export function CuratedCapsule({
  products,
  onClaimProduct,
  onSeeFullCollection,
}: CuratedCapsuleProps) {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    products.forEach((p) => {
      initial[p.id] = p.defaultSize;
    });
    return initial;
  });
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    products.forEach((p) => {
      initial[p.id] = p.defaultColor;
    });
    return initial;
  });
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleColorChange = (productId: string, color: string) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: color }));
  };

  const handleClaim = (product: PrivilegeProduct) => {
    const size = selectedSizes[product.id] || product.defaultSize;
    const color = selectedColors[product.id] || product.defaultColor;
    setAddedProductId(product.id);
    onClaimProduct(product, size, color);
    setTimeout(() => {
      setAddedProductId((current) => (current === product.id ? null : current));
    }, 2000);
  };

  const productCards = useMemo(
    () =>
      products.map((product) => {
        const currentSize = selectedSizes[product.id] || product.defaultSize;
        const currentColor = selectedColors[product.id] || product.defaultColor;
        const displayImage = privilegeImageForColor(product, currentColor);
        return { product, currentSize, currentColor, displayImage };
      }),
    [products, selectedColors, selectedSizes],
  );

  if (products.length === 0) {
    return (
      <section
        id="featured-collection"
        className="flex flex-col px-6 py-14 max-w-xl mx-auto w-full text-center"
      >
        <p className="text-[15px] text-[#444748]">
          Our collection is loading soon. Check back shortly.
        </p>
        <button
          type="button"
          onClick={onSeeFullCollection}
          className="mt-6 group w-full min-h-[50px] py-3.5 px-4 bg-[#111111] text-white text-[12px] font-semibold tracking-[0.14em] uppercase flex items-center justify-center gap-2"
        >
          <span>BROWSE FULL COLLECTION</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    );
  }

  return (
    <section
      id="featured-collection"
      aria-labelledby="curated-capsule-heading"
      className="flex flex-col px-6 py-14 max-w-xl mx-auto w-full"
    >
      <div className="text-center mb-8">
        <span className="text-[10px] font-bold text-[#7C5E1D] uppercase tracking-[0.16em] block mb-1">
          CURATED CAPSULE
        </span>
        <h2
          id="curated-capsule-heading"
          className="privilege-serif text-[34px] sm:text-[38px] text-[#111111] uppercase tracking-tight font-normal mb-2"
        >
          FIND YOUR EVERYDAY TEE.
        </h2>
        <p className="text-[15px] text-[#444748] max-w-xs mx-auto leading-relaxed">
          Live catalog pieces with automatic ₹{DISCOUNT_AMOUNT} savings applied at checkout.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {productCards.map(({ product, currentSize, currentColor, displayImage }) => {
          const isAdded = addedProductId === product.id;

          return (
            <div
              key={product.id}
              className="group flex flex-col bg-[#f6f3ed] shadow-sm border border-transparent hover:border-[#c4c7c7]/40 transition-all duration-300"
            >
              <div className="relative w-full aspect-[4/5] bg-[#f0eee8] overflow-hidden">
                <img
                  src={displayImage}
                  alt={`${product.name} in ${currentColor}`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute top-3 left-3 bg-[#111111] text-white px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm">
                  <Tag className="w-3 h-3 text-[#e3c27e]" />
                  <span className="text-[10px] tracking-[0.14em] uppercase font-semibold">
                    ₹{DISCOUNT_AMOUNT} OFF APPLIED
                  </span>
                </div>

                {product.badge && (
                  <div className="absolute top-3 right-3 bg-[#ffdf9e] text-[#261a00] px-2.5 py-1.5 shadow-sm">
                    <span className="text-[10px] tracking-[0.14em] uppercase font-bold">
                      {product.badge}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#444748] uppercase tracking-[0.16em] font-medium">
                    {product.gsm}
                  </span>
                  <span className="text-[10px] text-[#7C5E1D] uppercase font-bold tracking-[0.16em]">
                    {product.tag}
                  </span>
                </div>

                <h3 className="privilege-serif text-[20px] text-[#111111] leading-snug">
                  {product.name} — {currentColor}
                </h3>

                <div className="flex items-baseline gap-2.5 my-1">
                  <span className="privilege-serif text-[22px] font-medium text-[#111111]">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[14px] text-[#747878] line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] text-[#7C5E1D] tracking-wider uppercase ml-auto font-bold">
                    SAVED ₹{DISCOUNT_AMOUNT}
                  </span>
                </div>

                {product.colors.length > 1 && (
                  <fieldset className="border-0 p-0 m-0 py-1">
                    <legend className="text-[10px] font-semibold text-[#444748] uppercase tracking-wider mb-2">
                      Colour
                    </legend>
                    <div
                      className="flex flex-wrap gap-2"
                      role="radiogroup"
                      aria-label="Available colours"
                    >
                      {product.colors.map((color) => {
                        const isSelected = currentColor === color;
                        return (
                          <button
                            key={color}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => handleColorChange(product.id, color)}
                            className={`min-h-[36px] px-3 py-1.5 text-[11px] font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "bg-[#111111] text-white border border-[#111111]"
                                : "bg-[#fcf9f3] text-[#111111] border border-[#c4c7c7]/60 hover:border-[#111111]"
                            }`}
                          >
                            {color}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                <fieldset className="border-0 p-0 m-0 py-1 mb-2">
                  <legend className="sr-only">Select size for {product.name}</legend>
                  <div
                    className="flex flex-wrap gap-2"
                    role="radiogroup"
                    aria-label="Available sizes"
                  >
                    {product.sizes.map((size) => {
                      const isSelected = currentSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => handleSizeChange(product.id, size)}
                          className={`min-w-[46px] min-h-[44px] px-3 py-1.5 text-[11px] font-semibold tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? "bg-[#111111] text-white border border-[#111111]"
                              : "bg-[#fcf9f3] text-[#111111] border border-[#c4c7c7]/60 hover:border-[#111111]"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <button
                  type="button"
                  onClick={() => handleClaim(product)}
                  className={`w-full min-h-[50px] py-3.5 text-[12px] font-semibold tracking-[0.14em] uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isAdded
                      ? "bg-[#7C5E1D] text-white"
                      : "bg-[#111111] text-white hover:bg-[#2B2B2B] active:scale-[0.98]"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ADDED WITH ₹{DISCOUNT_AMOUNT} OFF</span>
                    </>
                  ) : (
                    <span>SELECT &amp; CLAIM • ₹{product.price.toLocaleString("en-IN")}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-[#f0eee8] text-center flex flex-col items-center">
        <span className="text-[10px] text-[#1c1c18] uppercase tracking-[0.16em] mb-1 font-semibold">
          ENTIRE STORE CATALOG ELIGIBLE
        </span>
        <h3 className="privilege-serif text-[20px] text-[#111111] mb-4">Looking for more?</h3>
        <button
          type="button"
          onClick={onSeeFullCollection}
          className="group w-full min-h-[50px] py-3.5 px-4 bg-[#fcf9f3] text-[#111111] text-[12px] font-semibold tracking-[0.14em] uppercase shadow-sm flex items-center justify-center gap-2 hover:bg-[#ebe8e2] active:scale-[0.98] transition-all cursor-pointer border border-[#c4c7c7]/30"
        >
          <span>SEE FULL COLLECTION</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </button>
      </div>
    </section>
  );
}
