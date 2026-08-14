import { FaqContent } from "@/app/faq/FaqContent";
import { FAQS } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd, buildPageMetadata, faqJsonLd } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "FAQ — Launch, Sizing & Pre-Launch Offer",
  description:
    "Answers about AB Collection's launch timeline, 10% pre-launch discount, sizing (S–XXL), payment, Cash on Delivery, and how we use your contact details.",
  path: "/faq",
  keywords: ["AB Collection FAQ", "prelaunch discount", "cotton tee sizing India", "launch date"],
});

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
          faqJsonLd(FAQS),
        ]}
      />
      <FaqContent />
    </>
  );
}
