import {
  HomeCommunity,
  HomeDiscover,
  HomeFeatured,
  HomeHero,
} from "@/components/home/HomeSections";
import { getCatalog } from "@/lib/catalog.server";
import { JsonLd, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Premium Cotton T-Shirts for Men — Pre-Launch",
  description:
    "AB Collection's first drop: 240–300 GSM premium cotton tees for men. Oversized, regular fit, French terry & more. Register interest for 10% launch discount — no payment today.",
  path: "/",
  image: "/images/hero-beige.png",
  keywords: [
    "premium cotton t-shirts India",
    "240 GSM oversized tee",
    "men's heavyweight t-shirt",
    "prelaunch tee collection",
    "AB Collection launch",
  ],
});

export default async function HomePage() {
  const catalog = await getCatalog();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }])} />
      <HomeHero products={catalog.products} />
      <HomeDiscover collections={catalog.collections} />
      <HomeFeatured products={catalog.products} />
      <HomeCommunity products={catalog.products} />
    </>
  );
}
