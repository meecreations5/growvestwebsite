import Insights from "../_views/Insights";
import { StructuredData } from "../components/StructuredData";
import { createBreadcrumbSchema, createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata("/insights");

export default function Page() {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Wealth Insights", path: "/insights" },
  ]);

  return (
    <>
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <Insights />
    </>
  );
}
