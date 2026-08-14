import { ContactContent } from "@/app/contact/ContactContent";
import { JsonLd, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Contact AB Collection — Email & Instagram",
  description:
    "Contact AB Collection for launch updates, sizing help, and reservation support. Email abbasbadwahwala53@gmail.com or message us on Instagram @abcollection.co.in.",
  path: "/contact",
  keywords: ["contact AB Collection", "AB Collection support", "tee sizing help India"],
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <ContactContent />
    </>
  );
}
