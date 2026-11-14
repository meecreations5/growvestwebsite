import { PageContentExtensions } from "../../components/PageContentExtensions";
import { getSitePageMetadata } from "../../lib/server/sitePageSeo";
import StartHere from "../../_views/StartHere";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema } from "../../lib/seo";

export async function generateMetadata() {
  return getSitePageMetadata("/start-here");
}

export default function Page() {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Start Here", path: "/start-here" },
  ]);

  return (
    <>
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <StartHere />
      <PageContentExtensions pageKey="start-here" />
    </>
  );
}
