import { PageContentExtensions } from "../../components/PageContentExtensions";
import { getSitePageMetadata } from "../../lib/server/sitePageSeo";
import HowWeCharge from "../../_views/HowWeCharge";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema } from "../../lib/seo";

export async function generateMetadata() {
  return getSitePageMetadata("/how-we-charge");
}

export default function Page() {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "How GrowVest Is Compensated", path: "/how-we-charge" },
  ]);

  return (
    <>
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <HowWeCharge />
      <PageContentExtensions pageKey="how-we-charge" />
    </>
  );
}
