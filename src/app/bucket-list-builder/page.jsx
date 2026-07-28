import BucketListBuilder from "../_views/BucketListBuilder";
import { StructuredData } from "../components/StructuredData";
import { createBreadcrumbSchema, createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata("/bucket-list-builder");

export default function Page() {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Bucket List Builder", path: "/bucket-list-builder" },
  ]);

  return (
    <>
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <BucketListBuilder />
    </>
  );
}
