import Link from "next/link";

import { ProductGrid } from "@/components/site/ProductGrid";
import { getProducts } from "@/lib/catalog.server";
import { JsonLd, breadcrumbJsonLd, buildPageMetadata, itemListJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Shop Premium Cotton Tees — 240–300 GSM Collection",
  description:
    "Browse AB Collection's first drop: oversized tees, regular fit, French terry, sun-faded and acid-wash styles in heavyweight 240–300 GSM cotton. Reserve 10% launch discount.",
  path: "/collection",
  image: "/images/oversized-lavender.png",
  keywords: [
    "premium cotton tees India",
    "oversized t-shirt 240 GSM",
    "French terry oversized",
    "sun faded tee",
    "acid wash t-shirt",
  ],
});

export default async function CollectionPage() {
  const products = await getProducts();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Collection", path: "/collection" },
          ]),
          itemListJsonLd(products),
        ]}
      />

      <section className="px-5 pt-14 pb-8 sm:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="eyebrow">First drop</p>
          <h1 className="mt-4 font-display text-[2.15rem] font-bold tracking-tight sm:text-6xl">
            The Collection
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Six pieces. Nothing extra. Heavyweight cotton essentials made for Indian weather and
            everyday life. Reserve interest before launch for 10% off.
          </p>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <ProductGrid products={products} />
        <p className="mx-auto mt-12 max-w-xl text-center text-sm text-muted-foreground">
          Looking for something specific?{" "}
          <Link
            href="/contact"
            className="font-medium text-teal underline-offset-4 hover:underline"
          >
            Contact us
          </Link>{" "}
          or read our{" "}
          <Link href="/faq" className="font-medium text-teal underline-offset-4 hover:underline">
            FAQ
          </Link>
          .
        </p>
      </section>
    </>
  );
}
