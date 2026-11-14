import { PageContentExtensions } from "../../components/PageContentExtensions";
import { getSitePageMetadata, getSiteWebPageSchema } from "../../lib/server/sitePageSeo";
import FamilyWealth from "../../_views/FamilyWealth";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema } from "../../lib/seo";

export async function generateMetadata() {
  return getSitePageMetadata("/family-wealth");
}

export default async function Page() {
  const pageSchema = await getSiteWebPageSchema("/family-wealth", "WebPage");
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Family Wealth Planning", path: "/family-wealth" },
  ]);

  return (
    <>
      <StructuredData id="growvest-family-wealth-webpage-schema" data={pageSchema} />
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <FamilyWealth />
      <PageContentExtensions pageKey="family-wealth" />
    </>
  );
}
