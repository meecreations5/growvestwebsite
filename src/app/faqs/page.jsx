import FAQs from "../_views/FAQs";
import { StructuredData } from "../components/StructuredData";
import { FAQS } from "../data/faqs";
import { createBreadcrumbSchema, createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata("/faqs");

export default function Page() {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Frequently Asked Questions", path: "/faqs" },
  ]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <StructuredData id="faq-breadcrumb-schema" data={breadcrumbs} />
      <StructuredData id="faq-page-schema" data={faqSchema} />
      <FAQs />
    </>
  );
}
