import { PageContentExtensions } from "../../components/PageContentExtensions";
import { getSitePageMetadata, getSiteWebPageSchema } from "../../lib/server/sitePageSeo";
import BucketListBuilder from "../../_views/BucketListBuilder";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema, createFaqPageSchema } from "../../lib/seo";
import { BUCKET_LIST_PLANNER_FAQS } from "../../lib/seoContent";

export async function generateMetadata() {
  return getSitePageMetadata("/bucket-list-builder");
}

export default async function Page() {
  const pageSchema = await getSiteWebPageSchema("/bucket-list-builder", "WebPage");
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
      <PageContentExtensions pageKey="bucket-list-builder" />
    </>
  );
}
