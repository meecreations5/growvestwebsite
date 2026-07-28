import ProgressReviews from "../../_views/ProgressReviews";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema, createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata("/progress-reviews");

export default function Page() {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Progress Reviews", path: "/progress-reviews" },
  ]);

  return (
    <>
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <ProgressReviews />
    </>
  );
}
