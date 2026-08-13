import { Manrope, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
});

export function SiteFonts({ children }: { children: ReactNode }) {
  return <body className={`${manrope.variable} ${playfair.variable} antialiased`}>{children}</body>;
}
