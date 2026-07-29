import FAQs from "../../_views/FAQs";
import { StructuredData } from "../../components/StructuredData";
import { SEO_PAGES, createBreadcrumbSchema, createFaqPageSchema, createPageMetadata, createWebPageSchema } from "../../lib/seo";
import { getPublishedFaqs } from "../../lib/server/websiteContentRepository";

export const metadata = createPageMetadata("/faqs");

export default async function Page() {
  const items = await getPublishedFaqs();
  const pageSchema = createWebPageSchema({
    path: "/faqs",
    name: SEO_PAGES["/faqs"].title,
    description: SEO_PAGES["/faqs"].description,
    type: "WebPage",
  });
  const faqSchema = createFaqPageSchema(items);
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Frequently Asked Questions", path: "/faqs" },
  ]);

  return (
    <>
      <StructuredData id="growvest-faq-webpage-schema" data={pageSchema} />
      <StructuredData id="growvest-faq-content-schema" data={faqSchema} />
      <StructuredData id="growvest-faq-breadcrumb-schema" data={breadcrumbs} />
      <FAQs items={items} />
    </>
  );
}
