import { PageContentExtensions } from "../../components/PageContentExtensions";
import { getSitePageMetadata, getSiteWebPageSchema } from "../../lib/server/sitePageSeo";
import ProgressReviews from "../../_views/ProgressReviews";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema } from "../../lib/seo";

export async function generateMetadata() {
  return getSitePageMetadata("/progress-reviews");
}

export default async function Page() {
  const pageSchema = await getSiteWebPageSchema("/progress-reviews", "WebPage");
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Progress Reviews", path: "/progress-reviews" },
  ]);

  return (
    <>
      <StructuredData id="growvest-progress-reviews-webpage-schema" data={pageSchema} />
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <ProgressReviews />
      <PageContentExtensions pageKey="progress-reviews" />
    </>
  );
}
