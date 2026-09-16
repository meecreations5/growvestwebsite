import YourGoals from "../../_views/YourGoals";
import { StructuredData } from "../../components/StructuredData";
import { SEO_PAGES, createBreadcrumbSchema, createPageMetadata, createWebPageSchema } from "../../lib/seo";

export const metadata = createPageMetadata("/your-goals");

export default function Page() {
  const pageSchema = createWebPageSchema({
    path: "/your-goals",
    name: SEO_PAGES["/your-goals"].title,
    description: SEO_PAGES["/your-goals"].description,
    type: "WebPage",
  });
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Your Goals", path: "/your-goals" },
  ]);

  return (
    <>
      <StructuredData id="growvest-your-goals-webpage-schema" data={pageSchema} />
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <YourGoals />
    </>
  );
}
