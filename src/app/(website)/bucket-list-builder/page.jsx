import BucketListBuilder from "../../_views/BucketListBuilder";
import { StructuredData } from "../../components/StructuredData";
import { SEO_PAGES, createBreadcrumbSchema, createFaqPageSchema, createPageMetadata, createWebPageSchema } from "../../lib/seo";
import { BUCKET_LIST_PLANNER_FAQS } from "../../lib/seoContent";

export const metadata = createPageMetadata("/bucket-list-builder");

export default function Page() {
  const pageSchema = createWebPageSchema({
    path: "/bucket-list-builder",
    name: SEO_PAGES["/bucket-list-builder"].title,
    description: SEO_PAGES["/bucket-list-builder"].description,
    type: "WebPage",
  });
  const faqSchema = createFaqPageSchema(BUCKET_LIST_PLANNER_FAQS, {
    path: "/bucket-list-builder",
    name: "Financial Goal Planner Frequently Asked Questions",
  });
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Financial Goal Planner", path: "/bucket-list-builder" },
  ]);

  return (
    <>
      <StructuredData id="growvest-bucket-list-builder-webpage-schema" data={pageSchema} />
      <StructuredData id="growvest-bucket-list-builder-faq-schema" data={faqSchema} />
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <BucketListBuilder />
    </>
  );
}
