import WealthGuidance from "../../_views/WealthGuidance";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema, createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata("/wealth-guidance");

export default function Page() {
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Wealth Guidance", path: "/wealth-guidance" },
  ]);

  return (
    <>
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <WealthGuidance />
    </>
  );
}
