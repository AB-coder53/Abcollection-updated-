import { buildPageMetadata } from "@/lib/seo";
import { WHOLESALE_STORE_URL } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Wholesale",
  description: "AB Collection B2B plain t-shirt wholesale. Bulk orders from Delhi.",
  path: "/wholesale",
  noIndex: true,
});

export default function WholesalePage() {
  return (
    <main className="fixed inset-0 bg-background">
      <iframe
        src={WHOLESALE_STORE_URL}
        title="AB Collection Wholesale — B2B Plain Tshirt Supplier"
        className="size-full border-0"
        allow="payment; clipboard-read; clipboard-write"
        loading="eager"
      />
    </main>
  );
}
