import { PageContentExtensions } from "../../components/PageContentExtensions";
import { getSitePageMetadata, getSiteWebPageSchema } from "../../lib/server/sitePageSeo";
import ForNRIs from "../../_views/ForNRIs";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema } from "../../lib/seo";

export async function generateMetadata() {
  return getSitePageMetadata("/for-nris");
}

export default async function Page() {
  const pageSchema = await getSiteWebPageSchema("/for-nris", "WebPage");
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "NRI Financial Planning", path: "/for-nris" },
  ]);

  return (
    <>
      <StructuredData id="growvest-nri-webpage-schema" data={pageSchema} />
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <ForNRIs />
      <PageContentExtensions pageKey="for-nris" />
    </>
  );
}
