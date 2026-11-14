import { PageContentExtensions } from "../../components/PageContentExtensions";
import { getSitePageMetadata } from "../../lib/server/sitePageSeo";
import ClientStories from "../../_views/ClientStories";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema } from "../../lib/seo";

export async function generateMetadata() {
  return getSitePageMetadata("/client-stories");
}

export default function Page() {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Illustrative Journeys", path: "/client-stories" },
  ]);

  return (
    <>
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <ClientStories />
      <PageContentExtensions pageKey="client-stories" />
    </>
  );
}
