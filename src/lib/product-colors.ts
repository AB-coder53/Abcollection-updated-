"use client";

const COLOR_SWATCH: Record<string, string> = {
  black: "bg-neutral-900",
  white: "bg-white border border-border",
  beige: "bg-[#d4c4a8]",
  lavender: "bg-[#c8b6e2]",
  maroon: "bg-[#6b2d3c]",
  brown: "bg-[#6b4c3b]",
  "coffee brown": "bg-[#6b4c3b]",
};

export function colorSwatchClass(color: string) {
  const key = color.trim().toLowerCase();
  if (COLOR_SWATCH[key]) return COLOR_SWATCH[key];

  const lastWord = key.split(" ").pop() ?? key;
  if (COLOR_SWATCH[lastWord]) return COLOR_SWATCH[lastWord];

  return "bg-muted border border-border";
}

/** Match a colour label to the best product image (arrays may be out of sync). */
export function colorToImageIndex(color: string, colors: string[], images: string[]) {
  const needle = color.trim().toLowerCase();
  const slug = needle.replace(/\s+/g, "-");
  const lastWord = needle.split(" ").pop() ?? needle;

  const byFilename = images.findIndex((src) => {
    const file = src.toLowerCase();
    return file.includes(slug) || file.includes(lastWord);
  });
  if (byFilename >= 0) return byFilename;

  const byColorOrder = colors.indexOf(color);
  if (byColorOrder >= 0 && byColorOrder < images.length) return byColorOrder;

  return 0;
}
