import type { Metadata } from "next";

import type { Product } from "@/lib/catalog-types";
import {
  SITE_EMAIL,
  SITE_INSTAGRAM,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/site";

const DEFAULT_KEYWORDS = [
  "AB Collection",
  "premium cotton t-shirts India",
  "240 GSM tee",
  "300 GSM French terry",
  "oversized t-shirt men",
  "regular fit cotton tee",
  "men's essentials India",
  "heavyweight cotton t-shirt",
  "prelaunch discount",
  "abcollection.co.in",
] as const;

type PageSeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  keywords?: string[];
};

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function parsePriceInr(price: string): number | null {
  const digits = price.replace(/[^\d]/g, "");
  if (!digits) return null;
  return Number(digits);
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
  image = "/images/hero-beige.png",
  type = "website",
  noIndex = false,
  keywords,
}: PageSeoInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} · ${SITE_NAME}`;

  return {
    title,
    description,
    keywords: keywords ?? [...DEFAULT_KEYWORDS],
    authors: [{ name: "Abbas Badwahwala", url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Fashion",
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1600,
          alt: `${title} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: "@abcollection.co.in",
    },
  };
}

export function buildRootMetadata(): Metadata {
  const googleVerification = process.env["GOOGLE_SITE_VERIFICATION"];

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} — ${SITE_TAGLINE}`,
      template: `%s · ${SITE_NAME}`,
    },
    description:
      "Premium everyday essentials for men. Heavyweight 240–300 GSM cotton tees with timeless design and honest pricing. Reserve your 10% launch discount — no payment today.",
    applicationName: SITE_NAME,
    authors: [{ name: "Abbas Badwahwala", url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Fashion",
    keywords: [...DEFAULT_KEYWORDS],
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    icons: {
      icon: [{ url: "/favicon.png", type: "image/png" }],
      apple: [{ url: "/logo.png", type: "image/png", sizes: "180x180" }],
    },
    openGraph: {
      siteName: SITE_NAME,
      type: "website",
      locale: SITE_LOCALE,
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description:
        "Premium heavyweight cotton tees for men. Register interest before launch for 10% off.",
      url: SITE_URL,
      images: [{ url: absoluteUrl("/images/hero-beige.png"), width: 1200, height: 1600 }],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@abcollection.co.in",
    },
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...(googleVerification ? { verification: { google: googleVerification } } : {}),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: `${SITE_NAME} — ${SITE_TAGLINE}. Premium everyday essentials for men.`,
    email: SITE_EMAIL,
    sameAs: [SITE_INSTAGRAM],
    logo: absoluteUrl("/logo.png"),
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: `${SITE_TAGLINE}. Heavyweight cotton tees launching soon.`,
    publisher: { "@type": "Organization", name: SITE_NAME },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/collection?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productJsonLd(product: Product) {
  const price = parsePriceInr(product.price);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: (product.images?.length ? product.images : [product.image]).map((src) =>
      absoluteUrl(src),
    ),
    sku: product.id,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "Men's T-Shirts",
    material: product.fabric,
    color: product.colors.join(", "),
    size: product.sizes.join(", "),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/collection/${product.id}`),
      priceCurrency: "INR",
      ...(price ? { price: String(price) } : {}),
      availability: "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };
}

export function itemListJsonLd(products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} Collection`,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/collection/${product.id}`),
      name: product.name,
    })),
  };
}

export function faqJsonLd(faqs: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
