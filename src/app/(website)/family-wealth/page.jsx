import FamilyWealth from "../../_views/FamilyWealth";
import { StructuredData } from "../../components/StructuredData";
import { SEO_PAGES, createBreadcrumbSchema, createPageMetadata, createWebPageSchema } from "../../lib/seo";

export const metadata = createPageMetadata("/family-wealth");

export default function Page() {
  const pageSchema = createWebPageSchema({
    path: "/family-wealth",
    name: SEO_PAGES["/family-wealth"].title,
    description: SEO_PAGES["/family-wealth"].description,
    type: "WebPage",
  });
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Family Wealth Planning", path: "/family-wealth" },
  ]);

  return (
    <>
      <StructuredData id="growvest-family-wealth-webpage-schema" data={pageSchema} />
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <FamilyWealth />
    </>
  );
}
