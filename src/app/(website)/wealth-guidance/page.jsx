import { PageContentExtensions } from "../../components/PageContentExtensions";
import { getSitePageMetadata, getSiteWebPageSchema } from "../../lib/server/sitePageSeo";
import WealthGuidance from "../../_views/WealthGuidance";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema } from "../../lib/seo";

export async function generateMetadata() {
  return getSitePageMetadata("/wealth-guidance");
}

export default async function Page() {
  const pageSchema = await getSiteWebPageSchema("/wealth-guidance", "WebPage");
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Wealth Guidance", path: "/wealth-guidance" },
  ]);

  return (
    <>
      <StructuredData id="growvest-wealth-guidance-webpage-schema" data={pageSchema} />
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <WealthGuidance />
      <PageContentExtensions pageKey="wealth-guidance" />
    </>
  );
}
