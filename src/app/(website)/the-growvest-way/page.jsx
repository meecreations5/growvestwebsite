import TheGrowVestWay from "../../_views/TheGrowVestWay";
import { StructuredData } from "../../components/StructuredData";
import { SEO_PAGES, createBreadcrumbSchema, createPageMetadata, createWebPageSchema } from "../../lib/seo";

export const metadata = createPageMetadata("/the-growvest-way");

export default function Page() {
  const pageSchema = createWebPageSchema({
    path: "/the-growvest-way",
    name: SEO_PAGES["/the-growvest-way"].title,
    description: SEO_PAGES["/the-growvest-way"].description,
    type: "WebPage",
  });
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "The GrowVest Way", path: "/the-growvest-way" },
  ]);

  return (
    <>
      <StructuredData id="growvest-way-webpage-schema" data={pageSchema} />
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <TheGrowVestWay />
    </>
  );
}
