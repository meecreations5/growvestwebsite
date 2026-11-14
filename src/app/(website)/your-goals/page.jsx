import { PageContentExtensions } from "../../components/PageContentExtensions";
import { getSitePageMetadata, getSiteWebPageSchema } from "../../lib/server/sitePageSeo";
import YourGoals from "../../_views/YourGoals";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema } from "../../lib/seo";

export async function generateMetadata() {
  return getSitePageMetadata("/your-goals");
}

export default async function Page() {
  const pageSchema = await getSiteWebPageSchema("/your-goals", "WebPage");
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Your Goals", path: "/your-goals" },
  ]);

  return (
    <>
      <StructuredData id="growvest-your-goals-webpage-schema" data={pageSchema} />
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <YourGoals />
      <PageContentExtensions pageKey="your-goals" />
    </>
  );
}
