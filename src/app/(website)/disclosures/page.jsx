import { PageContentExtensions } from "../../components/PageContentExtensions";
import { getSitePageMetadata } from "../../lib/server/sitePageSeo";
import Disclosures from "../../_views/Disclosures";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema } from "../../lib/seo";

export async function generateMetadata() {
  return getSitePageMetadata("/disclosures");
}

export default function Page() {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Important Disclosures", path: "/disclosures" },
  ]);

  return (
    <>
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <Disclosures />
      <PageContentExtensions pageKey="disclosures" />
    </>
  );
}
