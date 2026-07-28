import Disclosures from "../_views/Disclosures";
import { StructuredData } from "../components/StructuredData";
import { createBreadcrumbSchema, createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata("/disclosures");

export default function Page() {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Important Disclosures", path: "/disclosures" },
  ]);

  return (
    <>
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <Disclosures />
    </>
  );
}
