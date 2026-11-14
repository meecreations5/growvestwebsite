import { PageContentExtensions } from "../../components/PageContentExtensions";
import { getSitePageMetadata, getSiteWebPageSchema } from "../../lib/server/sitePageSeo";
import TheGrowVestWay from "../../_views/TheGrowVestWay";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema } from "../../lib/seo";

export async function generateMetadata() {
  return getSitePageMetadata("/the-growvest-way");
}

export default async function Page() {
  const pageSchema = await getSiteWebPageSchema("/the-growvest-way", "WebPage");
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "The GrowVest Way", path: "/the-growvest-way" },
  ]);

  return (
    <>
      <StructuredData id="growvest-way-webpage-schema" data={pageSchema} />
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <TheGrowVestWay />
      <PageContentExtensions pageKey="the-growvest-way" />
    </>
  );
}
