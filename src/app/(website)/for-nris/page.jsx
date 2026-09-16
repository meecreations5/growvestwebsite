import ForNRIs from "../../_views/ForNRIs";
import { StructuredData } from "../../components/StructuredData";
import { SEO_PAGES, createBreadcrumbSchema, createPageMetadata, createWebPageSchema } from "../../lib/seo";

export const metadata = createPageMetadata("/for-nris");

export default function Page() {
  const pageSchema = createWebPageSchema({
    path: "/for-nris",
    name: SEO_PAGES["/for-nris"].title,
    description: SEO_PAGES["/for-nris"].description,
    type: "WebPage",
  });
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "NRI Financial Planning", path: "/for-nris" },
  ]);

  return (
    <>
      <StructuredData id="growvest-nri-webpage-schema" data={pageSchema} />
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <ForNRIs />
    </>
  );
}
