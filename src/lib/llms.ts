import { getCatalog } from "@/lib/catalog.server";
import { absoluteUrl } from "@/lib/seo";
import { PUBLIC_STATIC_ROUTES } from "@/lib/seo-routes";
import { FAQS, SITE_EMAIL, SITE_INSTAGRAM, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

export async function buildLlmsTxt(): Promise<string> {
  const { products } = await getCatalog();

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_TAGLINE}. Premium heavyweight 240–300 GSM cotton t-shirts for men in India.`,
    `> Pre-launch storefront — register interest for a 10% launch discount. No payment required today.`,
    "",
    "## About",
    "",
    `${SITE_NAME} is a premium everyday essentials brand founded by Abbas Badwahwala.`,
    "We make heavyweight cotton tees — oversized, regular fit, French terry, sun-faded, and acid-wash styles.",
    "",
    "## Public pages",
    "",
    ...PUBLIC_STATIC_ROUTES.map(({ path }) => {
      const label =
        path === "/" ? "Home" : path.replace(/^\//, "").replace(/^\w/, (c) => c.toUpperCase());
      return `- [${label}](${absoluteUrl(path)}): ${SITE_NAME} ${label.toLowerCase()} page`;
    }),
    "",
    "## Products",
    "",
    ...products.map(
      (product) =>
        `- [${product.name}](${absoluteUrl(`/collection/${product.id}`)}): ${product.fabric}. ${product.tagline}. Colors: ${product.colors.join(", ")}. Sizes: ${product.sizes.join(", ")}. Price: ${product.price}.`,
    ),
    "",
    "## FAQ",
    "",
    ...FAQS.map((faq) => `- **${faq.question}** ${faq.answer}`),
    "",
    "## Contact",
    "",
    `- Email: ${SITE_EMAIL}`,
    `- Instagram: ${SITE_INSTAGRAM}`,
    `- Website: ${SITE_URL}`,
    "",
    "## Optional",
    "",
    `- [Sitemap](${SITE_URL}/sitemap.xml): XML sitemap for search engines`,
    `- [Robots](${SITE_URL}/robots.txt): Crawler rules`,
    `- [Collection](${absoluteUrl("/collection")}): Full product catalog`,
    "",
  ];

  return lines.join("\n");
}
