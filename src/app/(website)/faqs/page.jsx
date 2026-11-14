import { PageContentExtensions } from "../../components/PageContentExtensions";
import { getSitePageMetadata, getSiteWebPageSchema } from "../../lib/server/sitePageSeo";
import FAQs from "../../_views/FAQs";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema, createFaqPageSchema } from "../../lib/seo";
import { getPublishedFaqs } from "../../lib/server/websiteContentRepository";

export async function generateMetadata() {
  return getSitePageMetadata("/faqs");
}

export default async function Page() {
  const items = await getPublishedFaqs();
  const pageSchema = await getSiteWebPageSchema("/faqs", "WebPage");
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
      <PageContentExtensions pageKey="faqs" includeFaqs={false} />
    </>
  );
}
