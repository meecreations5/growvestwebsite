import ProgressReviews from "../../_views/ProgressReviews";
import { StructuredData } from "../../components/StructuredData";
import { SEO_PAGES, createBreadcrumbSchema, createPageMetadata, createWebPageSchema } from "../../lib/seo";

export const metadata = createPageMetadata("/progress-reviews");

export default function Page() {
  const pageSchema = createWebPageSchema({
    path: "/progress-reviews",
    name: SEO_PAGES["/progress-reviews"].title,
    description: SEO_PAGES["/progress-reviews"].description,
    type: "WebPage",
  });
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Progress Reviews", path: "/progress-reviews" },
  ]);

  return (
    <>
      <StructuredData id="growvest-progress-reviews-webpage-schema" data={pageSchema} />
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <ProgressReviews />
    </>
  );
}
