import WealthGuidance from "../../_views/WealthGuidance";
import { StructuredData } from "../../components/StructuredData";
import { SEO_PAGES, createBreadcrumbSchema, createPageMetadata, createWebPageSchema } from "../../lib/seo";

export const metadata = createPageMetadata("/wealth-guidance");

export default function Page() {
  const pageSchema = createWebPageSchema({
    path: "/wealth-guidance",
    name: SEO_PAGES["/wealth-guidance"].title,
    description: SEO_PAGES["/wealth-guidance"].description,
    type: "WebPage",
  });
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Wealth Guidance", path: "/wealth-guidance" },
  ]);

  return (
    <>
      <StructuredData id="growvest-wealth-guidance-webpage-schema" data={pageSchema} />
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <WealthGuidance />
    </>
  );
}
